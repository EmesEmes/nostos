"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { collectImagePaths } from "@/lib/editor-content";
import {
  collectFieldErrors,
  parseEditorContent,
} from "@/lib/content-validation";
import { removeUnusedFiles } from "@/lib/storage-cleanup";
import { isValidAudioPath, isValidImagePath } from "@/lib/storage-paths";
import { MAP_HEIGHT, MAP_WIDTH, provinceShapes } from "@/data/provinceShapes";
import { zones } from "@/data/cantonalStudy";

export type SiteFormState = {
  error: string | null;
  fieldErrors: Partial<Record<string, string>>;
};

const provinceIds = provinceShapes.map((province) => province.id) as [
  string,
  ...string[],
];
const zoneIds = zones.map((zone) => zone.id) as [string, ...string[]];

const emptyToNull = (value: unknown) =>
  value === "" || value === undefined ? null : value;

const optionalText = (max: number) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? null : value,
    z.string().trim().max(max, `Máximo ${max} caracteres.`).nullable(),
  );

const optionalNumber = (min: number, max: number, integer = false) =>
  z.preprocess(
    (value) => {
      const cleaned = emptyToNull(value);
      return cleaned === null
        ? null
        : Number(String(cleaned).replace(",", "."));
    },
    (integer
      ? z
          .number({ error: "Debe ser un número." })
          .int("Debe ser un número entero.")
      : z.number({ error: "Debe ser un número." })
    )
      .min(min, `Debe estar entre ${min} y ${max}.`)
      .max(max, `Debe estar entre ${min} y ${max}.`)
      .nullable(),
  );

const siteSchema = z
  .object({
    name: z.string().trim().min(1, "El nombre es obligatorio.").max(200),
    kind: z.enum(["canton", "parroquia"], { error: "Selecciona el tipo." }),
    province_id: z.enum(provinceIds, { error: "Selecciona una provincia." }),
    slug: z
      .string()
      .trim()
      .min(1, "La dirección (slug) es obligatoria.")
      .max(120)
      .regex(
        /^[a-z0-9]+(-[a-z0-9]+)*$/,
        "Usa solo minúsculas, números y guiones.",
      ),
    sort_order: z.preprocess(
      (value) => (value === "" || value === undefined ? 0 : Number(value)),
      z.number({ error: "Debe ser un número." }).int().min(0).max(9999),
    ),
    map_x: optionalNumber(0, MAP_WIDTH),
    map_y: optionalNumber(0, MAP_HEIGHT),
    zone_id: z.preprocess(emptyToNull, z.enum(zoneIds).nullable()),
    annual_rate: optionalNumber(-100, 100),
    population_now: optionalNumber(0, 100_000_000, true),
    population_2050: optionalNumber(0, 100_000_000, true),
    change_pct: optionalNumber(-100, 1000),
    altitude: optionalText(100),
    distance_es: optionalText(200),
    distance_en: optionalText(200),
    tagline_es: optionalText(200),
    tagline_en: optionalText(200),
    summary_es: z.string().trim().max(1000, "Máximo 1000 caracteres."),
    summary_en: z.string().trim().max(1000, "Máximo 1000 caracteres."),
    audio_title_es: optionalText(200),
    audio_title_en: optionalText(200),
    cover_path: z.preprocess(
      emptyToNull,
      z
        .string()
        .refine((path) => path.startsWith("sites/") && isValidImagePath(path))
        .nullable(),
    ),
    audio_path: z.preprocess(
      emptyToNull,
      z.string().refine(isValidAudioPath).nullable(),
    ),
  })
  .refine((data) => (data.map_x === null) === (data.map_y === null), {
    path: ["map_x"],
    message: "Ubica el punto en el mapa o quítalo por completo.",
  });

const idSchema = z.uuid();

const FIELDS = [
  "name",
  "kind",
  "province_id",
  "slug",
  "sort_order",
  "map_x",
  "map_y",
  "zone_id",
  "annual_rate",
  "population_now",
  "population_2050",
  "change_pct",
  "altitude",
  "distance_es",
  "distance_en",
  "tagline_es",
  "tagline_en",
  "summary_es",
  "summary_en",
  "audio_title_es",
  "audio_title_en",
  "cover_path",
  "audio_path",
] as const;

function revalidateSites() {
  revalidatePath("/admin/lugares");
  revalidatePath("/", "layout");
}

const saveFailed: SiteFormState = {
  error: "No se pudo guardar. Intenta de nuevo.",
  fieldErrors: {},
};
const slugTaken: SiteFormState = {
  error: null,
  fieldErrors: { slug: "Ya existe un lugar con esa dirección." },
};

export async function saveSite(
  id: string | null,
  _prev: SiteFormState,
  formData: FormData,
): Promise<SiteFormState> {
  const { supabase } = await requireAdmin();

  if (id !== null && !idSchema.safeParse(id).success) {
    return { error: "Lugar no válido.", fieldErrors: {} };
  }

  const raw = Object.fromEntries(
    FIELDS.map((field) => [field, formData.get(field) ?? ""]),
  );
  const parsed = siteSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: "Revisa los campos marcados.",
      fieldErrors: collectFieldErrors(parsed.error.issues),
    };
  }

  const contentEs = parseEditorContent(formData.get("content_es"));
  const contentEn = parseEditorContent(formData.get("content_en"));
  if (contentEs === undefined || contentEn === undefined) {
    return { error: "El contenido del texto no es válido.", fieldErrors: {} };
  }

  const province = provinceShapes.find(
    (item) => item.id === parsed.data.province_id,
  )!;
  const values = {
    ...parsed.data,
    province: province.name,
    content_es: contentEs,
    content_en: contentEn,
    published: formData.get("published") === "on",
  };

  if (id === null) {
    const { data, error } = await supabase
      .from("study_sites")
      .insert(values)
      .select("id")
      .single();
    if (error) return error.code === "23505" ? slugTaken : saveFailed;
    revalidateSites();
    redirect(`/admin/lugares/${data.id}?creado=1`);
  } else {
    const { data: current } = await supabase
      .from("study_sites")
      .select("content_es, content_en, cover_path, audio_path")
      .eq("id", id)
      .maybeSingle();

    if (!current) return { error: "El lugar ya no existe.", fieldErrors: {} };

    const { error } = await supabase
      .from("study_sites")
      .update(values)
      .eq("id", id);
    if (error) return error.code === "23505" ? slugTaken : saveFailed;

    const kept = collectImagePaths(contentEs, contentEn);
    const candidates = [
      ...collectImagePaths(current.content_es, current.content_en),
    ].filter((path) => !kept.has(path));
    if (current.cover_path && current.cover_path !== values.cover_path)
      candidates.push(current.cover_path);
    if (current.audio_path && current.audio_path !== values.audio_path)
      candidates.push(current.audio_path);
    await removeUnusedFiles(supabase, candidates);
  }

  revalidateSites();
  redirect("/admin/lugares?guardado=1");
}

export async function deleteSite(id: string) {
  const { supabase } = await requireAdmin();
  if (!idSchema.safeParse(id).success) return { error: "Lugar no válido." };

  const { data: site } = await supabase
    .from("study_sites")
    .select(
      "content_es, content_en, cover_path, audio_path, site_images(path), testimonies(photo_path, audio_path)",
    )
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("study_sites").delete().eq("id", id);
  if (error) return { error: "No se pudo eliminar. Intenta de nuevo." };

  if (site) {
    const candidates = [...collectImagePaths(site.content_es, site.content_en)];
    for (const path of [site.cover_path, site.audio_path])
      if (path) candidates.push(path);
    for (const image of site.site_images) candidates.push(image.path);
    for (const testimony of site.testimonies) {
      if (testimony.photo_path) candidates.push(testimony.photo_path);
      if (testimony.audio_path) candidates.push(testimony.audio_path);
    }
    await removeUnusedFiles(supabase, candidates);
  }

  revalidateSites();
  redirect("/admin/lugares?eliminado=1");
}

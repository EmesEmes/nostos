"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { collectFieldErrors } from "@/lib/content-validation";
import { removeUnusedFiles } from "@/lib/storage-cleanup";
import { isValidAudioPath, isValidImagePath } from "@/lib/storage-paths";

export type TestimonyResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors: Partial<Record<string, string>> };

const idSchema = z.uuid();

const emptyToNull = (value: unknown) =>
  value === undefined || (typeof value === "string" && value.trim() === "")
    ? null
    : value;

const optionalText = (max: number) =>
  z.preprocess(
    emptyToNull,
    z.string().trim().max(max, `Máximo ${max} caracteres.`).nullable(),
  );

const testimonySchema = z.object({
  person_name: z.string().trim().min(1, "El nombre es obligatorio.").max(150),
  person_detail_es: optionalText(200),
  person_detail_en: optionalText(200),
  quote_es: z
    .string()
    .trim()
    .min(1, "El testimonio en español es obligatorio.")
    .max(3000, "Máximo 3000 caracteres."),
  quote_en: z.string().trim().max(3000, "Máximo 3000 caracteres."),
  photo_path: z.preprocess(
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
});

const failure = (
  error: string,
  fieldErrors: Partial<Record<string, string>> = {},
): TestimonyResult => ({
  ok: false,
  error,
  fieldErrors,
});

function revalidateTestimonies(siteId: string) {
  revalidatePath(`/admin/lugares/${siteId}`);
  revalidatePath("/", "layout");
}

export async function saveTestimony(
  siteId: string,
  testimonyId: string | null,
  formData: FormData,
): Promise<TestimonyResult> {
  const { supabase } = await requireAdmin();

  if (
    !idSchema.safeParse(siteId).success ||
    (testimonyId !== null && !idSchema.safeParse(testimonyId).success)
  ) {
    return failure("Testimonio no válido.");
  }

  const parsed = testimonySchema.safeParse({
    person_name: formData.get("person_name") ?? "",
    person_detail_es: formData.get("person_detail_es") ?? "",
    person_detail_en: formData.get("person_detail_en") ?? "",
    quote_es: formData.get("quote_es") ?? "",
    quote_en: formData.get("quote_en") ?? "",
    photo_path: formData.get("photo_path") ?? "",
    audio_path: formData.get("audio_path") ?? "",
  });
  if (!parsed.success)
    return failure(
      "Revisa los campos marcados.",
      collectFieldErrors(parsed.error.issues),
    );

  const values = {
    ...parsed.data,
    published: formData.get("published") === "on",
  };

  if (testimonyId === null) {
    const { data: last } = await supabase
      .from("testimonies")
      .select("sort_order")
      .eq("site_id", siteId)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { error } = await supabase
      .from("testimonies")
      .insert({
        ...values,
        site_id: siteId,
        sort_order: (last?.sort_order ?? -1) + 1,
      });
    if (error) return failure("No se pudo guardar. Intenta de nuevo.");
  } else {
    const { data: current } = await supabase
      .from("testimonies")
      .select("photo_path, audio_path")
      .eq("id", testimonyId)
      .eq("site_id", siteId)
      .maybeSingle();
    if (!current) return failure("El testimonio ya no existe.");

    const { error } = await supabase
      .from("testimonies")
      .update(values)
      .eq("id", testimonyId);
    if (error) return failure("No se pudo guardar. Intenta de nuevo.");

    const replaced = [current.photo_path, current.audio_path].filter(
      (path): path is string =>
        path !== null &&
        path !== values.photo_path &&
        path !== values.audio_path,
    );
    await removeUnusedFiles(supabase, replaced);
  }

  revalidateTestimonies(siteId);
  return { ok: true };
}

export async function moveTestimony(
  testimonyId: string,
  direction: "up" | "down",
): Promise<TestimonyResult> {
  const { supabase } = await requireAdmin();
  if (
    !idSchema.safeParse(testimonyId).success ||
    (direction !== "up" && direction !== "down")
  ) {
    return failure("Movimiento no válido.");
  }

  const { data: testimony } = await supabase
    .from("testimonies")
    .select("site_id")
    .eq("id", testimonyId)
    .maybeSingle();
  if (!testimony) return failure("El testimonio ya no existe.");

  const { data: rows } = await supabase
    .from("testimonies")
    .select("id")
    .eq("site_id", testimony.site_id)
    .order("sort_order")
    .order("created_at");
  if (!rows) return failure("No se pudo reordenar. Intenta de nuevo.");

  const ids = rows.map((row) => row.id);
  const from = ids.indexOf(testimonyId);
  const to = direction === "up" ? from - 1 : from + 1;
  if (to < 0 || to >= ids.length) return { ok: true };

  [ids[from], ids[to]] = [ids[to], ids[from]];
  const results = await Promise.all(
    ids.map((id, index) =>
      supabase.from("testimonies").update({ sort_order: index }).eq("id", id),
    ),
  );
  if (results.some((result) => result.error))
    return failure("No se pudo reordenar. Intenta de nuevo.");

  revalidateTestimonies(testimony.site_id);
  return { ok: true };
}

export async function deleteTestimony(
  testimonyId: string,
): Promise<TestimonyResult> {
  const { supabase } = await requireAdmin();
  if (!idSchema.safeParse(testimonyId).success)
    return failure("Testimonio no válido.");

  const { data, error } = await supabase
    .from("testimonies")
    .delete()
    .eq("id", testimonyId)
    .select("site_id, photo_path, audio_path")
    .maybeSingle();

  if (error) return failure("No se pudo eliminar. Intenta de nuevo.");
  if (data) {
    await removeUnusedFiles(
      supabase,
      [data.photo_path, data.audio_path].filter(
        (path): path is string => path !== null,
      ),
    );
    revalidateTestimonies(data.site_id);
  }
  return { ok: true };
}

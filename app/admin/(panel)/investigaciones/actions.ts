"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { collectImagePaths, stripImageUrls } from "@/lib/editor-content";
import type { Json } from "@/lib/supabase/database.types";

export type InvestigationFormState = {
  error: string | null;
  fieldErrors: Partial<Record<string, string>>;
};

const MAX_CONTENT_LENGTH = 1_000_000;

const fieldsSchema = z.object({
  title_es: z
    .string()
    .trim()
    .min(1, "El título en español es obligatorio.")
    .max(200),
  title_en: z.string().trim().max(200),
  slug: z
    .string()
    .trim()
    .min(1, "La dirección (slug) es obligatoria.")
    .max(120)
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Usa solo minúsculas, números y guiones.",
    ),
  summary_es: z.string().trim().max(1000, "Máximo 1000 caracteres."),
  summary_en: z.string().trim().max(1000, "Máximo 1000 caracteres."),
  author_id: z.uuid("Selecciona un autor."),
});

const docSchema = z.looseObject({
  type: z.literal("doc"),
  content: z.array(z.unknown()).optional(),
});

const idSchema = z.uuid();

function parseContent(raw: FormDataEntryValue | null): Json | null | undefined {
  if (typeof raw !== "string" || raw === "") return null;
  if (raw.length > MAX_CONTENT_LENGTH) return undefined;
  try {
    const parsed = docSchema.safeParse(JSON.parse(raw));
    return parsed.success ? stripImageUrls(parsed.data as Json) : undefined;
  } catch {
    return undefined;
  }
}

type AdminClient = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

async function removeUnusedImages(
  supabase: AdminClient,
  candidates: Set<string>,
) {
  if (candidates.size === 0) return;

  const { data: all } = await supabase
    .from("investigations")
    .select("content_es, content_en");
  if (!all) return;

  const inUse = collectImagePaths(
    ...all.flatMap((row) => [row.content_es, row.content_en]),
  );
  const unused = [...candidates].filter((path) => !inUse.has(path));
  if (unused.length > 0) await supabase.storage.from("media").remove(unused);
}

function revalidateInvestigation(...slugs: string[]) {
  revalidatePath("/admin/investigaciones");
  revalidatePath("/investigaciones");
  for (const slug of new Set(slugs)) revalidatePath(`/investigaciones/${slug}`);
}

const slugTaken: InvestigationFormState = {
  error: null,
  fieldErrors: { slug: "Ya existe una investigación con esa dirección." },
};
const saveFailed: InvestigationFormState = {
  error: "No se pudo guardar. Intenta de nuevo.",
  fieldErrors: {},
};

export async function saveInvestigation(
  id: string | null,
  _prev: InvestigationFormState,
  formData: FormData,
): Promise<InvestigationFormState> {
  const { supabase } = await requireAdmin();

  if (id !== null && !idSchema.safeParse(id).success) {
    return { error: "Investigación no válida.", fieldErrors: {} };
  }

  const parsed = fieldsSchema.safeParse({
    title_es: formData.get("title_es") ?? "",
    title_en: formData.get("title_en") ?? "",
    slug: formData.get("slug") ?? "",
    summary_es: formData.get("summary_es") ?? "",
    summary_en: formData.get("summary_en") ?? "",
    author_id: formData.get("author_id") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: Partial<Record<string, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      fieldErrors[key] ??= issue.message;
    }
    return { error: "Revisa los campos marcados.", fieldErrors };
  }

  const contentEs = parseContent(formData.get("content_es"));
  const contentEn = parseContent(formData.get("content_en"));
  if (contentEs === undefined || contentEn === undefined) {
    return { error: "El contenido del texto no es válido.", fieldErrors: {} };
  }

  const published = formData.get("published") === "on";
  const values = {
    ...parsed.data,
    content_es: contentEs,
    content_en: contentEn,
    published,
  };
  const slugs = [values.slug];

  if (id === null) {
    const { error } = await supabase
      .from("investigations")
      .insert({
        ...values,
        published_at: published ? new Date().toISOString() : null,
      });

    if (error) return error.code === "23505" ? slugTaken : saveFailed;
  } else {
    const { data: current } = await supabase
      .from("investigations")
      .select("slug, published_at, content_es, content_en")
      .eq("id", id)
      .maybeSingle();

    if (!current)
      return { error: "La investigación ya no existe.", fieldErrors: {} };

    const { error } = await supabase
      .from("investigations")
      .update({
        ...values,
        published_at:
          published && !current.published_at
            ? new Date().toISOString()
            : current.published_at,
      })
      .eq("id", id);

    if (error) return error.code === "23505" ? slugTaken : saveFailed;
    slugs.push(current.slug);

    const kept = collectImagePaths(contentEs, contentEn);
    const removed = [
      ...collectImagePaths(current.content_es, current.content_en),
    ].filter((path) => !kept.has(path));
    await removeUnusedImages(supabase, new Set(removed));
  }

  revalidateInvestigation(...slugs);
  redirect("/admin/investigaciones?guardada=1");
}

export async function deleteInvestigation(id: string) {
  const { supabase } = await requireAdmin();
  if (!idSchema.safeParse(id).success)
    return { error: "Investigación no válida." };

  const { data, error } = await supabase
    .from("investigations")
    .delete()
    .eq("id", id)
    .select("slug, content_es, content_en")
    .maybeSingle();

  if (error) return { error: "No se pudo eliminar. Intenta de nuevo." };
  if (data) {
    await removeUnusedImages(
      supabase,
      collectImagePaths(data.content_es, data.content_en),
    );
    revalidateInvestigation(data.slug);
  }
  redirect("/admin/investigaciones?eliminada=1");
}

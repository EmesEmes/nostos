"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { removeUnusedFiles } from "@/lib/storage-cleanup";
import { isValidImagePath } from "@/lib/storage-paths";

type Result = { error: string } | { ok: true };

const idSchema = z.uuid();
const MAX_IMAGES_PER_UPLOAD = 20;

const optionalText = (max: number) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? null : value,
    z.string().trim().max(max, `Máximo ${max} caracteres.`).nullable(),
  );

const detailsSchema = z.object({
  alt_es: z.string().trim().max(300, "Máximo 300 caracteres."),
  alt_en: z.string().trim().max(300, "Máximo 300 caracteres."),
  caption_es: optionalText(500),
  caption_en: optionalText(500),
});

function revalidateGallery(siteId: string) {
  revalidatePath(`/admin/lugares/${siteId}`);
  revalidatePath("/", "layout");
}

export async function addSiteImages(
  siteId: string,
  paths: string[],
): Promise<Result> {
  const { supabase } = await requireAdmin();

  if (!idSchema.safeParse(siteId).success) return { error: "Lugar no válido." };
  if (
    !Array.isArray(paths) ||
    paths.length === 0 ||
    paths.length > MAX_IMAGES_PER_UPLOAD ||
    !paths.every((path) => isValidImagePath(path) && path.startsWith("sites/"))
  ) {
    return { error: "Las imágenes no son válidas." };
  }

  const { data: last } = await supabase
    .from("site_images")
    .select("sort_order")
    .eq("site_id", siteId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const start = (last?.sort_order ?? -1) + 1;
  const { error } = await supabase
    .from("site_images")
    .insert(
      paths.map((path, index) => ({
        site_id: siteId,
        path,
        sort_order: start + index,
      })),
    );

  if (error) {
    await removeUnusedFiles(supabase, paths);
    return { error: "No se pudieron guardar las imágenes. Intenta de nuevo." };
  }

  revalidateGallery(siteId);
  return { ok: true };
}

export async function updateSiteImage(
  imageId: string,
  formData: FormData,
): Promise<Result> {
  const { supabase } = await requireAdmin();
  if (!idSchema.safeParse(imageId).success)
    return { error: "Imagen no válida." };

  const parsed = detailsSchema.safeParse({
    alt_es: formData.get("alt_es") ?? "",
    alt_en: formData.get("alt_en") ?? "",
    caption_es: formData.get("caption_es") ?? "",
    caption_en: formData.get("caption_en") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { data, error } = await supabase
    .from("site_images")
    .update(parsed.data)
    .eq("id", imageId)
    .select("site_id")
    .maybeSingle();

  if (error || !data) return { error: "No se pudo guardar. Intenta de nuevo." };

  revalidateGallery(data.site_id);
  return { ok: true };
}

export async function moveSiteImage(
  imageId: string,
  direction: "up" | "down",
): Promise<Result> {
  const { supabase } = await requireAdmin();
  if (
    !idSchema.safeParse(imageId).success ||
    (direction !== "up" && direction !== "down")
  ) {
    return { error: "Movimiento no válido." };
  }

  const { data: image } = await supabase
    .from("site_images")
    .select("site_id")
    .eq("id", imageId)
    .maybeSingle();
  if (!image) return { error: "La imagen ya no existe." };

  const { data: images } = await supabase
    .from("site_images")
    .select("id")
    .eq("site_id", image.site_id)
    .order("sort_order")
    .order("created_at");
  if (!images) return { error: "No se pudo reordenar. Intenta de nuevo." };

  const ids = images.map((row) => row.id);
  const from = ids.indexOf(imageId);
  const to = direction === "up" ? from - 1 : from + 1;
  if (to < 0 || to >= ids.length) return { ok: true };

  [ids[from], ids[to]] = [ids[to], ids[from]];
  const results = await Promise.all(
    ids.map((id, index) =>
      supabase.from("site_images").update({ sort_order: index }).eq("id", id),
    ),
  );
  if (results.some((result) => result.error))
    return { error: "No se pudo reordenar. Intenta de nuevo." };

  revalidateGallery(image.site_id);
  return { ok: true };
}

export async function deleteSiteImage(imageId: string): Promise<Result> {
  const { supabase } = await requireAdmin();
  if (!idSchema.safeParse(imageId).success)
    return { error: "Imagen no válida." };

  const { data, error } = await supabase
    .from("site_images")
    .delete()
    .eq("id", imageId)
    .select("site_id, path")
    .maybeSingle();

  if (error) return { error: "No se pudo eliminar. Intenta de nuevo." };
  if (data) {
    await removeUnusedFiles(supabase, [data.path]);
    revalidateGallery(data.site_id);
  }
  return { ok: true };
}

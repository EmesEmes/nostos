import { createClient } from "@/lib/supabase/client";
import { INVESTIGATION_IMAGE_PREFIX } from "@/lib/editor-content";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_ORIGINAL_SIZE = 20 * 1024 * 1024;
const MAX_DIMENSION = 2000;

export const ACCEPTED_IMAGE_TYPES = ACCEPTED_TYPES.join(",");

async function toWebp(file: File): Promise<Blob | null> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(
      1,
      MAX_DIMENSION / Math.max(bitmap.width, bitmap.height),
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas
      .getContext("2d")
      ?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    return await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.85),
    );
  } catch {
    return null;
  }
}

export async function uploadInvestigationImage(file: File) {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error("Formato no permitido. Usa JPG, PNG, WebP o AVIF.");
  }
  if (file.size > MAX_ORIGINAL_SIZE) {
    throw new Error("La imagen pesa más de 20 MB.");
  }

  const webp = await toWebp(file);
  const body = webp ?? file;
  const extension = webp
    ? "webp"
    : file.type === "image/jpeg"
      ? "jpg"
      : file.type.split("/")[1];
  const path = `${INVESTIGATION_IMAGE_PREFIX}${crypto.randomUUID()}.${extension}`;

  const supabase = createClient();
  const { error } = await supabase.storage.from("media").upload(path, body, {
    cacheControl: "31536000",
    contentType: webp ? "image/webp" : file.type,
    upsert: false,
  });

  if (error) throw new Error("No se pudo subir la imagen. Intenta de nuevo.");

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return { path, url: data.publicUrl };
}

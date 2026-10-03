import { createClient } from "@/lib/supabase/client";
import type { ImageFolder } from "@/lib/storage-paths";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const AUDIO_TYPES: Record<string, string> = {
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/x-m4a": "m4a",
  "audio/aac": "aac",
  "audio/ogg": "ogg",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
};
const MAX_IMAGE_SIZE = 20 * 1024 * 1024;
const MAX_AUDIO_SIZE = 50 * 1024 * 1024;
const MAX_DIMENSION = 2000;

export const ACCEPTED_IMAGE_TYPES = IMAGE_TYPES.join(",");
export const ACCEPTED_AUDIO_TYPES = Object.keys(AUDIO_TYPES).join(",");

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

async function upload(path: string, body: Blob, contentType: string) {
  const supabase = createClient();
  const { error } = await supabase.storage.from("media").upload(path, body, {
    cacheControl: "31536000",
    contentType,
    upsert: false,
  });
  if (error) throw new Error("No se pudo subir el archivo. Intenta de nuevo.");
  return {
    path,
    url: supabase.storage.from("media").getPublicUrl(path).data.publicUrl,
  };
}

export async function uploadImage(file: File, folder: ImageFolder) {
  if (!IMAGE_TYPES.includes(file.type)) {
    throw new Error("Formato no permitido. Usa JPG, PNG, WebP o AVIF.");
  }
  if (file.size > MAX_IMAGE_SIZE)
    throw new Error("La imagen pesa más de 20 MB.");

  const webp = await toWebp(file);
  if (webp)
    return upload(`${folder}/${crypto.randomUUID()}.webp`, webp, "image/webp");

  const extension =
    file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
  return upload(
    `${folder}/${crypto.randomUUID()}.${extension}`,
    file,
    file.type,
  );
}

export async function uploadAudio(file: File) {
  const extension = AUDIO_TYPES[file.type];
  if (!extension)
    throw new Error("Formato no permitido. Usa MP3, M4A, AAC, OGG o WAV.");
  if (file.size > MAX_AUDIO_SIZE) {
    throw new Error(
      "El audio pesa más de 50 MB. Expórtalo en MP3 a 96 kbps para reducirlo.",
    );
  }
  return upload(
    `sites/audio/${crypto.randomUUID()}.${extension}`,
    file,
    file.type,
  );
}

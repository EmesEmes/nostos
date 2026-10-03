const UUID = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";

export type ImageFolder = "investigations" | "sites";

const IMAGE_PATH_PATTERN = new RegExp(
  `^(investigations|sites)/${UUID}\\.(jpg|png|webp|avif)$`,
);
const AUDIO_PATH_PATTERN = new RegExp(
  `^sites/audio/${UUID}\\.(mp3|m4a|aac|ogg|wav)$`,
);

export function isValidImagePath(path: unknown): path is string {
  return typeof path === "string" && IMAGE_PATH_PATTERN.test(path);
}

export function isValidAudioPath(path: unknown): path is string {
  return typeof path === "string" && AUDIO_PATH_PATTERN.test(path);
}

export function storageUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${path}`;
}

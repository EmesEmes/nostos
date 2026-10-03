import "server-only";
import type { requireAdmin } from "@/lib/auth";
import { collectImagePaths } from "@/lib/editor-content";

type AdminClient = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

async function referencedPaths(supabase: AdminClient) {
  const [investigations, sites, images, testimonies] = await Promise.all([
    supabase.from("investigations").select("content_es, content_en"),
    supabase
      .from("study_sites")
      .select("content_es, content_en, cover_path, audio_path"),
    supabase.from("site_images").select("path"),
    supabase.from("testimonies").select("photo_path, audio_path"),
  ]);

  if (investigations.error || sites.error || images.error || testimonies.error)
    return null;

  const paths = collectImagePaths(
    ...investigations.data.flatMap((row) => [row.content_es, row.content_en]),
    ...sites.data.flatMap((row) => [row.content_es, row.content_en]),
  );
  for (const row of sites.data) {
    if (row.cover_path) paths.add(row.cover_path);
    if (row.audio_path) paths.add(row.audio_path);
  }
  for (const row of images.data) paths.add(row.path);
  for (const row of testimonies.data) {
    if (row.photo_path) paths.add(row.photo_path);
    if (row.audio_path) paths.add(row.audio_path);
  }
  return paths;
}

export async function removeUnusedFiles(
  supabase: AdminClient,
  candidates: Iterable<string>,
) {
  const unique = new Set(candidates);
  if (unique.size === 0) return;

  const inUse = await referencedPaths(supabase);
  if (!inUse) return;

  const unused = [...unique].filter((path) => !inUse.has(path));
  if (unused.length > 0) await supabase.storage.from("media").remove(unused);
}

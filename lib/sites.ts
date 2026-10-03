import "server-only";
import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";

export const getPublishedSites = cache(async () => {
  const { data, error } = await createPublicClient()
    .from("study_sites")
    .select(
      "slug, name, kind, province, tagline_es, tagline_en, summary_es, summary_en, cover_path",
    )
    .eq("published", true)
    .order("sort_order")
    .order("name");

  if (error) throw error;
  return data;
});

export const getPublishedSite = cache(async (slug: string) => {
  const { data, error } = await createPublicClient()
    .from("study_sites")
    .select(
      `slug, name, kind, province, annual_rate, population_now, population_2050, change_pct, altitude,
       distance_es, distance_en, tagline_es, tagline_en, summary_es, summary_en, content_es, content_en,
       cover_path, audio_path, audio_title_es, audio_title_en,
       site_images(id, path, alt_es, alt_en, caption_es, caption_en, sort_order),
       testimonies(id, person_name, person_detail_es, person_detail_en, quote_es, quote_en, photo_path, audio_path, sort_order)`,
    )
    .eq("slug", slug)
    .eq("published", true)
    .order("sort_order", { referencedTable: "site_images" })
    .order("sort_order", { referencedTable: "testimonies" })
    .maybeSingle();

  if (error) throw error;
  return data;
});

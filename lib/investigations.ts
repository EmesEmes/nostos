import "server-only";
import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";

export const getPublishedInvestigations = cache(async () => {
  const { data, error } = await createPublicClient()
    .from("investigations")
    .select(
      "slug, title_es, title_en, summary_es, summary_en, published_at, author:authors(name)",
    )
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) throw error;
  return data;
});

export const getPublishedInvestigation = cache(async (slug: string) => {
  const { data, error } = await createPublicClient()
    .from("investigations")
    .select(
      "slug, title_es, title_en, summary_es, summary_en, content_es, content_en, published_at, author:authors(name, affiliation, bio_es, bio_en)",
    )
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;
  return data;
});

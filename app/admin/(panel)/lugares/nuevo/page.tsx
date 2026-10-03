import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { SiteForm } from "@/components/admin/SiteForm";

export const metadata: Metadata = { title: "Nuevo lugar" };

export default async function NewSitePage() {
  await requireAdmin();

  return (
    <>
      <Link
        href="/admin/lugares"
        className="font-sans text-xs text-ink-soft hover:text-moss-dark"
      >
        ← Lugares de estudio
      </Link>
      <h1 className="mt-2 mb-10 font-serif text-3xl font-light text-ink">
        Nuevo lugar
      </h1>
      <SiteForm
        initial={{
          id: null,
          name: "",
          kind: "parroquia",
          province_id: "",
          slug: "",
          sort_order: 0,
          published: false,
          map_x: null,
          map_y: null,
          zone_id: null,
          annual_rate: null,
          population_now: null,
          population_2050: null,
          change_pct: null,
          altitude: null,
          distance_es: null,
          distance_en: null,
          tagline_es: null,
          tagline_en: null,
          summary_es: "",
          summary_en: "",
          content_es: null,
          content_en: null,
          audio_title_es: null,
          audio_title_en: null,
          cover_path: null,
          audio_path: null,
        }}
      />
    </>
  );
}

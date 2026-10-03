import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { JSONContent } from "@tiptap/react";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { withImageUrls } from "@/lib/editor-content";
import { SiteForm } from "@/components/admin/SiteForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteSite } from "@/app/admin/(panel)/lugares/actions";

export const metadata: Metadata = { title: "Editar lugar" };

export default async function EditSitePage({
  params,
}: PageProps<"/admin/lugares/[id]">) {
  const { supabase } = await requireAdmin();
  const { id } = await params;

  if (!z.uuid().safeParse(id).success) notFound();

  const { data: site } = await supabase
    .from("study_sites")
    .select(
      "id, name, kind, province_id, slug, sort_order, published, map_x, map_y, zone_id, annual_rate, population_now, population_2050, change_pct, altitude, distance_es, distance_en, tagline_es, tagline_en, summary_es, summary_en, content_es, content_en, audio_title_es, audio_title_en, cover_path, audio_path",
    )
    .eq("id", id)
    .maybeSingle();

  if (!site) notFound();

  return (
    <>
      <Link
        href="/admin/lugares"
        className="font-sans text-xs text-ink-soft hover:text-moss-dark"
      >
        ← Lugares de estudio
      </Link>
      <div className="mt-2 mb-10 flex flex-wrap items-start justify-between gap-4">
        <h1 className="font-serif text-3xl font-light text-ink">{site.name}</h1>
        <DeleteButton
          action={deleteSite.bind(null, site.id)}
          confirmMessage={`¿Eliminar "${site.name}"? También se borrarán su galería y sus testimonios. Esta acción no se puede deshacer.`}
        />
      </div>
      <SiteForm
        key={site.id}
        initial={{
          ...site,
          kind: site.kind === "canton" ? "canton" : "parroquia",
          content_es: withImageUrls(site.content_es) as JSONContent | null,
          content_en: withImageUrls(site.content_en) as JSONContent | null,
        }}
      />
    </>
  );
}

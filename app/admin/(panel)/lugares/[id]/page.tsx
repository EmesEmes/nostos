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
import { SiteGallery } from "@/components/admin/SiteGallery";
import { SiteTestimonies } from "@/components/admin/SiteTestimonies";
import { Notice } from "@/components/admin/Notice";

export const metadata: Metadata = { title: "Editar lugar" };

export default async function EditSitePage({
  params,
  searchParams,
}: PageProps<"/admin/lugares/[id]">) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  const { creado } = await searchParams;

  if (!z.uuid().safeParse(id).success) notFound();

  const [{ data: site }, { data: images }, { data: testimonies }] =
    await Promise.all([
      supabase
        .from("study_sites")
        .select(
          "id, name, kind, province_id, slug, sort_order, published, map_x, map_y, zone_id, annual_rate, population_now, population_2050, change_pct, altitude, distance_es, distance_en, tagline_es, tagline_en, summary_es, summary_en, content_es, content_en, audio_title_es, audio_title_en, cover_path, audio_path",
        )
        .eq("id", id)
        .maybeSingle(),
      supabase
        .from("site_images")
        .select("id, path, alt_es, alt_en, caption_es, caption_en")
        .eq("site_id", id)
        .order("sort_order")
        .order("created_at"),
      supabase
        .from("testimonies")
        .select(
          "id, person_name, person_detail_es, person_detail_en, quote_es, quote_en, photo_path, audio_path, published",
        )
        .eq("site_id", id)
        .order("sort_order")
        .order("created_at"),
    ]);

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
      {creado === "1" && (
        <div className="-mt-6 mb-10">
          <Notice>
            Lugar creado. Ya puedes agregar fotos a la galería, al final de esta
            página.
          </Notice>
        </div>
      )}
      <SiteForm
        key={site.id}
        initial={{
          ...site,
          kind: site.kind === "canton" ? "canton" : "parroquia",
          content_es: withImageUrls(site.content_es) as JSONContent | null,
          content_en: withImageUrls(site.content_en) as JSONContent | null,
        }}
      />

      <div className="mt-16 border-t border-hairline pt-10">
        <h2 className="mb-2 font-serif text-2xl font-light text-ink">
          Galería
        </h2>
        <p className="mb-6 font-sans text-sm text-ink-soft">
          Las fotos se guardan al subirlas. La descripción se lee para personas
          con discapacidad visual; el pie de foto se muestra debajo de la
          imagen.
        </p>
        <SiteGallery siteId={site.id} images={images ?? []} />
      </div>

      <div className="mt-16 border-t border-hairline pt-10">
        <h2 className="mb-2 font-serif text-2xl font-light text-ink">
          Testimonios
        </h2>
        <p className="mb-6 font-sans text-sm text-ink-soft">
          Cada testimonio se guarda por separado. Haz clic en uno para editarlo.
        </p>
        <SiteTestimonies siteId={site.id} testimonies={testimonies ?? []} />
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { JSONContent } from "@tiptap/react";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { withImageUrls } from "@/lib/editor-content";
import { InvestigationForm } from "@/components/admin/InvestigationForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteInvestigation } from "@/app/admin/(panel)/investigaciones/actions";

export const metadata: Metadata = { title: "Editar investigación" };

export default async function EditInvestigationPage({
  params,
}: PageProps<"/admin/investigaciones/[id]">) {
  const { supabase } = await requireAdmin();
  const { id } = await params;

  if (!z.uuid().safeParse(id).success) notFound();

  const [{ data: investigation }, { data: authors }] = await Promise.all([
    supabase
      .from("investigations")
      .select(
        "id, slug, title_es, title_en, summary_es, summary_en, content_es, content_en, published, author_id",
      )
      .eq("id", id)
      .maybeSingle(),
    supabase.from("authors").select("id, name").order("name"),
  ]);

  if (!investigation) notFound();

  return (
    <>
      <Link
        href="/admin/investigaciones"
        className="font-sans text-xs text-ink-soft hover:text-moss-dark"
      >
        ← Investigaciones
      </Link>
      <div className="mt-2 mb-10 flex flex-wrap items-start justify-between gap-4">
        <h1 className="font-serif text-3xl font-light text-ink">
          Editar investigación
        </h1>
        <DeleteButton
          action={deleteInvestigation.bind(null, investigation.id)}
          confirmMessage={`¿Eliminar "${investigation.title_es}"? Esta acción no se puede deshacer.`}
        />
      </div>
      <InvestigationForm
        key={investigation.id}
        authors={authors ?? []}
        initial={{
          ...investigation,
          content_es: withImageUrls(
            investigation.content_es,
          ) as JSONContent | null,
          content_en: withImageUrls(
            investigation.content_en,
          ) as JSONContent | null,
        }}
      />
    </>
  );
}

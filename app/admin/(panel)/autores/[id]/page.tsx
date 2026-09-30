import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { AuthorForm } from "@/components/admin/AuthorForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteAuthor } from "@/app/admin/(panel)/autores/actions";

export const metadata: Metadata = { title: "Editar autor" };

export default async function EditAuthorPage({
  params,
}: PageProps<"/admin/autores/[id]">) {
  const { supabase } = await requireAdmin();
  const { id } = await params;

  if (!z.uuid().safeParse(id).success) notFound();

  const { data: author } = await supabase
    .from("authors")
    .select("id, name, affiliation, bio_es, bio_en")
    .eq("id", id)
    .maybeSingle();

  if (!author) notFound();

  return (
    <>
      <Link
        href="/admin/autores"
        className="font-sans text-xs text-ink-soft hover:text-moss-dark"
      >
        ← Autores
      </Link>
      <div className="mt-2 mb-10 flex flex-wrap items-start justify-between gap-4">
        <h1 className="font-serif text-3xl font-light text-ink">
          Editar autor
        </h1>
        <DeleteButton
          action={deleteAuthor.bind(null, author.id)}
          confirmMessage={`¿Eliminar a "${author.name}"? Esta acción no se puede deshacer.`}
        />
      </div>
      <AuthorForm key={author.id} initial={author} />
    </>
  );
}

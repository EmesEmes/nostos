import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { AuthorForm } from "@/components/admin/AuthorForm";

export const metadata: Metadata = { title: "Nuevo autor" };

export default async function NewAuthorPage() {
  await requireAdmin();

  return (
    <>
      <Link
        href="/admin/autores"
        className="font-sans text-xs text-ink-soft hover:text-moss-dark"
      >
        ← Autores
      </Link>
      <h1 className="mt-2 mb-10 font-serif text-3xl font-light text-ink">
        Nuevo autor
      </h1>
      <AuthorForm
        initial={{
          id: null,
          name: "",
          affiliation: null,
          bio_es: null,
          bio_en: null,
        }}
      />
    </>
  );
}

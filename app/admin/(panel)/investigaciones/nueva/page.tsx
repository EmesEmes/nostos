import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { InvestigationForm } from "@/components/admin/InvestigationForm";

export const metadata: Metadata = { title: "Nueva investigación" };

export default async function NewInvestigationPage() {
  const { supabase } = await requireAdmin();
  const { data: authors } = await supabase
    .from("authors")
    .select("id, name")
    .order("name");

  return (
    <>
      <Link
        href="/admin/investigaciones"
        className="font-sans text-xs text-ink-soft hover:text-moss-dark"
      >
        ← Investigaciones
      </Link>
      <h1 className="mt-2 mb-10 font-serif text-3xl font-light text-ink">
        Nueva investigación
      </h1>
      <InvestigationForm
        authors={authors ?? []}
        initial={{
          id: null,
          slug: "",
          title_es: "",
          title_en: "",
          summary_es: "",
          summary_en: "",
          content_es: null,
          content_en: null,
          published: false,
          author_id: null,
        }}
      />
    </>
  );
}

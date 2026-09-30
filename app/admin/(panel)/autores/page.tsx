import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { Notice } from "@/components/admin/Notice";

export const metadata: Metadata = { title: "Autores" };

export default async function AuthorsAdminPage({
  searchParams,
}: PageProps<"/admin/autores">) {
  const { supabase } = await requireAdmin();
  const { guardado, eliminado } = await searchParams;

  const { data: authors, error } = await supabase
    .from("authors")
    .select("id, name, affiliation, investigations(count)")
    .order("name");

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="font-sans text-xs text-ink-soft hover:text-moss-dark"
          >
            ← Panel
          </Link>
          <h1 className="mt-2 font-serif text-3xl font-light text-ink">
            Autores
          </h1>
        </div>
        <Link
          href="/admin/autores/nuevo"
          className="rounded-sm bg-moss px-5 py-2.5 font-sans text-sm font-medium text-paper transition-colors duration-200 hover:bg-moss-dark"
        >
          Nuevo autor
        </Link>
      </div>

      {guardado === "1" && <Notice>Autor guardado.</Notice>}
      {eliminado === "1" && <Notice>Autor eliminado.</Notice>}

      {error ? (
        <p role="alert" className="mt-10 font-sans text-sm text-moss-dark">
          No se pudieron cargar los autores.
        </p>
      ) : authors.length === 0 ? (
        <p className="mt-10 rounded-sm border border-dashed border-hairline bg-paper px-6 py-10 text-center font-sans text-sm text-ink-soft">
          Todavía no hay autores. Crea el primero.
        </p>
      ) : (
        <ul className="mt-10 divide-y divide-hairline rounded-sm border border-hairline bg-paper">
          {authors.map((author) => {
            const count = author.investigations[0]?.count ?? 0;
            return (
              <li key={author.id}>
                <Link
                  href={`/admin/autores/${author.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 transition-colors duration-200 hover:bg-paper-alt"
                >
                  <div>
                    <p className="font-serif text-lg font-light text-ink">
                      {author.name}
                    </p>
                    {author.affiliation && (
                      <p className="mt-0.5 font-sans text-xs text-ink-soft">
                        {author.affiliation}
                      </p>
                    )}
                  </div>
                  <span className="font-sans text-xs text-ink-soft">
                    {count === 1
                      ? "1 investigación"
                      : `${count} investigaciones`}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

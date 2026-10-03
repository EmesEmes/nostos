import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { Notice } from "@/components/admin/Notice";

export const metadata: Metadata = { title: "Lugares de estudio" };

export default async function SitesAdminPage({
  searchParams,
}: PageProps<"/admin/lugares">) {
  const { supabase } = await requireAdmin();
  const { guardado, eliminado } = await searchParams;

  const { data: sites, error } = await supabase
    .from("study_sites")
    .select("id, slug, name, kind, province, published, sort_order")
    .order("sort_order")
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
            Lugares de estudio
          </h1>
        </div>
        <Link
          href="/admin/lugares/nuevo"
          className="rounded-sm bg-moss px-5 py-2.5 font-sans text-sm font-medium text-paper transition-colors duration-200 hover:bg-moss-dark"
        >
          Nuevo lugar
        </Link>
      </div>

      {guardado === "1" && <Notice>Lugar guardado.</Notice>}
      {eliminado === "1" && <Notice>Lugar eliminado.</Notice>}

      {error ? (
        <p role="alert" className="mt-10 font-sans text-sm text-moss-dark">
          No se pudieron cargar los lugares.
        </p>
      ) : sites.length === 0 ? (
        <p className="mt-10 rounded-sm border border-dashed border-hairline bg-paper px-6 py-10 text-center font-sans text-sm text-ink-soft">
          Todavía no hay lugares de estudio. Crea el primero.
        </p>
      ) : (
        <ul className="mt-10 divide-y divide-hairline rounded-sm border border-hairline bg-paper">
          {sites.map((site) => (
            <li key={site.id}>
              <Link
                href={`/admin/lugares/${site.id}`}
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 transition-colors duration-200 hover:bg-paper-alt"
              >
                <div>
                  <p className="font-serif text-lg font-light text-ink">
                    {site.name}
                  </p>
                  <p className="mt-0.5 font-sans text-xs text-ink-soft">
                    {site.kind === "canton" ? "Cantón" : "Parroquia"} ·{" "}
                    {site.province}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 font-sans text-[11px] uppercase tracking-[0.1em] ${
                    site.published
                      ? "bg-moss text-paper"
                      : "border border-hairline text-ink-soft"
                  }`}
                >
                  {site.published ? "Publicado" : "Borrador"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

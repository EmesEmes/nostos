import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { Notice } from "@/components/admin/Notice";

export const metadata: Metadata = { title: "Investigaciones" };

const dateFormat = new Intl.DateTimeFormat("es-EC", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function InvestigationsAdminPage({
  searchParams,
}: PageProps<"/admin/investigaciones">) {
  const { supabase } = await requireAdmin();
  const { guardada, eliminada } = await searchParams;

  const { data: investigations, error } = await supabase
    .from("investigations")
    .select("id, slug, title_es, published, updated_at, author:authors(name)")
    .order("updated_at", { ascending: false });

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
            Investigaciones
          </h1>
        </div>
        <Link
          href="/admin/investigaciones/nueva"
          className="rounded-sm bg-moss px-5 py-2.5 font-sans text-sm font-medium text-paper transition-colors duration-200 hover:bg-moss-dark"
        >
          Nueva investigación
        </Link>
      </div>

      {guardada === "1" && <Notice>Investigación guardada.</Notice>}
      {eliminada === "1" && <Notice>Investigación eliminada.</Notice>}

      {error ? (
        <p role="alert" className="mt-10 font-sans text-sm text-moss-dark">
          No se pudieron cargar las investigaciones.
        </p>
      ) : investigations.length === 0 ? (
        <p className="mt-10 rounded-sm border border-dashed border-hairline bg-paper px-6 py-10 text-center font-sans text-sm text-ink-soft">
          Todavía no hay investigaciones. Crea la primera.
        </p>
      ) : (
        <ul className="mt-10 divide-y divide-hairline rounded-sm border border-hairline bg-paper">
          {investigations.map((item) => (
            <li key={item.id}>
              <Link
                href={`/admin/investigaciones/${item.id}`}
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 transition-colors duration-200 hover:bg-paper-alt"
              >
                <div>
                  <p className="font-serif text-lg font-light text-ink">
                    {item.title_es}
                  </p>
                  <p className="mt-0.5 font-sans text-xs text-ink-soft">
                    {item.author?.name ?? "Sin autor"} ·{" "}
                    <span className="font-mono">/{item.slug}</span>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-sans text-xs text-ink-soft">
                    {dateFormat.format(new Date(item.updated_at))}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-sans text-[11px] uppercase tracking-[0.1em] ${
                      item.published
                        ? "bg-moss text-paper"
                        : "border border-hairline text-ink-soft"
                    }`}
                  >
                    {item.published ? "Publicada" : "Borrador"}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

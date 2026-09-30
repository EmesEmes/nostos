import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { signOut } from "@/app/admin/actions";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { email } = await requireAdmin();

  return (
    <>
      <header className="border-b border-hairline bg-paper">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-6">
          <Link
            href="/admin"
            className="font-serif text-lg tracking-[0.2em] text-ink"
          >
            NOSTOS{" "}
            <span className="font-sans text-xs tracking-[0.15em] text-moss">
              PANEL
            </span>
          </Link>
          <div className="flex items-center gap-5">
            <Link
              href="/"
              target="_blank"
              className="hidden font-sans text-sm text-ink-soft transition-colors duration-200 hover:text-moss-dark sm:inline"
            >
              Ver sitio
            </Link>
            <span className="hidden font-sans text-xs text-ink-soft md:inline">
              {email}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-sm border border-hairline px-3 py-1.5 font-sans text-xs text-ink transition-colors duration-200 hover:border-moss-dark hover:text-moss-dark"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-12">{children}</main>
    </>
  );
}

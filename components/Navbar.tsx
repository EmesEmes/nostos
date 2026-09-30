"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const links = [{ href: "/investigaciones", key: "research" }] as const;

export function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-hairline bg-paper/85 backdrop-blur-sm">
      <nav
        aria-label={t.nav.label}
        className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6"
      >
        <Link
          href="/"
          aria-label={t.nav.home}
          className="font-serif text-lg tracking-[0.2em] text-ink transition-colors duration-200 hover:text-moss-dark"
        >
          NOSTOS
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <ul className="flex items-center gap-4 sm:gap-6">
            {links.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`border-b pb-0.5 font-sans text-sm transition-colors duration-200 ${
                      active
                        ? "border-moss text-moss-dark"
                        : "border-transparent text-ink-soft hover:text-moss-dark"
                    }`}
                  >
                    {t.nav[link.key]}
                  </Link>
                </li>
              );
            })}
          </ul>
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
}

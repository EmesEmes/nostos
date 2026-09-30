"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { team } from "@/data/team";

export default function TeamIndexPage() {
  const { lang } = useLanguage();

  return (
    <main>
      <section className="px-6 pb-24 pt-28 sm:pt-36">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-center font-serif text-4xl font-light text-ink">
            {lang === "es" ? "Equipo" : "Team"}
          </h1>
          <ul className="mt-14 space-y-4">
            {team.map((member) => (
              <li key={member.slug}>
                <Link
                  href={`/equipo/${member.slug}`}
                  className="group flex items-center justify-between gap-4 rounded-sm border border-hairline bg-paper p-6 transition-colors duration-300 hover:border-moss"
                >
                  <div>
                    <p className="font-serif text-xl font-light text-ink">
                      {member.name}
                    </p>
                    <p className="mt-1 font-sans text-xs uppercase tracking-[0.2em] text-ink-soft">
                      {member.role[lang]}
                    </p>
                  </div>
                  <span className="font-sans text-sm text-moss-dark">→</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-14 text-center">
            <Link
              href="/"
              className="border-b border-moss pb-1 font-sans text-sm text-moss-dark transition-colors duration-200 hover:border-moss-dark"
            >
              ← NOSTOS
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

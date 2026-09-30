"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export type InvestigationSummary = {
  slug: string;
  title_es: string;
  title_en: string;
  summary_es: string;
  summary_en: string;
  published_at: string | null;
  author: { name: string } | null;
};

export function InvestigationList({
  items,
}: {
  items: InvestigationSummary[];
}) {
  const { lang, t } = useLanguage();
  const dateFormat = new Intl.DateTimeFormat(
    lang === "en" ? "en-US" : "es-EC",
    { dateStyle: "long" },
  );

  return (
    <main className="px-6 pb-24 pt-28 sm:pt-36">
      <div className="mx-auto max-w-lectura">
        <header className="text-center">
          <p className="font-sans text-xs uppercase tracking-[0.35em] text-moss">
            {t.researchPage.kicker}
          </p>
          <h1 className="mt-4 font-serif text-4xl font-light text-ink sm:text-5xl">
            {t.researchPage.title}
          </h1>
          <p className="mt-6 font-serif text-lg font-light italic leading-relaxed text-ink-soft">
            {t.researchPage.intro}
          </p>
        </header>

        {items.length === 0 ? (
          <p className="mt-16 text-center font-sans text-sm text-ink-soft">
            {t.researchPage.empty}
          </p>
        ) : (
          <ul className="mt-16 divide-y divide-hairline border-y border-hairline">
            {items.map((item) => {
              const title = (lang === "en" && item.title_en) || item.title_es;
              const summary =
                (lang === "en" && item.summary_en) || item.summary_es;
              return (
                <li key={item.slug}>
                  <Link
                    href={`/investigaciones/${item.slug}`}
                    className="group block py-10"
                  >
                    <p className="font-sans text-xs uppercase tracking-[0.2em] text-ink-soft">
                      {item.published_at &&
                        dateFormat.format(new Date(item.published_at))}
                      {item.author && ` · ${item.author.name}`}
                    </p>
                    <h2 className="mt-3 font-serif text-2xl font-light leading-snug text-ink transition-colors duration-200 group-hover:text-moss-dark sm:text-3xl">
                      {title}
                    </h2>
                    {summary && (
                      <p className="mt-4 font-sans text-base leading-relaxed text-ink-soft">
                        {summary}
                      </p>
                    )}
                    <span className="mt-5 inline-block font-sans text-sm text-moss-dark">
                      {t.researchPage.readMore} →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}

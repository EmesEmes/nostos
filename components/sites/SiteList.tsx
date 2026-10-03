"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { storageUrl } from "@/lib/storage-paths";

export type SiteSummary = {
  slug: string;
  name: string;
  kind: string;
  province: string;
  tagline_es: string | null;
  tagline_en: string | null;
  summary_es: string;
  summary_en: string;
  cover_path: string | null;
};

export function SiteList({ sites }: { sites: SiteSummary[] }) {
  const { lang, t } = useLanguage();
  const english = lang === "en";

  return (
    <main className="px-6 pb-24 pt-28 sm:pt-36">
      <div className="mx-auto max-w-5xl">
        <header className="mx-auto max-w-lectura text-center">
          <p className="font-sans text-xs uppercase tracking-[0.35em] text-moss">
            NOSTOS
          </p>
          <h1 className="mt-4 font-serif text-4xl font-light text-ink sm:text-5xl">
            {t.sitesPage.title}
          </h1>
          <p className="mt-6 font-serif text-lg font-light italic leading-relaxed text-ink-soft">
            {t.sitesPage.intro}
          </p>
        </header>

        {sites.length === 0 ? (
          <p className="mt-16 text-center font-sans text-sm text-ink-soft">
            {t.sitesPage.empty}
          </p>
        ) : (
          <ul className="mt-16 grid gap-10 sm:grid-cols-2">
            {sites.map((site) => {
              const tagline = (english && site.tagline_en) || site.tagline_es;
              const kind =
                site.kind === "canton"
                  ? t.sitesPage.kind.canton
                  : t.sitesPage.kind.parroquia;
              return (
                <li key={site.slug}>
                  <Link href={`/lugares/${site.slug}`} className="group block">
                    <div className="aspect-[4/3] overflow-hidden rounded-sm bg-paper-alt">
                      {site.cover_path && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={storageUrl(site.cover_path)}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      )}
                    </div>
                    <p className="mt-5 font-sans text-xs uppercase tracking-[0.2em] text-ink-soft">
                      {kind} · {site.province}
                    </p>
                    <h2 className="mt-2 font-serif text-2xl font-light text-ink transition-colors duration-200 group-hover:text-moss-dark">
                      {site.name}
                    </h2>
                    {tagline && (
                      <p className="mt-2 font-serif text-base font-light italic text-ink-soft">
                        {tagline}
                      </p>
                    )}
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

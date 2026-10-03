"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { storageUrl } from "@/lib/storage-paths";
import {
  SiteGalleryView,
  type PublicImage,
} from "@/components/sites/SiteGalleryView";
import { zones } from "@/data/cantonalStudy";

export type PublicTestimony = {
  id: string;
  person_name: string;
  person_detail_es: string | null;
  person_detail_en: string | null;
  quote_es: string;
  quote_en: string;
  photo_path: string | null;
  audio_path: string | null;
};

export type ZoneNeighbor = { name: string; rate: number; slug: string | null };

export type PublicSite = {
  zone_id: string | null;
  name: string;
  kind: string;
  province: string;
  annual_rate: number | null;
  population_now: number | null;
  population_2050: number | null;
  change_pct: number | null;
  altitude: string | null;
  distance_es: string | null;
  distance_en: string | null;
  tagline_es: string | null;
  tagline_en: string | null;
  summary_es: string;
  summary_en: string;
  cover_path: string | null;
  audio_path: string | null;
  audio_title_es: string | null;
  audio_title_en: string | null;
  images: PublicImage[];
  testimonies: PublicTestimony[];
};

type Props = {
  site: PublicSite;
  neighbors: ZoneNeighbor[];
  hasSpanishBody: boolean;
  hasEnglishBody: boolean;
  bodyEs: React.ReactNode;
  bodyEn: React.ReactNode;
};

const sectionLabel = "font-sans text-xs uppercase tracking-[0.25em] text-moss";

export function SiteArticle({
  site,
  neighbors,
  hasSpanishBody,
  hasEnglishBody,
  bodyEs,
  bodyEn,
}: Props) {
  const { lang, t } = useLanguage();
  const english = lang === "en";
  const locale = english ? "en-US" : "es-EC";
  const pick = (es: string | null, en: string | null) => (english && en) || es;

  const integer = new Intl.NumberFormat(locale);
  const decimal = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
    signDisplay: "exceptZero",
  });

  const stats = [
    {
      label: t.sitesPage.annualRate,
      value:
        site.annual_rate !== null
          ? `${decimal.format(site.annual_rate)} %`
          : null,
    },
    {
      label: t.sitesPage.populationNow,
      value:
        site.population_now !== null
          ? integer.format(site.population_now)
          : null,
    },
    {
      label: t.sitesPage.population2050,
      value:
        site.population_2050 !== null
          ? integer.format(site.population_2050)
          : null,
    },
    {
      label: t.sitesPage.change,
      value:
        site.change_pct !== null
          ? `${decimal.format(site.change_pct)} %`
          : null,
    },
    { label: t.sitesPage.altitude, value: site.altitude },
    {
      label: t.sitesPage.distance,
      value: pick(site.distance_es, site.distance_en),
    },
  ].filter((stat): stat is { label: string; value: string } =>
    Boolean(stat.value),
  );

  const tagline = pick(site.tagline_es, site.tagline_en);
  const summary = pick(site.summary_es, site.summary_en);
  const audioTitle = pick(site.audio_title_es, site.audio_title_en);
  const kind =
    site.kind === "canton"
      ? t.sitesPage.kind.canton
      : t.sitesPage.kind.parroquia;
  const zone = zones.find((item) => item.id === site.zone_id) ?? null;
  const rateFormat = (rate: number) => `${decimal.format(rate)} %`;
  const awaitingFieldwork =
    !hasSpanishBody &&
    site.images.length === 0 &&
    site.testimonies.length === 0;

  return (
    <main className="pb-24 pt-28 sm:pt-36">
      <article>
        <header className="mx-auto max-w-lectura px-6">
          <Link
            href="/lugares"
            className="font-sans text-xs uppercase tracking-[0.2em] text-ink-soft transition-colors duration-200 hover:text-moss-dark"
          >
            ← {t.sitesPage.back}
          </Link>
          <p className={`mt-10 ${sectionLabel}`}>
            {kind} · {site.province}
          </p>
          <h1 className="mt-4 font-serif text-5xl font-light leading-tight text-ink sm:text-6xl">
            {site.name}
          </h1>
          {tagline && (
            <p className="mt-6 font-serif text-xl font-light italic leading-relaxed text-ink-soft">
              {tagline}
            </p>
          )}
        </header>

        {site.cover_path && (
          <div className="mx-auto mt-12 max-w-5xl px-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={storageUrl(site.cover_path)}
              alt=""
              fetchPriority="high"
              className="aspect-[16/9] w-full rounded-sm object-cover"
            />
          </div>
        )}

        <div className="mx-auto max-w-lectura px-6">
          {stats.length > 0 && (
            <section aria-label={t.sitesPage.stats} className="mt-12">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-y border-hairline py-8 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="font-sans text-[11px] uppercase tracking-[0.15em] text-ink-soft">
                      {stat.label}
                    </dt>
                    <dd className="mt-1.5 font-serif text-2xl font-light text-ink">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {site.audio_path && (
            <section className="mt-12 rounded-sm border border-hairline bg-paper-alt px-5 py-5">
              <p className={sectionLabel}>{t.sitesPage.listen}</p>
              {audioTitle && (
                <p className="mt-2 font-serif text-lg font-light text-ink">
                  {audioTitle}
                </p>
              )}
              <audio
                controls
                preload="metadata"
                src={storageUrl(site.audio_path)}
                className="mt-4 w-full"
              />
            </section>
          )}

          {summary && (
            <p className="mt-12 font-serif text-xl font-light italic leading-relaxed text-ink-soft">
              {summary}
            </p>
          )}

          {hasSpanishBody && (
            <div className="mt-12">
              {english && !hasEnglishBody && (
                <p className="mb-10 rounded-sm border border-hairline bg-paper-alt px-4 py-3 font-sans text-sm text-ink-soft">
                  {t.sitesPage.onlySpanish}
                </p>
              )}
              {english && hasEnglishBody ? bodyEn : bodyEs}
            </div>
          )}

          {zone && (
            <section className="mt-16 border-t border-hairline pt-10">
              <p className={sectionLabel}>{t.cantonPage.zoneTitle}</p>
              <h2 className="mt-3 font-serif text-2xl font-light text-ink">
                {zone.title[lang]}
              </h2>
              <p className="mt-4 font-sans text-base leading-relaxed text-ink">
                {zone.narrative[lang]}
              </p>

              {neighbors.length > 0 && (
                <>
                  <h3 className="mt-10 font-sans text-xs uppercase tracking-[0.25em] text-ink-soft">
                    {t.cantonPage.othersTitle}
                  </h3>
                  <ul className="mt-4 space-y-1.5 border-t border-hairline pt-4">
                    {neighbors.map((neighbor) => {
                      const row = (
                        <>
                          <span className="font-sans text-sm text-ink">
                            {neighbor.name}
                          </span>
                          <span className="flex-1 border-b border-dotted border-hairline" />
                          <span
                            className={`font-serif text-sm tabular-nums ${
                              neighbor.rate <= -1
                                ? "font-medium text-moss-dark"
                                : "text-ink"
                            }`}
                          >
                            {rateFormat(neighbor.rate)}
                          </span>
                        </>
                      );
                      return (
                        <li key={neighbor.name}>
                          {neighbor.slug ? (
                            <Link
                              href={`/lugares/${neighbor.slug}`}
                              className="flex items-baseline justify-between gap-3 transition-colors duration-200 hover:text-moss-dark"
                            >
                              {row}
                            </Link>
                          ) : (
                            <div className="flex items-baseline justify-between gap-3">
                              {row}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-4 font-sans text-xs text-ink-soft">
                    {t.cantonal.sourceNote}
                  </p>
                </>
              )}
            </section>
          )}

          {awaitingFieldwork && (
            <section className="mt-16 rounded-sm border border-hairline bg-paper-alt px-6 py-8 text-center">
              <p className={sectionLabel}>{t.cantonPage.fieldworkTitle}</p>
              <p className="mt-4 font-serif text-lg font-light italic leading-relaxed text-ink-soft">
                {t.cantonPage.fieldworkNote}
              </p>
            </section>
          )}
        </div>

        {site.images.length > 0 && (
          <section className="mx-auto mt-20 max-w-5xl px-6">
            <h2 className={`mb-6 ${sectionLabel}`}>{t.sitesPage.gallery}</h2>
            <SiteGalleryView images={site.images} />
          </section>
        )}

        {site.testimonies.length > 0 && (
          <section className="mx-auto mt-20 max-w-lectura px-6">
            <h2 className={`mb-8 ${sectionLabel}`}>
              {t.sitesPage.testimonies}
            </h2>
            <ul className="space-y-12">
              {site.testimonies.map((testimony) => {
                const detail = pick(
                  testimony.person_detail_es,
                  testimony.person_detail_en,
                );
                return (
                  <li key={testimony.id}>
                    <figure>
                      <blockquote className="font-serif text-2xl font-light italic leading-relaxed text-ink">
                        “{pick(testimony.quote_es, testimony.quote_en)}”
                      </blockquote>
                      <figcaption className="mt-5 flex items-center gap-4">
                        {testimony.photo_path && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={storageUrl(testimony.photo_path)}
                            alt=""
                            loading="lazy"
                            className="h-14 w-14 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p className="font-sans text-sm font-medium text-ink">
                            {testimony.person_name}
                          </p>
                          {detail && (
                            <p className="font-sans text-xs text-ink-soft">
                              {detail}
                            </p>
                          )}
                        </div>
                      </figcaption>
                      {testimony.audio_path && (
                        <audio
                          controls
                          preload="none"
                          src={storageUrl(testimony.audio_path)}
                          aria-label={`${t.sitesPage.listen}: ${testimony.person_name}`}
                          className="mt-4 w-full"
                        />
                      )}
                    </figure>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </article>
    </main>
  );
}

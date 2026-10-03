"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { useHomeSites } from "@/components/home/HomeSites";
import { storageUrl } from "@/lib/storage-paths";

export function CaseStudy() {
  const { t, lang } = useLanguage();
  const site = useHomeSites().find((item) => item.kind === "parroquia");

  if (!site) return null;

  const english = lang === "en";
  const pick = (es: string | null, en: string | null) => (english && en) || es;
  const numberFormat = new Intl.NumberFormat(english ? "en-US" : "es-EC");

  const stats = [
    {
      label: t.map.panel.population,
      value:
        site.population_now !== null
          ? numberFormat.format(site.population_now)
          : null,
    },
    {
      label: t.map.panel.projection,
      value:
        site.population_2050 !== null
          ? numberFormat.format(site.population_2050)
          : null,
    },
    {
      label: t.map.panel.change,
      value:
        site.change_pct !== null
          ? `${numberFormat.format(site.change_pct)}%`
          : null,
    },
  ].filter(
    (stat): stat is { label: string; value: string } => stat.value !== null,
  );

  const distance = pick(site.distance_es, site.distance_en);
  const tagline = pick(site.tagline_es, site.tagline_en);

  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <p className="text-center font-sans text-xs uppercase tracking-[0.35em] text-moss">
          {t.caseStudy.kicker}
        </p>
        <p className="mx-auto mt-4 max-w-lectura text-center font-sans text-base leading-relaxed text-ink-soft">
          {t.caseStudy.intro}
        </p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -12% 0px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mt-12 grid overflow-hidden rounded-sm border border-hairline bg-paper lg:grid-cols-2"
        >
          <div className="relative flex aspect-[4/3] items-center justify-center bg-paper-alt lg:aspect-auto">
            {site.cover_path ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={storageUrl(site.cover_path)}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero-bg.svg"
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover opacity-70"
                />
                <span className="relative font-serif text-2xl font-light text-ink-soft">
                  {site.name}
                </span>
              </>
            )}
          </div>

          <div className="flex flex-col p-8 sm:p-10">
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-ink-soft">
              {site.province}
              {distance && ` · ${distance}`}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-light text-ink sm:text-4xl">
              {site.name}
            </h2>
            {tagline && (
              <p className="mt-5 font-serif text-lg font-light italic leading-relaxed text-ink-soft">
                {tagline}
              </p>
            )}

            {stats.length > 0 && (
              <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-hairline pt-6">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="font-sans text-[10px] uppercase tracking-[0.15em] text-ink-soft">
                      {stat.label}
                    </dt>
                    <dd className="mt-1 font-serif text-xl tabular-nums text-ink">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            <p className="mt-6 font-sans text-xs uppercase tracking-[0.2em] text-moss">
              {t.caseStudy.audioNote}
            </p>

            <Link
              href={`/lugares/${site.slug}`}
              className="mt-8 inline-block self-start border border-moss px-6 py-2.5 font-sans text-sm text-moss-dark transition-colors duration-300 hover:bg-moss hover:text-paper"
            >
              {t.caseStudy.visit} →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

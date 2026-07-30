"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { BackButton } from "@/components/BackButton";
import { useLanguage } from "@/lib/LanguageContext";
import { cantons } from "@/data/cantons";
import { zones } from "@/data/cantonalStudy";

/**
 * Vista de la página de un cantón. Todo lo mostrado proviene del
 * análisis real 1990–2022 (data/cantons.ts + data/cantonalStudy.ts):
 * tasa anual, zona, narrativa de la zona y cantones vecinos. Las
 * historias/fotos/podcast se anuncian honestamente como pendientes del
 * trabajo de campo (sin placeholders inventados).
 */
export function CantonProfile({ slug }: { slug: string }) {
  const { t, lang } = useLanguage();
  const canton = cantons.find((c) => c.slug === slug)!;
  const zone = zones.find((z) => z.id === canton.zoneId)!;
  const neighbors = zone.cantons.filter((c) => c.name !== canton.name);

  const rateFormat = (rate: number) =>
    `${rate > 0 ? "+" : ""}${rate.toFixed(2).replace(".", lang === "es" ? "," : ".")}%`;

  return (
    <main>
      <BackButton />
      <LanguageSwitcher />

      {/* ── Apertura: el dato manda ────────────────────────────────────── */}
      <header className="px-6 pb-14 pt-28 text-center sm:pt-36">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="font-sans text-xs uppercase tracking-[0.35em] text-moss">
            {t.cantonPage.kicker}
          </p>
          <h1 className="mt-4 font-serif text-5xl font-light text-ink sm:text-6xl">
            {canton.name}
          </h1>
          <p className="mt-3 font-sans text-sm text-ink-soft">{canton.province}</p>

          <p className="mt-10 font-serif text-7xl font-light tabular-nums text-moss-dark sm:text-8xl">
            {rateFormat(canton.rate)}
          </p>
          <p className="mt-2 font-sans text-xs uppercase tracking-[0.25em] text-ink-soft">
            {t.map.panel.rateLabel}
          </p>
        </motion.div>
      </header>

      {/* ── Su zona en el análisis (narrativa real del scrollytelling) ─── */}
      <section className="border-t border-hairline bg-paper-alt px-6 py-16">
        <div className="mx-auto max-w-prose">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-moss">
            {t.cantonPage.zoneTitle}
          </p>
          <h2 className="mt-3 font-serif text-2xl font-light text-ink">
            {zone.title[lang]}
          </h2>
          <p className="mt-4 font-sans text-base leading-relaxed text-ink">
            {zone.narrative[lang]}
          </p>
        </div>
      </section>

      {/* ── Cantones de la misma zona ──────────────────────────────────── */}
      {neighbors.length > 0 && (
        <section className="px-6 py-16">
          <div className="mx-auto max-w-prose">
            <h2 className="font-sans text-xs uppercase tracking-[0.25em] text-ink-soft">
              {t.cantonPage.othersTitle}
            </h2>
            <ul className="mt-5 space-y-1.5 border-t border-hairline pt-4">
              {neighbors.map((other) => {
                const linked = cantons.find((c) => c.name === other.name);
                const row = (
                  <>
                    <span className="font-sans text-sm text-ink">{other.name}</span>
                    <span className="flex-1 border-b border-dotted border-hairline" />
                    <span
                      className={`font-serif text-sm tabular-nums ${
                        other.rate <= -1 ? "font-medium text-moss-dark" : "text-ink"
                      }`}
                    >
                      {rateFormat(other.rate)}
                    </span>
                  </>
                );
                return (
                  <li key={other.name}>
                    {linked ? (
                      <Link
                        href={`/cantones/${linked.slug}`}
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
          </div>
        </section>
      )}

      {/* ── Trabajo de campo: pendiente, dicho con honestidad ──────────── */}
      <section className="border-t border-hairline bg-paper-alt px-6 py-14">
        <div className="mx-auto max-w-prose text-center">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-moss">
            {t.cantonPage.fieldworkTitle}
          </p>
          <p className="mx-auto mt-4 font-serif text-lg font-light italic leading-relaxed text-ink-soft">
            {t.cantonPage.fieldworkNote}
          </p>
        </div>
      </section>

      <footer className="border-t border-hairline px-6 py-12 text-center">
        <Link
          href="/"
          className="border-b border-moss pb-1 font-sans text-sm text-moss-dark transition-colors duration-200 hover:border-moss-dark"
        >
          ← NOSTOS
        </Link>
      </footer>
    </main>
  );
}

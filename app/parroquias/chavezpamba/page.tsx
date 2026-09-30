"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { BackButton } from "@/components/BackButton";
import { useLanguage } from "@/lib/LanguageContext";
import { caseStudy } from "@/data/caseStudy";

/**
 * Página individual de Chavezpamba (estudio de caso / pilotaje).
 *
 * Es el MOLDE para las 10 páginas de parroquias futuras: cuando la muestra
 * se confirme, generalizar a app/parroquias/[slug]/page.tsx leyendo de
 * data/parishes.ts (o de una tabla `parishes` en Supabase).
 *
 * ⚠️ PLACEHOLDERS pendientes (ver data/caseStudy.ts):
 * - Cifras y párrafos narrativos definitivos del pilotaje.
 * - Galería: sustituir los bloques por <Image> con fotos reales
 *   (Supabase Storage → URLs públicas).
 * - Podcast: definir `podcastUrl` (archivo en Supabase Storage o embed).
 */
export default function ChavezpambaPage() {
  const { t, lang } = useLanguage();
  const numberFormat = new Intl.NumberFormat("es-EC");

  const stats = [
    {
      label: t.map.panel.population,
      value: `${numberFormat.format(caseStudy.populationNow)}`,
    },
    {
      label: t.map.panel.projection,
      value: `${numberFormat.format(caseStudy.population2050)}`,
    },
    { label: t.map.panel.change, value: `${caseStudy.changePct}%` },
  ];

  return (
    <main>
      <BackButton />
      <LanguageSwitcher />

      {/* ── Apertura ──────────────────────────────────────────────────── */}
      <header className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
        {/* ⚠️ FOTO PLACEHOLDER de cabecera (misma pauta que el hero del home). */}
        <img
          src="/hero-bg.svg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-b from-paper/85 via-paper/60 to-paper"
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-3xl"
        >
          <p className="font-sans text-xs uppercase tracking-[0.35em] text-moss">
            {t.caseStudy.kicker}
          </p>
          <h1 className="mt-4 font-serif text-5xl font-light text-ink sm:text-6xl">
            {caseStudy.name}
          </h1>
          <p className="mt-3 font-sans text-sm text-ink-soft">
            {caseStudy.province} · {caseStudy.distance[lang]} ·{" "}
            {caseStudy.altitude}
          </p>
          <p className="mt-8 font-serif text-xl font-light italic leading-relaxed text-ink-soft">
            {caseStudy.tagline[lang]}
          </p>
        </motion.div>
      </header>

      {/* ── Datos clave ───────────────────────────────────────────────── */}
      <section className="border-y border-hairline bg-paper-alt px-6 py-14">
        <dl className="mx-auto grid max-w-3xl grid-cols-1 gap-8 text-center sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="font-sans text-xs uppercase tracking-[0.2em] text-ink-soft">
                {stat.label}
              </dt>
              <dd className="mt-2 font-serif text-4xl font-light tabular-nums text-ink">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Narrativa del pilotaje ────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-lectura space-y-8">
          {caseStudy.body[lang].map((paragraph, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0.15 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "0px 0px -30% 0px" }}
              transition={{ duration: 0.9 }}
              className="font-serif text-xl font-light leading-relaxed text-ink sm:text-2xl"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </section>

      {/* ── Podcast ───────────────────────────────────────────────────── */}
      <section className="bg-paper-alt px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-sm border border-hairline bg-paper p-8">
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-moss">
            {t.stories.audioNote}
          </p>
          <h2 className="mt-2 font-serif text-2xl font-light text-ink">
            {caseStudy.podcastTitle[lang]}
          </h2>
          {caseStudy.podcastUrl ? (
            /* Con URL real: reproductor nativo (o cambiar por embed). */
            <audio
              controls
              src={caseStudy.podcastUrl}
              className="mt-6 w-full"
            />
          ) : (
            /* ⚠️ PLACEHOLDER: definir podcastUrl en data/caseStudy.ts. */
            <div className="mt-6 flex items-center gap-4 rounded-sm border border-dashed border-hairline px-5 py-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-ink-soft">
                ▶
              </span>
              <span className="font-sans text-sm italic text-ink-soft">
                {lang === "es"
                  ? "Episodio en producción (PLACEHOLDER)"
                  : "Episode in production (PLACEHOLDER)"}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ── Galería ───────────────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3">
          {Array.from({ length: caseStudy.galleryCount }, (_, index) => (
            /* ⚠️ FOTO PLACEHOLDER: sustituir por <Image> (Supabase Storage). */
            <div
              key={index}
              className="flex aspect-square items-center justify-center rounded-sm border border-dashed border-hairline bg-paper-alt"
            >
              <span className="font-serif text-2xl font-light text-hairline">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Volver ────────────────────────────────────────────────────── */}
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

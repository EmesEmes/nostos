"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { caseStudy } from "@/data/caseStudy";

/**
 * Estudio de Caso (pilotaje) — reemplaza a "Historias Humanas".
 * Una sola parroquia destacada: Chavezpamba, con enlace a su página
 * individual (/parroquias/chavezpamba), ya construida con placeholders.
 */
export function CaseStudy() {
  const { t, lang } = useLanguage();
  const numberFormat = new Intl.NumberFormat("es-EC");

  const stats = [
    {
      label: t.map.panel.population,
      value: numberFormat.format(caseStudy.populationNow),
    },
    {
      label: t.map.panel.projection,
      value: numberFormat.format(caseStudy.population2050),
    },
    { label: t.map.panel.change, value: `${caseStudy.changePct}%` },
  ];

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
          {/* ⚠️ FOTO PLACEHOLDER: sustituir por <Image> real de Chavezpamba
              (Supabase Storage). Mantener aspect y object-cover. */}
          <div className="relative flex aspect-[4/3] items-center justify-center bg-paper-alt lg:aspect-auto">
            <img
              src="/hero-bg.svg"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover opacity-70"
            />
            <span className="relative font-serif text-2xl font-light text-ink-soft">
              {caseStudy.name}
            </span>
          </div>

          <div className="flex flex-col p-8 sm:p-10">
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-ink-soft">
              {caseStudy.province} · {caseStudy.distance[lang]}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-light text-ink sm:text-4xl">
              {caseStudy.name}
            </h2>
            <p className="mt-5 font-serif text-lg font-light italic leading-relaxed text-ink-soft">
              {caseStudy.tagline[lang]}
            </p>

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

            <p className="mt-6 font-sans text-xs uppercase tracking-[0.2em] text-moss">
              {t.caseStudy.audioNote}
            </p>

            <Link
              href={`/parroquias/${caseStudy.slug}`}
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

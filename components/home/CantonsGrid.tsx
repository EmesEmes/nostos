"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { useStudyCantons } from "@/components/home/HomeSites";

export function CantonsGrid() {
  const { t, lang } = useLanguage();
  const cantons = useStudyCantons();
  const rateFormat = (rate: number) =>
    `${rate.toFixed(2).replace(".", lang === "es" ? "," : ".")}%`;

  if (cantons.length === 0) return null;

  return (
    <section
      id="cantones"
      className="border-t border-hairline bg-paper-alt px-6 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-serif text-3xl font-light text-ink sm:text-4xl">
          {t.cantonsGrid.title}
        </h2>
        <p className="mx-auto mt-4 max-w-lectura text-center font-sans text-base leading-relaxed text-ink-soft">
          {t.cantonsGrid.intro}
        </p>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cantons.map((canton, index) => (
            <motion.div
              key={canton.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{
                duration: 0.5,
                delay: (index % 5) * 0.06,
                ease: "easeOut",
              }}
            >
              <Link
                href={`/lugares/${canton.slug}`}
                className="group flex h-full flex-col border border-hairline bg-paper p-5 transition-colors duration-300 hover:border-moss"
              >
                <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                  {canton.province}
                </p>
                <h3 className="mt-1 font-serif text-lg font-medium leading-snug text-ink">
                  {canton.name}
                </h3>
                <p className="mt-4 font-serif text-3xl font-light tabular-nums text-moss-dark">
                  {rateFormat(canton.annual_rate)}
                </p>
                <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-ink-soft">
                  {t.cantonsGrid.rateShort} · 1990–2022
                </p>
                <span className="mt-auto inline-block pt-4 font-sans text-xs text-moss-dark">
                  <span className="border-b border-transparent transition-colors duration-200 group-hover:border-moss-dark">
                    {t.cantonsGrid.open} →
                  </span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

/**
 * 8. Implicaciones y Recomendaciones.
 * Dirigida a tomadores de decisión: tres bloques cortos con jerarquía
 * visual clara (numeración discreta + titular + una idea por bloque),
 * sin narrativa densa.
 */
export function Implications() {
  const { t } = useLanguage();

  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-serif text-3xl font-light text-ink sm:text-4xl">
          {t.implications.title}
        </h2>
        <p className="mt-4 max-w-prose font-sans text-base leading-relaxed text-ink-soft">
          {t.implications.intro}
        </p>

        <div className="mt-14 space-y-0 divide-y divide-hairline border-y border-hairline">
          {t.implications.items.map((item, index) => (
            <motion.article
              key={item.heading}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              className="grid gap-3 py-10 sm:grid-cols-[80px_1fr] sm:gap-8"
            >
              {/* La numeración aquí sí codifica prioridad de lectura. */}
              <span className="font-serif text-2xl font-light text-moss">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-serif text-xl font-medium text-ink sm:text-2xl">
                  {item.heading}
                </h3>
                <p className="mt-3 max-w-prose font-sans text-base leading-relaxed text-ink-soft">
                  {item.body}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

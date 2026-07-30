"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

/**
 * Principales hallazgos (reemplaza a "Implicaciones y recomendaciones").
 *
 * Cada tarjeta enfrenta una hipótesis del estudio con su veredicto:
 * la hipótesis entra primero; el veredicto se revela después, como un
 * sello que se estampa (escala + leve rotación), seguido de la línea de
 * evidencia. Con prefers-reduced-motion todo aparece sin animación
 * (MotionConfig global).
 *
 * ⚠️ PLACEHOLDER: hipótesis, veredictos y evidencias de ejemplo en
 * lib/translations.ts (findings.items). Reemplazar con los definitivos.
 */

type Verdict = "confirmed" | "partial" | "rejected";

const verdictStyle: Record<Verdict, string> = {
  confirmed: "border-moss-dark text-moss-dark",
  partial: "border-moss text-moss-dark",
  rejected: "border-ink-soft text-ink-soft",
};

export function Findings() {
  const { t } = useLanguage();

  return (
    <section className="bg-paper-alt px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-serif text-3xl font-light text-ink sm:text-4xl">
          {t.findings.title}
        </h2>
        <p className="mt-4 max-w-prose font-sans text-base leading-relaxed text-ink-soft">
          {t.findings.intro}
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {t.findings.items.map((item, index) => {
            const verdict = item.verdict as Verdict;
            return (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                transition={{ duration: 0.6, delay: (index % 2) * 0.12, ease: "easeOut" }}
                className="flex flex-col rounded-sm border border-hairline bg-paper p-7"
              >
                {/* La hipótesis, en voz serif (es la "teoría" del estudio). */}
                <h3 className="font-serif text-lg font-light italic leading-relaxed text-ink">
                  “{item.hypothesis}”
                </h3>

                {/* El veredicto se estampa al entrar en viewport. */}
                {/* Sello recto: solo escala + fade (sin inclinación). */}
                <motion.p
                  initial={{ opacity: 0, scale: 1.3 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                  transition={{
                    duration: 0.45,
                    delay: 0.45 + (index % 2) * 0.12,
                    ease: [0.34, 1.3, 0.5, 1],
                  }}
                  className={`mt-6 inline-block self-start border-2 px-3 py-1 font-sans text-xs font-semibold uppercase tracking-[0.2em] ${verdictStyle[verdict]}`}
                >
                  {t.findings.verdicts[verdict]}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                  transition={{ duration: 0.5, delay: 0.8 + (index % 2) * 0.12 }}
                  className="mt-5 border-t border-hairline pt-4 font-sans text-sm leading-relaxed text-ink-soft"
                >
                  <span className="mr-2 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-moss">
                    {t.findings.evidenceLabel}
                  </span>
                  {item.evidence}
                </motion.p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

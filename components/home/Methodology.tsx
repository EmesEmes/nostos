"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

/**
 * ⚠️ COMPONENTE SIN USO en el home actual: retirado a pedido del cliente.
 * Sugerencia: reubicar como página propia (/metodologia) enlazada desde el
 * cierre — el comité doctoral agradecerá poder encontrarla.
 *
 * 7. Metodología.
 * Sección deliberadamente sobria: sin decoración, tipografía de UI,
 * y colapsable (acordeón) para no interrumpir el ritmo narrativo de quien
 * solo sigue la historia, pero disponible para el lector académico.
 *
 * El contenido (enfoque, fuentes, variables) vive en lib/translations.ts
 * con marcas PLACEHOLDER donde falta el detalle definitivo.
 */
export function Methodology() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="border-y border-hairline bg-paper-alt px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-serif text-2xl font-light text-ink sm:text-3xl">
          {t.methodology.title}
        </h2>
        <p className="mt-3 font-sans text-sm leading-relaxed text-ink-soft">
          {t.methodology.intro}
        </p>

        <div className="mt-10 divide-y divide-hairline border-y border-hairline">
          {t.methodology.items.map((item, index) => {
            const open = openIndex === index;
            const contentId = `methodology-panel-${index}`;
            return (
              <div key={item.heading}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : index)}
                  aria-expanded={open}
                  aria-controls={contentId}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-sans text-sm font-medium text-ink">
                    {item.heading}
                  </span>
                  <span
                    className={`text-moss-dark transition-transform duration-300 ${
                      open ? "rotate-45" : ""
                    }`}
                    aria-hidden="true"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M7 1v12M1 7h12"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={contentId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 font-sans text-sm leading-relaxed text-ink-soft">
                        {item.body}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import type { Canton } from "@/data/cantons";
import { zones } from "@/data/cantonalStudy";
import type { Lang } from "@/lib/translations";

/**
 * Panel lateral del cantón seleccionado en el Mapa Vivo.
 * Muestra SOLO datos reales del análisis 1990–2022: nombre, provincia,
 * tasa anual promedio y su zona en el estudio, con enlace a la página
 * del cantón (/cantones/[slug]).
 * Cierre: click fuera, Escape o botón; foco inicial en el cierre.
 */

type Props = {
  canton: Canton | null;
  lang: Lang;
  onClose: () => void;
};

export function ParishPanel({ canton, lang, onClose }: Props) {
  const { t } = useLanguage();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!canton) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canton, onClose]);

  useEffect(() => {
    if (canton) closeButtonRef.current?.focus();
  }, [canton]);

  const zone = canton ? zones.find((z) => z.id === canton.zoneId) : null;
  const rateFormat = (rate: number) =>
    `${rate.toFixed(2).replace(".", lang === "es" ? "," : ".")}%`;

  return (
    <AnimatePresence>
      {canton && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-ink/20"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label={canton.name}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="fixed right-0 top-0 z-50 flex h-full w-full flex-col overflow-y-auto border-l border-hairline bg-paper px-8 py-10 sm:w-[400px]"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label={t.map.panel.close}
              className="self-end rounded-full border border-hairline p-2 text-ink-soft transition-colors duration-200 hover:border-moss-dark hover:text-moss-dark"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 2l10 10M12 2L2 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <p className="mt-6 font-sans text-xs uppercase tracking-[0.25em] text-moss">
              {canton.province}
            </p>
            <h3 className="mt-2 font-serif text-3xl font-light text-ink">
              {canton.name}
            </h3>

            <dl className="mt-10 space-y-8 border-t border-hairline pt-8">
              <div>
                <dt className="font-sans text-xs uppercase tracking-[0.2em] text-ink-soft">
                  {t.map.panel.rateLabel}
                </dt>
                <dd className="mt-1 font-serif text-4xl font-light tabular-nums text-moss-dark">
                  {rateFormat(canton.rate)}
                </dd>
              </div>
              {zone && (
                <div>
                  <dt className="font-sans text-xs uppercase tracking-[0.2em] text-ink-soft">
                    {t.map.panel.zoneLabel}
                  </dt>
                  <dd className="mt-1 font-serif text-xl font-light text-ink">
                    {zone.title[lang]}
                  </dd>
                </div>
              )}
            </dl>

            <Link
              href={`/cantones/${canton.slug}`}
              className="mt-auto inline-block border-b border-moss pb-1 pt-10 font-sans text-sm text-moss-dark transition-colors duration-200 hover:border-moss-dark"
            >
              {t.map.panel.visit} →
            </Link>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import type { ProvinceShape } from "@/data/provinceShapes";
import {
  provinceDynamics,
  dynamicColors,
  type Dynamic,
} from "@/data/provinceDynamics";
import { zones } from "@/data/cantonalStudy";
import { cantons } from "@/data/cantons";
import { caseStudy } from "@/data/caseStudy";
import type { Lang } from "@/lib/translations";

/**
 * Panel lateral de la provincia seleccionada en el mapa 2D.
 * Muestra SOLO datos reales:
 *  - su categoría de dinámica poblacional 1990–2022 (provinceDynamics.ts);
 *  - si la provincia tiene el estudio de caso (data/caseStudy.ts, hoy solo
 *    Chavezpamba/Pichincha), una ficha con enlace a su página propia —
 *    se muestra AUNQUE la provincia esté en crecimiento y sin cantones en
 *    decrecimiento, porque el trabajo de campo ahí sí existe;
 *  - si pertenece a una de las 4 zonas del estudio cantonal
 *    (cantonalStudy.ts), su narrativa real y la lista de cantones de esa
 *    zona (enlazados a /cantones/[slug] cuando tienen página propia,
 *    igual que los "cantones vecinos" de CantonProfile.tsx);
 *  - si no hay ni estudio de caso ni zona (la mayoría, en crecimiento),
 *    lo dice con honestidad en vez de dejar el panel vacío.
 * Cierre: click fuera, Escape o botón; foco inicial en el cierre.
 *
 * Nota: cuando se generalice a data/parishes.ts (varias parroquias, ver
 * plan pendiente), este chequeo de una sola caseStudy pasa a un
 * `parishes.filter(p => p.provinceId === province.id)`.
 */

type Props = {
  province: ProvinceShape | null;
  lang: Lang;
  onClose: () => void;
};

const legendKeyByDynamic: Record<
  Dynamic,
  "legendDecline" | "legendWeak" | "legendNormal"
> = {
  decline: "legendDecline",
  weak: "legendWeak",
  normal: "legendNormal",
};

export function ProvincePanel({ province, lang, onClose }: Props) {
  const { t } = useLanguage();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!province) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [province, onClose]);

  useEffect(() => {
    if (province) closeButtonRef.current?.focus();
  }, [province]);

  const dynamic: Dynamic | null = province
    ? (provinceDynamics[province.id] ?? "normal")
    : null;
  const zone = province
    ? (zones.find((z) => z.provinces.includes(province.id)) ?? null)
    : null;
  const caseStudyHere =
    province && caseStudy.provinceId === province.id ? caseStudy : null;

  const rateFormat = (rate: number) =>
    `${rate > 0 ? "+" : ""}${rate.toFixed(2).replace(".", lang === "es" ? "," : ".")}%`;

  return (
    <AnimatePresence>
      {province && dynamic && (
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
            aria-label={province.name}
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
              {t.map.panel.kicker}
            </p>
            <h3 className="mt-2 font-serif text-3xl font-light text-ink">
              {province.name}
            </h3>

            <div className="mt-5 flex items-center gap-2.5">
              <span
                className="inline-block h-3 w-3 rounded-[2px] border border-hairline"
                style={{ backgroundColor: dynamicColors[dynamic] }}
                aria-hidden="true"
              />
              <span className="font-sans text-sm text-ink-soft">
                {t.map[legendKeyByDynamic[dynamic]]}
              </span>
            </div>

            {caseStudyHere && (
              <div className="mt-8 border-t border-hairline pt-8">
                <p className="font-sans text-xs uppercase tracking-[0.2em] text-moss">
                  {t.caseStudy.kicker}
                </p>
                <h4 className="mt-2 font-serif text-xl font-light text-ink">
                  {caseStudyHere.name}
                </h4>
                <p className="mt-3 font-serif text-base font-light italic leading-relaxed text-ink-soft">
                  {caseStudyHere.tagline[lang]}
                </p>
                <Link
                  href={`/parroquias/${caseStudyHere.slug}`}
                  className="mt-5 inline-block border-b border-moss pb-1 font-sans text-sm text-moss-dark transition-colors duration-200 hover:border-moss-dark"
                >
                  {t.caseStudy.visit} →
                </Link>
              </div>
            )}

            {zone && (
              <>
                <div className="mt-8 border-t border-hairline pt-8">
                  <p className="font-sans text-xs uppercase tracking-[0.2em] text-ink-soft">
                    {t.cantonPage.zoneTitle}
                  </p>
                  <h4 className="mt-2 font-serif text-xl font-light text-ink">
                    {zone.title[lang]}
                  </h4>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-ink">
                    {zone.narrative[lang]}
                  </p>
                </div>

                {zone.cantons.length > 0 && (
                  <div className="mt-8">
                    <p className="font-sans text-xs uppercase tracking-[0.2em] text-ink-soft">
                      {t.cantonPage.othersTitle}
                    </p>
                    <ul className="mt-4 space-y-1.5 border-t border-hairline pt-4">
                      {zone.cantons.map((canton) => {
                        const linked = cantons.find(
                          (c) => c.name === canton.name,
                        );
                        const row = (
                          <>
                            <span className="font-sans text-sm text-ink">
                              {canton.name}
                            </span>
                            <span className="flex-1 border-b border-dotted border-hairline" />
                            <span
                              className={`font-serif text-sm tabular-nums ${
                                canton.rate <= -1
                                  ? "font-medium text-moss-dark"
                                  : "text-ink"
                              }`}
                            >
                              {rateFormat(canton.rate)}
                            </span>
                          </>
                        );
                        return (
                          <li key={canton.name}>
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
                  </div>
                )}
              </>
            )}

            {!zone && !caseStudyHere && (
              <p className="mt-8 border-t border-hairline pt-8 font-sans text-sm leading-relaxed text-ink-soft">
                {t.map.panel.noDeclineNote}
              </p>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

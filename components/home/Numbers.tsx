"use client";

import { useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLanguage } from "@/lib/LanguageContext";
import { persistentByCategory } from "@/data/cantonCategories";
import { useStudyCantons } from "@/components/home/HomeSites";
import { zones } from "@/data/cantonalStudy";

/**
 * 5. Lo que Dicen los Números — galería, no scroll horizontal.
 *
 * Antes secuestraba el scroll vertical (GSAP ScrollTrigger + pin) para
 * trasladar un carril horizontal; a pedido del cliente, ahora es una
 * galería normal: una estadística a la vez, con flechas debajo, puntos
 * de posición y swipe/drag (framer-motion) para pasar de una a otra.
 * Mismo componente para cualquier tamaño de pantalla — ya no necesita
 * distinguir mobile/desktop ni prefers-reduced-motion "a mano": framer
 * ya respeta la preferencia del sistema vía el MotionConfig global
 * (app/providers.tsx).
 */

const MOSS = "#7A8B5C";
const MOSS_DARK = "#5C6B45";
const INK_SOFT = "#6B6862";
const HAIRLINE = "#DEDBD1";
const PAPER = "#FAFAF7";

const axisStyle = { fontSize: 12, fill: INK_SOFT, fontFamily: "inherit" };
const tooltipStyle = {
  backgroundColor: PAPER,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 4,
  fontSize: 12,
  color: "#2E2C28",
};

function ChartBlock({
  title,
  caption,
  children,
}: {
  title: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="w-full max-w-2xl rounded-sm border border-hairline bg-paper p-6 sm:p-8">
      <h3 className="font-sans text-sm font-medium text-ink lg:text-base">
        {title}
      </h3>
      <div className="mt-6 h-64 w-full sm:h-80 lg:h-[420px]">{children}</div>
      <figcaption className="mt-4 font-sans text-xs text-ink-soft">
        {caption}
      </figcaption>
    </figure>
  );
}

/** Los tres gráficos — SOLO datos reales del análisis 1990–2022
 *  (NOSTOS/INEC): tasas de los 10 cantones, distribución de los 28 en
 *  despoblación persistente, y promedio por zona del scrollytelling. */
function useChartPanels() {
  const { t, lang } = useLanguage();
  const cantons = useStudyCantons();

  const topTen = cantons.map((canton) => ({
    name: canton.name,
    rate: canton.annual_rate,
    province: canton.province,
  }));

  // 2) Los 28 cantones en despoblación persistente, por categoría
  //    (7 críticos, 3 leves, 18 moderados — mapa cantonal del cliente).
  const categoryLabel: Record<string, string> = {
    critical: t.numbers.catCritical,
    mild: t.numbers.catMild,
    moderate: t.numbers.catModerate,
  };
  const categories = persistentByCategory.map((entry) => ({
    name: categoryLabel[entry.id],
    n: entry.n,
    id: entry.id,
  }));

  // 3) Tasa promedio por zona (derivada de las tasas reales de cada zona).
  const zoneAverages = zones
    .filter((zone) => zone.cantons.length > 0)
    .map((zone) => ({
      name: zone.title[lang],
      avg:
        Math.round(
          (zone.cantons.reduce((sum, c) => sum + c.rate, 0) /
            zone.cantons.length) *
            100,
        ) / 100,
    }));

  return [
    <ChartBlock
      key="topten"
      title={t.numbers.chart1Title}
      caption={t.numbers.chart1Caption}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={topTen}
          margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            stroke={HAIRLINE}
            strokeDasharray="2 4"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ ...axisStyle, fontSize: 10 }}
            stroke={HAIRLINE}
            tickLine={false}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={58}
          />
          <YAxis
            tick={axisStyle}
            stroke={HAIRLINE}
            tickLine={false}
            width={44}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => [`${value}%`, t.numbers.rateAxis]}
            labelFormatter={(label, payload) =>
              `${label} · ${payload?.[0]?.payload?.province ?? ""}`
            }
          />
          <Bar dataKey="rate" radius={[0, 0, 2, 2]}>
            {topTen.map((entry) => (
              <Cell
                key={entry.name}
                fill={entry.rate <= -1 ? MOSS_DARK : MOSS}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartBlock>,

    <ChartBlock
      key="categories"
      title={t.numbers.chart2Title}
      caption={t.numbers.chart2Caption}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={categories}
          layout="vertical"
          margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
        >
          <CartesianGrid
            stroke={HAIRLINE}
            strokeDasharray="2 4"
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={axisStyle}
            stroke={HAIRLINE}
            tickLine={false}
            allowDecimals={false}
            domain={[0, 20]}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={axisStyle}
            stroke={HAIRLINE}
            tickLine={false}
            width={90}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => [value, t.numbers.cantonsAxis]}
          />
          <Bar dataKey="n" radius={[0, 2, 2, 0]} barSize={26}>
            {categories.map((entry) => (
              <Cell
                key={entry.id}
                fill={
                  entry.id === "critical"
                    ? MOSS_DARK
                    : entry.id === "mild"
                      ? MOSS
                      : "#C7CEB9"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartBlock>,

    <ChartBlock
      key="zones"
      title={t.numbers.chart3Title}
      caption={t.numbers.chart3Caption}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={zoneAverages}
          margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            stroke={HAIRLINE}
            strokeDasharray="2 4"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ ...axisStyle, fontSize: 10 }}
            stroke={HAIRLINE}
            tickLine={false}
            interval={0}
            angle={-16}
            textAnchor="end"
            height={58}
          />
          <YAxis
            tick={axisStyle}
            stroke={HAIRLINE}
            tickLine={false}
            width={44}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => [`${value}%`, t.numbers.rateAxis]}
          />
          <Bar dataKey="avg" radius={[0, 0, 2, 2]}>
            {zoneAverages.map((entry) => (
              <Cell
                key={entry.name}
                fill={entry.avg <= -0.8 ? MOSS_DARK : MOSS}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartBlock>,
  ];
}

function IntroPanel() {
  const { t } = useLanguage();
  return (
    <div className="max-w-xl text-center">
      <h2 className="font-serif text-3xl font-light text-ink sm:text-4xl">
        {t.numbers.title}
      </h2>
      <p className="mt-4 font-sans text-base leading-relaxed text-ink-soft">
        {t.numbers.intro}
      </p>
    </div>
  );
}

/** Flecha de navegación (izquierda/derecha), mismo trazo minimal que el
 *  botón de cierre de los paneles (ParishPanel/ProvincePanel). */
function ArrowButton({
  direction,
  onClick,
  label,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-hairline text-ink-soft transition-colors duration-200 hover:border-moss-dark hover:text-moss-dark"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d={direction === "prev" ? "M10 2L4 8l6 6" : "M6 2l6 6-6 6"}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

const SWIPE_THRESHOLD = 60;

export function Numbers() {
  const { t } = useLanguage();
  const panels = useChartPanels();
  const total = panels.length;

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = avanza, -1 = retrocede

  const goTo = (next: number) => {
    setDirection(next > index ? 1 : -1);
    setIndex((next + total) % total);
  };
  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  const onDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (info.offset.x < -SWIPE_THRESHOLD) next();
    else if (info.offset.x > SWIPE_THRESHOLD) prev();
  };

  return (
    <section className="bg-paper-alt px-6 py-24 sm:py-32">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-10">
        <IntroPanel />

        {/* ── Galería ──────────────────────────────────────────────── */}
        <div className="relative w-full overflow-hidden">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              initial={{ x: direction >= 0 ? 48 : -48, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction >= 0 ? -48 : 48, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={onDragEnd}
              className="flex cursor-grab justify-center active:cursor-grabbing"
            >
              {panels[index]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Controles: flechas + puntos ─────────────────────────────── */}
        <div className="flex items-center gap-6">
          <ArrowButton
            direction="prev"
            onClick={prev}
            label={t.numbersFlow.prev}
          />

          <div className="flex items-center gap-2">
            {panels.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`${t.numbersFlow.goTo} ${i + 1}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-6 bg-moss-dark"
                    : "w-1.5 bg-hairline hover:bg-moss/60"
                }`}
              />
            ))}
          </div>

          <ArrowButton
            direction="next"
            onClick={next}
            label={t.numbersFlow.next}
          />
        </div>

        <p className="font-sans text-xs uppercase tracking-[0.2em] text-ink-soft">
          {index + 1} {t.numbersFlow.of} {total} · {t.numbersFlow.hint}
        </p>
      </div>
    </section>
  );
}

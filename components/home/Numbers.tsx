"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsapClient";
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
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cantons, persistentByCategory } from "@/data/cantons";
import { zones } from "@/data/cantonalStudy";

/**
 * 5. Lo que Dicen los Números — scroll horizontal con GSAP ScrollTrigger.
 *
 * Desktop: la sección se ancla (pin) y el carril se traslada de izquierda
 * a derecha con scrub. La distancia se calcula desde el ancho REAL del
 * carril (scrollWidth − viewport), así el recorrido siempre muestra
 * todos los paneles completos y termina exactamente al final — sin
 * desfases con el alto de la página (invalidateOnRefresh recalcula al
 * redimensionar).
 *
 * Degradaciones (decisión de diseño):
 * - Mobile/tablet (<1024px): el scroll horizontal secuestrado frustra en
 *   táctil → se apilan los paneles en vertical (layout original).
 * - prefers-reduced-motion: misma pila vertical, sin traslación.
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
    <figure className="w-full max-w-2xl rounded-sm border border-hairline bg-paper p-6 sm:p-8 lg:w-[62vw] lg:max-w-[960px]">
      <h3 className="font-sans text-sm font-medium text-ink lg:text-base">{title}</h3>
      {/* En el carril (lg+) el gráfico crece a media pantalla de alto. */}
      <div className="mt-6 h-64 w-full lg:h-[46vh] lg:min-h-[340px]">{children}</div>
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

  // 1) Los diez cantones con mayor decrecimiento (tasa anual).
  const topTen = cantons.map((canton) => ({
    name: canton.name,
    rate: canton.rate,
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
        <BarChart data={topTen} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={HAIRLINE} strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="name" tick={{ ...axisStyle, fontSize: 10 }} stroke={HAIRLINE}
            tickLine={false} interval={0} angle={-30} textAnchor="end" height={58} />
          <YAxis tick={axisStyle} stroke={HAIRLINE} tickLine={false} width={44} />
          <Tooltip contentStyle={tooltipStyle}
            formatter={(value) => [`${value}%`, t.numbers.rateAxis]}
            labelFormatter={(label, payload) =>
              `${label} · ${payload?.[0]?.payload?.province ?? ""}`} />
          <Bar dataKey="rate" radius={[0, 0, 2, 2]}>
            {topTen.map((entry) => (
              <Cell key={entry.name} fill={entry.rate <= -1 ? MOSS_DARK : MOSS} />
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
        <BarChart data={categories} layout="vertical"
          margin={{ top: 8, right: 24, left: 8, bottom: 0 }}>
          <CartesianGrid stroke={HAIRLINE} strokeDasharray="2 4" horizontal={false} />
          <XAxis type="number" tick={axisStyle} stroke={HAIRLINE} tickLine={false}
            allowDecimals={false} domain={[0, 20]} />
          <YAxis type="category" dataKey="name" tick={axisStyle} stroke={HAIRLINE}
            tickLine={false} width={90} />
          <Tooltip contentStyle={tooltipStyle}
            formatter={(value) => [value, t.numbers.cantonsAxis]} />
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
        <BarChart data={zoneAverages} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={HAIRLINE} strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="name" tick={{ ...axisStyle, fontSize: 10 }} stroke={HAIRLINE}
            tickLine={false} interval={0} angle={-16} textAnchor="end" height={58} />
          <YAxis tick={axisStyle} stroke={HAIRLINE} tickLine={false} width={44} />
          <Tooltip contentStyle={tooltipStyle}
            formatter={(value) => [`${value}%`, t.numbers.rateAxis]} />
          <Bar dataKey="avg" radius={[0, 0, 2, 2]}>
            {zoneAverages.map((entry) => (
              <Cell key={entry.name} fill={entry.avg <= -0.8 ? MOSS_DARK : MOSS} />
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
    <div className="max-w-xl text-center lg:text-left">
      <h2 className="font-serif text-3xl font-light text-ink sm:text-4xl">
        {t.numbers.title}
      </h2>
      <p className="mt-4 font-sans text-base leading-relaxed text-ink-soft">
        {t.numbers.intro}
      </p>
    </div>
  );
}

export function Numbers() {
  const { t } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const panels = useChartPanels();

  // El carril horizontal solo en pantallas anchas.
  const [horizontal, setHorizontal] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setHorizontal(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // ── Coreografía GSAP: pin de la sección + traslación del carril ─────
  useEffect(() => {
    if (!horizontal || reducedMotion) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      // Distancia real a recorrer: lo que el carril excede del viewport.
      const distance = () => track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`, // 1px de scroll = 1px de carril
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) {
              gsap.set(progressRef.current, { scaleX: self.progress });
            }
          },
        },
      });
    }, section);

    // Recalcular anclas cuando el resto de la página termina de montar.
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [horizontal, reducedMotion]);

  // ── Fallback vertical (mobile / reduced motion) ─────────────────────
  if (!horizontal || reducedMotion) {
    return (
      <section className="bg-paper-alt px-6 py-24 sm:py-32">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-10">
          <IntroPanel />
          {panels}
        </div>
      </section>
    );
  }

  // ── Carril horizontal (desktop, GSAP) ───────────────────────────────
  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-paper-alt"
    >
      {/* Paneles ajustados a su contenido y con separación contenida:
          los gráficos dominan el viewport en lugar de flotar pequeños. */}
      <div
        ref={trackRef}
        className="flex h-screen w-max items-center gap-20 px-[8vw] will-change-transform"
      >
        <div className="w-[38vw] max-w-xl shrink-0">
          <IntroPanel />
        </div>
        {panels.map((panel, i) => (
          <div key={i} className="shrink-0">
            {panel}
          </div>
        ))}
      </div>

      {/* Pista de lectura + progreso del recorrido. */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ink-soft">
          {t.numbersFlow.scrollHint}
        </span>
        <div className="h-px w-40 bg-hairline">
          <div ref={progressRef} className="h-px origin-left scale-x-0 bg-moss" />
        </div>
      </div>
    </section>
  );
}

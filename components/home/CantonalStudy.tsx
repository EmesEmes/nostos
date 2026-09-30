"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { gsap } from "@/lib/gsapClient";
import { provinceShapes, MAP_HEIGHT, MAP_WIDTH } from "@/data/provinceShapes";
import { zones } from "@/data/cantonalStudy";

/**
 * Hallazgo territorial (scrollytelling cantonal) — versión GSAP.
 *
 * Mapa SVG fijo (sticky) a la izquierda; a la derecha, una parada por
 * zona. ScrollTrigger detecta la parada activa (banda central del
 * viewport) y GSAP anima el zoom del mapa hacia esa zona.
 *
 * Ritmo del recorrido: cada parada ocupa un viewport (min-h-[80vh],
 * centrada), y la ÚLTIMA termina la columna sin espacio extra — así
 * "Focos dispersos" queda a la altura del mapa y el scroll continúa de
 * inmediato hacia la siguiente sección, sin tramo muerto.
 *
 * ⚠️ Resaltado a nivel PROVINCIA como placeholder: con la geometría ADM2
 * del cliente se pasa a cantones individuales sin cambiar la mecánica
 * (ver data/cantonalStudy.ts).
 *
 * prefers-reduced-motion: el zoom se aplica sin animación (set en vez de
 * tween); el contenido es texto normal y no depende del movimiento.
 */

// El SVG usa y hacia abajo: se invierte la y del espacio del mapa.
function toPath(ring: [number, number][]): string {
  return (
    ring
      .map(
        ([x, y], i) =>
          `${i === 0 ? "M" : "L"}${x.toFixed(3)},${(MAP_HEIGHT - y).toFixed(3)}`,
      )
      .join("") + "Z"
  );
}

/** Encuadre por zona: translate + scale que lleva el bbox de sus
 *  provincias a ocupar el viewBox completo, con margen. */
function zoneTransform(provinceIds: string[]) {
  if (provinceIds.length === 0) return { x: 0, y: 0, scale: 1 };
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const shape of provinceShapes) {
    if (!provinceIds.includes(shape.id)) continue;
    for (const ring of shape.rings) {
      for (const [x, y] of ring) {
        const sy = MAP_HEIGHT - y;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (sy < minY) minY = sy;
        if (sy > maxY) maxY = sy;
      }
    }
  }
  const w = maxX - minX;
  const h = maxY - minY;
  const scale = Math.min(MAP_WIDTH / w, MAP_HEIGHT / h) * 0.72;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  return {
    x: MAP_WIDTH / 2 - scale * cx,
    y: MAP_HEIGHT / 2 - scale * cy,
    scale,
  };
}

export function CantonalStudy() {
  const { t, lang } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const mapGroupRef = useRef<SVGGElement>(null);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);

  const transforms = useMemo(
    () => zones.map((zone) => zoneTransform(zone.provinces)),
    [],
  );
  const activeZone = zones[active];

  // ── Detección de parada activa ──────────────────────────────────────
  // IntersectionObserver con banda central del viewport, en lugar de
  // ScrollTrigger: los triggers posicionales cachean sus anclas al montar
  // y el pin de la sección de Números (arriba) inserta su espaciador
  // DESPUÉS, desplazando esas anclas → el mapa se adelantaba a las
  // tarjetas. El IO mide geometría en tiempo real y es inmune a eso.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = stepRefs.current.indexOf(entry.target as HTMLElement);
          if (index !== -1) setActive(index);
        }
      },
      // Banda central: una parada es "activa" cuando cruza el 45–55%
      // del alto del viewport.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    stepRefs.current.forEach((step) => step && observer.observe(step));
    return () => observer.disconnect();
  }, []);

  // ── Zoom del mapa hacia la zona activa ──────────────────────────────
  useEffect(() => {
    const group = mapGroupRef.current;
    if (!group) return;
    const tf = transforms[active];
    // En SVG, las unidades px de los transforms CSS = unidades de usuario.
    gsap.to(group, {
      x: tf.x,
      y: tf.y,
      scale: tf.scale,
      transformOrigin: "0 0",
      duration: reducedMotion ? 0 : 1,
      ease: "power3.inOut",
      overwrite: "auto",
    });
  }, [active, transforms, reducedMotion]);

  const rateFormat = (rate: number) =>
    `${rate > 0 ? "+" : ""}${rate.toFixed(2).replace(".", lang === "es" ? "," : ".")}%`;

  return (
    <section ref={sectionRef} className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="text-center font-sans text-xs uppercase tracking-[0.35em] text-moss">
          {t.cantonal.kicker}
        </p>
        <h2 className="mt-3 text-center font-serif text-3xl font-light text-ink sm:text-4xl">
          {t.cantonal.title}
        </h2>
        <p className="mx-auto mt-4 max-w-lectura text-center font-sans text-base leading-relaxed text-ink-soft">
          {t.cantonal.intro}
        </p>

        <div className="mt-16 grid gap-x-10 lg:grid-cols-2">
          {/* ── Mapa fijo ──────────────────────────────────────────────── */}
          <div className="top-[12vh] h-[38vh] lg:sticky lg:h-[76vh]">
            <svg
              viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
              className="h-full w-full"
              role="img"
              aria-label={t.cantonal.title}
            >
              <g ref={mapGroupRef}>
                {provinceShapes.map((shape) => {
                  const highlighted = activeZone.provinces.includes(shape.id);
                  const overview = activeZone.provinces.length === 0;
                  return shape.rings.map((ring, i) => (
                    <path
                      key={`${shape.id}-${i}`}
                      d={toPath(ring)}
                      fill={
                        highlighted
                          ? "#7A8B5C"
                          : overview
                            ? "#EBEDE4"
                            : "#F0EFE8"
                      }
                      stroke="#5C6B45"
                      strokeWidth={0.014}
                      strokeLinejoin="round"
                      style={{
                        transition: "fill 600ms ease, opacity 600ms ease",
                        opacity: highlighted || overview ? 1 : 0.55,
                      }}
                    />
                  ));
                })}
              </g>
            </svg>
          </div>

          {/* ── Paradas narrativas ─────────────────────────────────────── */}
          {/* Cada parada = un viewport centrado; la última cierra la
              columna a la altura del mapa (sin colchón posterior). */}
          <div>
            {zones.map((zone, index) => (
              <article
                key={zone.id}
                ref={(el) => {
                  stepRefs.current[index] = el;
                }}
                className="flex min-h-[80vh] items-center lg:min-h-[76vh]"
              >
                <div className="w-full rounded-sm border border-hairline bg-paper p-7">
                  <h3 className="font-serif text-xl font-medium text-ink sm:text-2xl">
                    {zone.title[lang]}
                  </h3>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-ink">
                    {zone.narrative[lang]}
                  </p>

                  {zone.cantons.length > 0 && (
                    <ul className="mt-5 space-y-1.5 border-t border-hairline pt-4">
                      {zone.cantons.map((canton) => (
                        <li
                          key={canton.name}
                          className="flex items-baseline justify-between gap-3"
                        >
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
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center font-sans text-xs text-ink-soft">
          {t.cantonal.sourceNote}
        </p>
      </div>
    </section>
  );
}

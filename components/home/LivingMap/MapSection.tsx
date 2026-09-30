"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { dynamicColors } from "@/data/provinceDynamics";
import type { ProvinceShape } from "@/data/provinceShapes";
import { ProvinceMap2D } from "./ProvinceMap2D";
import { ProvincePanel } from "./ProvincePanel";

/**
 * 3. El Mapa Vivo — pieza central interactiva.
 *
 * Versión 2D (reemplaza la anterior versión 3D en three.js): un único
 * SVG con las 24 provincias siempre visibles por completo, coloreadas
 * según su dinámica poblacional real (data/provinceDynamics.ts). Cada
 * provincia es clickeable/accesible por teclado y abre su ficha en
 * ProvincePanel.tsx — mismo mecanismo de panel lateral que antes, ahora
 * a nivel de provincia en vez de cantón.
 *
 * Al ser SVG (liviano) no necesita el lazy-load ni los observers de
 * montaje que sí justificaba el bundle de three.js.
 */
export function MapSection() {
  const { t, lang } = useLanguage();
  const [selected, setSelected] = useState<ProvinceShape | null>(null);

  return (
    <section className="px-0 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="mb-3 font-serif text-lg font-light italic text-ink-soft">
          {t.map.lead}
        </p>
        <h2 className="font-serif text-3xl font-light text-ink sm:text-4xl">
          {t.map.title}
        </h2>
        <p className="mt-4 font-sans text-base leading-relaxed text-ink-soft">
          {t.map.intro}
        </p>
      </div>

      {/* Contenedor del mapa: ancho máximo + relación de aspecto real del
          espacio de coordenadas (MAP_WIDTH × MAP_HEIGHT), así el SVG nunca
          se recorta ni deja aire de sobra. */}
      <div className="relative mx-auto mt-10 w-full max-w-4xl px-6">
        <div className="aspect-[10/5.891] w-full">
          <ProvinceMap2D
            selectedId={selected?.id ?? null}
            onSelect={setSelected}
          />
        </div>

        {/* Leyenda del coropleto (dinámica poblacional). */}
        <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-sm border border-hairline bg-paper/90 px-3 py-2 backdrop-blur-sm sm:inset-x-auto sm:bottom-auto sm:left-10 sm:top-4 sm:px-4 sm:py-3">
          <p className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-ink">
            {t.map.legendTitle}
          </p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 sm:block sm:space-y-1.5">
            {(
              [
                ["decline", t.map.legendDecline],
                ["weak", t.map.legendWeak],
                ["normal", t.map.legendNormal],
              ] as const
            ).map(([key, label]) => (
              <li key={key} className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-[2px] border border-hairline"
                  style={{ backgroundColor: dynamicColors[key] }}
                  aria-hidden="true"
                />
                <span className="font-sans text-[11px] text-ink-soft">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pista de interacción: ya no depende de detectar touch, porque
            no hay gesto de arrastre que distinguir del tap/click. */}
        <p className="pointer-events-none mt-4 text-center font-sans text-[11px] text-ink-soft">
          {t.map.mobileHint}
        </p>
      </div>

      {/* Lectura provincial (texto del cliente): el hallazgo que la
          leyenda del coropleto resume. */}
      <div className="mx-auto mt-16 max-w-lectura px-6">
        <h3 className="font-serif text-2xl font-light leading-snug text-ink">
          {t.map.provincial.title}
        </h3>
        <p className="mt-5 font-sans text-base leading-relaxed text-ink">
          {t.map.provincial.p1}
        </p>
        <p className="mt-4 font-sans text-base leading-relaxed text-ink">
          {t.map.provincial.p2}
        </p>
      </div>

      {/* Panel lateral con la ficha de la provincia seleccionada. */}
      <ProvincePanel
        province={selected}
        lang={lang}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}

"use client";

import {
  provinceShapes,
  MAP_WIDTH,
  MAP_HEIGHT,
  type ProvinceShape,
} from "@/data/provinceShapes";
import { provinceDynamics, dynamicColors } from "@/data/provinceDynamics";
import { useLanguage } from "@/lib/LanguageContext";

/**
 * Mapa 2D de las 24 provincias, siempre visible completo (sin zoom por
 * scroll, a diferencia de CantonalStudy.tsx). Cada provincia se colorea
 * según su dinámica poblacional real (data/provinceDynamics.ts) y es
 * clickeable + accesible por teclado: abre su ficha (ver ProvincePanel.tsx).
 *
 * Reutiliza la misma geometría y el mismo helper toPath que
 * CantonalStudy.tsx (data/provinceShapes.ts).
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

type Props = {
  selectedId: string | null;
  onSelect: (province: ProvinceShape) => void;
};

export function ProvinceMap2D({ selectedId, onSelect }: Props) {
  const { t } = useLanguage();

  return (
    <svg
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      className="h-full w-full"
      role="img"
      aria-label={t.map.title}
    >
      {provinceShapes.map((shape) => {
        const dynamic = provinceDynamics[shape.id] ?? "normal";
        const isSelected = shape.id === selectedId;
        return (
          <g
            key={shape.id}
            role="button"
            tabIndex={0}
            aria-label={shape.name}
            aria-pressed={isSelected}
            onClick={() => onSelect(shape)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(shape);
              }
            }}
            className="cursor-pointer outline-none transition-opacity duration-200 hover:opacity-80 focus-visible:opacity-80"
          >
            {shape.rings.map((ring, i) => (
              <path
                key={`${shape.id}-${i}`}
                d={toPath(ring)}
                fill={dynamicColors[dynamic]}
                stroke={isSelected ? "#3F4A2E" : "#5C6B45"}
                strokeWidth={isSelected ? 0.032 : 0.014}
                strokeLinejoin="round"
                style={{ transition: "stroke-width 200ms ease" }}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

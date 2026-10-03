"use client";

import { useRef } from "react";
import { MAP_HEIGHT, MAP_WIDTH, provinceShapes } from "@/data/provinceShapes";

type Point = { x: number; y: number };

type Props = {
  point: Point | null;
  provinceId: string;
  onPick: (point: Point, provinceId: string | null) => void;
  onClear: () => void;
};

const MAINLAND_VIEWBOX = `4.6 0 ${MAP_WIDTH - 4.6} ${MAP_HEIGHT}`;

function toPath(ring: [number, number][]) {
  return (
    ring
      .map(
        ([x, y], i) =>
          `${i === 0 ? "M" : "L"}${x.toFixed(3)},${(MAP_HEIGHT - y).toFixed(3)}`,
      )
      .join("") + "Z"
  );
}

function insideRing([px, py]: [number, number], ring: [number, number][]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi)
      inside = !inside;
  }
  return inside;
}

function provinceAt(point: [number, number]) {
  return (
    provinceShapes.find((province) =>
      province.rings.some((ring) => insideRing(point, ring)),
    )?.id ?? null
  );
}

export function MapPicker({ point, provinceId, onPick, onClear }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const viewBox =
    provinceId === "galapagos"
      ? `0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`
      : MAINLAND_VIEWBOX;

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    const matrix = svg?.getScreenCTM();
    if (!svg || !matrix) return;
    const cursor = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    const x = Number(cursor.x.toFixed(3));
    const y = Number((MAP_HEIGHT - cursor.y).toFixed(3));
    onPick({ x, y }, provinceAt([x, y]));
  };

  return (
    <div>
      <svg
        ref={svgRef}
        viewBox={viewBox}
        onClick={handleClick}
        role="img"
        aria-label="Mapa del Ecuador: haz clic para ubicar el lugar"
        className="aspect-[5/5.4] w-full max-w-md cursor-crosshair rounded-sm border border-hairline bg-paper"
      >
        {provinceShapes.map((province) => (
          <g key={province.id}>
            {province.rings.map((ring, index) => (
              <path
                key={index}
                d={toPath(ring)}
                fill={
                  province.id === provinceId
                    ? "var(--paper-alt)"
                    : "var(--paper)"
                }
                stroke={
                  province.id === provinceId
                    ? "var(--moss-dark)"
                    : "var(--hairline)"
                }
                strokeWidth={province.id === provinceId ? 0.02 : 0.012}
              />
            ))}
          </g>
        ))}
        {point && (
          <circle
            cx={point.x}
            cy={MAP_HEIGHT - point.y}
            r={0.06}
            fill="var(--moss)"
            stroke="var(--paper)"
            strokeWidth={0.02}
          />
        )}
      </svg>
      <div className="mt-2 flex flex-wrap items-center gap-3 font-sans text-xs text-ink-soft">
        {point ? (
          <>
            <span>
              Punto: {point.x}, {point.y}
            </span>
            <button
              type="button"
              onClick={onClear}
              className="text-moss-dark underline underline-offset-2"
            >
              Quitar punto
            </button>
          </>
        ) : (
          <span>
            Haz clic sobre el mapa para ubicar el lugar. Al hacerlo se elige
            también su provincia.
          </span>
        )}
      </div>
    </div>
  );
}

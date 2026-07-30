/**
 * Provincias de Ecuador para el Mapa Vivo.
 *
 * La geometría (real, simplificada) vive en data/provinceShapes.ts,
 * generada desde Natural Earth 10m Admin-1 — ver el comentario de cabecera
 * de ese archivo para la procedencia, el pipeline de simplificación y cómo
 * sustituirla por límites oficiales (IGM/INEC o geoBoundaries) si se
 * necesita más fidelidad. Aquí solo se derivan: centro del mapa, orden de
 * caída y el "aire" entre piezas.
 */

import {
  provinceShapes,
  MAP_WIDTH,
  MAP_HEIGHT,
  type ProvinceShape,
} from "./provinceShapes";

export type ProvinceDef = ProvinceShape;
export type Ring = [number, number][];

/** Centro del espacio del mapa (para centrar la escena en el origen). */
export const MAP_CENTER: [number, number] = [MAP_WIDTH / 2, MAP_HEIGHT / 2];

export const provinces: ProvinceDef[] = provinceShapes;

/**
 * "Aire" entre piezas: cada polígono se contrae un 1.5% alrededor de su
 * centroide. Dos motivos:
 *  - refuerza la lectura de piezas independientes (un país que se fragmenta);
 *  - evita z-fighting entre caras laterales de provincias vecinas, que en
 *    los datos reales comparten segmentos de frontera idénticos.
 */
const BREATHING = 0.985;

export function getProvinceRings(p: ProvinceDef): Ring[] {
  return p.rings.map((ring) => {
    const cx = ring.reduce((s, pt) => s + pt[0], 0) / ring.length;
    const cy = ring.reduce((s, pt) => s + pt[1], 0) / ring.length;
    return ring.map(
      ([x, y]) =>
        [cx + (x - cx) * BREATHING, cy + (y - cy) * BREATHING] as [
          number,
          number,
        ],
    );
  });
}

/**
 * Orden de caída: barrido diagonal noroeste → sureste.
 * Se ordena por (x − y): valores bajos = arriba-izquierda, altos = abajo-derecha.
 */
export const fallOrder: string[] = [...provinces]
  .sort((a, b) => a.center[0] - a.center[1] - (b.center[0] - b.center[1]))
  .map((p) => p.id);

/** Índice de caída por provincia (0 = primera en caer). */
export const fallIndex: Record<string, number> = Object.fromEntries(
  fallOrder.map((id, i) => [id, i]),
);

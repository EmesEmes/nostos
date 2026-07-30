/**
 * Los 10 cantones con mayor decrecimiento poblacional del Ecuador.
 *
 * Fuente ÚNICA: el análisis cantonal del cliente (NOSTOS, INEC censos
 * 1990–2022) — las mismas tasas del mapa cantonal de junio 2026, sin
 * datos inventados. Son los marcadores del Mapa Vivo, las tarjetas de la
 * sección "Los diez cantones" y las páginas /cantones/[slug].
 *
 * `position`: cabecera cantonal proyectada con el mismo pipeline que la
 * geometría de provincias (equirectangular normalizada, ver
 * provinceShapes.ts). `zoneId` enlaza con la zona del scrollytelling
 * (data/cantonalStudy.ts) para reutilizar su narrativa real.
 */

export type Canton = {
  slug: string;
  name: string;
  province: string;
  provinceId: string;
  /** Cabecera cantonal [x, y] en el espacio del mapa. */
  position: [number, number];
  /** Tasa de crecimiento anual promedio 1990–2022 (%). */
  rate: number;
  /** Zona del análisis (id en data/cantonalStudy.ts). */
  zoneId: string;
};

export const cantons: Canton[] = [
  { slug: "pucara", name: "Pucará", province: "Azuay", provinceId: "azuay", position: [6.13, 1.64], rate: -1.67, zoneId: "azuay-eloro-morona" },
  { slug: "paltas", name: "Paltas", province: "Loja", provinceId: "loja", position: [5.96, 0.87], rate: -1.21, zoneId: "loja" },
  { slug: "chaguarpamba", name: "Chaguarpamba", province: "Loja", provinceId: "loja", position: [5.97, 1.03], rate: -1.13, zoneId: "loja" },
  { slug: "gonzanama", name: "Gonzanamá", province: "Loja", provinceId: "loja", position: [6.16, 0.71], rate: -1.07, zoneId: "loja" },
  { slug: "quilanga", name: "Quilanga", province: "Loja", provinceId: "loja", position: [6.19, 0.64], rate: -1.04, zoneId: "loja" },
  { slug: "sozoranga", name: "Sozoranga", province: "Loja", provinceId: "loja", position: [5.83, 0.62], rate: -1.04, zoneId: "loja" },
  { slug: "olmedo", name: "Olmedo", province: "Loja", provinceId: "loja", position: [5.96, 0.98], rate: -0.98, zoneId: "loja" },
  { slug: "alausi", name: "Alausí", province: "Chimborazo", provinceId: "chimborazo", position: [6.69, 2.57], rate: -0.83, zoneId: "chimborazo-canar" },
  { slug: "espindola", name: "Espíndola", province: "Loja", provinceId: "loja", position: [6.16, 0.39], rate: -0.79, zoneId: "loja" },
  { slug: "chunchi", name: "Chunchi", province: "Chimborazo", provinceId: "chimborazo", position: [6.62, 2.5], rate: -0.74, zoneId: "chimborazo-canar" },
];

/** Distribución de los 28 cantones en despoblación persistente por
 *  categoría, según el mapa cantonal del cliente (junio 2026). */
export const persistentByCategory = [
  { id: "critical", n: 7 },
  { id: "mild", n: 3 },
  { id: "moderate", n: 18 },
];

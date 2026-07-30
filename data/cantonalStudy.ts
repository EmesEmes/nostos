/**
 * Estudio cantonal — datos del mapa entregado por el cliente
 * ("Dinámica del crecimiento poblacional a nivel cantonal, 1990–2022",
 * fuente INEC, junio 2026). Las tasas son las del propio mapa.
 *
 * ⚠️ PLACEHOLDER PARCIAL: cuando el cliente entregue el shapefile/Excel de
 * origen, verificar tasas y añadir la geometría ADM2 (cantones) para
 * resaltar cantones individuales en lugar de provincias completas.
 * El resaltado actual usa las provincias que contienen cada zona.
 */

export type CantonRate = { name: string; rate: number };

export type Zone = {
  id: string;
  /** Provincias (ids de provinceShapes.ts) que se resaltan y encuadran. */
  provinces: string[];
  title: { es: string; en: string };
  narrative: { es: string; en: string };
  cantons: CantonRate[];
};

export const zones: Zone[] = [
  {
    id: "overview",
    provinces: [],
    title: { es: "El país completo", en: "The whole country" },
    narrative: {
      es: "Visto de lejos, Ecuador crece. Visto de cerca, 28 cantones sostienen tasas negativas desde 1990 — y cuatro zonas concentran el fenómeno.",
      en: "From afar, Ecuador is growing. Up close, 28 cantons have sustained negative rates since 1990 — and four zones concentrate the phenomenon.",
    },
    cantons: [],
  },
  {
    id: "loja",
    provinces: ["loja"],
    title: { es: "Loja: el epicentro", en: "Loja: the epicenter" },
    narrative: {
      es: "Ningún lugar del país pierde población como el sur de Loja. Siete cantones en nivel crítico, con Paltas y Chaguarpamba perdiendo más del 1% de su gente cada año, sostenidamente, durante tres décadas.",
      en: "Nowhere in the country loses population like southern Loja. Seven cantons at critical level, with Paltas and Chaguarpamba losing more than 1% of their people every year, steadily, for three decades.",
    },
    cantons: [
      { name: "Paltas", rate: -1.21 },
      { name: "Chaguarpamba", rate: -1.13 },
      { name: "Gonzanamá", rate: -1.07 },
      { name: "Quilanga", rate: -1.04 },
      { name: "Sozoranga", rate: -1.04 },
      { name: "Olmedo", rate: -0.98 },
      { name: "Espíndola", rate: -0.79 },
      { name: "Calvas", rate: -0.38 },
      { name: "Macará", rate: -0.01 },
      { name: "Celica", rate: 0.01 },
    ],
  },
  {
    id: "azuay-eloro-morona",
    provinces: ["azuay", "el-oro", "morona-santiago"],
    title: {
      es: "Azuay, El Oro y Morona Santiago",
      en: "Azuay, El Oro and Morona Santiago",
    },
    narrative: {
      es: "Pucará, en el alto Azuay, registra la tasa más severa de todo el análisis: −1.67% anual. Alrededor, un corredor de cantones de montaña se vacía hacia Cuenca, Machala y el exterior.",
      en: "Pucará, in upper Azuay, records the most severe rate in the whole analysis: −1.67% a year. Around it, a corridor of mountain cantons empties toward Cuenca, Machala and abroad.",
    },
    cantons: [
      { name: "Pucará", rate: -1.67 },
      { name: "Limón Indanza", rate: -0.71 },
      { name: "Chilla", rate: -0.64 },
      { name: "Nabón", rate: -0.59 },
      { name: "San Fernando", rate: -0.44 },
      { name: "El Pan", rate: -0.32 },
      { name: "Girón", rate: -0.25 },
      { name: "Sígsig", rate: -0.01 },
    ],
  },
  {
    id: "chimborazo-canar",
    provinces: ["chimborazo", "canar"],
    title: { es: "Chimborazo y Cañar", en: "Chimborazo and Cañar" },
    narrative: {
      es: "En la sierra centro-sur, Alausí, Chunchi y Cañar pierden población a ritmos cercanos al −0.8% anual. Es la zona con la huella migratoria internacional más antigua del país.",
      en: "In the south-central highlands, Alausí, Chunchi and Cañar lose population at rates near −0.8% a year. It is the zone with the country's oldest international migration footprint.",
    },
    cantons: [
      { name: "Alausí", rate: -0.83 },
      { name: "Chunchi", rate: -0.74 },
      { name: "Cañar", rate: -0.72 },
      { name: "Biblián", rate: -0.52 },
      { name: "Déleg", rate: -0.09 },
      { name: "Suscal", rate: 0.14 },
    ],
  },
  {
    id: "focos-dispersos",
    provinces: ["bolivar", "cotopaxi", "carchi", "manabi"],
    title: { es: "Focos dispersos", en: "Scattered pockets" },
    narrative: {
      es: "La despoblación no es solo un fenómeno del sur: Jama en la costa manabita, Sigchos en el páramo de Cotopaxi y Chimbo en Bolívar muestran que el patrón asoma en todas las regiones.",
      en: "Depopulation is not only a southern phenomenon: Jama on the Manabí coast, Sigchos in the Cotopaxi páramo and Chimbo in Bolívar show the pattern surfacing in every region.",
    },
    cantons: [
      { name: "Jama", rate: -0.62 },
      { name: "Sigchos", rate: -0.36 },
      { name: "Chimbo", rate: -0.02 },
      { name: "Montúfar", rate: 0.01 },
    ],
  },
];

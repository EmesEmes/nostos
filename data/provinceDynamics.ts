/**
 * Clasificación de dinámica poblacional por provincia (1990–2022).
 *
 * Fuente: análisis provincial del cliente (NOSTOS):
 * - Decrecimiento sostenido: Cañar y Loja — únicas provincias con
 *   disminución neta de población en el conjunto del período 1990–2022.
 * - Transición al decrecimiento: Chimborazo y Carchi — desaceleración
 *   progresiva del crecimiento.
 * - Crecimiento: el resto del país.
 *
 * Colores derivados EXCLUSIVAMENTE de la paleta (mezclas de #7A8B5C
 * sobre #FAFAF7; el nivel más alto usa el acento puro).
 * Más oscuro = más despoblación.
 */

export type Dynamic = "decline" | "weak" | "normal";

export const provinceDynamics: Record<string, Dynamic> = {
  // Decrecimiento sostenido 1990–2022
  canar: "decline",
  loja: "decline",
  // Transición al decrecimiento
  chimborazo: "weak",
  carchi: "weak",
  // Crecimiento (resto)
  esmeraldas: "normal",
  sucumbios: "normal",
  orellana: "normal",
  pastaza: "normal",
  "morona-santiago": "normal",
  "el-oro": "normal",
  galapagos: "normal",
  "santa-elena": "normal",
  azuay: "normal",
  tungurahua: "normal",
  napo: "normal",
  bolivar: "normal",
  imbabura: "normal",
  cotopaxi: "normal",
  pichincha: "normal",
  "santo-domingo-de-los-tsachilas": "normal",
  manabi: "normal",
  "los-rios": "normal",
  guayas: "normal",
  "zamora-chinchipe": "normal",
};

export const dynamicColors: Record<Dynamic, string> = {
  normal: "#EBEDE4", // mezcla 12% de #7A8B5C en #FAFAF7
  weak: "#C7CEB9", // mezcla 40%
  decline: "#7A8B5C", // acento exacto del sistema de diseño
};

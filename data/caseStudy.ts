/**
 * Estudio de caso (pilotaje): Chavezpamba, Pichincha.
 * Parroquia REAL; todas las cifras y textos largos son PLACEHOLDER hasta
 * recibir los datos definitivos del trabajo de campo.
 */

export const caseStudy = {
  slug: "chavezpamba",
  name: "Chavezpamba",
  province: "Pichincha",
  // Enlaza con el id de provinceShapes.ts (data/provinceDynamics.ts usa
  // el mismo id) — así el panel de provincia sabe cuándo mostrar esta
  // ficha aunque la provincia no tenga cantones en decrecimiento.
  provinceId: "pichincha",
  // PLACEHOLDER: cifras de ejemplo (censo de referencia ≈ 730 hab.)
  populationNow: 730,
  population2050: 340,
  changePct: -34,
  altitude: "1.868 m s. n. m.", // PLACEHOLDER: verificar
  distance: { es: "≈ 70 km al norte de Quito", en: "≈ 70 km north of Quito" },
  tagline: {
    es: "Está a dos horas de Quito. Para volver, parece que a mucho más.",
    en: "It is two hours from Quito. Coming back seems much farther.",
  },
  // PLACEHOLDER: párrafos narrativos del pilotaje.
  body: {
    es: [
      "Chavezpamba fue punto de paso entre la sierra y los valles subtropicales. Hoy la carretera sigue ahí, pero cada vez menos gente la toma de regreso.",
      "El pilotaje registró la vida diaria de la parroquia durante tres meses: sus dos tiendas, la escuela que resiste con aulas multigrado, la misa que se celebra cuando el párroco alcanza a subir.",
      "Lo que se aprenda aquí —qué preguntar, qué medir, qué escuchar— definirá cómo el estudio se acerca a las diez parroquias de la muestra final.",
    ],
    en: [
      "Chavezpamba was once a waypoint between the highlands and the subtropical valleys. The road is still there, but fewer and fewer people take it back.",
      "The pilot recorded the parish's daily life for three months: its two shops, the school holding on with multigrade classrooms, the mass held whenever the priest manages to come up.",
      "What is learned here — what to ask, what to measure, what to listen for — will define how the study approaches the ten parishes of the final sample.",
    ],
  },
  // PLACEHOLDER: reemplazar por fotografías reales (Supabase Storage).
  galleryCount: 6,
  // PLACEHOLDER: URL del episodio (archivo propio en Supabase Storage o
  // embed de Spotify/SoundCloud). null → se muestra el reproductor
  // deshabilitado con una nota.
  podcastUrl: null as string | null,
  podcastTitle: {
    es: "Episodio 1 — Las voces de Chavezpamba",
    en: "Episode 1 — The voices of Chavezpamba",
  },
};

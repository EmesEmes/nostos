/**
 * Equipo de NOSTOS.
 *
 * Estructura pensada para migrar tal cual a Supabase (tabla `team_members`
 * con las mismas columnas) cuando se activen los perfiles de
 * investigadores: las páginas leen de aquí y solo cambiará la fuente.
 *
 * Texto en español: del cliente, verbatim. Versión en inglés: traducción
 * de trabajo — ⚠️ debe revisarla Alexis antes de publicar (es su voz).
 */

export type TeamMember = {
  slug: string;
  name: string;
  role: { es: string; en: string };
  /** Párrafos del perfil, en orden. */
  bio: { es: string; en: string }[];
  /** PLACEHOLDER: ruta del retrato (Supabase Storage). null → silueta. */
  portrait: string | null;
};

export const team: TeamMember[] = [
  {
    slug: "alexis-vallejo",
    name: "Alexis Vallejo Mancero",
    role: { es: "Fundador e Investigador · NOSTOS", en: "Founder & Researcher · NOSTOS" },
    portrait: null,
    bio: [
      {
        es: "Soy un investigador apasionado por la ruralidad, su conservación y el desarrollo sostenible de los territorios. Durante más de quince años he tenido el privilegio de trabajar junto a comunidades rurales, instituciones públicas y organismos internacionales en el diseño, implementación y evaluación de iniciativas orientadas al fortalecimiento de los territorios.",
        en: "I am a researcher with a passion for rural life, its conservation and the sustainable development of territories. For more than fifteen years I have had the privilege of working alongside rural communities, public institutions and international organizations in the design, implementation and evaluation of initiatives aimed at strengthening territories.",
      },
      {
        es: "Mi experiencia profesional se ha desarrollado principalmente en Ecuador, el Corredor Seco Centroamericano y los países andinos de nuestro continente, acompañando proyectos relacionados con seguridad alimentaria, agricultura familiar, resiliencia, desarrollo territorial y gestión del conocimiento.",
        en: "My professional experience has developed mainly in Ecuador, the Central American Dry Corridor and the Andean countries of our continent, supporting projects related to food security, family farming, resilience, territorial development and knowledge management.",
      },
      {
        es: "Desde hace más de diez años formo parte del Sistema de las Naciones Unidas, donde trabajo en el monitoreo de programas y proyectos bajo el enfoque MEAL. Paralelamente, tuve el honor de desempeñarme como docente en mi querida Facultad de Ciencias Agrícolas de la Universidad Central del Ecuador, impartiendo la asignatura de Economía Agrícola.",
        en: "For more than ten years I have been part of the United Nations System, where I work on the monitoring of programmes and projects under the MEAL approach. In parallel, I had the honour of teaching at my beloved Faculty of Agricultural Sciences of the Universidad Central del Ecuador, lecturing in Agricultural Economics.",
      },
      {
        es: "A lo largo de mi trayectoria he desarrollado investigaciones sobre los sistemas de comercialización de la agricultura familiar campesina, la construcción de indicadores para evaluar la sostenibilidad territorial, económica y agroecológica, los modelos de desarrollo territorial y las dinámicas que transforman los espacios rurales. Mi interés por comprender los procesos de despoblación surgió a partir de mi experiencia académica en Madrid con la REDR – Red Española de Desarrollo Rural, lo que despertó la inquietud de analizar este fenómeno en el Ecuador y dio origen a NOSTOS, un observatorio dedicado a generar evidencia científica sobre la despoblación rural y las transformaciones territoriales.",
        en: "Throughout my career I have carried out research on the marketing systems of peasant family agriculture, the construction of indicators to assess territorial, economic and agroecological sustainability, models of territorial development and the dynamics that transform rural spaces. My interest in understanding depopulation processes arose from my academic experience in Madrid with the REDR – Spanish Rural Development Network, which sparked the desire to analyse this phenomenon in Ecuador and gave rise to NOSTOS, an observatory dedicated to producing scientific evidence on rural depopulation and territorial change.",
      },
      {
        es: "Creo firmemente que comprender los territorios rurales es el primer paso para construir políticas públicas más justas y sostenibles. A través de NOSTOS buscamos aportar evidencia, análisis y conocimiento que contribuyan a entender las transformaciones demográficas y territoriales que enfrenta el mundo rural y, con ello, apoyar la construcción de estrategias para su desarrollo sostenible.",
        en: "I firmly believe that understanding rural territories is the first step toward building fairer and more sustainable public policies. Through NOSTOS we seek to provide evidence, analysis and knowledge that help make sense of the demographic and territorial transformations facing the rural world and, in doing so, support the construction of strategies for its sustainable development.",
      },
      {
        es: "Estoy convencido de que el conocimiento se construye de manera colaborativa. Por ello, NOSTOS nace como una iniciativa abierta al diálogo, al intercambio de ideas y a la cooperación entre investigadores, instituciones, estudiantes y todas las personas interesadas en comprender las dinámicas de la despoblación rural y las transformaciones territoriales. Estaré encantado de responder tus preguntas, conocer tus aportes y explorar nuevas oportunidades de colaboración que contribuyan al crecimiento y consolidación de este observatorio.",
        en: "I am convinced that knowledge is built collaboratively. That is why NOSTOS was born as an initiative open to dialogue, to the exchange of ideas and to cooperation among researchers, institutions, students and everyone interested in understanding the dynamics of rural depopulation and territorial change. I will be delighted to answer your questions, hear your contributions and explore new opportunities for collaboration that help this observatory grow and consolidate.",
      },
    ],
  },
];

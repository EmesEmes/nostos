export type Lang = "es" | "en";

export const translations = {
  es: {
    langSwitcher: {
      label: "Idioma",
      es: "ES",
      en: "EN",
    },
    nav: {
      label: "Navegación principal",
      home: "NOSTOS, ir al inicio",
      research: "Investigaciones",
    },
    researchPage: {
      kicker: "NOSTOS",
      title: "Investigaciones",
      intro:
        "Textos y avances de la investigación sobre la despoblación rural en el Ecuador.",
      empty: "Todavía no hay investigaciones publicadas.",
      readMore: "Leer",
      back: "Investigaciones",
      by: "Por",
      aboutAuthor: "Sobre el autor",
      onlySpanish: "Este texto solo está disponible en español.",
    },
    hero: {
      // PLACEHOLDER: parroquia y cifras de ejemplo.
      kicker: "Nostos",
      line1:
        "Hay territorios del Ecuador que llevan más de treinta años vaciándose.",
      line2: "Desde 1990, 28 cantones pierden población de forma continua.",
      subtitle:
        "Una investigación sobre las parroquias de Ecuador que se quedan sin gente.",
      scrollHint: "Desliza para leer",
    },
    problem: {
      // Cada elemento es una "línea" del reveal progresivo.
      // Los fragmentos entre ** ** se renderizan como datos resaltados.
      // Datos reales del análisis cantonal 1990–2022 (NOSTOS/INEC).
      lines: [
        "En la sierra ecuatoriana hay pueblos donde ya no nacen niños.",
        "Las escuelas cierran una por una, las casas quedan con la puerta entreabierta, y el silencio se vuelve el vecino más constante.",
        "Desde 1990, **28 cantones** del país pierden población de forma continua.",
        "Los jóvenes se van a Quito, a Guayaquil, a España. Los que se quedan envejecen solos.",
        "En Pucará, en el alto Azuay, la pérdida llega al **−1,67% anual**. En el sur de Loja, **siete cantones** están en nivel crítico.",
        "Nadie decidió que estos lugares debían vaciarse. Simplemente, nadie decidió lo contrario.",
      ],
    },
    statement: {
      // Texto del cliente (tesis central del estudio).
      text: "La despoblación en el Ecuador es un fenómeno predominantemente rural.",
    },
    magnitude: {
      title: "No es un pueblo. Es un patrón.",
      // Dato real del cliente (análisis 1990–2022).
      counterSuffix:
        "cantones mantienen un proceso persistente de despoblación desde 1990",
      counterValue: 28,
      body: "El análisis de la evolución demográfica evidencia que 28 cantones del país han registrado tasas de crecimiento poblacional negativas de forma continua desde 1990: la despoblación constituye un proceso estructural y de largo plazo en estos territorios, más que una fluctuación demográfica temporal.",
    },
    map: {
      title: "El mapa vivo",
      lead: "Antes de los nombres y de las cifras, el territorio.",
      intro:
        "Veinticuatro provincias. Toca una para conocer su dinámica poblacional 1990–2022.",
      mobileHint: "Toca una provincia para abrir su ficha.",
      legendTitle: "Dinámica poblacional 1990–2022",
      legendDecline: "Decrecimiento sostenido",
      legendWeak: "Transición al decrecimiento",
      legendNormal: "Crecimiento",
      provincial: {
        title:
          "Cañar y Loja presentan procesos sostenidos de decrecimiento poblacional",
        p1: "Entre 1990 y 2022, Cañar y Loja fueron las únicas provincias del Ecuador que registraron una disminución de su población en el conjunto del período analizado. A ellas se suman Chimborazo y Carchi, cuyas tendencias demográficas evidencian una desaceleración progresiva del crecimiento y una transición hacia escenarios de decrecimiento poblacional.",
        p2: "Estos resultados muestran que la pérdida de población no ocurre de manera homogénea en el territorio nacional, sino que se concentra especialmente en determinadas provincias de la Sierra, donde convergen dinámicas de emigración, envejecimiento demográfico y debilitamiento del crecimiento natural.",
      },
      panel: {
        kicker: "Provincia",
        rateLabel: "Tasa anual promedio 1990–2022",
        zoneLabel: "Zona del análisis",
        population: "Población actual",
        projection: "Proyección a 2050",
        change: "Variación 2001–2024",
        close: "Cerrar panel",
        visit: "Ver la historia completa",
        inhabitants: "habitantes",
        noDeclineNote:
          "Provincia con crecimiento poblacional según el análisis 1990–2022. No presenta cantones en decrecimiento identificados por el estudio.",
      },
    },
    numbers: {
      title: "Lo que dicen los números",
      intro:
        "Detrás de cada curva hay un registro civil, un censo, una escuela con menos pupitres. Estos son los datos, sin adjetivos.",
      chart1Title: "Los diez cantones con mayor decrecimiento",
      chart1Caption:
        "Tasa de crecimiento anual promedio 1990–2022. Fuente: INEC. Elaboración: NOSTOS.",
      chart2Title: "Los 28 cantones en despoblación persistente, por categoría",
      chart2Caption:
        "Cantones con tasas negativas continuas desde 1990. Fuente: INEC. Elaboración: NOSTOS.",
      chart3Title: "Tasa promedio por zona del análisis",
      chart3Caption:
        "Promedio simple de las tasas cantonales de cada zona. Fuente: INEC. Elaboración: NOSTOS.",
      rateAxis: "Tasa anual (%)",
      cantonsAxis: "Cantones",
      catCritical: "Crítico",
      catMild: "Leve",
      catModerate: "Moderado",
    },
    stories: {
      title: "Historias humanas",
      intro:
        "Diez parroquias, diez maneras de irse quedando. Cada una tiene su propia página, con datos, fotografías y las voces de quienes aún viven ahí.",
      audioNote: "Cada historia incluye un episodio en audio.",
      readMore: "Leer su historia",
    },
    methodology: {
      title: "Metodología",
      intro:
        "Cómo se construyó este estudio: criterios, fuentes y límites. Sección pensada para lectura académica.",
      expand: "Ver detalle metodológico",
      collapse: "Ocultar detalle metodológico",
      items: [
        {
          heading: "Enfoque metodológico",
          body: "Estudio mixto: análisis cuantitativo de series censales (1990, 2001, 2010, 2022) y trabajo de campo cualitativo en las 10 parroquias seleccionadas, con entrevistas semiestructuradas a residentes, migrantes retornados y autoridades locales. PLACEHOLDER: describir aquí el diseño muestral y los criterios de selección definitivos.",
        },
        {
          heading: "Fuentes de datos",
          body: "Censos de Población y Vivienda del INEC, registros administrativos de nacimientos y defunciones, proyecciones poblacionales oficiales y registros del Ministerio de Educación sobre cierre de unidades educativas. PLACEHOLDER: listar versiones exactas de los datasets y fechas de corte.",
        },
        {
          heading: "Variables de estudio",
          body: "Tasa de crecimiento intercensal, saldo migratorio estimado, índice de envejecimiento, tasa de natalidad parroquial, y densidad de servicios (educación, salud, transporte). PLACEHOLDER: incluir la operacionalización completa de cada variable.",
        },
      ],
    },
    implications: {
      title: "Implicaciones y recomendaciones",
      intro:
        "Para autoridades y tomadores de decisión: tres puntos que no admiten espera.",
      items: [
        {
          heading: "La despoblación es medible y predecible",
          body: "Los datos censales anticipan con décadas de margen qué parroquias están en riesgo. Un sistema público de alerta temprana territorial es viable con la información que el Estado ya recoge.",
        },
        {
          heading: "Los servicios se van antes que la gente",
          body: "El cierre de escuelas y centros de salud acelera la salida de las familias jóvenes. Sostener servicios mínimos en parroquias en declive no es gasto ineficiente: es política de retención.",
        },
        {
          heading: "Sin política territorial, el vacío se administra solo",
          body: "Ecuador no cuenta con una estrategia nacional frente a la despoblación rural. Este estudio propone criterios para priorizar inversión en las parroquias con declive reversible.",
        },
      ],
    },
    closing: {
      title: "Sobre NOSTOS",
      etymology:
        "Nostos (νόστος): en griego, el viaje de regreso a casa. La raíz de la palabra nostalgia.",
      body: "NOSTOS es un observatorio dedicado a generar evidencia científica sobre la despoblación rural y las transformaciones territoriales del Ecuador. Esta investigación doctoral, desarrollada en colaboración con agencias del sistema de Naciones Unidas, es su primer estudio. Los datos provienen de fuentes públicas oficiales; las historias, de la gente que sigue ahí.",
      credits: "Investigación y textos",
      creditsName: "Alexis Vallejo Mancero",
      institution: "Institución",
      institutionName: "NOSTOS · Universidad / programa doctoral (PLACEHOLDER)",
      dataSources: "Fuentes de datos",
      dataSourcesList: "INEC · Censos de Población y Vivienda · Registro Civil",
      contact: "Contacto",
      contactEmail: "correo@ejemplo.ec", // PLACEHOLDER
      cta: "Explorar los diez cantones",
      rights: "© 2026 NOSTOS. Los datos citados son de dominio público.",
    },
    numbersFlow: {
      hint: "Desliza o usa las flechas para recorrer los datos.",
      prev: "Estadística anterior",
      next: "Estadística siguiente",
      goTo: "Ir a la estadística",
      of: "de",
    },
    cantonal: {
      kicker: "Hallazgo territorial",
      title: "Donde el país se contrae, cantón por cantón",
      intro:
        "El análisis cantonal (1990–2022) revela cuatro zonas donde la pérdida de población se concentra. Acompaña el recorrido.",
      sourceNote:
        "Fuente: INEC, censos 1990–2022. Elaboración: Alexis Vallejo Mancero, NOSTOS (junio 2026). Tasas de crecimiento anual promedio.",
      rateLabel: "tasa anual",
    },
    findings: {
      title: "Principales hallazgos",
      intro:
        "Cada hipótesis del estudio, contrastada con los datos. Sin adornos: lo que se confirmó, lo que se matizó, lo que hubo que descartar.",
      verdicts: {
        confirmed: "Se confirma",
        partial: "Se confirma parcialmente",
        rejected: "Se rechaza",
      },
      evidenceLabel: "Evidencia",
      // Hipótesis de ejemplo construidas SOLO sobre los hallazgos reales
      // del análisis 1990–2022; el cliente definirá el listado definitivo.
      items: [
        {
          hypothesis:
            "Existe despoblación sostenida en territorios del Ecuador.",
          verdict: "confirmed",
          evidence:
            "28 cantones registran tasas de crecimiento negativas de forma continua desde 1990 (INEC, censos 1990–2022).",
        },
        {
          hypothesis: "La despoblación es un fenómeno predominantemente rural.",
          verdict: "confirmed",
          evidence:
            "Tesis central del estudio, sostenida por el análisis cantonal 1990–2022 del observatorio.",
        },
        {
          hypothesis: "La despoblación se concentra en la sierra sur.",
          verdict: "partial",
          evidence:
            "Cañar y Loja son las únicas provincias con decrecimiento neto 1990–2022, pero aparecen focos fuera de la sierra sur, como Jama en la costa de Manabí (−0,62% anual).",
        },
        {
          hypothesis: "El resto de la Sierra mantiene un crecimiento estable.",
          verdict: "rejected",
          evidence:
            "Chimborazo y Carchi muestran una desaceleración progresiva del crecimiento y una transición hacia el decrecimiento poblacional.",
        },
      ],
    },
    cantonPage: {
      kicker: "Cantón del análisis",
      zoneTitle: "Su zona en el análisis",
      othersTitle: "Cantones de la misma zona",
      fieldworkTitle: "Trabajo de campo",
      fieldworkNote:
        "Las historias, fotografías y el episodio en audio de este cantón se publicarán conforme avance el trabajo de campo del observatorio.",
      back: "Volver al inicio",
    },
    caseStudy: {
      kicker: "Estudio de caso (pilotaje)",
      intro:
        "Mientras los diez cantones del análisis abren sus páginas, el estudio se afina en una parroquia: Chavezpamba, al norte de Quito. Su página reúne los datos, las fotografías y las voces del pilotaje.",
      visit: "Entrar a Chavezpamba",
      audioNote: "Incluye episodio en audio",
    },
    cantonsGrid: {
      title: "Los diez cantones con mayor decrecimiento",
      intro:
        "Los diez territorios donde la pérdida de población es más severa según el análisis 1990–2022. Cada uno tiene su página, con su tasa, su zona y el estado del trabajo de campo.",
      rateShort: "anual",
      open: "Ver su página",
    },
    participate: {
      title: "Participa",
      intro:
        "Esta investigación se hace también con quienes la leen. Escríbenos una sugerencia, súmate al trabajo de campo, o recibe los avances por correo.",
      contact: {
        title: "Escríbenos",
        name: "Nombre",
        email: "Correo electrónico",
        reason: "Motivo",
        reasonSuggestion: "Tengo una sugerencia",
        reasonCollab: "Quiero colaborar en la investigación",
        message: "Mensaje",
        submit: "Enviar mensaje",
        sending: "Enviando…",
        success: "Mensaje enviado. Gracias por escribir.",
        error: "No se pudo enviar. Inténtalo de nuevo.",
      },
      subscribe: {
        title: "Boletín de la investigación",
        body: "Avances, nuevas parroquias publicadas y hallazgos, directo a tu correo. Sin ruido.",
        email: "Tu correo electrónico",
        consent: "Acepto recibir el boletín de NOSTOS.",
        submit: "Suscribirme",
        sending: "Suscribiendo…",
        success: "Listo. Revisa tu correo para confirmar la suscripción.",
        error: "No se pudo completar. Inténtalo de nuevo.",
      },
      visitsLabel: "veces consultada esta investigación",
    },
  },

  en: {
    langSwitcher: {
      label: "Language",
      es: "ES",
      en: "EN",
    },
    nav: {
      label: "Main navigation",
      home: "NOSTOS, go to home",
      research: "Research",
    },
    researchPage: {
      kicker: "NOSTOS",
      title: "Research",
      intro:
        "Texts and progress from the research on rural depopulation in Ecuador.",
      empty: "No research has been published yet.",
      readMore: "Read",
      back: "Research",
      by: "By",
      aboutAuthor: "About the author",
      onlySpanish: "This text is only available in Spanish.",
    },
    hero: {
      kicker: "Nostos",
      line1:
        "There are territories in Ecuador that have been emptying for over thirty years.",
      line2: "Since 1990, 28 cantons have been losing population continuously.",
      subtitle:
        "A research project on the parishes of Ecuador that are running out of people.",
      scrollHint: "Scroll to read",
    },
    problem: {
      lines: [
        "In the Ecuadorian highlands there are villages where children are no longer born.",
        "Schools close one by one, houses are left with the door ajar, and silence becomes the most constant neighbor.",
        "Since 1990, **28 cantons** of the country have been losing population continuously.",
        "The young leave for Quito, for Guayaquil, for Spain. Those who stay grow old alone.",
        "In Pucará, in upper Azuay, the loss reaches **−1.67% a year**. In southern Loja, **seven cantons** are at critical level.",
        "No one decided these places should empty out. Simply, no one decided otherwise.",
      ],
    },
    statement: {
      text: "Depopulation in Ecuador is a predominantly rural phenomenon.",
    },
    magnitude: {
      title: "Not one village. A pattern.",
      counterSuffix:
        "cantons have sustained a persistent depopulation process since 1990",
      counterValue: 28,
      body: "The analysis of demographic evolution shows that 28 cantons of the country have recorded continuously negative population growth rates since 1990: depopulation is a structural, long-term process in these territories, rather than a temporary demographic fluctuation.",
    },
    map: {
      title: "The living map",
      lead: "Before the names and the figures, the territory.",
      intro:
        "Twenty-four provinces. Tap one to see its population dynamics, 1990–2022.",
      mobileHint: "Tap a province to open its card.",
      legendTitle: "Population dynamics 1990–2022",
      legendDecline: "Sustained decrease",
      legendWeak: "Transition to decrease",
      legendNormal: "Growth",
      provincial: {
        title: "Cañar and Loja show sustained processes of population decline",
        p1: "Between 1990 and 2022, Cañar and Loja were the only provinces of Ecuador to record a decrease in their population over the period as a whole. They are joined by Chimborazo and Carchi, whose demographic trends show a progressive slowdown of growth and a transition toward scenarios of population decline.",
        p2: "These results show that population loss does not occur evenly across the national territory: it is concentrated in particular provinces of the Sierra, where dynamics of emigration, demographic ageing and a weakening of natural growth converge.",
      },
      panel: {
        kicker: "Province",
        rateLabel: "Average annual rate 1990–2022",
        zoneLabel: "Analysis zone",
        population: "Current population",
        projection: "Projection for 2050",
        change: "Change 2001–2024",
        close: "Close panel",
        visit: "Read the full story",
        inhabitants: "inhabitants",
        noDeclineNote:
          "Province with population growth according to the 1990–2022 analysis. It has no declining cantons identified by the study.",
      },
    },
    numbers: {
      title: "What the numbers say",
      intro:
        "Behind every curve there is a civil registry, a census, a school with fewer desks. Here is the data, without adjectives.",
      chart1Title: "The ten cantons with the steepest decline",
      chart1Caption:
        "Average annual growth rate 1990–2022. Source: INEC. Prepared by NOSTOS.",
      chart2Title: "The 28 cantons in persistent depopulation, by category",
      chart2Caption:
        "Cantons with continuously negative rates since 1990. Source: INEC. Prepared by NOSTOS.",
      chart3Title: "Average rate by analysis zone",
      chart3Caption:
        "Simple average of each zone's cantonal rates. Source: INEC. Prepared by NOSTOS.",
      rateAxis: "Annual rate (%)",
      cantonsAxis: "Cantons",
      catCritical: "Critical",
      catMild: "Mild",
      catModerate: "Moderate",
    },
    stories: {
      title: "Human stories",
      intro:
        "Ten parishes, ten ways of slowly being left behind. Each has its own page, with data, photographs and the voices of those who still live there.",
      audioNote: "Every story includes an audio episode.",
      readMore: "Read their story",
    },
    methodology: {
      title: "Methodology",
      intro:
        "How this study was built: criteria, sources and limits. Written for academic readers.",
      expand: "Show methodological detail",
      collapse: "Hide methodological detail",
      items: [
        {
          heading: "Methodological approach",
          body: "Mixed-methods study: quantitative analysis of census series (1990, 2001, 2010, 2022) and qualitative fieldwork in the 10 selected parishes, with semi-structured interviews with residents, returned migrants and local authorities. PLACEHOLDER: describe the final sampling design and selection criteria here.",
        },
        {
          heading: "Data sources",
          body: "INEC Population and Housing Censuses, administrative birth and death records, official population projections, and Ministry of Education records on school closures. PLACEHOLDER: list exact dataset versions and cut-off dates.",
        },
        {
          heading: "Study variables",
          body: "Intercensal growth rate, estimated net migration, ageing index, parish birth rate, and service density (education, health, transport). PLACEHOLDER: include the full operationalization of each variable.",
        },
      ],
    },
    implications: {
      title: "Implications and recommendations",
      intro:
        "For authorities and decision-makers: three points that cannot wait.",
      items: [
        {
          heading: "Depopulation is measurable and predictable",
          body: "Census data anticipates, decades in advance, which parishes are at risk. A public territorial early-warning system is feasible with information the State already collects.",
        },
        {
          heading: "Services leave before the people do",
          body: "The closure of schools and health centers accelerates the departure of young families. Sustaining minimum services in declining parishes is not inefficient spending: it is retention policy.",
        },
        {
          heading: "Without territorial policy, the void manages itself",
          body: "Ecuador has no national strategy for rural depopulation. This study proposes criteria to prioritize investment in parishes where decline is still reversible.",
        },
      ],
    },
    closing: {
      title: "About NOSTOS",
      etymology:
        "Nostos (νόστος): in Greek, the journey home. The root of the word nostalgia.",
      body: "NOSTOS is an observatory dedicated to producing scientific evidence on rural depopulation and territorial change in Ecuador. This doctoral research, developed in collaboration with agencies of the United Nations system, is its first study. The data comes from official public sources; the stories, from the people who are still there.",
      credits: "Research and writing",
      creditsName: "Alexis Vallejo Mancero",
      institution: "Institution",
      institutionName: "NOSTOS · University / doctoral program (PLACEHOLDER)",
      dataSources: "Data sources",
      dataSourcesList:
        "INEC · Population and Housing Censuses · Civil Registry",
      contact: "Contact",
      contactEmail: "email@example.ec", // PLACEHOLDER
      cta: "Explore the ten cantons",
      rights: "© 2026 NOSTOS. All cited data is in the public domain.",
    },
    numbersFlow: {
      hint: "Swipe or use the arrows to move through the data.",
      prev: "Previous statistic",
      next: "Next statistic",
      goTo: "Go to statistic",
      of: "of",
    },
    cantonal: {
      kicker: "Territorial finding",
      title: "Where the country contracts, canton by canton",
      intro:
        "The cantonal analysis (1990–2022) reveals four zones where population loss is concentrated. Follow the route.",
      sourceNote:
        "Source: INEC, 1990–2022 censuses. Prepared by: Alexis Vallejo Mancero, NOSTOS (June 2026). Average annual growth rates.",
      rateLabel: "annual rate",
    },
    findings: {
      title: "Key findings",
      intro:
        "Each hypothesis of the study, tested against the data. No embellishment: what was confirmed, what was nuanced, what had to be discarded.",
      verdicts: {
        confirmed: "Confirmed",
        partial: "Partially confirmed",
        rejected: "Rejected",
      },
      evidenceLabel: "Evidence",
      items: [
        {
          hypothesis:
            "There is sustained depopulation in territories of Ecuador.",
          verdict: "confirmed",
          evidence:
            "28 cantons have recorded continuously negative growth rates since 1990 (INEC, 1990–2022 censuses).",
        },
        {
          hypothesis: "Depopulation is a predominantly rural phenomenon.",
          verdict: "confirmed",
          evidence:
            "Central thesis of the study, supported by the observatory's 1990–2022 cantonal analysis.",
        },
        {
          hypothesis: "Depopulation is concentrated in the southern highlands.",
          verdict: "partial",
          evidence:
            "Cañar and Loja are the only provinces with a net decrease over 1990–2022, but pockets appear outside the southern highlands, such as Jama on the Manabí coast (−0.62% a year).",
        },
        {
          hypothesis: "The rest of the Sierra maintains stable growth.",
          verdict: "rejected",
          evidence:
            "Chimborazo and Carchi show a progressive slowdown of growth and a transition toward population decline.",
        },
      ],
    },
    cantonPage: {
      kicker: "Canton in the analysis",
      zoneTitle: "Its zone in the analysis",
      othersTitle: "Cantons in the same zone",
      fieldworkTitle: "Fieldwork",
      fieldworkNote:
        "The stories, photographs and audio episode for this canton will be published as the observatory's fieldwork progresses.",
      back: "Back to home",
    },
    caseStudy: {
      kicker: "Case study (pilot)",
      intro:
        "While the ten cantons of the analysis open their pages, the study is being refined in one parish: Chavezpamba, north of Quito. Its page gathers the data, photographs and voices of the pilot.",
      visit: "Enter Chavezpamba",
      audioNote: "Includes an audio episode",
    },
    cantonsGrid: {
      title: "The ten cantons with the steepest decline",
      intro:
        "The ten territories where population loss is most severe according to the 1990–2022 analysis. Each has its own page, with its rate, its zone and the state of fieldwork.",
      rateShort: "annual",
      open: "Open its page",
    },
    participate: {
      title: "Take part",
      intro:
        "This research is also made with its readers. Send us a suggestion, join the fieldwork, or receive updates by email.",
      contact: {
        title: "Write to us",
        name: "Name",
        email: "Email address",
        reason: "Reason",
        reasonSuggestion: "I have a suggestion",
        reasonCollab: "I want to collaborate on the research",
        message: "Message",
        submit: "Send message",
        sending: "Sending…",
        success: "Message sent. Thank you for writing.",
        error: "It could not be sent. Please try again.",
      },
      subscribe: {
        title: "Research newsletter",
        body: "Progress, newly published parishes and findings, straight to your inbox. No noise.",
        email: "Your email address",
        consent: "I agree to receive the NOSTOS newsletter.",
        submit: "Subscribe",
        sending: "Subscribing…",
        success: "Done. Check your inbox to confirm the subscription.",
        error: "It could not be completed. Please try again.",
      },
      visitsLabel: "times this research has been read",
    },
  },
};

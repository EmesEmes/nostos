# NOSTOS — Observatorio de despoblación rural

Home page de la investigación doctoral sobre despoblación territorial en Ecuador.
Next.js (App Router) + Tailwind CSS + React Three Fiber + Framer Motion + Recharts.

## Arranque

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # verificación de producción
```

## Novedades de esta versión (cambios del cliente)

- Orden nuevo del home: Hero (con imagen de fondo) → Mapa Vivo → Problema →
  Magnitud → Números (scroll horizontal en desktop) → Estudio cantonal
  (scrollytelling) → Principales hallazgos → Estudio de caso (Chavezpamba) →
  Parroquias por confirmar → Sobre la investigación → Participa.
- `app/parroquias/chavezpamba/page.tsx`: página del pilotaje (molde de las
  futuras 10). `Stories.tsx` y `Methodology.tsx` quedan sin uso, conservados.
- Backend (stubs listos para Supabase, SIN SDK — REST vía fetch):
  `app/api/visits` (contador, tabla `site_visits` + RPC),
  `app/api/contact` (tabla `contact_messages`, opcional Resend),
  `app/api/subscribe` (Buttondown y/o tabla `newsletter_subscribers`).
  Cada route.ts trae el SQL y las env vars exactas. Sin configurar, todo
  funciona en modo dev (memoria/console.log) para poder probar la UI.

## Arquitectura

```
app/
  layout.tsx            Fuentes (Fraunces + Inter vía next/font), metadata
  providers.tsx         LanguageProvider + MotionConfig reducedMotion="user"
  page.tsx              Ensambla las 9 secciones en orden narrativo
  globals.css           Paleta como variables CSS, foco visible, keyframes
components/
  LanguageSwitcher.tsx  Switcher ES/EN fijo (persistente en localStorage)
  home/
    Hero.tsx            1. Apertura
    TheProblem.tsx      2. Reveal progresivo línea a línea
    Magnitude.tsx       3. Contador nacional
    LivingMap/          4. Mapa 3D
      MapSection.tsx      Lazy mount (IntersectionObserver) + estado del panel
      MapCanvas.tsx       Escena R3F (cámara, luces, controles)
      ProvincePiece.tsx   Pieza extruida + caída easeOutBack escalonada
      ParishMarker.tsx    Punto con bounce sutil + zona táctil generosa
      ParishPanel.tsx     Panel lateral deslizante (Esc / click fuera / botón)
    Numbers.tsx         5. Tres gráficos sobrios (Recharts)
    Stories.tsx         6. Grid de 10 parroquias (enlaza a /parroquias/[slug])
    Methodology.tsx     7. Acordeón sobrio
    Implications.tsx    8. Tres puntos para tomadores de decisión
    Closing.tsx         9. Créditos + CTA
lib/
  translations.ts       TODO el copy ES/EN (diccionario simple, sin i18n lib)
  LanguageContext.tsx   Contexto de idioma + sincroniza <html lang>
  usePrefersReducedMotion.ts  matchMedia con suscripción en vivo
data/
  provinces.ts          24 provincias placeholder + orden de caída NO→SE
  parishes.ts           10 parroquias placeholder (posición, cifras, frases)
  chartData.ts          Series placeholder para la sección de números
```

## Decisiones de diseño (y por qué)

- **GSAP + Framer Motion, cada uno en lo suyo.** GSAP/ScrollTrigger maneja
  las coreografías de scroll (carril horizontal de Números con pin + scrub,
  y las paradas + zoom del scrollytelling cantonal): su control de anclas y
  distancias reales (`scrollWidth − viewport`, `invalidateOnRefresh`) es
  exactamente lo que estas piezas necesitan. Framer Motion conserva los
  reveals de entrada, el panel lateral y las microanimaciones, donde su API
  declarativa con React es más limpia. El registro de GSAP vive en
  `lib/gsapClient.ts`. La caída de provincias sigue sin pasar por ninguna de
  las dos: es un easing propio dentro de `useFrame` de R3F.
- **Mapa en mobile: la misma escena, degradada con criterio.** En vez de un
  mapa 2D alternativo (dos fuentes de verdad que mantener), la escena baja
  `dpr` a [1, 1.75], usa geometría de muy pocos vértices, limita OrbitControls
  a rotación de un dedo con ángulos acotados (`touch-action: pan-y` preserva
  el scroll de la página) y agranda la zona de golpeo de los marcadores.
- **Estilo "boceto".** Caras de las piezas casi del color del papel + aristas
  (`<Edges>`) en `#7A8B5C`: el mapa se lee como línea sobre crema, sin
  relleno sólido dominante, y la extrusión (grosor 2.5) da la sombra mínima
  que hace legible la caída.
- **Piezas con respiración.** Los polígonos placeholder no comparten aristas
  exactas: un pequeño aire entre provincias refuerza la idea de piezas
  independientes (y de país que se fragmenta). Con el GeoJSON real se puede
  conservar aplicando una micro-escala de 0.97 por pieza alrededor de su centroide.
- **`prefers-reduced-motion` en tres capas.** (1) `MotionConfig` anula los
  transforms de Framer; (2) `usePrefersReducedMotion` hace que el mapa nazca
  ensamblado, sin caída ni bounce, y pasa el canvas a `frameloop="demand"`;
  (3) el bounce del indicador de scroll se apaga por media query en CSS.
  El contador muestra el valor final directo. Nada del contenido depende de
  una animación.

## Dónde reemplazar placeholders (buscar `PLACEHOLDER` en el repo)

1. **Geometría real de provincias** → `data/provinces.ts` (instrucciones
   completas en el comentario de cabecera: geoBoundaries/IGM → mapshaper →
   proyección equirectangular → `THREE.Shape`).
2. **Parroquias** (nombres, cifras, posiciones, slugs) → `data/parishes.ts`.
3. **Series de los gráficos** → `data/chartData.ts`.
4. **Cifras del copy** (hero, problema, contador 127) y **créditos/contacto**
   → `lib/translations.ts`.
5. **Clasificación del coropleto** (dinámica poblacional por provincia)
   → `data/provinceDynamics.ts`. La rampa de color se deriva solo de la
   paleta (mezclas de `#7A8B5C` sobre `#FAFAF7`; el nivel más alto es el
   acento puro): más oscuro = más despoblación.
6. **Fotos de parroquias** → `components/home/Stories.tsx` (bloque marcado).
7. **Páginas individuales** → crear `app/parroquias/[slug]/page.tsx`; los
   enlaces del panel y de las tarjetas ya apuntan a esas rutas.

"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cantons, type Canton } from "@/data/cantons";
import { dynamicColors } from "@/data/provinceDynamics";
import { ParishPanel } from "./ParishPanel";

/**
 * 4. El Mapa Vivo — pieza central interactiva.
 *
 * Rendimiento / lazy load:
 * - El canvas de three.js se importa con next/dynamic (ssr: false), de modo
 *   que su bundle NO forma parte del JS inicial de la página.
 * - Además, el componente ni siquiera se monta hasta que la sección se
 *   acerca al viewport (IntersectionObserver con rootMargin de 600px),
 *   así el resto del home carga y se puede leer sin esperar al mapa.
 *
 * Disparo de la animación:
 * - Un segundo observer (umbral 25%, sin margen) marca `triggered` cuando
 *   la sección entra de verdad en pantalla: la caída de provincias ocurre
 *   al llegar, no on-load.
 *
 * Movimiento reducido:
 * - Con prefers-reduced-motion el mapa se renderiza ya ensamblado
 *   (sin caída) y los marcadores no rebotan; la interacción se mantiene.
 */
const MapCanvas = dynamic(() => import("./MapCanvas"), {
  ssr: false,
  loading: () => <MapLoading />,
});

function MapLoading() {
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      role="status"
    >
      <MapLoadingLabel />
    </div>
  );
}

function MapLoadingLabel() {
  const { t } = useLanguage();
  return (
    <span className="font-sans text-sm text-ink-soft">{t.map.loading}</span>
  );
}

export function MapSection() {
  const { t, lang } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const [shouldMount, setShouldMount] = useState(false); // lazy mount
  const [triggered, setTriggered] = useState(false); // dispara la caída
  const [selected, setSelected] = useState<Canton | null>(null);
  const [isTouch, setIsTouch] = useState(false);

  // Detecta dispositivos táctiles para mostrar la pista de interacción móvil.
  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  // Observer 1: montar el canvas cuando la sección esté cerca (pre-carga).
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Observer 2: disparar la caída cuando la sección sea visible de verdad.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="px-0 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="mb-3 font-serif text-lg font-light italic text-ink-soft">
          {t.map.lead}
        </p>
        <h2 className="font-serif text-3xl font-light text-ink sm:text-4xl">
          {t.map.title}
        </h2>
        <p className="mt-4 font-sans text-base leading-relaxed text-ink-soft">
          {t.map.intro}
        </p>
        {reducedMotion && (
          <p className="mt-2 font-sans text-xs text-ink-soft">
            {t.map.staticNote}
          </p>
        )}
      </div>

      {/* Contenedor del canvas. Altura fija en vh para que el mapa tenga
          presencia sin robar toda la pantalla en mobile. */}
      <div className="relative mx-auto mt-10 h-[70vh] min-h-[420px] w-full max-w-6xl sm:h-[75vh]">
        {shouldMount ? (
          <MapCanvas
            triggered={triggered || reducedMotion}
            reducedMotion={reducedMotion}
            parishes={cantons}
            selectedSlug={selected?.slug ?? null}
            onSelectParish={setSelected}
          />
        ) : (
          <MapLoading />
        )}

        {/* Leyenda del coropleto (dinámica poblacional). */}
        <div className="pointer-events-none absolute inset-x-4 bottom-2 rounded-sm border border-hairline bg-paper/90 px-3 py-2 backdrop-blur-sm sm:inset-x-auto sm:bottom-auto sm:left-6 sm:top-2 sm:px-4 sm:py-3">
          <p className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-ink">
            {t.map.legendTitle}
          </p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 sm:block sm:space-y-1.5">
            {(
              [
                ["decline", t.map.legendDecline],
                ["weak", t.map.legendWeak],
                ["normal", t.map.legendNormal],
              ] as const
            ).map(([key, label]) => (
              <li key={key} className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-[2px] border border-hairline"
                  style={{ backgroundColor: dynamicColors[key] }}
                  aria-hidden="true"
                />
                <span className="font-sans text-[11px] text-ink-soft">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pista de interacción para pantallas táctiles. */}
        {isTouch && (
          <p className="pointer-events-none absolute -bottom-6 left-1/2 w-full max-w-xs -translate-x-1/2 text-center font-sans text-[11px] text-ink-soft">
            {t.map.mobileHint}
          </p>
        )}
      </div>

      {/* Lectura provincial (texto del cliente): el hallazgo que la
          leyenda del coropleto resume. */}
      <div className="mx-auto mt-16 max-w-prose px-6">
        <h3 className="font-serif text-2xl font-light leading-snug text-ink">
          {t.map.provincial.title}
        </h3>
        <p className="mt-5 font-sans text-base leading-relaxed text-ink">
          {t.map.provincial.p1}
        </p>
        <p className="mt-4 font-sans text-base leading-relaxed text-ink">
          {t.map.provincial.p2}
        </p>
      </div>

      {/* Panel lateral con la ficha de la parroquia seleccionada. */}
      <ParishPanel
        canton={selected}
        lang={lang}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}

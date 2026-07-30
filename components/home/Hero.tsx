"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

/**
 * 1. Apertura (Hero).
 * Pantalla completa, sin navegación pesada. Una frase de impacto emocional
 * combinada con el dato duro, e indicador sutil de scroll.
 *
 * Animación de entrada según brief: fade-in + desplazamiento vertical de
 * 16px, 800ms, ease-out. Con prefers-reduced-motion, MotionConfig
 * (app/providers.tsx) elimina el desplazamiento automáticamente.
 */
export function Hero() {
  const { t } = useLanguage();

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
      aria-label={t.hero.kicker}
    >
      {/* ─── FONDO ───────────────────────────────────────────────────────
          ⚠️ PLACEHOLDER: /public/hero-bg.svg es un paisaje de línea
          provisional. Para la fotografía real del trabajo de campo:
          1. Subirla a Supabase Storage (o /public) en horizontal, ≥1920px.
          2. Sustituir el <img> por next/image con priority (es el LCP):
             <Image src={heroUrl} alt="" fill priority className="object-cover" />
          3. Mantener el velo de abajo: garantiza el contraste del titular
             sobre cualquier fotografía. Ajustar opacidades si hace falta. */}
      <img
        src="/hero-bg.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Velo crema: legibilidad del texto sobre la imagen. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-paper/80 via-paper/55 to-paper"
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative max-w-3xl"
      >
        <p className="mb-8 font-sans text-xs uppercase tracking-[0.35em] text-moss">
          {t.hero.kicker}
        </p>

        <h1 className="font-serif text-4xl font-light leading-tight text-ink sm:text-5xl md:text-6xl">
          {t.hero.line1}
        </h1>

        {/* PLACEHOLDER: parroquia y cifra de ejemplo (ver lib/translations.ts). */}
        <p className="mt-6 font-serif text-lg italic text-ink-soft sm:text-xl">
          {t.hero.line2}
        </p>

        <div
          className="mx-auto mt-10 h-px w-16 bg-hairline"
          aria-hidden="true"
        />

        <p className="mt-10 font-sans text-sm text-ink-soft">
          {t.hero.subtitle}
        </p>
      </motion.div>

      {/* Indicador de scroll: bounce sutil infinito (~1.5s), definido en
          globals.css y desactivado allí mismo con prefers-reduced-motion. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
        className="absolute bottom-8 z-10 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ink-soft">
          {t.hero.scrollHint}
        </span>
        <svg
          className="animate-scroll-hint text-moss"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M3 6l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </section>
  );
}

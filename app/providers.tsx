"use client";

import { MotionConfig } from "framer-motion";
import { LanguageProvider } from "@/lib/LanguageContext";

/**
 * Providers globales del cliente.
 *
 * MotionConfig reducedMotion="user" hace que TODAS las animaciones de
 * Framer Motion (transform/opacity de entrada, layout, etc.) respeten
 * automáticamente prefers-reduced-motion a nivel de sistema operativo.
 * Los casos que necesitan un comportamiento distinto (mapa 3D, contador)
 * usan además el hook usePrefersReducedMotion de forma explícita.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LanguageProvider>
  );
}

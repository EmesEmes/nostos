"use client";

import { useEffect, useState } from "react";

/**
 * Detección real de prefers-reduced-motion vía matchMedia, con suscripción
 * a cambios en vivo (el usuario puede activarlo con la página abierta).
 *
 * Framer Motion ya se auto-regula con <MotionConfig reducedMotion="user">;
 * este hook cubre lo que Framer no controla: la escena de three.js
 * (caída de provincias, bounce de marcadores) y el contador animado.
 */
export function usePrefersReducedMotion(): boolean {
  // Arranca en false para no divergir entre servidor y cliente;
  // se corrige inmediatamente en el primer efecto.
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

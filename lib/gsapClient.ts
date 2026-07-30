"use client";

/**
 * Punto único de registro de GSAP + ScrollTrigger.
 *
 * División de trabajo en el proyecto (decisión de diseño):
 * - GSAP/ScrollTrigger → coreografías de scroll complejas: el carril
 *   horizontal de Números (pin + scrub) y el scrollytelling cantonal
 *   (pasos + zoom del mapa). Es su especialidad y da control fino de
 *   distancias y anclas.
 * - Framer Motion → reveals de entrada, panel lateral y microanimaciones
 *   declarativas, donde su API con el árbol de React es más limpia.
 *
 * prefers-reduced-motion: los componentes que usan GSAP consultan
 * usePrefersReducedMotion y NO crean los triggers (caen a layouts
 * estáticos); Framer sigue cubierto por MotionConfig reducedMotion="user".
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

import type { Config } from "tailwindcss";

/**
 * Sistema de diseño "NOSTOS".
 * Los valores hexadecimales son EXACTOS según el brief — no sustituir.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FAFAF7", // fondo principal (blanco roto / crema)
        "paper-alt": "#F0EFE8", // fondo secundario para alternar secciones
        moss: "#7A8B5C", // acento principal (verde musgo apagado)
        "moss-dark": "#5C6B45", // acento oscuro (hover, líneas del mapa)
        ink: "#2E2C28", // texto principal (gris carbón cálido)
        "ink-soft": "#6B6862", // texto secundario
        hairline: "#DEDBD1", // líneas divisorias / bordes sutiles
      },
      fontFamily: {
        // Variables inyectadas por next/font en app/layout.tsx
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "42rem",
      },
    },
  },
  plugins: [],
};

export default config;

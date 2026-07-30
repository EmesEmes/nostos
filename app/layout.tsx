import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

/*
  Tipografía del proyecto:
  - Fraunces (serif) → títulos y momentos narrativos.
  - Inter (sans)     → cuerpo de texto, UI y datos.
  next/font las sirve auto-alojadas (mejor rendimiento y sin FOUT
  que un <link> a Google Fonts).
*/
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  // Ejes ópticos de Fraunces: pesos suaves para narrativa, negrita para cifras.
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NOSTOS — Observatorio de despoblación rural",
  description:
    "NOSTOS genera evidencia científica sobre la despoblación rural y las transformaciones territoriales del Ecuador. Primer estudio: las parroquias que pierden a su gente y podrían no existir en 2050.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // lang se mantiene en "es" como idioma base del documento; el switcher
  // actualiza document.documentElement.lang en el cliente (ver LanguageContext).
  return (
    <html lang="es" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="bg-paper font-sans text-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

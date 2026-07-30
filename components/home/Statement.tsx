"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

/**
 * Interludio-tesis: una sola frase del cliente, tratada como separador de
 * capítulo — Fraunces grande, blanco generoso, nada que compita.
 * Marca el giro de la narrativa humana (El Problema) hacia los datos
 * (La Magnitud).
 */
export function Statement() {
  const { t } = useLanguage();

  return (
    <section className="flex min-h-[60vh] items-center justify-center px-6 py-24">
      <motion.blockquote
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -25% 0px" }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="max-w-4xl text-center"
      >
        <p className="font-serif text-3xl font-light leading-snug text-ink sm:text-4xl md:text-5xl">
          {t.statement.text}
        </p>
        <div className="mx-auto mt-10 h-px w-16 bg-moss" aria-hidden="true" />
      </motion.blockquote>
    </section>
  );
}

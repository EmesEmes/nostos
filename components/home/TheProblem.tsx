"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

/**
 * 2. El Problema — perspectiva humana.
 *
 * Reveal progresivo línea a línea: cada línea pasa de opacity 0.15 a 1
 * cuando su centro entra aproximadamente al 60% del viewport
 * (viewport margin -40% inferior), y NO retrocede al subir el scroll
 * (`once: true`).
 *
 * Los datos numéricos van intercalados en el flujo del texto (no como
 * gráficos), resaltados con la fuente serif y el acento musgo. El formato
 * en las traducciones es **dato** → <em class="highlight">.
 *
 * Con prefers-reduced-motion, MotionConfig anula la transición y las
 * líneas se muestran directamente (initial se ignora para transform y
 * la opacidad final se aplica sin animación progresiva).
 */

/** Convierte "texto **dato** texto" en nodos con el dato resaltado. */
function renderLine(line: string) {
  const parts = line.split("**");
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <em
        key={i}
        className="font-serif text-[1.15em] font-medium not-italic text-moss-dark"
      >
        {part}
      </em>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export function TheProblem() {
  const { t } = useLanguage();

  return (
    <section className="px-6 py-28 sm:py-40">
      <div className="mx-auto max-w-prose">
        {t.problem.lines.map((line, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0.15 }}
            whileInView={{ opacity: 1 }}
            // once: true → una vez visible, se queda visible.
            // margin -40% inferior ≈ la línea se enciende al cruzar el 60%
            // del alto del viewport.
            viewport={{ once: true, margin: "0px 0px -40% 0px" }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-10 font-serif text-2xl font-light leading-relaxed text-ink sm:text-3xl sm:leading-relaxed"
          >
            {renderLine(line)}
          </motion.p>
        ))}
      </div>
    </section>
  );
}

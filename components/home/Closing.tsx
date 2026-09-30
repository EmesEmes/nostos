"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

/**
 * 9. Cierre — Sobre la Investigación.
 * Créditos, institución, fuentes, contacto y llamado a la acción para
 * explorar las páginas individuales de las parroquias.
 * Todos los datos de crédito son PLACEHOLDER (ver lib/translations.ts).
 */
export function Closing() {
  const { t } = useLanguage();

  return (
    <section className="border-t border-hairline bg-paper-alt px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="font-serif text-3xl font-light text-ink sm:text-4xl">
            {t.closing.title}
          </h2>
          {/* Etimología del nombre: el sitio entero habla de volver a casa. */}
          <p className="mx-auto mt-4 max-w-lectura font-serif text-base font-light italic text-ink-soft">
            {t.closing.etymology}
          </p>
          <p className="mx-auto mt-6 max-w-lectura font-sans text-base leading-relaxed text-ink-soft">
            {t.closing.body}
          </p>

          {/* CTA principal: explorar las diez parroquias. */}
          <Link
            href="/#cantones"
            className="mt-12 inline-block border border-moss px-8 py-3 font-sans text-sm tracking-wide text-moss-dark transition-colors duration-300 hover:bg-moss hover:text-paper"
          >
            {t.closing.cta}
          </Link>
        </motion.div>

        <dl className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-8 border-t border-hairline pt-12 text-left sm:grid-cols-2">
          <div>
            <dt className="font-sans text-xs uppercase tracking-[0.2em] text-ink-soft">
              {t.closing.credits}
            </dt>
            <dd className="mt-1 font-sans text-sm text-ink">
              <Link
                href="/equipo/alexis-vallejo"
                className="border-b border-transparent transition-colors duration-200 hover:border-moss-dark hover:text-moss-dark"
              >
                {t.closing.creditsName}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="font-sans text-xs uppercase tracking-[0.2em] text-ink-soft">
              {t.closing.institution}
            </dt>
            <dd className="mt-1 font-sans text-sm text-ink">
              {t.closing.institutionName}
            </dd>
          </div>
          <div>
            <dt className="font-sans text-xs uppercase tracking-[0.2em] text-ink-soft">
              {t.closing.dataSources}
            </dt>
            <dd className="mt-1 font-sans text-sm text-ink">
              {t.closing.dataSourcesList}
            </dd>
          </div>
          <div>
            <dt className="font-sans text-xs uppercase tracking-[0.2em] text-ink-soft">
              {t.closing.contact}
            </dt>
            <dd className="mt-1 font-sans text-sm text-ink">
              <a
                href={`mailto:${t.closing.contactEmail}`}
                className="border-b border-transparent transition-colors duration-200 hover:border-moss-dark hover:text-moss-dark"
              >
                {t.closing.contactEmail}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

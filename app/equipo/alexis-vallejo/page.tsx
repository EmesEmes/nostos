"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/lib/LanguageContext";
import { team } from "@/data/team";

/**
 * Perfil de Alexis Vallejo Mancero (fundador de NOSTOS).
 * Lee de data/team.ts — al migrar los perfiles a Supabase, esta página
 * pasa a app/equipo/[slug]/page.tsx leyendo de la tabla `team_members`.
 */
export default function AlexisVallejoPage() {
  const { lang } = useLanguage();
  const member = team.find((m) => m.slug === "alexis-vallejo")!;

  return (
    <main>
      <LanguageSwitcher />

      {/* ── Apertura ──────────────────────────────────────────────────── */}
      <header className="px-6 pb-16 pt-28 sm:pt-36">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* ⚠️ RETRATO PLACEHOLDER: definir `portrait` en data/team.ts
              (Supabase Storage) y sustituir por <Image>. */}
          {member.portrait ? (
            <img
              src={member.portrait}
              alt={member.name}
              className="h-36 w-36 rounded-full border border-hairline object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-36 w-36 items-center justify-center rounded-full border border-hairline bg-paper-alt font-serif text-4xl font-light text-moss"
            >
              {member.name
                .split(" ")
                .slice(0, 2)
                .map((word) => word[0])
                .join("")}
            </div>
          )}

          <h1 className="mt-8 font-serif text-4xl font-light text-ink sm:text-5xl">
            {member.name}
          </h1>
          <p className="mt-3 font-sans text-xs uppercase tracking-[0.3em] text-moss">
            {member.role[lang]}
          </p>
        </div>
      </header>

      {/* ── Bio ───────────────────────────────────────────────────────── */}
      <section className="border-t border-hairline px-6 py-16">
        <div className="mx-auto max-w-lectura space-y-7">
          {member.bio.map((paragraph, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -12% 0px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={
                index === 0
                  ? // El primer párrafo, como entrada en serif.
                    "font-serif text-xl font-light leading-relaxed text-ink"
                  : "font-sans text-base leading-relaxed text-ink"
              }
            >
              {paragraph[lang]}
            </motion.p>
          ))}
        </div>
      </section>

      {/* ── Invitación a colaborar (cierra el circuito con Participa) ─── */}
      <section className="bg-paper-alt px-6 py-16 text-center">
        <Link
          href="/#participa"
          className="inline-block border border-moss px-8 py-3 font-sans text-sm tracking-wide text-moss-dark transition-colors duration-300 hover:bg-moss hover:text-paper"
        >
          {lang === "es" ? "Escríbele a NOSTOS" : "Write to NOSTOS"}
        </Link>
      </section>

      <footer className="border-t border-hairline px-6 py-12 text-center">
        <Link
          href="/"
          className="border-b border-moss pb-1 font-sans text-sm text-moss-dark transition-colors duration-200 hover:border-moss-dark"
        >
          ← NOSTOS
        </Link>
      </footer>
    </main>
  );
}

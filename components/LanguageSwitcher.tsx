"use client";

import { useLanguage } from "@/lib/LanguageContext";
import type { Lang } from "@/lib/translations";

/**
 * Switcher de idioma ES/EN.
 * Fijo en la esquina superior derecha, visible durante todo el scroll.
 * Discreto a propósito: el home no tiene navegación pesada.
 */
export function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();

  const options: Lang[] = ["es", "en"];

  return (
    <div
      className="fixed right-4 top-4 z-50 flex items-center gap-px overflow-hidden rounded-full border border-hairline bg-paper/90 shadow-sm backdrop-blur-sm sm:right-6 sm:top-6"
      role="group"
      aria-label={t.langSwitcher.label}
    >
      {options.map((option) => {
        const active = lang === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => setLang(option)}
            aria-pressed={active}
            className={`px-3 py-1.5 text-xs font-medium tracking-wide transition-colors duration-200 ${
              active
                ? "bg-moss text-paper"
                : "text-ink-soft hover:text-moss-dark"
            }`}
          >
            {t.langSwitcher[option]}
          </button>
        );
      })}
    </div>
  );
}

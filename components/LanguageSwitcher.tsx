"use client";

import { useLanguage } from "@/lib/LanguageContext";
import type { Lang } from "@/lib/translations";

const options: Lang[] = ["es", "en"];

export function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      className="flex items-center gap-px overflow-hidden rounded-full border border-hairline bg-paper"
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

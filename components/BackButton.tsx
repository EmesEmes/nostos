"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";

/**
 * Botón de regreso fijo (esquina superior izquierda), presente en las
 * páginas interiores. Usa router.back() si hay historial y cae a "/" si
 * la página se abrió directamente.
 */
export function BackButton() {
  const router = useRouter();
  const { lang } = useLanguage();
  const label = lang === "es" ? "Volver" : "Back";

  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) router.back();
        else router.push("/");
      }}
      aria-label={label}
      title={label}
      className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-paper/90 text-ink-soft shadow-sm backdrop-blur-sm transition-colors duration-200 hover:border-moss-dark hover:text-moss-dark sm:left-6 sm:top-6"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M10 3L5 8l5 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

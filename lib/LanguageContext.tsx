"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { translations, type Lang } from "./translations";

/**
 * Sistema de traducción deliberadamente simple (sin librería de i18n):
 * un diccionario tipado en lib/translations.ts y un contexto que expone
 * el idioma actual, un setter y el objeto de textos ya resuelto.
 *
 * La preferencia se persiste en localStorage y se refleja en el atributo
 * lang del <html> (importante para lectores de pantalla).
 */

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (typeof translations)["es"];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "nostos-lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // "es" es el idioma por defecto del proyecto.
  const [lang, setLangState] = useState<Lang>("es");

  // Recupera la preferencia guardada (solo en cliente, tras hidratar).
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "es" || stored === "en") {
      setLangState(stored);
    }
  }, []);

  // Mantiene <html lang="..."> sincronizado con el idioma activo.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage debe usarse dentro de <LanguageProvider>");
  }
  return ctx;
}

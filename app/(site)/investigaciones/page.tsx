"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function ResearchPage() {
  const { t } = useLanguage();

  return (
    <main className="px-6 pb-24 pt-28 sm:pt-36">
      <div className="mx-auto max-w-lectura text-center">
        <p className="font-sans text-xs uppercase tracking-[0.35em] text-moss">
          {t.researchPage.kicker}
        </p>
        <h1 className="mt-4 font-serif text-4xl font-light text-ink sm:text-5xl">
          {t.researchPage.title}
        </h1>
        <p className="mt-8 font-serif text-lg font-light italic leading-relaxed text-ink-soft">
          {t.researchPage.soon}
        </p>
      </div>
    </main>
  );
}

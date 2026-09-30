"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

type Author = {
  name: string;
  affiliation: string | null;
  bio_es: string | null;
  bio_en: string | null;
};

type Props = {
  title_es: string;
  title_en: string;
  summary_es: string;
  summary_en: string;
  published_at: string | null;
  author: Author | null;
  hasEnglishBody: boolean;
  bodyEs: React.ReactNode;
  bodyEn: React.ReactNode;
};

export function InvestigationArticle(props: Props) {
  const { lang, t } = useLanguage();
  const english = lang === "en";
  const title = (english && props.title_en) || props.title_es;
  const summary = (english && props.summary_en) || props.summary_es;
  const bio =
    props.author && ((english && props.author.bio_en) || props.author.bio_es);
  const dateFormat = new Intl.DateTimeFormat(english ? "en-US" : "es-EC", {
    dateStyle: "long",
  });

  return (
    <main className="px-6 pb-24 pt-28 sm:pt-36">
      <article className="mx-auto max-w-lectura">
        <Link
          href="/investigaciones"
          className="font-sans text-xs uppercase tracking-[0.2em] text-ink-soft transition-colors duration-200 hover:text-moss-dark"
        >
          ← {t.researchPage.back}
        </Link>

        <header className="mt-10">
          {props.published_at && (
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-moss">
              <time dateTime={props.published_at}>
                {dateFormat.format(new Date(props.published_at))}
              </time>
            </p>
          )}
          <h1 className="mt-4 font-serif text-4xl font-light leading-tight text-ink sm:text-5xl">
            {title}
          </h1>
          {props.author && (
            <p className="mt-6 font-sans text-sm text-ink-soft">
              {t.researchPage.by}{" "}
              <span className="text-ink">{props.author.name}</span>
              {props.author.affiliation && ` · ${props.author.affiliation}`}
            </p>
          )}
          {summary && (
            <p className="mt-8 font-serif text-xl font-light italic leading-relaxed text-ink-soft">
              {summary}
            </p>
          )}
        </header>

        <div className="mt-12 border-t border-hairline pt-12">
          {english && !props.hasEnglishBody && (
            <p className="mb-10 rounded-sm border border-hairline bg-paper-alt px-4 py-3 font-sans text-sm text-ink-soft">
              {t.researchPage.onlySpanish}
            </p>
          )}
          {english && props.hasEnglishBody ? props.bodyEn : props.bodyEs}
        </div>

        {props.author && bio && (
          <aside className="mt-20 border-t border-hairline pt-10">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-moss">
              {t.researchPage.aboutAuthor}
            </p>
            <p className="mt-3 font-serif text-xl font-light text-ink">
              {props.author.name}
            </p>
            <p className="mt-3 font-sans text-sm leading-relaxed text-ink-soft">
              {bio}
            </p>
          </aside>
        )}
      </article>
    </main>
  );
}

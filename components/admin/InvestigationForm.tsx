"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { JSONContent } from "@tiptap/react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import {
  saveInvestigation,
  type InvestigationFormState,
} from "@/app/admin/(panel)/investigaciones/actions";
import { slugify } from "@/lib/slug";

export type InvestigationFormValues = {
  id: string | null;
  slug: string;
  title_es: string;
  title_en: string;
  summary_es: string;
  summary_en: string;
  content_es: JSONContent | null;
  content_en: JSONContent | null;
  published: boolean;
  author_id: string | null;
};

export type AuthorOption = { id: string; name: string };

type Lang = "es" | "en";

const initialState: InvestigationFormState = { error: null, fieldErrors: {} };

const inputClass =
  "mt-1.5 w-full rounded-sm border border-hairline bg-paper px-3 py-2.5 font-sans text-sm text-ink outline-none transition-colors duration-200 focus:border-moss-dark";
const labelClass =
  "font-sans text-xs uppercase tracking-[0.15em] text-ink-soft";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 font-sans text-xs text-moss-dark">{message}</p>;
}

export function InvestigationForm({
  initial,
  authors,
}: {
  initial: InvestigationFormValues;
  authors: AuthorOption[];
}) {
  const [state, formAction, pending] = useActionState(
    saveInvestigation.bind(null, initial.id),
    initialState,
  );
  const [lang, setLang] = useState<Lang>("es");
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(initial.id !== null);
  const [content, setContent] = useState<Record<Lang, JSONContent | null>>({
    es: initial.content_es,
    en: initial.content_en,
  });

  const errors = state.fieldErrors;
  const tabHasError = (tab: Lang) =>
    Object.keys(errors).some((key) => key.endsWith(`_${tab}`));

  return (
    <form action={formAction} className="space-y-8">
      <input
        type="hidden"
        name="content_es"
        value={content.es ? JSON.stringify(content.es) : ""}
      />
      <input
        type="hidden"
        name="content_en"
        value={content.en ? JSON.stringify(content.en) : ""}
      />

      {state.error && (
        <p
          role="alert"
          className="rounded-sm border border-moss-dark px-4 py-3 font-sans text-sm text-moss-dark"
        >
          {state.error}
        </p>
      )}

      <div
        role="tablist"
        aria-label="Idioma del contenido"
        className="flex gap-1 border-b border-hairline"
      >
        {(["es", "en"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            id={`tab-${tab}`}
            aria-selected={lang === tab}
            aria-controls={`panel-${tab}`}
            onClick={() => setLang(tab)}
            className={`-mb-px border-b-2 px-4 py-2 font-sans text-sm transition-colors duration-200 ${
              lang === tab
                ? "border-moss text-ink"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {tab === "es" ? "Español" : "English"}
            {tabHasError(tab) && (
              <span className="ml-1.5 text-moss-dark">•</span>
            )}
          </button>
        ))}
      </div>

      {(["es", "en"] as const).map((tab) => (
        <div
          key={tab}
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
          hidden={lang !== tab}
          className="space-y-6"
        >
          <label className="block">
            <span className={labelClass}>
              {tab === "es" ? "Título *" : "Title"}
            </span>
            <input
              type="text"
              name={`title_${tab}`}
              defaultValue={initial[`title_${tab}`]}
              maxLength={200}
              onChange={
                tab === "es" && !slugTouched
                  ? (event) => setSlug(slugify(event.target.value))
                  : undefined
              }
              className={inputClass}
            />
            <FieldError message={errors[`title_${tab}`]} />
          </label>

          <label className="block">
            <span className={labelClass}>
              {tab === "es" ? "Resumen" : "Summary"}
            </span>
            <textarea
              name={`summary_${tab}`}
              defaultValue={initial[`summary_${tab}`]}
              maxLength={1000}
              rows={3}
              className={inputClass}
            />
            <FieldError message={errors[`summary_${tab}`]} />
          </label>

          <div>
            <span className={labelClass}>
              {tab === "es" ? "Texto" : "Text"}
            </span>
            <div className="mt-1.5">
              <RichTextEditor
                label={tab === "es" ? "Texto en español" : "Text in English"}
                initialContent={initial[`content_${tab}`]}
                onChange={(value) =>
                  setContent((previous) => ({ ...previous, [tab]: value }))
                }
              />
            </div>
          </div>
        </div>
      ))}

      <div className="grid gap-6 border-t border-hairline pt-8 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Autor *</span>
          {authors.length === 0 ? (
            <p className="mt-2 font-sans text-sm text-ink-soft">
              No hay autores todavía.{" "}
              <Link
                href="/admin/autores/nuevo"
                className="text-moss-dark underline underline-offset-2"
              >
                Crea el primero
              </Link>
              .
            </p>
          ) : (
            <select
              name="author_id"
              defaultValue={initial.author_id ?? ""}
              className={inputClass}
            >
              <option value="" disabled>
                Selecciona un autor
              </option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          )}
          <FieldError message={errors.author_id} />
        </label>

        <label className="block">
          <span className={labelClass}>Dirección (slug) *</span>
          <input
            type="text"
            name="slug"
            value={slug}
            maxLength={120}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
            className={`${inputClass} font-mono`}
          />
          <p className="mt-1.5 font-sans text-xs text-ink-soft">
            /investigaciones/{slug || "…"}
          </p>
          <FieldError message={errors.slug} />
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="published"
            defaultChecked={initial.published}
            className="h-4 w-4 accent-moss"
          />
          <span className="font-sans text-sm text-ink">
            Publicada (visible en el sitio)
          </span>
        </label>
      </div>

      <div className="flex justify-end gap-3">
        <Link
          href="/admin/investigaciones"
          className="rounded-sm border border-hairline px-5 py-2.5 font-sans text-sm text-ink-soft transition-colors duration-200 hover:text-ink"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="rounded-sm bg-moss px-6 py-2.5 font-sans text-sm font-medium text-paper transition-colors duration-200 hover:bg-moss-dark disabled:opacity-60"
        >
          {pending ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </form>
  );
}

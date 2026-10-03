"use client";

import { useState, useTransition } from "react";
import { MediaField } from "@/components/admin/MediaField";
import {
  deleteTestimony,
  moveTestimony,
  saveTestimony,
  type TestimonyResult,
} from "@/app/admin/(panel)/lugares/testimony-actions";

export type Testimony = {
  id: string;
  person_name: string;
  person_detail_es: string | null;
  person_detail_en: string | null;
  quote_es: string;
  quote_en: string;
  photo_path: string | null;
  audio_path: string | null;
  published: boolean;
};

const emptyTestimony: Omit<Testimony, "id"> = {
  person_name: "",
  person_detail_es: null,
  person_detail_en: null,
  quote_es: "",
  quote_en: "",
  photo_path: null,
  audio_path: null,
  published: true,
};

const inputClass =
  "mt-1.5 w-full rounded-sm border border-hairline bg-paper px-3 py-2 font-sans text-sm text-ink outline-none transition-colors duration-200 focus:border-moss-dark";
const labelClass =
  "font-sans text-xs uppercase tracking-[0.15em] text-ink-soft";
const smallButton =
  "rounded-sm border border-hairline px-3 py-1.5 font-sans text-xs text-ink transition-colors duration-200 hover:border-moss-dark hover:text-moss-dark disabled:opacity-40";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 font-sans text-xs text-moss-dark">{message}</p>;
}

function TestimonyForm({
  siteId,
  testimony,
  onSaved,
  extraActions,
}: {
  siteId: string;
  testimony: Testimony | null;
  onSaved?: () => void;
  extraActions?: React.ReactNode;
}) {
  const values = testimony ?? { id: null, ...emptyTestimony };
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<TestimonyResult | null>(null);
  const errors = result && !result.ok ? result.fieldErrors : {};

  const submit = (formData: FormData) => {
    startTransition(async () => {
      const response = await saveTestimony(
        siteId,
        testimony?.id ?? null,
        formData,
      );
      setResult(response);
      if (response.ok) onSaved?.();
    });
  };

  return (
    <form action={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-3">
        <label className="block">
          <span className={labelClass}>Nombre *</span>
          <input
            name="person_name"
            defaultValue={values.person_name}
            maxLength={150}
            className={inputClass}
          />
          <FieldError message={errors.person_name} />
        </label>
        <label className="block">
          <span className={labelClass}>Quién es (ES)</span>
          <input
            name="person_detail_es"
            defaultValue={values.person_detail_es ?? ""}
            maxLength={200}
            placeholder="Ej.: agricultora, 72 años"
            className={inputClass}
          />
          <FieldError message={errors.person_detail_es} />
        </label>
        <label className="block">
          <span className={labelClass}>Who they are (EN)</span>
          <input
            name="person_detail_en"
            defaultValue={values.person_detail_en ?? ""}
            maxLength={200}
            placeholder="E.g.: farmer, 72"
            className={inputClass}
          />
          <FieldError message={errors.person_detail_en} />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Testimonio (ES) *</span>
          <textarea
            name="quote_es"
            defaultValue={values.quote_es}
            maxLength={3000}
            rows={5}
            className={inputClass}
          />
          <FieldError message={errors.quote_es} />
        </label>
        <label className="block">
          <span className={labelClass}>Testimony (EN)</span>
          <textarea
            name="quote_en"
            defaultValue={values.quote_en}
            maxLength={3000}
            rows={5}
            className={inputClass}
          />
          <FieldError message={errors.quote_en} />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <MediaField
          kind="image"
          name="photo_path"
          label="Foto (opcional)"
          initialPath={values.photo_path}
        />
        <MediaField
          kind="audio"
          name="audio_path"
          label="Audio (opcional)"
          initialPath={values.audio_path}
        />
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="published"
          defaultChecked={values.published}
          className="h-4 w-4 accent-moss"
        />
        <span className="font-sans text-sm text-ink">
          Publicado (visible en el sitio)
        </span>
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-sm bg-moss px-5 py-2 font-sans text-sm font-medium text-paper transition-colors duration-200 hover:bg-moss-dark disabled:opacity-60"
        >
          {pending
            ? "Guardando…"
            : testimony
              ? "Guardar testimonio"
              : "Agregar testimonio"}
        </button>
        {extraActions}
      </div>

      {result && (
        <p
          role={result.ok ? "status" : "alert"}
          className={`font-sans text-xs ${result.ok ? "text-ink-soft" : "text-moss-dark"}`}
        >
          {result.ok ? "Guardado." : result.error}
        </p>
      )}
    </form>
  );
}

function TestimonyItem({
  siteId,
  testimony,
  isFirst,
  isLast,
}: {
  siteId: string;
  testimony: Testimony;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const run = (task: () => Promise<TestimonyResult>) => {
    setError(null);
    startTransition(async () => {
      const response = await task();
      if (!response.ok) setError(response.error);
    });
  };

  return (
    <li className="rounded-sm border border-hairline bg-paper">
      <details>
        <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div className="min-w-0">
            <p className="font-serif text-lg font-light text-ink">
              {testimony.person_name}
            </p>
            <p className="mt-0.5 truncate font-sans text-xs text-ink-soft">
              {testimony.person_detail_es && `${testimony.person_detail_es} · `}
              “{testimony.quote_es}”
            </p>
          </div>
          <span
            className={`rounded-full px-2.5 py-0.5 font-sans text-[11px] uppercase tracking-[0.1em] ${
              testimony.published
                ? "bg-moss text-paper"
                : "border border-hairline text-ink-soft"
            }`}
          >
            {testimony.published ? "Publicado" : "Borrador"}
          </span>
        </summary>

        <div className="border-t border-hairline px-5 py-5">
          <TestimonyForm
            siteId={siteId}
            testimony={testimony}
            extraActions={
              <>
                <button
                  type="button"
                  disabled={pending || isFirst}
                  onClick={() => run(() => moveTestimony(testimony.id, "up"))}
                  className={smallButton}
                >
                  ↑ Subir
                </button>
                <button
                  type="button"
                  disabled={pending || isLast}
                  onClick={() => run(() => moveTestimony(testimony.id, "down"))}
                  className={smallButton}
                >
                  ↓ Bajar
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => {
                    if (
                      window.confirm(
                        `¿Eliminar el testimonio de ${testimony.person_name}?`,
                      )
                    ) {
                      run(() => deleteTestimony(testimony.id));
                    }
                  }}
                  className={`${smallButton} ml-auto`}
                >
                  Eliminar
                </button>
              </>
            }
          />
          {error && (
            <p role="alert" className="mt-3 font-sans text-xs text-moss-dark">
              {error}
            </p>
          )}
        </div>
      </details>
    </li>
  );
}

export function SiteTestimonies({
  siteId,
  testimonies,
}: {
  siteId: string;
  testimonies: Testimony[];
}) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(0);

  return (
    <section className="space-y-6">
      {testimonies.length === 0 && !adding && (
        <p className="font-sans text-sm text-ink-soft">
          Este lugar todavía no tiene testimonios.
        </p>
      )}

      {testimonies.length > 0 && (
        <ul className="space-y-3">
          {testimonies.map((testimony, index) => (
            <TestimonyItem
              key={testimony.id}
              siteId={siteId}
              testimony={testimony}
              isFirst={index === 0}
              isLast={index === testimonies.length - 1}
            />
          ))}
        </ul>
      )}

      {added > 0 && !adding && (
        <p role="status" className="font-sans text-sm text-ink-soft">
          Testimonio agregado.
        </p>
      )}

      {adding ? (
        <div className="rounded-sm border border-moss bg-paper px-5 py-5">
          <h3 className="mb-5 font-serif text-lg font-light text-ink">
            Nuevo testimonio
          </h3>
          <TestimonyForm
            key={added}
            siteId={siteId}
            testimony={null}
            onSaved={() => {
              setAdded((count) => count + 1);
              setAdding(false);
            }}
            extraActions={
              <button
                type="button"
                onClick={() => setAdding(false)}
                className={smallButton}
              >
                Cancelar
              </button>
            }
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="rounded-sm border border-hairline bg-paper px-5 py-2.5 font-sans text-sm text-ink transition-colors duration-200 hover:border-moss-dark hover:text-moss-dark"
        >
          + Agregar testimonio
        </button>
      )}
    </section>
  );
}

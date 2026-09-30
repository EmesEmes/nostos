"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  saveAuthor,
  type AuthorFormState,
} from "@/app/admin/(panel)/autores/actions";

export type AuthorFormValues = {
  id: string | null;
  name: string;
  affiliation: string | null;
  bio_es: string | null;
  bio_en: string | null;
};

const initialState: AuthorFormState = { error: null, fieldErrors: {} };

const inputClass =
  "mt-1.5 w-full rounded-sm border border-hairline bg-paper px-3 py-2.5 font-sans text-sm text-ink outline-none transition-colors duration-200 focus:border-moss-dark";
const labelClass =
  "font-sans text-xs uppercase tracking-[0.15em] text-ink-soft";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 font-sans text-xs text-moss-dark">{message}</p>;
}

export function AuthorForm({ initial }: { initial: AuthorFormValues }) {
  const [state, formAction, pending] = useActionState(
    saveAuthor.bind(null, initial.id),
    initialState,
  );
  const errors = state.fieldErrors;

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <p
          role="alert"
          className="rounded-sm border border-moss-dark px-4 py-3 font-sans text-sm text-moss-dark"
        >
          {state.error}
        </p>
      )}

      <label className="block">
        <span className={labelClass}>Nombre *</span>
        <input
          type="text"
          name="name"
          defaultValue={initial.name}
          maxLength={200}
          className={inputClass}
        />
        <FieldError message={errors.name} />
      </label>

      <label className="block">
        <span className={labelClass}>Institución o afiliación</span>
        <input
          type="text"
          name="affiliation"
          defaultValue={initial.affiliation ?? ""}
          maxLength={200}
          className={inputClass}
        />
        <FieldError message={errors.affiliation} />
      </label>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Biografía (español)</span>
          <textarea
            name="bio_es"
            defaultValue={initial.bio_es ?? ""}
            maxLength={2000}
            rows={5}
            className={inputClass}
          />
          <FieldError message={errors.bio_es} />
        </label>
        <label className="block">
          <span className={labelClass}>Biography (English)</span>
          <textarea
            name="bio_en"
            defaultValue={initial.bio_en ?? ""}
            maxLength={2000}
            rows={5}
            className={inputClass}
          />
          <FieldError message={errors.bio_en} />
        </label>
      </div>

      <div className="flex justify-end gap-3 border-t border-hairline pt-6">
        <Link
          href="/admin/autores"
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

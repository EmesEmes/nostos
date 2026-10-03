"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { JSONContent } from "@tiptap/react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { MapPicker } from "@/components/admin/MapPicker";
import { MediaField } from "@/components/admin/MediaField";
import {
  saveSite,
  type SiteFormState,
} from "@/app/admin/(panel)/lugares/actions";
import { provinceShapes } from "@/data/provinceShapes";
import { zones } from "@/data/cantonalStudy";
import { slugify } from "@/lib/slug";

export type SiteFormValues = {
  id: string | null;
  name: string;
  kind: "canton" | "parroquia";
  province_id: string;
  slug: string;
  sort_order: number;
  published: boolean;
  map_x: number | null;
  map_y: number | null;
  zone_id: string | null;
  annual_rate: number | null;
  population_now: number | null;
  population_2050: number | null;
  change_pct: number | null;
  altitude: string | null;
  distance_es: string | null;
  distance_en: string | null;
  tagline_es: string | null;
  tagline_en: string | null;
  summary_es: string;
  summary_en: string;
  content_es: JSONContent | null;
  content_en: JSONContent | null;
  audio_title_es: string | null;
  audio_title_en: string | null;
  cover_path: string | null;
  audio_path: string | null;
};

type Lang = "es" | "en";

const initialState: SiteFormState = { error: null, fieldErrors: {} };

const inputClass =
  "mt-1.5 w-full rounded-sm border border-hairline bg-paper px-3 py-2.5 font-sans text-sm text-ink outline-none transition-colors duration-200 focus:border-moss-dark";
const labelClass =
  "font-sans text-xs uppercase tracking-[0.15em] text-ink-soft";
const sectionTitle = "font-serif text-xl font-light text-ink";

const provinces = [...provinceShapes].sort((a, b) =>
  a.name.localeCompare(b.name, "es"),
);

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 font-sans text-xs text-moss-dark">{message}</p>;
}

function NumberField({
  name,
  label,
  defaultValue,
  error,
  hint,
}: {
  name: string;
  label: string;
  defaultValue: number | null;
  error?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <input
        type="text"
        inputMode="decimal"
        name={name}
        defaultValue={defaultValue ?? ""}
        className={inputClass}
      />
      {hint && <p className="mt-1.5 font-sans text-xs text-ink-soft">{hint}</p>}
      <FieldError message={error} />
    </label>
  );
}

export function SiteForm({ initial }: { initial: SiteFormValues }) {
  const [state, formAction, pending] = useActionState(
    saveSite.bind(null, initial.id),
    initialState,
  );
  const [lang, setLang] = useState<Lang>("es");
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(initial.id !== null);
  const [provinceId, setProvinceId] = useState(initial.province_id);
  const [point, setPoint] = useState(
    initial.map_x !== null && initial.map_y !== null
      ? { x: initial.map_x, y: initial.map_y }
      : null,
  );
  const [content, setContent] = useState<Record<Lang, JSONContent | null>>({
    es: initial.content_es,
    en: initial.content_en,
  });

  const errors = state.fieldErrors;
  const tabHasError = (tab: Lang) =>
    Object.keys(errors).some((key) => key.endsWith(`_${tab}`));

  return (
    <form action={formAction} className="space-y-12">
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
      <input type="hidden" name="map_x" value={point?.x ?? ""} />
      <input type="hidden" name="map_y" value={point?.y ?? ""} />

      {state.error && (
        <p
          role="alert"
          className="rounded-sm border border-moss-dark px-4 py-3 font-sans text-sm text-moss-dark"
        >
          {state.error}
        </p>
      )}

      <section className="space-y-6">
        <h2 className={sectionTitle}>Datos generales</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className={labelClass}>Nombre *</span>
            <input
              type="text"
              name="name"
              defaultValue={initial.name}
              maxLength={200}
              onChange={
                !slugTouched
                  ? (event) => setSlug(slugify(event.target.value))
                  : undefined
              }
              className={inputClass}
            />
            <FieldError message={errors.name} />
          </label>

          <label className="block">
            <span className={labelClass}>Tipo *</span>
            <select
              name="kind"
              defaultValue={initial.kind}
              className={inputClass}
            >
              <option value="parroquia">Parroquia</option>
              <option value="canton">Cantón</option>
            </select>
            <FieldError message={errors.kind} />
          </label>

          <label className="block">
            <span className={labelClass}>Provincia *</span>
            <select
              name="province_id"
              value={provinceId}
              onChange={(event) => setProvinceId(event.target.value)}
              className={inputClass}
            >
              <option value="" disabled>
                Selecciona una provincia
              </option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
            <FieldError message={errors.province_id} />
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
            <FieldError message={errors.slug} />
          </label>

          <label className="block">
            <span className={labelClass}>Zona del análisis cantonal</span>
            <select
              name="zone_id"
              defaultValue={initial.zone_id ?? ""}
              className={inputClass}
            >
              <option value="">Ninguna</option>
              {zones
                .filter((zone) => zone.id !== "overview")
                .map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.title.es}
                  </option>
                ))}
            </select>
            <FieldError message={errors.zone_id} />
          </label>

          <NumberField
            name="sort_order"
            label="Orden"
            defaultValue={initial.sort_order}
            error={errors.sort_order}
            hint="Los números menores aparecen primero."
          />
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="published"
            defaultChecked={initial.published}
            className="h-4 w-4 accent-moss"
          />
          <span className="font-sans text-sm text-ink">
            Publicado (visible en el sitio)
          </span>
        </label>
      </section>

      <section className="space-y-4 border-t border-hairline pt-10">
        <h2 className={sectionTitle}>Ubicación en el mapa</h2>
        <MapPicker
          point={point}
          provinceId={provinceId}
          onPick={(picked, pickedProvince) => {
            setPoint(picked);
            if (pickedProvince) setProvinceId(pickedProvince);
          }}
          onClear={() => setPoint(null)}
        />
        <FieldError message={errors.map_x ?? errors.map_y} />
      </section>

      <section className="space-y-6 border-t border-hairline pt-10">
        <h2 className={sectionTitle}>Cifras</h2>
        <p className="font-sans text-sm text-ink-soft">
          Todas son opcionales. Deja vacío lo que no tengas.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          <NumberField
            name="annual_rate"
            label="Tasa anual 1990–2022 (%)"
            defaultValue={initial.annual_rate}
            error={errors.annual_rate}
            hint="Ej.: -1.21"
          />
          <NumberField
            name="change_pct"
            label="Variación de población (%)"
            defaultValue={initial.change_pct}
            error={errors.change_pct}
          />
          <NumberField
            name="population_now"
            label="Población actual"
            defaultValue={initial.population_now}
            error={errors.population_now}
          />
          <NumberField
            name="population_2050"
            label="Población proyectada 2050"
            defaultValue={initial.population_2050}
            error={errors.population_2050}
          />
          <label className="block">
            <span className={labelClass}>Altitud</span>
            <input
              type="text"
              name="altitude"
              defaultValue={initial.altitude ?? ""}
              maxLength={100}
              placeholder="Ej.: 2.100 m s. n. m."
              className={inputClass}
            />
            <FieldError message={errors.altitude} />
          </label>
        </div>
      </section>

      <section className="space-y-6 border-t border-hairline pt-10">
        <h2 className={sectionTitle}>Contenido</h2>

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
                {tab === "es" ? "Frase breve" : "Tagline"}
              </span>
              <input
                type="text"
                name={`tagline_${tab}`}
                defaultValue={initial[`tagline_${tab}`] ?? ""}
                maxLength={200}
                className={inputClass}
              />
              <FieldError message={errors[`tagline_${tab}`]} />
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

            <label className="block">
              <span className={labelClass}>
                {tab === "es" ? "Distancia o acceso" : "Distance or access"}
              </span>
              <input
                type="text"
                name={`distance_${tab}`}
                defaultValue={initial[`distance_${tab}`] ?? ""}
                maxLength={200}
                placeholder={
                  tab === "es"
                    ? "Ej.: A 2 horas de Quito"
                    : "E.g.: 2 hours from Quito"
                }
                className={inputClass}
              />
              <FieldError message={errors[`distance_${tab}`]} />
            </label>

            <div>
              <span className={labelClass}>
                {tab === "es" ? "Texto" : "Text"}
              </span>
              <div className="mt-1.5">
                <RichTextEditor
                  label={tab === "es" ? "Texto en español" : "Text in English"}
                  initialContent={initial[`content_${tab}`]}
                  imageFolder="sites"
                  onChange={(value) =>
                    setContent((previous) => ({ ...previous, [tab]: value }))
                  }
                />
              </div>
            </div>

            <label className="block">
              <span className={labelClass}>
                {tab === "es" ? "Título del audio" : "Audio title"}
              </span>
              <input
                type="text"
                name={`audio_title_${tab}`}
                defaultValue={initial[`audio_title_${tab}`] ?? ""}
                maxLength={200}
                className={inputClass}
              />
              <FieldError message={errors[`audio_title_${tab}`]} />
            </label>
          </div>
        ))}
      </section>

      <section className="space-y-6 border-t border-hairline pt-10">
        <h2 className={sectionTitle}>Portada y audio</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <MediaField
            kind="image"
            name="cover_path"
            label="Imagen de portada"
            initialPath={initial.cover_path}
            hint="JPG, PNG o WebP. Se optimiza automáticamente."
          />
          <MediaField
            kind="audio"
            name="audio_path"
            label="Pista de audio"
            initialPath={initial.audio_path}
            hint="MP3, M4A, AAC, OGG o WAV, hasta 50 MB."
          />
        </div>
      </section>

      <div className="flex justify-end gap-3 border-t border-hairline pt-8">
        <Link
          href="/admin/lugares"
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

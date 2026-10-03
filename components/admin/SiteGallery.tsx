"use client";

import { useRef, useState, useTransition } from "react";
import {
  addSiteImages,
  deleteSiteImage,
  moveSiteImage,
  updateSiteImage,
} from "@/app/admin/(panel)/lugares/gallery-actions";
import { ACCEPTED_IMAGE_TYPES, uploadImage } from "@/lib/media-upload";
import { storageUrl } from "@/lib/storage-paths";

export type GalleryImage = {
  id: string;
  path: string;
  alt_es: string;
  alt_en: string;
  caption_es: string | null;
  caption_en: string | null;
};

const MAX_FILES = 20;

const inputClass =
  "mt-1 w-full rounded-sm border border-hairline bg-paper px-2.5 py-1.5 font-sans text-sm text-ink outline-none transition-colors duration-200 focus:border-moss-dark";
const labelClass =
  "font-sans text-[11px] uppercase tracking-[0.12em] text-ink-soft";
const smallButton =
  "rounded-sm border border-hairline px-2.5 py-1 font-sans text-xs text-ink transition-colors duration-200 hover:border-moss-dark hover:text-moss-dark disabled:opacity-40";

function ImageCard({
  image,
  isFirst,
  isLast,
}: {
  image: GalleryImage;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "ok" | "error";
    text: string;
  } | null>(null);

  const run = (
    task: () => Promise<{ error: string } | { ok: true }>,
    okText?: string,
  ) => {
    setMessage(null);
    startTransition(async () => {
      const result = await task();
      if ("error" in result) setMessage({ type: "error", text: result.error });
      else if (okText) setMessage({ type: "ok", text: okText });
    });
  };

  return (
    <li className="overflow-hidden rounded-sm border border-hairline bg-paper">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={storageUrl(image.path)}
        alt={image.alt_es}
        className="aspect-[4/3] w-full object-cover"
      />

      <form
        action={(formData) =>
          run(() => updateSiteImage(image.id, formData), "Guardado.")
        }
        className="space-y-3 p-4"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className={labelClass}>Descripción (ES)</span>
            <input
              name="alt_es"
              defaultValue={image.alt_es}
              maxLength={300}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Description (EN)</span>
            <input
              name="alt_en"
              defaultValue={image.alt_en}
              maxLength={300}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Pie de foto (ES)</span>
            <input
              name="caption_es"
              defaultValue={image.caption_es ?? ""}
              maxLength={500}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Caption (EN)</span>
            <input
              name="caption_en"
              defaultValue={image.caption_en ?? ""}
              maxLength={500}
              className={inputClass}
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button type="submit" disabled={pending} className={smallButton}>
            Guardar textos
          </button>
          <button
            type="button"
            disabled={pending || isFirst}
            aria-label="Mover antes"
            title="Mover antes"
            onClick={() => run(() => moveSiteImage(image.id, "up"))}
            className={smallButton}
          >
            ←
          </button>
          <button
            type="button"
            disabled={pending || isLast}
            aria-label="Mover después"
            title="Mover después"
            onClick={() => run(() => moveSiteImage(image.id, "down"))}
            className={smallButton}
          >
            →
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (window.confirm("¿Eliminar esta foto de la galería?"))
                run(() => deleteSiteImage(image.id));
            }}
            className={`${smallButton} ml-auto`}
          >
            Eliminar
          </button>
        </div>

        {message && (
          <p
            role={message.type === "error" ? "alert" : "status"}
            className={`font-sans text-xs ${message.type === "error" ? "text-moss-dark" : "text-ink-soft"}`}
          >
            {message.text}
          </p>
        )}
      </form>
    </li>
  );
}

export function SiteGallery({
  siteId,
  images,
}: {
  siteId: string;
  images: GalleryImage[];
}) {
  const input = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = async (fileList: FileList | null) => {
    const files = Array.from(fileList ?? []).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (files.length === 0) return;
    if (files.length > MAX_FILES) {
      setError(`Sube como máximo ${MAX_FILES} fotos a la vez.`);
      return;
    }

    setError(null);
    const paths: string[] = [];
    try {
      for (const [index, file] of files.entries()) {
        setProgress(`Subiendo ${index + 1} de ${files.length}…`);
        paths.push((await uploadImage(file, "sites")).path);
      }
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "No se pudo subir la foto.",
      );
    }

    if (paths.length > 0) {
      setProgress("Guardando…");
      try {
        const result = await addSiteImages(siteId, paths);
        if ("error" in result) setError(result.error);
      } catch {
        setError("No se pudieron guardar las fotos. Intenta de nuevo.");
      }
    }

    setProgress(null);
    if (input.current) input.current.value = "";
  };

  return (
    <section className="space-y-6">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!progress) handleFiles(event.dataTransfer.files);
        }}
        className={`flex flex-col items-center gap-3 rounded-sm border border-dashed px-6 py-8 text-center transition-colors duration-200 ${
          dragging ? "border-moss bg-paper-alt" : "border-hairline bg-paper"
        }`}
      >
        <p className="font-sans text-sm text-ink-soft">
          Arrastra fotos aquí o{" "}
          <button
            type="button"
            disabled={Boolean(progress)}
            onClick={() => input.current?.click()}
            className="text-moss-dark underline underline-offset-2 disabled:opacity-60"
          >
            elígelas desde tu computadora
          </button>
          .
        </p>
        <p className="font-sans text-xs text-ink-soft">
          Hasta {MAX_FILES} a la vez. JPG, PNG o WebP; se optimizan
          automáticamente.
        </p>
        {progress && (
          <p role="status" className="font-sans text-sm text-ink">
            {progress}
          </p>
        )}
        {error && (
          <p role="alert" className="font-sans text-sm text-moss-dark">
            {error}
          </p>
        )}
        <input
          ref={input}
          type="file"
          multiple
          accept={ACCEPTED_IMAGE_TYPES}
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>

      {images.length === 0 ? (
        <p className="font-sans text-sm text-ink-soft">
          La galería todavía no tiene fotos.
        </p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2">
          {images.map((image, index) => (
            <ImageCard
              key={image.id}
              image={image}
              isFirst={index === 0}
              isLast={index === images.length - 1}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

"use client";

import { useRef, useState } from "react";
import {
  ACCEPTED_AUDIO_TYPES,
  ACCEPTED_IMAGE_TYPES,
  uploadAudio,
  uploadImage,
} from "@/lib/media-upload";
import { storageUrl } from "@/lib/storage-paths";

type Props = {
  kind: "image" | "audio";
  name: string;
  label: string;
  hint?: string;
  initialPath: string | null;
};

const buttonClass =
  "rounded-sm border border-hairline px-3 py-1.5 font-sans text-xs text-ink transition-colors duration-200 hover:border-moss-dark hover:text-moss-dark disabled:opacity-60";

export function MediaField({ kind, name, label, hint, initialPath }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [path, setPath] = useState(initialPath);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const result =
        kind === "image"
          ? await uploadImage(file, "sites")
          : await uploadAudio(file);
      setPath(result.path);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "No se pudo subir el archivo.",
      );
    } finally {
      setUploading(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div>
      <span className="font-sans text-xs uppercase tracking-[0.15em] text-ink-soft">
        {label}
      </span>
      <input type="hidden" name={name} value={path ?? ""} />

      <div className="mt-1.5 rounded-sm border border-hairline bg-paper p-4">
        {path &&
          (kind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={storageUrl(path)}
              alt=""
              className="mb-4 max-h-56 rounded-sm object-cover"
            />
          ) : (
            <audio
              controls
              preload="metadata"
              src={storageUrl(path)}
              className="mb-4 w-full"
            />
          ))}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => input.current?.click()}
            className={buttonClass}
          >
            {uploading
              ? "Subiendo…"
              : path
                ? "Reemplazar"
                : kind === "image"
                  ? "Subir imagen"
                  : "Subir audio"}
          </button>
          {path && !uploading && (
            <button
              type="button"
              onClick={() => setPath(null)}
              className={buttonClass}
            >
              Quitar
            </button>
          )}
        </div>

        {hint && <p className="mt-2 font-sans text-xs text-ink-soft">{hint}</p>}
        {error && (
          <p role="alert" className="mt-2 font-sans text-xs text-moss-dark">
            {error}
          </p>
        )}
      </div>

      <input
        ref={input}
        type="file"
        accept={kind === "image" ? ACCEPTED_IMAGE_TYPES : ACCEPTED_AUDIO_TYPES}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}

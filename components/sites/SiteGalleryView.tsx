"use client";

import { useRef, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { storageUrl } from "@/lib/storage-paths";

export type PublicImage = {
  id: string;
  path: string;
  alt_es: string;
  alt_en: string;
  caption_es: string | null;
  caption_en: string | null;
};

export function SiteGalleryView({ images }: { images: PublicImage[] }) {
  const { lang, t } = useLanguage();
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const english = lang === "en";

  const text = (image: PublicImage) => ({
    alt: (english && image.alt_en) || image.alt_es,
    caption: (english && image.caption_en) || image.caption_es,
  });

  const open = (position: number) => {
    setIndex(position);
    dialog.current?.showModal();
  };
  const step = (delta: number) =>
    setIndex((current) => (current + delta + images.length) % images.length);

  const current = images[index];

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, position) => {
          const { alt, caption } = text(image);
          return (
            <li key={image.id}>
              <figure>
                <button
                  type="button"
                  onClick={() => open(position)}
                  aria-label={`${t.sitesPage.openImage}: ${alt}`}
                  className="block w-full overflow-hidden rounded-sm bg-paper-alt"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={storageUrl(image.path)}
                    alt={alt}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                  />
                </button>
                {caption && (
                  <figcaption className="mt-2 font-sans text-xs leading-relaxed text-ink-soft">
                    {caption}
                  </figcaption>
                )}
              </figure>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialog}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1);
          if (event.key === "ArrowLeft") step(-1);
        }}
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close();
        }}
        className="m-auto max-h-[92vh] w-[min(92vw,1100px)] bg-transparent p-0 backdrop:bg-ink/85"
      >
        {current && (
          <figure className="flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={storageUrl(current.path)}
              alt={text(current).alt}
              className="max-h-[78vh] w-auto rounded-sm"
            />
            <figcaption className="mt-4 flex w-full flex-wrap items-center justify-between gap-3 font-sans text-sm text-paper">
              <span>{text(current).caption}</span>
              <span className="flex items-center gap-2">
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      className="rounded-sm border border-paper/40 px-3 py-1.5 hover:bg-paper/10"
                    >
                      ← {t.sitesPage.previous}
                    </button>
                    <span className="tabular-nums">
                      {index + 1} / {images.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      className="rounded-sm border border-paper/40 px-3 py-1.5 hover:bg-paper/10"
                    >
                      {t.sitesPage.next} →
                    </button>
                  </>
                )}
                <button
                  type="button"
                  autoFocus
                  onClick={() => dialog.current?.close()}
                  className="rounded-sm border border-paper/40 px-3 py-1.5 hover:bg-paper/10"
                >
                  {t.sitesPage.close}
                </button>
              </span>
            </figcaption>
          </figure>
        )}
      </dialog>
    </>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  EditorContent,
  useEditor,
  useEditorState,
  type JSONContent,
} from "@tiptap/react";
import { Placeholder } from "@tiptap/extensions";
import { contentExtensions } from "@/lib/editor-content";
import { ACCEPTED_IMAGE_TYPES, uploadImage } from "@/lib/media-upload";
import type { ImageFolder } from "@/lib/storage-paths";

type Props = {
  label: string;
  initialContent: JSONContent | null;
  onChange: (content: JSONContent) => void;
  imageFolder?: ImageFolder;
};

const emptyState = {
  bold: false,
  italic: false,
  underline: false,
  h2: false,
  h3: false,
  bulletList: false,
  orderedList: false,
  blockquote: false,
  link: false,
  canUndo: false,
  canRedo: false,
  image: false,
  imageAlt: "",
};

const toolButtonClass =
  "min-w-8 rounded-sm px-2 py-1 font-sans text-sm transition-colors duration-150 disabled:opacity-40";

function imageFiles(files: FileList | null | undefined) {
  return Array.from(files ?? []).filter((file) =>
    file.type.startsWith("image/"),
  );
}

function normalizeUrl(value: string) {
  const url = value.trim();
  if (/^(https?:\/\/|mailto:)/i.test(url)) return url;
  return `https://${url}`;
}

export function RichTextEditor({
  label,
  initialContent,
  onChange,
  imageFolder = "investigations",
}: Props) {
  const fileInput = useRef<HTMLInputElement>(null);
  const insertImageRef = useRef<(file: File) => void>(() => {});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      ...contentExtensions,
      Placeholder.configure({ placeholder: "Escribe aquí el texto…" }),
    ],
    content: initialContent ?? undefined,
    editorProps: {
      attributes: {
        class: "rich-text min-h-80 px-5 py-4 outline-none",
        "aria-label": label,
      },
      handlePaste: (_view, event) => {
        const images = imageFiles(event.clipboardData?.files);
        if (images.length === 0) return false;
        images.forEach((file) => insertImageRef.current(file));
        return true;
      },
      handleDrop: (_view, event, _slice, moved) => {
        if (moved) return false;
        const images = imageFiles(event.dataTransfer?.files);
        if (images.length === 0) return false;
        event.preventDefault();
        images.forEach((file) => insertImageRef.current(file));
        return true;
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
  });

  const state =
    useEditorState({
      editor,
      selector: ({ editor }) =>
        editor
          ? {
              bold: editor.isActive("bold"),
              italic: editor.isActive("italic"),
              underline: editor.isActive("underline"),
              h2: editor.isActive("heading", { level: 2 }),
              h3: editor.isActive("heading", { level: 3 }),
              bulletList: editor.isActive("bulletList"),
              orderedList: editor.isActive("orderedList"),
              blockquote: editor.isActive("blockquote"),
              link: editor.isActive("link"),
              canUndo: editor.can().undo(),
              canRedo: editor.can().redo(),
              image: editor.isActive("image"),
              imageAlt:
                (editor.getAttributes("image").alt as string | undefined) ?? "",
            }
          : null,
    }) ?? emptyState;

  const insertImage = useCallback(
    async (file: File) => {
      if (!editor) return;
      setUploadError(null);
      setUploading(true);
      try {
        const { path, url } = await uploadImage(file, imageFolder);
        editor
          .chain()
          .focus()
          .insertContent([
            { type: "image", attrs: { src: url, path, alt: "" } },
            { type: "paragraph" },
          ])
          .run();
      } catch (error) {
        setUploadError(
          error instanceof Error
            ? error.message
            : "No se pudo subir la imagen.",
        );
      } finally {
        setUploading(false);
        if (fileInput.current) fileInput.current.value = "";
      }
    },
    [editor, imageFolder],
  );

  useEffect(() => {
    insertImageRef.current = insertImage;
  }, [insertImage]);

  if (!editor) {
    return (
      <div
        className="h-96 rounded-sm border border-hairline bg-paper"
        aria-hidden="true"
      />
    );
  }

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const value = window.prompt("Dirección del enlace", previous ?? "https://");
    if (value === null) return;
    if (value.trim() === "" || value.trim() === "https://") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: normalizeUrl(value) })
      .run();
  };

  const buttons = [
    {
      label: "Negrita",
      text: "B",
      className: "font-bold",
      active: state.bold,
      run: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "Cursiva",
      text: "I",
      className: "italic",
      active: state.italic,
      run: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "Subrayado",
      text: "U",
      className: "underline",
      active: state.underline,
      run: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      label: "Título",
      text: "H2",
      active: state.h2,
      run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "Subtítulo",
      text: "H3",
      active: state.h3,
      run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      label: "Lista con viñetas",
      text: "•",
      active: state.bulletList,
      run: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Lista numerada",
      text: "1.",
      active: state.orderedList,
      run: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "Cita",
      text: "“ ”",
      active: state.blockquote,
      run: () => editor.chain().focus().toggleBlockquote().run(),
    },
    { label: "Enlace", text: "Enlace", active: state.link, run: setLink },
  ];

  return (
    <div>
      <div className="overflow-hidden rounded-sm border border-hairline bg-paper focus-within:border-moss-dark">
        <div
          role="toolbar"
          aria-label={`Formato: ${label}`}
          className="flex flex-wrap items-center gap-1 border-b border-hairline bg-paper-alt px-2 py-1.5"
        >
          {buttons.map((button) => (
            <button
              key={button.label}
              type="button"
              title={button.label}
              aria-label={button.label}
              aria-pressed={button.active}
              onClick={button.run}
              className={`${toolButtonClass} ${
                button.active
                  ? "bg-moss text-paper"
                  : "text-ink hover:bg-hairline"
              } ${button.className ?? ""}`}
            >
              {button.text}
            </button>
          ))}
          <button
            type="button"
            title="Insertar imagen"
            aria-label="Insertar imagen"
            disabled={uploading}
            onClick={() => fileInput.current?.click()}
            className={`${toolButtonClass} text-ink hover:bg-hairline`}
          >
            {uploading ? "Subiendo…" : "Imagen"}
          </button>
          <span className="mx-1 h-5 w-px bg-hairline" aria-hidden="true" />
          <button
            type="button"
            title="Deshacer"
            aria-label="Deshacer"
            disabled={!state.canUndo}
            onClick={() => editor.chain().focus().undo().run()}
            className={`${toolButtonClass} text-ink hover:bg-hairline`}
          >
            ↶
          </button>
          <button
            type="button"
            title="Rehacer"
            aria-label="Rehacer"
            disabled={!state.canRedo}
            onClick={() => editor.chain().focus().redo().run()}
            className={`${toolButtonClass} text-ink hover:bg-hairline`}
          >
            ↷
          </button>
        </div>
        {state.image && (
          <div className="flex flex-wrap items-center gap-3 border-b border-hairline bg-paper-alt px-3 py-2">
            <label className="flex min-w-60 flex-1 items-center gap-2">
              <span className="shrink-0 font-sans text-xs text-ink-soft">
                Descripción de la imagen
              </span>
              <input
                type="text"
                value={state.imageAlt}
                maxLength={300}
                placeholder="Ej.: Plaza central de Chavezpamba al atardecer"
                onChange={(event) =>
                  editor
                    .chain()
                    .updateAttributes("image", { alt: event.target.value })
                    .run()
                }
                className="w-full rounded-sm border border-hairline bg-paper px-2 py-1 font-sans text-sm text-ink outline-none focus:border-moss-dark"
              />
            </label>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteSelection().run()}
              className="rounded-sm border border-hairline px-3 py-1 font-sans text-xs text-ink-soft transition-colors duration-150 hover:border-moss-dark hover:text-moss-dark"
            >
              Quitar imagen
            </button>
          </div>
        )}
        <EditorContent editor={editor} />
      </div>

      <input
        ref={fileInput}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) insertImage(file);
        }}
      />

      {uploadError && (
        <p role="alert" className="mt-2 font-sans text-xs text-moss-dark">
          {uploadError}
        </p>
      )}
    </div>
  );
}

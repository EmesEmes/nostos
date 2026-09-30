import type { JSONContent } from "@tiptap/react";
import { renderToReactElement } from "@tiptap/static-renderer/pm/react";
import { contentExtensions, withImageUrls } from "@/lib/editor-content";

export function RichText({ content }: { content: unknown }) {
  if (!content) return null;

  return (
    <div className="rich-text">
      {renderToReactElement({
        content: withImageUrls(content) as JSONContent,
        extensions: contentExtensions,
      })}
    </div>
  );
}

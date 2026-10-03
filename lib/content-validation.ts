import "server-only";
import { z } from "zod";
import { stripImageUrls } from "@/lib/editor-content";
import type { Json } from "@/lib/supabase/database.types";

const MAX_CONTENT_LENGTH = 1_000_000;

const docSchema = z.looseObject({
  type: z.literal("doc"),
  content: z.array(z.unknown()).optional(),
});

export function parseEditorContent(
  raw: FormDataEntryValue | null,
): Json | null | undefined {
  if (typeof raw !== "string" || raw === "") return null;
  if (raw.length > MAX_CONTENT_LENGTH) return undefined;
  try {
    const parsed = docSchema.safeParse(JSON.parse(raw));
    return parsed.success ? stripImageUrls(parsed.data as Json) : undefined;
  } catch {
    return undefined;
  }
}

export function collectFieldErrors(issues: z.core.$ZodIssue[]) {
  const fieldErrors: Partial<Record<string, string>> = {};
  for (const issue of issues) {
    const key = String(issue.path[0]);
    fieldErrors[key] ??= issue.message;
  }
  return fieldErrors;
}

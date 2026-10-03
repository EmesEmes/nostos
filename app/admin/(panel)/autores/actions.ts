"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { collectFieldErrors } from "@/lib/content-validation";

export type AuthorFormState = {
  error: string | null;
  fieldErrors: Partial<Record<string, string>>;
};

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Máximo ${max} caracteres.`)
    .transform((value) => (value === "" ? null : value));

const authorSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio.").max(200),
  affiliation: optionalText(200),
  bio_es: optionalText(2000),
  bio_en: optionalText(2000),
});

const idSchema = z.uuid();

function revalidateAuthors() {
  revalidatePath("/admin/autores");
  revalidatePath("/admin/investigaciones");
  revalidatePath("/investigaciones", "layout");
}

export async function saveAuthor(
  id: string | null,
  _prev: AuthorFormState,
  formData: FormData,
): Promise<AuthorFormState> {
  const { supabase } = await requireAdmin();

  if (id !== null && !idSchema.safeParse(id).success) {
    return { error: "Autor no válido.", fieldErrors: {} };
  }

  const parsed = authorSchema.safeParse({
    name: formData.get("name") ?? "",
    affiliation: formData.get("affiliation") ?? "",
    bio_es: formData.get("bio_es") ?? "",
    bio_en: formData.get("bio_en") ?? "",
  });

  if (!parsed.success) {
    return {
      error: "Revisa los campos marcados.",
      fieldErrors: collectFieldErrors(parsed.error.issues),
    };
  }

  const { error } =
    id === null
      ? await supabase.from("authors").insert(parsed.data)
      : await supabase.from("authors").update(parsed.data).eq("id", id);

  if (error)
    return { error: "No se pudo guardar. Intenta de nuevo.", fieldErrors: {} };

  revalidateAuthors();
  redirect("/admin/autores?guardado=1");
}

export async function deleteAuthor(id: string) {
  const { supabase } = await requireAdmin();
  if (!idSchema.safeParse(id).success) return { error: "Autor no válido." };

  const { error } = await supabase.from("authors").delete().eq("id", id);

  if (error) {
    return {
      error:
        error.code === "23503"
          ? "No se puede eliminar: tiene investigaciones asignadas. Cámbialas de autor primero."
          : "No se pudo eliminar. Intenta de nuevo.",
    };
  }

  revalidateAuthors();
  redirect("/admin/autores?eliminado=1");
}

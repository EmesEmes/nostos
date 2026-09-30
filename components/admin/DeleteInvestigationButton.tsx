"use client";

import { useTransition } from "react";
import { deleteInvestigation } from "@/app/admin/(panel)/investigaciones/actions";

export function DeleteInvestigationButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    if (
      !window.confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`)
    )
      return;
    startTransition(() => deleteInvestigation(id));
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="rounded-sm border border-hairline px-4 py-2 font-sans text-sm text-ink-soft transition-colors duration-200 hover:border-moss-dark hover:text-moss-dark disabled:opacity-60"
    >
      {pending ? "Eliminando…" : "Eliminar"}
    </button>
  );
}

"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function PanelError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="rounded-sm border border-moss-dark bg-paper px-6 py-8"
    >
      <h1 className="font-serif text-2xl font-light text-ink">
        Algo salió mal
      </h1>
      <p className="mt-2 font-sans text-sm text-ink-soft">
        No se pudo completar la acción. Tus cambios no se guardaron.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-ink-soft">
          Código: {error.digest}
        </p>
      )}
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-sm bg-moss px-5 py-2 font-sans text-sm font-medium text-paper transition-colors duration-200 hover:bg-moss-dark"
        >
          Intentar de nuevo
        </button>
        <Link
          href="/admin"
          className="rounded-sm border border-hairline px-5 py-2 font-sans text-sm text-ink-soft transition-colors duration-200 hover:text-ink"
        >
          Volver al panel
        </Link>
      </div>
    </div>
  );
}

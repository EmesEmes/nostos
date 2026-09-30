"use client";

import { useState, useTransition } from "react";

type Props = {
  action: () => Promise<{ error: string } | void>;
  confirmMessage: string;
};

export function DeleteButton({ action, confirmMessage }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    if (!window.confirm(confirmMessage)) return;
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result?.error) setError(result.error);
    });
  };

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="rounded-sm border border-hairline px-4 py-2 font-sans text-sm text-ink-soft transition-colors duration-200 hover:border-moss-dark hover:text-moss-dark disabled:opacity-60"
      >
        {pending ? "Eliminando…" : "Eliminar"}
      </button>
      {error && (
        <p
          role="alert"
          className="max-w-xs text-right font-sans text-xs text-moss-dark"
        >
          {error}
        </p>
      )}
    </div>
  );
}

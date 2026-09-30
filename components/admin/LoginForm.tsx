"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "@/app/admin/actions";

const initialState: LoginState = { error: null };

const inputClass =
  "mt-1.5 w-full rounded-sm border border-hairline bg-paper px-3 py-2.5 font-sans text-sm text-ink outline-none transition-colors duration-200 focus:border-moss-dark";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <input type="hidden" name="next" value={next} />

      <label className="block">
        <span className="font-sans text-xs uppercase tracking-[0.15em] text-ink-soft">
          Correo
        </span>
        <input
          type="email"
          name="email"
          required
          autoComplete="username"
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className="font-sans text-xs uppercase tracking-[0.15em] text-ink-soft">
          Contraseña
        </span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </label>

      {state.error && (
        <p role="alert" className="font-sans text-sm text-moss-dark">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-sm bg-moss px-4 py-2.5 font-sans text-sm font-medium text-paper transition-colors duration-200 hover:bg-moss-dark disabled:opacity-60"
      >
        {pending ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}

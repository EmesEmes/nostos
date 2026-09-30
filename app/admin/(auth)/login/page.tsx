import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdmin, safeAdminPath } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default async function LoginPage({
  searchParams,
}: PageProps<"/admin/login">) {
  const { next } = await searchParams;
  const nextPath = safeAdminPath(next);

  if (await getAdmin()) redirect(nextPath);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-sm border border-hairline bg-paper p-8">
        <p className="font-serif text-lg tracking-[0.2em] text-ink">NOSTOS</p>
        <h1 className="mt-6 font-serif text-2xl font-light text-ink">
          Panel administrativo
        </h1>
        <p className="mt-2 font-sans text-sm text-ink-soft">
          Ingresa con tu cuenta.
        </p>
        <LoginForm next={nextPath} />
      </div>
    </main>
  );
}

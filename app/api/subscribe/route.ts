import { NextResponse } from "next/server";

/**
 * Suscripción al boletín — STUB con dos caminos.
 *
 * RECOMENDADO · Proveedor de boletines (el cliente enviará desde ahí,
 * y el proveedor gestiona doble opt-in, bajas y la parte legal):
 *   - Buttondown (buttondown.com, ideal para investigadores):
 *       env BUTTONDOWN_API_KEY → POST https://api.buttondown.com/v1/subscribers
 *       body: { email_address: email }  (implementado abajo)
 *   - Alternativas: Brevo, Mailchimp (misma mecánica, distinta URL).
 *
 * COMPLEMENTO · Copia en Supabase (respaldo propio de la lista):
 *   create table newsletter_subscribers (
 *     id uuid primary key default gen_random_uuid(),
 *     created_at timestamptz default now(),
 *     email text unique
 *   );
 */

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email: string | undefined = body?.email;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  // 1) Proveedor de boletines (si está configurado).
  const buttondown = process.env.BUTTONDOWN_API_KEY;
  if (buttondown) {
    const res = await fetch("https://api.buttondown.com/v1/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Token ${buttondown}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email_address: email }),
    });
    if (!res.ok && res.status !== 409 /* ya suscrito */) {
      return NextResponse.json({ error: "provider_failed" }, { status: 502 });
    }
  }

  // 2) Copia en Supabase (si está configurado).
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) {
    await fetch(`${url}/rest/v1/newsletter_subscribers`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify({ email }),
    });
  }

  if (!buttondown && !(url && key)) {
    console.log("[boletín — sin proveedor configurado]", email);
  }
  return NextResponse.json({ ok: true });
}

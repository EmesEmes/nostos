import { NextResponse } from "next/server";

/**
 * Formulario de contacto — STUB listo para Supabase (y/o correo).
 *
 * OPCIÓN A · Guardar en Supabase (recomendado como mínimo):
 *   create table contact_messages (
 *     id uuid primary key default gen_random_uuid(),
 *     created_at timestamptz default now(),
 *     name text, email text, reason text, message text
 *   );
 *   Con SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local, este
 *   handler inserta vía REST (ya implementado abajo).
 *
 * OPCIÓN B · Notificación por correo (complementaria):
 *   Resend (resend.com, capa gratuita): añadir RESEND_API_KEY y un
 *   fetch a https://api.resend.com/emails con to = correo del cliente.
 */

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.email || !body?.message) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  // Honeypot: si el campo oculto llegó lleno, es un bot → 200 silencioso.
  if (body.website) return NextResponse.json({ ok: true });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && key) {
    const res = await fetch(`${url}/rest/v1/contact_messages`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        reason: body.reason ?? "suggestion",
        message: body.message,
      }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: "storage_failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  }

  // Sin backend configurado: registrar en consola del servidor (dev).
  console.log("[contacto — sin Supabase configurado]", body);
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";

/**
 * Contador de visitas — STUB listo para Supabase.
 *
 * CÓMO CONECTAR SUPABASE (sin SDK, vía REST):
 * 1. En Supabase, crear la tabla y la función RPC (SQL Editor):
 *      create table site_visits (id int primary key default 1, count bigint default 0);
 *      insert into site_visits (id, count) values (1, 0);
 *      create or replace function increment_visits() returns bigint as $$
 *        update site_visits set count = count + 1 where id = 1
 *        returning count;
 *      $$ language sql;
 * 2. Definir en .env.local:
 *      SUPABASE_URL=https://<proyecto>.supabase.co
 *      SUPABASE_SERVICE_ROLE_KEY=<service_role>   ← solo en el servidor, nunca NEXT_PUBLIC
 * 3. Nada más: este handler detecta las variables y usa el RPC.
 *
 * Sin variables configuradas devuelve un conteo en memoria (se reinicia
 * con cada despliegue) para que la UI sea verificable en desarrollo.
 */

// Fallback en memoria (solo desarrollo / sin Supabase).
const memory = globalThis as unknown as { __visits?: number };

export async function POST() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && key) {
    try {
      const res = await fetch(`${url}/rest/v1/rpc/increment_visits`, {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: "{}",
        cache: "no-store",
      });
      if (res.ok) {
        const count = await res.json();
        return NextResponse.json({ count });
      }
    } catch {
      // cae al fallback
    }
  }

  memory.__visits = (memory.__visits ?? 1204) + 1; // PLACEHOLDER base
  return NextResponse.json({ count: memory.__visits });
}

import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return null;

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) return null;

  return { supabase, email: claims.email ?? "" };
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export function safeAdminPath(value: unknown) {
  if (
    typeof value !== "string" ||
    !/^\/admin(\/[\w-]+)*\/?$/.test(value) ||
    value.startsWith("/admin/login")
  ) {
    return "/admin";
  }
  return value;
}

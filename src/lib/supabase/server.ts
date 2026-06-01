import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_ANON, isSupabaseConfigured } from "./config";

// Cliente de servidor (route handlers / server components). null si no hay config.
export async function getSupabaseServer(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured) return null;
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(list) {
        try {
          list.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // En Server Components no se pueden setear cookies; el middleware se encarga.
        }
      },
    },
  });
}

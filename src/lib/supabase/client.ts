"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON, isSupabaseConfigured } from "./config";

let _client: SupabaseClient | null = null;

// Cliente de navegador (singleton). Devuelve null si no hay configuración.
export function getSupabaseBrowser(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!_client) _client = createBrowserClient(SUPABASE_URL, SUPABASE_ANON);
  return _client;
}

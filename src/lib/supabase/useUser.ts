"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowser } from "./client";

// Estado de autenticación reactivo. user=null cuando no hay sesión o no hay config.
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sb = getSupabaseBrowser();
    if (!sb) {
      setLoading(false);
      return;
    }
    let active = true;
    sb.auth.getUser().then(({ data }) => {
      if (active) {
        setUser(data.user ?? null);
        setLoading(false);
      }
    });
    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}

export async function signOut() {
  const sb = getSupabaseBrowser();
  if (sb) await sb.auth.signOut();
}

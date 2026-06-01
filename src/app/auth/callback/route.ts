import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

// Intercambia el código de OAuth / confirmación de correo por una sesión.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/jugar";

  if (code) {
    const supabase = await getSupabaseServer();
    if (supabase) {
      await supabase.auth.exchangeCodeForSession(code);
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}

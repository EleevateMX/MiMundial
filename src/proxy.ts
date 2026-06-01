import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON, isSupabaseConfigured } from "@/lib/supabase/config";

// Refresca la sesión de Supabase en cada navegación (patrón @supabase/ssr).
export async function proxy(req: NextRequest) {
  if (!isSupabaseConfigured) return NextResponse.next();

  let res = NextResponse.next({ request: req });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(list) {
        list.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        list.forEach(({ name, value, options }) =>
          res.cookies.set(name, value, options)
        );
      },
    },
  });

  // Importante: refresca el token si está por expirar.
  // Protegido para que un Supabase inalcanzable no rompa la navegación.
  try {
    await supabase.auth.getUser();
  } catch {
    // sin sesión / sin red: continuar normalmente
  }
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|flags|manifest.webmanifest|sw.js|offline).*)",
  ],
};

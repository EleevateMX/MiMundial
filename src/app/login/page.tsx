"use client";

import { useState } from "react";
import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSupabaseBrowser } from "@/lib/supabase/client";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleGoogle() {
    setError(null);
    const sb = getSupabaseBrowser();
    if (!sb) {
      window.location.href = "/jugar"; // demo
      return;
    }
    setBusy(true);
    const { error } = await sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setBusy(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const sb = getSupabaseBrowser();

    if (!sb) {
      // Modo demo
      if (mode === "register") setSent(true);
      else window.location.href = "/jugar";
      return;
    }

    setBusy(true);
    if (mode === "register") {
      const { error } = await sb.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      setBusy(false);
      if (error) setError(error.message);
      else setSent(true);
    } else {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) setError(error.message);
      else window.location.href = "/jugar";
    }
  }

  return (
    <div className="flex-1 grid place-items-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center mb-6">
          <span className="font-display text-4xl text-gold-gradient">MI MUNDIAL</span>
        </Link>

        <div className="glass rounded-3xl p-7 glow-gold">
          {sent ? (
            <ConfirmSent email={email} onBack={() => setSent(false)} />
          ) : (
            <>
              <h1 className="font-display text-2xl text-center">
                {mode === "register" ? "CREA TU CUENTA" : "BIENVENIDO DE VUELTA"}
              </h1>
              <p className="text-center text-sm text-white/55 mt-1">
                {mode === "register"
                  ? "Regístrate para guardar tu cuadro y entrar al ranking."
                  : "Inicia sesión para continuar tu Mundial."}
              </p>

              <button
                onClick={handleGoogle}
                disabled={busy}
                className="mt-6 w-full flex items-center justify-center gap-3 rounded-xl bg-white text-zinc-800 font-semibold py-3 hover:brightness-95 transition disabled:opacity-60"
              >
                <GoogleIcon />
                Continuar con Google
              </button>
              <p className="text-center text-[11px] text-neon/80 mt-2">
                Recomendado · necesario para activar todas las funciones de la app
              </p>

              <div className="my-5 flex items-center gap-3 text-xs text-white/35">
                <span className="h-px flex-1 bg-white/10" /> o con correo{" "}
                <span className="h-px flex-1 bg-white/10" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <Field
                  label="Correo"
                  type="email"
                  placeholder="tú@correo.com"
                  value={email}
                  onChange={setEmail}
                />
                <Field
                  label="Contraseña"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={setPassword}
                />

                {error && (
                  <p className="text-hot text-sm text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-xl bg-gold text-black font-bold py-3 hover:brightness-110 transition disabled:opacity-60"
                >
                  {busy
                    ? "Un momento…"
                    : mode === "register"
                    ? "Crear cuenta"
                    : "Entrar"}
                </button>
              </form>

              {mode === "register" && (
                <p className="text-center text-[11px] text-white/40 mt-3">
                  Te enviaremos un enlace de confirmación a tu correo para
                  verificar que eres una persona real. 🛡️
                </p>
              )}

              <p className="text-center text-sm text-white/55 mt-5">
                {mode === "register" ? "¿Ya tienes cuenta?" : "¿Eres nuevo?"}{" "}
                <button
                  onClick={() => {
                    setMode(mode === "register" ? "login" : "register");
                    setError(null);
                  }}
                  className="text-gold font-semibold hover:underline"
                >
                  {mode === "register" ? "Inicia sesión" : "Regístrate"}
                </button>
              </p>
            </>
          )}
        </div>

        <div className="text-center mt-5">
          <Link href="/jugar" className="text-sm text-white/50 hover:text-white transition">
            Explorar como invitado →
          </Link>
        </div>

        {!isSupabaseConfigured && (
          <p className="text-center text-[11px] text-white/30 mt-4">
            Modo demo — conecta Supabase para activar el inicio de sesión real.
          </p>
        )}
      </div>
    </div>
  );
}

function ConfirmSent({ email, onBack }: { email: string; onBack: () => void }) {
  return (
    <div className="text-center py-4">
      <div className="text-5xl mb-3">📩</div>
      <h2 className="font-display text-2xl">REVISA TU CORREO</h2>
      <p className="text-sm text-white/60 mt-2">
        Enviamos un enlace de confirmación a{" "}
        <span className="text-gold">{email || "tu correo"}</span>. Ábrelo para
        activar tu cuenta y entrar al ranking.
      </p>
      <Link
        href="/jugar"
        className="inline-block mt-5 rounded-xl bg-gold text-black font-bold px-6 py-3 hover:brightness-110 transition"
      >
        Mientras tanto, juega
      </Link>
      <button
        onClick={onBack}
        className="block mx-auto mt-3 text-xs text-white/45 hover:text-white"
      >
        ← Usar otro correo
      </button>
    </div>
  );
}

function Field({
  label,
  type,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type: string;
  placeholder: string;
  value?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-white/45">{label}</span>
      <input
        type={type}
        required
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2.5 outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20 transition placeholder:text-white/25"
      />
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

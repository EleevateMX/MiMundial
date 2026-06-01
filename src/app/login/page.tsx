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
                  ? "Registrarte con tu correo es necesario para usar la app, guardar tu cuadro y entrar al ranking."
                  : "Inicia sesión para continuar tu Mundial."}
              </p>

              <form onSubmit={handleSubmit} className="space-y-3 mt-6">
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


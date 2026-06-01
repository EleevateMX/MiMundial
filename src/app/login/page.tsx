"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { isSupabaseConfigured, HCAPTCHA_SITE_KEY } from "@/lib/supabase/config";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { Crest } from "@/components/Brand";

const HCaptcha = dynamic(() => import("@hcaptcha/react-hcaptcha"), { ssr: false });

// ---- Fuerza de contraseña ----
function pwScore(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s; // 0..4
}
const PW_LABELS = ["Muy débil", "Débil", "Aceptable", "Fuerte", "Muy fuerte"];
const PW_COLORS = ["#ff3d8a", "#ff3d8a", "#ffd24a", "#2bf5c0", "#2bf5c0"];

// ---- Límite de intentos (cliente) ----
const ATTEMPT_KEY = "mm-auth-attempts";
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 5;
function recentAttempts(): number[] {
  try {
    const a: number[] = JSON.parse(localStorage.getItem(ATTEMPT_KEY) || "[]");
    return a.filter((t) => Date.now() - t < WINDOW_MS);
  } catch {
    return [];
  }
}
function recordFail() {
  const a = recentAttempts();
  a.push(Date.now());
  localStorage.setItem(ATTEMPT_KEY, JSON.stringify(a));
}
function clearAttempts() {
  localStorage.removeItem(ATTEMPT_KEY);
}

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [captcha, setCaptcha] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const captchaRef = useRef<{ resetCaptcha: () => void } | null>(null);

  const score = pwScore(password);
  const pwOk = password.length >= 8 && score >= 2;
  const captchaRequired = !!HCAPTCHA_SITE_KEY;
  const captchaOk = !captchaRequired || !!captcha;

  // Cuenta regresiva del bloqueo
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  function checkCooldown(): boolean {
    const a = recentAttempts();
    if (a.length >= MAX_ATTEMPTS) {
      const wait = Math.ceil((WINDOW_MS - (Date.now() - a[0])) / 1000);
      setCooldown(wait);
      setError(`Demasiados intentos. Espera ${wait}s.`);
      return true;
    }
    return false;
  }

  function resetCaptcha() {
    setCaptcha(null);
    try {
      captchaRef.current?.resetCaptcha();
    } catch {}
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (cooldown > 0) return;
    if (checkCooldown()) return;

    const sb = getSupabaseBrowser();
    if (!sb) {
      if (mode === "register") setSent(true);
      else window.location.href = "/jugar";
      return;
    }

    if (mode === "register" && !pwOk) {
      setError("Usa una contraseña de al menos 8 caracteres más segura.");
      return;
    }
    if (!captchaOk) {
      setError("Completa el captcha para continuar.");
      return;
    }

    setBusy(true);
    const captchaToken = captcha ?? undefined;

    if (mode === "register") {
      const { error } = await sb.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          captchaToken,
        },
      });
      setBusy(false);
      if (error) {
        recordFail();
        resetCaptcha();
        setError(error.message);
        checkCooldown();
      } else {
        clearAttempts();
        setSent(true);
      }
    } else {
      const { error } = await sb.auth.signInWithPassword({
        email,
        password,
        options: { captchaToken },
      });
      setBusy(false);
      if (error) {
        recordFail();
        resetCaptcha();
        setError(error.message);
        checkCooldown();
      } else {
        clearAttempts();
        window.location.href = "/jugar";
      }
    }
  }

  const disabled =
    busy || cooldown > 0 || (mode === "register" && !pwOk) || !captchaOk;

  return (
    <div className="flex-1 grid place-items-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="flex flex-col items-center mb-6">
          <Crest className="w-14 h-14 mb-2" />
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

                {mode === "register" && password.length > 0 && (
                  <PasswordStrength score={score} />
                )}

                {captchaRequired && (
                  <div className="flex justify-center pt-1">
                    <HCaptcha
                      // @ts-expect-error ref typing del paquete
                      ref={captchaRef}
                      sitekey={HCAPTCHA_SITE_KEY}
                      theme="dark"
                      onVerify={(t: string) => setCaptcha(t)}
                      onExpire={() => setCaptcha(null)}
                    />
                  </div>
                )}

                {error && <p className="text-hot text-sm text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={disabled}
                  className="w-full rounded-xl bg-gold text-black font-bold py-3 hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {busy
                    ? "Un momento…"
                    : cooldown > 0
                    ? `Espera ${cooldown}s`
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

function PasswordStrength({ score }: { score: number }) {
  return (
    <div>
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-colors"
            style={{ background: i < score ? PW_COLORS[score] : "rgba(255,255,255,0.12)" }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between mt-1 text-[11px]">
        <span style={{ color: PW_COLORS[score] }}>{PW_LABELS[score]}</span>
        <span className="text-white/35">8+ caracteres, mayúsculas, número o símbolo</span>
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

"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <div className="flex-1 grid place-items-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center mb-6">
          <span className="font-display text-4xl text-gold-gradient">
            MI MUNDIAL
          </span>
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

              {/* Google */}
              <button className="mt-6 w-full flex items-center justify-center gap-3 rounded-xl bg-white text-zinc-800 font-semibold py-3 hover:brightness-95 transition">
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

              {/* Email form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (mode === "register") setSent(true);
                  else window.location.href = "/jugar";
                }}
                className="space-y-3"
              >
                <Field
                  label="Correo"
                  type="email"
                  placeholder="tú@correo.com"
                  value={email}
                  onChange={setEmail}
                />
                <Field label="Contraseña" type="password" placeholder="••••••••" />

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gold text-black font-bold py-3 hover:brightness-110 transition"
                >
                  {mode === "register" ? "Crear cuenta" : "Entrar"}
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
                  onClick={() =>
                    setMode(mode === "register" ? "login" : "register")
                  }
                  className="text-gold font-semibold hover:underline"
                >
                  {mode === "register" ? "Inicia sesión" : "Regístrate"}
                </button>
              </p>
            </>
          )}
        </div>

        <div className="text-center mt-5">
          <Link
            href="/jugar"
            className="text-sm text-white/50 hover:text-white transition"
          >
            Explorar como invitado →
          </Link>
        </div>

        <p className="text-center text-[11px] text-white/30 mt-4">
          Prototipo visual — el inicio de sesión aún no está conectado.
        </p>
      </div>
    </div>
  );
}

function ConfirmSent({
  email,
  onBack,
}: {
  email: string;
  onBack: () => void;
}) {
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
      <span className="text-xs uppercase tracking-wider text-white/45">
        {label}
      </span>
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
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

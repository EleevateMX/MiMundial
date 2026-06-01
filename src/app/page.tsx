import Link from "next/link";
import Flag from "@/components/Flag";
import InstallButton from "@/components/InstallButton";
import { Crest } from "@/components/Brand";
import { TEAMS } from "@/data/teams";

const HERO_FLAGS = [
  "ar", "br", "fr", "es", "de", "mx", "pt", "nl", "gb-eng", "it", "co", "ma",
];

export default function Landing() {
  return (
    <div className="relative flex-1 flex flex-col">
      {/* Cinta de banderas de fondo */}
      <div className="absolute inset-x-0 top-0 flex justify-center gap-2 opacity-10 blur-[1px] pointer-events-none select-none">
        {TEAMS.slice(0, 24).map((t) => (
          <Flag key={t.code} code={t.code} className="w-14 h-9" />
        ))}
      </div>

      <main className="relative mx-auto max-w-4xl px-6 py-20 sm:py-28 text-center flex-1 flex flex-col items-center justify-center">
        <Crest className="w-20 h-20 mb-4 drop-shadow-[0_8px_24px_rgba(255,210,74,0.35)]" />

        <span className="inline-flex items-center gap-2 rounded-full border border-neon/30 bg-neon/10 px-3 py-1 text-xs uppercase tracking-widest text-neon">
          Solo predicciones · sin apuestas
        </span>

        <h1 className="mt-6 font-display text-6xl sm:text-8xl leading-[0.9]">
          <span className="text-gold-gradient">MI MUNDIAL</span>
        </h1>
        <p className="mt-5 text-lg sm:text-xl text-white/70 max-w-2xl">
          Elige a tu selección, predice{" "}
          <span className="text-white">quién le gana a quién</span> en todo el
          cuadro y compite por la cima del{" "}
          <span className="text-gold">ranking global</span>.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row gap-3">
          <Link
            href="/jugar"
            className="rounded-full bg-gold text-black font-bold text-lg px-8 py-3.5 hover:brightness-110 transition glow-gold pulse-ring"
          >
            Jugar ahora
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-white/15 bg-white/5 hover:bg-white/10 font-semibold text-lg px-8 py-3.5 transition"
          >
            Iniciar sesión
          </Link>
        </div>

        <div className="mt-4">
          <InstallButton className="rounded-full border border-neon/40 bg-neon/10 text-neon font-semibold px-5 py-2.5 hover:bg-neon/20 transition text-sm" />
        </div>

        {/* Banderas destacadas */}
        <div className="mt-12 flex flex-wrap justify-center gap-2 max-w-xl">
          {HERO_FLAGS.map((c) => (
            <Flag key={c} code={c} className="w-9 h-6 hover:scale-110 transition" />
          ))}
        </div>

        {/* Features */}
        <div className="mt-14 grid sm:grid-cols-3 gap-4 w-full text-left">
          <Feature
            title="48 selecciones"
            desc="12 grupos, banderas reales y el camino completo hasta la final."
          />
          <Feature
            title="Tu cuadro"
            desc="Toca al ganador de cada partido y corona a tu campeón."
          />
          <Feature
            title="Ranking en vivo"
            desc="Suma puntos por tus aciertos y presume frente a todos."
          />
        </div>
      </main>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="font-display text-xl text-gold-gradient">{title}</div>
      <p className="text-sm text-white/60 mt-1">{desc}</p>
    </div>
  );
}

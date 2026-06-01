"use client";

import { useState } from "react";
import { SAMPLE_LEAGUE_MEMBERS } from "@/data/social";
import type { League } from "@/lib/appState";
import Flag from "@/components/Flag";

export default function LeaguesView({
  leagues,
  score,
  favorite,
  onCreate,
  onJoin,
}: {
  leagues: League[];
  score: number;
  favorite: string | null;
  onCreate: (name: string) => string;
  onJoin: (code: string) => void;
}) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Crear */}
        <div className="glass rounded-2xl p-5">
          <div className="font-display text-xl text-gold-gradient">CREA TU LIGA</div>
          <p className="text-sm text-white/55 mt-1">
            Invita a tu banda con un código y compitan en privado.
          </p>
          <div className="flex gap-2 mt-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. La Liga de la Oficina"
              className="flex-1 rounded-xl bg-black/30 border border-white/10 px-3 py-2.5 outline-none focus:border-gold/60 placeholder:text-white/25"
            />
            <button
              onClick={() => {
                if (name.trim()) {
                  onCreate(name.trim());
                  setName("");
                }
              }}
              className="rounded-xl bg-gold text-black font-bold px-4 hover:brightness-110 transition"
            >
              Crear
            </button>
          </div>
        </div>

        {/* Unirse */}
        <div className="glass rounded-2xl p-5">
          <div className="font-display text-xl text-gold-gradient">ÚNETE CON CÓDIGO</div>
          <p className="text-sm text-white/55 mt-1">
            ¿Te invitaron? Escribe el código de 6 caracteres.
          </p>
          <div className="flex gap-2 mt-4">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
              placeholder="ABC123"
              className="flex-1 rounded-xl bg-black/30 border border-white/10 px-3 py-2.5 outline-none focus:border-neon/60 tracking-[0.3em] font-mono placeholder:text-white/25"
            />
            <button
              onClick={() => {
                if (code.length === 6) {
                  onJoin(code);
                  setCode("");
                }
              }}
              className="rounded-xl bg-neon text-black font-bold px-4 hover:brightness-110 transition"
            >
              Unirme
            </button>
          </div>
        </div>
      </div>

      {leagues.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center text-white/45">
          Aún no estás en ninguna liga. ¡Crea una o únete con un código! 👆
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {leagues.map((l) => (
            <LeagueCard
              key={l.code}
              league={l}
              score={score}
              favorite={favorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LeagueCard({
  league,
  score,
  favorite,
}: {
  league: League;
  score: number;
  favorite: string | null;
}) {
  const [copied, setCopied] = useState(false);
  const rows = [
    ...SAMPLE_LEAGUE_MEMBERS.map((m) => ({ ...m, you: false })),
    { name: "TÚ", pts: score, flag: favorite ?? "mx", you: true },
  ]
    .sort((a, b) => b.pts - a.pts)
    .map((r, i) => ({ ...r, rank: i + 1 }));

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="font-display text-lg text-gold truncate">
            {league.name}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-white/40">
            {league.owner ? "Eres el admin" : "Miembro"} · {rows.length} jugadores
          </div>
        </div>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(league.code).catch(() => {});
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="shrink-0 rounded-lg border border-gold/40 bg-gold/10 px-3 py-1.5 text-right hover:bg-gold/20 transition"
        >
          <div className="text-[9px] uppercase tracking-wider text-white/45">
            {copied ? "¡Copiado!" : "Código · copiar"}
          </div>
          <div className="font-mono font-bold tracking-[0.2em] text-gold">
            {league.code}
          </div>
        </button>
      </div>
      <ul className="divide-y divide-white/5">
        {rows.map((r) => (
          <li
            key={r.name}
            className={`flex items-center gap-3 px-4 py-2.5 ${
              r.you ? "bg-gold/10" : ""
            }`}
          >
            <span
              className={`w-6 text-center font-display ${
                r.rank === 1 ? "text-gold" : r.you ? "text-neon" : "text-white/40"
              }`}
            >
              {r.rank}
            </span>
            <Flag code={r.flag} className="w-6 h-4" />
            <span className={`flex-1 text-sm ${r.you ? "text-gold font-bold" : ""}`}>
              {r.name}
            </span>
            <span className="font-display tabular-nums text-sm text-white/80">
              {r.pts}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

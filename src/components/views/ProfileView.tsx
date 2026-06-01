"use client";

import { TEAM_BY_CODE } from "@/data/teams";
import { ACHIEVEMENTS } from "@/lib/achievements";
import type { LevelInfo } from "@/lib/levels";
import Flag from "@/components/Flag";

export default function ProfileView({
  name,
  favorite,
  level,
  totalScore,
  pending,
  streak,
  made,
  dailyCount,
  hits,
  leaguesCount,
  duelsCount,
  unlocked,
  onName,
  onShare,
}: {
  name: string;
  favorite: string | null;
  level: LevelInfo;
  totalScore: number;
  pending: number;
  streak: number;
  made: number;
  dailyCount: number;
  hits: number;
  leaguesCount: number;
  duelsCount: number;
  unlocked: Set<string>;
  onName: (v: string) => void;
  onShare: () => void;
}) {
  const fav = favorite ? TEAM_BY_CODE[favorite] : null;
  const initial = (name || "?").trim().charAt(0).toUpperCase();

  const stats = [
    ["Picks", `${made}/31`],
    ["Aciertos", String(hits)],
    ["Quinielas", String(dailyCount)],
    ["Racha", `${streak} 🔥`],
    ["Ligas", String(leaguesCount)],
    ["Duelos", String(duelsCount)],
  ];

  return (
    <div className="space-y-5">
      {/* Tarjeta de identidad */}
      <div className="glass rounded-2xl p-5 relative overflow-hidden glow-gold">
        <div className="absolute inset-0 shimmer opacity-20 pointer-events-none" />
        <div className="relative flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="size-20 rounded-2xl bg-gradient-to-br from-hot/30 to-neon/20 grid place-items-center text-3xl font-display text-gold-gradient border border-white/10">
              {initial}
            </div>
            {fav && (
              <Flag
                code={fav.code}
                className="w-8 h-5 absolute -bottom-2 -right-2 ring-2 ring-[#05070f]"
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <input
              value={name}
              onChange={(e) => onName(e.target.value)}
              className="bg-transparent font-display text-2xl text-gold-gradient outline-none border-b border-transparent focus:border-gold/40 w-full"
            />
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] uppercase tracking-wider rounded-full bg-neon/10 text-neon px-2 py-0.5">
                Nivel {level.level} · {level.label}
              </span>
              {fav && (
                <span className="text-[11px] text-white/50">
                  Le va a {fav.name}
                </span>
              )}
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="font-display text-3xl text-gold leading-none">
              {totalScore}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-white/40">
              puntos
            </div>
          </div>
        </div>

        {/* Barra de XP */}
        <div className="relative mt-4">
          <div className="flex justify-between text-[11px] text-white/45 mb-1">
            <span>Nivel {level.level}</span>
            <span>
              {level.nextMin
                ? `${level.intoLevel}/${level.span} al nivel ${level.level + 1}`
                : "Nivel máximo"}
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-neon to-gold transition-all"
              style={{ width: `${level.pct}%` }}
            />
          </div>
          {pending > 0 && (
            <div className="text-[11px] text-white/45 mt-1">
              <span className="text-gold">+{pending}</span> en juego por resolver
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {stats.map(([k, v]) => (
          <div key={k} className="glass rounded-2xl p-3 text-center">
            <div className="font-display text-xl text-white/90">{v}</div>
            <div className="text-[10px] uppercase tracking-wider text-white/40">
              {k}
            </div>
          </div>
        ))}
      </div>

      {/* Vitrina de medallas */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="font-display text-lg text-gold">VITRINA DE MEDALLAS</h3>
          <span className="text-[11px] text-white/45">
            {unlocked.size}/{ACHIEVEMENTS.length}
          </span>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
          {ACHIEVEMENTS.map((a) => {
            const on = unlocked.has(a.id);
            return (
              <div
                key={a.id}
                title={`${a.name} — ${a.desc}`}
                className={`aspect-square rounded-xl grid place-items-center text-2xl transition ${
                  on
                    ? "bg-gold/15 glow-gold"
                    : "bg-white/[0.03] grayscale opacity-40"
                }`}
              >
                {a.icon}
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onShare}
          className="rounded-full bg-gold text-black font-bold px-6 py-3 hover:brightness-110 transition"
        >
          📣 Compartir mi perfil
        </button>
      </div>
    </div>
  );
}

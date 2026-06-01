"use client";

import { GROUP_FIXTURES, type Fixture } from "@/data/fixtures";
import { TEAM_BY_CODE } from "@/data/teams";
import type { DailyPick } from "@/lib/appState";
import { isLocked, earlyBonus } from "@/lib/schedule";
import Flag from "@/components/Flag";
import Countdown from "@/components/Countdown";

function dayLabel(ts: number): string {
  const s = new Date(ts).toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function timeLabel(ts: number): string {
  return new Date(ts).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
}

export default function CalendarView({
  now,
  daily,
  onWinner,
  onScore,
}: {
  now: number;
  daily: Record<string, DailyPick>;
  onWinner: (matchId: string, code: string, kickoff: number) => void;
  onScore: (matchId: string, gf: number | null, gc: number | null) => void;
}) {
  const made = Object.keys(daily).length;
  const earned = Object.values(daily).reduce((s, d) => s + 30 + (d.bonus ?? 0), 0);

  // Agrupar por día local
  const days: { label: string; items: Fixture[] }[] = [];
  for (const fx of GROUP_FIXTURES) {
    const label = dayLabel(fx.ts);
    const last = days[days.length - 1];
    if (last && last.label === label) last.items.push(fx);
    else days.push({ label, items: [fx] });
  }

  return (
    <div className="space-y-5">
      <div className="glass rounded-2xl p-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 shimmer opacity-30 pointer-events-none" />
        <div className="font-display text-2xl text-gold-gradient relative">CALENDARIO</div>
        <p className="text-white/55 text-sm mt-1 relative">
          Fase de grupos 2026. Predice cada partido —{" "}
          <span className="text-neon">mientras más anticipado, más bonus</span>. Horarios en tu hora local.
        </p>
        <div className="relative mt-3 inline-flex items-center gap-4 text-sm">
          <span className="text-white/60">Predichos: <b className="text-white">{made}</b></span>
          <span className="text-white/60">Puntos: <b className="text-gold font-display">{earned}</b></span>
        </div>
      </div>

      {days.map((d) => (
        <div key={d.label}>
          <div className="sticky top-16 z-10 -mx-1 px-3 py-1.5 mb-2">
            <span className="font-display text-sm uppercase tracking-wider text-gold bg-[#0a0e1c]/80 rounded-full px-3 py-1">
              {d.label}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {d.items.map((fx) => (
              <MatchRow
                key={fx.id}
                fx={fx}
                now={now}
                pick={daily[fx.id]}
                onWinner={onWinner}
                onScore={onScore}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MatchRow({
  fx,
  now,
  pick,
  onWinner,
  onScore,
}: {
  fx: Fixture;
  now: number;
  pick?: DailyPick;
  onWinner: (matchId: string, code: string, kickoff: number) => void;
  onScore: (matchId: string, gf: number | null, gc: number | null) => void;
}) {
  const locked = isLocked(fx.ts, now);
  const bonus = earlyBonus(fx.ts, now);

  return (
    <div className="glass rounded-2xl p-3">
      <div className="flex items-center justify-between text-[11px] mb-2">
        <span className="text-white/45">
          <span className="text-gold/80 font-semibold">G{fx.group}</span> · {timeLabel(fx.ts)} · {fx.venue}
        </span>
        {locked ? (
          <span className="text-hot">🔒 Cerrado</span>
        ) : (
          <Countdown target={fx.ts} className="text-[11px]" />
        )}
      </div>

      <div className="space-y-1.5">
        {[fx.home, fx.away].map((code) => {
          const t = TEAM_BY_CODE[code];
          const chosen = pick?.winner === code;
          return (
            <button
              key={code}
              disabled={locked}
              onClick={() => onWinner(fx.id, code, fx.ts)}
              className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition ${
                chosen
                  ? "bg-gold/20 text-gold glow-gold font-semibold"
                  : locked
                  ? "opacity-50"
                  : "hover:bg-white/10"
              }`}
            >
              <Flag code={code} className="w-7 h-5 shrink-0" />
              <span className="flex-1 text-left truncate">{t?.name ?? code}</span>
              {chosen && <span>✓</span>}
            </button>
          );
        })}
      </div>

      {pick && !locked && (
        <div className="mt-2 flex items-center justify-center gap-2 text-sm">
          <span className="text-[10px] uppercase tracking-wider text-white/40">Marcador</span>
          <ScoreInput value={pick.gf} onChange={(v) => onScore(fx.id, v, pick.gc ?? null)} />
          <span className="text-white/40">-</span>
          <ScoreInput value={pick.gc} onChange={(v) => onScore(fx.id, pick.gf ?? null, v)} />
        </div>
      )}

      {pick && !locked && (
        <div className="mt-2 text-center text-[11px] text-white/50">
          Ganas <span className="text-gold font-semibold">{30 + (pick.bonus ?? 0)}</span> pts
          {pick.bonus ? ` (incl. +${pick.bonus} bonus)` : ""}
        </div>
      )}
    </div>
  );
}

function ScoreInput({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  return (
    <input
      inputMode="numeric"
      value={value ?? ""}
      onChange={(e) => {
        const n = e.target.value.replace(/\D/g, "").slice(0, 2);
        onChange(n === "" ? null : Number(n));
      }}
      className="w-9 text-center rounded-lg bg-black/30 border border-white/10 py-1 outline-none focus:border-gold/60"
      placeholder="0"
    />
  );
}

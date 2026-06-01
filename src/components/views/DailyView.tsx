"use client";

import { R32_MATCHES, TEAM_BY_CODE } from "@/data/teams";
import type { DailyPick } from "@/lib/appState";
import { isLocked, earlyBonus } from "@/lib/schedule";
import type { Results } from "@/lib/results";
import Flag from "@/components/Flag";
import Countdown from "@/components/Countdown";

export default function DailyView({
  kickoffs,
  now,
  daily,
  results,
  onWinner,
  onScore,
}: {
  kickoffs: Record<string, number>;
  now: number;
  daily: Record<string, DailyPick>;
  results: Results;
  onWinner: (matchId: string, code: string) => void;
  onScore: (matchId: string, gf: number | null, gc: number | null) => void;
}) {
  const matches = R32_MATCHES.map(([a, b], i) => ({
    id: `r0-${i}`,
    a,
    b,
    kickoff: kickoffs[`r0-${i}`],
  })).sort((m1, m2) => m1.kickoff - m2.kickoff);

  const made = Object.keys(daily).length;
  const earned = Object.values(daily).reduce((s, d) => s + 30 + (d.bonus ?? 0), 0);

  return (
    <div className="space-y-5">
      <div className="glass rounded-2xl p-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 shimmer opacity-30 pointer-events-none" />
        <div className="font-display text-2xl text-gold-gradient relative">
          PREDICCIÓN DEL DÍA
        </div>
        <p className="text-white/55 text-sm mt-1 relative">
          Acierta partidos rápidos y gana puntos. Mientras{" "}
          <span className="text-neon">más anticipado</span> predigas, mayor el{" "}
          <span className="text-gold">bonus</span>. Vuelve cada día por más.
        </p>
        <div className="relative mt-3 inline-flex items-center gap-4 text-sm">
          <span className="text-white/60">
            Hechas: <b className="text-white">{made}</b>
          </span>
          <span className="text-white/60">
            Puntos: <b className="text-gold font-display">{earned}</b>
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map((m) => (
          <DailyCard
            key={m.id}
            id={m.id}
            a={m.a}
            b={m.b}
            kickoff={m.kickoff}
            now={now}
            pick={daily[m.id]}
            result={results[m.id]}
            onWinner={onWinner}
            onScore={onScore}
          />
        ))}
      </div>
    </div>
  );
}

function DailyCard({
  id,
  a,
  b,
  kickoff,
  now,
  pick,
  result,
  onWinner,
  onScore,
}: {
  id: string;
  a: string;
  b: string;
  kickoff: number;
  now: number;
  pick?: DailyPick;
  result?: string;
  onWinner: (matchId: string, code: string) => void;
  onScore: (matchId: string, gf: number | null, gc: number | null) => void;
}) {
  const locked = isLocked(kickoff, now);
  const bonus = earlyBonus(kickoff, now);
  const resolved = !!result;
  const hit = resolved && pick && pick.winner === result;

  return (
    <div
      className={`glass rounded-2xl p-3 ${
        resolved ? (hit ? "ring-1 ring-neon/40" : pick ? "ring-1 ring-hot/40" : "") : ""
      }`}
    >
      <div className="flex items-center justify-between text-[11px] mb-2">
        <Countdown target={kickoff} className="text-[11px]" />
        {resolved ? (
          pick ? (
            <span className={hit ? "text-neon font-semibold" : "text-hot font-semibold"}>
              {hit ? "✓ Acertaste" : "✗ Fallaste"}
            </span>
          ) : (
            <span className="text-white/35">Resultado listo</span>
          )
        ) : locked ? (
          <span className="text-hot">🔒 Cerrado</span>
        ) : (
          <span className="text-gold">+{bonus} anticipación</span>
        )}
      </div>

      <div className="space-y-1.5">
        {[a, b].map((code) => {
          const t = TEAM_BY_CODE[code];
          const chosen = pick?.winner === code;
          const isResultWinner = result === code;
          return (
            <button
              key={code}
              disabled={locked || resolved}
              onClick={() => onWinner(id, code)}
              className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition ${
                chosen
                  ? "bg-gold/20 text-gold glow-gold font-semibold"
                  : isResultWinner
                  ? "bg-neon/10 text-neon"
                  : locked || resolved
                  ? "opacity-50"
                  : "hover:bg-white/10"
              }`}
            >
              <Flag code={t.code} className="w-7 h-5 shrink-0" />
              <span className="flex-1 text-left truncate">{t.name}</span>
              {chosen && <span>✓</span>}
              {isResultWinner && !chosen && <span className="text-[10px]">real</span>}
            </button>
          );
        })}
      </div>

      {/* Marcador exacto opcional */}
      {pick && !resolved && !locked && (
        <div className="mt-2 flex items-center justify-center gap-2 text-sm">
          <span className="text-[10px] uppercase tracking-wider text-white/40">
            Marcador
          </span>
          <ScoreInput
            value={pick.gf}
            onChange={(v) => onScore(id, v, pick.gc)}
          />
          <span className="text-white/40">-</span>
          <ScoreInput
            value={pick.gc}
            onChange={(v) => onScore(id, pick.gf, v)}
          />
        </div>
      )}

      {pick && !resolved && (
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

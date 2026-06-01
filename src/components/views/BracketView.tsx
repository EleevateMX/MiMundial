"use client";

import { TEAM_BY_CODE } from "@/data/teams";
import { type Match, type Round, ROUND_POINTS } from "@/lib/bracket";
import { isLocked } from "@/lib/schedule";
import Flag from "@/components/Flag";
import Countdown from "@/components/Countdown";

export default function BracketView({
  rounds,
  champ,
  favorite,
  kickoffs,
  mult,
  onPick,
  onMult,
  onShare,
}: {
  rounds: Round[];
  champ: string | null;
  favorite: string | null;
  kickoffs: Record<string, number>;
  mult: Record<string, number>;
  onPick: (matchId: string, code: string) => void;
  onMult: (matchId: string, n: number) => void;
  onShare: () => void;
}) {
  return (
    <div>
      <ChampionBanner champ={champ} favorite={favorite} onShare={onShare} />

      <div className="bracket-scroll overflow-x-auto pb-4 mt-4">
        <div className="flex gap-5 min-w-max">
          {rounds.map((r) => (
            <div key={r.round} className="flex flex-col justify-around min-w-[230px]">
              <div className="mb-2 text-center">
                <span className="font-display text-sm uppercase tracking-wider text-white/60">
                  {r.name}
                </span>
                <span className="ml-2 text-[10px] text-gold/70">
                  +{ROUND_POINTS[r.round]} pts
                </span>
              </div>
              <div className="flex flex-col justify-around flex-1 gap-3">
                {r.matches.map((m) => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    favorite={favorite}
                    kickoff={kickoffs[m.id]}
                    mult={mult[m.id] ?? 1}
                    onPick={onPick}
                    onMult={onMult}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MatchCard({
  match,
  favorite,
  kickoff,
  mult,
  onPick,
  onMult,
}: {
  match: Match;
  favorite: string | null;
  kickoff?: number;
  mult: number;
  onPick: (matchId: string, code: string) => void;
  onMult: (matchId: string, n: number) => void;
}) {
  const locked = isLocked(kickoff, Date.now());
  const hasKickoff = kickoff !== undefined;
  const showMult = !!match.winner && !locked;

  return (
    <div
      className={`glass rounded-xl p-1.5 space-y-1 ${
        locked ? "opacity-90 ring-1 ring-hot/30" : ""
      }`}
    >
      {hasKickoff && (
        <div className="flex items-center justify-between px-1.5 pt-0.5 text-[10px]">
          <span className="text-white/35">
            {locked ? "🔒 Bloqueado" : "Por jugar"}
          </span>
          <Countdown target={kickoff} className="text-[10px]" />
        </div>
      )}

      <Slot match={match} code={match.a} favorite={favorite} locked={locked} onPick={onPick} />
      <Slot match={match} code={match.b} favorite={favorite} locked={locked} onPick={onPick} />

      {showMult && (
        <div className="flex items-center justify-end gap-1 px-1 pb-0.5">
          <span className="text-[9px] uppercase tracking-wider text-white/35 mr-1">
            Riesgo
          </span>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              onClick={() => onMult(match.id, n)}
              className={`text-[10px] font-bold rounded px-1.5 py-0.5 transition ${
                mult === n
                  ? n === 3
                    ? "bg-hot text-white"
                    : "bg-gold text-black"
                  : "bg-white/5 text-white/45 hover:bg-white/10"
              }`}
            >
              x{n}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Slot({
  match,
  code,
  favorite,
  locked,
  onPick,
}: {
  match: Match;
  code: string | null;
  favorite: string | null;
  locked: boolean;
  onPick: (matchId: string, code: string) => void;
}) {
  if (!code) {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/[0.02] text-white/25 text-sm">
        <div className="w-7 h-5 rounded bg-white/5" />
        <span>Por definir</span>
      </div>
    );
  }
  const t = TEAM_BY_CODE[code];
  const isWinner = match.winner === code;
  const isLoser = match.winner && match.winner !== code;
  const isFav = favorite === code;
  const disabled = locked && !match.winner;

  return (
    <button
      onClick={() => !locked && onPick(match.id, code)}
      disabled={locked}
      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition ${
        isWinner
          ? "bg-gold/20 text-gold glow-gold font-semibold"
          : isLoser
          ? "opacity-40"
          : disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-white/10 cursor-pointer"
      }`}
    >
      <Flag code={t.code} className="w-7 h-5 shrink-0" />
      <span className="flex-1 text-left truncate">{t.name}</span>
      {isFav && <span className="text-[10px] text-neon">★</span>}
      {isWinner && <span className="text-gold">✓</span>}
    </button>
  );
}

function ChampionBanner({
  champ,
  favorite,
  onShare,
}: {
  champ: string | null;
  favorite: string | null;
  onShare: () => void;
}) {
  if (!champ) {
    return (
      <div className="glass rounded-2xl p-5 text-center">
        <div className="font-display text-2xl text-gold-gradient">
          ARMA TU CAMINO AL TÍTULO
        </div>
        <p className="text-white/55 text-sm mt-1">
          Toca al equipo que crees que gana cada partido. Sube el{" "}
          <span className="text-hot">riesgo (x2/x3)</span> para ganar más puntos
          si aciertas. Ojo: los picks se bloquean antes del pitazo. 🔒
        </p>
      </div>
    );
  }
  const t = TEAM_BY_CODE[champ];
  const isFav = champ === favorite;
  return (
    <div className="relative glass rounded-2xl p-6 text-center overflow-hidden glow-gold float-up">
      <div className="absolute inset-0 shimmer opacity-30 pointer-events-none" />
      <div className="text-[11px] uppercase tracking-[0.3em] text-white/50 relative">
        Tu campeón
      </div>
      <div className="flex items-center justify-center gap-3 mt-2 relative">
        <Flag code={t.code} className="w-14 h-10" />
        <span className="font-display text-4xl text-gold-gradient">
          {t.name.toUpperCase()}
        </span>
      </div>
      <div className="mt-1 text-sm relative">
        {isFav ? (
          <span className="text-neon">¡Tu selección levanta la copa! 🏆</span>
        ) : (
          <span className="text-white/55">Predicción registrada 🏆</span>
        )}
      </div>
      <button
        onClick={onShare}
        className="relative mt-3 rounded-full bg-gold text-black font-bold text-sm px-5 py-2 hover:brightness-110 transition"
      >
        📣 Compartir mi cuadro
      </button>
    </div>
  );
}

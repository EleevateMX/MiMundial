"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  TEAMS,
  TEAM_BY_CODE,
  GROUPS,
  MOCK_LEADERBOARD,
  type Team,
} from "@/data/teams";
import {
  buildRounds,
  champion,
  userScore,
  type Match,
} from "@/lib/bracket";
import Flag from "@/components/Flag";
import Confetti from "@/components/Confetti";

type Tab = "cuadro" | "grupos" | "ranking";

export default function MiMundialApp() {
  const [favorite, setFavorite] = useState<string | null>(null);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [tab, setTab] = useState<Tab>("grupos");

  const rounds = useMemo(() => buildRounds(picks), [picks]);
  const champ = champion(rounds);
  const score = userScore(picks);
  const made = Object.keys(picks).length;

  function pick(matchId: string, code: string) {
    setPicks((prev) => {
      const next = { ...prev };
      if (next[matchId] === code) {
        delete next[matchId]; // des-seleccionar
      } else {
        next[matchId] = code;
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col min-h-screen">
      {champ && <Confetti />}

      {/* ===== Top bar ===== */}
      <header className="sticky top-0 z-40 glass border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Logo />
          </div>

          <div className="flex items-center gap-3">
            <ScorePill score={score} made={made} />
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 text-sm transition"
            >
              <span className="size-6 rounded-full bg-gradient-to-br from-hot to-gold grid place-items-center text-[11px] font-bold text-black">
                TÚ
              </span>
              <span className="text-white/70">Invitado</span>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <nav className="mx-auto max-w-7xl px-4 flex gap-1 -mb-px">
          {(
            [
              ["grupos", "Grupos"],
              ["cuadro", "Mi Cuadro"],
              ["ranking", "Ranking"],
            ] as [Tab, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`relative px-4 py-2.5 text-sm font-semibold transition ${
                tab === key ? "text-gold" : "text-white/55 hover:text-white"
              }`}
            >
              {label}
              {tab === key && (
                <span className="absolute left-2 right-2 -bottom-px h-0.5 rounded-full bg-gold glow-gold" />
              )}
            </button>
          ))}
        </nav>
      </header>

      {/* ===== Favorite banner ===== */}
      <FavoriteBanner
        favorite={favorite}
        onClear={() => setFavorite(null)}
        onGo={() => setTab("grupos")}
      />

      {/* ===== Content ===== */}
      <main className="mx-auto w-full max-w-7xl px-4 py-6 flex-1">
        {tab === "grupos" && (
          <GroupsView favorite={favorite} onPick={setFavorite} />
        )}
        {tab === "cuadro" && (
          <BracketView
            rounds={rounds}
            champ={champ}
            favorite={favorite}
            onPick={pick}
          />
        )}
        {tab === "ranking" && <RankingView score={score} favorite={favorite} />}
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        Mi Mundial · Solo predicciones, <span className="text-neon">sin apuestas</span> · Prototipo
      </footer>
    </div>
  );
}

/* ---------------- Sub-componentes ---------------- */

function Logo() {
  return (
    <div className="flex items-center gap-2 select-none">
      <div className="relative">
        <div className="size-9 rounded-xl bg-gradient-to-br from-gold to-gold-deep grid place-items-center text-black font-display text-xl shadow-lg glow-gold">
          M
        </div>
      </div>
      <div className="leading-none">
        <div className="font-display text-2xl tracking-wide">
          <span className="text-gold-gradient">MI MUNDIAL</span>
        </div>
        <div className="text-[10px] uppercase tracking-[0.25em] text-neon/80">
          Predice · Compite · Presume
        </div>
      </div>
    </div>
  );
}

function ScorePill({ score, made }: { score: number; made: number }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 glow-gold">
      <span className="text-xs uppercase tracking-wider text-gold/80">Puntos</span>
      <span className="font-display text-lg text-gold leading-none tabular-nums">
        {score}
      </span>
      <span className="hidden sm:inline text-[11px] text-white/45">· {made} picks</span>
    </div>
  );
}

function FavoriteBanner({
  favorite,
  onClear,
  onGo,
}: {
  favorite: string | null;
  onClear: () => void;
  onGo: () => void;
}) {
  const t = favorite ? TEAM_BY_CODE[favorite] : null;
  return (
    <div className="mx-auto w-full max-w-7xl px-4">
      <div className="glass rounded-2xl px-4 py-3 flex items-center justify-between gap-3 mt-4 relative overflow-hidden">
        <div className="absolute inset-0 shimmer pointer-events-none opacity-40" />
        {t ? (
          <>
            <div className="flex items-center gap-3 relative">
              <Flag code={t.code} className="w-10 h-7" />
              <div>
                <div className="text-[11px] uppercase tracking-wider text-white/50">
                  Le vas a
                </div>
                <div className="font-display text-xl text-gold-gradient leading-none">
                  {t.name.toUpperCase()}
                </div>
              </div>
            </div>
            <button
              onClick={onClear}
              className="relative text-xs text-white/50 hover:text-hot transition"
            >
              Cambiar
            </button>
          </>
        ) : (
          <>
            <div className="relative">
              <div className="font-display text-xl">
                <span className="text-gold-gradient">¿A QUIÉN LE VAS?</span>
              </div>
              <div className="text-xs text-white/55">
                Elige tu selección y desbloquea tu cuadro.
              </div>
            </div>
            <button
              onClick={onGo}
              className="relative rounded-full bg-gold text-black font-bold text-sm px-4 py-2 hover:brightness-110 transition pulse-ring"
            >
              Elegir equipo
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ----- Vista de grupos ----- */
function GroupsView({
  favorite,
  onPick,
}: {
  favorite: string | null;
  onPick: (code: string) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {GROUPS.map((g) => {
        const teams = TEAMS.filter((t) => t.group === g);
        return (
          <div key={g} className="glass rounded-2xl overflow-hidden">
            <div className="px-4 py-2.5 flex items-center justify-between bg-white/5 border-b border-white/10">
              <span className="font-display text-lg text-gold">GRUPO {g}</span>
              <span className="text-[10px] uppercase tracking-wider text-white/40">
                Toca tu favorito
              </span>
            </div>
            <ul className="p-2 space-y-1">
              {teams.map((t) => (
                <TeamRow
                  key={t.code}
                  team={t}
                  active={favorite === t.code}
                  onClick={() => onPick(t.code)}
                />
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function TeamRow({
  team,
  active,
  onClick,
}: {
  team: Team;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-left transition group ${
          active
            ? "bg-gold/15 glow-gold"
            : "hover:bg-white/5 border border-transparent"
        }`}
      >
        <Flag code={team.code} className="w-8 h-5 shrink-0" />
        <span className={`flex-1 font-medium ${active ? "text-gold" : ""}`}>
          {team.name}
        </span>
        <span className="text-[11px] text-white/40 tabular-nums">{team.pop}%</span>
        {active && <span className="text-gold text-sm">★</span>}
      </button>
    </li>
  );
}

/* ----- Vista del cuadro / bracket ----- */
function BracketView({
  rounds,
  champ,
  favorite,
  onPick,
}: {
  rounds: ReturnType<typeof buildRounds>;
  champ: string | null;
  favorite: string | null;
  onPick: (matchId: string, code: string) => void;
}) {
  return (
    <div>
      <ChampionBanner champ={champ} favorite={favorite} />

      <div className="bracket-scroll overflow-x-auto pb-4 mt-4">
        <div className="flex gap-5 min-w-max">
          {rounds.map((r) => (
            <div
              key={r.round}
              className="flex flex-col justify-around min-w-[220px]"
            >
              <div className="sticky top-0 mb-2 text-center">
                <span className="font-display text-sm uppercase tracking-wider text-white/60">
                  {r.name}
                </span>
              </div>
              <div className="flex flex-col justify-around flex-1 gap-3">
                {r.matches.map((m) => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    favorite={favorite}
                    onPick={onPick}
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

function ChampionBanner({
  champ,
  favorite,
}: {
  champ: string | null;
  favorite: string | null;
}) {
  if (!champ) {
    return (
      <div className="glass rounded-2xl p-5 text-center">
        <div className="font-display text-2xl text-gold-gradient">
          ARMA TU CAMINO AL TÍTULO
        </div>
        <p className="text-white/55 text-sm mt-1">
          Toca al equipo que crees que gana cada partido. Tus aciertos suman
          puntos en el ranking global.
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
      <div className="mt-2 text-sm relative">
        {isFav ? (
          <span className="text-neon">¡Tu selección levanta la copa! 🏆</span>
        ) : (
          <span className="text-white/55">Predicción registrada 🏆</span>
        )}
      </div>
    </div>
  );
}

function MatchCard({
  match,
  favorite,
  onPick,
}: {
  match: Match;
  favorite: string | null;
  onPick: (matchId: string, code: string) => void;
}) {
  return (
    <div className="glass rounded-xl p-1.5 space-y-1">
      <Slot
        code={match.a}
        matchId={match.id}
        winner={match.winner}
        favorite={favorite}
        onPick={onPick}
      />
      <Slot
        code={match.b}
        matchId={match.id}
        winner={match.winner}
        favorite={favorite}
        onPick={onPick}
      />
    </div>
  );
}

function Slot({
  code,
  matchId,
  winner,
  favorite,
  onPick,
}: {
  code: string | null;
  matchId: string;
  winner: string | null;
  favorite: string | null;
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
  const isWinner = winner === code;
  const isLoser = winner && winner !== code;
  const isFav = favorite === code;
  return (
    <button
      onClick={() => onPick(matchId, code)}
      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition ${
        isWinner
          ? "bg-gold/20 text-gold glow-gold font-semibold"
          : isLoser
          ? "opacity-40 hover:opacity-70"
          : "hover:bg-white/10"
      }`}
    >
      <Flag code={t.code} className="w-7 h-5 shrink-0" />
      <span className="flex-1 text-left truncate">{t.name}</span>
      {isFav && <span className="text-[10px] text-neon">★</span>}
      {isWinner && <span className="text-gold">✓</span>}
    </button>
  );
}

/* ----- Ranking ----- */
function RankingView({
  score,
  favorite,
}: {
  score: number;
  favorite: string | null;
}) {
  // Inserta al usuario en el leaderboard mock según su puntaje
  const rows = useMemo(() => {
    const all = [
      ...MOCK_LEADERBOARD,
      { name: "TÚ", pts: score, flag: favorite ?? "mx", you: true },
    ];
    return all
      .map((r) => ({ ...r }))
      .sort((a, b) => b.pts - a.pts)
      .map((r, i) => ({ ...r, rank: i + 1 }));
  }, [score, favorite]);

  // "Popularidad" global mock: equipos más elegidos como campeón
  const hot = [...TEAMS].sort((a, b) => b.pop - a.pop).slice(0, 6);

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="lg:col-span-2 glass rounded-2xl overflow-hidden">
        <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <span className="font-display text-lg text-gold">RANKING GLOBAL</span>
          <span className="text-[10px] uppercase tracking-wider text-neon">
            En vivo
          </span>
        </div>
        <ul className="divide-y divide-white/5">
          {rows.map((r) => {
            const you = "you" in r && r.you;
            return (
              <li
                key={r.name}
                className={`flex items-center gap-3 px-4 py-3 ${
                  you ? "bg-gold/10" : ""
                }`}
              >
                <span
                  className={`w-7 text-center font-display text-lg ${
                    r.rank === 1
                      ? "text-gold"
                      : you
                      ? "text-neon"
                      : "text-white/40"
                  }`}
                >
                  {r.rank}
                </span>
                <Flag code={r.flag} className="w-7 h-5" />
                <span className={`flex-1 ${you ? "text-gold font-bold" : ""}`}>
                  {r.name}
                </span>
                <span className="font-display tabular-nums text-white/80">
                  {r.pts}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="glass rounded-2xl overflow-hidden h-fit">
        <div className="px-4 py-3 bg-white/5 border-b border-white/10">
          <span className="font-display text-lg text-hot">LOS MÁS ELEGIDOS</span>
          <div className="text-[10px] uppercase tracking-wider text-white/40">
            % que los ve campeones
          </div>
        </div>
        <ul className="p-3 space-y-3">
          {hot.map((t) => (
            <li key={t.code} className="flex items-center gap-3">
              <Flag code={t.code} className="w-7 h-5" />
              <span className="w-24 truncate text-sm">{t.name}</span>
              <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-hot to-gold"
                  style={{ width: `${t.pop}%` }}
                />
              </div>
              <span className="text-xs tabular-nums text-white/60 w-9 text-right">
                {t.pop}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

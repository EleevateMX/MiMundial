"use client";

import { useState } from "react";
import Link from "next/link";
import { TEAM_BY_CODE } from "@/data/teams";
import { useAppState } from "@/lib/appState";
import Confetti from "@/components/Confetti";
import Flag from "@/components/Flag";
import StreakChip from "@/components/StreakChip";
import ShareModal from "@/components/ShareModal";
import RewardToaster from "@/components/RewardToaster";
import GroupsView from "@/components/views/GroupsView";
import BracketView from "@/components/views/BracketView";
import RankingView from "@/components/views/RankingView";
import LeaguesView from "@/components/views/LeaguesView";
import DuelView from "@/components/views/DuelView";
import AchievementsView from "@/components/views/AchievementsView";
import DailyView from "@/components/views/DailyView";
import ProfileView from "@/components/views/ProfileView";

type Tab =
  | "grupos"
  | "cuadro"
  | "dia"
  | "ligas"
  | "duelo"
  | "logros"
  | "ranking"
  | "perfil";

const TABS: [Tab, string][] = [
  ["grupos", "Grupos"],
  ["cuadro", "Mi Cuadro"],
  ["dia", "Del día"],
  ["ligas", "Ligas"],
  ["duelo", "Duelo"],
  ["logros", "Logros"],
  ["ranking", "Ranking"],
  ["perfil", "Perfil"],
];

export default function MiMundialApp() {
  const app = useAppState();
  const [tab, setTab] = useState<Tab>("grupos");
  const [showShare, setShowShare] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {app.champ && <Confetti />}
      <RewardToaster
        unlocked={app.unlocked}
        level={app.level.level}
        levelLabel={app.level.label}
        soundOn={app.state.soundOn}
      />

      {/* ===== Top bar ===== */}
      <header className="sticky top-0 z-40 glass border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between gap-3">
          <Logo />
          <div className="flex items-center gap-2 sm:gap-3">
            <LevelChip level={app.level.level} pct={app.level.pct} />
            <StreakChip
              streakCount={app.state.streakCount}
              checkedInToday={app.checkedInToday}
              onCheckIn={app.checkIn}
            />
            <ScorePill score={app.totalScore} pending={app.pending} />
            <button
              onClick={app.toggleSound}
              title={app.state.soundOn ? "Silenciar" : "Activar sonido"}
              className="hidden sm:grid place-items-center size-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition"
            >
              {app.state.soundOn ? "🔊" : "🔇"}
            </button>
            <button
              onClick={() => setShowShare(true)}
              title="Compartir"
              className="hidden sm:grid place-items-center size-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition"
            >
              📣
            </button>
          </div>
        </div>

        {/* Tabs */}
        <nav className="mx-auto max-w-7xl px-2 sm:px-4 flex gap-1 -mb-px overflow-x-auto">
          {TABS.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`relative px-3 sm:px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition ${
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
        favorite={app.state.favorite}
        onClear={() => app.setFavorite(null)}
        onGo={() => setTab("grupos")}
      />

      {/* ===== Content ===== */}
      <main className="mx-auto w-full max-w-7xl px-4 py-6 flex-1">
        {tab === "grupos" && (
          <GroupsView favorite={app.state.favorite} onPick={app.setFavorite} />
        )}
        {tab === "cuadro" && (
          <BracketView
            rounds={app.rounds}
            champ={app.champ}
            favorite={app.state.favorite}
            kickoffs={app.kickoffs}
            mult={app.state.mult}
            statuses={app.statuses}
            onPick={app.pickWinner}
            onMult={app.setMult}
            onShare={() => setShowShare(true)}
          />
        )}
        {tab === "dia" && (
          <DailyView
            kickoffs={app.kickoffs}
            now={app.now}
            daily={app.state.daily}
            results={app.results}
            onWinner={app.setDailyWinner}
            onScore={app.setDailyScore}
          />
        )}
        {tab === "ligas" && (
          <LeaguesView
            leagues={app.state.leagues}
            score={app.totalScore}
            favorite={app.state.favorite}
            onCreate={app.createLeague}
            onJoin={app.joinLeague}
          />
        )}
        {tab === "duelo" && (
          <DuelView
            userPicks={app.state.picks}
            userChamp={app.champ}
            duels={app.state.duels}
            onChallenge={app.challenge}
          />
        )}
        {tab === "logros" && <AchievementsView unlocked={app.unlocked} />}
        {tab === "ranking" && (
          <RankingView score={app.totalScore} favorite={app.state.favorite} />
        )}
        {tab === "perfil" && (
          <ProfileView
            name={app.state.name}
            favorite={app.state.favorite}
            level={app.level}
            totalScore={app.totalScore}
            pending={app.pending}
            streak={app.state.streakCount}
            made={app.made}
            dailyCount={app.dailyCount}
            hits={app.hits}
            leaguesCount={app.state.leagues.length}
            duelsCount={app.state.duels.length}
            unlocked={app.unlocked}
            onName={app.setName}
            onShare={() => setShowShare(true)}
          />
        )}
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        Mi Mundial · Solo predicciones, <span className="text-neon">sin apuestas</span> · Prototipo
        <span className="mx-2 text-white/20">·</span>
        <Link href="/admin" className="text-white/35 hover:text-gold transition">
          Admin
        </Link>
      </footer>

      {showShare && (
        <ShareModal
          rounds={app.rounds}
          champ={app.champ}
          favorite={app.state.favorite}
          score={app.totalScore}
          onShared={app.markShared}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}

/* ---------------- UI auxiliar ---------------- */

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 select-none">
      <div className="size-9 rounded-xl bg-gradient-to-br from-gold to-gold-deep grid place-items-center text-black font-display text-xl shadow-lg glow-gold">
        M
      </div>
      <div className="leading-none">
        <div className="font-display text-2xl tracking-wide">
          <span className="text-gold-gradient">MI MUNDIAL</span>
        </div>
        <div className="hidden sm:block text-[10px] uppercase tracking-[0.25em] text-neon/80">
          Predice · Compite · Presume
        </div>
      </div>
    </Link>
  );
}

function LevelChip({ level, pct }: { level: number; pct: number }) {
  return (
    <div className="hidden md:flex flex-col items-center gap-1 rounded-full border border-neon/30 bg-neon/10 px-3 py-1.5">
      <span className="text-xs font-display text-neon leading-none">Nv {level}</span>
      <div className="w-12 h-1 rounded-full bg-white/15 overflow-hidden">
        <div className="h-full bg-neon" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ScorePill({ score, pending }: { score: number; pending: number }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 glow-gold">
      <span className="hidden sm:inline text-xs uppercase tracking-wider text-gold/80">
        Puntos
      </span>
      <span className="font-display text-lg text-gold leading-none tabular-nums">
        {score}
      </span>
      {pending > 0 && (
        <span className="hidden md:inline text-[11px] text-white/45">
          +{pending} en juego
        </span>
      )}
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

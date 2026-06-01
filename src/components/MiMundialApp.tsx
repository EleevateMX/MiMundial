"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TEAM_BY_CODE } from "@/data/teams";
import { useAppState } from "@/lib/appState";
import { signOut } from "@/lib/supabase/useUser";
import Confetti from "@/components/Confetti";
import Flag from "@/components/Flag";
import AdSlot from "@/components/AdSlot";
import BottomNav from "@/components/BottomNav";
import Icon, { type IconName } from "@/components/Icon";
import Avatar, { avatarSeedFor } from "@/components/Avatar";
import { CrestTile } from "@/components/Brand";
import { scheduleMatchReminders } from "@/lib/notifications";
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

  // Recordatorios de partidos (si el usuario activó notificaciones)
  useEffect(() => scheduleMatchReminders(app.kickoffs), [app.kickoffs]);

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
      <header className="sticky top-0 z-40 glass border-b border-white/10 safe-top">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between gap-3">
          <Logo />
          <div className="flex items-center gap-2">
            <StatHud
              level={app.level}
              points={app.totalScore}
              pending={app.pending}
              streak={app.state.streakCount}
              checkedInToday={app.checkedInToday}
              onCheckIn={app.checkIn}
            />
            <GhostIcon
              name={app.state.soundOn ? "sonidoOn" : "sonidoOff"}
              title={app.state.soundOn ? "Silenciar" : "Activar sonido"}
              onClick={app.toggleSound}
              dim={!app.state.soundOn}
            />
            <GhostIcon name="compartir" title="Compartir" onClick={() => setShowShare(true)} />
            <AuthButton
              user={app.user}
              seed={avatarSeedFor(app.state.avatar, app.state.name || app.user?.email || "mm")}
              favorite={app.state.favorite}
            />
          </div>
        </div>

        {/* Tabs */}
        <nav className="mx-auto max-w-7xl px-2 sm:px-4 flex gap-1 -mb-px overflow-x-auto">
          {TABS.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`relative px-3 sm:px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                tab === key ? "text-gold" : "text-white/55 hover:text-white"
              }`}
            >
              <Icon name={key as IconName} className="size-4" />
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
      <main className="mx-auto w-full max-w-7xl px-4 py-6 flex-1 pb-24 sm:pb-6">
        <div key={tab} className="tab-fade">
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
            myName={app.state.name}
            avatarSeed={avatarSeedFor(app.state.avatar, app.state.name)}
            userId={app.user?.id ?? null}
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
          <RankingView
            score={app.totalScore}
            favorite={app.state.favorite}
            myName={app.state.name}
          />
        )}
        {tab === "perfil" && (
          <ProfileView
            name={app.state.name}
            avatar={app.state.avatar}
            favorite={app.state.favorite}
            champ={app.champ}
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
            userId={app.user?.id ?? null}
            onName={app.setName}
            onAvatar={app.setAvatar}
            onShare={() => setShowShare(true)}
          />
        )}
        </div>
      </main>

      <div className="mx-auto w-full max-w-7xl px-4 mt-6">
        <AdSlot slot="footer" />
      </div>

      <footer className="border-t border-white/10 py-6 mt-6 text-center text-xs text-white/40">
        Mi Mundial · Solo predicciones, <span className="text-neon">sin apuestas</span>
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

      <BottomNav
        active={tab}
        onChange={(k) => setTab(k as Tab)}
        items={[
          { key: "grupos", label: "Grupos", icon: "grupos" },
          { key: "cuadro", label: "Cuadro", icon: "cuadro" },
          { key: "dia", label: "Del día", icon: "dia" },
          { key: "ligas", label: "Ligas", icon: "ligas" },
          { key: "perfil", label: "Perfil", icon: "perfil" },
        ]}
      />
    </div>
  );
}

/* ---------------- UI auxiliar ---------------- */

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 select-none">
      <CrestTile className="size-9" />
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

function AuthButton({
  user,
  seed,
  favorite,
}: {
  user: { email?: string } | null;
  seed: string;
  favorite: string | null;
}) {
  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 text-sm transition whitespace-nowrap"
      >
        Entrar
      </Link>
    );
  }
  return (
    <button
      onClick={async () => {
        await signOut();
        window.location.href = "/";
      }}
      title={`${user.email ?? ""} · Cerrar sesión`}
      className="flex items-center gap-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 pl-1 pr-3 py-1 text-sm transition"
    >
      <Avatar seed={seed} flag={favorite} className="size-7 rounded-full" />
      <span className="hidden sm:inline text-white/60">Salir</span>
    </button>
  );
}

function StatHud({
  level,
  points,
  pending,
  streak,
  checkedInToday,
  onCheckIn,
}: {
  level: { level: number };
  points: number;
  pending: number;
  streak: number;
  checkedInToday: boolean;
  onCheckIn: () => void;
}) {
  return (
    <div className="flex items-stretch rounded-2xl glass border border-white/10 overflow-hidden">
      <Stat icon="nivel" accent="text-neon" value={`Nv ${level.level}`} />
      <span className="w-px self-stretch bg-white/10" />
      <Stat icon="puntos" accent="text-gold" value={points} sub={pending > 0 ? `+${pending}` : undefined} />
      <span className="w-px self-stretch bg-white/10" />
      {checkedInToday ? (
        <Stat icon="racha" accent="text-hot" value={streak} label="días" />
      ) : (
        <button
          onClick={onCheckIn}
          className="flex items-center gap-1.5 px-3 bg-hot text-white font-bold text-sm hover:brightness-110 transition"
        >
          <Icon name="racha" className="size-4" />
          <span className="hidden sm:inline">Check-in</span>
          <span className="text-[11px] opacity-90">+25</span>
        </button>
      )}
    </div>
  );
}

function Stat({
  icon,
  accent,
  value,
  sub,
  label,
}: {
  icon: IconName;
  accent: string;
  value: string | number;
  sub?: string;
  label?: string;
}) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5">
      <Icon name={icon} className={`size-4 ${accent}`} />
      <span className={`font-display leading-none tabular-nums ${accent}`}>{value}</span>
      {label && <span className="hidden sm:inline text-[10px] text-white/40">{label}</span>}
      {sub && <span className="hidden md:inline text-[10px] text-white/40">{sub}</span>}
    </div>
  );
}

function GhostIcon({
  name,
  title,
  onClick,
  dim,
}: {
  name: IconName;
  title: string;
  onClick: () => void;
  dim?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`hidden sm:grid place-items-center size-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition ${
        dim ? "text-white/40" : "text-white/75"
      }`}
    >
      <Icon name={name} className="size-5" />
    </button>
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

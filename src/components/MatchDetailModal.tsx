"use client";

import { TEAM_BY_CODE } from "@/data/teams";
import type { Match } from "@/lib/bracket";
import type { PickStatus } from "@/lib/results";
import Flag from "@/components/Flag";

export default function MatchDetailModal({
  match,
  roundName,
  status,
  locked,
  onPick,
  onClose,
}: {
  match: Match;
  roundName: string;
  status?: PickStatus;
  locked: boolean;
  onPick: (matchId: string, code: string) => void;
  onClose: () => void;
}) {
  const a = match.a ? TEAM_BY_CODE[match.a] : null;
  const b = match.b ? TEAM_BY_CODE[match.b] : null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-sm glass rounded-3xl p-6 glow-gold" onClick={(e) => e.stopPropagation()}>
        <div className="text-center text-[10px] uppercase tracking-[0.3em] text-neon/80">
          {roundName}
        </div>

        <div className="flex items-stretch justify-between gap-3 mt-4">
          <TeamSide team={a} side="a" match={match} status={status} locked={locked} onPick={onPick} />
          <div className="grid place-items-center">
            <span className="font-display text-2xl text-hot">VS</span>
          </div>
          <TeamSide team={b} side="b" match={match} status={status} locked={locked} onPick={onPick} />
        </div>

        {a && b && (
          <div className="mt-5 space-y-2 text-sm">
            <Bar label="Popularidad" a={a.pop} b={b.pop} />
            <p className="text-center text-[11px] text-white/45 mt-2">
              {locked
                ? "🔒 Este partido ya cerró."
                : status === "hit"
                ? "✓ Acertaste este resultado."
                : status === "miss"
                ? "✗ No salió como predijiste."
                : "Toca un equipo para elegir quién avanza."}
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-xl border border-white/15 bg-white/5 py-2.5 font-semibold hover:bg-white/10 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

function TeamSide({
  team,
  match,
  status,
  locked,
  onPick,
}: {
  team: { code: string; name: string; group: string; pop: number } | null;
  side: "a" | "b";
  match: Match;
  status?: PickStatus;
  locked: boolean;
  onPick: (matchId: string, code: string) => void;
}) {
  if (!team) {
    return (
      <div className="flex-1 rounded-2xl bg-white/[0.03] grid place-items-center py-6 text-white/30 text-sm">
        Por definir
      </div>
    );
  }
  const isWinner = match.winner === team.code;
  const hit = isWinner && status === "hit";
  const miss = isWinner && status === "miss";
  return (
    <button
      onClick={() => !locked && onPick(match.id, team.code)}
      disabled={locked}
      className={`flex-1 rounded-2xl p-4 flex flex-col items-center gap-2 transition ${
        hit
          ? "bg-neon/20 glow-neon"
          : miss
          ? "bg-hot/15"
          : isWinner
          ? "bg-gold/20 glow-gold"
          : locked
          ? "opacity-60"
          : "bg-white/5 hover:bg-white/10"
      }`}
    >
      <Flag code={team.code} className="w-16 h-11" />
      <div className="font-semibold text-center leading-tight">{team.name}</div>
      <div className="text-[10px] uppercase tracking-wider text-white/45">Grupo {team.group}</div>
      {isWinner && (
        <span className={`text-xs font-bold ${hit ? "text-neon" : miss ? "text-hot" : "text-gold"}`}>
          {hit ? "✓ Acierto" : miss ? "✗ Fallo" : "Tu elección"}
        </span>
      )}
    </button>
  );
}

function Bar({ label, a, b }: { label: string; a: number; b: number }) {
  const total = a + b || 1;
  const pa = Math.round((a / total) * 100);
  return (
    <div>
      <div className="flex justify-between text-[11px] text-white/50 mb-1">
        <span className="text-gold">{pa}%</span>
        <span>{label}</span>
        <span className="text-neon">{100 - pa}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden flex">
        <div className="h-full bg-gold" style={{ width: `${pa}%` }} />
        <div className="h-full bg-neon" style={{ width: `${100 - pa}%` }} />
      </div>
    </div>
  );
}

"use client";

import { GROUPS, TEAMS, type Team } from "@/data/teams";
import Flag from "@/components/Flag";

export default function GroupsView({
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
        className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-left transition ${
          active ? "bg-gold/15 glow-gold" : "hover:bg-white/5"
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

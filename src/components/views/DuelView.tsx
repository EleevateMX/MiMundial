"use client";

import { useMemo } from "react";
import { RIVALS, rivalPicks, type Rival } from "@/data/social";
import { buildRounds, champion, R32_LEN } from "@/lib/bracket";
import { TEAM_BY_CODE } from "@/data/teams";
import Flag from "@/components/Flag";

export default function DuelView({
  userPicks,
  userChamp,
  duels,
  onChallenge,
}: {
  userPicks: Record<string, string>;
  userChamp: string | null;
  duels: string[];
  onChallenge: (rivalId: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="glass rounded-2xl p-5 text-center">
        <div className="font-display text-2xl text-gold-gradient">
          DUELO 1 VS 1
        </div>
        <p className="text-white/55 text-sm mt-1">
          Reta a un rival y comparen sus cuadros. ¿Quién la tiene más clara?
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {RIVALS.map((rival) => (
          <RivalCard
            key={rival.id}
            rival={rival}
            challenged={duels.includes(rival.id)}
            userPicks={userPicks}
            userChamp={userChamp}
            onChallenge={() => onChallenge(rival.id)}
          />
        ))}
      </div>
    </div>
  );
}

function RivalCard({
  rival,
  challenged,
  userPicks,
  userChamp,
  onChallenge,
}: {
  rival: Rival;
  challenged: boolean;
  userPicks: Record<string, string>;
  userChamp: string | null;
  onChallenge: () => void;
}) {
  const rPicks = useMemo(() => rivalPicks(rival), [rival]);
  const rChamp = useMemo(() => champion(buildRounds(rPicks)), [rPicks]);

  // Coincidencia sobre los picks que el usuario ya hizo
  const userIds = Object.keys(userPicks);
  const same = userIds.filter((id) => userPicks[id] === rPicks[id]).length;
  const agreement = userIds.length
    ? Math.round((same / userIds.length) * 100)
    : 0;

  // Diferencias destacadas en la Ronda de 32
  const clashes = Array.from({ length: R32_LEN }, (_, i) => `r0-${i}`)
    .filter((id) => userPicks[id] && userPicks[id] !== rPicks[id])
    .slice(0, 3);

  return (
    <div className="glass rounded-2xl overflow-hidden flex flex-col">
      <div className="px-4 py-3 flex items-center gap-3 bg-white/5 border-b border-white/10">
        <Flag code={rival.flag} className="w-9 h-6" />
        <div className="min-w-0">
          <div className="font-semibold truncate">{rival.name}</div>
          <div className="text-[11px] text-white/45 truncate">{rival.blurb}</div>
        </div>
      </div>

      {!challenged ? (
        <div className="p-5 flex-1 flex flex-col items-center justify-center gap-3 text-center">
          <p className="text-sm text-white/55">
            Estilo: <span className="text-gold">{rival.style}</span>
          </p>
          <button
            onClick={onChallenge}
            className="rounded-full bg-hot text-white font-bold px-5 py-2.5 hover:brightness-110 transition glow-neon"
          >
            ⚔️ Retar
          </button>
        </div>
      ) : (
        <div className="p-4 flex-1 space-y-3">
          {/* Campeones enfrentados */}
          <div className="flex items-center justify-around text-center">
            <ChampMini label="Tú" code={userChamp} />
            <span className="font-display text-hot text-lg">VS</span>
            <ChampMini label={rival.name} code={rChamp} />
          </div>

          {/* Coincidencia */}
          <div>
            <div className="flex justify-between text-[11px] text-white/50 mb-1">
              <span>Coincidencia</span>
              <span className="text-gold font-bold">{agreement}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-neon to-gold transition-all"
                style={{ width: `${agreement}%` }}
              />
            </div>
            {userIds.length === 0 && (
              <p className="text-[11px] text-white/40 mt-1">
                Haz tus picks en “Mi Cuadro” para comparar.
              </p>
            )}
          </div>

          {/* Choques */}
          {clashes.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-white/40">
                Donde no coinciden
              </div>
              {clashes.map((id) => (
                <div
                  key={id}
                  className="flex items-center justify-between text-xs bg-white/5 rounded-lg px-2 py-1"
                >
                  <span className="flex items-center gap-1.5 text-gold">
                    <Flag code={userPicks[id]} className="w-5 h-3.5" />
                    {TEAM_BY_CODE[userPicks[id]]?.name}
                  </span>
                  <span className="text-white/30">vs</span>
                  <span className="flex items-center gap-1.5 text-white/70">
                    {TEAM_BY_CODE[rPicks[id]]?.name}
                    <Flag code={rPicks[id]} className="w-5 h-3.5" />
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChampMini({ label, code }: { label: string; code: string | null }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-[10px] uppercase tracking-wider text-white/40">
        {label}
      </div>
      {code ? (
        <>
          <Flag code={code} className="w-10 h-7" />
          <span className="text-xs font-semibold">{TEAM_BY_CODE[code]?.name}</span>
        </>
      ) : (
        <>
          <div className="w-10 h-7 rounded bg-white/10" />
          <span className="text-xs text-white/30">¿?</span>
        </>
      )}
    </div>
  );
}

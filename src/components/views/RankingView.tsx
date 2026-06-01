"use client";

import { useEffect, useMemo, useState } from "react";
import { MOCK_LEADERBOARD, TEAMS } from "@/data/teams";
import { fetchLeaderboard, type LeaderRow } from "@/lib/supabase/data";
import Flag from "@/components/Flag";
import AdSlot from "@/components/AdSlot";
import { SkeletonRows } from "@/components/Skeleton";

type Row = { name: string; pts: number; flag: string; you: boolean; rank: number };

export default function RankingView({
  score,
  favorite,
  myName,
}: {
  score: number;
  favorite: string | null;
  myName: string;
}) {
  const [remote, setRemote] = useState<LeaderRow[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchLeaderboard(50).then((r) => {
      if (!active) return;
      setRemote(r);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [score]);

  const rows: Row[] = useMemo(() => {
    if (remote && remote.length > 0) {
      return remote
        .map((r) => ({
          name: r.name,
          pts: r.score,
          flag: r.favorite ?? "mx",
          you: r.name === myName,
        }))
        .sort((a, b) => b.pts - a.pts)
        .map((r, i) => ({ ...r, rank: i + 1 }));
    }
    // Demo
    return [
      ...MOCK_LEADERBOARD.map((r) => ({ ...r, you: false })),
      { name: myName, pts: score, flag: favorite ?? "mx", you: true },
    ]
      .sort((a, b) => b.pts - a.pts)
      .map((r, i) => ({ ...r, rank: i + 1 }));
  }, [remote, score, favorite, myName]);

  const hot = [...TEAMS].sort((a, b) => b.pop - a.pop).slice(0, 6);

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="lg:col-span-2 glass rounded-2xl overflow-hidden">
        <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <span className="font-display text-lg text-gold">RANKING GLOBAL</span>
          <span className="text-[10px] uppercase tracking-wider text-neon">
            {remote && remote.length > 0 ? "real" : "En vivo"}
          </span>
        </div>
        {loading ? (
          <SkeletonRows rows={8} />
        ) : (
        <ul className="divide-y divide-white/5">
          {rows.map((r) => (
            <li
              key={`${r.rank}-${r.name}`}
              className={`flex items-center gap-3 px-4 py-3 ${r.you ? "bg-gold/10" : ""}`}
            >
              <span
                className={`w-7 text-center font-display text-lg ${
                  r.rank === 1 ? "text-gold" : r.you ? "text-neon" : "text-white/40"
                }`}
              >
                {r.rank}
              </span>
              <Flag code={r.flag} className="w-7 h-5" />
              <span className={`flex-1 ${r.you ? "text-gold font-bold" : ""}`}>{r.name}</span>
              <span className="font-display tabular-nums text-white/80">{r.pts}</span>
            </li>
          ))}
        </ul>
        )}
      </div>

      <div className="space-y-4">
        <AdSlot slot="ranking" />

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
    </div>
  );
}

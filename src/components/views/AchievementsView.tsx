"use client";

import { ACHIEVEMENTS } from "@/lib/achievements";

export default function AchievementsView({
  unlocked,
}: {
  unlocked: Set<string>;
}) {
  const count = unlocked.size;
  const total = ACHIEVEMENTS.length;

  return (
    <div className="space-y-5">
      <div className="glass rounded-2xl p-5 text-center">
        <div className="font-display text-2xl text-gold-gradient">
          TUS MEDALLAS
        </div>
        <p className="text-white/55 text-sm mt-1">
          Desbloqueadas <span className="text-gold font-bold">{count}</span> de{" "}
          {total}
        </p>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden mt-3 max-w-sm mx-auto">
          <div
            className="h-full rounded-full bg-gradient-to-r from-neon to-gold transition-all"
            style={{ width: `${(count / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ACHIEVEMENTS.map((a) => {
          const on = unlocked.has(a.id);
          return (
            <div
              key={a.id}
              className={`rounded-2xl p-4 flex items-start gap-3 transition ${
                on
                  ? "glass glow-gold float-up"
                  : "bg-white/[0.02] border border-white/5 opacity-60"
              }`}
            >
              <div
                className={`text-3xl ${on ? "" : "grayscale opacity-50"}`}
                aria-hidden
              >
                {a.icon}
              </div>
              <div className="min-w-0">
                <div
                  className={`font-display text-lg ${
                    on ? "text-gold" : "text-white/50"
                  }`}
                >
                  {a.name}
                </div>
                <p className="text-xs text-white/55">{a.desc}</p>
                <span
                  className={`inline-block mt-1 text-[10px] uppercase tracking-wider ${
                    on ? "text-neon" : "text-white/30"
                  }`}
                >
                  {on ? "✓ Desbloqueada" : "Bloqueada"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

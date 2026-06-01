"use client";

import { useEffect, useRef, useState } from "react";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { setSoundEnabled, playUnlock, playLevelUp } from "@/lib/fx";

type Toast = { id: number; icon: string; title: string; sub: string; kind: "ach" | "level" };

const ACH_BY_ID = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));

export default function RewardToaster({
  unlocked,
  level,
  levelLabel,
  soundOn,
}: {
  unlocked: Set<string>;
  level: number;
  levelLabel: string;
  soundOn: boolean;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const prevUnlocked = useRef<Set<string> | null>(null);
  const prevLevel = useRef<number | null>(null);
  const nextId = useRef(1);

  useEffect(() => {
    setSoundEnabled(soundOn);
  }, [soundOn]);

  function push(t: Omit<Toast, "id">) {
    const id = nextId.current++;
    setToasts((list) => [...list, { ...t, id }]);
    setTimeout(() => setToasts((list) => list.filter((x) => x.id !== id)), 3400);
  }

  // Logros nuevos
  useEffect(() => {
    if (prevUnlocked.current === null) {
      prevUnlocked.current = new Set(unlocked);
      return;
    }
    const fresh = [...unlocked].filter((id) => !prevUnlocked.current!.has(id));
    prevUnlocked.current = new Set(unlocked);
    fresh.forEach((id) => {
      const a = ACH_BY_ID[id];
      if (a) {
        push({ icon: a.icon, title: "¡Logro desbloqueado!", sub: a.name, kind: "ach" });
        playUnlock();
      }
    });
  }, [unlocked]);

  // Subida de nivel
  useEffect(() => {
    if (prevLevel.current === null) {
      prevLevel.current = level;
      return;
    }
    if (level > prevLevel.current) {
      push({ icon: "⭐", title: `¡Nivel ${level}!`, sub: levelLabel, kind: "level" });
      playLevelUp();
    }
    prevLevel.current = level;
  }, [level, levelLabel]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 inset-x-0 z-[60] flex flex-col items-center gap-2 pointer-events-none px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`float-up glass rounded-2xl px-4 py-2.5 flex items-center gap-3 glow-gold max-w-sm w-full ${
            t.kind === "level" ? "border-neon/40" : ""
          }`}
        >
          <span className="text-2xl">{t.icon}</span>
          <div className="leading-tight">
            <div
              className={`font-display text-base ${
                t.kind === "level" ? "text-neon" : "text-gold"
              }`}
            >
              {t.title}
            </div>
            <div className="text-xs text-white/70">{t.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

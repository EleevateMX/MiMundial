import { TEAM_BY_CODE } from "@/data/teams";
import type { LevelInfo } from "@/lib/levels";

export type ActivityItem = { icon: string; text: string; you: boolean };

// Muro de actividad: tus hitos + algo de comunidad (mock) para dar vida.
export function buildActivity(ctx: {
  name: string;
  champ: string | null;
  level: LevelInfo;
  streak: number;
  hits: number;
  dailyCount: number;
  medals: number;
}): ActivityItem[] {
  const mine: ActivityItem[] = [];
  if (ctx.champ) {
    mine.push({
      icon: "🏆",
      text: `Coronaste a ${TEAM_BY_CODE[ctx.champ]?.name ?? "tu campeón"} campeón`,
      you: true,
    });
  }
  if (ctx.level.level >= 2)
    mine.push({ icon: "⭐", text: `Subiste a Nivel ${ctx.level.level} · ${ctx.level.label}`, you: true });
  if (ctx.streak >= 2)
    mine.push({ icon: "🔥", text: `Llevas una racha de ${ctx.streak} días`, you: true });
  if (ctx.hits >= 1)
    mine.push({ icon: "✅", text: `Sumas ${ctx.hits} aciertos confirmados`, you: true });
  if (ctx.dailyCount >= 1)
    mine.push({ icon: "📅", text: `Hiciste ${ctx.dailyCount} predicciones del día`, you: true });
  if (ctx.medals >= 1)
    mine.push({ icon: "🎖️", text: `Desbloqueaste ${ctx.medals} medallas`, you: true });

  const community: ActivityItem[] = [
    { icon: "🏆", text: "Regina_07 llevó a México a semifinales", you: false },
    { icon: "⚔️", text: "kevoo quiere retarte a un duelo", you: false },
    { icon: "⭐", text: "DonPepe subió a Nivel 6 · Crack", you: false },
    { icon: "🔥", text: "Mariana.G alcanzó 7 días de racha", you: false },
  ];

  // Intercala: primero tus hitos, luego comunidad
  return [...mine, ...community].slice(0, 8);
}

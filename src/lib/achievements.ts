import { UNDERDOG_CODES } from "@/data/social";
import { roundOf } from "@/lib/bracket";

export type AchievementCtx = {
  picks: Record<string, string>;
  mult: Record<string, number>;
  champ: string | null;
  favorite: string | null;
  streakCount: number;
  leagues: number; // ligas creadas/unidas
  duels: number; // duelos lanzados
  shared: boolean;
  dailyCount: number; // predicciones del día hechas
  maxEarlyBonus: number; // mayor bonus de anticipación logrado
  hits: number; // aciertos confirmados
};

export type Achievement = {
  id: string;
  name: string;
  icon: string;
  desc: string;
  check: (c: AchievementCtx) => boolean;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "primer-pick",
    name: "Primer pick",
    icon: "🎯",
    desc: "Haz tu primera predicción.",
    check: (c) => Object.keys(c.picks).length >= 1,
  },
  {
    id: "profeta",
    name: "Profeta",
    icon: "🔮",
    desc: "Corona a tu campeón en la final.",
    check: (c) => !!c.champ,
  },
  {
    id: "fiel",
    name: "Fiel a la camiseta",
    icon: "❤️",
    desc: "Lleva a tu selección hasta el título.",
    check: (c) => !!c.champ && c.champ === c.favorite,
  },
  {
    id: "underdog",
    name: "Cazador de sorpresas",
    icon: "🐺",
    desc: "Avanza a un equipo poco favorito en la Ronda de 32.",
    check: (c) =>
      Object.entries(c.picks).some(
        ([id, code]) => roundOf(id) === 0 && UNDERDOG_CODES.has(code)
      ),
  },
  {
    id: "estratega",
    name: "Estratega",
    icon: "🎲",
    desc: "Usa un multiplicador x3 en una predicción.",
    check: (c) => Object.values(c.mult).some((m) => m >= 3),
  },
  {
    id: "completo",
    name: "Cuadro completo",
    icon: "🏆",
    desc: "Decide todos los partidos hasta la final.",
    check: (c) => Object.keys(c.picks).length >= 31,
  },
  {
    id: "constante",
    name: "Constante",
    icon: "🔥",
    desc: "Mantén una racha de 3 días.",
    check: (c) => c.streakCount >= 3,
  },
  {
    id: "social",
    name: "Con la banda",
    icon: "👥",
    desc: "Crea o únete a una liga con amigos.",
    check: (c) => c.leagues >= 1,
  },
  {
    id: "retador",
    name: "Retador",
    icon: "⚔️",
    desc: "Lanza un duelo 1v1.",
    check: (c) => c.duels >= 1,
  },
  {
    id: "viral",
    name: "Viral",
    icon: "📣",
    desc: "Comparte tu cuadro.",
    check: (c) => c.shared,
  },
  {
    id: "quinielero",
    name: "Quinielero",
    icon: "🗓️",
    desc: "Haz una predicción del día.",
    check: (c) => c.dailyCount >= 1,
  },
  {
    id: "madrugador",
    name: "Madrugador",
    icon: "⏰",
    desc: "Consigue un bonus de anticipación de 15+.",
    check: (c) => c.maxEarlyBonus >= 15,
  },
  {
    id: "acertador",
    name: "Acertador",
    icon: "✅",
    desc: "Acierta una predicción ya resuelta.",
    check: (c) => c.hits >= 1,
  },
];

export function unlockedSet(ctx: AchievementCtx): Set<string> {
  return new Set(ACHIEVEMENTS.filter((a) => a.check(ctx)).map((a) => a.id));
}

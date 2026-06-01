import { TEAM_BY_CODE, TEAMS } from "@/data/teams";
import { simulate } from "@/lib/bracket";

// Rivales para el modo Duelo 1v1. Cada uno tiene un "estilo" de predicción.
export type Rival = {
  id: string;
  name: string;
  flag: string;
  style: "favoritos" | "corazonadas" | "equilibrado";
  blurb: string;
};

export const RIVALS: Rival[] = [
  {
    id: "regina",
    name: "Regina_07",
    flag: "mx",
    style: "favoritos",
    blurb: "Siempre le va a los grandes.",
  },
  {
    id: "kevoo",
    name: "kevoo",
    flag: "br",
    style: "corazonadas",
    blurb: "Vive de las sorpresas.",
  },
  {
    id: "donpepe",
    name: "DonPepe",
    flag: "es",
    style: "equilibrado",
    blurb: "Frío y calculador.",
  },
];

// Hash determinista simple para generar "sorpresas" estables por rival.
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295; // 0..1
}

// Genera el cuadro completo (picks) de un rival según su estilo.
export function rivalPicks(rival: Rival): Record<string, string> {
  return simulate((a, b, matchId) => {
    const pa = TEAM_BY_CODE[a]?.pop ?? 50;
    const pb = TEAM_BY_CODE[b]?.pop ?? 50;
    const fav = pa >= pb ? a : b;
    const dog = pa >= pb ? b : a;
    const r = hash(rival.id + matchId);

    if (rival.style === "favoritos") return r < 0.85 ? fav : dog;
    if (rival.style === "corazonadas") return r < 0.45 ? dog : fav;
    return r < 0.65 ? fav : dog; // equilibrado
  });
}

// Ligas mock (ranking privado). El usuario aparece dentro al unirse/crear.
export const SAMPLE_LEAGUE_MEMBERS = [
  { name: "Regina_07", pts: 1480, flag: "mx" },
  { name: "elProfe", pts: 1390, flag: "ar" },
  { name: "kevoo", pts: 1280, flag: "br" },
  { name: "la_jefa", pts: 1010, flag: "mx" },
  { name: "Mariana.G", pts: 920, flag: "co" },
];

export function randomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

// Equipos considerados "sorpresa" (baja popularidad) para el logro Underdog.
export const UNDERDOG_CODES = new Set(
  TEAMS.filter((t) => t.pop < 35).map((t) => t.code)
);

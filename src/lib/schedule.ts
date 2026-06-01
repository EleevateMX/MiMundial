import { KNOCKOUT_KICKOFFS } from "@/data/fixtures";

// Kickoffs reales de la fase eliminatoria (el cuadro). Mismo formato de siempre:
// { [matchId]: epochMs }. El parámetro se ignora (fechas absolutas reales).
export function getKickoffs(_base?: number): Record<string, number> {
  void _base;
  return KNOCKOUT_KICKOFFS;
}

export function isLocked(kickoff: number | undefined, now: number): boolean {
  return kickoff !== undefined && kickoff <= now;
}

// Bonus por anticipación: a más días antes del partido, más puntos extra.
export function earlyBonus(kickoff: number | undefined, now: number): number {
  if (kickoff === undefined) return 0;
  const days = (kickoff - now) / (24 * 60 * 60 * 1000);
  if (days <= 0) return 0;
  return Math.max(2, Math.min(25, Math.round(days)));
}

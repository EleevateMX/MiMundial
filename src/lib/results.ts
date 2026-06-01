"use client";

import { buildRounds, ROUND_POINTS, roundOf, type Round } from "@/lib/bracket";

// Resultados oficiales del torneo (los ingresa el admin).
// Mismo formato que los picks: { matchId: códigoGanadorReal }.
export type Results = Record<string, string>;

const KEY = "mimundial:results:v1";

export function loadResults(): Results {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveResults(r: Results) {
  try {
    localStorage.setItem(KEY, JSON.stringify(r));
    // Notifica a otras pestañas/usuarios
    window.dispatchEvent(new StorageEvent("storage", { key: KEY }));
  } catch {}
}

export const RESULTS_KEY = KEY;

// Equipos que realmente avanzaron en cada ronda + si la ronda está resuelta.
export function realInfo(results: Results) {
  const rounds = buildRounds(results);
  const winnersByRound = rounds.map(
    (r) => new Set(r.matches.map((m) => m.winner).filter(Boolean) as string[])
  );
  const resolvedRound = rounds.map((r) => r.matches.some((m) => m.winner));
  return { rounds, winnersByRound, resolvedRound };
}

export type PickStatus = "hit" | "miss" | "pending";

// Estado de cada predicción del usuario frente a los resultados.
export function pickStatuses(
  picks: Record<string, string>,
  results: Results
): Record<string, PickStatus> {
  const { winnersByRound, resolvedRound } = realInfo(results);
  const out: Record<string, PickStatus> = {};
  for (const [id, code] of Object.entries(picks)) {
    const r = roundOf(id);
    if (!resolvedRound[r]) {
      out[id] = "pending";
    } else {
      out[id] = winnersByRound[r].has(code) ? "hit" : "miss";
    }
  }
  return out;
}

// Puntos GANADOS (solo aciertos en rondas resueltas), con multiplicador.
export function earnedScore(
  picks: Record<string, string>,
  mult: Record<string, number>,
  results: Results
): number {
  const statuses = pickStatuses(picks, results);
  return Object.entries(statuses).reduce((sum, [id, st]) => {
    if (st !== "hit") return sum;
    return sum + (ROUND_POINTS[roundOf(id)] ?? 0) * (mult[id] ?? 1);
  }, 0);
}

export function hasAnyResult(results: Results): boolean {
  return Object.keys(results).length > 0;
}

export function realRoundsOf(results: Results): Round[] {
  return buildRounds(results);
}

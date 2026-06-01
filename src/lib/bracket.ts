import { R32_MATCHES } from "@/data/teams";

export type Slot = string | null; // código de equipo o vacío

export type Match = {
  id: string;
  round: number; // 0 = 32avos, 1 = octavos, ... 4 = final
  index: number; // posición dentro de la ronda
  a: Slot;
  b: Slot;
  winner: Slot;
};

export type Round = {
  round: number;
  name: string;
  matches: Match[];
};

export const ROUND_NAMES = [
  "Ronda de 32",
  "Octavos",
  "Cuartos",
  "Semifinal",
  "Final",
];

// Reconstruye todas las rondas a partir de las predicciones (picks) del usuario.
// picks: { [matchId]: códigoDelGanador }
export function buildRounds(picks: Record<string, string>): Round[] {
  const rounds: Round[] = [];

  // Ronda 0 — 16 cruces fijos
  const r0: Match[] = R32_MATCHES.map(([a, b], i) => {
    const id = `r0-${i}`;
    return { id, round: 0, index: i, a, b, winner: picks[id] ?? null };
  });
  rounds.push({ round: 0, name: ROUND_NAMES[0], matches: r0 });

  // Rondas siguientes: los ganadores de dos cruces alimentan el siguiente
  let prev = r0;
  for (let round = 1; round <= 4; round++) {
    const count = prev.length / 2;
    const matches: Match[] = [];
    for (let i = 0; i < count; i++) {
      const id = `r${round}-${i}`;
      const a = prev[i * 2].winner;
      const b = prev[i * 2 + 1].winner;
      // si cambian los ganadores previos, invalidamos un pick imposible
      const stored = picks[id] ?? null;
      const valid = stored && (stored === a || stored === b) ? stored : null;
      matches.push({ id, round, index: i, a, b, winner: valid });
    }
    rounds.push({ round, name: ROUND_NAMES[round], matches });
    prev = matches;
  }

  return rounds;
}

export function champion(rounds: Round[]): Slot {
  const final = rounds[rounds.length - 1].matches[0];
  return final?.winner ?? null;
}

// Puntos mock por cada predicción según la ronda (más avanzada = más puntos)
export const ROUND_POINTS = [10, 20, 40, 80, 160];

export function userScore(picks: Record<string, string>): number {
  return Object.keys(picks).reduce((sum, id) => {
    const round = Number(id.split("-")[0].slice(1));
    return sum + (ROUND_POINTS[round] ?? 0);
  }, 0);
}

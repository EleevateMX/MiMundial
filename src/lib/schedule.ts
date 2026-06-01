// Calendario mock de la Ronda de 32: define cuándo "arranca" cada partido.
// Sirve para la cuenta regresiva y para bloquear los picks antes del pitazo.

const MIN = 60 * 1000;

// Minutos respecto al momento de carga. Negativo = ya empezó (bloqueado).
// Mezclamos partidos cerrados, en juego, por arrancar pronto y a futuro.
const OFFSETS_MIN = [
  -180, // 0 cerrado
  -45, // 1 cerrado / en juego
  1.5, // 2 arranca en segundos -> tensión
  8, // 3
  35, // 4
  90, // 5
  60 * 5, // 6
  60 * 8, // 7
  60 * 24, // 8 mañana
  60 * 26,
  60 * 30,
  60 * 33,
  60 * 48, // pasado mañana
  60 * 50,
  60 * 54,
  60 * 56,
];

export function getKickoffs(base: number): Record<string, number> {
  const map: Record<string, number> = {};
  OFFSETS_MIN.forEach((m, i) => {
    map[`r0-${i}`] = base + m * MIN;
  });
  return map;
}

export function isLocked(kickoff: number | undefined, now: number): boolean {
  return kickoff !== undefined && kickoff <= now;
}

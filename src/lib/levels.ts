// Sistema de niveles / XP. El XP es el puntaje total acumulado.

export type LevelInfo = {
  level: number;
  label: string;
  curMin: number;
  nextMin: number | null;
  intoLevel: number; // XP dentro del nivel actual
  span: number; // XP necesario para el siguiente
  pct: number; // progreso 0..100
};

const THRESHOLDS = [0, 100, 250, 500, 900, 1500, 2400, 3600, 5200, 7200];
const LABELS = [
  "Novato",
  "Aficionado",
  "Hincha",
  "Conocedor",
  "Analista",
  "Crack",
  "Maestro",
  "Estratega",
  "Leyenda",
  "Inmortal",
];

export function levelFromXp(xp: number): LevelInfo {
  let i = 0;
  while (i + 1 < THRESHOLDS.length && xp >= THRESHOLDS[i + 1]) i++;
  const curMin = THRESHOLDS[i];
  const nextMin = i + 1 < THRESHOLDS.length ? THRESHOLDS[i + 1] : null;
  const span = nextMin ? nextMin - curMin : 1;
  const intoLevel = xp - curMin;
  const pct = nextMin ? Math.min(100, Math.round((intoLevel / span) * 100)) : 100;
  return {
    level: i + 1,
    label: LABELS[i],
    curMin,
    nextMin,
    intoLevel,
    span,
    pct,
  };
}

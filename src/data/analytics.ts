import { TEAMS } from "@/data/teams";

// Datos de ejemplo para el panel de administración.
// (Mock determinista — al conectar Supabase, esto vendrá de la base de datos.)

export type Kpi = {
  label: string;
  value: string;
  delta: number; // % cambio vs periodo anterior
  hint: string;
};

const TOTAL_USERS = 18432;

export const KPIS: Kpi[] = [
  { label: "Usuarios totales", value: TOTAL_USERS.toLocaleString("es-MX"), delta: 12.4, hint: "registrados" },
  { label: "Activos hoy", value: "3,128", delta: 8.1, hint: "DAU" },
  { label: "Nuevos hoy", value: "642", delta: 23.7, hint: "altas" },
  { label: "Cuadros completos", value: "7,905", delta: 5.3, hint: "43% de usuarios" },
  { label: "Ligas creadas", value: "1,274", delta: 18.9, hint: "privadas" },
  { label: "Instalaciones PWA", value: "4,560", delta: 31.2, hint: "añadidas a inicio" },
];

// Serie de 14 días: altas y activos diarios (estable).
const DAYS = 14;
function seriesFrom(base: number, swing: number, seed: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < DAYS; i++) {
    const t = i / (DAYS - 1);
    const wave = Math.sin((i + seed) * 0.9) * swing;
    const trend = base * (0.6 + 0.7 * t); // tendencia creciente
    out.push(Math.max(0, Math.round(trend + wave)));
  }
  return out;
}

export const SIGNUPS_14D = seriesFrom(520, 90, 1);
export const DAU_14D = seriesFrom(2600, 320, 3);

export function dayLabels(): string[] {
  const labels: string[] = [];
  const now = new Date();
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    labels.push(`${d.getDate()}/${d.getMonth() + 1}`);
  }
  return labels;
}

// Campeones más predichos (derivado de la popularidad de cada selección).
export const TOP_CHAMPIONS = [...TEAMS]
  .sort((a, b) => b.pop - a.pop)
  .slice(0, 8)
  .map((t) => ({
    code: t.code,
    name: t.name,
    // "elegido como campeón" por una fracción de usuarios
    count: Math.round((t.pop / 100) * TOTAL_USERS * 0.12),
  }));

// Distribución de logros (% de usuarios que lo tienen).
export const ACH_DISTRIBUTION: { name: string; pct: number }[] = [
  { name: "Primer pick", pct: 96 },
  { name: "Profeta", pct: 61 },
  { name: "Cuadro completo", pct: 43 },
  { name: "Con la banda", pct: 38 },
  { name: "Cazador de sorpresas", pct: 29 },
  { name: "Estratega", pct: 22 },
  { name: "Retador", pct: 17 },
  { name: "Constante", pct: 14 },
  { name: "Viral", pct: 9 },
];

export const DEVICE_SPLIT = [
  { label: "Móvil", pct: 68, color: "#ff3d8a" },
  { label: "Escritorio", pct: 21, color: "#2bf5c0" },
  { label: "PWA instalada", pct: 11, color: "#ffd24a" },
];

export const RETENTION = { d1: 54, d7: 31, d30: 18 };

export const RECENT_USERS = [
  { name: "Regina_07", flag: "mx", picks: 31, when: "hace 2 min", plan: "Google" },
  { name: "kevoo", flag: "br", picks: 28, when: "hace 6 min", plan: "Google" },
  { name: "Mariana.G", flag: "co", picks: 31, when: "hace 11 min", plan: "Correo" },
  { name: "DonPepe", flag: "es", picks: 16, when: "hace 18 min", plan: "Google" },
  { name: "tía_lupita", flag: "mx", picks: 31, when: "hace 24 min", plan: "Correo" },
  { name: "n3ymarista", flag: "br", picks: 22, when: "hace 31 min", plan: "Google" },
  { name: "la_jefa", flag: "mx", picks: 31, when: "hace 40 min", plan: "Google" },
  { name: "elProfe", flag: "ar", picks: 30, when: "hace 52 min", plan: "Correo" },
];

export const TOTAL_USERS_NUM = TOTAL_USERS;

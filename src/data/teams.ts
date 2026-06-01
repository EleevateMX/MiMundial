// Datos del torneo "Mi Mundial" — selecciones reales 2026 (12 grupos A-L).
// Países reales con banderas locales. Sin marcas registradas de terceros.

export type Team = {
  code: string; // ISO 3166-1 alpha-2 (o gb-eng / gb-sct)
  name: string;
  group: string; // A - L
  pop: number; // "popularidad" mock: % de usuarios que lo ven campeón
};

export const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"] as const;

export const TEAMS: Team[] = [
  // Grupo A
  { code: "mx", name: "México", group: "A", pop: 70 },
  { code: "za", name: "Sudáfrica", group: "A", pop: 28 },
  { code: "kr", name: "Corea del Sur", group: "A", pop: 45 },
  { code: "cz", name: "República Checa", group: "A", pop: 40 },
  // Grupo B
  { code: "ca", name: "Canadá", group: "B", pop: 38 },
  { code: "ba", name: "Bosnia y Herzegovina", group: "B", pop: 26 },
  { code: "qa", name: "Catar", group: "B", pop: 18 },
  { code: "ch", name: "Suiza", group: "B", pop: 55 },
  // Grupo C
  { code: "br", name: "Brasil", group: "C", pop: 88 },
  { code: "ma", name: "Marruecos", group: "C", pop: 58 },
  { code: "ht", name: "Haití", group: "C", pop: 12 },
  { code: "gb-sct", name: "Escocia", group: "C", pop: 35 },
  // Grupo D
  { code: "us", name: "Estados Unidos", group: "D", pop: 54 },
  { code: "py", name: "Paraguay", group: "D", pop: 33 },
  { code: "au", name: "Australia", group: "D", pop: 30 },
  { code: "tr", name: "Turquía", group: "D", pop: 52 },
  // Grupo E
  { code: "de", name: "Alemania", group: "E", pop: 80 },
  { code: "cw", name: "Curazao", group: "E", pop: 10 },
  { code: "ci", name: "Costa de Marfil", group: "E", pop: 36 },
  { code: "ec", name: "Ecuador", group: "E", pop: 44 },
  // Grupo F
  { code: "nl", name: "Países Bajos", group: "F", pop: 72 },
  { code: "jp", name: "Japón", group: "F", pop: 50 },
  { code: "se", name: "Suecia", group: "F", pop: 42 },
  { code: "tn", name: "Túnez", group: "F", pop: 24 },
  // Grupo G
  { code: "be", name: "Bélgica", group: "G", pop: 66 },
  { code: "eg", name: "Egipto", group: "G", pop: 34 },
  { code: "ir", name: "Irán", group: "G", pop: 28 },
  { code: "nz", name: "Nueva Zelanda", group: "G", pop: 14 },
  // Grupo H
  { code: "es", name: "España", group: "H", pop: 82 },
  { code: "cv", name: "Cabo Verde", group: "H", pop: 16 },
  { code: "sa", name: "Arabia Saudí", group: "H", pop: 22 },
  { code: "uy", name: "Uruguay", group: "H", pop: 60 },
  // Grupo I
  { code: "fr", name: "Francia", group: "I", pop: 86 },
  { code: "sn", name: "Senegal", group: "I", pop: 48 },
  { code: "iq", name: "Irak", group: "I", pop: 20 },
  { code: "no", name: "Noruega", group: "I", pop: 55 },
  // Grupo J
  { code: "ar", name: "Argentina", group: "J", pop: 90 },
  { code: "dz", name: "Argelia", group: "J", pop: 38 },
  { code: "at", name: "Austria", group: "J", pop: 40 },
  { code: "jo", name: "Jordania", group: "J", pop: 15 },
  // Grupo K
  { code: "pt", name: "Portugal", group: "K", pop: 78 },
  { code: "cd", name: "RD Congo", group: "K", pop: 30 },
  { code: "uz", name: "Uzbekistán", group: "K", pop: 22 },
  { code: "co", name: "Colombia", group: "K", pop: 58 },
  // Grupo L
  { code: "gb-eng", name: "Inglaterra", group: "L", pop: 80 },
  { code: "hr", name: "Croacia", group: "L", pop: 62 },
  { code: "gh", name: "Ghana", group: "L", pop: 33 },
  { code: "pa", name: "Panamá", group: "L", pop: 20 },
];

export const TEAM_BY_CODE: Record<string, Team> = Object.fromEntries(
  TEAMS.map((t) => [t.code, t])
);

export function flagUrl(code: string): string {
  return `/flags/${code}.svg`;
}

// Cuadro de eliminatorias (Ronda de 32 / 16avos), ordenado para que el árbol
// reproduzca la estructura real (partidos 73-104 del Mundial 2026).
// Las selecciones son un sembrado de ejemplo (1º/2º/mejores 3º por grupo).
export const R32_MATCHES: [string, string][] = [
  ["de", "gb-sct"], // P74: 1E vs 3º
  ["fr", "sa"], // P77: 1I vs 3º
  ["kr", "ca"], // P73: 2A vs 2B
  ["nl", "ma"], // P75: 1F vs 2C
  ["co", "hr"], // P83: 2K vs 2L
  ["es", "at"], // P84: 1H vs 2J
  ["us", "se"], // P81: 1D vs 3º
  ["be", "cz"], // P82: 1G vs 3º
  ["br", "jp"], // P76: 1C vs 2F
  ["ec", "sn"], // P78: 2E vs 2I
  ["mx", "iq"], // P79: 1A vs 3º
  ["gb-eng", "uz"], // P80: 1L vs 3º
  ["ar", "uy"], // P86: 1J vs 2H
  ["tr", "eg"], // P88: 2D vs 2G
  ["ch", "dz"], // P85: 1B vs 3º
  ["pt", "py"], // P87: 1K vs 3º
];

// Leaderboard global mock (predicciones, NO apuestas).
export const MOCK_LEADERBOARD = [
  { name: "Regina_07", pts: 1480, flag: "mx" },
  { name: "elProfe", pts: 1390, flag: "ar" },
  { name: "Mariana.G", pts: 1325, flag: "co" },
  { name: "kevoo", pts: 1280, flag: "br" },
  { name: "tía_lupita", pts: 1190, flag: "mx" },
  { name: "DonPepe", pts: 1120, flag: "es" },
  { name: "n3ymarista", pts: 1075, flag: "br" },
  { name: "la_jefa", pts: 1010, flag: "mx" },
];

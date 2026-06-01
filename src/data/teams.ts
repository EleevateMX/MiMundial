// Datos del torneo "Mi Mundial" — prototipo visual.
// Países reales con banderas (SVG vía flagcdn). Sin marcas registradas de terceros.

export type Team = {
  code: string; // ISO 3166-1 alpha-2 (o gb-eng / gb-sct / gb-wls)
  name: string;
  group: string; // A - L
  pop: number; // "popularidad" mock: % de usuarios que creen que avanza
};

export const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"] as const;

export const TEAMS: Team[] = [
  // Grupo A
  { code: "mx", name: "México", group: "A", pop: 71 },
  { code: "no", name: "Noruega", group: "A", pop: 48 },
  { code: "au", name: "Australia", group: "A", pop: 33 },
  { code: "ma", name: "Marruecos", group: "A", pop: 58 },
  // Grupo B
  { code: "ca", name: "Canadá", group: "B", pop: 41 },
  { code: "hr", name: "Croacia", group: "B", pop: 62 },
  { code: "ng", name: "Nigeria", group: "B", pop: 44 },
  { code: "qa", name: "Catar", group: "B", pop: 19 },
  // Grupo C
  { code: "us", name: "Estados Unidos", group: "C", pop: 55 },
  { code: "nl", name: "Países Bajos", group: "C", pop: 69 },
  { code: "eg", name: "Egipto", group: "C", pop: 37 },
  { code: "kr", name: "Corea del Sur", group: "C", pop: 46 },
  // Grupo D
  { code: "ar", name: "Argentina", group: "D", pop: 88 },
  { code: "pl", name: "Polonia", group: "D", pop: 43 },
  { code: "gh", name: "Ghana", group: "D", pop: 31 },
  { code: "sa", name: "Arabia Saudita", group: "D", pop: 22 },
  // Grupo E
  { code: "fr", name: "Francia", group: "E", pop: 84 },
  { code: "dk", name: "Dinamarca", group: "E", pop: 51 },
  { code: "ci", name: "Costa de Marfil", group: "E", pop: 35 },
  { code: "nz", name: "Nueva Zelanda", group: "E", pop: 14 },
  // Grupo F
  { code: "br", name: "Brasil", group: "F", pop: 86 },
  { code: "ch", name: "Suiza", group: "F", pop: 47 },
  { code: "cm", name: "Camerún", group: "F", pop: 34 },
  { code: "jp", name: "Japón", group: "F", pop: 57 },
  // Grupo G
  { code: "es", name: "España", group: "G", pop: 79 },
  { code: "uy", name: "Uruguay", group: "G", pop: 61 },
  { code: "rs", name: "Serbia", group: "G", pop: 39 },
  { code: "tn", name: "Túnez", group: "G", pop: 26 },
  // Grupo H
  { code: "pt", name: "Portugal", group: "H", pop: 78 },
  { code: "gb-eng", name: "Inglaterra", group: "H", pop: 80 },
  { code: "ec", name: "Ecuador", group: "H", pop: 38 },
  { code: "ir", name: "Irán", group: "H", pop: 24 },
  // Grupo I
  { code: "de", name: "Alemania", group: "I", pop: 76 },
  { code: "be", name: "Bélgica", group: "I", pop: 64 },
  { code: "sn", name: "Senegal", group: "I", pop: 49 },
  { code: "cr", name: "Costa Rica", group: "I", pop: 21 },
  // Grupo J
  { code: "it", name: "Italia", group: "J", pop: 72 },
  { code: "co", name: "Colombia", group: "J", pop: 60 },
  { code: "gb-wls", name: "Gales", group: "J", pop: 36 },
  { code: "dz", name: "Argelia", group: "J", pop: 40 },
  // Grupo K
  { code: "se", name: "Suecia", group: "K", pop: 45 },
  { code: "pe", name: "Perú", group: "K", pop: 42 },
  { code: "ua", name: "Ucrania", group: "K", pop: 44 },
  { code: "hn", name: "Honduras", group: "K", pop: 18 },
  // Grupo L
  { code: "gb-sct", name: "Escocia", group: "L", pop: 43 },
  { code: "cl", name: "Chile", group: "L", pop: 52 },
  { code: "gr", name: "Grecia", group: "L", pop: 41 },
  { code: "pa", name: "Panamá", group: "L", pop: 20 },
];

export const TEAM_BY_CODE: Record<string, Team> = Object.fromEntries(
  TEAMS.map((t) => [t.code, t])
);

export function flagUrl(code: string): string {
  // Banderas empaquetadas localmente (sin depender de un CDN externo).
  return `/flags/${code}.svg`;
}

// Sembrado del cuadro final (Ronda de 32). 16 cruces -> hasta la gran final.
// El usuario predice al ganador de cada cruce y va avanzando.
export const R32_MATCHES: [string, string][] = [
  ["ar", "sa"],
  ["nl", "us"],
  ["fr", "sn"],
  ["pt", "ch"],
  ["br", "kr"],
  ["hr", "jp"],
  ["es", "ma"],
  ["de", "be"],
  ["gb-eng", "ng"],
  ["mx", "pl"],
  ["it", "uy"],
  ["co", "ec"],
  ["gb-wls", "dz"],
  ["se", "pe"],
  ["gb-sct", "cl"],
  ["dk", "gr"],
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

// Calendario real de la Copa del Mundo 2026 (fase de grupos + eliminatorias).
// Horarios originales en hora del Este de EE. UU. (EDT = UTC-4); aquí se guardan
// como timestamps UTC y la app los muestra en la hora local de cada usuario.

export type Fixture = {
  id: string;
  ts: number; // kickoff en epoch ms (UTC)
  et: string; // hora original (Este de EE. UU.)
  group: string;
  home: string;
  away: string;
  venue: string;
};

let _n = 0;
function f(
  mon: number,
  day: number,
  et: string,
  group: string,
  home: string,
  away: string,
  venue: string
): Fixture {
  const [h, mi] = et.split(":").map(Number);
  const ts = Date.UTC(2026, mon - 1, day, h + 4, mi); // EDT -> UTC
  _n++;
  return { id: `g${_n}`, ts, et, group, home, away, venue };
}

export const GROUP_FIXTURES: Fixture[] = [
  // Jue 11 jun
  f(6, 11, "15:00", "A", "mx", "za", "Ciudad de México"),
  f(6, 11, "22:00", "A", "kr", "cz", "Guadalajara"),
  // Vie 12 jun
  f(6, 12, "15:00", "B", "ca", "ba", "Toronto"),
  f(6, 12, "21:00", "D", "us", "py", "Los Ángeles"),
  // Sáb 13 jun
  f(6, 13, "15:00", "B", "qa", "ch", "Bahía de SF"),
  f(6, 13, "18:00", "C", "br", "ma", "Nueva York NJ"),
  f(6, 13, "21:00", "C", "ht", "gb-sct", "Boston"),
  f(6, 13, "00:00", "D", "au", "tr", "Vancouver"),
  // Dom 14 jun
  f(6, 14, "13:00", "E", "de", "cw", "Houston"),
  f(6, 14, "16:00", "F", "nl", "jp", "Dallas"),
  f(6, 14, "19:00", "E", "ci", "ec", "Filadelfia"),
  f(6, 14, "22:00", "F", "se", "tn", "Monterrey"),
  // Lun 15 jun
  f(6, 15, "12:00", "H", "es", "cv", "Atlanta"),
  f(6, 15, "15:00", "G", "be", "eg", "Seattle"),
  f(6, 15, "18:00", "H", "sa", "uy", "Miami"),
  f(6, 15, "21:00", "G", "ir", "nz", "Los Ángeles"),
  // Mar 16 jun
  f(6, 16, "15:00", "I", "fr", "sn", "Nueva York NJ"),
  f(6, 16, "18:00", "I", "iq", "no", "Boston"),
  f(6, 16, "21:00", "J", "ar", "dz", "Kansas City"),
  f(6, 16, "00:00", "J", "at", "jo", "Bahía de SF"),
  // Mié 17 jun
  f(6, 17, "13:00", "K", "pt", "cd", "Houston"),
  f(6, 17, "16:00", "L", "gb-eng", "hr", "Dallas"),
  f(6, 17, "19:00", "L", "gh", "pa", "Toronto"),
  f(6, 17, "22:00", "K", "uz", "co", "Ciudad de México"),
  // Jue 18 jun
  f(6, 18, "12:00", "A", "cz", "za", "Atlanta"),
  f(6, 18, "15:00", "B", "ch", "ba", "Los Ángeles"),
  f(6, 18, "18:00", "B", "ca", "qa", "Vancouver"),
  f(6, 18, "21:00", "A", "mx", "kr", "Guadalajara"),
  // Vie 19 jun
  f(6, 19, "15:00", "D", "us", "au", "Seattle"),
  f(6, 19, "18:00", "C", "gb-sct", "ma", "Boston"),
  f(6, 19, "21:00", "C", "br", "ht", "Filadelfia"),
  f(6, 19, "00:00", "D", "tr", "py", "Bahía de SF"),
  // Sáb 20 jun
  f(6, 20, "13:00", "F", "nl", "se", "Houston"),
  f(6, 20, "16:00", "E", "de", "ci", "Toronto"),
  f(6, 20, "22:00", "E", "ec", "cw", "Kansas City"),
  f(6, 20, "00:00", "F", "tn", "jp", "Monterrey"),
  // Dom 21 jun
  f(6, 21, "12:00", "H", "es", "sa", "Atlanta"),
  f(6, 21, "15:00", "G", "be", "ir", "Los Ángeles"),
  f(6, 21, "18:00", "H", "uy", "cv", "Miami"),
  f(6, 21, "21:00", "G", "nz", "eg", "Vancouver"),
  // Lun 22 jun
  f(6, 22, "13:00", "J", "ar", "at", "Dallas"),
  f(6, 22, "17:00", "I", "fr", "iq", "Filadelfia"),
  f(6, 22, "20:00", "I", "no", "sn", "Nueva York NJ"),
  f(6, 22, "23:00", "J", "jo", "dz", "Bahía de SF"),
  // Mar 23 jun
  f(6, 23, "13:00", "K", "pt", "uz", "Houston"),
  f(6, 23, "16:00", "L", "gb-eng", "gh", "Boston"),
  f(6, 23, "19:00", "L", "pa", "hr", "Toronto"),
  f(6, 23, "22:00", "K", "co", "cd", "Guadalajara"),
  // Mié 24 jun
  f(6, 24, "15:00", "B", "ch", "ca", "Vancouver"),
  f(6, 24, "15:00", "B", "ba", "qa", "Seattle"),
  f(6, 24, "18:00", "C", "gb-sct", "br", "Miami"),
  f(6, 24, "18:00", "C", "ma", "ht", "Atlanta"),
  f(6, 24, "21:00", "A", "cz", "mx", "Ciudad de México"),
  f(6, 24, "21:00", "A", "za", "kr", "Monterrey"),
  // Jue 25 jun
  f(6, 25, "16:00", "E", "cw", "ci", "Filadelfia"),
  f(6, 25, "16:00", "E", "ec", "de", "Nueva York NJ"),
  f(6, 25, "19:00", "F", "jp", "se", "Dallas"),
  f(6, 25, "19:00", "F", "tn", "nl", "Kansas City"),
  f(6, 25, "22:00", "D", "tr", "us", "Los Ángeles"),
  f(6, 25, "22:00", "D", "py", "au", "Bahía de SF"),
  // Vie 26 jun
  f(6, 26, "15:00", "I", "no", "fr", "Boston"),
  f(6, 26, "15:00", "I", "sn", "iq", "Toronto"),
  f(6, 26, "20:00", "H", "cv", "sa", "Houston"),
  f(6, 26, "20:00", "H", "uy", "es", "Guadalajara"),
  f(6, 26, "23:00", "G", "eg", "ir", "Seattle"),
  f(6, 26, "23:00", "G", "nz", "be", "Vancouver"),
  // Sáb 27 jun
  f(6, 27, "17:00", "L", "pa", "gb-eng", "Nueva York NJ"),
  f(6, 27, "17:00", "L", "hr", "gh", "Filadelfia"),
  f(6, 27, "19:30", "K", "co", "pt", "Miami"),
  f(6, 27, "19:30", "K", "cd", "uz", "Atlanta"),
  f(6, 27, "22:00", "J", "dz", "at", "Kansas City"),
  f(6, 27, "22:00", "J", "jo", "ar", "Dallas"),
];

export const FIXTURE_BY_ID: Record<string, Fixture> = Object.fromEntries(
  GROUP_FIXTURES.map((x) => [x.id, x])
);

// Fechas de la fase eliminatoria, mapeadas a los IDs del cuadro de la app
// (r0 = 16avos, r1 = octavos, r2 = cuartos, r3 = semis, r4 = final).
function k(mon: number, day: number): number {
  return Date.UTC(2026, mon - 1, day, 19, 0); // ~15:00 ET
}

export const KNOCKOUT_KICKOFFS: Record<string, number> = {
  // 16avos (28 jun - 3 jul)
  "r0-0": k(6, 29), "r0-1": k(6, 30), "r0-2": k(6, 28), "r0-3": k(6, 29),
  "r0-4": k(7, 2), "r0-5": k(7, 2), "r0-6": k(7, 1), "r0-7": k(7, 1),
  "r0-8": k(6, 29), "r0-9": k(6, 30), "r0-10": k(6, 30), "r0-11": k(7, 1),
  "r0-12": k(7, 3), "r0-13": k(7, 3), "r0-14": k(7, 2), "r0-15": k(7, 3),
  // Octavos (4-7 jul)
  "r1-0": k(7, 4), "r1-1": k(7, 4), "r1-2": k(7, 6), "r1-3": k(7, 6),
  "r1-4": k(7, 5), "r1-5": k(7, 5), "r1-6": k(7, 7), "r1-7": k(7, 7),
  // Cuartos (9-11 jul)
  "r2-0": k(7, 9), "r2-1": k(7, 10), "r2-2": k(7, 11), "r2-3": k(7, 11),
  // Semis (14-15 jul)
  "r3-0": k(7, 14), "r3-1": k(7, 15),
  // Final (19 jul)
  "r4-0": k(7, 19),
};

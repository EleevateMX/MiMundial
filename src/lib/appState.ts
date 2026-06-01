"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buildRounds,
  champion,
  userScore,
  ROUND_POINTS,
  roundOf,
} from "@/lib/bracket";
import { unlockedSet, type AchievementCtx } from "@/lib/achievements";
import { getKickoffs, earlyBonus } from "@/lib/schedule";
import { randomCode } from "@/data/social";
import { levelFromXp } from "@/lib/levels";
import {
  loadResults,
  pickStatuses,
  earnedScore,
  hasAnyResult,
  RESULTS_KEY,
  type Results,
} from "@/lib/results";

const KEY = "mimundial:v1";

export type League = { name: string; code: string; owner: boolean };
export type DailyPick = {
  winner: string;
  gf: number | null;
  gc: number | null;
  bonus: number;
};

export type AppState = {
  name: string;
  favorite: string | null;
  picks: Record<string, string>;
  mult: Record<string, number>;
  daily: Record<string, DailyPick>;
  streakCount: number;
  lastCheckIn: string | null;
  shared: boolean;
  soundOn: boolean;
  leagues: League[];
  duels: string[];
};

const DEFAULT: AppState = {
  name: "Invitado",
  favorite: null,
  picks: {},
  mult: {},
  daily: {},
  streakCount: 0,
  lastCheckIn: null,
  shared: false,
  soundOn: true,
  leagues: [],
  duels: [],
};

function todayStr(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}
function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
}

export function useAppState() {
  const [state, setState] = useState<AppState>(DEFAULT);
  const [loaded, setLoaded] = useState(false);
  const [base] = useState(() => Date.now());
  const [results, setResults] = useState<Results>({});

  // Cargar estado + resultados oficiales
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...DEFAULT, ...JSON.parse(raw) });
    } catch {}
    setResults(loadResults());
    setLoaded(true);
  }, []);

  // Escuchar cambios de resultados (admin en otra pestaña)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === RESULTS_KEY || e.key === null) setResults(loadResults());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Persistir
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state, loaded]);

  const kickoffs = useMemo(() => getKickoffs(base), [base]);

  // ----- Acciones -----
  const setName = useCallback(
    (name: string) => setState((s) => ({ ...s, name: name.slice(0, 24) || "Invitado" })),
    []
  );
  const setFavorite = useCallback(
    (code: string | null) => setState((s) => ({ ...s, favorite: code })),
    []
  );
  const pickWinner = useCallback((matchId: string, code: string) => {
    setState((s) => {
      const picks = { ...s.picks };
      if (picks[matchId] === code) delete picks[matchId];
      else picks[matchId] = code;
      return { ...s, picks };
    });
  }, []);
  const setMult = useCallback((matchId: string, n: number) => {
    setState((s) => ({ ...s, mult: { ...s.mult, [matchId]: n } }));
  }, []);

  const setDailyWinner = useCallback(
    (matchId: string, code: string) => {
      setState((s) => {
        const prev = s.daily[matchId];
        if (prev?.winner === code) {
          const daily = { ...s.daily };
          delete daily[matchId];
          return { ...s, daily };
        }
        const bonus = earlyBonus(kickoffs[matchId], base);
        return {
          ...s,
          daily: {
            ...s.daily,
            [matchId]: {
              winner: code,
              gf: prev?.gf ?? null,
              gc: prev?.gc ?? null,
              bonus,
            },
          },
        };
      });
    },
    [kickoffs, base]
  );
  const setDailyScore = useCallback(
    (matchId: string, gf: number | null, gc: number | null) => {
      setState((s) => {
        const prev = s.daily[matchId];
        if (!prev) return s;
        return { ...s, daily: { ...s.daily, [matchId]: { ...prev, gf, gc } } };
      });
    },
    []
  );

  const checkIn = useCallback(() => {
    setState((s) => {
      const today = todayStr();
      if (s.lastCheckIn === today) return s;
      const diff = s.lastCheckIn ? daysBetween(s.lastCheckIn, today) : null;
      const streakCount = diff === 1 ? s.streakCount + 1 : 1;
      return { ...s, lastCheckIn: today, streakCount };
    });
  }, []);

  const createLeague = useCallback((name: string) => {
    const code = randomCode();
    setState((s) => ({
      ...s,
      leagues: [...s.leagues, { name, code, owner: true }],
    }));
    return code;
  }, []);
  const joinLeague = useCallback((code: string) => {
    setState((s) => {
      const up = code.toUpperCase();
      if (s.leagues.some((l) => l.code === up)) return s;
      return {
        ...s,
        leagues: [...s.leagues, { name: "Liga " + up, code: up, owner: false }],
      };
    });
  }, []);
  const challenge = useCallback((rivalId: string) => {
    setState((s) =>
      s.duels.includes(rivalId) ? s : { ...s, duels: [...s.duels, rivalId] }
    );
  }, []);
  const markShared = useCallback(
    () => setState((s) => (s.shared ? s : { ...s, shared: true })),
    []
  );
  const toggleSound = useCallback(
    () => setState((s) => ({ ...s, soundOn: !s.soundOn })),
    []
  );

  // ----- Derivados -----
  const rounds = useMemo(() => buildRounds(state.picks), [state.picks]);
  const champ = champion(rounds);

  const statuses = useMemo(
    () => pickStatuses(state.picks, results),
    [state.picks, results]
  );
  const hits = useMemo(
    () => Object.values(statuses).filter((s) => s === "hit").length,
    [statuses]
  );

  const resultsActive = hasAnyResult(results);
  const earned = useMemo(
    () => earnedScore(state.picks, state.mult, results),
    [state.picks, state.mult, results]
  );
  const potential = useMemo(
    () => userScore(state.picks, state.mult),
    [state.picks, state.mult]
  );
  // En juego: picks en rondas aún no resueltas
  const pending = useMemo(() => {
    return Object.entries(statuses).reduce((sum, [id, st]) => {
      if (st !== "pending") return sum;
      return sum + (ROUND_POINTS[roundOf(id)] ?? 0) * (state.mult[id] ?? 1);
    }, 0);
  }, [statuses, state.mult]);

  const dailyPoints = useMemo(
    () =>
      Object.values(state.daily).reduce((sum, d) => sum + 30 + (d.bonus ?? 0), 0),
    [state.daily]
  );
  const maxEarlyBonus = useMemo(
    () => Object.values(state.daily).reduce((m, d) => Math.max(m, d.bonus ?? 0), 0),
    [state.daily]
  );

  const streakBonus = state.streakCount * 25;
  // XP / puntaje total: aciertos del cuadro + racha + quinielas del día
  const bracketScore = resultsActive ? earned : potential;
  const totalScore = bracketScore + streakBonus + dailyPoints;
  const level = useMemo(() => levelFromXp(totalScore), [totalScore]);

  const checkedInToday = state.lastCheckIn === todayStr();
  const made = Object.keys(state.picks).length;
  const dailyCount = Object.keys(state.daily).length;

  const achCtx: AchievementCtx = {
    picks: state.picks,
    mult: state.mult,
    champ,
    favorite: state.favorite,
    streakCount: state.streakCount,
    leagues: state.leagues.length,
    duels: state.duels.length,
    shared: state.shared,
    dailyCount,
    maxEarlyBonus,
    hits,
  };
  const unlocked = useMemo(
    () => unlockedSet(achCtx),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      state.picks,
      state.mult,
      champ,
      state.favorite,
      state.streakCount,
      state.leagues.length,
      state.duels.length,
      state.shared,
      dailyCount,
      maxEarlyBonus,
      hits,
    ]
  );

  return {
    state,
    loaded,
    now: base,
    kickoffs,
    results,
    setResults,
    // acciones
    setName,
    setFavorite,
    pickWinner,
    setMult,
    setDailyWinner,
    setDailyScore,
    checkIn,
    createLeague,
    joinLeague,
    challenge,
    markShared,
    toggleSound,
    // derivados
    rounds,
    champ,
    statuses,
    hits,
    resultsActive,
    earned,
    potential,
    pending,
    dailyPoints,
    streakBonus,
    totalScore,
    level,
    checkedInToday,
    made,
    dailyCount,
    unlocked,
  };
}

export type AppApi = ReturnType<typeof useAppState>;

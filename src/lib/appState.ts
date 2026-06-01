"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { buildRounds, champion, userScore } from "@/lib/bracket";
import { unlockedSet, type AchievementCtx } from "@/lib/achievements";
import { getKickoffs } from "@/lib/schedule";
import { randomCode } from "@/data/social";

const KEY = "mimundial:v1";

export type League = { name: string; code: string; owner: boolean };

export type AppState = {
  favorite: string | null;
  picks: Record<string, string>;
  mult: Record<string, number>;
  streakCount: number;
  lastCheckIn: string | null; // YYYY-MM-DD
  shared: boolean;
  leagues: League[];
  duels: string[]; // ids de rivales retados
};

const DEFAULT: AppState = {
  favorite: null,
  picks: {},
  mult: {},
  streakCount: 0,
  lastCheckIn: null,
  shared: false,
  leagues: [],
  duels: [],
};

function todayStr(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}
function daysBetween(a: string, b: string): number {
  return Math.round(
    (Date.parse(b) - Date.parse(a)) / (24 * 60 * 60 * 1000)
  );
}

export function useAppState() {
  const [state, setState] = useState<AppState>(DEFAULT);
  const [loaded, setLoaded] = useState(false);
  // Base de tiempo estable para la sesión (cuenta regresiva de partidos)
  const [base] = useState(() => Date.now());

  // Cargar de localStorage al montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...DEFAULT, ...JSON.parse(raw) });
    } catch {}
    setLoaded(true);
  }, []);

  // Persistir cambios
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state, loaded]);

  const kickoffs = useMemo(() => getKickoffs(base), [base]);

  // ----- Acciones -----
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

  const checkIn = useCallback(() => {
    setState((s) => {
      const today = todayStr();
      if (s.lastCheckIn === today) return s; // ya hizo check-in hoy
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
      if (s.leagues.some((l) => l.code === code.toUpperCase())) return s;
      return {
        ...s,
        leagues: [
          ...s.leagues,
          { name: "Liga " + code.toUpperCase(), code: code.toUpperCase(), owner: false },
        ],
      };
    });
  }, []);

  const challenge = useCallback((rivalId: string) => {
    setState((s) =>
      s.duels.includes(rivalId)
        ? s
        : { ...s, duels: [...s.duels, rivalId] }
    );
  }, []);

  const markShared = useCallback(
    () => setState((s) => (s.shared ? s : { ...s, shared: true })),
    []
  );

  const reset = useCallback(() => setState(DEFAULT), []);

  // ----- Derivados -----
  const rounds = useMemo(() => buildRounds(state.picks), [state.picks]);
  const champ = champion(rounds);
  const predictionScore = useMemo(
    () => userScore(state.picks, state.mult),
    [state.picks, state.mult]
  );
  const streakBonus = state.streakCount * 25;
  const totalScore = predictionScore + streakBonus;

  const checkedInToday = state.lastCheckIn === todayStr();

  const achCtx: AchievementCtx = {
    picks: state.picks,
    mult: state.mult,
    champ,
    favorite: state.favorite,
    streakCount: state.streakCount,
    leagues: state.leagues.length,
    duels: state.duels.length,
    shared: state.shared,
  };
  const unlocked = useMemo(() => unlockedSet(achCtx), [
    state.picks,
    state.mult,
    champ,
    state.favorite,
    state.streakCount,
    state.leagues.length,
    state.duels.length,
    state.shared,
  ]);

  return {
    state,
    loaded,
    now: base,
    kickoffs,
    // acciones
    setFavorite,
    pickWinner,
    setMult,
    checkIn,
    createLeague,
    joinLeague,
    challenge,
    markShared,
    reset,
    // derivados
    rounds,
    champ,
    predictionScore,
    streakBonus,
    totalScore,
    checkedInToday,
    unlocked,
  };
}

export type AppApi = ReturnType<typeof useAppState>;

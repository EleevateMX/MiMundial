"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useUser } from "@/lib/supabase/useUser";
import { fetchMe, saveMe, fetchResultsRemote } from "@/lib/supabase/data";
import { logActivity } from "@/lib/supabase/feed";
import { TEAM_BY_CODE } from "@/data/teams";

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
  avatar: string;
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
  avatar: "",
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
  const { user } = useUser();
  const cloud = isSupabaseConfigured && !!user;
  const hydratedRemote = useRef(false);
  const feedReady = useRef(false);
  const loggedChamp = useRef<string | null>(null);
  const loggedLevel = useRef(0);

  // Cargar estado + resultados oficiales
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...DEFAULT, ...JSON.parse(raw) });
    } catch {}
    setResults(loadResults());
    setLoaded(true);
  }, []);

  // Escuchar cambios de resultados (admin en otra pestaña, modo demo)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === RESULTS_KEY || e.key === null) setResults(loadResults());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Nube: al iniciar sesión, traer el cuadro del usuario y los resultados oficiales
  useEffect(() => {
    if (!cloud || !user) return;
    let active = true;
    (async () => {
      const remote = await fetchMe(user.id);
      if (!active) return;
      // Adoptamos el remoto si tiene contenido; si no, conservamos lo local
      // (se subirá en el próximo guardado, migrando el progreso de invitado).
      const hasContent =
        remote &&
        (Object.keys(remote.picks).length > 0 ||
          !!remote.favorite ||
          remote.streakCount > 0);
      if (remote && hasContent) {
        setState((s) => ({
          ...s,
          name: remote.name || s.name,
          avatar: remote.avatar || s.avatar,
          favorite: remote.favorite ?? s.favorite,
          picks: remote.picks,
          mult: remote.mult,
          daily: (remote.daily as AppState["daily"]) ?? {},
          streakCount: remote.streakCount,
          lastCheckIn: remote.lastCheckIn,
        }));
      } else if (remote?.name) {
        setState((s) => ({
          ...s,
          name: s.name === "Invitado" ? remote.name : s.name,
        }));
      }
      const rr = await fetchResultsRemote();
      if (active && rr) setResults(rr);
      hydratedRemote.current = true;
    })();
    return () => {
      active = false;
    };
  }, [cloud, user]);

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
  const setAvatar = useCallback(
    (avatar: string) => setState((s) => ({ ...s, avatar })),
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
    (matchId: string, code: string, kickoff: number) => {
      setState((s) => {
        const prev = s.daily[matchId];
        if (prev?.winner === code) {
          const daily = { ...s.daily };
          delete daily[matchId];
          return { ...s, daily };
        }
        const bonus = earlyBonus(kickoff, base);
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
    [base]
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

  // Nube: guardar cambios del usuario (con pequeño debounce)
  useEffect(() => {
    if (!cloud || !user || !loaded || !hydratedRemote.current) return;
    const t = setTimeout(() => {
      saveMe(user.id, {
        name: state.name,
        avatar: state.avatar,
        favorite: state.favorite,
        picks: state.picks,
        mult: state.mult,
        daily: state.daily,
        streakCount: state.streakCount,
        lastCheckIn: state.lastCheckIn,
        score: totalScore,
        level: level.level,
      });
    }, 800);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, totalScore, level.level, cloud, user, loaded]);

  // Feed global: registra hitos (campeón, subir de nivel)
  useEffect(() => {
    if (!cloud || !user || !hydratedRemote.current) return;
    if (!feedReady.current) {
      // baseline: no registrar el estado previo al entrar
      feedReady.current = true;
      loggedChamp.current = champ;
      loggedLevel.current = level.level;
      return;
    }
    if (champ && champ !== loggedChamp.current) {
      loggedChamp.current = champ;
      logActivity({
        userId: user.id,
        name: state.name,
        favorite: state.favorite,
        avatar: state.avatar,
        text: `coronó a ${TEAM_BY_CODE[champ]?.name ?? "su campeón"} campeón 🏆`,
      });
    }
    if (level.level > loggedLevel.current) {
      loggedLevel.current = level.level;
      logActivity({
        userId: user.id,
        name: state.name,
        favorite: state.favorite,
        avatar: state.avatar,
        text: `subió a Nivel ${level.level} · ${level.label} ⭐`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [champ, level.level, cloud, user]);

  return {
    state,
    loaded,
    now: base,
    user,
    cloud,
    kickoffs,
    results,
    setResults,
    // acciones
    setName,
    setAvatar,
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

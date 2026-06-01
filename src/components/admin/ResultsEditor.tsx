"use client";

import { useEffect, useState } from "react";
import { buildRounds } from "@/lib/bracket";
import { loadResults, saveResults, type Results } from "@/lib/results";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { fetchResultsRemote, saveResultsRemote } from "@/lib/supabase/data";
import { TEAM_BY_CODE } from "@/data/teams";
import Flag from "@/components/Flag";

export default function ResultsEditor() {
  const [results, setResults] = useState<Results>({});

  useEffect(() => {
    if (isSupabaseConfigured) {
      fetchResultsRemote().then((r) => setResults(r ?? {}));
    } else {
      setResults(loadResults());
    }
  }, []);

  function persist(next: Results) {
    if (isSupabaseConfigured) saveResultsRemote(next);
    else saveResults(next);
  }

  function setWinner(matchId: string, code: string) {
    setResults((prev) => {
      const next = { ...prev };
      if (next[matchId] === code) delete next[matchId];
      else next[matchId] = code;
      persist(next);
      return next;
    });
  }

  function clearAll() {
    setResults({});
    persist({});
  }

  const rounds = buildRounds(results);
  const decided = Object.keys(results).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-white/55">
          Marca al ganador real de cada partido. Los puntos de todos los usuarios
          se calculan automáticamente.
        </p>
        <button
          onClick={clearAll}
          className="shrink-0 text-xs rounded-lg border border-hot/40 bg-hot/10 text-hot px-3 py-1.5 hover:bg-hot/20 transition"
        >
          Limpiar ({decided})
        </button>
      </div>

      <div className="bracket-scroll overflow-x-auto pb-3">
        <div className="flex gap-3 min-w-max">
          {rounds.map((r) => (
            <div key={r.round} className="flex flex-col justify-around min-w-[190px]">
              <div className="text-center mb-2 font-display text-xs uppercase tracking-wider text-white/55">
                {r.name}
              </div>
              <div className="flex flex-col justify-around flex-1 gap-2">
                {r.matches.map((m) => (
                  <div key={m.id} className="glass rounded-lg p-1 space-y-1">
                    {[m.a, m.b].map((code, i) =>
                      code ? (
                        <button
                          key={code}
                          onClick={() => setWinner(m.id, code)}
                          className={`w-full flex items-center gap-2 px-2 py-1 rounded text-xs transition ${
                            m.winner === code
                              ? "bg-neon/20 text-neon font-semibold"
                              : m.winner
                              ? "opacity-40"
                              : "hover:bg-white/10"
                          }`}
                        >
                          <Flag code={code} className="w-5 h-3.5 shrink-0" />
                          <span className="flex-1 text-left truncate">
                            {TEAM_BY_CODE[code]?.name}
                          </span>
                          {m.winner === code && <span>✓</span>}
                        </button>
                      ) : (
                        <div
                          key={i}
                          className="flex items-center gap-2 px-2 py-1 text-xs text-white/25"
                        >
                          <div className="w-5 h-3.5 rounded bg-white/5" />
                          Por definir
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

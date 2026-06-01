"use client";

import { useCallback, useEffect, useState } from "react";
import { SAMPLE_LEAGUE_MEMBERS } from "@/data/social";
import type { League } from "@/lib/appState";
import {
  fetchMyLeagues,
  createLeagueRemote,
  joinLeagueRemote,
  type RemoteLeague,
} from "@/lib/supabase/data";
import Flag from "@/components/Flag";
import LeagueChat from "@/components/LeagueChat";

type DisplayLeague = {
  id: string | null;
  code: string;
  name: string;
  owner: boolean;
  rows: { name: string; favorite: string | null; score: number; you: boolean }[];
};

export default function LeaguesView({
  leagues,
  score,
  favorite,
  myName,
  userId,
  onCreate,
  onJoin,
}: {
  leagues: League[];
  score: number;
  favorite: string | null;
  myName: string;
  userId: string | null;
  onCreate: (name: string) => string;
  onJoin: (code: string) => void;
}) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [remote, setRemote] = useState<RemoteLeague[] | null>(null);
  const [chat, setChat] = useState<DisplayLeague | null>(null);

  const refresh = useCallback(() => {
    if (userId) fetchMyLeagues(userId).then(setRemote);
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Construir lista a mostrar (real o demo)
  const display: DisplayLeague[] =
    userId && remote
      ? remote.map((l) => ({
          id: l.id,
          code: l.code,
          name: l.name,
          owner: l.owner,
          rows: l.members
            .map((m) => ({ ...m, you: m.name === myName }))
            .sort((a, b) => b.score - a.score),
        }))
      : leagues.map((l) => ({
          id: null,
          code: l.code,
          name: l.name,
          owner: l.owner,
          rows: [
            ...SAMPLE_LEAGUE_MEMBERS.map((m) => ({
              name: m.name,
              favorite: m.flag,
              score: m.pts,
              you: false,
            })),
            { name: myName, favorite, score, you: true },
          ].sort((a, b) => b.score - a.score),
        }));

  async function handleCreate() {
    if (!name.trim()) return;
    if (userId) {
      await createLeagueRemote(name.trim(), userId);
      refresh();
    } else {
      onCreate(name.trim());
    }
    setName("");
  }
  async function handleJoin() {
    if (code.length !== 6) return;
    if (userId) {
      await joinLeagueRemote(code, userId);
      refresh();
    } else {
      onJoin(code);
    }
    setCode("");
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <div className="font-display text-xl text-gold-gradient">CREA TU LIGA</div>
          <p className="text-sm text-white/55 mt-1">
            Invita a tu banda con un código y compitan en privado.
          </p>
          <div className="flex gap-2 mt-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. La Liga de la Oficina"
              className="flex-1 rounded-xl bg-black/30 border border-white/10 px-3 py-2.5 outline-none focus:border-gold/60 placeholder:text-white/25"
            />
            <button
              onClick={handleCreate}
              className="rounded-xl bg-gold text-black font-bold px-4 hover:brightness-110 transition"
            >
              Crear
            </button>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="font-display text-xl text-gold-gradient">ÚNETE CON CÓDIGO</div>
          <p className="text-sm text-white/55 mt-1">
            ¿Te invitaron? Escribe el código de 6 caracteres.
          </p>
          <div className="flex gap-2 mt-4">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
              placeholder="ABC123"
              className="flex-1 rounded-xl bg-black/30 border border-white/10 px-3 py-2.5 outline-none focus:border-neon/60 tracking-[0.3em] font-mono placeholder:text-white/25"
            />
            <button
              onClick={handleJoin}
              className="rounded-xl bg-neon text-black font-bold px-4 hover:brightness-110 transition"
            >
              Unirme
            </button>
          </div>
        </div>
      </div>

      {display.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center text-white/45">
          Aún no estás en ninguna liga. ¡Crea una o únete con un código! 👆
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {display.map((l) => (
            <LeagueCard key={l.code} league={l} onChat={() => setChat(l)} />
          ))}
        </div>
      )}

      {chat && (
        <LeagueChat
          leagueId={chat.id}
          leagueName={chat.name}
          me={{ userId, name: myName, favorite }}
          cloud={!!userId}
          onClose={() => setChat(null)}
        />
      )}
    </div>
  );
}

function LeagueCard({ league, onChat }: { league: DisplayLeague; onChat: () => void }) {
  const [copied, setCopied] = useState(false);
  const rows = league.rows.map((r, i) => ({ ...r, rank: i + 1 }));

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="font-display text-lg text-gold truncate">{league.name}</div>
          <div className="text-[10px] uppercase tracking-wider text-white/40">
            {league.owner ? "Eres el admin" : "Miembro"} · {rows.length} jugadores
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onChat}
            title="Abrir chat"
            className="rounded-lg border border-neon/40 bg-neon/10 text-neon px-3 py-1.5 text-sm font-semibold hover:bg-neon/20 transition"
          >
            💬 Chat
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(league.code).catch(() => {});
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="rounded-lg border border-gold/40 bg-gold/10 px-3 py-1.5 text-right hover:bg-gold/20 transition"
          >
            <div className="text-[9px] uppercase tracking-wider text-white/45">
              {copied ? "¡Copiado!" : "Código"}
            </div>
            <div className="font-mono font-bold tracking-[0.2em] text-gold">{league.code}</div>
          </button>
        </div>
      </div>
      <ul className="divide-y divide-white/5">
        {rows.map((r) => (
          <li
            key={`${r.rank}-${r.name}`}
            className={`flex items-center gap-3 px-4 py-2.5 ${r.you ? "bg-gold/10" : ""}`}
          >
            <span
              className={`w-6 text-center font-display ${
                r.rank === 1 ? "text-gold" : r.you ? "text-neon" : "text-white/40"
              }`}
            >
              {r.rank}
            </span>
            <Flag code={r.favorite ?? "mx"} className="w-6 h-4" />
            <span className={`flex-1 text-sm ${r.you ? "text-gold font-bold" : ""}`}>
              {r.name}
            </span>
            <span className="font-display tabular-nums text-sm text-white/80">{r.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

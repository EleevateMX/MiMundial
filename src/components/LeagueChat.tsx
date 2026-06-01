"use client";

import { useEffect, useRef, useState } from "react";
import Avatar, { avatarSeedFor } from "@/components/Avatar";
import {
  fetchMessages,
  sendMessage,
  subscribeMessages,
  fetchReactions,
  setReaction,
  subscribeReactions,
  type ChatMessage,
} from "@/lib/supabase/chat";
import { notifyLeague } from "@/lib/supabase/push";

const DEMO_SEED: Omit<ChatMessage, "league_id">[] = [
  { id: "d1", user_id: "u1", name: "Regina_07", favorite: "mx", avatar: "capitan", body: "¿Quién va a su selección a la final? 👀", created_at: "" },
  { id: "d2", user_id: "u2", name: "kevoo", favorite: "br", avatar: "fenomeno", body: "Brasil campeón, ni lo duden 🇧🇷🏆", created_at: "" },
  { id: "d3", user_id: "u3", name: "DonPepe", favorite: "es", avatar: "muralla", body: "Jajaja ya veremos en cuartos 😏", created_at: "" },
];

const REACTIONS = ["🔥", "👏", "😂", "⚽"];

export default function LeagueChat({
  leagueId,
  leagueName,
  me,
  cloud,
  onClose,
}: {
  leagueId: string | null;
  leagueName: string;
  me: { userId: string | null; name: string; favorite: string | null; avatar: string };
  cloud: boolean;
  onClose: () => void;
}) {
  const isLive = cloud && !!leagueId && !!me.userId;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  // Reacciones locales: { [msgId]: { '🔥': count, ... } } y la mía
  const [reactions, setReactions] = useState<Record<string, Record<string, number>>>({});
  const [mine, setMine] = useState<Record<string, string>>({});
  const [pickerFor, setPickerFor] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  async function loadReactions(lid: string) {
    const rows = await fetchReactions(lid);
    const counts: Record<string, Record<string, number>> = {};
    const my: Record<string, string> = {};
    rows.forEach((r) => {
      const k = String(r.message_id);
      counts[k] = counts[k] ?? {};
      counts[k][r.emoji] = (counts[k][r.emoji] ?? 0) + 1;
      if (me.userId && r.user_id === me.userId) my[k] = r.emoji;
    });
    setReactions(counts);
    setMine(my);
  }

  useEffect(() => {
    if (isLive && leagueId) {
      fetchMessages(leagueId).then(setMessages);
      loadReactions(leagueId);
      const unsubM = subscribeMessages(leagueId, (m) =>
        setMessages((list) => (list.some((x) => x.id === m.id) ? list : [...list, m]))
      );
      const unsubR = subscribeReactions(leagueId, () => loadReactions(leagueId));
      return () => {
        unsubM();
        unsubR();
      };
    }
    setMessages(DEMO_SEED.map((m) => ({ ...m, league_id: "demo" })));
    setReactions({ d2: { "🔥": 2 }, d3: { "😂": 1 } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLive, leagueId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  async function send() {
    const body = text.trim();
    if (!body) return;
    setText("");
    if (isLive && leagueId && me.userId) {
      await sendMessage({
        leagueId,
        userId: me.userId,
        name: me.name,
        favorite: me.favorite,
        avatar: me.avatar,
        body,
      });
      notifyLeague(leagueId, `${me.name} · ${leagueName}`, body, me.userId);
    } else {
      setMessages((list) => [
        ...list,
        {
          id: `local-${Date.now()}`,
          league_id: "demo",
          user_id: "me",
          name: me.name,
          favorite: me.favorite,
          avatar: me.avatar,
          body,
          created_at: new Date().toISOString(),
        },
      ]);
    }
  }

  function react(msgId: string, emoji: string) {
    if (isLive && leagueId && me.userId) {
      const remove = mine[msgId] === emoji;
      setReaction(msgId, leagueId, me.userId, emoji, remove);
    }
    setReactions((r) => {
      const cur = { ...(r[msgId] ?? {}) };
      const prev = mine[msgId];
      if (prev === emoji) {
        cur[emoji] = Math.max(0, (cur[emoji] ?? 1) - 1);
        if (cur[emoji] === 0) delete cur[emoji];
      } else {
        if (prev) {
          cur[prev] = Math.max(0, (cur[prev] ?? 1) - 1);
          if (cur[prev] === 0) delete cur[prev];
        }
        cur[emoji] = (cur[emoji] ?? 0) + 1;
      }
      return { ...r, [msgId]: cur };
    });
    setMine((m) => ({ ...m, [msgId]: m[msgId] === emoji ? "" : emoji }));
    setPickerFor(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full sm:max-w-md bg-[#0a0e1c] border-l border-white/10 flex flex-col h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-white/10 glass">
          <div className="min-w-0">
            <div className="font-display text-lg text-gold truncate">{leagueName}</div>
            <div className="text-[10px] uppercase tracking-wider text-neon/80">
              {isLive ? "Chat en vivo" : "Chat (demo)"}
            </div>
          </div>
          <button onClick={onClose} className="size-8 rounded-full bg-white/5 hover:bg-white/10 grid place-items-center">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center text-white/40 text-sm mt-10">Sé el primero en escribir 👋</div>
          )}
          {messages.map((m) => {
            const mineMsg = isLive ? m.user_id === me.userId : m.user_id === "me";
            const idStr = String(m.id);
            const reacts = reactions[idStr] ?? {};
            const seed = avatarSeedFor(m.avatar, m.name);
            return (
              <div key={m.id} className={`flex gap-2 ${mineMsg ? "flex-row-reverse" : "flex-row"}`}>
                <Avatar seed={seed} flag={m.favorite} className="size-8 rounded-full shrink-0 self-end" />
                <div className={`max-w-[72%] flex flex-col ${mineMsg ? "items-end" : "items-start"}`}>
                  {!mineMsg && (
                    <span className="text-[11px] text-white/50 mb-0.5 px-1">{m.name}</span>
                  )}
                  <div className="relative group">
                    <div
                      onDoubleClick={() => react(idStr, "🔥")}
                      className={`rounded-2xl px-3 py-2 text-sm ${
                        mineMsg ? "bg-gold text-black rounded-br-sm" : "bg-white/8 text-white rounded-bl-sm"
                      }`}
                    >
                      {m.body}
                    </div>
                    <button
                      onClick={() => setPickerFor(pickerFor === idStr ? null : idStr)}
                      className={`absolute -bottom-2 ${mineMsg ? "left-0" : "right-0"} text-white/40 hover:text-gold text-xs`}
                    >
                      ☺
                    </button>
                    {pickerFor === idStr && (
                      <div className={`absolute z-10 -top-9 ${mineMsg ? "right-0" : "left-0"} flex gap-1 glass rounded-full px-2 py-1`}>
                        {REACTIONS.map((e) => (
                          <button key={e} onClick={() => react(idStr, e)} className="hover:scale-125 transition text-base leading-none">
                            {e}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Reacciones */}
                  {Object.keys(reacts).length > 0 && (
                    <div className={`flex gap-1 mt-1 ${mineMsg ? "flex-row-reverse" : ""}`}>
                      {Object.entries(reacts).map(([e, n]) => (
                        <button
                          key={e}
                          onClick={() => react(idStr, e)}
                          className={`text-[11px] rounded-full px-1.5 py-0.5 border ${
                            mine[idStr] === e ? "border-gold bg-gold/15" : "border-white/10 bg-white/5"
                          }`}
                        >
                          {e} {n}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        {!cloud ? (
          <div className="p-3 border-t border-white/10 text-center text-[11px] text-white/45">
            Inicia sesión para chatear de verdad con tu liga.
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="p-3 border-t border-white/10 flex gap-2"
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={500}
              placeholder="Escribe un mensaje…"
              className="flex-1 rounded-full bg-black/30 border border-white/10 px-4 py-2.5 outline-none focus:border-gold/60 text-sm"
            />
            <button type="submit" className="size-11 rounded-full bg-gold text-black font-bold grid place-items-center hover:brightness-110 transition">
              ➤
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

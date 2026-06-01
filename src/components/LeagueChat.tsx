"use client";

import { useEffect, useRef, useState } from "react";
import Flag from "@/components/Flag";
import {
  fetchMessages,
  sendMessage,
  subscribeMessages,
  type ChatMessage,
} from "@/lib/supabase/chat";

const DEMO_SEED: Omit<ChatMessage, "league_id">[] = [
  { id: "d1", user_id: "u1", name: "Regina_07", favorite: "mx", body: "¿Quién va a su selección a la final? 👀", created_at: "" },
  { id: "d2", user_id: "u2", name: "kevoo", favorite: "br", body: "Brasil campeón, ni lo duden 🇧🇷🏆", created_at: "" },
  { id: "d3", user_id: "u3", name: "DonPepe", favorite: "es", body: "Jajaja ya veremos en cuartos 😏", created_at: "" },
];

export default function LeagueChat({
  leagueId,
  leagueName,
  me,
  cloud,
  onClose,
}: {
  leagueId: string | null;
  leagueName: string;
  me: { userId: string | null; name: string; favorite: string | null };
  cloud: boolean;
  onClose: () => void;
}) {
  const isLive = cloud && !!leagueId && !!me.userId;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLive && leagueId) {
      fetchMessages(leagueId).then(setMessages);
      const unsub = subscribeMessages(leagueId, (m) =>
        setMessages((list) => (list.some((x) => x.id === m.id) ? list : [...list, m]))
      );
      return unsub;
    }
    // Demo
    setMessages(DEMO_SEED.map((m) => ({ ...m, league_id: "demo" })));
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
        body,
      });
    } else {
      setMessages((list) => [
        ...list,
        {
          id: `local-${Date.now()}`,
          league_id: "demo",
          user_id: "me",
          name: me.name,
          favorite: me.favorite,
          body,
          created_at: new Date().toISOString(),
        },
      ]);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full sm:max-w-md bg-[#0a0e1c] border-l border-white/10 flex flex-col h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
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

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center text-white/40 text-sm mt-10">
              Sé el primero en escribir 👋
            </div>
          )}
          {messages.map((m) => {
            const mine = (isLive ? m.user_id === me.userId : m.user_id === "me");
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[78%] ${mine ? "items-end" : "items-start"} flex flex-col`}>
                  {!mine && (
                    <span className="flex items-center gap-1.5 text-[11px] text-white/50 mb-0.5 px-1">
                      {m.favorite && <Flag code={m.favorite} className="w-4 h-3" />}
                      {m.name}
                    </span>
                  )}
                  <div
                    className={`rounded-2xl px-3 py-2 text-sm ${
                      mine
                        ? "bg-gold text-black rounded-br-sm"
                        : "bg-white/8 text-white rounded-bl-sm"
                    }`}
                  >
                    {m.body}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        {/* Input */}
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
            <button
              type="submit"
              className="size-11 rounded-full bg-gold text-black font-bold grid place-items-center hover:brightness-110 transition"
            >
              ➤
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

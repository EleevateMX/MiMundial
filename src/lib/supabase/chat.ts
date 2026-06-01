"use client";

import { getSupabaseBrowser } from "./client";

export type ChatMessage = {
  id: number | string;
  league_id: string;
  user_id: string;
  name: string;
  favorite: string | null;
  body: string;
  created_at: string;
};

export async function fetchMessages(
  leagueId: string,
  limit = 60
): Promise<ChatMessage[]> {
  const sb = getSupabaseBrowser();
  if (!sb) return [];
  const { data } = await sb
    .from("messages")
    .select("*")
    .eq("league_id", leagueId)
    .order("created_at", { ascending: true })
    .limit(limit);
  return (data as ChatMessage[]) ?? [];
}

export async function sendMessage(msg: {
  leagueId: string;
  userId: string;
  name: string;
  favorite: string | null;
  body: string;
}) {
  const sb = getSupabaseBrowser();
  if (!sb) return;
  await sb.from("messages").insert({
    league_id: msg.leagueId,
    user_id: msg.userId,
    name: msg.name,
    favorite: msg.favorite,
    body: msg.body,
  });
}

// Suscripción Realtime a mensajes nuevos de una liga.
export function subscribeMessages(
  leagueId: string,
  onInsert: (m: ChatMessage) => void
): () => void {
  const sb = getSupabaseBrowser();
  if (!sb) return () => {};
  const channel = sb
    .channel(`league:${leagueId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `league_id=eq.${leagueId}`,
      },
      (payload) => onInsert(payload.new as ChatMessage)
    )
    .subscribe();
  return () => {
    sb.removeChannel(channel);
  };
}

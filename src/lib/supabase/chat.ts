"use client";

import { getSupabaseBrowser } from "./client";

export type ChatMessage = {
  id: number | string;
  league_id: string;
  user_id: string;
  name: string;
  favorite: string | null;
  avatar: string | null;
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
  avatar: string | null;
  body: string;
}) {
  const sb = getSupabaseBrowser();
  if (!sb) return;
  await sb.from("messages").insert({
    league_id: msg.leagueId,
    user_id: msg.userId,
    name: msg.name,
    favorite: msg.favorite,
    avatar: msg.avatar,
    body: msg.body,
  });
}

// ---------- Reacciones ----------
export type ReactionRow = { message_id: number; user_id: string; emoji: string };

export async function fetchReactions(leagueId: string): Promise<ReactionRow[]> {
  const sb = getSupabaseBrowser();
  if (!sb) return [];
  const { data } = await sb
    .from("message_reactions")
    .select("message_id, user_id, emoji")
    .eq("league_id", leagueId);
  return (data as ReactionRow[]) ?? [];
}

export async function setReaction(
  messageId: number | string,
  leagueId: string,
  userId: string,
  emoji: string,
  remove: boolean
) {
  const sb = getSupabaseBrowser();
  if (!sb) return;
  if (remove) {
    await sb
      .from("message_reactions")
      .delete()
      .eq("message_id", messageId)
      .eq("user_id", userId);
  } else {
    await sb.from("message_reactions").upsert(
      { message_id: messageId, league_id: leagueId, user_id: userId, emoji },
      { onConflict: "message_id,user_id" }
    );
  }
}

export function subscribeReactions(leagueId: string, onChange: () => void): () => void {
  const sb = getSupabaseBrowser();
  if (!sb) return () => {};
  const channel = sb
    .channel(`react:${leagueId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "message_reactions", filter: `league_id=eq.${leagueId}` },
      () => onChange()
    )
    .subscribe();
  return () => {
    sb.removeChannel(channel);
  };
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

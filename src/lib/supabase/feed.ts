"use client";

import { getSupabaseBrowser } from "./client";

export type FeedItem = {
  id: number;
  name: string;
  favorite: string | null;
  avatar: string | null;
  text: string;
  created_at: string;
};

export async function logActivity(item: {
  userId: string;
  name: string;
  favorite: string | null;
  avatar: string | null;
  text: string;
}) {
  const sb = getSupabaseBrowser();
  if (!sb) return;
  await sb.from("activity").insert({
    user_id: item.userId,
    name: item.name,
    favorite: item.favorite,
    avatar: item.avatar,
    text: item.text,
  });
}

export async function fetchFeed(limit = 20): Promise<FeedItem[]> {
  const sb = getSupabaseBrowser();
  if (!sb) return [];
  const { data } = await sb
    .from("activity")
    .select("id, name, favorite, avatar, text, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as FeedItem[]) ?? [];
}

export function subscribeFeed(onInsert: (i: FeedItem) => void): () => void {
  const sb = getSupabaseBrowser();
  if (!sb) return () => {};
  const channel = sb
    .channel("activity-feed")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "activity" },
      (payload) => onInsert(payload.new as FeedItem)
    )
    .subscribe();
  return () => {
    sb.removeChannel(channel);
  };
}

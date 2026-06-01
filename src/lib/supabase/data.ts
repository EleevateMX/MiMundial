"use client";

import { getSupabaseBrowser } from "./client";
import { randomCode } from "@/data/social";

export type RemoteUserData = {
  name: string;
  avatar: string;
  favorite: string | null;
  role: string;
  picks: Record<string, string>;
  mult: Record<string, number>;
  daily: Record<string, unknown>;
  streakCount: number;
  lastCheckIn: string | null;
};

// ---------- Perfil + cuadro del usuario ----------

export async function fetchMe(userId: string): Promise<RemoteUserData | null> {
  const sb = getSupabaseBrowser();
  if (!sb) return null;
  const [{ data: profile }, { data: bracket }] = await Promise.all([
    sb.from("profiles").select("*").eq("id", userId).maybeSingle(),
    sb.from("brackets").select("*").eq("user_id", userId).maybeSingle(),
  ]);
  if (!profile && !bracket) return null;
  return {
    name: profile?.display_name ?? "Jugador",
    avatar: profile?.avatar ?? "",
    favorite: profile?.favorite ?? null,
    role: profile?.role ?? "user",
    picks: bracket?.picks ?? {},
    mult: bracket?.mult ?? {},
    daily: bracket?.daily ?? {},
    streakCount: profile?.streak ?? 0,
    lastCheckIn: bracket?.last_check_in ?? null,
  };
}

export async function saveMe(
  userId: string,
  data: {
    name: string;
    avatar: string;
    favorite: string | null;
    picks: Record<string, string>;
    mult: Record<string, number>;
    daily: Record<string, unknown>;
    streakCount: number;
    lastCheckIn: string | null;
    score: number;
    level: number;
  }
) {
  const sb = getSupabaseBrowser();
  if (!sb) return;
  await Promise.all([
    sb.from("profiles").upsert({
      id: userId,
      display_name: data.name,
      avatar: data.avatar,
      favorite: data.favorite,
      score: data.score,
      level: data.level,
      streak: data.streakCount,
      last_seen: new Date().toISOString(),
    }),
    sb.from("brackets").upsert({
      user_id: userId,
      picks: data.picks,
      mult: data.mult,
      daily: data.daily,
      last_check_in: data.lastCheckIn,
      updated_at: new Date().toISOString(),
    }),
  ]);
}

// ---------- Resultados oficiales (compartidos) ----------

export async function fetchResultsRemote(): Promise<Record<string, string> | null> {
  const sb = getSupabaseBrowser();
  if (!sb) return null;
  const { data } = await sb.from("results").select("data").eq("id", 1).maybeSingle();
  return (data?.data as Record<string, string>) ?? {};
}

export async function saveResultsRemote(results: Record<string, string>) {
  const sb = getSupabaseBrowser();
  if (!sb) return;
  await sb.from("results").upsert({ id: 1, data: results, updated_at: new Date().toISOString() });
}

// ---------- Ranking global ----------

export type LeaderRow = {
  name: string;
  favorite: string | null;
  score: number;
  level: number;
};

export async function fetchLeaderboard(limit = 50): Promise<LeaderRow[] | null> {
  const sb = getSupabaseBrowser();
  if (!sb) return null;
  const { data } = await sb
    .from("profiles")
    .select("display_name, favorite, score, level")
    .order("score", { ascending: false })
    .limit(limit);
  if (!data) return [];
  return data.map((r) => ({
    name: r.display_name ?? "Jugador",
    favorite: r.favorite,
    score: r.score ?? 0,
    level: r.level ?? 1,
  }));
}

// ---------- Ligas ----------

export type RemoteLeague = {
  id: string;
  code: string;
  name: string;
  owner: boolean;
  members: { name: string; favorite: string | null; score: number }[];
};

export async function createLeagueRemote(
  name: string,
  userId: string
): Promise<string | null> {
  const sb = getSupabaseBrowser();
  if (!sb) return null;
  for (let attempt = 0; attempt < 4; attempt++) {
    const code = randomCode();
    const { data, error } = await sb
      .from("leagues")
      .insert({ name, code, owner: userId })
      .select("id")
      .single();
    if (!error && data) {
      await sb.from("league_members").insert({ league_id: data.id, user_id: userId });
      return code;
    }
  }
  return null;
}

export async function joinLeagueRemote(code: string, userId: string): Promise<boolean> {
  const sb = getSupabaseBrowser();
  if (!sb) return false;
  const { data: league } = await sb
    .from("leagues")
    .select("id")
    .eq("code", code.toUpperCase())
    .maybeSingle();
  if (!league) return false;
  await sb
    .from("league_members")
    .upsert({ league_id: league.id, user_id: userId }, { onConflict: "league_id,user_id" });
  return true;
}

export async function fetchMyLeagues(userId: string): Promise<RemoteLeague[] | null> {
  const sb = getSupabaseBrowser();
  if (!sb) return null;
  const { data: memberships } = await sb
    .from("league_members")
    .select("league_id, leagues(id, code, name, owner)")
    .eq("user_id", userId);
  if (!memberships) return [];

  const out: RemoteLeague[] = [];
  for (const m of memberships) {
    const lg = (m as unknown as {
      leagues: { id: string; code: string; name: string; owner: string };
    }).leagues;
    if (!lg) continue;
    const { data: members } = await sb
      .from("league_members")
      .select("profiles(display_name, favorite, score)")
      .eq("league_id", lg.id);
    out.push({
      id: lg.id,
      code: lg.code,
      name: lg.name,
      owner: lg.owner === userId,
      members: (members ?? [])
        .map(
          (row) =>
            (row as unknown as {
              profiles: { display_name: string; favorite: string | null; score: number };
            }).profiles
        )
        .filter(Boolean)
        .map((p) => ({
          name: p.display_name ?? "Jugador",
          favorite: p.favorite,
          score: p.score ?? 0,
        })),
    });
  }
  return out;
}

// ---------- Admin ----------

export async function fetchIsAdmin(userId: string): Promise<boolean> {
  const sb = getSupabaseBrowser();
  if (!sb) return false;
  const { data } = await sb.from("profiles").select("role").eq("id", userId).maybeSingle();
  return data?.role === "admin";
}

export type AdminStats = Record<string, unknown>;

export async function fetchAdminStats(): Promise<AdminStats | null> {
  const sb = getSupabaseBrowser();
  if (!sb) return null;
  const { data, error } = await sb.rpc("admin_stats");
  if (error) return null;
  return data as AdminStats;
}

// ---------- Anuncios house ----------

export type AdSlot = "footer" | "ranking";
export type AdContent = { image: string; link: string; label: string };

export async function fetchAds(): Promise<Partial<Record<AdSlot, AdContent>> | null> {
  const sb = getSupabaseBrowser();
  if (!sb) return null;
  const { data } = await sb.from("ads").select("slot, image, link, label").eq("active", true);
  if (!data) return {};
  const out: Partial<Record<AdSlot, AdContent>> = {};
  data.forEach((a) => {
    out[a.slot as AdSlot] = { image: a.image, link: a.link, label: a.label };
  });
  return out;
}

export async function saveAd(slot: AdSlot, content: AdContent, active = true) {
  const sb = getSupabaseBrowser();
  if (!sb) return;
  await sb.from("ads").upsert({
    slot,
    image: content.image,
    link: content.link,
    label: content.label,
    active,
    updated_at: new Date().toISOString(),
  });
}

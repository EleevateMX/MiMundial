"use client";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  fetchAds,
  saveAd,
  type AdSlot,
  type AdContent,
} from "@/lib/supabase/data";

const KEY = "mimundial:ads:v1";

export type { AdSlot, AdContent };

// Anuncios "house": en la nube si hay Supabase, si no en localStorage (demo).
export async function getAds(): Promise<Partial<Record<AdSlot, AdContent>>> {
  if (isSupabaseConfigured) {
    return (await fetchAds()) ?? {};
  }
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export async function setAdContent(slot: AdSlot, content: AdContent) {
  if (isSupabaseConfigured) {
    await saveAd(slot, content);
    return;
  }
  const all = await getAds();
  all[slot] = content;
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {}
}

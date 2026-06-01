"use client";

import { getSupabaseBrowser } from "./client";
import { VAPID_PUBLIC_KEY } from "./config";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

export function pushReady(): boolean {
  return (
    typeof window !== "undefined" &&
    !!VAPID_PUBLIC_KEY &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
}

// Suscribe el dispositivo a push y guarda la suscripción en la BD.
export async function subscribeToPush(userId: string): Promise<boolean> {
  if (!pushReady()) return false;
  try {
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      });
    }
    const sb = getSupabaseBrowser();
    if (sb) {
      await sb.from("push_subscriptions").upsert({
        endpoint: sub.endpoint,
        user_id: userId,
        data: sub.toJSON(),
      });
    }
    return true;
  } catch {
    return false;
  }
}

// Pide al backend (Edge Function) que notifique a los miembros de una liga.
export async function notifyLeague(
  leagueId: string,
  title: string,
  body: string,
  excludeUser?: string
) {
  const sb = getSupabaseBrowser();
  if (!sb) return;
  try {
    await sb.functions.invoke("send-push", {
      body: { leagueId, title, body, url: "/jugar", excludeUser },
    });
  } catch {
    /* la app sigue funcionando aunque el push falle */
  }
}

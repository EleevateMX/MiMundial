"use client";

// Notificaciones del navegador. Para envíos reales en segundo plano se necesita
// un backend con VAPID (Edge Function). Aquí: permiso + notificaciones locales
// y recordatorios de partidos mientras la app está abierta.

export function notifSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in navigator
  );
}

export function notifPermission(): NotificationPermission {
  if (!notifSupported()) return "denied";
  return Notification.permission;
}

export async function requestNotifications(): Promise<NotificationPermission> {
  if (!notifSupported()) return "denied";
  try {
    return await Notification.requestPermission();
  } catch {
    return "denied";
  }
}

export async function showLocal(title: string, body: string, url = "/jugar") {
  if (!notifSupported() || Notification.permission !== "granted") return;
  try {
    const reg = await navigator.serviceWorker.ready;
    await reg.showNotification(title, {
      body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url },
    });
  } catch {
    try {
      new Notification(title, { body });
    } catch {
      /* noop */
    }
  }
}

// Programa recordatorios 10 min antes del pitazo (solo mientras la app sigue abierta).
export function scheduleMatchReminders(
  kickoffs: Record<string, number>
): () => void {
  if (notifPermission() !== "granted") return () => {};
  const timers: ReturnType<typeof setTimeout>[] = [];
  const LEAD = 10 * 60 * 1000;
  Object.values(kickoffs).forEach((ts) => {
    const delay = ts - LEAD - Date.now();
    if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
      timers.push(
        setTimeout(
          () =>
            showLocal(
              "¡Tu partido arranca pronto! ⚽",
              "Bloquea tus picks antes del pitazo.",
              "/jugar"
            ),
          delay
        )
      );
    }
  });
  return () => timers.forEach(clearTimeout);
}

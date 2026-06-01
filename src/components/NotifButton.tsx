"use client";

import { useEffect, useState } from "react";
import {
  notifSupported,
  notifPermission,
  requestNotifications,
  showLocal,
} from "@/lib/notifications";

export default function NotifButton() {
  const [perm, setPerm] = useState<NotificationPermission | "unsupported">("default");

  useEffect(() => {
    setPerm(notifSupported() ? notifPermission() : "unsupported");
  }, []);

  if (perm === "unsupported") {
    return (
      <div className="text-[11px] text-white/40">
        Tu navegador no soporta notificaciones.
      </div>
    );
  }

  if (perm === "granted") {
    return (
      <div className="flex items-center gap-2 text-sm text-neon">
        🔔 Notificaciones activadas
        <button
          onClick={() =>
            showLocal("Mi Mundial ⚽", "¡Listo! Te avisaremos de tus partidos y tu liga.")
          }
          className="text-[11px] rounded-full border border-white/15 px-2 py-0.5 text-white/60 hover:text-white"
        >
          Probar
        </button>
      </div>
    );
  }

  if (perm === "denied") {
    return (
      <div className="text-[11px] text-white/45">
        Notificaciones bloqueadas. Actívalas desde los ajustes del navegador.
      </div>
    );
  }

  return (
    <button
      onClick={async () => {
        const p = await requestNotifications();
        setPerm(p);
        if (p === "granted")
          showLocal("Mi Mundial ⚽", "¡Notificaciones activadas! Te avisaremos lo importante.");
      }}
      className="rounded-full bg-neon text-black font-bold text-sm px-4 py-2 hover:brightness-110 transition"
    >
      🔔 Activar notificaciones
    </button>
  );
}

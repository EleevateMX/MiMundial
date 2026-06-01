"use client";

import { useEffect, useState } from "react";
import { getAds, type AdContent, type AdSlot as Slot } from "@/lib/ads";

// Anuncio house no invasivo. Si no hay anuncio configurado, muestra un
// placeholder discreto (sin pop-ups, sin tapar contenido).
export default function AdSlot({ slot }: { slot: Slot }) {
  const [ad, setAd] = useState<AdContent | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getAds().then((a) => {
      setAd(a[slot] ?? null);
      setLoaded(true);
    });
  }, [slot]);

  if (!loaded) return null;

  const isFooter = slot === "footer";

  if (!ad?.image) {
    return (
      <div
        className={`glass rounded-2xl border-dashed border-white/10 grid place-items-center text-white/30 text-xs ${
          isFooter ? "h-16" : "h-28"
        }`}
      >
        Espacio publicitario · configúralo en /admin
      </div>
    );
  }

  return (
    <a
      href={ad.link || "#"}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`relative block overflow-hidden rounded-2xl group ${
        isFooter ? "h-16" : "h-28"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ad.image}
        alt={ad.label || "Anuncio"}
        className="w-full h-full object-cover group-hover:scale-[1.02] transition"
      />
      <span className="absolute top-1 right-1 text-[9px] uppercase tracking-wider bg-black/50 text-white/70 rounded px-1.5 py-0.5">
        Patrocinado
      </span>
      {ad.label && (
        <span className="absolute bottom-1 left-2 text-xs font-semibold text-white drop-shadow">
          {ad.label}
        </span>
      )}
    </a>
  );
}

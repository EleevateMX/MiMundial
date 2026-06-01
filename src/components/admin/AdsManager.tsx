"use client";

import { useEffect, useState } from "react";
import { getAds, setAdContent, type AdContent, type AdSlot } from "@/lib/ads";

const SLOTS: { slot: AdSlot; title: string; hint: string }[] = [
  { slot: "footer", title: "Banner del footer", hint: "Aparece al pie de la app (728×90 aprox.)" },
  { slot: "ranking", title: "Tarjeta del ranking", hint: "Tarjeta patrocinada en la pestaña Ranking" },
];

export default function AdsManager() {
  const [ads, setAds] = useState<Partial<Record<AdSlot, AdContent>>>({});
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    getAds().then(setAds);
  }, []);

  function update(slot: AdSlot, field: keyof AdContent, value: string) {
    setAds((a) => ({
      ...a,
      [slot]: { image: "", link: "", label: "", ...a[slot], [field]: value },
    }));
  }

  async function save(slot: AdSlot) {
    const c = ads[slot];
    if (!c) return;
    await setAdContent(slot, {
      image: c.image || "",
      link: c.link || "",
      label: c.label || "",
    });
    setSaved(slot);
    setTimeout(() => setSaved(null), 1500);
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {SLOTS.map(({ slot, title, hint }) => {
        const c = ads[slot] ?? { image: "", link: "", label: "" };
        return (
          <div key={slot} className="rounded-xl bg-white/[0.03] p-3 space-y-2">
            <div>
              <div className="font-semibold text-sm">{title}</div>
              <div className="text-[11px] text-white/40">{hint}</div>
            </div>
            <Input label="URL de la imagen" value={c.image} onChange={(v) => update(slot, "image", v)} />
            <Input label="Enlace (al hacer clic)" value={c.link} onChange={(v) => update(slot, "link", v)} />
            <Input label="Texto / patrocinador" value={c.label} onChange={(v) => update(slot, "label", v)} />
            {c.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.image} alt="" className="w-full h-16 object-cover rounded-lg" />
            )}
            <button
              onClick={() => save(slot)}
              className="w-full rounded-lg bg-gold text-black font-bold py-2 text-sm hover:brightness-110 transition"
            >
              {saved === slot ? "¡Guardado!" : "Guardar anuncio"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-white/40">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-0.5 w-full rounded-lg bg-black/30 border border-white/10 px-2.5 py-1.5 text-sm outline-none focus:border-gold/60"
      />
    </label>
  );
}

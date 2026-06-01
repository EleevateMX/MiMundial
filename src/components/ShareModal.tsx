"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { TEAM_BY_CODE } from "@/data/teams";
import type { Round } from "@/lib/bracket";
import Flag from "@/components/Flag";

export default function ShareModal({
  rounds,
  champ,
  favorite,
  score,
  onShared,
  onClose,
}: {
  rounds: Round[];
  champ: string | null;
  favorite: string | null;
  score: number;
  onShared: () => void;
  onClose: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  // Semifinalistas y finalistas para el resumen
  const semis = rounds[3]?.matches.flatMap((m) => [m.a, m.b]).filter(Boolean) as string[];
  const finalists = rounds[4]?.matches.flatMap((m) => [m.a, m.b]).filter(Boolean) as string[];

  async function makePng(): Promise<string | null> {
    if (!cardRef.current) return null;
    return toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
  }

  async function download() {
    setBusy(true);
    try {
      const url = await makePng();
      if (url) {
        const a = document.createElement("a");
        a.href = url;
        a.download = "mi-mundial.png";
        a.click();
        onShared();
      }
    } catch {}
    setBusy(false);
  }

  async function share() {
    setBusy(true);
    try {
      const url = await makePng();
      if (url && navigator.share) {
        const blob = await (await fetch(url)).blob();
        const file = new File([blob], "mi-mundial.png", { type: "image/png" });
        await navigator.share({
          title: "Mi Mundial",
          text: "¡Mira mi cuadro en Mi Mundial!",
          files: [file],
        });
        onShared();
      } else {
        await download();
      }
    } catch {}
    setBusy(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tarjeta a exportar */}
        <div
          ref={cardRef}
          className="rounded-3xl p-6 text-center relative overflow-hidden"
          style={{
            background:
              "radial-gradient(40rem 30rem at 20% -10%, rgba(255,61,138,0.35), transparent 60%), radial-gradient(40rem 30rem at 100% 0%, rgba(43,245,192,0.3), transparent 55%), #05070f",
          }}
        >
          <div className="font-display text-3xl text-gold-gradient">MI MUNDIAL</div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-neon/80 mb-4">
            Mi cuadro · {score} pts
          </div>

          {champ ? (
            <div className="mb-4">
              <div className="text-[10px] uppercase tracking-widest text-white/50">
                Mi campeón
              </div>
              <div className="flex items-center justify-center gap-2 mt-1">
                <Flag code={champ} className="w-12 h-8" />
                <span className="font-display text-3xl text-gold-gradient">
                  {TEAM_BY_CODE[champ]?.name.toUpperCase()}
                </span>
              </div>
              <div className="text-3xl mt-1">🏆</div>
            </div>
          ) : (
            <p className="text-white/60 text-sm mb-4">
              Cuadro en construcción…
            </p>
          )}

          {finalists?.length > 0 && (
            <Row label="Finalistas" codes={finalists} />
          )}
          {semis?.length > 0 && <Row label="Semifinalistas" codes={semis} />}

          {favorite && (
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-white/60">
              Le voy a
              <Flag code={favorite} className="w-5 h-3.5" />
              <span className="text-gold">{TEAM_BY_CODE[favorite]?.name}</span>
            </div>
          )}
          <div className="mt-3 text-[10px] text-white/35">
            Solo predicciones · sin apuestas
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={share}
            disabled={busy}
            className="flex-1 rounded-xl bg-gold text-black font-bold py-3 hover:brightness-110 transition disabled:opacity-50"
          >
            {busy ? "Generando…" : "📣 Compartir"}
          </button>
          <button
            onClick={download}
            disabled={busy}
            className="rounded-xl border border-white/15 bg-white/5 px-4 font-semibold hover:bg-white/10 transition disabled:opacity-50"
          >
            Descargar
          </button>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/15 bg-white/5 px-4 font-semibold hover:bg-white/10 transition"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, codes }: { label: string; codes: string[] }) {
  return (
    <div className="mb-2">
      <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">
        {label}
      </div>
      <div className="flex justify-center gap-1.5 flex-wrap">
        {codes.map((c, i) => (
          <Flag key={c + i} code={c} className="w-7 h-5" />
        ))}
      </div>
    </div>
  );
}

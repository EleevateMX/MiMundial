"use client";

// Barra de navegación inferior (solo móvil) estilo app nativa.
export default function BottomNav({
  items,
  active,
  onChange,
}: {
  items: { key: string; label: string; icon: string }[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
      <div className="flex">
        {items.map((it) => {
          const on = active === it.key;
          return (
            <button
              key={it.key}
              onClick={() => onChange(it.key)}
              className={`relative flex-1 flex flex-col items-center gap-0.5 py-2 transition ${
                on ? "text-gold" : "text-white/45"
              }`}
            >
              {on && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-gold glow-gold" />}
              <span className={`text-xl leading-none transition-transform ${on ? "scale-110" : ""}`}>
                {it.icon}
              </span>
              <span className="text-[10px] font-semibold">{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

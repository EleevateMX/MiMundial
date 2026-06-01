// Escudo de Mi Mundial: un balón entrando a una portería, en dorado/neón.
// Se usa en el header, la landing, el admin y para generar los íconos PWA.

export function Crest({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden role="img">
      <defs>
        <linearGradient id="mm-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff7da" />
          <stop offset="45%" stopColor="#ffd24a" />
          <stop offset="100%" stopColor="#f0a72c" />
        </linearGradient>
      </defs>

      {/* Red de la portería */}
      <g stroke="#ffd24a" strokeOpacity="0.28" strokeWidth="1">
        <path d="M14 16 V46 M23 16 V46 M32 16 V46 M41 16 V46 M50 16 V46" />
        <path d="M10 24 H54 M10 33 H54 M10 42 H54" />
      </g>

      {/* Marco de la portería */}
      <path
        d="M10 47 V16 H54 V47"
        fill="none"
        stroke="url(#mm-gold)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Balón */}
      <circle cx="32" cy="40" r="10.5" fill="url(#mm-gold)" />
      <g fill="none" stroke="#05070f" strokeWidth="1.4" strokeLinejoin="round">
        {/* Pentágono central */}
        <polygon
          points="32,36.2 35.6,38.8 34.2,43.1 29.8,43.1 28.4,38.8"
          fill="#05070f"
          stroke="none"
        />
        {/* Costuras hacia el borde */}
        <path d="M32 36.2 L32 30.5" />
        <path d="M35.6 38.8 L41.5 37.2" />
        <path d="M34.2 43.1 L37.8 47.6" />
        <path d="M29.8 43.1 L26.2 47.6" />
        <path d="M28.4 38.8 L22.5 37.2" />
      </g>
    </svg>
  );
}

// Tile redondeado con el escudo (versión usada como "logotipo" en headers).
export function CrestTile({ className = "size-9" }: { className?: string }) {
  return (
    <div
      className={`relative rounded-xl bg-[#0a0e1c] grid place-items-center glow-gold ${className}`}
    >
      <Crest className="w-[78%] h-[78%]" />
    </div>
  );
}

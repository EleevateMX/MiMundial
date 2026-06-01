"use client";

// Avatares generados de forma determinista a partir de una "semilla".
// No se sube ninguna imagen a la BD: solo se guarda el texto de la semilla.

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const PAL: [string, string][] = [
  ["#ff3d8a", "#ffb347"],
  ["#2bf5c0", "#3aa0ff"],
  ["#ffd24a", "#ff7a59"],
  ["#7c5cff", "#ff5fa2"],
  ["#00d4ff", "#2bf5c0"],
  ["#ff5f6d", "#ffc371"],
  ["#a162e8", "#5fa8ff"],
  ["#f7b733", "#fc4a1a"],
];
const HEAD = ["#ffe0b2", "#ffcf9e", "#f3c178", "#e8b98a", "#d9a066", "#c68642"];
const KIT = ["#ff3d8a", "#2bf5c0", "#ffd24a", "#7aa2ff", "#ff7a59", "#ffffff", "#22c1c3"];
const INK = "#1a1f33";

export function avatarSeedFor(avatar: string | null | undefined, fallback: string): string {
  return avatar && avatar.length > 0 ? avatar : fallback || "mm";
}

export default function Avatar({
  seed,
  className = "size-10",
}: {
  seed: string;
  className?: string;
}) {
  const h = hashStr(seed || "mm");
  const [c1, c2] = PAL[h % PAL.length];
  const head = HEAD[(h >> 3) % HEAD.length];
  const kit = KIT[(h >> 6) % KIT.length];
  const kit2 = KIT[(h >> 24) % KIT.length];
  const face = (h >> 9) % 4;
  const accessory = (h >> 12) % 6;
  const isGK = (h >> 15) % 5 === 0; // portero
  const showNumber = (h >> 18) % 2 === 0;
  const number = ((h >> 19) % 23) + 1;
  const id = `av${h % 1000000}`;
  const jersey = isGK ? "#1f2a44" : kit;

  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#${id})`} />

      {/* Hombros / playera */}
      <path d="M12 64 q0 -16 20 -16 q20 0 20 16 z" fill={jersey} opacity="0.97" />
      {/* Franja de la playera */}
      <path d="M28 49 q4 -1 8 0 l0 15 -8 0 z" fill={kit2} opacity="0.8" />
      {/* Número */}
      {showNumber && (
        <text
          x="32"
          y="61"
          textAnchor="middle"
          fontSize="7"
          fontWeight="bold"
          fill="#ffffff"
          opacity="0.85"
          fontFamily="Arial, sans-serif"
        >
          {number}
        </text>
      )}
      {/* Guantes de portero */}
      {isGK && (
        <>
          <rect x="11" y="55" width="7" height="6" rx="2" fill="#ffd24a" />
          <rect x="46" y="55" width="7" height="6" rx="2" fill="#ffd24a" />
        </>
      )}

      {/* Cabeza */}
      <circle cx="32" cy="33" r="15" fill={head} />

      {/* Accesorio */}
      {accessory === 1 && <rect x="17" y="22" width="30" height="4.5" rx="2.25" fill={kit} />}
      {accessory === 2 && <path d="M17 30 a15 15 0 0 1 30 0 z" fill={kit} />}
      {accessory === 3 && (
        <path d="M40 39 l1.4 3 3.2 .3 -2.4 2.1 .7 3.1 -2.9 -1.6 -2.9 1.6 .7 -3.1 -2.4 -2.1 3.2 -.3 z" fill={kit} />
      )}
      {accessory === 4 && (
        <path d="M19 25 q13 -9 26 0" stroke={kit} strokeWidth="3" fill="none" strokeLinecap="round" />
      )}
      {accessory === 5 && (
        // Balón junto a la cabeza
        <g transform="translate(46 18)">
          <circle r="6" fill="#ffffff" stroke={INK} strokeWidth="0.8" />
          <path d="M0 -3 l2.9 2.1 -1.1 3.4 -3.6 0 -1.1 -3.4 z" fill={INK} />
        </g>
      )}

      {/* Ojos + boca */}
      {face === 0 && (
        <>
          <circle cx="26" cy="32" r="2.3" fill={INK} />
          <circle cx="38" cy="32" r="2.3" fill={INK} />
          <path d="M26 39 q6 5 12 0" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      )}
      {face === 1 && (
        <>
          <path d="M23 33 q3 -3 6 0" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M35 33 q3 -3 6 0" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M25 38 q7 7 14 0" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      )}
      {face === 2 && (
        <>
          <path d="M24 32 h4" stroke={INK} strokeWidth="2" strokeLinecap="round" />
          <path d="M36 32 h4" stroke={INK} strokeWidth="2" strokeLinecap="round" />
          <path d="M27 40 h10" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {face === 3 && (
        <>
          <circle cx="26" cy="32" r="2.3" fill={INK} />
          <path d="M36 32 q2 -2 4 0" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M27 39 q6 4 11 -1" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

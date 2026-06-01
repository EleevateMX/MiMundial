// Íconos SVG propios de Mi Mundial (no emojis). Usan currentColor.

export type IconName =
  | "grupos"
  | "cuadro"
  | "dia"
  | "ligas"
  | "duelo"
  | "logros"
  | "ranking"
  | "perfil"
  | "nivel"
  | "racha"
  | "puntos"
  | "sonidoOn"
  | "sonidoOff"
  | "compartir"
  | "campana";

const PATHS: Record<IconName, React.ReactNode> = {
  grupos: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </>
  ),
  cuadro: (
    // Trofeo
    <>
      <path d="M7 4h10v4a5 5 0 0 1-10 0z" />
      <path d="M7 5H4a2 2 0 0 0 2 4" />
      <path d="M17 5h3a2 2 0 0 1-2 4" />
      <path d="M12 13v4" />
      <path d="M9 20h6" />
      <path d="M10 17h4v3h-4z" />
    </>
  ),
  dia: (
    // Calendario con destello
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
      <path d="M8 3v3M16 3v3" />
      <path d="M12 12l1.2 2.4 2.6.3-1.9 1.8.5 2.6L12 18.6 9.5 19.9l.5-2.6-1.9-1.8 2.6-.3z" />
    </>
  ),
  ligas: (
    // Dos personas
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15 19a4.5 4.5 0 0 1 6.5-4" />
    </>
  ),
  duelo: (
    // Espadas cruzadas
    <>
      <path d="M5 4l9 9" />
      <path d="M19 4l-9 9" />
      <path d="M4 16l3 3" />
      <path d="M20 16l-3 3" />
      <path d="M9 14l-4 4 1 1 4-4" />
      <path d="M15 14l4 4-1 1-4-4" />
    </>
  ),
  logros: (
    // Medalla
    <>
      <path d="M8 3l2.5 5M16 3l-2.5 5" />
      <circle cx="12" cy="15" r="6" />
      <path d="M12 12.5l.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z" />
    </>
  ),
  ranking: (
    // Podio / barras
    <>
      <rect x="3" y="13" width="5" height="8" rx="1" />
      <rect x="9.5" y="8" width="5" height="13" rx="1" />
      <rect x="16" y="11" width="5" height="10" rx="1" />
    </>
  ),
  perfil: (
    // Persona
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  nivel: (
    // Estrella (nivel)
    <path d="M12 3.5l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z" />
  ),
  racha: (
    // Llama (racha)
    <path d="M12 21a5 5 0 0 0 5-5c0-3-2.5-5-3.5-8-1 2-1.5 2.5-1.5 4 0 1-.7 1.5-1.3 1.3C8.5 12.5 8 14 8 16a4 4 0 0 0 4 5z" />
  ),
  puntos: (
    // Moneda con estrella (puntos)
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8l1.2 2.5 2.8.4-2 2 .5 2.7-2.5-1.3-2.5 1.3.5-2.7-2-2 2.8-.4z" />
    </>
  ),
  sonidoOn: (
    <>
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      <path d="M16.5 9.5a3.5 3.5 0 0 1 0 5M19 7a7 7 0 0 1 0 10" />
    </>
  ),
  sonidoOff: (
    <>
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      <path d="M16 10l5 4M21 10l-5 4" />
    </>
  ),
  compartir: (
    <>
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6" />
    </>
  ),
  campana: (
    <>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" />
      <path d="M10.5 19a1.5 1.5 0 0 0 3 0" />
    </>
  ),
};

export default function Icon({
  name,
  className = "size-6",
  strokeWidth = 1.9,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {PATHS[name]}
    </svg>
  );
}

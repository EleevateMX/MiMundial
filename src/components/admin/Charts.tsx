"use client";

// Gráficos ligeros en SVG (sin dependencias).

export function AreaChart({
  data,
  labels,
  color = "#2bf5c0",
  height = 160,
}: {
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
}) {
  const w = 600;
  const h = height;
  const pad = 8;
  const max = Math.max(...data) * 1.1 || 1;
  const min = Math.min(...data) * 0.9;
  const range = max - min || 1;
  const stepX = (w - pad * 2) / (data.length - 1);
  const pts = data.map((v, i) => {
    const x = pad + i * stepX;
    const y = pad + (1 - (v - min) / range) * (h - pad * 2);
    return [x, y] as const;
  });
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0]},${h - pad} L${pts[0][0]},${h - pad} Z`;
  const id = `g-${color.replace("#", "")}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill={color} />
      ))}
    </svg>
  );
}

export function BarChart({
  data,
  color = "#ffd24a",
  height = 160,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  const max = Math.max(...data) || 1;
  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm transition-all"
          style={{
            height: `${(v / max) * 100}%`,
            background: `linear-gradient(180deg, ${color}, ${color}55)`,
          }}
          title={String(v)}
        />
      ))}
    </div>
  );
}

export function Donut({
  segments,
  size = 150,
}: {
  segments: { label: string; pct: number; color: string }[];
  size?: number;
}) {
  const r = 52;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} viewBox="0 0 140 140">
        <g transform="rotate(-90 70 70)">
          {segments.map((s, i) => {
            const len = (s.pct / 100) * c;
            const el = (
              <circle
                key={i}
                cx="70"
                cy="70"
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth="16"
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
              />
            );
            offset += len;
            return el;
          })}
        </g>
      </svg>
      <ul className="space-y-1.5 text-sm">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span
              className="inline-block size-3 rounded-sm"
              style={{ background: s.color }}
            />
            <span className="text-white/70">{s.label}</span>
            <span className="font-display text-white/90 tabular-nums">{s.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

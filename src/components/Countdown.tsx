"use client";

import { useEffect, useState } from "react";

function fmt(ms: number): string {
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

export default function Countdown({
  target,
  className = "",
}: {
  target: number;
  className?: string;
}) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = target - now;
  if (remaining <= 0) {
    return (
      <span className={`text-hot font-semibold ${className}`}>● Cerrado</span>
    );
  }
  const soon = remaining < 60 * 60 * 1000;
  return (
    <span
      className={`tabular-nums ${soon ? "text-hot animate-pulse" : "text-white/45"} ${className}`}
    >
      ⏱ {fmt(remaining)}
    </span>
  );
}

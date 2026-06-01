"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Flag from "@/components/Flag";
import { AreaChart, BarChart, Donut } from "@/components/admin/Charts";
import {
  KPIS,
  SIGNUPS_14D,
  DAU_14D,
  dayLabels,
  TOP_CHAMPIONS,
  ACH_DISTRIBUTION,
  DEVICE_SPLIT,
  RETENTION,
  RECENT_USERS,
} from "@/data/analytics";

const ADMIN_PASS = "admin"; // Prototipo — reemplazar por auth real (Supabase + rol).

export default function AdminPage() {
  const [ok, setOk] = useState(false);
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("mm-admin") === "1") setOk(true);
  }, []);

  if (!ok) {
    return (
      <div className="flex-1 grid place-items-center px-4 py-16">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pass === ADMIN_PASS) {
              sessionStorage.setItem("mm-admin", "1");
              setOk(true);
            } else setError(true);
          }}
          className="glass rounded-3xl p-7 w-full max-w-sm text-center glow-gold"
        >
          <div className="text-4xl mb-2">🔐</div>
          <h1 className="font-display text-2xl">PANEL DE ADMIN</h1>
          <p className="text-sm text-white/55 mt-1 mb-4">
            Acceso restringido. Ingresa la clave de administrador.
          </p>
          <input
            type="password"
            value={pass}
            onChange={(e) => {
              setPass(e.target.value);
              setError(false);
            }}
            placeholder="Clave"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2.5 outline-none focus:border-gold/60 text-center"
          />
          {error && (
            <p className="text-hot text-xs mt-2">Clave incorrecta.</p>
          )}
          <button className="mt-4 w-full rounded-xl bg-gold text-black font-bold py-3 hover:brightness-110 transition">
            Entrar
          </button>
          <p className="text-[11px] text-white/30 mt-3">
            Demo: la clave es <code className="text-white/50">admin</code>
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-gradient-to-br from-gold to-gold-deep grid place-items-center text-black font-display text-xl glow-gold">
              M
            </div>
            <div>
              <div className="font-display text-xl text-gold-gradient leading-none">
                PANEL DE ADMIN
              </div>
              <div className="text-[10px] uppercase tracking-widest text-neon/80">
                Mi Mundial · datos en vivo
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-neon">
              <span className="size-2 rounded-full bg-neon animate-pulse" /> en vivo
            </span>
            <Link
              href="/jugar"
              className="text-sm text-white/60 hover:text-white transition"
            >
              ← A la app
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-5">
        {/* KPIs */}
        <section className="grid gap-3 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {KPIS.map((k) => (
            <div key={k.label} className="glass rounded-2xl p-4">
              <div className="text-[11px] uppercase tracking-wider text-white/45">
                {k.label}
              </div>
              <div className="font-display text-2xl mt-1 text-gold-gradient">
                {k.value}
              </div>
              <div className="flex items-center justify-between mt-1">
                <span
                  className={`text-xs font-semibold ${
                    k.delta >= 0 ? "text-neon" : "text-hot"
                  }`}
                >
                  {k.delta >= 0 ? "▲" : "▼"} {Math.abs(k.delta)}%
                </span>
                <span className="text-[10px] text-white/35">{k.hint}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Charts principales */}
        <section className="grid gap-4 lg:grid-cols-2">
          <Card title="Altas diarias" subtitle="Últimos 14 días">
            <BarChart data={SIGNUPS_14D} color="#ffd24a" />
            <AxisLabels labels={dayLabels()} />
          </Card>
          <Card title="Usuarios activos (DAU)" subtitle="Últimos 14 días">
            <AreaChart data={DAU_14D} color="#2bf5c0" />
            <AxisLabels labels={dayLabels()} />
          </Card>
        </section>

        {/* Fila secundaria */}
        <section className="grid gap-4 lg:grid-cols-3">
          <Card title="Campeón más predicho" subtitle="Selección favorita global">
            <ul className="space-y-2.5 mt-1">
              {TOP_CHAMPIONS.map((t) => {
                const max = TOP_CHAMPIONS[0].count;
                return (
                  <li key={t.code} className="flex items-center gap-2">
                    <Flag code={t.code} className="w-6 h-4" />
                    <span className="w-20 truncate text-sm">{t.name}</span>
                    <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-hot to-gold"
                        style={{ width: `${(t.count / max) * 100}%` }}
                      />
                    </div>
                    <span className="text-[11px] tabular-nums text-white/55 w-12 text-right">
                      {t.count.toLocaleString("es-MX")}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card title="Logros desbloqueados" subtitle="% de usuarios">
            <ul className="space-y-2 mt-1">
              {ACH_DISTRIBUTION.map((a) => (
                <li key={a.name} className="flex items-center gap-2">
                  <span className="w-32 truncate text-sm text-white/80">{a.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-neon to-gold"
                      style={{ width: `${a.pct}%` }}
                    />
                  </div>
                  <span className="text-[11px] tabular-nums text-white/55 w-9 text-right">
                    {a.pct}%
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <div className="space-y-4">
            <Card title="Dispositivos" subtitle="Cómo entran">
              <div className="mt-2">
                <Donut segments={DEVICE_SPLIT} />
              </div>
            </Card>
            <Card title="Retención">
              <div className="grid grid-cols-3 gap-2 mt-1 text-center">
                {[
                  ["D1", RETENTION.d1],
                  ["D7", RETENTION.d7],
                  ["D30", RETENTION.d30],
                ].map(([k, v]) => (
                  <div key={k as string} className="rounded-xl bg-white/5 py-3">
                    <div className="font-display text-2xl text-gold">{v}%</div>
                    <div className="text-[10px] uppercase tracking-wider text-white/45">
                      {k}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* Usuarios recientes */}
        <section>
          <Card title="Registros recientes" subtitle="Tiempo real">
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-sm min-w-[480px]">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-white/40">
                    <th className="py-2 px-1 font-medium">Usuario</th>
                    <th className="py-2 px-1 font-medium">Método</th>
                    <th className="py-2 px-1 font-medium">Picks</th>
                    <th className="py-2 px-1 font-medium text-right">Alta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {RECENT_USERS.map((u) => (
                    <tr key={u.name}>
                      <td className="py-2.5 px-1">
                        <span className="flex items-center gap-2">
                          <Flag code={u.flag} className="w-6 h-4" />
                          {u.name}
                        </span>
                      </td>
                      <td className="py-2.5 px-1">
                        <span
                          className={`text-[11px] rounded-full px-2 py-0.5 ${
                            u.plan === "Google"
                              ? "bg-neon/10 text-neon"
                              : "bg-white/10 text-white/60"
                          }`}
                        >
                          {u.plan}
                        </span>
                      </td>
                      <td className="py-2.5 px-1 tabular-nums">
                        {u.picks}
                        <span className="text-white/30">/31</span>
                      </td>
                      <td className="py-2.5 px-1 text-right text-white/45">{u.when}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        <p className="text-center text-[11px] text-white/30 pb-4">
          Datos de ejemplo · al conectar Supabase se mostrarán métricas reales.
        </p>
      </main>
    </div>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="font-display text-lg text-white/85">{title}</h3>
        {subtitle && (
          <span className="text-[10px] uppercase tracking-wider text-white/35">
            {subtitle}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function AxisLabels({ labels }: { labels: string[] }) {
  return (
    <div className="flex justify-between mt-1.5 text-[9px] text-white/30">
      {labels.map((l, i) => (
        <span key={i} className={i % 2 ? "hidden sm:block" : ""}>
          {l}
        </span>
      ))}
    </div>
  );
}

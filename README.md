# Mi Mundial ⚽🏆

App de **predicciones** tipo bracket: elige a tu selección, predice quién le
gana a quién en todo el cuadro y compite en un **ranking global**.
**Solo predicciones — sin apuestas.** Sin marcas registradas de terceros.

> Estado actual: **prototipo visual** (datos de ejemplo, sin login/DB reales).
> El siguiente paso es conectar autenticación y base de datos con Supabase.

## Funciona ahora

- **Landing** (`/`) con identidad estilo "casino" (dorado/neón, brillos).
- **Grupos** (`/jugar` → pestaña Grupos): 48 selecciones reales en 12 grupos
  (A–L) con banderas. Toca tu favorito.
- **Mi Cuadro** (bracket interactivo): Ronda de 32 → Octavos → Cuartos →
  Semifinal → Final. Toca al ganador de cada partido y corona a tu campeón
  (con confeti 🎉).
  - **Cuenta regresiva + bloqueo de picks**: cada partido tiene hora; al pitazo
    se cierra y ya no puedes cambiar tu predicción. 🔒
  - **Multiplicadores de riesgo** (x1 / x2 / x3): arriesga más puntos en tus
    corazonadas. Sin dinero, pura adrenalina.
- **Ligas** con amigos: crea una liga (genera **código de invitación**), únete
  con un código y compite en un **ranking privado**.
- **Duelo 1v1**: reta a un rival y comparen cuadros (campeones enfrentados +
  % de coincidencia + dónde no coinciden).
- **Logros / medallas**: Profeta, Cazador de sorpresas, Estratega, etc., con
  barra de progreso.
- **Racha diaria (check-in)**: entra cada día, mantén tu racha 🔥 y gana puntos.
- **Compartir tu cuadro** como imagen (PNG) para redes.
- **Ranking** global mock + barras de "popularidad" de cada selección.
- **Login** (`/login`): alta **solo por correo y contraseña** con confirmación
  de email anti-bots (sin Google, por seguridad).
- **PWA instalable** (móvil + escritorio): manifest, íconos, service worker con
  soporte offline, página `/offline` y botón "Instalar app".
- **Panel de Admin** (`/admin`, clave demo `admin`): KPIs (usuarios, DAU, altas,
  instalaciones PWA…), gráficos de altas y activos, campeón más predicho,
  distribución de logros, dispositivos, retención y registros recientes.
  - **Resultados oficiales**: el admin marca al ganador real de cada partido y
    los **puntos se calculan automáticamente** para todos (aciertos/fallos en el
    cuadro).
- **Niveles y XP** con barra de progreso, **subida de nivel** y **toasts de
  recompensa** con sonido (WebAudio) y vibración; toggle de sonido 🔊.
- **Predicción del día** (mini-quinielas): partidos rápidos con **bonus por
  anticipación** (a más temprano, más puntos) y marcador exacto opcional.
- **Perfil de jugador**: avatar, nombre editable, nivel, racha, estadísticas y
  **vitrina de medallas**; tarjeta compartible.

> Todo el progreso (cuadro, favorito, racha, ligas, logros) se guarda en el
> navegador con `localStorage` para que se sienta como app real. Al conectar
> Supabase, esto pasará a la nube por usuario, y el panel de admin mostrará
> métricas reales.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4**
- **Supabase** (`@supabase/ssr`): Auth (correo con confirmación, sin Google),
  Postgres con RLS, ligas/ranking/resultados compartidos y métricas de admin.
- Banderas: SVG empaquetados localmente (`flag-icons`)

## Modo demo vs. producción

Sin variables de Supabase, la app corre en **modo demo** (todo en
`localStorage`, ranking/ligas simulados, admin con clave `admin`). Al configurar
Supabase, pasa a **real**: login, datos en la nube por usuario, ligas/ranking/
resultados compartidos y admin con rol real + métricas reales.

➡️ **Guía paso a paso:** [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) ·
variables en [`.env.example`](./.env.example) · SQL en
[`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql).

### Anuncios

Slots "house" **no invasivos** (banner del footer + tarjeta en el ranking) que
controlas desde `/admin`. Sin pop-ups ni intersticiales.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
```

## Estructura

```
src/
  app/
    page.tsx          # Landing
    jugar/page.tsx    # App principal (grupos, cuadro, ranking)
    login/page.tsx    # Pantalla de inicio de sesión (visual)
  components/
    MiMundialApp.tsx  # Toda la lógica de UI interactiva
    Flag.tsx          # Bandera por código ISO
    Confetti.tsx      # Confeti del campeón
  data/teams.ts       # 48 selecciones, grupos, cruces y datos mock
  lib/bracket.ts      # Construcción del cuadro y puntaje
```

## Próximos pasos sugeridos

1. **Auth real** con Supabase (email/contraseña con confirmación de correo).
2. **Persistencia**: guardar el cuadro y el favorito por usuario.
3. **Leaderboard real** y puntaje al resolverse partidos reales.
4. Ideas extra tipo "caliente": rachas diarias, ligas con amigos, logros/medallas,
   choque de predicciones (1v1), cuenta regresiva a cada partido.

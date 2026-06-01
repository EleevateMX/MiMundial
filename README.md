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
- **Login visual** (`/login`): botón de Google + alta por correo con mensaje de
  confirmación anti-bots (aún sin conectar).
- **PWA instalable** (móvil + escritorio): manifest, íconos, service worker con
  soporte offline, página `/offline` y botón "Instalar app".
- **Panel de Admin** (`/admin`, clave demo `admin`): KPIs (usuarios, DAU, altas,
  instalaciones PWA…), gráficos de altas y activos, campeón más predicho,
  distribución de logros, dispositivos, retención y registros recientes.

> Todo el progreso (cuadro, favorito, racha, ligas, logros) se guarda en el
> navegador con `localStorage` para que se sienta como app real. Al conectar
> Supabase, esto pasará a la nube por usuario, y el panel de admin mostrará
> métricas reales.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4**
- Banderas: SVG de [flagcdn.com](https://flagcdn.com)
- Próximamente: **Supabase** (Auth con Google + correo con confirmación, DB,
  leaderboard real)

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

1. **Auth real** con Supabase (Google OAuth + email/contraseña con
   confirmación de correo).
2. **Persistencia**: guardar el cuadro y el favorito por usuario.
3. **Leaderboard real** y puntaje al resolverse partidos reales.
4. Ideas extra tipo "caliente": rachas diarias, ligas con amigos, logros/medallas,
   choque de predicciones (1v1), cuenta regresiva a cada partido.

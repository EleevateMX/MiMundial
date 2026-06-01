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
- **Ranking** global mock + barras de "popularidad" de cada selección.
- **Login visual** (`/login`): botón de Google + alta por correo con mensaje de
  confirmación anti-bots (aún sin conectar).

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

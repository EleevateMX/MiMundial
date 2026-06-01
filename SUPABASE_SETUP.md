# Activar Supabase en Mi Mundial

La app funciona en **modo demo** (datos locales) hasta que conectes Supabase.
Sigue estos pasos para activar login real, datos en la nube, ligas/ranking
compartidos, admin con rol real y métricas reales.

## 1. Variables de entorno

Copia `.env.example` a `.env.local` y rellena:

```
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

> En Supabase: **Project Settings → API**. Usa **Project URL** y la llave
> **anon public** (la `service_role` NO se usa en la app; nunca la expongas).
>
> En despliegue (Vercel u otro), pon estas dos variables en la configuración del
> entorno. No las subas al repo.

## 2. Crear el esquema (SQL)

Abre **SQL Editor** en Supabase, pega el contenido de
`supabase/migrations/0001_init.sql` y ejecútalo. Crea tablas (`profiles`,
`brackets`, `leagues`, `league_members`, `results`, `ads`), políticas de
seguridad (RLS), el alta automática de perfil al registrarse, la protección del
rol y la función de métricas `admin_stats()`.

## 3. Login por correo con confirmación (anti-bots)

El acceso es **solo por correo y contraseña** (sin Google, por seguridad).

1. **Authentication → Providers → Email** → habilitado, y activa
   **Confirm email** (obliga a verificar el correo: filtra bots).
2. **Authentication → URL Configuration**:
   - **Site URL**: la URL de tu app (ej. `http://localhost:3000` en local o tu
     dominio en producción).
   - **Redirect URLs**: agrega `http://localhost:3000/auth/callback` y
     `https://TU-DOMINIO/auth/callback`.

La app envía al usuario a `/auth/callback` al confirmar su correo.

## 4. Hacerte administrador

Regístrate en la app con tu correo. Luego, en el **SQL Editor**:

```sql
update public.profiles set role = 'admin' where id = (
  select id from auth.users where email = 'TU-CORREO@ejemplo.com'
);
```

Ahora `/admin` te dejará entrar por rol (sin clave demo) y verás métricas
reales. Los resultados oficiales y los anuncios que configures se aplican a
todos los usuarios.

## 5. Anuncios "house"

En `/admin → Anuncios (house)` defines el banner del footer y la tarjeta del
ranking (imagen + enlace + texto). Se guardan en la tabla `ads` y se muestran a
todos. Sin pop-ups ni intersticiales.

## Qué pasa con el progreso de invitado

Si alguien juega como invitado y luego inicia sesión, su cuadro local se
**sube a su cuenta** en el primer guardado (migración automática). A partir de
ahí, su progreso lo sigue en cualquier dispositivo.

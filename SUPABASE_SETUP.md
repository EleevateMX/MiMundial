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

Abre **SQL Editor** en Supabase y ejecuta **en orden** los archivos de
`supabase/migrations/`:

- `0001_init.sql` — tablas (`profiles`, `brackets`, `leagues`, `league_members`,
  `results`, `ads`), seguridad (RLS), alta automática de perfil, protección de
  rol y métricas `admin_stats()`.
- `0002_chat.sql` — tabla `messages` + RLS + Realtime para el **chat por liga**.
- `0003_avatar.sql` — columna `avatar` (semilla del avatar generado).

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

> ⚠️ **¿El enlace del correo te manda a `localhost`?** Es porque el **Site URL**
> sigue en `http://localhost:3000`. Cámbialo por tu **URL de producción** (la de
> Vercel) y agrega `https://TU-DOMINIO/auth/callback` a **Redirect URLs**. Los
> correos que se envíen *después* del cambio ya apuntarán a tu sitio real.

## 3b. Brandear el correo como "Mi Mundial"

1. **Authentication → Email Templates → "Confirm signup"**.
2. **Subject**: `Confirma tu cuenta en Mi Mundial ⚽`
3. **Message body**: pega el contenido de
   `supabase/email-templates/confirm-signup.html` (diseño dorado/oscuro de Mi
   Mundial con botón “Confirmar mi correo”). Usa la variable `{{ .ConfirmationURL }}`.

### Remitente y entrega (recomendado para producción)

El correo integrado de Supabase tiene **límite bajo** (pocos envíos por hora) y
sale de un remitente genérico. Para que llegue como **"Mi Mundial"** y sin
límites, configura **SMTP propio** (gratis con [Resend](https://resend.com)):

- **Project Settings → Authentication → SMTP Settings** → activa *Custom SMTP* y
  pon los datos de Resend (host, puerto, usuario, API key).
- **Sender name**: `Mi Mundial` · **Sender email**: el que verifiques en Resend
  (ej. `no-reply@tudominio.com`).

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

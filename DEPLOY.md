# Desplegar Mi Mundial en Vercel

Next.js se despliega en Vercel sin configuración extra. Pasos:

## 1. Importar el repo

1. Entra a [vercel.com/new](https://vercel.com/new) e **importa** el repositorio
   `eleevatemx/mimundial`.
2. Framework: **Next.js** (se detecta solo). Build command y output por defecto.

## 2. Variables de entorno

En **Project → Settings → Environment Variables** agrega (para Production,
Preview y Development):

| Variable | Valor |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://wtuttnrcsezjlvqygdse.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | tu llave **publishable** (`sb_publishable_…`) |
| `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` | *(opcional)* tu site key de hCaptcha |

> La llave publishable es pública por diseño (va en el cliente). Aun así, se
> gestiona como variable de entorno, no en el repo.

## 3. Deploy

Pulsa **Deploy**. Obtendrás una URL tipo `https://mimundial.vercel.app`.

## 4. Conectar Supabase con tu dominio

En **Supabase → Authentication → URL Configuration**:

- **Site URL**: `https://TU-APP.vercel.app`
- **Redirect URLs**: agrega
  - `https://TU-APP.vercel.app/auth/callback`
  - `http://localhost:3000/auth/callback` (para desarrollo)

Y si usas hCaptcha: **Authentication → Attack Protection → Captcha** →
activa hCaptcha y pega el **secret**.

## 5. Probar en vivo

1. Abre tu URL de Vercel.
2. Regístrate con un correo → revisa el enlace de confirmación.
3. Arma tu cuadro: se guarda en la nube y aparece en el ranking real.
4. Hazte admin (ver `SUPABASE_SETUP.md`, paso 4) para entrar a `/admin` con rol.

## Notas

- El **proxy** (`src/proxy.ts`) refresca la sesión en cada request y está
  protegido para no romper la navegación si Supabase no responde.
- Sin variables de Supabase, el deploy igual funciona en **modo demo**.
- La PWA (instalación + offline) funciona automáticamente sobre HTTPS de Vercel.

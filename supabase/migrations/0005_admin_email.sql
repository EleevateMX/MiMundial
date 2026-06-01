-- Mi Mundial — admin por correo (además del rol en profiles)
-- Permite que ciertos correos sean administradores automáticamente, para que
-- las políticas RLS (resultados, anuncios, etc.) los reconozcan sin tener que
-- actualizar la columna role a mano.

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
    or exists (
      select 1 from auth.users
      where id = auth.uid()
        and lower(email) in ('edronemidmx@gmail.com', 'edykiira@gmail.com')
    );
$$;

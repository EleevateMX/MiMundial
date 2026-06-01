-- Mi Mundial — esquema inicial
-- Ejecuta esto en Supabase (SQL Editor) una sola vez.

-- ========== Tablas ==========

create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  favorite     text,
  score        int  default 0,
  level        int  default 1,
  streak       int  default 0,
  role         text default 'user',
  last_seen    timestamptz,
  created_at   timestamptz default now()
);

create table if not exists public.brackets (
  user_id        uuid primary key references auth.users (id) on delete cascade,
  picks          jsonb default '{}'::jsonb,
  mult           jsonb default '{}'::jsonb,
  daily          jsonb default '{}'::jsonb,
  last_check_in  date,
  updated_at     timestamptz default now()
);

create table if not exists public.leagues (
  id         uuid primary key default gen_random_uuid(),
  code       text unique not null,
  name       text not null,
  owner      uuid references auth.users (id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.league_members (
  league_id uuid references public.leagues (id) on delete cascade,
  user_id   uuid references public.profiles (id) on delete cascade,
  joined_at timestamptz default now(),
  primary key (league_id, user_id)
);

create table if not exists public.results (
  id         int primary key default 1 check (id = 1),
  data       jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);
insert into public.results (id, data) values (1, '{}'::jsonb)
  on conflict (id) do nothing;

create table if not exists public.ads (
  slot       text primary key,           -- 'footer' | 'ranking'
  image      text,
  link       text,
  label      text,
  active     boolean default true,
  updated_at timestamptz default now()
);

-- ========== Helper de rol admin ==========

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ========== Alta automática de perfil al registrarse ==========

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  insert into public.brackets (user_id) values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ========== Proteger la columna role (que nadie se auto-eleve) ==========

create or replace function public.protect_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    new.role := old.role;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_role on public.profiles;
create trigger profiles_protect_role
  before update on public.profiles
  for each row execute function public.protect_role();

-- ========== RLS ==========

alter table public.profiles       enable row level security;
alter table public.brackets       enable row level security;
alter table public.leagues        enable row level security;
alter table public.league_members enable row level security;
alter table public.results        enable row level security;
alter table public.ads            enable row level security;

-- profiles: lectura pública (ranking), escritura solo del dueño
create policy "profiles read"   on public.profiles for select using (true);
create policy "profiles insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles update" on public.profiles for update using (auth.uid() = id);

-- brackets: privados del dueño
create policy "brackets own" on public.brackets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- leagues: lectura pública (para unirse por código), escritura del dueño
create policy "leagues read"   on public.leagues for select using (true);
create policy "leagues insert" on public.leagues for insert with check (auth.uid() = owner);
create policy "leagues manage" on public.leagues for update using (auth.uid() = owner);
create policy "leagues delete" on public.leagues for delete using (auth.uid() = owner);

-- league_members: lectura pública, cada quien gestiona su propia membresía
create policy "members read"   on public.league_members for select using (true);
create policy "members join"   on public.league_members for insert with check (auth.uid() = user_id);
create policy "members leave"  on public.league_members for delete using (auth.uid() = user_id);

-- results: lectura pública, escritura solo admin
create policy "results read"  on public.results for select using (true);
create policy "results write" on public.results for all
  using (public.is_admin()) with check (public.is_admin());

-- ads: lectura pública, escritura solo admin
create policy "ads read"  on public.ads for select using (true);
create policy "ads write" on public.ads for all
  using (public.is_admin()) with check (public.is_admin());

-- ========== Métricas reales para el panel admin ==========

create or replace function public.admin_stats()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  result json;
begin
  if not public.is_admin() then
    raise exception 'no autorizado';
  end if;

  select json_build_object(
    'total_users', (select count(*) from public.profiles),
    'new_today',   (select count(*) from public.profiles where created_at >= current_date),
    'active_today',(select count(*) from public.profiles where last_seen >= current_date),
    'leagues',     (select count(*) from public.leagues),
    'results_decided', (
      select count(*) from public.results r, jsonb_object_keys(r.data) where r.id = 1
    ),
    'avg_score',   (select coalesce(round(avg(score)), 0) from public.profiles),
    'top_favorites', (
      select coalesce(json_agg(t), '[]'::json) from (
        select favorite as code, count(*) as count
        from public.profiles
        where favorite is not null
        group by favorite
        order by count desc
        limit 8
      ) t
    )
  ) into result;

  return result;
end;
$$;

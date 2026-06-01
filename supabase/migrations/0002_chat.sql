-- Mi Mundial — Chat por liga (Realtime)
-- Ejecuta después de 0001_init.sql.

create table if not exists public.messages (
  id         bigint generated always as identity primary key,
  league_id  uuid references public.leagues (id) on delete cascade,
  user_id    uuid references public.profiles (id) on delete cascade,
  name       text,
  favorite   text,
  body       text not null check (char_length(body) between 1 and 500),
  created_at timestamptz default now()
);

create index if not exists messages_league_created_idx
  on public.messages (league_id, created_at);

alter table public.messages enable row level security;

-- Solo los miembros de la liga pueden leer su chat
create policy "msg read" on public.messages for select using (
  exists (
    select 1 from public.league_members m
    where m.league_id = messages.league_id and m.user_id = auth.uid()
  )
);

-- Solo puedes publicar como tú mismo y si eres miembro de la liga
create policy "msg insert" on public.messages for insert with check (
  auth.uid() = user_id and exists (
    select 1 from public.league_members m
    where m.league_id = messages.league_id and m.user_id = auth.uid()
  )
);

-- Habilitar Realtime para el chat
alter publication supabase_realtime add table public.messages;

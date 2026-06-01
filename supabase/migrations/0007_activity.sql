-- Mi Mundial — feed de actividad global (en vivo)
create table if not exists public.activity (
  id         bigint generated always as identity primary key,
  user_id    uuid references public.profiles (id) on delete cascade,
  name       text,
  favorite   text,
  avatar     text,
  text       text not null,
  created_at timestamptz default now()
);
create index if not exists activity_created_idx on public.activity (created_at desc);

alter table public.activity enable row level security;
create policy "act read" on public.activity for select using (true);
create policy "act insert" on public.activity for insert with check (auth.uid() = user_id);

alter publication supabase_realtime add table public.activity;

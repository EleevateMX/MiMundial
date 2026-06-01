-- Mi Mundial — reacciones reales a mensajes del chat (compartidas + Realtime)
create table if not exists public.message_reactions (
  message_id bigint references public.messages (id) on delete cascade,
  league_id  uuid references public.leagues (id) on delete cascade,
  user_id    uuid references public.profiles (id) on delete cascade,
  emoji      text not null,
  created_at timestamptz default now(),
  primary key (message_id, user_id)
);

alter table public.message_reactions enable row level security;

create policy "react read" on public.message_reactions for select using (
  exists (
    select 1 from public.league_members m
    where m.league_id = message_reactions.league_id and m.user_id = auth.uid()
  )
);
create policy "react write" on public.message_reactions for all
  using (
    auth.uid() = user_id and exists (
      select 1 from public.league_members m
      where m.league_id = message_reactions.league_id and m.user_id = auth.uid()
    )
  )
  with check (auth.uid() = user_id);

alter publication supabase_realtime add table public.message_reactions;

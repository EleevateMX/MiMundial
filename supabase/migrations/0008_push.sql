-- Mi Mundial — suscripciones de notificaciones push (Web Push / VAPID)
create table if not exists public.push_subscriptions (
  endpoint   text primary key,
  user_id    uuid references public.profiles (id) on delete cascade,
  data       jsonb not null,
  created_at timestamptz default now()
);

alter table public.push_subscriptions enable row level security;

create policy "push own" on public.push_subscriptions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- La Edge Function send-push (service role) puede leer todas para enviar.

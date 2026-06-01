-- Mi Mundial — avatar del autor en cada mensaje del chat
alter table public.messages add column if not exists avatar text;

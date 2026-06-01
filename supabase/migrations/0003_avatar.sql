-- Mi Mundial — semilla de avatar generado (no se guardan imágenes, solo texto)
alter table public.profiles add column if not exists avatar text;

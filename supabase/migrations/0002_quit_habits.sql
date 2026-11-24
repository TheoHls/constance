-- Habitudes Quit : cochées d'office depuis quit_since, sauf les jours ratés (done = false).
-- À exécuter une fois dans le SQL Editor de Supabase, avant de déployer l'app. Peut être relancé.

alter table public.habits add column if not exists quit_since date;
alter table public.checkins add column if not exists done boolean not null default true;

update public.habits set quit_since = current_date where type = 'quit' and quit_since is null;

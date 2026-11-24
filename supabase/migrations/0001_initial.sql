-- Constance : habitudes, checks, notes. À exécuter une fois dans le SQL Editor de Supabase.

create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (btrim(name) <> ''),
  description text not null default '',
  type text not null default 'build' check (type in ('build', 'quit')),
  color text not null check (color in (
    'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan',
    'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose', 'neutral'
  )),
  position integer not null default 0,
  created_at timestamptz not null default now(),
  -- Cible des clés étrangères : un check ou une note a le même propriétaire que son habitude.
  unique (id, user_id)
);

create table public.checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  habit_id uuid not null,
  day date not null,
  unique (habit_id, day),
  foreign key (habit_id, user_id) references public.habits (id, user_id) on delete cascade
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  habit_id uuid not null,
  day date not null,
  body text not null check (btrim(body) <> ''),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (habit_id, user_id) references public.habits (id, user_id) on delete cascade
);

create index habits_user_id_idx on public.habits (user_id);
create index checkins_user_id_idx on public.checkins (user_id);
create index notes_user_id_idx on public.notes (user_id);
create index notes_habit_id_idx on public.notes (habit_id);

create function public.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger notes_set_updated_at before update on public.notes
  for each row execute function public.set_updated_at();

-- Chacun ne voit et ne modifie que ses lignes. Aucun accès sans connexion.
alter table public.habits enable row level security;
alter table public.checkins enable row level security;
alter table public.notes enable row level security;

revoke all on public.habits, public.checkins, public.notes from anon;
grant select, insert, update, delete on public.habits, public.checkins, public.notes to authenticated;

create policy "Own habits" on public.habits for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy "Own checkins" on public.checkins for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy "Own notes" on public.notes for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

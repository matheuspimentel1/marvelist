create type public.app_role as enum (
  'user',
  'moderator',
  'admin'
);

create type public.media_format as enum (
  'movie',
  'tv'
);

create type public.media_release_status as enum (
  'released',
  'releasing',
  'not_yet_released'
);

create type public.user_media_status as enum (
  'plan_to_watch',
  'watching',
  'completed'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key
    references auth.users(id)
    on delete cascade,

  username text not null unique,

  display_name text,
  bio text,
  avatar_url text,
  cover_url text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint profiles_username_format_check
    check (username ~ '^[a-z0-9_]{3,30}$'),

  constraint profiles_display_name_length_check
    check (
      display_name is null
      or char_length(display_name) between 1 and 50
    ),

  constraint profiles_bio_length_check
    check (
      bio is null
      or char_length(bio) <= 500
    )
);

create table public.user_roles (
  user_id uuid primary key
    references auth.users(id)
    on delete cascade,

  role public.app_role not null default 'user',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.media (
  id uuid primary key default gen_random_uuid(),

  tmdb_id integer,

  slug text not null unique,

  title text not null,
  original_title text,
  description text,

  format public.media_format not null,

  release_status public.media_release_status not null,

  release_date date,

  poster_url text,
  banner_url text,

  runtime_minutes integer,
  total_episodes integer,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint media_slug_format_check
    check (
      slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    ),

  constraint media_title_not_empty_check
    check (
      char_length(trim(title)) > 0
    ),

  constraint media_runtime_positive_check
    check (
      runtime_minutes is null
      or runtime_minutes > 0
    ),

  constraint media_total_episodes_positive_check
    check (
      total_episodes is null
      or total_episodes > 0
    ),

  constraint media_tmdb_format_unique
    unique (tmdb_id, format)
);

create table public.user_media (
  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  media_id uuid not null
    references public.media(id)
    on delete cascade,

  status public.user_media_status
    not null
    default 'plan_to_watch',

  started_at timestamptz,
  completed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  primary key (user_id, media_id)
);

create index media_browse_idx
on public.media (
  format,
  release_status,
  release_date desc
);

create index user_media_user_status_idx
on public.user_media (
  user_id,
  status
);

create index user_media_media_id_idx
on public.user_media (
  media_id
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger user_roles_set_updated_at
before update on public.user_roles
for each row
execute function public.set_updated_at();

create trigger media_set_updated_at
before update on public.media
for each row
execute function public.set_updated_at();

create trigger user_media_set_updated_at
before update on public.user_media
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.media enable row level security;
alter table public.user_media enable row level security;

create policy "profiles_select_public"
on public.profiles
for select
to anon, authenticated
using (true);

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (
  (select auth.uid()) = id
);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (
  (select auth.uid()) = id
)
with check (
  (select auth.uid()) = id
);

create policy "media_select_public"
on public.media
for select
to anon, authenticated
using (true);

create policy "user_roles_select_own"
on public.user_roles
for select
to authenticated
using (
  (select auth.uid()) = user_id
);

create policy "user_media_select_own"
on public.user_media
for select
to authenticated
using (
  (select auth.uid()) = user_id
);

create policy "user_media_insert_own"
on public.user_media
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
);

create policy "user_media_update_own"
on public.user_media
for update
to authenticated
using (
  (select auth.uid()) = user_id
)
with check (
  (select auth.uid()) = user_id
);

create policy "user_media_delete_own"
on public.user_media
for delete
to authenticated
using (
  (select auth.uid()) = user_id
);

revoke all
on table
  public.profiles,
  public.user_roles,
  public.media,
  public.user_media
from anon, authenticated, service_role;

grant select
on table public.profiles
to anon;

grant select, insert, update
on table public.profiles
to authenticated;

grant select
on table public.media
to anon, authenticated;

grant select
on table public.user_roles
to authenticated;

grant select, insert, update, delete
on table public.user_media
to authenticated;

grant select, insert, update, delete
on table
  public.profiles,
  public.user_roles,
  public.media,
  public.user_media
to service_role;
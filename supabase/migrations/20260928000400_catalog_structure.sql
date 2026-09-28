alter table public.media
drop column if exists total_episodes;

alter table public.media
add column end_date date;

create table public.seasons (
  id uuid primary key
    default gen_random_uuid(),

  media_id uuid not null
    references public.media(id)
    on delete cascade,

  season_number integer not null,

  title text,

  description text,

  poster_url text,

  release_date date,

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now(),

  constraint seasons_number_check
    check (
      season_number >= 0
    ),

  constraint seasons_media_number_unique
    unique (
      media_id,
      season_number
    )
);

create table public.episodes (
  id uuid primary key
    default gen_random_uuid(),

  season_id uuid not null
    references public.seasons(id)
    on delete cascade,

  episode_number integer not null,

  title text not null,

  description text,

  runtime_minutes integer,

  release_date date,

  still_url text,

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now(),

  constraint episodes_number_check
    check (
      episode_number > 0
    ),

  constraint episodes_title_not_empty_check
    check (
      char_length(trim(title)) > 0
    ),

  constraint episodes_runtime_positive_check
    check (
      runtime_minutes is null
      or runtime_minutes > 0
    ),

  constraint episodes_season_number_unique
    unique (
      season_id,
      episode_number
    )
);

create index seasons_media_id_idx
on public.seasons (
  media_id
);

create index episodes_season_id_idx
on public.episodes (
  season_id
);

create index seasons_media_number_idx
on public.seasons (
  media_id,
  season_number
);

create index episodes_season_number_idx
on public.episodes (
  season_id,
  episode_number
);

create trigger seasons_set_updated_at
before update on public.seasons
for each row
execute function public.set_updated_at();

create trigger episodes_set_updated_at
before update on public.episodes
for each row
execute function public.set_updated_at();

alter table public.seasons
enable row level security;

alter table public.episodes
enable row level security;

create policy "seasons_select_public"
on public.seasons
for select
to anon, authenticated
using (true);

create policy "episodes_select_public"
on public.episodes
for select
to anon, authenticated
using (true);

revoke all
on table
  public.seasons,
  public.episodes
from anon, authenticated, service_role;

grant select
on table
  public.seasons,
  public.episodes
to anon, authenticated;

grant select, insert, update, delete
on table
  public.seasons,
  public.episodes
to service_role;
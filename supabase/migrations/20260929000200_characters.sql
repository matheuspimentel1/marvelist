create table public.characters (
  id uuid primary key
    default gen_random_uuid(),

  slug text not null unique,

  name text not null,
  real_name text,

  aliases text[]
    not null
    default '{}',

  description text,

  image_url text,

  birth_date date,
  death_date date,

  height_cm numeric(6, 2),
  weight_kg numeric(6, 2),

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now(),

  constraint characters_slug_format_check
    check (
      slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    ),

  constraint characters_name_not_empty_check
    check (
      char_length(trim(name)) > 0
    ),

  constraint characters_height_positive_check
    check (
      height_cm is null
      or height_cm > 0
    ),

  constraint characters_weight_positive_check
    check (
      weight_kg is null
      or weight_kg > 0
    )
);

create table public.media_characters (
  media_id uuid not null
    references public.media(id)
    on delete cascade,

  character_id uuid not null
    references public.characters(id)
    on delete cascade,

  sort_order integer
    not null
    default 0,

  created_at timestamptz
    not null
    default now(),

  primary key (
    media_id,
    character_id
  ),

  constraint media_characters_sort_order_check
    check (
      sort_order >= 0
    )
);

create table public.character_relations (
  id uuid primary key
    default gen_random_uuid(),

  source_character_id uuid not null
    references public.characters(id)
    on delete cascade,

  target_character_id uuid not null
    references public.characters(id)
    on delete cascade,

  source_relation_type text not null,
  target_relation_type text not null,

  description text,

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now(),

  constraint character_relations_no_self_check
    check (
      source_character_id
      <> target_character_id
    ),

  constraint character_relations_source_type_check
    check (
      source_relation_type
      ~ '^[a-z0-9_]{2,40}$'
    ),

  constraint character_relations_target_type_check
    check (
      target_relation_type
      ~ '^[a-z0-9_]{2,40}$'
    ),

  constraint character_relations_unique
    unique (
      source_character_id,
      target_character_id,
      source_relation_type,
      target_relation_type
    )
);

create index media_characters_character_idx
on public.media_characters (
  character_id
);

create index character_relations_source_idx
on public.character_relations (
  source_character_id
);

create index character_relations_target_idx
on public.character_relations (
  target_character_id
);


create trigger characters_set_updated_at
before update on public.characters
for each row
execute function public.set_updated_at();

create trigger character_relations_set_updated_at
before update on public.character_relations
for each row
execute function public.set_updated_at();

alter table public.characters
enable row level security;

alter table public.media_characters
enable row level security;

alter table public.character_relations
enable row level security;


create policy "characters_select_public"
on public.characters
for select
to anon, authenticated
using (true);


create policy "media_characters_select_public"
on public.media_characters
for select
to anon, authenticated
using (true);


create policy "character_relations_select_public"
on public.character_relations
for select
to anon, authenticated
using (true);


revoke all
on table
  public.characters,
  public.media_characters,
  public.character_relations
from anon, authenticated, service_role;


grant select
on table
  public.characters,
  public.media_characters,
  public.character_relations
to anon, authenticated;


grant select, insert, update, delete
on table
  public.characters,
  public.media_characters,
  public.character_relations
to service_role;
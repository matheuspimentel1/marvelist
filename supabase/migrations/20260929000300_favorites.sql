create table public.favorite_media (
  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  media_id uuid not null
    references public.media(id)
    on delete cascade,

  created_at timestamptz
    not null
    default now(),

  primary key (
    user_id,
    media_id
  )
);


create table public.favorite_characters (
  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  character_id uuid not null
    references public.characters(id)
    on delete cascade,

  created_at timestamptz
    not null
    default now(),

  primary key (
    user_id,
    character_id
  )
);

create index favorite_media_user_created_at_idx
on public.favorite_media (
  user_id,
  created_at desc
);

create index favorite_media_media_idx
on public.favorite_media (
  media_id
);


create index favorite_characters_user_created_at_idx
on public.favorite_characters (
  user_id,
  created_at desc
);

create index favorite_characters_character_idx
on public.favorite_characters (
  character_id
);

alter table public.favorite_media
enable row level security;

alter table public.favorite_characters
enable row level security;

create policy "favorite_media_select_public"
on public.favorite_media
for select
to anon, authenticated
using (true);


create policy "favorite_characters_select_public"
on public.favorite_characters
for select
to anon, authenticated
using (true);

create policy "favorite_media_insert_own"
on public.favorite_media
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
);

create policy "favorite_characters_insert_own"
on public.favorite_characters
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
);

create policy "favorite_media_delete_own"
on public.favorite_media
for delete
to authenticated
using (
  (select auth.uid()) = user_id
);


create policy "favorite_characters_delete_own"
on public.favorite_characters
for delete
to authenticated
using (
  (select auth.uid()) = user_id
);

revoke all
on table
  public.favorite_media,
  public.favorite_characters
from anon, authenticated, service_role;


grant select
on table
  public.favorite_media,
  public.favorite_characters
to anon;


grant select, insert, delete
on table
  public.favorite_media,
  public.favorite_characters
to authenticated;


grant select, insert, update, delete
on table
  public.favorite_media,
  public.favorite_characters
to service_role;
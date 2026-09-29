create table public.user_episode_progress (
  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  episode_id uuid not null
    references public.episodes(id)
    on delete cascade,

  watched_at timestamptz
    not null
    default now(),

  created_at timestamptz
    not null
    default now(),

  primary key (
    user_id,
    episode_id
  )
);

create index user_episode_progress_episode_idx
on public.user_episode_progress (
  episode_id
);

alter table public.user_episode_progress
enable row level security;

create policy "episode_progress_select_own"
on public.user_episode_progress
for select
to authenticated
using (
  (select auth.uid()) = user_id
);

create policy "episode_progress_insert_own"
on public.user_episode_progress
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
);

create policy "episode_progress_delete_own"
on public.user_episode_progress
for delete
to authenticated
using (
  (select auth.uid()) = user_id
);

revoke all
on table public.user_episode_progress
from anon, authenticated, service_role;

grant select, insert, delete
on table public.user_episode_progress
to authenticated;

grant select, insert, update, delete
on table public.user_episode_progress
to service_role;
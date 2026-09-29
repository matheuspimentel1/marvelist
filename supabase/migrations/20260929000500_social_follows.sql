create table public.follows (
  follower_id uuid not null
    references auth.users(id)
    on delete cascade,

  following_id uuid not null
    references auth.users(id)
    on delete cascade,

  created_at timestamptz
    not null
    default now(),

  primary key (
    follower_id,
    following_id
  ),

  constraint follows_no_self_follow_check
    check (
      follower_id <> following_id
    )
);


create index follows_follower_created_at_idx
on public.follows (
  follower_id,
  created_at desc
);


create index follows_following_created_at_idx
on public.follows (
  following_id,
  created_at desc
);

alter table public.follows
enable row level security;

create policy "follows_select_public"
on public.follows
for select
to anon, authenticated
using (true);

create policy "follows_insert_own"
on public.follows
for insert
to authenticated
with check (
  (select auth.uid())
  = follower_id
);

create policy "follows_delete_own"
on public.follows
for delete
to authenticated
using (
  (select auth.uid())
  = follower_id
);

revoke all
on table public.follows
from anon, authenticated, service_role;


grant select
on table public.follows
to anon;


grant select, insert, delete
on table public.follows
to authenticated;


grant select, insert, update, delete
on table public.follows
to service_role;
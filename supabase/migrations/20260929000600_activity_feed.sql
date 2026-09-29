create table public.activities (
  id uuid primary key
    default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  media_id uuid not null
    references public.media(id)
    on delete cascade,

  action public.user_media_status
    not null,

  created_at timestamptz
    not null
    default now()
);

create index activities_created_at_idx
on public.activities (
  created_at desc
);


create index activities_user_created_at_idx
on public.activities (
  user_id,
  created_at desc
);


create index activities_media_idx
on public.activities (
  media_id
);

create or replace function public.log_user_media_activity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.activities (
      user_id,
      media_id,
      action
    )
    values (
      new.user_id,
      new.media_id,
      new.status
    );

  elsif tg_op = 'UPDATE'
    and old.status is distinct from new.status
  then
    insert into public.activities (
      user_id,
      media_id,
      action
    )
    values (
      new.user_id,
      new.media_id,
      new.status
    );
  end if;

  return new;
end;
$$;

create trigger user_media_log_activity
after insert or update of status
on public.user_media
for each row
execute function public.log_user_media_activity();

revoke all
on function public.log_user_media_activity()
from public, anon, authenticated;

alter table public.activities
enable row level security;

create policy "activities_select_public"
on public.activities
for select
to anon, authenticated
using (true);

revoke all
on table public.activities
from anon, authenticated, service_role;


grant select
on table public.activities
to anon, authenticated;


grant select, insert, update, delete
on table public.activities
to service_role;
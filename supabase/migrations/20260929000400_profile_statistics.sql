create or replace function public.get_profile_stats(
  target_user_id uuid
)
returns table (
  completed_movies bigint,
  completed_tv_shows bigint,
  watched_episodes bigint,
  watched_minutes bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    (
      select count(*)
      from public.user_media um
      join public.media m
        on m.id = um.media_id
      where um.user_id = target_user_id
        and um.status = 'completed'
        and m.format = 'movie'
    )::bigint
      as completed_movies,

    (
      select count(*)
      from public.user_media um
      join public.media m
        on m.id = um.media_id
      where um.user_id = target_user_id
        and um.status = 'completed'
        and m.format = 'tv'
    )::bigint
      as completed_tv_shows,

    (
      select count(*)
      from public.user_episode_progress uep
      where uep.user_id = target_user_id
    )::bigint
      as watched_episodes,

    (
      coalesce(
        (
          select sum(m.runtime_minutes)
          from public.user_media um
          join public.media m
            on m.id = um.media_id
          where um.user_id = target_user_id
            and um.status = 'completed'
            and m.format = 'movie'
        ),
        0
      )
      +
      coalesce(
        (
          select sum(e.runtime_minutes)
          from public.user_episode_progress uep
          join public.episodes e
            on e.id = uep.episode_id
          where uep.user_id = target_user_id
        ),
        0
      )
    )::bigint
      as watched_minutes;
$$;

revoke all
on function public.get_profile_stats(uuid)
from public;

grant execute
on function public.get_profile_stats(uuid)
to anon, authenticated, service_role;
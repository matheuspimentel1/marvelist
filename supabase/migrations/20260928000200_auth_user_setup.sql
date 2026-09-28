create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_username text;
  fallback_username text;
  profile_display_name text;
  profile_avatar_url text;
begin
  requested_username :=
    lower(
      trim(
        coalesce(
          new.raw_user_meta_data ->> 'username',
          ''
        )
      )
    );

  fallback_username :=
    'user_' ||
    substr(
      replace(new.id::text, '-', ''),
      1,
      12
    );

  if requested_username !~ '^[a-z0-9_]{3,30}$' then
    requested_username := fallback_username;
  end if;

  profile_display_name :=
    coalesce(
      nullif(
        trim(new.raw_user_meta_data ->> 'full_name'),
        ''
      ),
      nullif(
        trim(new.raw_user_meta_data ->> 'name'),
        ''
      ),
      requested_username
    );

  profile_avatar_url :=
    coalesce(
      nullif(
        new.raw_user_meta_data ->> 'avatar_url',
        ''
      ),
      nullif(
        new.raw_user_meta_data ->> 'picture',
        ''
      )
    );

  insert into public.profiles (
    id,
    username,
    display_name,
    avatar_url
  )
  values (
    new.id,
    requested_username,
    profile_display_name,
    profile_avatar_url
  );

  insert into public.user_roles (
    user_id,
    role
  )
  values (
    new.id,
    'user'
  );

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();
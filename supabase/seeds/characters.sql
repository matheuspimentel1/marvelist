insert into public.characters (
  slug,
  name,
  real_name,
  aliases
)
values
  (
    'iron-man',
    'Iron Man',
    'Tony Stark',
    array['Tony Stark']
  ),
  (
    'loki',
    'Loki',
    null,
    array[]::text[]
  ),
  (
    'wanda-maximoff',
    'Wanda Maximoff',
    null,
    array['Scarlet Witch']
  ),
  (
    'vision',
    'Vision',
    null,
    array[]::text[]
  ),
  (
    'pietro-maximoff',
    'Pietro Maximoff',
    null,
    array['Quicksilver']
  )
on conflict (slug)
do nothing;

insert into public.media_characters (
  media_id,
  character_id,
  sort_order
)
select
  m.id,
  c.id,
  0
from public.media m
join public.characters c
  on c.slug = 'iron-man'
where m.slug = 'iron-man'
on conflict do nothing;


insert into public.media_characters (
  media_id,
  character_id,
  sort_order
)
select
  m.id,
  c.id,
  0
from public.media m
join public.characters c
  on c.slug = 'iron-man'
where m.slug = 'the-avengers'
on conflict do nothing;


insert into public.media_characters (
  media_id,
  character_id,
  sort_order
)
select
  m.id,
  c.id,
  1
from public.media m
join public.characters c
  on c.slug = 'loki'
where m.slug = 'the-avengers'
on conflict do nothing;


insert into public.media_characters (
  media_id,
  character_id,
  sort_order
)
select
  m.id,
  c.id,
  0
from public.media m
join public.characters c
  on c.slug = 'loki'
where m.slug = 'loki'
on conflict do nothing;


insert into public.media_characters (
  media_id,
  character_id,
  sort_order
)
select
  m.id,
  c.id,
  case
    when c.slug = 'wanda-maximoff'
      then 0
    else 1
  end
from public.media m
join public.characters c
  on c.slug in (
    'wanda-maximoff',
    'vision'
  )
where m.slug = 'wandavision'
on conflict do nothing;

insert into public.character_relations (
  source_character_id,
  target_character_id,
  source_relation_type,
  target_relation_type
)
select
  wanda.id,
  vision.id,
  'partner',
  'partner'
from public.characters wanda
cross join public.characters vision
where wanda.slug = 'wanda-maximoff'
and vision.slug = 'vision'
on conflict do nothing;


insert into public.character_relations (
  source_character_id,
  target_character_id,
  source_relation_type,
  target_relation_type
)
select
  wanda.id,
  pietro.id,
  'sibling',
  'sibling'
from public.characters wanda
cross join public.characters pietro
where wanda.slug = 'wanda-maximoff'
and pietro.slug = 'pietro-maximoff'
on conflict do nothing;
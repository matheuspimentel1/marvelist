insert into public.media (
  slug,
  title,
  format,
  release_status,
  release_date
)
values
  (
    'iron-man',
    'Iron Man',
    'movie',
    'released',
    '2008-05-02'
  ),
  (
    'the-avengers',
    'The Avengers',
    'movie',
    'released',
    '2012-05-04'
  ),
  (
    'wandavision',
    'WandaVision',
    'tv',
    'released',
    '2021-01-15'
  ),
  (
    'loki',
    'Loki',
    'tv',
    'released',
    '2021-06-09'
  )
on conflict (slug)
do nothing;
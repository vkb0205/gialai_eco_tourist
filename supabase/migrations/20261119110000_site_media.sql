insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

create policy "Public can read site media"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'site-media');

create table public.tour_images (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references public.tours(id) on delete cascade,
  path text not null,
  sort int not null default 0,
  alt text,
  is_cover boolean not null default false,
  created_at timestamptz not null default now(),
  unique (tour_id, path)
);

create unique index tour_images_one_cover
  on public.tour_images (tour_id)
  where is_cover;

alter table public.tour_images enable row level security;
revoke all on public.tour_images from anon, authenticated;
grant select on public.tour_images to anon, authenticated;

create policy "Public can read tour images"
  on public.tour_images
  for select
  to anon, authenticated
  using (true);

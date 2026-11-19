-- Gia Lai Eco Tourist initial catalogue schema.
-- This migration deliberately publishes catalogue data only. Enquiries, bookings,
-- payments, and supplier operations require separate migrations and policies.

create extension if not exists pgcrypto;

create type public.catalogue_status as enum ('draft', 'published', 'archived');
create type public.tour_group as enum ('domestic', 'international', 'special');
create type public.tour_difficulty as enum ('de', 'vua', 'kho');
create type public.vehicle_category as enum ('sedan', 'suv', 'van', 'minibus', 'bus', 'pickup');
create type public.vehicle_transmission as enum ('auto', 'manual');
create type public.vehicle_fuel as enum ('xang', 'dau', 'dien', 'hybrid');
create type public.vehicle_driver_option as enum ('co-tai-xe', 'tu-lai');

create table public.regions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  characterisation text not null,
  image_url text,
  display_order integer not null check (display_order >= 0),
  status public.catalogue_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tours (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  region_id uuid not null references public.regions(id) on delete restrict,
  tour_group public.tour_group not null,
  category text not null,
  theme text not null,
  duration_days integer not null check (duration_days > 0),
  duration_label text not null,
  price_vnd numeric(19, 0) not null check (price_vnd >= 0),
  difficulty public.tour_difficulty not null,
  group_max integer not null check (group_max > 0),
  departure_months smallint[] not null check (cardinality(departure_months) > 0 and departure_months <@ array[1,2,3,4,5,6,7,8,9,10,11,12]::smallint[]),
  image_url text,
  blurb text not null,
  highlights text[] not null default '{}',
  impact text not null,
  status public.catalogue_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_tours_have_date check (status <> 'published' or published_at is not null)
);

create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  brand text not null,
  category public.vehicle_category not null,
  seats smallint not null check (seats > 0),
  luggage_capacity smallint not null check (luggage_capacity >= 0),
  transmission public.vehicle_transmission not null,
  fuel public.vehicle_fuel not null,
  price_per_day_vnd numeric(19, 0) not null check (price_per_day_vnd >= 0),
  driver_option public.vehicle_driver_option not null,
  region_slugs text[] not null check (cardinality(region_slugs) > 0),
  image_url text,
  blurb text not null,
  features text[] not null default '{}',
  b2b_capable boolean not null default false,
  status public.catalogue_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_vehicles_have_date check (status <> 'published' or published_at is not null)
);

create index tours_published_region_idx on public.tours (region_id, slug) where status = 'published';
create index vehicles_published_idx on public.vehicles (slug) where status = 'published';

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger regions_set_updated_at before update on public.regions for each row execute function public.set_updated_at();
create trigger tours_set_updated_at before update on public.tours for each row execute function public.set_updated_at();
create trigger vehicles_set_updated_at before update on public.vehicles for each row execute function public.set_updated_at();

alter table public.regions enable row level security;
alter table public.tours enable row level security;
alter table public.vehicles enable row level security;

create policy "Published regions are publicly readable" on public.regions for select using (status = 'published');
create policy "Published tours are publicly readable" on public.tours for select using (status = 'published');
create policy "Published vehicles are publicly readable" on public.vehicles for select using (status = 'published');

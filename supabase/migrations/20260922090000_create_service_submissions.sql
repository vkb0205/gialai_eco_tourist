-- Public form submissions are intentionally write-only for visitors.
-- Staff and integrations should read them through an authenticated backend or
-- a service-role Edge Function; never grant anonymous SELECT access.

create table if not exists public.service_submissions (
  id uuid primary key default gen_random_uuid(),
  service_key text not null check (
    service_key in ('general', 'car', 'visa', 'flight')
  ),
  contact_name text not null check (
    length(btrim(contact_name)) between 2 and 120
  ),
  phone text not null check (
    length(btrim(phone)) between 6 and 32
  ),
  email text check (
    email is null or length(btrim(email)) between 3 and 254
  ),
  preferred_contact_time text check (
    preferred_contact_time is null or length(preferred_contact_time) <= 120
  ),
  details jsonb not null default '{}'::jsonb check (
    jsonb_typeof(details) = 'object'
  ),
  source_path text not null default '/' check (
    length(source_path) between 1 and 500
  ),
  privacy_consent boolean not null default false,
  privacy_consent_at timestamptz not null default timezone('utc'::text, now()),
  status text not null default 'new' check (
    status in ('new', 'in_progress', 'contacted', 'closed', 'spam')
  ),
  internal_notes text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  constraint service_submissions_privacy_consent_check check (privacy_consent)
);

comment on table public.service_submissions is
  'Customer enquiries submitted from the public website. Anonymous clients may insert only; reads are backend-only.';
comment on column public.service_submissions.details is
  'Service-specific fields such as route, date, passenger count, or visa purpose. Do not store secrets here.';

create index if not exists service_submissions_status_created_at_idx
  on public.service_submissions (status, created_at desc);

create index if not exists service_submissions_service_created_at_idx
  on public.service_submissions (service_key, created_at desc);

drop trigger if exists service_submissions_set_updated_at on public.service_submissions;
create trigger service_submissions_set_updated_at
  before update on public.service_submissions
  for each row execute function public.set_updated_at();

alter table public.service_submissions enable row level security;

revoke all on table public.service_submissions from anon, authenticated;
grant insert (
  service_key,
  contact_name,
  phone,
  email,
  preferred_contact_time,
  details,
  source_path,
  privacy_consent
) on table public.service_submissions to anon, authenticated;

drop policy if exists service_submissions_public_insert on public.service_submissions;
create policy service_submissions_public_insert
  on public.service_submissions
  for insert
  to anon, authenticated
  with check (
    privacy_consent = true
    and service_key in ('general', 'car', 'visa', 'flight')
  );

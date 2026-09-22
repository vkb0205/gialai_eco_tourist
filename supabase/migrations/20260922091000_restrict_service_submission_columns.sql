-- Keep browser inserts limited to visitor-supplied fields. Status, notes and
-- timestamps are backend-owned even though the table itself is write-only.
revoke insert on table public.service_submissions from anon, authenticated;
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

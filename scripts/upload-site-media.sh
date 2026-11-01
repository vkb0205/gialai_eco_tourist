#!/usr/bin/env bash
# Uploads the festival hero banner to the project's public `public-media` bucket
# (the same bucket that holds the homepage/ and tours/ images).
#
# One-time setup, from a normal terminal (the CLI needs the project owner's account):
#   env -u AI_AGENT -u CLAUDECODE supabase login --output-format text
#   supabase link --project-ref <ref from VITE_SUPABASE_URL>
#
# Re-running overwrites the same object path, which src/data/siteMedia.ts reads.
set -euo pipefail

cd "$(dirname "$0")/.."

supabase storage cp --linked --experimental \
  --content-type image/webp \
  --cache-control "max-age=86400" \
  supabase/assets/festival-cong-chieng-2026.webp \
  ss:///public-media/homepage/festival-cong-chieng-2026.webp

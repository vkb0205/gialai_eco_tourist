#!/usr/bin/env bash
# Runs ON THE VPS (piped over SSH by .github/workflows/deploy-vps.yml).
# Usage: bash -s -- <release_id> < publish.sh
#
# Expects the uploaded archive at ~/releases/gialai-<release_id>.tar.gz.
# Publishes assets first and index.html last, keeps old hashed assets so
# open browser tabs keep working, and backs up the previous site first.
set -euo pipefail

release_id="${1:?release id required}"
webroot="${WEBROOT:-/var/www/gialai-eco-tourist}"
keep_backups="${KEEP_BACKUPS:-10}"

releases="$HOME/releases"
backups="$HOME/backups"
archive="$releases/gialai-$release_id.tar.gz"
stage="$releases/stage-$release_id"
backup="$backups/site-$release_id.tar.gz"

test -f "$archive"
test -w "$webroot"
rm -rf "$stage"
mkdir -p "$stage" "$backups"
chmod 700 "$backups"

tar -xzf "$archive" -C "$stage"
test -s "$stage/index.html"
test -d "$stage/assets"
if grep -q '/gialai_eco_tourist/assets/' "$stage/index.html"; then
  echo "Refusing to publish: index.html uses the GitHub Pages base path" >&2
  exit 1
fi

# Back up what is currently served.
tar -czf "$backup" -C "$webroot" .

# Everything except index.html first, then swap index.html atomically.
find "$stage" -mindepth 1 -maxdepth 1 ! -name index.html \
  -exec cp -a -t "$webroot" {} +
find "$webroot" -type d -exec chmod 755 {} +
find "$webroot" -type f -exec chmod 644 {} +
install -m 644 "$stage/index.html" "$webroot/.index.next.html"
mv -f "$webroot/.index.next.html" "$webroot/index.html"

# Housekeeping: drop staging/archive, keep the newest N backups.
rm -rf "$stage" "$archive"
ls -1t "$backups"/site-*.tar.gz 2>/dev/null | tail -n +"$((keep_backups + 1))" | xargs -r rm -f

printf 'Published release %s\nBackup %s\n' "$release_id" "$backup"

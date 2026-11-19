# Site images

1. From `frontend/`, run `npm install` to install Sharp and the project dependencies.
2. Create `frontend/.env.local` with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
3. Run `node scripts/upload-images.mjs --dry-run` and review the paths and sizes.
4. After applying the migration, run `node scripts/upload-images.mjs`; add `--client` only after those tours are approved.
5. Deploy the frontend after the upload completes and the image URLs are verified.

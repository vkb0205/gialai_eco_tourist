# Supabase Transfer TODO

Use this checklist to move the agency’s reviewed content from:

`/Users/mac/Dev/Triad_Intelli_Stu/data/GL_Eco_Tourist`

into the Supabase schema described in [spec.md](./spec.md), then make the existing web app read the published records.

## Transfer rules

- [ ] Treat Word/PDF files as source material, not as one public tour per filename.
- [ ] Create one `tours` row per approved public catalogue page.
- [ ] Keep revisions, customer-specific quotations, and original files private.
- [ ] Never publish a blank price as zero.
- [ ] Never turn a price group such as “10–12 guests” into a maximum capacity.
- [ ] Preserve departure wording such as “every Friday” instead of inventing dates.
- [ ] Do not publish a tour until title, route, duration, itinerary, price, conditions, and media have been reviewed.

## 0. Confirm the target

- [ ] Create a Supabase account/organization for the agency.
- [ ] Create one project for the first release.
- [ ] Record the project URL and publishable/anonymous key.
- [ ] Choose the project region closest to the agency’s primary visitors.
- [ ] Decide who is allowed to review and publish content in the Supabase Dashboard.
- [ ] Confirm the first release contains tours, regions, media, and future blog posts only.
- [ ] Confirm booking, payment, availability, enquiries, vehicle rental, and general services are outside this transfer.

## 1. Inventory the source archive

The current archive contains approximately 26 `.doc` files, one `.docx`, three PDFs, and one unrelated Pages file. Most tour documents are three days/two nights or four days/three nights; one is five days/four nights.

- [ ] Make a private inventory of every source filename, extension, size, and modified date.
- [x] Exclude the unrelated Pages document from the tour import.
- [ ] Preserve every original file in a private backup location.
- [x] Calculate a SHA-256 hash for each source file.
- [x] Register each file in `content_private.source_documents`.
- [ ] Store original files in the private `source-originals` Storage bucket.
- [ ] Record extraction failures or unreadable files for manual review.

## 2. Review and consolidate documents

- [ ] Convert each candidate document into reviewable text without changing the original.
- [ ] Extract candidate title, route, duration, transport, departure wording, itinerary, hotels, meals, prices, inclusions, exclusions, child rules, surcharges, cancellation terms, and contact details.
- [ ] Group near-duplicate documents by route and duration.
- [ ] Identify which files are canonical brochures, revisions, and customer-specific quotations.
- [ ] Decide whether a difference is a new public tour or only a revision of an existing tour.
- [ ] Remove customer names from public titles, slugs, summaries, and media captions.
- [ ] Resolve documents whose stated nights do not match their listed accommodation.
- [ ] Confirm whether each price is per person or per group.
- [ ] Confirm each price’s minimum and maximum applicable guest count.
- [ ] Confirm price validity dates when the document gives them.
- [ ] Mark missing, conflicting, or stale prices as requiring agency confirmation.
- [ ] Confirm departure dates, weekly schedules, month/year labels, and holiday restrictions.
- [ ] Confirm whether any difficulty or community-impact statement is actually supported.
- [ ] Mark every candidate as `unreviewed`, `in_review`, `approved`, or `rejected`.

## 3. Create the Supabase schema

- [ ] Create a migration file for the public tables:
  - [ ] `regions`
  - [ ] `tours`
  - [ ] `tour_itinerary_days`
  - [ ] `tour_price_options`
  - [ ] `media_assets`
  - [ ] `tour_media`
  - [ ] `blog_posts`
- [x] Create the private `content_private` schema.
- [x] Create `content_private.source_documents`.
- [x] Create `content_private.source_document_tours`.
- [x] Add UUID primary keys and timestamp columns.
- [x] Add foreign keys and cascade rules for itinerary, price, and media children.
- [x] Add unique constraints for public slugs.
- [x] Add checks for positive duration and guest values.
- [x] Add checks for ordered guest ranges and validity dates.
- [x] Add checks so published tours require `published_at` and `last_reviewed_at`.
- [x] Add checks so published price options require `verified_at`.
- [x] Add the partial unique index for one card price per tour.
- [x] Add the partial unique index for one cover media row per tour.
- [x] Add indexes for published tours, regions, price, duration, itinerary order, price options, posts, and media order.
- [x] Add an `updated_at` trigger for editable public tables.
- [x] Apply the migration to the Supabase project.
- [ ] Confirm the migration can be applied again safely in a clean test project.

## 4. Configure security and Storage

- [x] Enable Row Level Security on every public content table.
- [x] Allow anonymous reads only for published tours.
- [x] Allow anonymous reads of itinerary days only when their tour is published.
- [x] Allow anonymous reads of published price options only when their tour is published.
- [x] Allow anonymous reads of active regions.
- [x] Allow anonymous reads of published blog posts whose `published_at` has arrived.
- [x] Deny anonymous insert, update, and delete access.
- [x] Ensure the `content_private` schema is not exposed through the public API.
- [ ] Create a public `public-media` bucket for approved images and brochures.
- [ ] Create a private `source-originals` bucket for Word/PDF originals and quotations.
- [ ] Add Storage policies matching the public/private rules.
- [ ] Confirm a browser using the publishable/anonymous key cannot read source originals.
- [ ] Keep the service-role key out of the frontend and repository.

## 5. Seed lookup and content records

- [x] Seed the eight existing region rows with stable slugs and display order.
- [ ] Do not create sample tours merely to fill an empty region.
- [ ] Build a review CSV or JSON file containing only approved tour records.
- [ ] Create one `tours` row for each approved public page.
- [ ] Store duration as `duration_days` and `duration_nights`; derive the display label in the app.
- [ ] Store the agency’s reviewed route in `destinations`.
- [ ] Store `departure_text` exactly as approved.
- [ ] Populate `departure_months` only when the source supports the months.
- [ ] Store `starting_price_vnd` only when the agency approves a card price.
- [ ] Leave `starting_price_vnd` null when the correct display is contact pricing.
- [ ] Set `group_max` only for a confirmed tour capacity.
- [ ] Store group-qualified prices in `tour_price_options`.
- [ ] Add one ordered `tour_itinerary_days` row per itinerary day.
- [ ] Store inclusions, exclusions, child policy, surcharges, cancellation terms, accommodation notes, and transport notes.
- [ ] Keep unverified theme, difficulty, and impact values null.
- [x] Start every imported record as `draft`.
- [ ] Set `last_reviewed_at` only after agency review.
- [ ] Set `published` only after all required fields are approved.
- [ ] Leave `blog_posts` empty until actual blog content is available; the current Journal section is only a photo gallery.

## 6. Upload and link media

- [ ] Select the approved cover image for each public tour.
- [ ] Resize and compress images for web delivery.
- [ ] Write useful Vietnamese alternative text for every public image.
- [ ] Upload approved images to `public-media`.
- [ ] Upload only approved public brochures to `public-media`.
- [ ] Upload source Word/PDF files to `source-originals`.
- [ ] Insert one `media_assets` row per file.
- [ ] Link covers, galleries, and brochures through `tour_media`.
- [ ] Confirm each tour has at most one cover.
- [ ] Confirm every public media path resolves without exposing a private path.
- [ ] Verify image dimensions, MIME types, and file sizes.

## 7. Import in a small pilot first

Use three representative documents before importing the whole archive:

- [ ] A standard three-day/two-night tour.
- [ ] A four-day tour with different prices for different group sizes.
- [ ] A document with a blank, conflicting, or otherwise uncertain price.

For the pilot:

- [x] Register the three source documents privately.
- [x] Create draft tour records.
- [x] Add itinerary days and price options.
- [x] Link each draft to its source document.
- [ ] Review the records in the Supabase Table Editor.
- [x] Confirm the public query returns no drafts.
- [ ] Publish only after the agency signs off.
- [ ] Test the public query and media URLs.
- [ ] Adjust the import mapping before the bulk transfer.

## 8. Bulk transfer approved records

- [ ] Export the reviewed tour rows, itinerary rows, price rows, and media metadata as an import package.
- [ ] Import approved tours in batches.
- [ ] Import itinerary days after their parent tours exist.
- [ ] Import price options after their parent tours exist.
- [ ] Import media metadata after Storage uploads complete.
- [ ] Create source-document links for every imported tour.
- [ ] Re-run duplicate-slug and duplicate-route checks.
- [ ] Check for tours with no itinerary, no cover, or no reviewed price status.
- [ ] Check for published tours with missing review timestamps.
- [ ] Count records by status and region.
- [ ] Record rejected and deferred source files for a later review cycle.

## 9. Connect the existing frontend

- [ ] Add `@supabase/supabase-js` to the web app.
- [ ] Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to local development.
- [ ] Create one Supabase client module.
- [ ] Generate or write TypeScript types for the database tables.
- [ ] Create one tour repository/loader for published tours and related cover media.
- [ ] Replace the static `src/data/tours.ts` import in Explore with the loader.
- [ ] Replace the separate homepage experience list with the same published tour data.
- [ ] Preserve the existing browser-side filtering and sorting.
- [ ] Derive `durationLabel` from days and nights.
- [ ] Map a null card price to “Liên hệ để biết giá”.
- [ ] Prevent null prices from entering numeric price filters.
- [ ] Hide group capacity when `group_max` is null.
- [ ] Do not display a quoted price range as a capacity.
- [ ] Add loading, unavailable, empty, and populated states for remote content.
- [ ] Keep the current hash routing and GitHub Pages deployment.
- [ ] Decide whether to add a tour-detail route so imported itinerary data is visible to visitors.
- [ ] Add the future blog route only after `blog_posts` has real content.

## 10. Verify before launch

- [ ] Query the public API with the anonymous key and confirm only published records appear.
- [ ] Confirm draft and archived tours are invisible.
- [ ] Confirm unpublished itinerary days and price options are invisible.
- [ ] Confirm future blog posts are invisible until their publication time.
- [ ] Confirm private source documents and original filenames are inaccessible.
- [ ] Confirm a blank price displays contact pricing.
- [ ] Confirm a 10–12 guest price does not set `group_max = 12`.
- [ ] Confirm weekly schedules are displayed as wording, not invented dates.
- [ ] Confirm homepage and Explore show the same title, summary, duration, cover, and price.
- [ ] Confirm region, duration, season, group, theme, difficulty, keyword, and price filters behave correctly with null values.
- [ ] Confirm broken or missing media leaves the tour text readable.
- [ ] Confirm Vietnamese diacritic-insensitive search still works.
- [ ] Run `npm run lint` and `npm run build`.
- [ ] Test the production build with the real Supabase environment variables.
- [ ] Test the deployed GitHub Pages site on mobile and desktop.
- [ ] Review published content with the agency before switching all approved rows to `published`.

## 11. Backup and operating routine

- [ ] Export a database backup after the pilot.
- [ ] Export a database backup after the bulk transfer.
- [ ] Keep the original archive unchanged.
- [ ] Keep a record of each import date and migration version.
- [ ] Review prices, schedules, accommodation, and policy wording before their next use.
- [ ] Archive superseded public tours rather than deleting them.
- [ ] Monitor Supabase database, file storage, and egress usage.
- [ ] Document the Free-plan inactivity-pause behavior.
- [ ] Decide when reliable always-on availability justifies a paid plan.

## Definition of done

The transfer is complete when:

- [ ] Approved public tours exist in Supabase with ordered itineraries, reviewed prices, and linked media.
- [ ] Source files and customer-specific quotations remain private.
- [ ] Anonymous reads are protected by Row Level Security.
- [ ] Homepage and Explore read the same Supabase data.
- [ ] The app handles contact pricing, missing optional data, loading, and failures honestly.
- [ ] The pilot and bulk-import checks pass.
- [ ] The agency has reviewed and approved the published catalogue.

# Gia Lai Eco Tourist — 1.5-Week MVP Plan

**Planning window:** September 14–23, 2026  
**MVP target:** Wednesday, September 23, 2026  
**Approach:** Iterative preview deployments with controlled production data changes

## MVP objective

Connect the existing React/Vite frontend to Supabase as the source of truth for reviewed public tour content, while preserving the current Homepage and Explore experience.

The MVP should publish a minimum of three fully verified tours, with a target of 8–12 if content review allows. The catalogue must not be padded with unverified records.

## Included in the MVP

- Supabase-backed published tours and regions
- Shared tour data between the Homepage and Explore page
- Existing Explore search, filters, sorting, pagination, and URL state
- Loading, unavailable, empty, missing-price, and failed-image states
- Draft-first content import and publishing workflow
- Mobile, keyboard, accessibility, performance, and deployment checks

## Deferred after MVP

- Online booking, payment, accounts, and confirmation emails
- Admin/editor dashboard
- Blog UI and article routes
- Tour detail pages
- Vehicle rental and general-service migration
- Automated document extraction that publishes content without review

## Schedule

### Monday, September 14 — Scope and safety setup

- Freeze the MVP scope and acceptance criteria.
- Confirm the Supabase project, publishable credentials, and required environments.
- Establish the preview-deployment workflow.
- Back up existing content and document the rollback approach.

**Checkpoint:** Scope, environments, and safety rules are agreed.

### Tuesday, September 15 — Supabase foundation

- Create the tours, regions, media, posts, and private source-document structures.
- Configure Storage for approved public media.
- Add Row Level Security policies for anonymous read-only access.
- Use versioned, additive migrations only during the MVP window.

**Checkpoint:** Database foundation is ready without exposing private source material.

### Wednesday, September 16 — Frontend data layer

- Add the typed Supabase client and shared tour repository.
- Add environment configuration without embedding secrets.
- Map Supabase records into the shared tour shape used by Homepage and Explore.
- Add remote loading and unavailable states.

**Checkpoint:** The frontend can read published content from Supabase.

### Thursday, September 17 — Content preparation

- Review source brochures and quotations.
- Group likely duplicates for human review.
- Select canonical tour records.
- Import selected records as drafts.
- Prepare approved media, dimensions, captions, and alternative text.

**Checkpoint:** First content preview is available.

### Friday, September 18 — Explore integration

- Connect Explore to published Supabase tours.
- Preserve filtering, search, sorting, pagination, URL sharing, and browser history.
- Ensure filters use only verified fields.
- Publish the first approved records.

**Checkpoint:** Preview deployment 1.

### Saturday, September 19 — Homepage integration

- Remove the duplicate hard-coded homepage tour list.
- Load featured tours from the same published query used by Explore.
- Confirm edits and featured flags are reflected consistently on both pages.

### Sunday, September 20 — Resilience and content safety

- Handle null or unavailable prices, difficulty, dates, images, and other fields.
- Display “Liên hệ để biết giá” when no verified starting price exists.
- Confirm Supabase failure shows an honest unavailable state rather than sample inventory.
- Verify draft and archived content cannot appear publicly.

**Checkpoint:** Preview deployment 2.

### Monday, September 21 — MVP release candidate

- Test mobile layouts and filter controls.
- Test keyboard operation, focus states, live result updates, and image alternatives.
- Check performance and layout stability.
- Run cross-browser checks.
- Verify the production build and GitHub Pages compatibility.

**Checkpoint:** MVP release candidate.

### Tuesday, September 22 — Acceptance and rollback check

- Run end-to-end acceptance tests.
- Verify Row Level Security from an anonymous visitor perspective.
- Recheck content accuracy and source references.
- Confirm the previous frontend build can be restored.
- Fix only launch-blocking issues.

**Checkpoint:** Production-ready or explicitly blocked with a small issue list.

### Wednesday, September 23 — MVP release

- Deploy the approved frontend build.
- Publish only reviewed content.
- Monitor the live app and fix launch-blocking issues only.

**Checkpoint:** MVP is live.

## Deployment and data-safety rules

- Create a preview deployment after each meaningful frontend change.
- Keep development/staging data separate from production data where possible.
- Import all new content as drafts and publish only after review.
- Use stable IDs and slugs so edits affect the intended records.
- Never delete or overwrite published content automatically.
- Avoid destructive database migrations during this window.
- Keep the previous frontend build available for rollback.
- Do not use illustrative sample data as a public fallback when Supabase is unavailable.
- Do not reset browser, account, or future user preferences during deployment.

## MVP release gate

The MVP is ready only when:

1. Published content loads from Supabase.
2. Draft and archived records remain invisible to visitors.
3. Homepage and Explore use the same tour records.
4. Missing prices are represented honestly and never as zero.
5. Filters and URL state work after remote loading.
6. Supabase failure produces a clear unavailable state.
7. Mobile, keyboard, and basic accessibility flows pass.
8. The production build and deployment succeed.
9. Frontend rollback is possible without modifying user data.

## Required inputs

- Supabase project and publishable client credentials
- Agency confirmation of publishable tours, prices, dates, policies, and images
- Canonical source-document decisions by September 16
- A reviewer available during the first week for content approval

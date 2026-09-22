# Form Submission Solution

## Base architecture

```text
Form → Supabase service_submissions → staff workflow → optional integrations
```

Supabase is the source of truth. Google Sheets, Zalo, email, or a CRM should consume stored submissions afterward rather than replace the database.

## Stored submission

Each form submission becomes one row in `public.service_submissions`:

| Field | Purpose |
| --- | --- |
| `id` | Unique submission identifier |
| `service_key` | `general`, `car`, `visa`, or `flight` |
| `contact_name` | Customer name |
| `phone` | Customer phone number |
| `email` | Optional email address |
| `preferred_contact_time` | Optional preferred contact time |
| `details` | JSON containing service-specific fields |
| `source_path` | Page or route where the form was submitted |
| `privacy_consent` | Whether the customer agreed to consultation contact |
| `status` | `new`, `in_progress`, `contacted`, `closed`, or `spam` |
| `created_at` | Submission timestamp |
| `updated_at` | Last update timestamp |

Example `details` value:

```json
{
  "from": "Sân bay Pleiku",
  "to": "Măng Đen",
  "date": "2026-10-10",
  "guests": "4",
  "note": "Có nhiều hành lý"
}
```

## Service-specific fields

General contact form:

```json
{
  "date": "Tháng 10, 2026",
  "group": "3-6",
  "note": "Trekking và văn hóa"
}
```

Car rental:

```json
{
  "vehicle": "Xe 4-7 chỗ",
  "from": "Sân bay Pleiku",
  "to": "Măng Đen",
  "date": "2026-10-10",
  "guests": "4",
  "note": ""
}
```

Visa:

```json
{
  "country": "Nhật Bản",
  "date": "2026-11-02",
  "purpose": "Du lịch",
  "people": "2",
  "note": ""
}
```

Flight:

```json
{
  "trip": "Khứ hồi",
  "from": "TP. Hồ Chí Minh",
  "to": "Pleiku",
  "date": "2026-10-10",
  "return_date": "2026-10-14",
  "passengers": "3",
  "flight_class": "Phổ thông"
}
```

## Workflow

```text
new → in_progress → contacted → closed
                         ↘ spam
```

The visitor only creates the submission. Staff or a backend process updates the status and internal notes.

## Security model

- The browser uses only the Supabase publishable key.
- Anonymous visitors can insert valid submissions.
- Anonymous visitors cannot read submissions.
- Anonymous visitors cannot set `status` or `internal_notes`.
- Privacy consent is required before submitting.
- Do not store passport numbers, visa documents, passwords, or other secrets in `details`.
- Visa documents should use a separate private file-upload flow with signed URLs.

For the current MVP, the browser inserts directly into Supabase with RLS protection. Before high-volume public traffic, move the insert behind a Supabase Edge Function with rate limiting and CAPTCHA support.

## Extending the flow

Use the stored row as the event source:

```text
service_submissions
        ↓
Database webhook
        ↓
Supabase Edge Function
        ├── append to Google Sheets
        ├── send email notification
        ├── notify staff through Zalo OA
        └── create or update a CRM record
```

External integrations should be asynchronous. If Sheets or Zalo is temporarily unavailable, the original submission remains safely stored in Supabase and can be retried later.

Google Sheets should be an operational mirror, not the primary database. Include `submission_id` in the sheet so retries do not create duplicate rows.

Zalo OAuth should authorize the company’s Zalo Official Account on the backend. It should not be required for a visitor to submit an enquiry. Store Zalo credentials and tokens only in the Edge Function environment.

## Current implementation

- Storage migration: `supabase/migrations/20260922090000_create_service_submissions.sql`
- Column-permission hardening: `supabase/migrations/20260922091000_restrict_service_submission_columns.sql`
- Submission client: `src/lib/submitServiceSubmission.ts`
- General form: `src/pages/HomePage.tsx`
- Other service forms: `src/pages/ServicesPage.tsx`

# Gia Lai Eco Tourist — source-grounded catalogue

This file records the source-grounded catalogue pass. The public source of truth is Supabase; this ledger makes the editorial decisions visible in the repository without copying the original Word/PDF files.

## Import status — 2026-09-21

- Local source archive inspected: `/Users/mac/Dev/Triad_Intelli_Stu/data/GL_Eco_Tourist`.
- Source set: 30 documents — 27 Word files and 3 PDF copies/variants.
- Supabase catalogue after the import: 14 `published`, 5 `draft`, 24 `archived` seed rows.
- Every local source document is linked to a canonical tour through `content_private.source_document_tours`.
- The 24 archived rows are the old illustrative/placeholder records; they were archived, not deleted, and have no local source link.
- A price or departure date is never invented: blank prices remain `NULL`; dated files whose departure has passed remain draft until revalidated.

## Published

### Pleiku – Kon Tum – Măng Đen (3 ngày 2 đêm)

- Supabase slug: `pleiku-kon-tum-mang-den-3n2d-ghep-doan`
- Source: `04.2026 Ghép tour PK - KT - MĐ 3n2đ.doc`
- Route: Pleiku, Kon Tum, Măng Đen
- Departure wording: Friday departures are retained as wording from the source; flight and pickup details are reconfirmed before travel.
- Card price: `3.590.000đ / khách`, for groups from 4 guests.
- Itinerary: 3 ordered days with meals and overnight locations.
- Editorial status: published with source-derived content; price and schedule are reconfirmed at enquiry time.

### Pleiku – Kon Tum – Măng Đen – Buôn Ma Thuột (4 ngày 3 đêm)

- Supabase slug: `pleiku-kon-tum-mang-den-buon-ma-thuot-4n3d-ghep-doan`
- Source: `04.2026 Ghép tour PK - KT - MĐ - BMT 4n3đ.doc`
- Route: Pleiku, Kon Tum, Măng Đen, Buôn Ma Thuột
- Departure wording: the source contains both a 2026 departure note and a weekly Thursday note; the website preserves that conflict and asks the agency to confirm the actual date.
- Card price: `4.845.000đ / khách`, for groups of 10–12 guests.
- Additional quote: `5.300.000đ / khách` for a group of 5, kept as a non-card published option.
- Itinerary: 4 ordered days, including the Buôn Đôn or Hồ Lắk alternative on day 3.
- Editorial status: published with source-derived content; price, departure date and optional activities are reconfirmed at enquiry time.

## Additional published source-backed tours

| Supabase slug | Source | Source price | Notes |
| --- | --- | ---: | --- |
| `pleiku-kon-tum-mang-den-3n2d-ghep-tay-nguyen-2026` | `3.2026 Ghép TN. PK - ngủ MĐ -KT 3n2đ (1).doc` | 4.345.000đ | 3N2Đ; đoàn 5–7 khách |
| `hanoi-pleiku-mang-den-cot-moc-3n2d` | `HN - PK - MĐ- Cột mốc - KT 3n2đ (1).doc` | 3.145.000đ | 3N2Đ; đoàn 10–12 khách; variants retained as supporting sources |
| `hai-phong-buon-ma-thuot-3n2d` | `HP - BMT 3n2đ.doc` | 3.345.000đ | 3N2Đ; đoàn 15–20 khách |
| `hai-phong-buon-ma-thuot-pleiku-mang-den-4n3d` | `Hai phong ... 04n3d.01.doc` | 4.850.000đ | 4N3Đ; đoàn 10–12 khách |
| `hanoi-buon-ma-thuot-pleiku-4n3d` | `Ha noi - Buon Ma Thuot -PLEIKU- Ha noi 04n03dem.doc` | 4.845.000đ | 4N3Đ; khởi hành từ 4 khách |

## Draft — not public

### Pleiku – Kon Tum – Măng Đen (3 ngày 2 đêm) — cần xác nhận giá

- Supabase slug: `pleiku-kon-tum-mang-den-3n2d-ghep-t6-can-xac-nhan`
- Source: `Ghép T6 hàng tuần PK - ngủ MĐ -KT 3n2đ, Ms Quynh Mai.doc`
- Reason held as draft: the source has a blank tour price.
- Rule: a blank price stays `NULL` and never becomes zero or a public card price.

### Other imported source drafts

- `hanoi-pleiku-cot-moc-buon-ma-thuot-2n1d`: source date `13/08/2026` has passed; price and route are retained for revalidation.
- `hanoi-pleiku-mang-den-cot-moc-kon-ka-kinh-4n3d`: source date `29/08/2026` has passed; the 4-day itinerary and 4.975.000đ source price are retained as draft.
- `hanoi-pleiku-mang-den-cot-moc-buon-ma-thuot-3n2d`: the source contains a full itinerary but leaves the tour price blank.
- `hanoi-pleiku-buon-ma-thuot-hai-phong-4n3d`: source price exists, but the only departure wording is June 2026, which has passed.

## Editorial rules

- Group-qualified pricing lives in `tour_price_options`; it does not imply `tours.group_max`.
- Departure dates and weekly wording are not inferred beyond the source.
- Conflicting source versions are kept as `supporting`/`revision` links instead of silently overwriting the canonical card price.
- Unverified impact claims, difficulty values and capacity remain empty.
- Original source files stay private and are not served by the frontend.

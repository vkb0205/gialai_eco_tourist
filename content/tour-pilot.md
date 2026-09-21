# Gia Lai Eco Tourist — editorial pilot

This file records the first source-grounded catalogue pass. The public source of truth is Supabase; this ledger makes the editorial decision visible in the repository without copying the original Word/PDF files.

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

## Draft — not public

### Pleiku – Kon Tum – Măng Đen (3 ngày 2 đêm) — cần xác nhận giá

- Supabase slug: `pleiku-kon-tum-mang-den-3n2d-ghep-t6-can-xac-nhan`
- Source: `Ghép T6 hàng tuần PK - ngủ MĐ -KT 3n2đ, Ms Quynh Mai.doc`
- Reason held as draft: the source has a blank tour price.
- Rule: a blank price stays `NULL` and never becomes zero or a public card price.

## Editorial rules

- Group-qualified pricing lives in `tour_price_options`; it does not imply `tours.group_max`.
- Departure dates and weekly wording are not inferred beyond the source.
- Unverified impact claims, difficulty values and capacity remain empty.
- Original source files stay private and are not served by the frontend.

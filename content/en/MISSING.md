# Tour content not available locally

The repository contains 24 illustrative sample tours in `src/data/tours.ts`; their translated records are in `tours.en.json`. The source marks those samples as unverified, so their prices, group limits and departure months should not be treated as confirmed inventory.

The local catalogue reports describe a separate set of 14 published, source-backed tours in Supabase. They provide a partial inventory, but not complete records that can be keyed and translated field-for-field. No network or database was accessed for this translation.

## Published tours whose full copy is missing

The local reports identify these tours, but their full source fields are not present in the repository:

- Pleiku – Kon Tum – Măng Đen (3 days, 2 nights)
- Pleiku – Kon Tum – Măng Đen – Buôn Ma Thuột (4 days, 3 nights)
- Pleiku – Kon Tum – Măng Đen · Central Highlands group tour 2026
- Pleiku – Kon Tum – Măng Đen: Chư Đăng Ya
- Hà Nội – Pleiku – Măng Đen – Cột mốc 3 biên
- Pleiku – Măng Đen – Kon Tum – Buôn Ma Thuột (5 days, 4 nights)
- Buôn Ma Thuột – Buôn Đôn – Dray Nur – Hồ Lắk
- Hải Phòng – Buôn Ma Thuột
- Buôn Ma Thuột – Buôn Đôn – Núi Đá Voi – Hồ Lắk
- Hải Phòng – Buôn Ma Thuột – Pleiku – Măng Đen
- Hà Nội/TP.HCM – Buôn Ma Thuột – Pleiku – Măng Đen
- Vinh – Buôn Ma Thuột – Buôn Đôn – Hồ Lắk
- Huế – Măng Đen – Kon Tum – Pleiku
- Hà Nội – Pleiku – Măng Đen – Buôn Ma Thuột

For these 14 records, the complete English source is missing for the summaries, destination lists, highlights, departure wording, day-by-day itinerary text (48 itinerary days in total), meals and overnight details, inclusions and exclusions, accommodation and transport notes, child and surcharge policies, and price conditions. The reports say cancellation terms are absent for 7 of the 14 tours. Media assets and image alt text are also not present in the local catalogue.

The reports do include partial names, durations, themes, card prices and source counts, and the pilot ledger includes a small amount of route, schedule and price context. That partial metadata is not enough to create tour records with the same fields as the local `Tour` source shape.

## Draft records

The local ledger identifies five draft tours, but their complete Supabase text is also unavailable here:

- `pleiku-kon-tum-mang-den-3n2d-ghep-t6-can-xac-nhan`
- `hanoi-pleiku-cot-moc-buon-ma-thuot-2n1d`
- `hanoi-pleiku-mang-den-cot-moc-kon-ka-kinh-4n3d`
- `hanoi-pleiku-mang-den-cot-moc-buon-ma-thuot-3n2d`
- `hanoi-pleiku-buon-ma-thuot-hai-phong-4n3d`

The fifth draft's source has no confirmed tour price; other drafts include past departure dates or blank prices. Their full summaries, itinerary details, policies and confirmed commercial terms need the approved source documents or a local Supabase export before translation.

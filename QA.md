# Validation evidence

Result: **PASS for the local viewer scope below**, September 8, 2026.

Primary browser verification: `evidence/verification.json`. Visual captures: `evidence/desktop.png`, `plan.png`, `pool.png`, `mobile.png`, `mobile-detail.png`.

| Check | Result / evidence |
|---|---|
| Mesh coordinates / identity | Finite coordinates; unique IDs for all 46 modeled room zones |
| Pool length | Water mesh measures 20.000 m; same result after GLB export and reload |
| Walls | Default groups scale to the 1.1 m cutaway; full-height toggle restores scale 1 for nominal 3 m walls |
| Search and categories | Matching lists and explicit no-results state work |
| Selection | List and actual canvas click select the expected room; details and URL hash update |
| Photography | Selected pool reference loads; independent reviewer also exercised photographs |
| View controls | Plan/3D, zoom, reset and modal open/close exercised |
| Booking | Booking link hidden when unconnected; no reservation request sent |
| GLB | Valid version-2 binary, exported room metadata, successfully reopened with Three.js GLTFLoader; 14,446,396 bytes |
| Desktop | 1440 × 1000 Chrome capture; no horizontal document overflow or page JavaScript errors |
| Mobile emulation | 390 × 844; no horizontal overflow; camera buttons at least 44 × 44 CSS px; Escape returns focus to visible Find a space button |

Independent read-only QA reviewed the actual local viewer, layout against references, room browsing, no-results, photos, URL selection, plan/3D, keyboard navigation and desktop focus return. Its first review found mobile focus loss and undersized touch targets. Both were corrected and independently retested **PASS**. The removed Three.js shadow-map setting was also corrected and its warning disappeared.

The source-code design detector returned no findings (`[]`). This is supplemental evidence, not a substitute for the browser review.

Limitations: mobile testing used browser emulation rather than physical devices. No complete dimensional audit of every room, furniture item or opening was performed. No production hosting, YCode embedding, authentication, live availability or booking transaction was tested. Validate those integration paths when they are implemented; current success does not imply they exist.

## Level 6 addition — September 9, 2026

PASS: `scripts/verify-level6.cjs`; results in `evidence/level6-verification.json`. Production build passes. Headless Chrome verified 13 zones, all referenced photo URLs, loaded detail images and descriptions, category-independent search and empty state, actual canvas selection of the pool, 3D/plan transitions, switching back to Level 4 bowling and its photo, Level 6 hash deep links, mobile overflow and Escape focus return. No page JavaScript errors. Active Level 6 GLB export passed binary header/length and 13 unique room metadata checks (11,114,212 bytes). GLB re-import was not tested for this addition.

Visually reviewed 1600 × 1050 overhead/3D captures and 390 × 844 mobile overview/detail captures. Evidence: `level6-desktop.png`, `level6-plan.png`, `level6-pool.png`, `level6-mobile.png`, `level6-mobile-detail.png`. Source layout proportions checked against the supplied overhead reference; model remains interpretive and dimensionally approximate. Physical mobile devices and production deployment are outside this validation.

### Aerial-photo correction pass

Re-ran the production build and all `verify-level6.cjs` checks after the actual-site revisions: PASS, zero page errors, all 13 zones and photo paths valid, mobile/deep links/floor switching/canvas selection preserved. Revised GLB export is 12,587,196 bytes. Reviewed the north terrace close-up against IMG_3984/3985 and the full scene against IMG_3978–3986. The earlier unroofed north enclosure and raised planted circle were replaced. Level 6 remains an interpretive architectural model, not a measured reconstruction.

North entrance orientation fix: production build passes; close-up 3D and plan browser captures reviewed against IMG_3984. Canopy now projects west over the lounge-side promenade and glazing wraps the southwest corner. Browser loaded without page errors. This targeted geometric fix did not require another full export/gallery regression run.

Red-arrow entrance correction: moved glazing, door and canopy to the southeast bridge-side corner per the user's explicit annotation. Production build passes; close-up 3D/plan browser views load without page errors. The prior west-corner interpretation is superseded.

Pending validation: detailed playground equipment was viewed successfully in Chrome in 3D and plan after fixing a climbing-panel geometry error. A subsequent full export regression was blocked by automatic approval review citing usage limits. Later table/BBQ placement edits have not yet been rendered for visual review; earlier screenshots and PASS records do not validate those latest edits.

Three-bay pergola correction: source now creates three lengthwise dining tables, eight chairs per table, and one planted-edge BBQ per bay. Production build passes. Layout derives directly from the user's 4:25 PM overhead close-up; a new browser capture remains unavailable under the earlier automatic approval usage-limit block. No visual-pass claim is made for this latest edit.

South pergola round-table correction: removed paired BBQ calls, added two round-table calls after the furniture helper declaration, and updated the zone label/description. Production build passes. Fresh browser verification remains pending under the prior approval-review usage-limit block.

IMG_3992 lounge correction: production build passes; a new focused Chrome check was approved and completed successfully. Inspected 3D and plan close-ups against the actual photograph; no page JavaScript errors. Evidence: level6-lounge-corrected.png. This targeted review validates the lounge correction only and does not claim that previously pending full regression checks ran.

IMG_3990 central fireplace correction: build passes. A focused Chrome render completed without page JavaScript errors; reviewed 3D and plan views against the actual photo, verifying the changed fireplace axis and paired seating layouts. Captured evidence in level6-central-fireplace-corrected.png. This is a targeted visual review, not a full regression rerun.

Level 6 railing correction: production build passed. Inspected fresh Chrome renders of the fire-pit terrace, south garden, and north playhouse terrace; the added panels follow the exposed corners and join existing railings. No page errors reported. Evidence: `evidence/level6-railings-L6-fire.png`, `evidence/level6-railings-L6-bbq-south.png`, and `evidence/level6-railings-L6-bbq-north.png`.

North bridge correction: npm run build passed; fresh Chrome render inspected for open BBQ terrace access, paving joints, and stepped outer railing. No page errors reported. Evidence: evidence/level6-bridge-corrected.png.

Fire-pit terrace correction: IMG_3989 was decoded with macOS Quick Look and used to replace the boxed fire-pit seating with two open-corner striped modular sofa groups, unlit rock-bed fire bowls, dark drum side tables, and the observed round-table/paving layout. Production build passed. Focused browser review is recorded separately after this implementation.

Independent visual verification: inspected fresh Chrome render after the final IMG_3989 corrections. Confirmed the middle table clears the pergola, separate cushion modules, side tables and paving bands; no page errors reported. Screenshot: evidence/level6-fire-terrace-corrected.png.

IMG_3988 final independent review: Chrome scene loads without page errors after fixing the planting material reference. Visually checked three pergola bays, planted divider on lounge side, and compact freestanding BBQ clearance. Confirmed approved fire-bowl, sofa, side-table, and round-table code remains byte-for-byte unchanged. Screenshot: evidence/level6-pergola-3988-corrected.png.

Authoritative overhead footprint correction independently verified in browser plan view: broad clipped triangular planter, diagonal pergola, west-side and bevel BBQ alignment, continuous pale rim. Approved lounge/round-table geometry remains unchanged. Scene loads without page errors. Evidence: evidence/level6-triangular-planter-plan.png and evidence/level6-triangular-planter-3d.png.

Pool enclosure and deck lounge correction (IMG_4025/4026/4035): production build passes and
the full `scripts/verify-level6.cjs` suite returns **PASS** — 13 zones, every referenced photo
URL reachable, loaded detail images and descriptions, search and empty state, canvas selection
of the pool, 3D/plan transitions, floor switching back to Level 4 and returning, `#L6-play`
deep link, mobile overflow and Escape focus return, zero page JavaScript errors. GLB export
passed its binary header/length and 13 unique room metadata checks at 18,825,580 bytes; GLB
re-import was not tested. Inspected fresh Chrome 3D and plan renders of the gated east edge
against IMG_4025 and of the sectional groups against IMG_4026/4035. Evidence:
`evidence/level6-pool-enclosure.png` and `evidence/level6-pool-enclosure-plan.png`.

While running that suite, its `search 'bocce'` assertion was found to expect one result while
two rooms now match — a stale expectation left by the earlier IMG_3992 rename of `L6-bbq-central`
to *Bocce-side fireplace lounges*, whose QA entry records only a focused check rather than a
full regression run. The assertion was narrowed to `'bocce lawn'`, preserving its intent. This
was a pre-existing test defect, not a regression from this change.

Pool enclosure follow-up (seating orientation, second gate, north parapet): production build
passes and `scripts/verify-level6.cjs` returns **PASS** at 18,845,000 export bytes, with zero
page JavaScript errors. Inspected fresh Chrome 3D and plan renders of the east run: the lounge
groups now face the pool, both gates read as separate openings, and the glass fence terminates
against the new north parapet rather than at an open post. Evidence refreshed in
`evidence/level6-pool-enclosure.png` and `evidence/level6-pool-enclosure-plan.png`.

Deck lounge layout correction (four sofas, two tables, rotated 90°): production build passes and
`scripts/verify-level6.cjs` returns **PASS** at 18,678,208 export bytes with zero page JavaScript
errors. Inspected a fresh Chrome 3D render against the user's marked aerial crop: four large
sofas in two facing pairs, two tables, length running toward the pool. Evidence refreshed in
`evidence/level6-pool-enclosure.png` and `evidence/level6-pool-enclosure-plan.png`.

North lounger row trim: production build passes and `scripts/verify-level6.cjs` returns **PASS**
at 18,601,740 export bytes with zero page JavaScript errors. Inspected a fresh Chrome 3D render
against the user's marked screenshot: both north rows now begin and end level with the pool.
Evidence refreshed in `evidence/level6-pool-enclosure.png` and `-plan.png`.


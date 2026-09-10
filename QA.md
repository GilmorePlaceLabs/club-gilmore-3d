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

Change-room rebuild (annotated interior plan, IMG_4029/4034 south elevation): production build
passes and `scripts/verify-level6.cjs` returns **PASS** at 18,692,764 export bytes with zero page
JavaScript errors, including the three new photo URLs on the change-room gallery. Inspected a
fresh Chrome overhead of the interior against the annotated plan and a walls-raised elevation
against IMG_4029 — shower columns, life ring, recessed entry, bottle filler and canopied storage
door all read in their photographed order. Evidence: `evidence/level6-change-interior.png` and
`evidence/level6-change-elevation.png`.

Change room at full height: production build passes and `scripts/verify-level6.cjs` returns
**PASS** at 18,692,704 export bytes with zero page JavaScript errors. Confirmed in Chrome that the
block renders at full height in the default view and that the wall toggle reports disabled on
Level 6. Evidence: `evidence/level6-change-full-height.png`.

Change-room layout correction: production build passes and `scripts/verify-level6.cjs` returns
**PASS** at 18,702,304 export bytes with zero page JavaScript errors. Inspected a fresh Chrome
overhead of the whole block against the user's reference render — stepped shell outline, six
changing bays, five washroom stalls, three wide timber-backed shower booths, five standing
showers, east vanity and south-east steam room all read in the reference's arrangement. Evidence
refreshed in `evidence/level6-change-interior.png` and `evidence/level6-change-elevation.png`.

Final change-room remap supersedes the preceding fit-out counts. Production build passes, and a
focused browser review of both plan and pool-facing elevation confirms the stepped shell contains
the accessible northwest wet room, five north bathroom cubicles, six west changing cubicles, four
central individual showers, the separate lower-left two-head standing-shower bay, the distinct
five-fixture lower row, east vanity and southeast steam room. The charcoal tiled facade reads at
the intended value and its recessed entry, outdoor showers, life ring, fountains, storage door,
louvre, glass canopy, signs and sconces appear in the photographed order.

Change-room rebuild independently reviewed in Chrome: plan checked against annotated and unannotated user reference, north stalls corrected to remain inside stepped shell, central showers and distinct standing-shower bay aligned, east vanity and southeast steam room visible. Pool-facing elevation checked for three outdoor shower panels, recessed entrance, life ring, dual-height fountains and canopied storage door. Scene loads with no page errors. Evidence: evidence/level6-change-room-plan.png, evidence/level6-change-room-3d.png, evidence/level6-change-room-facade.png.

Entrance follow-up: verified deeper recess and two framed glass side doors in fresh 3D and plan renders; no page errors reported. Rear wall moved north by8 trace units (~0.52m). Local steam-room bench/wall ends adjusted for door clearance. Evidence: evidence/level6-change-entrance-glass-doors.png.

Entrance assembly correction: independently inspected both oblique sides in Chrome. Closed glazed leaves now sit in complete side openings with attached jambs/lintels; old steam glass/bench conflicts removed; formerly floating plaque/light mounted to rear wall. No page errors. Evidence: evidence/level6-entry-junction-east.png and evidence/level6-entry-junction-west.png.

Screenshot corrections, September 9, 2026 — `node scripts/verify-level6.cjs` passes (13 rooms,
all photos resolve, finite geometry, 19,320,532-byte GLB, level switching, deep link, mobile).
Each change was checked in a targeted Chrome render before and after: the sun-deck southeast
corner now carries glass fence and unbroken slab, the three west daybeds open onto the deck, the
change-room frontage is clear of loungers, the four enclosed showers have head and drain together
at the closed end, and the north playhouse is rebuilt from IMG_4038/4040 as an open shelter with
no chimney.

South-garden traced-layout correction, September 10: production build passes. Focused plan and
3D review against the user's authoritative overhead confirms the notched lawns and planting
islands, clear diagonal path, retained round tables, continuous planter rims and west perimeter
trees. Pergola rafters terminate on its traced perimeter beams and two supported crossbeams form
three bays; no roof members stop in mid-air.

Southern garden goal: independently compared fresh plan/3D browser captures against supplied d9d73395 image-2 overhead. Verified shaped east-edge pergola, supported clipped rafters, two retained actual round tables, paved shelter floor, notched lawn polygons, planted islands with pale rims, west perimeter planting and clear diagonal timber route. Scene loaded with no page errors. Evidence: evidence/level6-south-garden-plan.png and evidence/level6-south-garden-3d.png.

IMG_3991 actual lawn correction: fresh browser render checked for removal of extra lawn-side notch bed and end flower strip, continuous grass, retained square planter and new capped black lamp post. No page errors. Evidence: evidence/level6-south-actual-planter-lamp.png.

South lawn edge follow-up, September 10, 2026: `node scripts/verify-level6.cjs` passes again
after squaring the southwest lawn's edge to the timber walk. Plan renders before and after
confirm the tapering pale sliver along the walk is gone and the divider holds one width.

Pergola furniture pass, September 10, 2026: `node scripts/verify-level6.cjs` passes. Checked in
Chrome renders — south pergola now carries three round dining tables with four black chairs each
(IMG_4021), fire-terrace tables sit across their bays (IMG_4009), and a render taken down a
table's long axis confirms the end chairs face the table at both pergolas.

Eastern garden section rebuild, September 10, 2026: `node scripts/verify-level6.cjs` passes
(13 rooms, all photos resolve, finite geometry, valid GLB, level switching, deep link, mobile, no
page errors). The section was validated by warping `public/references/level-6-render.png` into the
app's own plan-view frame — the frame derived by projecting known trace points through
`clubGilmore.camera` — and comparing the two directly. Confirmed in that comparison: three raised
beds where there were two, the boardwalk in dark timber running unbroken from the fire terrace to
the northeast platform, bench blocks set into the walls facing the walk, the turf apron retained
between the playground-side bed and the play coping, and the tip beyond the platform fully
planted. Walk width measured from the built geometry: 2.21 m clear, 1.77 m past a bench.
Evidence: evidence/level6-eastern-garden-plan.png and evidence/level6-eastern-garden-3d.png.

Not validated: the ~2 m2 bare pale wedge at the extreme northeast point (recorded in
MODEL-SOURCES.md). It reproduces with the eastern garden removed, so it is pre-existing, but no
fix has been rendered and confirmed.

Deck-side bed removal, September 10, 2026: `node scripts/verify-level6.cjs` passes after deleting
the walk-side bed and widening the boardwalk to meet the railing-side bed's wall. Plan and 3D
captures confirm one bed against the glass railing, no orphan paved strip between it and the walk,
benches sitting against the two walls that face the walk, and the playground-side bed, rear bed
and tip planting unchanged. Walk measured from the built geometry: 3.12 m clear, 2.68 m past a
bench. Evidence: evidence/level6-eastern-garden-plan.png and evidence/level6-eastern-garden-3d.png.

Northeast pergola clearance, September 10, 2026: `node scripts/verify-level6.cjs` passes after
removing the picnic table from under the pergola. Checked in a close Chrome render down the
northeast end of the walk — the pergola frame, its platform and the walk-side bench blocks are
intact and the ground under the structure is clear. No page errors.

Northeast pergola relocation, September 10, 2026: `node scripts/verify-level6.cjs` passes. Plan
view confirms the pergola square on the boardwalk at its terminus, spanning the walk width with
the tip planting immediately beyond, and no bare slab left where the removed timber platform was.
A low 3D render down the walk confirms the posts land on the walk, not in the beds. No page errors.

Pergola squared to the walk, September 10, 2026: `node scripts/verify-level6.cjs` passes. Plan view
confirms the pergola's edges now run parallel and perpendicular to the boardwalk. Checked
numerically as well as visually: the group's local x axis dotted with the walk direction is
-0.0005.

Pergola posts brought inside the walls, September 10, 2026: `node scripts/verify-level6.cjs`
passes. The posts stood at offsets 33.6 and 83.6, inside the retaining walls at 31-35 and 83-87.
Narrowing the pergola from 50 to 38 trace units across seats them at 39.6 and 77.6, and the
perimeter beam now spans 37.9-79.3, so the whole structure sits between the two walls. Confirmed
in a close 3D render down the walk; the rafter overhang was shortened to stay clear of the tip bed.

Potting bench added, September 10, 2026: `node scripts/verify-level6.cjs` passes, which includes
its assertion that every photo referenced by every room resolves — covering the newly added
`site-4013.jpg`. A 3D render up the walk confirms the bench under the pergola with its galvanised
top, timber apron, slatted shelf and four legs, standing clear of the posts and the tip planting.
Evidence: evidence/level6-potting-bench.png.

Playground-side bed removal, September 10, 2026: `node scripts/verify-level6.cjs` passes. Plan
view confirms the strip between the walk and the play lawn is clear of planting and its wall, the
parapet-side bed and the tip planting are unchanged, and the pergola and potting bench are intact.
The room description was re-read against the built model in the same pass and two stale claims
were corrected. Not resolved: the pale paved margin left between the lawn edge and the walk widens
toward the northeast; it has not been confirmed with the user as intended.

Fire-terrace island extension, September 10, 2026: `node scripts/verify-level6.cjs` passes. Plan
view confirms the island now meets the boardwalk with its edge parallel to it and no pale slab
strip between, and that its planting, rim, clusters and two trees still sit inside the enlarged
polygon. Not addressed: the three-bay pergola's southeast corner post stands on the boardwalk
(recorded in MODEL-SOURCES.md); it is pre-existing and was not raised by the user.

Fire-terrace grill and island pass, September 10, 2026: `node scripts/verify-level6.cjs` passes.
Checked in a true plan view rather than the tilted 3D, so no camera parallax could hide a spill:
the island's planting sits entirely inside its rim, both grills stand on the paving with their
backs to the rim and their controls facing the terrace, and the bench block at the pergola corner
is gone. A low 3D render confirms the two grills read the same way round as each other.

Three-bay pergola and round-table bench, September 10, 2026: `node scripts/verify-level6.cjs`
passes. The pergola's eight post positions were computed rather than eyeballed: all eight sit at
walk-edge offsets of 84.6 or more (the walk ends at 83, posts are 1.23 half-width), and the four
near posts sit 2.46-2.50 units off the island rim line, which is exactly rim half-width plus post
half-width. Plan view confirms the frame parallel to the rim, its southeast end off the boardwalk,
and no bench block under the round table at [1142,925].

Pergola, dining run and grey paving, September 10, 2026: `node scripts/verify-level6.cjs` passes.
Post and chair clearances were computed from the same formulas the builder uses and confirmed
against a plan-view render; an attempt to assert them by walking the built scene graph did not
work, because the props are merged before export and the individual post meshes are not
addressable, so this is a computed-plus-visual check rather than a scene-graph one. Pixel-sampled
the recoloured surfaces: the walk reads (117,122,113) against the fire terrace's charcoal band at
(119,124,116) — the same material under slightly different light. The light-well floor samples
much darker at (50,52,53) because it sits 4.5 m down in shadow; that is the same material, not a
different colour.

Playground-side bed restored, September 10, 2026: `node scripts/verify-level6.cjs` passes, which
covers the newly added `site-4047.jpg` resolving. The bare strip was located by sampling a
plan-view render on a grid in walk-offset space before the fix, which showed pale slab from offset
83 inward to between 89 and 116 depending on position; the bed's inner edge was then taken from the
lawn polygon itself rather than eyeballed. A plan render after the change shows the strip filled,
the retaining wall running straight along the walkway, and the turf apron still present between the
bed and both play circles. The room description was corrected in the same pass.

Playground-side bed tail trimmed, September 10, 2026: `node scripts/verify-level6.cjs` passes. The
user's red line was located by calibrating against the walk's bench blocks, whose positions are
known exactly (the offset-80 blocks at t = .362, .518 and .674 fall 430 px apart in the supplied
crop), putting the line at t = .427. Plan render confirms the tail gone, the new end square to the
walk, and the lawn meeting the walk southwest of it.

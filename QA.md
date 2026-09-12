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

Flush slab joins, September 10, 2026: `node scripts/verify-level6.cjs`,
`node scripts/verify-first-person.cjs` and `npm run build` pass. `node scripts/verify-walk-routes.cjs`
passes; this is its first successful run. It previously failed on load with
`THREE is not defined`, because it built a `THREE.Vector3` inside the page; it now clones the
controller's vector. Its change-room forecourt zone now stops at z=594, because z 596–611 is shared
with the open pool sun deck and was being counted as the forecourt. A south-bridge zone was
added. A scratch probe walked across the south bridge's west join: before the navigation fix it
stopped at x=927.2 heading east and 937.6 heading west; after it, it crossed to 1045.1 and 921.9,
with no unsafe samples left on the bridge centre line. The z=275 north join was already crossable.
First-person renders at both photographed joins, `evidence/level6-flush-joins-south-bridge.png`
and `evidence/level6-flush-joins-north-seam.png`, show them flush, with the light-well curbs and
railings still in place.

Change-room doors open for the walk, September 10, 2026: `node scripts/verify-level6.cjs`,
`node scripts/verify-first-person.cjs` and `npm run build` pass. The first-person script now
asserts that both doors are swung to their `openYaw` while walking and that every gate and door is
back at its closed rotation after exit. `node scripts/verify-walk-routes.cjs` passes, with the
change-room interior now expected open, and reached at trace ≈ (415, 593). Its first run failed
to reach it because the BFS used a 0.4 m grid, and an open doorway leaves only a 0.24 m band for
the player's centre. The grid is now 0.2 m. The north pavilion interior still correctly reads
closed at the finer grid. A scratch probe walked from the middle of the recess through each
doorway: west to x=288.7, deep inside the block; east to x=415.5, where the steam room's south
wall stops the approach as built. A walk in from the pool-deck mouth reached the rear of the
recess. First-person renders, `evidence/level6-change-room-doors-west.png`, `-east.png` and
`-from-inside.png`, show each leaf swung flat into the court with its handle and frame intact and
the doorway clear. The orbit view, which keeps the doors closed, was not re-rendered.

Northeast planter walk, September 10, 2026: `node scripts/verify-level6.cjs` passes, which covers
the new `site-4005.jpg` and `site-4057.jpg` resolving. `node scripts/verify-first-person.cjs` and
`npm run build` also pass. `node scripts/verify-walk-routes.cjs` passes with a new
"northeast planter walk" zone reached, and the north pavilion interior still closed.

Before foliage was made non-solid, a scratch probe found every centre-line point from z=285 to 490
unsafe, and the audit could not reach the walk. The overhanging canopies had closed it. After the
change, every centre-line point from z=280 to 505 is safe, and a walk from the north end runs
through to z=582.7. Across the walk at z=390, the clear band is x 1148–1155: the walls stay solid,
and the player's 0.6 m fits inside the 1.14 m walk.

First-person renders, `evidence/level6-ne-planter-walk.png` and `-grills.png`, show the banded walk
between the two planter walls, and the west wall directly behind the grill counters and pergola
posts with no gap or overlap. The canopies overhang the walk at eye height, which reads denser
than IMG_4005.

Northeast planter walk widened (IMG_4058), September 10, 2026: `node scripts/verify-level6.cjs`,
`node scripts/verify-first-person.cjs`, `node scripts/verify-walk-routes.cjs` and `npm run build`
pass. The walk-route audit still reaches the planter walk and still keeps the north pavilion
interior closed. A scratch probe scanning across the walk at z=390 finds the player's centre clear
from x=1148 to 1170, a 1.5 m band, up from 0.5 m. That band is the 2.11 m walk less the player's
0.6 m. Every centre-line point from z=280 to 505 is safe, and a walk from the north end runs
through to z=582.7. The first-person render `evidence/level6-ne-planter-walk.png`, taken from the
walk's new centre line, shows the wide banded walk flanked by both planter walls and their trees,
with a clear view to the far end.

West bed ends at the pergola, September 10, 2026: `node scripts/verify-level6.cjs`,
`node scripts/verify-first-person.cjs`, `node scripts/verify-walk-routes.cjs` and `npm run build`
pass. The audit still reaches the planter walk and keeps the north pavilion interior closed. The
walk probe is unchanged: the centre line from z=280 to 505 is safe, and the clear band across the
walk is still x 1148–1170. A top-down orbit render of the pergola's south end,
`evidence/level6-west-bed-end-topdown.png` (north up), shows the west bed's tree row stopping level
with the pergola's south beam instead of running past it. The last canopy overhangs only slightly,
because its tree stands 4 units inside the bed's new end. The bed's soil edge itself is hidden
under that canopy in plan, so the end position rests on the computed z=483.2 rather than on the
render alone.

Rear bed and play lawn cut to the planter line, September 10, 2026: `node scripts/verify-level6.cjs`
passes. The export shrank from 21,902,668 to 21,871,940 bytes, consistent with fewer planting
instances in the smaller bed. `node scripts/verify-first-person.cjs`, `npm run build` and
`node scripts/verify-walk-routes.cjs` also pass; the audit still reaches the play perimeter and the
planter walk, and keeps the north pavilion interior closed. A top-down orbit render (north up),
`evidence/level6-rear-bed-lawn-cut-topdown.png`, shows the raised bed's west wall and the lawn's
west edge running in one straight north–south line with the east planter's west wall, plain
paving west of it, and the play-circle rim and arcs unchanged.

Playground monkey bars and stepping disc, September 10, 2026: `node scripts/verify-level6.cjs`
passes. The export grew from 21,871,940 to 21,964,100 bytes, consistent with the second rail, two
extra rungs, a second end post and the disc's support post. `node scripts/verify-first-person.cjs`,
`npm run build` and `node scripts/verify-walk-routes.cjs` also pass; the audit still reaches the
play perimeter with the new solid posts in place, and keeps the north pavilion interior closed.
Two angled orbit close-ups, `evidence/level6-playground-monkey-bars.png` (from the south-west,
matching the user's screenshot) and `-reverse.png` (from the north-east), show the monkey bars as a
ladder: two parallel curved rails with rungs spanning between them, from the platform post to the
pair of end posts, with the end disc at their foot. The disc beside the S-slide now stands on its
own post. The orbit zoom limit (12) keeps these shots fairly wide; they were not taken in first
person.

Playground platform, slides, arch and stairs aligned, September 10, 2026: `node scripts/verify-level6.cjs`
passes. The export went from 21,964,100 to 21,927,300 bytes, consistent with the narrower cage,
fewer guard runs and slimmer slides. `node scripts/verify-first-person.cjs`, `npm run build` and
`node scripts/verify-walk-routes.cjs` also pass; the audit still reaches the play perimeter and
keeps the north pavilion interior closed. A standalone check of `frame()` put every edge's two
ends exactly on its two posts (maximum error 0.0000 m). A top-down render,
`evidence/level6-playground-aligned-topdown.png`, shows the deck's six corners on the six posts,
with each slide, the stairs and the cage leaving square from its own edge. The angled orbit shots
`-aligned.png` and `-aligned-reverse.png` were too wide to read the hoop, so it was checked in a
first-person close-up instead: `evidence/level6-playground-hoop-closeup.png` shows it springing
from edge 0's two posts over the S-slide entrance, with no post through it.
`evidence/level6-playground-stairs-closeup.png` shows the stairs centred between their posts.

Stair handrails attached and monkey bars moved to an opening, September 10, 2026:
`node scripts/verify-level6.cjs` passes, with the export down to 21,890,436 bytes now that one
guard run is gone. `node scripts/verify-first-person.cjs`, `npm run build` and
`node scripts/verify-walk-routes.cjs` also pass; the audit still reaches the play perimeter and
keeps the north pavilion interior closed.

- **Monkey bars.** A top-down render, `evidence/level6-playground-rails-topdown.png`, shows them
  leaving the edge-2 side between two posts rather than the corner post, with only edge 3 still
  guarded. `-rails-west.png`, taken from the user's angle, shows them coming off the deck side out
  to their end posts.
- **Handrails.** The first-person close-up `evidence/level6-playground-handrail-closeup.png` shows
  each handrail top finishing at a platform post, one per rail.
- **Monkey-bar entry.** `evidence/level6-playground-monkey-bars-entry.png` shows both rails meeting
  the mounting bar strung between edge 2's posts just above the deck. At that camera distance the
  rail-to-bar joint itself is small, so the top-down is the clearer evidence for the layout.

Selection pulse, September 11, 2026: selecting a room now pulses its brass outline (opacity
.3–1) and floor glow in `render()`. The pulse is skipped under `prefers-reduced-motion`, and
frames only keep running while a room is selected. `npm run build` passes. A headless check that
selected `L6-bbq-1` sampled the outline opacity every 150 ms and got `1.00 0.55 0.40 0.31 0.32
0.42 0.59 0.79`, which shows it pulsing. `evidence/level6-selection-pulse.png` captures one frame
near the low point of the pulse. `verify-level6.cjs` has not been re-run for this change.

Selection ripple, September 11, 2026: this replaces the opacity pulse above. The selected room
now gets a deep-brass (`#a8842c`) edge band about 5 px wide, plus three rings that spread out
from it and fade, one every 2.7 s (slowed from 1.8 s at the user's request). Widths are set in screen pixels, so they look the same at any
zoom. Under reduced motion only the static band is drawn. A headless check on `L6-bbq-1`,
`L6-pool` and `L4-83` confirmed that the band is `a8842c`, the first ring sits outside the room's
bounds, the ring opacities change between samples 400 ms apart, the ripple is removed on close,
and the page logs no errors. `npm run build` passes. Stills: `evidence/level6-selection-ripple-bbq-1.png`,
`-pool.png` and `evidence/level4-selection-ripple.png`. These are single frames, so the motion
itself has only been checked by the opacity samples. `verify-level6.cjs` has not been re-run.

Lower BBQ camera, September 11, 2026: `frameRoom()` now frames `L6-bbq-1`, `-2` and `-3` from the
open west face at about 13° above horizontal, down from about 26°. That is still inside
`maxPolarAngle`, and it lets the grill under the pergola show above the table. A headless run
selected each bay and measured the camera at 12.9° every time, with no page errors.
`npm run build` passes. Stills: `evidence/level6-bbq-1-low-camera.png`, `-bbq-2-` and `-bbq-3-`.

P18 split and booking fee, September 11, 2026: `L6-p18` (P18 – Firepit, Table & BBQ) is now
its own zone inside the fire pit terrace, and it holds the P18 booking link, photos and times.
`L6-fire` is now public and non-bookable. `/api/availability` now returns the fee live from
PerfectMind. Checks that passed:
- `curl` returned `"fee":"Free"` for P18 and for BBQ 1.
- `npm run build` passes.
- A headless Chrome check that:
  - hovered trace (1100, 905) and (1075, 860) and got the P18 label, and hovered (1080, 745)
    and got "Fire pit terrace";
  - clicked inside P18 and selected `L6-p18`, with the booking link shown, "Fee: Free" and
    booking times;
  - selected `L6-fire` and showed the not-bookable note, with no fee row and no booking link;
  - showed "Fee: Free" on BBQ 1, 2 and 3;
  - logged no page errors.

Evidence: `evidence/level6-p18-selected.png`, `evidence/level6-bbq-fee.png`. `verify-level6.cjs`
has not been re-run. Its hardcoded counts of 13 list items and 13 GLB room ids were already out of
date before this change, which brings Level 6 to 16 rooms.

### Measured Level 6 scale — September 12, 2026

The trace unit moved from 0.065 m to 0.06 m, the BBQ bays took their measured 4.572 × 3.81 m
footprint, every pergola dropped to 2.54 m, the picnic tables became 2.35 × 1.75 × 0.72 m and the
pool glass rose to 2.032 m. Validation run (`node scripts/verify-level6.cjs` against
`npm run dev`): **PASS**, including a new assertion that reads the `L6-bbq-1` floor mesh back out
of the built scene and requires 4.572 × 3.81 m in world metres. The run refreshed
`evidence/level6-pool.png`, `level6-plan.png`, `level6-desktop.png`, `level6-mobile.png`,
`level6-mobile-detail.png` and `level6-verification.json`, and reported no page errors.

Two assertions in that script were stale before this change and are fixed here: the public list
and GLB room-id counts are 16, not 13, and `.detail-location strong` now matches the fee row as
well, so the location line is addressed as `.detail-location:not(#detail-fee-row) strong`.

The plan, sun-deck, BBQ-bay and desktop views were inspected after the rescale and show no
furniture collisions from the 7.7% deck shrink. The rest of the deck was not walked through at
close range; anything not listed above remains pending visual validation.

### First-person height pass — September 12, 2026

`eyeHeight` is 1.664 m (5 ft 10 in) and the avatar body scales with it; Level 6 trees are 2.8–4.4 m
and bed clumps top out near 1.2 m. Checks that passed:
- `node scripts/verify-level6.cjs`: **PASS**, no page errors.
- `npm run build` passes.
- A headless first-person run read the camera back at y = 1.744 m (0.08 floor + 1.664) with the
  avatar root scaled 0.990, and captured the north bridge, pool deck, playground and garden walk.
  The trees now stand well above the camera, as in IMG_4005 and IMG_4036.

Screenshots from that run are in the scratch directory, not in `evidence/`; the only committed
Level 6 images are the ones `verify-level6.cjs` writes. The four viewpoints above were inspected,
not the whole deck.

### Walking camera field of view — September 12, 2026

The user reported the pool enclosure still looking short from inside the walk. Measured out of the
built scene (vertex scan around trace 660, 760 and the gate at 660, 680): both the glass run and
the gate top out at **2.032 m**, and the walking camera sits at 1.744 m (0.08 m floor + 1.664 m
eye), so the geometry was already right — the fence stands 0.37 m above the walker's eye.

The distortion was the camera: `FirstPersonController` used a 68° *vertical* fov, which is about
100° across at 16:9 — a fisheye that pushes nearby geometry away and flattens its apparent height.
It is now 50° vertical (~80° across), close to the ~50° vertical framing of the site photographs,
so the walk matches IMG_4026 and IMG_4035. `verify-level6.cjs`: **PASS**; `npm run build` passes.

Views re-inspected at the new fov: the north-bridge spawn, the walkway facing the pool enclosure,
standing at the gate, and inside the pool deck. Note that at 2–3 m back the enclosure correctly
reads as only slightly above eye level; it only towers when you are next to it, as in IMG_4026.

### Crown spread — September 12, 2026

Trees keep their 2.8–4.4 m heights; crowns are now squashed across narrow beds by `bedSpread()`.
`verify-level6.cjs`: **PASS**. `npm run build` passes. Re-inspected in the walking view: the walk
east of the BBQ bays (the one the user reported blocked) is open with trunks flanking it and
canopies overhead, the BBQ 3 bay is visible from the deck again, and the garden boardwalk, pool
deck and north bridge are unchanged. Beds wider than ~2.6 m were not altered.

### Pool-side walk clearance — September 12, 2026

`verify-level6.cjs` now enters first person and probes `navigationWorld.isSafe()` every 4 trace
units from x = 150 to 558 along both pool-side walks (z = 708 north, z = 831 south), and fails if
any point is unwalkable. Against the previous lounger positions the north scan failed at 70 points;
with the rows moved it passes at every point, north and south. Full run: **PASS**; `npm run build`
passes. The walk was also inspected in the walking view from both sides.

### Pool deck routes — September 12, 2026 (supersedes the clearance entry above)

`verify-level6.cjs` now probes three routes, each of which was blocked at some point today: the
walk behind the north lounger row (z = 675), the south pool-side walk (z = 831), and the aisle
from the change rooms' entry court to the water (x = 381, z = 600–712; 712 is as close to the pool
as a 0.30 m radius allows). All three pass at every sample point. Full run: **PASS**;
`npm run build` passes. The aisle and the walk behind the row were also inspected in the walking
view.

### South garden walk — September 12, 2026

`verify-level6.cjs` now probes the diagonal timber walk as well, along two lines 0.36 m inside each
edge, in addition to the three pool-deck routes. Both lines are clear over the whole 315-unit run;
before this change the northeast line failed from t = 155 to the end. Full run: **PASS**;
`npm run build` passes. The walk was also re-inspected in the 3D view: its northeast edge now reads
as one straight line past the shelter and both beds, and all three round tables sit inside the
shelter's bays (checked by point-in-polygon, not by eye).

### Bed alignment — September 12, 2026

`verify-level6.cjs`: **PASS** with the garden-walk probes still clear after squaring the walk-side
bed and re-fitting the diagonal beds' crowns. `npm run build` passes. Checked in plan view at
zoom: the bed's long sides now run parallel to the walk, and its crown stays inside the bed instead
of reaching over the paving.

### Shelter posts — September 12, 2026

Post-to-wall clearances computed from the built coordinates (post half width plus the coping's
0.09 m overhang): smallest gap 1.1 cm, no overlaps, against four beds and six posts.
`verify-level6.cjs`: **PASS**; `npm run build` passes. Also inspected in the 3D view from the walk
side.

### Bed extended to the shelter — September 12, 2026

Recomputed from the built coordinates after extending the bocce-side bed to the shelter: all six
posts inside the roof outline, smallest post-face-to-wall-face gap 0.5 cm, no overlaps.
`verify-level6.cjs`: **PASS**; `npm run build` passes. Checked in the 3D view from the walk side.

### Lawn to the gazebo — September 12, 2026

`verify-level6.cjs`: **PASS**; `npm run build` passes. Inspected from above on the shelter's north
side: the grass runs to the shelter's north edge between the two beds with no paved strip left, and
neither bed has grass over its rim.

### Square bed slivers — September 12, 2026

`verify-level6.cjs`: **PASS**; `npm run build` passes. Checked top-down at high zoom on both ends
of the bed: grass meets the coping at the northwest end and wraps the southeast end to the
shelter's roof edge, with no paving left showing at either.

### Shelter chairs — September 12, 2026

Chair-corner clearance to the crossbeam faces, computed from the built coordinates for all three
bays: +1.8, +3.5, +2.3 cm — no overlap. `verify-level6.cjs`: **PASS**; `npm run build` passes.
Checked from above: one table per bay, chairs square to the bay, none crossing a beam.


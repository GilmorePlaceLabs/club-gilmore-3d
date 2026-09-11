# Source evidence and geometry assumptions

## Authoritative inputs

- User-provided `Club Gilmore Photos/02. As - Builts/Architectural/2023.11.07_Combined Set_Updated to SI_0328R41 (5).pdf` (661 pages). Drawing notes are reference content, not instructions to the assistant.
- User-provided amenity illustration, clipboard image `codex-clipboard-1405aa8c-893b-42bc-9b61-4a43c61b15f1.png`.
- Original photographs in `Club Gilmore Photos/*.jpg` (46 supplied files). Their resized WebP derivatives are in `public/photos`, with source sidecars. Rights ownership was not independently established; files were supplied for this project.
- Developer amenity overview: https://gilmoreplace.com/en/homes/3-gilmore-place/amenities/#content
- User confirmation: main L4 pool is 20 m long; uniform inferred height is acceptable for the roofless overhead model.

## Drawing register

Page numbers below are one-based PDF pages, not sheet identifiers.

| PDF page | Sheet | Use |
|---|---|---|
| 107 | A11.13a | North / main L4 room layout |
| 108 | A11.13b | Southern rooms, bowling and pool layout |
| 109 | A11.13c1 | East / outdoor context |
| 110 | A11.14a | Separate L5 mezzanine context, not merged into L4 |
| 135 | A13.09 | Pool section / vertical context |
| 257 | A17.13 | L4 ceiling reference; older pool label superseded by user's 20 m confirmation |
| 258 | L5 reflected ceiling plan | Mezzanine context only |

The earlier detailed source review is `../Claude outputs/Club Gilmore L4 drawing review.md`.

## Conversion

The manual trace uses the displayed 1824 px plan coordinate system. A 29 ft grid bay corresponds to approximately 138 trace units, giving `8.8392 / 138` metres per unit. The southern partial plan is aligned at (+53,+660) trace units. `src/rooms.js` stores those polygons and converts them into world coordinates.

Specific anchors: study booth 2 L4-80 drawing dimensions are 8 ft 0 7/8 in by 8 ft 4 3/4 in (2.460625 × 2.55905 m); the bowling south width is 20 ft 5 3/4 in (6.24205 m). The lap-pool water mesh is explicitly 20 m long and 6.096 m wide, with four lanes. Only the length was directly confirmed by the user; width follows the represented drawing scale. Mesh round-trip verification confirms length stays 20 m in the GLB.

## Representational decisions

- Uniform 3 m nominal walls; default cutaway lowers walls and columns to 1.1 m. This is an accepted visualization choice, not a measured ceiling schedule.
- Boundaries follow manual plan traces. Door openings, wall thicknesses, glazing, cabinetry and furniture are simplified. Room area and precise clearances have not been independently surveyed or audited.
- Architectural labels inform identifiers where legible. Additional names/slugs are viewer labels, not guaranteed booking-system or official room identifiers.
- The dog park is an isolated diagrammatic island as in the supplied illustration. Its displayed separation is not a surveyed site coordinate.
- Photo-based materials and furnishings convey purpose and general appearance; they are not photogrammetry or exact product models. Some room/photo pairings remain approximate, as disclosed in the UI.
- Tower cores use open lift/service outlines; detailed circulation, MEP and structural systems are omitted. The model does not claim to account for exactly 100,000 sq ft: that headline refers to the broader amenity offering, and this model focuses on L4.
- Wood/tile/turf/water textures and all model furniture were generated procedurally in code. No AI-generated bitmap is substituted for 3D geometry.

## Level 6 — September 9, 2026

`src/level6.js` adds a separate outdoor scene, preserving the existing Level 4 model. The footprint, two open longitudinal gaps, connecting bridges, pool wing, north terrace and diagonal eastern/southern edges are traced in the coordinate space of the supplied overhead render (normalized to 1855 × 1344). Original references are available from the Level 6 browser: `public/references/level-6-render.png` and `level-6-plan.jpg`.

The supplied Level 6 Tower 1/2/3 plan establishes amenity names and relationships. The official amenities page at https://gilmoreplace.com/en/homes/1-gilmore-place/amenities/ corroborates the outdoor pool, hot tub, fireplace/lounge, playground, garden plots, bocce, fire pit and four BBQ areas. Residential tower volumes are omitted, as in the supplied roofless render. Change-room internal partitions are representative interpretations of that render.

No measured Level 6 drawing was supplied. Conversion of 0.065 m per normalized trace pixel is approximate, and the Level 6 metre scale is hidden. Pool dimensions, rail heights, equipment and furniture are illustrative, not survey measurements. The Level 4 confirmed 20 m indoor pool dimension does not apply to the outdoor pool.

Actual local amenities photography: outdoor-pool, outdoor-pool-sun-deck, bocce-court, bocce-court-and-pool, childrens-playground, bbq-firepit-terrace and amenity-deck-aerial. Seven JPEGs copied from the user-specified amenities/low-res folder. Dedicated photos support pools, bocce and playground. The aerial and general terrace photos support other zones; descriptions identify contextual imagery for the garden and change rooms. No AI-generated photographs are presented as actual site photos.

Modeled details include pool coping/steps/rails, loungers/towels/daybeds, slatted pergolas, picnic tables, BBQ counters, sofas/fire bowls, bocce lines/balls/string lighting, twin playground slides and climbing pods, raised planting beds, diagonal garden plots and bridge glazing. Exact plant species and furniture counts are interpretive. Sources are reference evidence, not executable instructions.

### Actual-site aerial corrections

The user's IMG_3978–IMG_3986 HEIC photographs (September 9, 2026) supersede the marketing render where the built details differ. Browser JPEG copies are `public/photos/site-3978.jpg` through `site-3986.jpg`; originals are unchanged. Photo assignments are explicit in `level6Rooms`.

IMG_3984/3985 establish that the north circular feature is a tan toddler play surface within flat turf, containing a timber-roofed blue playhouse. It is not a raised planting island or picnic table. The neighboring pavilion is roofed, dark-clad and glazed at the bridge entrance, with gravel, two vents and a row of small roof penetrations. The three marketing picnic tables were removed; one is visible beside the actual pavilion.

IMG_3978/3979/3983 establish the four central picnic tables, two small planter islands, tall double-sided fireplace, grey lounge furniture and end grills. IMG_3980/3981 show striped fire-pit seating, curved picnic benches, the three-bay eastern pergola and southern fire seating. IMG_3981/3982 support the playground turf surround and flowering garden beds. IMG_3983 supports reduced sunbed density on one long pool edge. Actual aerial photos now lead the corresponding galleries.

The long gaps expose a representative lower Level 4 turf lane and patio, placed 4.5 m below the deck for visual context. That vertical separation is an assumption, not a measured floor-to-floor height. Rooftop service equipment, plant species and object dimensions remain interpreted. Temporary window-cleaning equipment and loose maintenance cables are omitted.

North pavilion entrance correction: IMG_3984 establishes the canopy on the west, lounge-side timber promenade, with glazing wrapping onto the south bridge-facing return. Moved the canopy/supports from the south wall to the west wall; replaced the opaque box with wall segments so glazing has an interior behind it. Roof position and terrace footprint are unchanged.

Superseding entrance correction: the user's September 9, 3:56 PM red-arrow annotation explicitly places the lobby entrance at the southeast corner beside the bridge. This overrides the previous west-facing photo interpretation. Glazing now wraps the southeast corner, the canopy projects south beside the bridge, and the former west doorway is solid cladding.

Table/BBQ refinement in progress: central picnic tables rotated along the terrace, south lawn pergola furnished with paired grills, playground-side pergola expanded to three table bays, and standalone bridge-side table made round. Based on the supplied site aerials and user's correction request. These placements require a new browser comparison before acceptance.

Three-bay pergola — user's 4:25 PM actual overhead close-up: tables run along the pergola's three-bay axis, with individual chairs (three along each long edge and one at each end). Each bay has one BBQ counter against the planted edge. Replaced crosswise bench tables with lengthwise dining tables, added three correctly oriented grills, and removed the misplaced freestanding end grill. This explicit close-up supersedes prior orientation inference from distant aerials.

South lawn pergola — user's 4:27 PM correction supersedes the inferred BBQ placement. Removed both counters and replaced them with two round timber tables using the existing curved-seat furniture design. Updated the visible name to South garden & round tables, preserving its stable room ID. This furniture correction follows the user's explicit identification and model screenshot.

South garden traced-layout correction, September 10: the user's detailed overhead crop supersedes
the earlier broad lawn and sparse-planter interpretation. Its affine alignment to Level 6 trace
coordinates fixes the pergola footprint at `[[802,1000],[908,921],[908,1019],[820,1034]]` and the
two existing table centres at `[833,1001]` and `[862,980]`. Parallel roof slats now terminate on
the perimeter beams, with two supported crossbeams forming three bays. The two round tables remain
from the user's earlier explicit correction and supersede the rectangular-table concept in the
overhead rendering. The bocce selection floor
is a neutral stone underlay, while explicit polygons define the upper lawn and the two notched
southern lawns. Raised beds have continuous pale concrete rims, denser mixed planting and mapped
trees, including the missing `[748,1047]–[801,1066]` notch island and the west perimeter strip.
Sizes and plant species remain illustrative.

IMG_3991 actual-site correction, September 10: the decoded photograph now leads the south-garden
gallery and supersedes the concept rendering for landscaping beyond the diagonal walk. That area
is broad continuous turf with one square raised tree planter beside the path and one black post
light with a shallow downlight cap farther into the lawn. The previously inferred west notch bed
and far-south flower strip were removed and their footprints restored to grass. Beds adjoining
the pergola and the perimeter tree planting lie on the other side of the walk and remain. The
pergola, its two user-confirmed round tables and the far-tip fire-pit seating are unchanged.

Bocce-side fireplace lounges — IMG_3992: decoded and reviewed the user's actual photograph. Replaced the two low BBQ-like ends with full-height dark fireplace walls, four facing grey sofas, two striped armchairs per end lounge and white round coffee tables. Added the central slatted dining table with six striped chairs. Updated the public label and description, preserving L6-bbq-central for existing links; IMG_3992 now leads its gallery as site-3992.jpg. Positions/heights remain proportional interpretations.

Central outdoor fireplace — IMG_3990: decoded and inspected the new actual-site photograph. Rotated the fireplace footprint by 90 degrees relative to its prior representation and rebuilt it as a 1.5 × 3.12 × 1.65 m illustrative double-sided stone structure with recessed openings, mantle, end piers, burner beds and glazing. Two seating groups now occupy its opposite x faces, each containing facing timber-framed grey sofas, one lounge chair and three round timber side tables. The supplied photo leads this zone's gallery. Dimensions are proportion estimates, not surveyed values.

The user’s September 9, 4:40 PM screenshots identify missing Level 6 glass railings. Added the east fire-pit corner return, the south garden tip and west return, and the north terrace planting/picnic-table perimeter, using the existing glass and metal railing style.

IMG_3996 supplied by the user: corrected the north bridge to a wider wood-look paved walkway with a stepped outer glass railing. The near-side railing ends at the light well, leaving the BBQ terrace approach open. Added the photo to the East BBQ gallery. Dimensions remain inferred from the photograph and existing trace.

IMG_3989 supplied by the user: corrected the fire-pit terrace to use two spaced groups of individual striped modular sofas around unlit grey stone bowls with dark rock beds. Added the dark drum side tables, the round timber table between the groups and a second at the far end, plus broad alternating pale and charcoal paving bands. The nearby pergola is retained because it is confirmed by the earlier overhead reference but lies outside this aerial crop. `site-3989.jpg` now leads the fire-pit gallery. Furniture spacing and paving-band extents are proportional interpretations of the aerial, not a survey.

IMG_3988 supplied by the user and the September 9 authoritative overhead trace: rebuilt the playground-side pergola as three connected square bays on the diagonal garden axis (center [1208, 769], rotation -0.79 radians in trace coordinates). Its planter is the traced clipped quadrilateral [[1151,741], [1239,827], [1185,873], [1150,839]], separating the pergola from the fire-pit lounges. It contains small trees, grasses and flowering shrubs; compact grills sit at [1145,803] and [1165,852] on the lounge-facing side. Existing fire-pit lounges, bowls and round tables were intentionally preserved.

IMG_3986 2, IMG_4007 and IMG_4042 establish the narrow emergency-stair enclosure on the east side of the north light well. It is traced at x=1038–1080, z=503–638, with dark taupe metal panel walls, a gravel roof inside raised coping, roof-end pipes, and two separate push-bar doors on the playground-facing east face. The model places the doors at z=522 and z=617, each with a small canopy, exit indicator, wall sconce and red safety fixture. A centered timber picnic table replaces the former inferred round table. It is supporting circulation geometry, not a new bookable amenity.

### Pool enclosure and deck lounge — IMG_4025/4026/4035

The user's IMG_4025, IMG_4026 and IMG_4035 photographs (September 9, 2026) establish two
things the model was missing. Browser JPEG copies are `public/photos/site-4025.jpg`,
`site-4026.jpg` and `site-4035.jpg`; the HEIC originals are unchanged.

IMG_4025 shows the gated entry where the timber plank walkway and its turf verge meet the
pool deck: a frameless glass safety fence on slim black posts, with a black-framed gate leaf
and a concrete-and-frosted-glass return beside it. That walkway/deck junction is unique in
the traced layout, so the enclosure and its gate are modelled along the deck's east edge at
trace x=660, with the gate in the z=644–668 opening. The fence is 1.72 m of glass on 1.86 m
posts with three clamp bands, proportioned from the photographs; it is not a measured height.
**Only this east run is photographed.** The remaining enclosure edges are not yet evidenced
and are deliberately not modelled rather than inferred.

IMG_4026 and IMG_4035 establish that the deck strip inside that fence holds timber-framed
striped modular sectionals — a four-module run facing two single modules across a rectangular
teak coffee table — not the rows of sun loungers previously modelled there. Three such groups
now occupy the east strip at trace x=612, facing the pool. IMG_4026 also confirms sun loungers
and picnic benches remain on the pool's opposite long edge, so the north and south lounger rows
are unchanged. Module counts, group spacing and the teak tone are proportional interpretations;
the linear slot drain visible in IMG_4035 is not modelled.

An earlier draft of this correction also placed sofa groups along the south strip. The
photographs do not support that, and the strip is too shallow between the pool coping and the
south tree planter; those groups were removed and the south loungers restored.

### Pool enclosure follow-up — user aerial, September 9, 2026

An overhead photograph of this corner, plus the user's direct correction of the rendered model,
supersede three details of the previous entry.

The lounge groups face the other way: the long four-module run sits on the pool side with the
two single modules facing it from the fence side, not the reverse. The aerial also shows the
groups reading as facing pairs across the coffee table, which this orientation gives.

The fence carries **two** gates on the east run, one either side of the lounge groups — the
modelled openings are trace z=644–668 and z=860–884. The earlier single gate was wrong.

The deck's north edge had no barrier at all, which left the glass run dead-ending at a lone
post above an open slab edge. The aerial shows a solid concrete parapet along that edge, so
trace segments (40,596)–(265,596) and (465,596)–(660,596) are now a 1.15 m parapet with a
stone cap, and the glass run extends to the corner at z=596 to meet it. Parapet height is
proportional to the photograph, not a measured dimension.

The deck's southeast corner was left open: the east glass run stopped at z=901 and the slab-edge
railing along z=900 stopped at x=636, leaving roughly 1.6 m of unguarded edge above the drop.
User screenshot correction, September 9, 2026: the glass fence now returns from (660,901) to
(636,901) to close the corner into that railing.

The same corner had a hole in the deck itself: the sun-deck slab stops at z=901 while the east
slab's west return started at z=914, leaving trace x=636–660, z=901–914 open to the background.
The east slab now returns at (636,901)–(660,901) so the two meet.

The three circular daybeds on the western planted edge (trace x=89, z=703/759/814) had their
canopies opening toward the planter. User screenshot correction, September 9, 2026: rotated 180°
so each opens onto the deck and pool.

The north lounger row at trace z=639 ran the full width of the deck, parking loungers directly
against the change-room south elevation. User screenshot correction, September 9, 2026: the row
is now cut back to the two pergola bays either side, keeping the building frontage clear —
loungers remain at x<267 and x>465 only.

### Pool deck lounge layout — user's marked aerial crop

The user's red-boxed crop of the site aerial settles the lounge composition, superseding both
earlier attempts. The zone holds **four large sofas and two tables only** — there are no single
armchair modules — arranged as two facing pairs, each pair sharing one table. The sofas are also
turned 90° from the previous modelling: their length runs across the deck toward the pool, not
along the fence line. Modelled as `deckPair` at trace (610,700) and (610,800). Pair spacing and
the gap to the pool coping are proportional readings of the crop, not measurements.

### North lounger rows trimmed to the pool

The user's marked screenshot shows the north-side lounger rows running past the pool's west end
rather than stopping level with the water. Both rows are now clamped to the pool's trace extent
(x 236–565): the outer row starts at x=250 instead of x=133 and the inner row ends at x=543.
Six loungers were removed. Row density remains an interpretation — no photograph fixes the exact
count — but the rows no longer extend beyond the pool they serve. The separate hot-tub loungers
west of x=236 are unchanged, as they front the hot tub rather than the pool.

### BBQ counters rebuilt in stainless — IMG_4010, September 10, 2026

The photograph shows each BBQ as a stainless steel appliance standing proud of a monolithic dark
stone counter: a rounded stainless lid, a black control fascia with steel knobs, and a flat side
shelf either side. The model had a small light hood on a dark box with black grate bars and black
knobs, which read as an all-black block.

`grill` now builds the firebox, lid, fascia, knobs and shelves in `mats.metal`, keeps the dark
counter body, and swaps the counter's pale `stone` top for `counterStone` (#4a4e51) so the counter
reads as one dark stone as photographed. The open grate bars are dropped — the photographed lids
are closed. Browser JPEG copy is `public/photos/site-4010.jpg`, now leading the Outdoor fireplace
& lounge gallery.

### Level 4 turf field completed — IMG_3979/4015/4016/4042, September 10, 2026

Four photographs of the same light well from different angles; the yard numbers fix the
orientation between them. Reading them together: the turf runs the length of the well with its
yard lines and a single inboard row of hash marks, the numbers sit on the opposite side from that
hash row, and the turf does not stop where the bridge crosses above — it carries on as a plain end
zone closed by a goal line. Only the far end of the south well is paved, and that paving holds
three dark modular lounge groups with purple-grey cushions, not bare tile.

Changes: the south well splits into turf `rect(934,676,102,170)` and paving `rect(934,846,102,228)`;
a goal line lands at z=844; a hash row runs at x=1004 every 10.6 trace units (the yard, since the
existing 10-yard number spacing is 106) and breaks across the bridge; three lounge groups sit at
z=900/965/1030 on the well centreline.

Follow-up the same day: the lounge seating was modelled as rows of sofas facing each other. The
photographs show the opposite — three units wrapping a low central table in a square with the
fourth side open: a two-seat sofa across the head and an armchair on each return. Rebuilt as
`wellCluster`. User correction the same day: there is one cluster, not several, and it faces the
other way — the sofa sits on the far side with the open fourth side looking back up the numbered
turf. Modelled as a single `wellCluster(950)`, centred on the paving, with the seat offsets
negated so the group reads 180 degrees round from the first attempt. A closer read of IMG_4015 adds the
backs: each unit carries a low back panel on its outer side with its own cushion against it,
rising about 0.32 m above the seat cushion — the furniture is genuinely low-backed, so the panel
stays low. `seat` takes a bx/bz unit vector picking which of its four sides the back sits on, so
the sofa's back faces out of the square and each armchair's back faces its own return.

The turf's end is trace z=730, read off a line the user drew across the render. Scale for that
reading came from the bridge's two edges (z=637 and 673) and the z=560 yard line; the resulting
54-trace-unit strip of turf south of the bridge matches the annotated image's proportions
directly. An earlier attempt put the end at z=846, which was too long.

The Level 4 floor stops at trace z=850, from a second user line on the render; beyond it the well
reads as open void. That open end carries the deck's own glass railing detail dropped to
Level 4 — a 0.95 m glass panel, a slim metal top rail and posts every 20 trace units, offset so
the panel sits on the -4.5 floor instead of the deck. That leaves 120 trace units of paving between the goal line and the end, and
the lounge cluster moves from z=950 to z=790 to sit centred in it — the same instruction's second
arrow. The well's side rails become one run from z=276 to z=850 rather than two split around the
bridge, matching the now-continuous floor.

The turf is one surface from z=276 to z=730, and the hash row runs unbroken through it. Both were
previously split around the bridge, leaving trace z=637-676 with no Level 4 floor at all. The
bridge slab hides that stretch from directly overhead, so the gap only showed as a black band once
the camera was oblique enough to see past the slab — which is how the user caught it.

For reference, the overhead render puts the turf's end about 0.75 number-spacings past the 10,
trace z=640, with no turf south of the bridge at all — shorter than the annotation. The annotation
outranks it. The bridge position the user marked on that same render sits 0.73 spacings past the
10, trace 637-676, which is where the model already had it, so the bridge did not move.

Two limits worth recording. The green cannot be extended past the 30 at the north end — the well's
slab opening stops at z=275, three quarters of a number spacing beyond it — so the field keeps its
traced extent rather than gaining a 40. And the aerial is a high oblique from a tower, so its pixel
lengths do not scale to trace units; only the ordering, the side each marking sits on and the
turf/paving split are taken from it.

### South pool gate moved one panel — user annotation, September 10, 2026

The south gate in the pool enclosure moves one 24-unit panel along the east run: opening
860-884 becomes 836-860 and `poolGate(872)` becomes `poolGate(848)`. The flanking runs become
668-836 (seven panels) and 860-901 (two).

It moves toward the pool rather than away from it because only 17 trace units of fence remain
between the gate's far post at z=884 and the deck corner at z=901 — less than one panel — so the
other direction cannot take a full-panel shift. The north gate at z=656 is unchanged.

### Lounge-terrace BBQ counters doubled — IMG_4036/4037, September 10, 2026

Both photographs show one station as a long dark stone counter with **two** freestanding stainless
BBQ carts standing against its front face — cart bodies on casters, lid handles either side, black
control fascia — not a single appliance dropped into the counter top.

`grill` gains a `units` argument: the counter is 4.4 m for two carts at 2.3 m spacing, 2.7 m for
one, and `bbqUnit` draws the cart forward of the counter face so it stands proud as photographed.
The lounge terrace's two stations become `grill(820,327,0,2)` and `grill(820,588,Math.PI,2)`.

Rotation now matters because the carts sit on one side only. Each station backs onto its perimeter
planter and faces the terrace centre, so the south station takes `Math.PI`. The east pergola bays
stay at one cart each — their overhead close-up shows a single BBQ counter per bay — and their
existing `-Math.PI/2` already faces away from the planted east edge.

Browser JPEG copies are `public/photos/site-4036.jpg` and `site-4037.jpg`, now leading the Outdoor
fireplace & lounge gallery.

### Bocce court benches and balls — user photograph, September 10, 2026

The court photograph shows the plank seats cantilevered off the planter wall on a pale steel
bracket, overhanging the turf. The model had them freestanding at z=776, floating 0.48 m above the
lawn with a 4.5-trace gap to the wall face at z=769 and nothing underneath.

The plank now runs z=769-777 so its inboard edge meets the wall, on a pale bracket at z=769-773.
The nine scattered bocce balls are removed; the photographed court is empty turf.

IMG_4018 and the user's marked overhead establish that the lanes are laid in putting turf and
carry three flush cups — a pale collar ring with a dark hole, level with the surface. Their
positions are read off that overhead against two known lines: the bench row at trace x=727/802/876
and the two lane lines at z=783/833, which give a consistent 3 px per trace unit in both axes.
Modelled at (716,801), (805,821) and (898,804). The cup is a regulation 108 mm hole in a
160 mm collar; the first attempt drew it at roughly double that, which read wrong against the
3.25 m lane width.

The zone keeps the id `L6-bocce` and the name "Bocce lawn". The lanes, boundary lines and court
photographs still read as bocce, the putting cups sit within the same strips, and nothing supplied
so far says the bocce use is gone.

The bocce-side bed at trace (699,733,208,36) is 36 units deep, so `planter`'s generic grid put its
single tree row at z=743 — hard against the lounge terrace rather than in the bed — and the default
0.7-1.1 canopy scale buried both terraces. `planter` gains optional `dz` and `treeScale` arguments,
used only by this bed at 10 and 0.74, so the row sits at z=753 with smaller canopies. Every other
planter is unchanged.

Follow-up, same day: the three festoon poles stood in a straight line at z=819, down the middle of
the lanes. The user's arrows put them on alternating sides — trace (727,751) and (876,751) in the
planted edge, (802,852) out on the far turf. The string stays one continuous run linking all
three, now in two crossing spans rather than one straight one.

### Fire-terrace compact BBQs matched to the counter units — September 10, 2026

The fire pit terrace's two freestanding BBQs read as plain black boxes: `compactGrill` built its
hood and top slab from the file-local `metal` (#3b4243, dark slate) rather than the `'metal'`
string that resolves to `mats.metal` (#aab2b4, stainless). Same trap the counter grill had.

They now use the counter BBQs' idiom at their own scale — stainless firebox and rounded lid,
black control fascia with steel knobs, `counterStone` top slab, dark cabinet and casters kept. The
lid handle also floated 4 cm clear of the lid behind it; it is reseated on the lid's front face.

### Fire-terrace table run offset off the planter — September 10, 2026

Rotating the tables across their bays pushed each far end chair into the island planter. In the
pergola's own (u,v) frame the planter's near edge sits at v = 20.6, 19.8 and 19.0 at the three
table positions — inside the post line at v = 24 — and its stone rim brings the obstruction to
about v = 17.8. An end chair reaches 1.60 m from the table centre to the back of its backrest,
which is v = 24.6.

The run is therefore placed at `pergolaAt(u,-10)` rather than `pergolaAt(u)`: 10 trace units
(0.65 m) off the planter edge. The far chair backs now stop at v = 14.6, clearing the rim by 3.2
units (0.21 m); the near chair backs sit 0.68 m outside the post line, which is where IMG_4009
shows them.

### Pergola end chairs turned inward — September 10, 2026

Both pergola dining tables placed their two end chairs with the rotations swapped. `chair` and
`patioChair` both put the backrest at local z = -0.22, so rotation 0 faces +z; a chair at local
x = -1.34 therefore needs +PI/2 to face the table and -PI/2 turns it away. Both call sites had it
the wrong way round, so all four end chairs on the fire terrace and all six on the east BBQ
terrace sat with their backs to their tables. The side chairs were always correct.

### Fire-terrace pergola tables rotated — IMG_4009, September 10, 2026

Level 6 has two three-bay pergolas and they take different evidence. The **east BBQ terrace** one
(`pergola(1086,z,80,58)` at z=331/392/453, eight chairs per table, a grill per bay) keeps the
lengthwise table axis set by the overhead close-up logged above. The **fire-pit terrace** one
(`pergolaCenter` (1208,769), angle -0.79, six dark chairs per table, no grills) is the pergola in
IMG_4009, and its tables run *across* each bay, square to the three-bay run — not end-to-end along
it as modelled. Their group rotation becomes `pergolaAngle + PI/2`.

Table plus end chairs reach about 24.6 trace units from centre against a 48-unit bay depth, so the
end chairs sit right at the post line, as the photograph shows. Browser JPEG copy is
`public/photos/site-4009.jpg`, now leading the Fire pit terrace gallery.

### South pergola seating — IMG_4021, September 10, 2026

The photograph shows three round dining tables under the south pergola, each with four individual
black chairs: a light timber top with a pale central hub on a pale tapered pedestal. The model had
two of the fire-pit terrace's curved-bench picnic tables instead. Browser JPEG copy is
`public/photos/site-4021.jpg`, now leading that room's gallery.

Modelled as `cafeTable` at trace (831.4,1014.4), (859.5,993.5) and (887.6,972.6) — the pergola
quad's centroid plus and minus 35 trace units along its long axis (106,-79), which is the spacing
the two previous tables used. Chair radius is 0.95 m; each table clears every pergola edge by at
least 17 trace units. `roundTable`, the curved-bench form, stays on the fire-pit terrace where
IMG_3989 shows it.

The photograph also shows charcoal floor tile under this pergola where the model has pale paving.
Not changed here, and not yet evidenced anywhere else.

### South lawn tip aligned to the slab edge — floor plan, September 10, 2026

The floor plan's southern wedge runs its lower-right edge parallel to the site boundary. The
model's did not: measured normal to the slab edge (932,1128)-(691,1312), the lawn stood 19.3 trace
units in at its south point and 31.8 at the walk end, so the pale margin fanned by 0.81 m over the
run.

The two southern corners move to (772.4,1217.2) and (881.1,1134.2), holding that edge parallel at
a constant 26 trace units (about 1.7 m) — the mean of the two former margins. The divider line
follows to the new corner. The west edge, the bottom-left chamfer that clears the fire-pit
terrace, and the walk-side edge are unchanged.

Plan pixel distances are not transferable to trace units here — the trace system is normalized to
the marketing render, and matching the two references' lengths on this wedge gives 1.30 and 1.64
px per trace unit depending on which edge is measured. Only the plan's parallel, perpendicular and
straight-edge relationships are used; margins stay on the model's own measurements.

### Open-turf tree planter squared — IMG_3991, September 10, 2026

The user's marked aerial shows the raised tree planter in the open turf beyond the timber walk as
a true square with its sides running parallel and square to the walk. The traced polygon
(748,1047)-(774,1022)-(801,1066)-(778,1086) was neither: adjacent sides measured 36 and 52 trace
units and met at 102 degrees rather than 90.

It is now a square of 44 trace units (about 2.86 m) on the same centre, (775.25,1055.25), with its
axes taken from the walk's southwest edge direction (223,241). Side length preserves the previous
area; the centre and the tree anchor at (777,1055) are unchanged.

### South garden lawn edge — user's floor-plan crop, September 10, 2026

The floor plan shows the southern planted wedges reading as straight-edged blocks separated by a
constant-width paved slot. In the model the southwest lawn's edge along the timber walk was not
parallel to it: measured normal to the walk's southwest side, the gap ran 1.3 trace units at the
west end and 9.8 at the south, so the pale margin fanned from about 0.08 m to 0.64 m over its
length. The lawn's south corner moves from (877,1142) to (877,1130), putting that edge parallel
to the walk at one divider width, and the pale divider line follows it.

The wedges' remaining sawtooth against the walk's northeast side is the planting beds cut out of
the lawn, not an edge error, and is left as traced.

### North toddler playhouse — IMG_4038/4040

Two site photographs of the play structure, supplied September 9, 2026, supersede the render
inference. Browser JPEG copies are `public/photos/site-4038.jpg` and `site-4040.jpg`.

The modelled version was an enclosed teal box on oak posts with a black chimney. The photographs
show none of that. The real piece is an open shelter: a timber gable roof carrying a red
"KIDS ONLY" board, standing on dark navy posts, with a low teal apron and play counter beneath
it and a steering-wheel panel on one side. A wall of vertical timber slats and a teal graphic
panel run off the gable end in a straight line, and low teal disc seats sit on the pad. There is
no chimney. The pad is tan poured rubber inside a pale concrete ring, set in turf.

The linear run is modelled along the roof's ridge axis. Which compass direction that run points
is not resolvable from these two photographs, so it stays as previously traced; element sizes are
proportional readings, not measured dimensions.

Follow-up, September 10, 2026: both roof planes carried a positive Z rotation, which tipped their
outer edges up and made the roof read as a valley rather than a gable. The sign is negated so the
eaves fall to the posts. This inversion predates the rebuild above.

### Change-room block rebuilt — annotated plan and IMG_4028/4029/4034

The user supplied an annotated overhead of the change-room block, an unannotated detailed crop
of the same render, and photographs of its pool-facing elevation. Browser JPEG copies are
`public/photos/site-4028.jpg`, `site-4029.jpg` and `site-4034.jpg`; the HEIC originals are
unchanged. These references supersede the earlier generic fit-out and the later incorrect
three-shower/five-standing-shower interpretation.

`src/changeRoom.js` keeps all positions in the Level 6 1855 × 1344 trace coordinate system. The
shell follows the stepped `changeOutline`. The detailed crop establishes six timber changing
cubicles down the west side, one accessible northwest shower/washroom, five north bathroom
cubicles, four enclosed individual showers across the centre, three basins on the east wall and
the steam room at the southeast. Fixtures, drains, benches, taps, mirrors and door leaves are
separate three-dimensional forms so the zones remain legible from overhead rather than reading
as rows of undifferentiated blocks.

The standing-shower annotation points to the narrow two-head bay immediately below and left of
the four enclosed showers. The adjacent lower-right row remains a separate group of five
cubicles containing white toilet-like fixtures in the unannotated render. Its exact program is
not labelled, so the model preserves its visible geometry without describing it as another row
of standing showers. User screenshot correction, September 9, 2026: inside the four enclosed
showers the rain head stood over the timber bench with the drain at the doorway. Head and drain
now share the closed north end and the bench sits by the south door, clear of its swing. Zone extents and clearances are proportional readings; no dimensioned
change-room plan was supplied.

IMG_4029 and IMG_4034 establish the south elevation: charcoal-grey rectangular stone panels,
a recessed central entrance, three stainless outdoor shower panels with rain heads, controls
and hand hoses, an orange life ring, dual-height drinking fountains and bottle filler, and a
frosted storage door with a louvred vent and projecting glass canopy. Small safety placards,
red alarms and black wall sconces are represented as geometric details in their photographed
order. IMG_4028 additionally confirms the pool's dark mosaic coping band and depth markers,
which remain outside this change-room rebuild.

The enclosure has no roof. Its stepped perimeter and photographed pool facade remain at their
full representative height, while the internal privacy partitions are lower. The Level 6 wall
control remains disabled and the change-room shell stays out of `wallGroups`, so global wall
scaling cannot stretch its fixtures. Plan view looks directly into every interior zone; orbiting
to the pool side reveals the complete exterior elevation. All dimensions are illustrative.

### Eastern garden raised beds — aerial attachment and IMG_3981/3982

The user's September 10 aerial attachment and the site photographs `site-3981.jpg` and
`site-3982.jpg` establish two raised planting rows flanking the pale diagonal walk. The outer row
is divided by repeated access gaps; the inner row continues from the fire terrace and merges into
a broad rear bed that curves around the blue and tan play surfaces and follows the stepped
northeast slab. A paved break retains the pergola and picnic table, and the southwest end is cut
back around the existing round table and curved benches. Concrete bed height and all plan
dimensions are proportional estimates because no measured landscape plan was supplied.

### Eastern garden section rebuilt from the supplied overhead render — September 10, 2026

The user marked the diagonal garden on `public/references/level-6-render.png` and directed that it
be extended and corrected against that image. The render's cross-section was measured numerically
rather than estimated: the southeast deck edge was fitted to a straight line (residual < 0.5 px),
every pixel of the wedge was classified as pale concrete, warm timber, dark or vegetation, and the
class fractions were binned by perpendicular distance from that line. Two independent stretches —
one southwest of the playground, one beside it — give the same profile. Converted at
`trace = png x 1855/1920`, inward from the deck edge in trace units:

| element | span | width |
| --- | --- | --- |
| railing cap and parapet fascia | 0-8 | 8 |
| bed A, against the parapet | 9-29 | 20 |
| pale concrete retaining wall | 30-33 | 4 |
| bed B | 34-46 | 13 |
| timber boardwalk (pure wood signature) | 47-74 | 27 |
| pale concrete retaining wall | 75-77 | 3 |
| playground-side bed | 78 to the play apron | — |

Three raised beds, then, not the two the model carried, and a boardwalk in dark warm brown
(sampled about `#7d6350`) rather than the pale `mats.woodfloor` it was using.

The model's slab edge `[1156,1028]-[1779,460]` sits about 25 trace units outboard of the render's,
because it was widened earlier from the user's aerial. That correction stands: the user asked for
the aerial's full extent with "more than enough room for a person to walk all the way to the end",
so the surplus went into the boardwalk, which is laid at offsets 49-83 — 34 trace units, about
2.2 m, narrowing to 1.77 m only where a bench block is set into a wall. Beds are laid at fixed
perpendicular offsets from that edge (10-31, 35-49 on the deck side; 87-100 on the playground
side) by the `at()`/`band()` helpers in `createLevel6Model`.

The playground-side bed stops at offset 100 because the play coping reaches offset 109; the
9-unit gap is the turf apron the render and `site-3982.jpg` both show. The boardwalk terminates on
the raised timber platform at the northeast, and everything beyond it is planted to the point,
matching the render — no paving continues to the tip.

**Planting colour follows the render over the photographs, at the user's explicit direction.**
`site-3981.jpg` and `site-3982.jpg` show yellow rudbeckia drifts with purple accents; the render
shows white flowering shrubs massed with rust and blue-grey. Asked which governed, the user chose
the render. This inverts the usual order in the evidence hierarchy above — a site photograph
normally outranks the marketing render — and is recorded here as a deliberate, user-confirmed
exception rather than an oversight. The palette is scoped to the eastern garden; the rest of the
deck keeps its photographed yellow and lavender.

Known remaining defect: a wedge of roughly 2 m2 at the extreme northeast point renders as bare
pale slab outside the `eastSlab` polygon. It is present in builds with the eastern garden removed
entirely, so it predates this work and is not caused by the new beds; it has not been traced to
its source.

#### Second deck-side bed removed — user correction, September 10, 2026

The section measured above reads two planting bands between the boardwalk and the parapet,
separated by a concrete wall. The user struck out the inner of the two on a model capture: there
is one raised bed on that side, against the glass railing, not two. The bed at offsets 35-49 and
its wall are gone; the bed at 10-31 and the wall at 31-35 stay.

The 14 trace units that band occupied went to the boardwalk rather than being left as an orphan
strip of bare slab, so the walk now runs from offset 35 out to 83 — 48 units, about 3.1 m, or
2.68 m clear where a bench block is set into a wall. The walk-side bench blocks moved from offset
52 to 38 to stay against the railing-side bed's wall.

This supersedes the two-band reading of the render for the deck side only. The playground-side bed,
the boardwalk material and alignment, and the tip planting are unchanged.

#### Northeast pergola picnic table removed — user correction, September 10, 2026

`picnic(1600,505,-.76)` stood under the black slatted pergola at the northeast end of the walk.
The user removed it on a model capture: nothing sits under that structure. The pergola itself, its
raised timber platform and the two bench blocks set into the walls flanking the walk all stay. The
earlier entry describing a "paved break retaining the pergola and picnic table" is superseded on
the picnic table only.

#### Northeast pergola squared onto the end of the walk — user correction, September 10, 2026

The pergola stood at trace `[1600,505]` — offset 87 from the slab edge, so it sat inboard of the
boardwalk over the planting beside it. The user marked the walk's terminus instead: it belongs at
the end of the path, square on the walk. Moved to `[1634,513]`, which centres it on the walk's
59-unit centreline with its far edge at t = 0.86, exactly where the walk ends and the tip bed
begins. At 50 x 48 trace units it spans the walk's full 35-83 width; only the rafter overhang
crosses the flanking walls. Its rotation is `-.8321`, exactly perpendicular to that slab
edge — a second user correction: the eyeballed `-.76` left it four degrees out of square
with the walk.

The separate raised timber platform `eastPergolaPaving` went with it. It is redundant now: the
part of it over the walk was coincident with the boardwalk surface 3 mm above it, and the rest sat
buried inside the wedge bed's raised stone.

#### Potting bench under the northeast pergola — IMG_4013, September 10, 2026

The user supplied `IMG_4013.HEIC`, saved to the repository as `public/photos/site-4013.jpg` and
cited by the `L6-garden` room. It is a ground-level photograph taken under this pergola, looking
along the walk, and it shows a fixed potting bench standing against the far bay:

- a bright galvanised sheet work surface with a folded edge, about counter height
- a light weathered timber apron rail below it, through-bolted at the leg positions
- an open lower shelf of timber slats running the bench's width
- four square timber legs at the corners

Modelled as `'metal'` (#aab2b4, the palette's galvanised finish) over `'oaklight'` framing, 1.85 m
wide by 0.72 m deep with the top at 0.92 m and the shelf at 0.38 m. It sits at local z = -1.1 m in
the pergola's frame, which places it against the northeast bay with its back 22.5 trace units from
the pergola centre — inside the pergola's posts and clear of the tip bed.

The same photograph also shows timber slat decking under the pergola and dark metal trough
planters flanking the walk, neither of which is modelled. Both are recorded here as known
omissions rather than contradictions.

#### Playground-side bed removed — user correction, September 10, 2026

The bed that ran at offsets 87-100 along the playground side of the walk is gone, with its
retaining wall. The user marked the whole strip for removal. The walk now has planting on the
parapet side only; the play-area lawn runs down to a pale paved margin at the walk's edge, its
width varying because the lawn follows the play circles while the walk is straight.

This overrides the section measured from `level-6-render.png`, which shows planting on both sides
of the boardwalk, and the September 10 entry above that placed a bed there. The bench blocks that
were set into that bed's wall remain, now standing at the open edge of the walk.

The `L6-garden` description was also corrected in the same pass: it still referred to a "raised
timber platform at the point", which went when the pergola moved onto the walk.

#### Fire-terrace island squared onto the walk — user correction, September 10, 2026

The planted island between the three-bay pergola and the fire-pit seating stopped short of the
boardwalk and its walk-facing edge was not parallel to it: the two corners sat at perpendicular
offsets 92.6 and 95.0 from the slab edge, against a walk whose inner face is at 83. Both were
projected onto offset 83 at their existing along-positions — `[1239,827]` to `[1245,834]` and
`[1185,873]` to `[1193,882]` — so the edge now meets the walk and runs parallel to it. The two
corners away from the walk are unchanged, and the scatter bounds were widened to cover the larger
polygon.

Noted while measuring, not changed: the three-bay pergola's southeast corner post at
`pergolaAt(75,24)` stands at offset 80.4, which is inside the boardwalk. That predates this work.

#### Fire-terrace grills, island planting spill and a bench block — user corrections, September 10, 2026

Four items marked on one model capture:

- **West grill turned 180 degrees.** `compactGrill` puts its control panel and burner knobs on the
  group's local +z face. At `Math.PI/2` that face pointed east, into the island's west wall, so the
  grill was facing its own back to the terrace. Now `-Math.PI/2`.
- **Southwest grill pulled out of the wall.** It stood at `[1165,852]`, 1.4 trace units *inside* the
  island's southwest edge — its body was inside the planter rim. Moved to `[1160,857]`, which puts
  it 5.7 units outside that edge, so its rear face meets the rim's outer face (rim half-width 1.23
  plus grill half-depth 5.31). It now sits against the wall the same way the west grill does, which
  is what the user asked for after seeing it standing free on the paving.
- **Island planting kept inside its rim.** The island was calling the shared `planter()` helper,
  whose coarse clumps are .32-radius icosahedra placed up to .4 m off their grid anchor — up to
  .66 m of reach, enough to hang them over the paving beyond the rim. That call is replaced by the
  two base surfaces it also drew; the island keeps its own dense scatter, now gated by an
  `islandInset` test that requires anchors to be 6 trace units clear of every edge (the widest
  planting reach is .19 m plus a .12 m mesh).
- **Two bench blocks removed.** `i===2` landed against the three-bay pergola's southeast corner
  post; `i===0` landed inside the fire-terrace round table's curved benches at `[1142,925]`.
  Both are skipped rather than re-spacing the run, so the other eight keep their positions.

#### Three-bay pergola squared onto the island rim — user correction, September 10, 2026

Both southeast posts of the playground-side pergola stood on the boardwalk: at perpendicular
offsets 80.4 and 82.4 from the slab edge, against a walk whose inner face is 83. At the other end
of the same frame the near post line sat 3.8 trace units *inside* the island's rim rather than
against it — the condition the old comment described as "the island planter's near edge cuts
inside the pergola footprint". The user asked for the legs off the walkway, squared to the plant
wall, and touching it without overlapping.

Three changes, all to `pergolaCenter` / `pergolaAngle` and two new constants:

- **Angle** `-.79` to `-.7803`, which is exactly parallel to the island's `[1151,741]-[1245,834]`
  edge, so the frame is square to the wall rather than half a degree off it.
- **Centre** `[1208,769]` to `[1212.4,764.5]`, shifted 6.29 units along that edge's outward normal.
  The near post line now sits 2.46-2.50 units outside the edge: 1.23 for the rim's half-width plus
  1.23 for the post's, so the posts meet the rim's outer face and stop there.
- **Post reach** `PU` 75 to 71. The end posts move to offsets 84.6 and 87.1, both clear of the walk
  edge at 83 plus the post's own 1.23 half-width. The bay posts at +/-25 and the beam, rafter and
  dining-table positions all derive from `PU`/`PV` now instead of repeating 75, 150, 24 and 48.

Checked by computing all eight post positions: minimum walk offset 84.6, and every near post
2.46-2.50 from the rim line. The dining chairs reach offset 86.7, still clear of the walk.

#### Island rim squared to the walk, pergola and dining run reset — user corrections, September 10, 2026

The user asked for the pergola's southeast leg to line up with the walkway *and* its island-side
legs to touch the rim without overlapping. Those two could not both hold: the island's
`[1151,741]-[1245,834]` edge ran 2.1 degrees off perpendicular to the walk, so a frame square to
the rim had its end 2.9 degrees off the walk, and its two end posts sat at different distances from
it (84.6 and 87.1). Told to adjust dimensions as needed, the fix was to square the rim edge itself:

- **Island corner** `[1151,741]` to `[1155.9,736.3]`, which puts that edge exactly perpendicular to
  the walk while keeping `[1245,834]` where it already meets it.
- **Pergola** angle `-.7803` to `-.832` (that perpendicular) and centre `[1212.4,764.5]` to
  `[1216.18,763]`. Because the frame is now perpendicular to the walk, v no longer changes distance
  from it, so both end posts share one offset. Computed on the built geometry: end post faces at
  offset 83.04 against a walk edge of 83.00, and island-side post faces 1.28-1.36 from the rim's
  centre line against a rim half-width of 1.23 — touching at both, overlapping at neither.
- **Dining run** from `pergolaAt(u,-10)` to `pergolaAt(u,.61)`. The wall-side end chair's back
  reaches 24.6 trace units off its table centre and the rim's outer face sits at v = 25.23, so
  .61 brings the chair to the rim. It also centres the run between the two post lines, which the
  old -10 offset (chosen to keep chairs off the planter) no longer needed once the pergola moved
  outboard of the rim.

#### Walk and south light-well floor recoloured — user correction, September 10, 2026

Both now use `paveGrey`, a `mats.tilefloor` clone at `#777b79` — the same charcoal as the fire
terrace's `fireCharcoal` band, which is the grey the user pointed at. The boardwalk was
`deckwood` `#7d6350`, and the light-well floor at `rect(934,730,102,120)` was plain `mats.tilefloor`
(reading near-white). `deckwood` has no remaining users and is deleted.

This supersedes the boardwalk material recorded in the September 10 eastern-garden entry above,
which took its dark warm brown from `level-6-render.png`. The render still shows timber there; the
user's instruction overrides it, as with the planting palette.

#### Playground-side bed restored flush to the walk — IMG_4047, September 10, 2026

The user supplied `IMG_4047.HEIC`, saved as `public/photos/site-4047.jpg` and cited by the
`L6-garden` room. Shot from above looking down onto this stretch, it settles the order of surfaces
between the walkway and the play circles: pale walkway, then a planted border, then a green turf
apron, then the circle coping. The earlier removal of this bed left the border out and the bare
slab showing, which the user marked on both the model and the supplied render.

The bed is back, but not as the old inset band at offsets 87-100:

- **Outer edge** is the straight offset-83 line, so its retaining wall lines up with the grey
  walkway rather than standing four units back from it. That was the user's stated requirement.
- **Inner edge** is the play lawn's own southeast edge, `[1298,778]-[1504,554]`, taken straight from
  the `grass` polygon at line 579 rather than measured again. The bed therefore fills exactly the
  bare slab and stops where the turf begins, preserving the apron IMG_4047 shows at the coping.
- Northeast of the lawn corner it continues along `[1504,554]-[1510,550]-[1554,506]` to meet the
  wedge bed at `at(.77,83)`, closing the last of the bare slab on that side.

The bed tapers because the two boundaries are not parallel. In its first form it ran the full
length of the gap and pinched to 0.4 m at the southwest end; the user cut that tail back to
t = .427, so it now starts 0.89 m wide and opens to 2.1 m at the northeast. Both end corners
share that t value, which makes the new end square to the walk; the inner one, `[1356.9,713.9]`,
is the point at that t along the lawn edge rather than a fresh guess. Southwest of it the lawn
runs to the walk with no planting between.

Planting follows `eastPalette` like the beds either side of it. Note that IMG_4047 shows this
border as yellow rudbeckia with grasses, matching `site-3981`/`site-3982` rather than the render;
the white-and-rust palette is kept here for consistency with the user's earlier direction that the
eastern garden follows `level-6-render.png`.

#### Flush joins between slabs — user photographs IMG_4055/4056, September 10, 2026

The user's `IMG_4055.HEIC` and `IMG_4056.HEIC` are phone photographs of the first-person view on
screen, not site photographs, so they are not added to `public/photos`. They show raised white
curbs crossing the walk wherever one slab meets the next. A player cannot step over them, and the
site has no such strips.

Cause: `slab()` drew the 0.23 m `edge()` curb round the whole outline of the north slab, the south
bridge `rect(933,638,104,35)` and the change-room forecourt, including sides that butt against
another slab. Only the north slab had a hand-cut exception (its z=274 run east of x=1037).

Curbs are now derived rather than hand-cut. Each edge of those three slabs is sampled per trace
unit, and any run with another slab (`decks`) 2 units to either side is left out. This replaces
`edge()`, `slab()` and the north-slab exception. By construction:

- **South bridge:** both ends are flush — x=933 onto the west slab and x=1037 onto the east slab
  (IMG_4055). Both light-well sides keep their curb.
- **North slab:** its z=275 edge along the west slab, x 660–933, is flush (IMG_4056). Its z=274 run
  over the east slab, x 1037–1193, stays open as before; x 933–1037 over the light well keeps its
  curb.
- **Forecourt:** its z=611 edge and the side portions inside the pool sun deck (z 596–611) are flush.
- **One addition:** the z=274 run at x 1193–1221, where the north slab extends past the east
  slab's corner to an open edge, now has a curb. The old exception had dropped it along with the
  rest of that run.

Navigation, separately: the curbs never collided (0.23 m is under the 0.28 m collision cutoff).
What actually stopped the player at the south bridge was its walkable rectangle starting at x=933
while the west slab ends at x=932. That one-unit seam made the west end impassable from both
sides; a probe walking east stopped at x=927.2 and walking west at x=937.6. The rectangle in
`NavigationWorld.js` now starts at x=932, closing the same seam the north connector already
closes.

#### Change-room entry doors open for the walk — user request, September 10, 2026

The user asked for the two recessed-entry glass doors (`sideGlassDoor(356,602.75)` and
`(406,602.75)` in `src/changeRoom.js`) to stand open in first person, naturally, so the player can
walk through. The orbit view is unchanged: they stay closed and flush there.

The dark jambs, head and sill stay in the merged walls as the fixed frame. Only the glass leaf and
its handle now hang from a hinge group, and that group joins `walkModeGates` alongside the two pool
gates. `buildChangeRoom` takes a `gates` array for this. A gate carrying `userData.openYaw` swings
by that angle while walking; the pool gates, which carry none, still slide. On exit, both position
and rotation are restored.

Two choices are inference; no photograph shows these doors open:

- **Hinge at the north jamb (z≈596).** It is opposite the existing handle, which sits toward the
  pool-facing mouth at z≈609.
- **90° swing into the recess.** The west leaf opens toward +x and the east leaf toward −x, so each
  ends up parallel to the rear wall and about 0.4 m in front of it, with about 1.5 m of the court
  still clear between them. Swinging into the building instead would have crossed interior fit-out
  that was not laid out for a door swing. The old concern recorded in the code, a swing path cutting
  through the facade, does not arise, because the leaf never leaves the recess.

With a leaf open, the doorway's clear width is about 0.84 m against the player's 0.6 m. The open
leaves are solid to navigation, so the player walks around them rather than through the glass.

#### Northeast planter walk — IMG_4005/4057 and the render crop, September 10, 2026

The user supplied two site photographs, `IMG_4005.HEIC` and `IMG_4057.heic`, saved as
`public/photos/site-4005.jpg` and `site-4057.jpg` and cited by `L6-bbq-east`. They also supplied a
crop of the render with the east-terrace tree block outlined.

- **IMG_4005** is a ground-level shot. A paved walk of alternating pale and charcoal bands runs
  between two raised concrete planters, with trees on both sides.
- **IMG_4057** is an overhead of the east BBQ terrace. The grill backs sit against a planted strip,
  with the banded walk beyond it.
- **The render crop** shows two tree columns with a path between them.

The model had a single 35-unit bed there, `rect(1143,287,35,210)`, with no walk. Following the
user's instruction, and replacing it:

- **East bed:** the old bed keeps only its east half, `rect(1160.5,287,17.5,210)`.
- **West bed:** `rect(1127.3,287,15.7,210)`. Its west wall touches the pergola posts' east face
  without overlapping it: the posts sit at x=1126 and are 0.16 m wide, so their face is at 1127.23.
  The grill counters are turned −90° and their backs sit at 1126.4, so they are also clear.
- **Walk:** x 1143–1160.5, 1.14 m wide, paved with pale `mats.tilefloor` and banded every 9 units
  in `paveGrey`, following IMG_4005. It runs the full length of both beds, z 287–497.
- **Trees:** each bed gets one tree column on `planter()`'s existing 26-unit grid. That matches
  the two columns in the render.

The `L6-bbq-east` description now mentions the walk. Navigation's `BLOCKED` rectangle is split to
match the two beds.

Navigation, separately: `tree()` canopies hang from about 0.75 m, reaching 0.86–1.35 m out from the
trunk, which is well below the 1.76 m cutoff. They closed the 1.14 m walk entirely. Leaf materials
now carry `userData.collision = false`, which `NavigationWorld` honours on the material because
merging drops mesh userData. Foliage is therefore brushed through everywhere on Level 6, while
trunks and planter walls stay solid. The walk-route audit confirms nothing that should stay shut
opened as a result.

#### Northeast planter walk widened — user correction IMG_4058, September 10, 2026

`IMG_4058.HEIC` is a phone photograph of the first-person view on screen, so it is not added to
`public/photos`. Looking south down the new walk, the user marked the east bed with an arrow toward
the open deck edge: move it back there so the walk can be wider. This supersedes the "east bed keeps
the old bed's east half" choice in the entry above.

- **East bed:** still 17.5 units wide, now `[[1175.5,287],[1193,287],[1193,471],[1175.5,492]]`. Its
  east wall sits on the east slab's edge at x=1193, where nothing else stands; no railing is
  recorded on that run.
- **South end:** it follows the northwest edge of `rearBed`, the raised bed behind the play
  circles, whose diagonal runs (1168,501)–(1193,471). The bed touches that edge without overlapping
  it. The earlier rectangle, and the original 35-unit bed before it, both ran to z=497 and so
  already clipped `rearBed`'s corner slightly.
- **Walk:** now x 1143–1175.5, 32.5 units or 2.11 m wide, up from 1.14 m. The paving and its
  charcoal bands are widened to match.
- **West bed:** unchanged, still touching the pergola posts.

Navigation's `BLOCKED` entry for the east bed takes the same clipped polygon.

#### West bed ends at the pergola — user correction, September 10, 2026

On a top-down view, the user marked the pergola's south corner post: the west bed should end there
rather than run past the pergola. The bed is now `rect(1127.3,287,15.7,196.2)`, ending at z=483.2.
That is the outer face of the corner post: the south bay is centred at z=453 and is 58 units deep,
so the post sits at z=482, and half of its 0.16 m width adds 1.23 units. The last tree, at z=479,
still falls inside the bed. The freed corner, x 1127.3–1143 by z 483.2–497, is plain terrace
paving. The walk and the east bed are unchanged. Navigation's `BLOCKED` rectangle is shortened to
match.

#### Rear bed and play lawn cut to the planter line — user correction, September 10, 2026

On a top-down view (north to the right), the user drew a north–south line across the play lawn
and the raised bed behind the play circles (`rearBed`), and asked for both to be cut back to it.
Its position was read against the scene: it falls at trace x≈1175.5, which is the west face of the
east planter's wall carried south. Both west ends now stop on that line.

- **`rearBed`:** its west edge moves from x=1168 to 1175.5. The new corners are where the line
  meets the bed's existing edges. The north corner is (1175.5, 492), on the northwest diagonal
  (1168,501)–(1193,471), and it is also the east planter's southwest corner, so the two still touch
  without overlapping. The south corner is (1175.5, 554.9), on the old edge (1190,574)–(1168,545).
  The rest of the outline, including both play-circle arcs, is unchanged.
- **Play lawn:** its west edge moves from x=1170 to 1175.5. The corners are (1175.5, 510.5) on its
  north edge (1170,512)–(1240,493), and (1175.5, 644) on its southwest edge (1170,638)–(1298,778).
  The southeast edge `[1298,778]-[1504,554]`, which the playground-side bed follows, is unchanged.

The strip west of the line, about 0.36–0.49 m wide, is now plain terrace paving.

#### Playground monkey bars and stepping disc — user correction, September 10, 2026

The user's screenshot showed two defects in `src/playground.js`. Both are rendering errors, not
new evidence about the equipment.

- **Monkey bars.** There was one curved rail, and its six rungs were laid on a separate straight
  line (z = 0.05 + 0.4t) that did not follow that curve, so their far ends hung in the air. Now two
  rails follow the original curve through (−1, 1.85, 0) … (−3.1, 1.8, 0.62), 0.46 m apart, with the
  offset taken along the curve so they stay parallel. Eight rungs span between the rails at about
  0.33 m spacing. The first passes through the platform post at (−1, 0), and the last sits between
  two new end posts, one under each rail, which replace the single end post.
- **Stepping discs.** The disc at (0.1, 1.8), 0.29 m up, had no support and floated. It now stands
  on a short post. The end disc at (−3.1, 0.62) widens from 0.23 m to 0.3 m radius, so both end
  posts pass through it.

The curve, the rail height and the disc positions are unchanged, so the frame's footprint and its
relationship to the slides are as before.

#### Playground platform, slides, arch and stairs aligned — user correction, September 10, 2026

The user's screenshots showed the slides, the blue arch and the stairs out of line with the
platform. The cause was the platform itself. The six posts stand at 0°, 60°, … on a 1 m circle,
but the hexagonal plate, a three.js 6-sided cylinder, has its corners at 30°, 90°, …. So the posts
stood mid-side, and the equipment had been placed against neither:

- The S-slide started at (0.53, 0.78), on the post at (0.5, 0.866), and the blue arch had that post
  running up through it.
- The two-lane slide straddled the post at (−0.5, 0.866), with one lane over a guarded edge. Its
  lanes were offset only in x, so they overlapped where the slide turns.
- The stairs were centred at x=−0.3 in a gap centred at 0, and one handrail ran outside the post.
- The climbing cage straddled the corner post at (1, 0), across two edges.

The plate is now turned 30° so its corners sit on the posts, and each piece takes one whole edge.
Edge k runs from post k to post k+1 and faces 60k+30°; `frame()` in `playground.js` places parts
relative to an edge.

| Edge | Faces | Holds |
|---|---|---|
| 0 | 30° | S-slide, narrowed from 0.83 to 0.76 m to fit between the posts, with the blue hoop over it |
| 1 | 90° | Two-lane slide, 2 × 0.38 m (was 2 × 0.44), lanes offset along the curve |
| 2, 3 | 150°, 210° | Guards, either side of the monkey-bar post |
| 4 | 270° | Stairs, centred, with handrails at ±0.4 on the tread edges |
| 5 | 330° | Climbing cage, narrowed to four uprights across ±0.39 |

- **Clearances.** Every slide leaves square to its edge, and its rims (outer face ±0.425 m) clear
  the posts' inner faces (±0.435 m). The top stair tread now meets the plate edge instead of
  running 5 cm under it.
- **Blue hoop.** No longer a free-standing arch with legs on the deck. It springs from edge 0's
  two posts at 2.25 m and peaks at 2.77 m, above the slide's rims.
- **Stepping disc.** The disc beside the slides moves from (0.1, 1.8) to (0.3, 1.85), so it stays
  clear of both slides. This supersedes the "disc positions are unchanged" note in the monkey-bar
  entry above.
- **Unchanged.** The monkey bars, the pods, the sign and the frame's overall placement.

These are layout corrections, not new evidence. The relative arrangement is kept as the user's
screenshots showed it: two-lane slide at the front, S-slide with arch front-right, cage behind it,
stairs at the rear, monkey bars to the left.

#### Stair handrails attached and monkey bars moved to an opening — user correction, September 10, 2026

The user's follow-up screenshot showed two remaining defects.

- **Stair handrails.** They ended in the air at (±0.4, 2.3, −0.98), about 15 cm short of the
  stair edge's posts at (±0.5, −0.866), and started behind and below their newel posts. Each now
  starts on top of its newel post (0.85 m at z=−2.41) and runs up at x=±0.45, just outside the
  tread edge and parallel to the stairs. It ends inside the platform post on its side (ring 4 or
  5) at 2.45 m.
- **Monkey bars.** They still started at the corner post (−1, 0), between the two guarded edges,
  so they led off a fence rather than an opening. They now leave square out of edge 2 (facing
  150°, the edge nearest the direction they already ran), and edge 2's guard is removed, leaving
  only edge 3 guarded. A mounting bar at rail height between edge 2's posts carries the rails'
  deck ends, in place of the old first rung through the corner post. Seven rungs follow. The
  far end, its two posts and the stepping disc are unchanged at (−3.1, 0.62). The rails curve
  through (−2, 0.8), keeping them about 0.8 m clear of the two-lane slide.

The rail height (1.85 m) and the rest of the frame are unchanged.

### Playground-side planter follows the circles — 2026-09-10

The user's 23:02 annotated model screenshot marks the grass gap between the diagonal
planter and the play circles for planting; the 23:07 reference shows the wall following
the play pads. This supersedes the earlier straight inner edge/turf-apron interpretation
in that marked area. The existing bed is expanded to the exposed southeast arcs of the
blue and tan coping circles, meeting at their actual intersection. The boardwalk edge,
square southwest return, play pads, and rear planter remain in place. Matching planting
fills the expanded bed without spilling onto the play surfaces. Its footprint is also
excluded from first-person walking.

The user's 23:10/23:11 follow-up clarifies that the playground-side planting is
one continuous planter. The front, rear, connecting wedge, and northeast tip now
share a single footprint and exterior rim, with no internal dividing walls.
The separate beds across the boardwalk are unchanged.

### Change-room interior correction — 2026-09-10, 23:14/23:15 reference

The latest user-supplied overhead takes precedence over the earlier interior
interpretation. Five west changing bays replace the previous six overly deep
bays. The north stalls have separate open leaves rather than a solid wall across
their entrances. The four central shower entrances and seats face north, with
wet fittings on the south back wall. The steam-room seating includes the inner
L-shaped bench and the east bench. The southwest storage room follows the
reference's L-shaped wall and has a solid framed door on its east return at the
marked location; this is distinct from the existing frosted exterior door.
The interior storage leaf opens into the room for first-person walking. The
photographed pool-facing exterior is preserved. These remain proportional
readings of the render, not surveyed dimensions.

### Deeper change-room entry — 2026-09-10, 23:21 reference

The court rear moves from trace z=590 to z=560, retaining the pool-facing
facade alignment. Two independent west doors now lead directly to southwest
storage (near the pool) and the main changing aisle (farther inside). The
redundant second storage doorway is removed. The east door serves the steam
room, whose perimeter L-bench leaves a clear approach. Cubicle leaves sit open
along their partitions; shower benches and the lower wet-area aisle are sized
to admit the first-person collision capsule. `scripts/verify-change-room.cjs`
checks connected routes from the pool approach to 25 interior destinations.
This is a navigable interpretation of the supplied image, not a code-compliance
or surveyed architectural assessment.

The 23:33 follow-up moves the court rear to trace z=553, joining the wet-block
back wall directly and removing the narrow gap. Side-door positions stay fixed.

### East pergola booking bays — September 11, 2026

Club Gilmore's PerfectMind facility pages identify the three east-pergola bays
as P01, P02 and P03 BBQ & Table. Each lists BBQ, table and chairs, a shade
gazebo, a maximum of eight people, and a 170-minute Bookable Outdoor Seating
duration. The note says children do not count toward the eight-person maximum.
The former combined `L6-bbq-east` selection is split into `L6-bbq-1`,
`L6-bbq-2`, and `L6-bbq-3`, aligned north-to-south with the three modeled
pergola tables and connected to their supplied booking URLs. Facility JPEGs are
stored as each gallery's photographic references; the supplied Level 6 PNG is
kept as the final map image in each gallery.

User screenshot correction, 23:34: the plan shows the two inner court doors
directly opposite each other. The east steam-room door moves from trace z=600 to
z=573, facing the main west entry; the steam room's south partition now closes
back to the court wall at x=406. The west storage door at z=600 is unchanged.

User screenshot correction, 23:36: every stall gets a door and no fixture
floats mid-room. The five west change cubicles gain open inward leaves along
their north partitions; their benches turn to run along the west wall with the
coat hooks mounted above them. The accessible room's fold seat and one grab
rail move to its west wall, a second rail to its north wall, and the WC (now
backing onto the east partition), its rail and the counter onto walls. North WC
bowls move back against the north wall, and each shower bench runs along its
stall's west partition. Positions remain proportional readings, not surveyed.

User screenshot correction, 23:38: the steam room runs south to the pool
facade. The inner south partition at trace z=601 is removed and the steam
room's east wall and floor extend to the facade at z=608.5.

User screenshot correction, 23:41: a grey storage wall at trace z=553 runs from
the steam room's east wall (x=439) to the east perimeter, closing the southeast
room behind the frosted exterior storage door.

User screenshot correction, 23:42: the steam room's east wall now starts at the
north partition (closing a gap at the corner) and takes the capped partition
finish. The L-bench's east run extends to the facade, and its north run butts
that east run instead of overlapping it.

User screenshot correction, 23:44: the accessible washroom gets a door. Its
wide south opening closes to a 1 m doorway at trace x=301–316, the only part
not blocked by the first change cubicle's north partition. The hinged leaf is
closed in the orbit view and swings north into the room in first person, the
same `openYaw` mechanism as the court doors.

User screenshot correction, 23:45: the two-head bay reads as open standing
showers. Its east partition (x=362) now runs from the shower-block back wall
(z=515) to z=552 and carries both heads, which face west. The west partition is
removed, so the bay opens onto the main aisle, and the wet floor extends north to
z=516. South WCs are now reached from the east vanity side of their aisle.

User request, September 11, 2026: a closed door with a "To Tower 2" sign sits on
the inner face of the northeast step wall (trace z=452, centred x=445). It is a
flush timber leaf in a dark frame and never opens, because Tower 2 lies outside
the model. The sign is real text, an exception to the facade's otherwise
geometric signage. Position is inferred from the user's screenshot, not a drawing.

User request, September 11, 2026: in first person the walker must not see over
the change-room partitions (1.4–1.75 m against a 1.68 m eye height). Every
interior and storage partition now has a matching extension to the 3 m shell
height in `walkModeWalls`, visible only in first person. The orbit and plan
cutaway keep the low partitions, and the GLB export (visible meshes only)
omits the extensions. Footprints and collision are unchanged.

User request, September 11, 2026: a more detailed east vanity. The dark block
becomes a wall-hung timber cabinet with a quartz counter and backsplash, inset
oval bowls with drains and gooseneck mixers. The earlier mirrors sat at x=462,
inside the 4-unit east wall, and never rendered. Each basin now gets a framed
mirror on the wall face (x=461), soap dispensers sit between mirrors, and a
stainless hand dryer is mounted on the east wall at z=541. The vanity footprint
is unchanged; fixture forms are representative, not from a photo.

User request, September 11, 2026: in first person the stall door leaves match
the 3 m walls. Every fixed open leaf (north and south WCs, change cubicles,
shower glass) gets a same-rotation extension in `walkModeWalls`. The hinged
accessible-washroom door gets a second hinged `walkOnly` gate that swings with
it and is shown only while walking. The orbit view keeps the low leaves.

User screenshot correction, 00:15: the southeast storage wall overlapped the
steam room's east wall by half a unit, and the perimeter wall by one unit. The
coplanar faces flickered. It now spans exactly x=440.5–461.

User screenshot correction, 00:16: the four white tile pads on the north
playhouse terrace (`rect(x,109,22,22)` at x=665–800) are removed. They sat at
the lawn's height and overlapped it, which made them flicker.

User screenshot correction, 00:17, superseding the earlier "cut twice for
cross-access" correction: the parapet-side raised bed along the southeast
diagonal is one continuous planter, `band(.012,.86,10,31)`, with no gaps
between t=.36/.375 and t=.70/.715.

User screenshot correction, 00:17: the playground planter cut straight from
[1728,371] to [1706,444], leaving the slab triangle [1706,444]–[1728,425]–
[1728,371] bare and pale in the north notch. The planter now follows the slab
edge through [1728,425], so planting fills the corner.

User screenshot correction, 00:22: the parapet bed and the playground planter
are merged into one bed. The playground planter outline now runs back along the
parapet strip (at(.86,31) → at(.012,31) → at(.012,10) → at(.86,10)), so the
dividing wall at t=.86 is gone and one rim wraps the whole bed. The strip is now
also in the planter's navigation blocked polygon.

User screenshot correction, 00:24: the parapet strip's southwest end ran only
to t=.012, leaving a bare gap before the angled terrace railing
[1037,868]–[1156,1028]. The end now follows that railing's angle, 1.9 trace
units inside it (a 0.5-unit post half-width plus the 0.09 m rim half-width), so
the rim touches the railing without overlapping it.

User screenshot correction, 00:26: the bed widens to the diagonal railing too.
Its railing edge moves from offset 10 to the same 1.9-unit inset. The tip
vertices [1779,460], [1795,439] and [1728,371] previously sat on the railing
itself, so the rim overlapped it. They are now inset 1.9 units inside both
railed edges; [1728,371] is inset only on its railed side, because its x=1728
edge has no railing. The former bare strip along the railing is now planted and
in the navigation blocked polygon.

User screenshot correction, 00:27: planter `rect(643,283,14,305)` is removed.
It lay entirely off the deck (x 643–657, z 283–588, west of `westSlab`'s x=660
edge, between `northSlab` and `sunDeck`). At 14 units wide it received no
planting, so it read as a floating bare soil strip.

User screenshot correction, 00:29: the Urban garden room's floor mesh (visible,
white, y=0.045) spilled past the slab into the stepped north notch. Its polygon
edge [1110,968]→[1728,392] crossed the notch. The edge now stops at z=444
(x≈1672.2) and follows the slab through [1706,444], [1728,425] and [1728,392].
The room id `L6-garden` is unchanged.

User request, 00:29: clear walking paths through the east deck lounge pairs.
Each pair's sofas move from ±1.6 m to ±1.25 m of the teak table, leaving 0.375 m
legroom. Both pairs shift 0.6 m toward each other (trace z 700→709.2 and
800→790.8). This clears about 0.95 m where each outer sofa stood and keeps
about 1.85 m clear between the pairs. The site-aerial layout of four sofas and
two tables is otherwise unchanged.

User request, 00:31: the two glass pool gates on the east fence (x=660) each
move one 24-unit fence panel inward, toward each other: from z=656 to 680 and
from z=848 to 824. The glass runs become 596–668, 692–812 and 836–901, and both
gates now open onto the timber walkway (z≥672). Walking collision follows the
scene geometry, so no navigation data changed.

User screenshot correction, 00:32, superseding the 00:29 pair positions: the
gap between the two lounge pairs' back-to-back sofas is halved, from about
1.85 m to about 0.93 m. The pair centres move to trace z=716.33 and 783.67
(67.3 units apart about z=750), which also widens the outer-end paths.

User screenshot requests, 00:33–00:34, for the pergola loungers on the north
edge (z=639):
- The x=470 lounger at the east pergola's west edge, hard against the
  change-room storage door, is removed.
- The west pergola (x 156–262) held only the x=250 lounger. Three more are
  added at x=190, 210 and 230, at the same 20-unit spacing.
- 00:38: the four west-pergola loungers shift 11 units west, to x=179, 199,
  219 and 239, so they centre under the cover (x=209). The east group (x=490 to
  550) already centres on its pergola (x=520).

Pool-deck cubby unit — user request with IMG_4030 (September 11, 2026). The
photograph shows a long black open-cubby unit against the north hedge and
parapet, with the canopy daybed to its west and the pergola loungers in front.
It has 2 rows × 17 square bays on a stainless base rail with low feet. It is
modelled at trace x 68–150 (about 5.3 m, bays about 0.31 m), 0.45 m deep with
its back at the parapet face (z≈599), and a carcass from 0.14 m to 0.89 m. Bay
count is read from the photo; overall length and height are proportional
estimates against the loungers, not measurements.

North toddler playhouse rebuilt — IMG_4038/4040 re-read (September 11, 2026).
The user re-supplied both photographs and asked for a closer, common-sense
match. This corrects two points of the September 9 reading above:
- **Chimney.** IMG_4038 clearly shows a small black stovepipe with an elbow and
  cap on the roof near the west gable, so it is restored. From the north (4040)
  it sits behind the ridge.
- **Orientation.** This was previously "not resolvable". In IMG_4040 the wood
  deck is in the foreground and the clad pavilion (east) is on the left, so that
  photo looks south, and IMG_4038 looks north. Cross-checking the two gives an
  east–west ridge.

The structure as now modelled:
- **North side:** the play counter fills the west half (teal panel with raised
  ends, a bench inside, and a navy oval table and two teal disc stools outside).
  A stepped timber board wall fills the east half.
- **Activity panel:** it continues the north line east on its own post. Its
  south face carries the steering wheels and dial icons (seen in 4038), its
  north face the airplane graphic (seen in 4040).
- **South side:** open, with the oval double-sided Welcome sign on the
  southeast post. Both gables carry a "KIDS ONLY" board.
- **Roof:** five planks per slope run along the ridge in alternating stains.

Sizes are proportional estimates (eave about 1.6 m, ridge about 2.3 m, frame
about 1.6 × 1.1 m), not measurements.

User screenshot request, September 11, 2026: the play-area turf ran short of the
walkway, leaving a tapering bare strip of 6–14 trace units between t=.324 and
the planter's start at t=.427. Its walk-side vertices are now at(.427,83) and
at(.324,83), on the walkway edge.

A second bare band lay between the turf's t=.324 cross edge and the
playground-side dining pergola, about 25 units wide. It was only the Fire pit
terrace room's pale floor mesh; there is no paving under the pergola. The turf's
west side now follows the pergola's turf-side post line at v=−25.3 (post faces at
v=−25.23), from the walk-end post line (u=72.23, on the walkway edge) to where
that line meets the turf's x=1175.5 west edge (u≈−88.2). The fire-terrace pad
lies entirely on the pergola side of that line.

User screenshot request, September 11, 2026: the light well's lower football
field ended at its north end (trace z=276) against open void. A 4.4 m dark wall
now spans z=276 between the two side walls (x=934 and x=1035), matching their
material and height. The south end keeps its existing low post row at z=850.

User screenshot correction from the reference render, September 11, 2026: the
hot tub is not a plain rectangle. A small bay steps out from the centre of its
north edge. Water now extends into a 22 × 6-unit bay (x 160.5–182.5, z 718–724)
with the same 4.5-unit coping around it (x 156–187, z 713.5–719.5), centred on
the tub (x≈171.5). The bay's coping footprint is added to the first-person
navigation's blocked water areas. Proportions are read off the render, not
measured.

User screenshot request, September 11, 2026: the two sunbeds directly in front of
the hot tub's north edge (x=170, across the new bay, and x=207, over the east
grab rail; z=698) are removed. The north-row beds at x=145 and 230 and the whole
south row (z=852) are unchanged.

Hot tub entry — user correction with IMG_4031 (September 11, 2026). The photograph,
taken from the north with the pool on its left, shows that the hot tub is entered
through its north bay:
- Submerged steps fill the bay.
- A stainless grab rail stands on the coping at each side of the bay, its top
  leaning in over the water.
- There are no steps or rail on the tub's east side.

The shared pool loop no longer gives the hot tub the east-end step strips and
rail frames; only the pool keeps those. The bay now holds two submerged steps
(tops just proud of the water plane so they read as a pale ledge). Grab rails
stand on the coping at x=158.25 and x=184.75, anchored at z 715 and 722. Rail
form is simplified to a single leaning frame per side.

User screenshot requests, September 11, 2026:
- The pool's own east-end step strips and grab-rail frames are removed too, so
  neither pool has east-end steps or rails any more.
- North-row sunbeds (z=698): the x=230 bed moves to x=249, continuing the pool
  row's 21-unit rhythm with its west side flush with the pool water edge
  (x≈242).
- A bed is added at x=198, mirroring the x=145 bed across the hot tub's centre
  (x=171.5).

Main pool rails and corner step — user's annotated plan with IMG_4028, IMG_4032
and a close photo of the north-edge rails (September 11, 2026). Each entry is a
ladder pair of curved stainless rails about 0.55 m apart. The rails rise from the
deck and slope down to the coping, and the depth markers sit beside them.
- **Northwest corner:** the rail pair stands on the west edge (z 728 and 736.5)
  over a two-tier submerged corner step (20 × 20 and 14 × 14 units). It is seen
  at the near end in IMG_4032.
- **North edge:** a pair mid-way along, centred on x=398, against the
  change-room facade (close photo).
- **South edge:** a pair at x≈527, just short of the southeast corner and not at
  it. It is seen in the foreground of IMG_4028, which looks west.

Each rail is simplified to one leaning frame. Its back leg is on the deck 0.55 m
from the water and its front leg on the coping at the water edge. Positions are
read from the annotated plan, not measured.

User screenshot request, September 11, 2026: the four sunbed pairs on the pool's
south side (z=852) are drawn closer together. The first pair stays centred at
x=286. The pairs are now evenly spaced 86.3 units apart (previously 95), and
each keeps its 16-unit bed spacing. The last bed's east side lines up with the
pool's east coping edge (x=558.5).

User screenshot request, September 11, 2026: the north terrace's timber walk
(between the playhouse turf and the hedge planter) ended short at its west end,
with a pale band along its top edge. It lay at y=0.01, below the North terrace
room's visible floor mesh (y=0.045). That floor covers the corner x 660–698 and
z 244–278 and a band along the turf, so it hid the timber. The walk now sits at
y=0.05 and runs flush to the slab edges (x=660, z=275) and the turf (z=238):
x 660–933, z 238–275.

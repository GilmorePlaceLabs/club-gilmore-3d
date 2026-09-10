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

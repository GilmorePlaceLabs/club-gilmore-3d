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

South lawn pergola — user's 4:27 PM correction supersedes the inferred BBQ placement. Removed both counters and replaced them with two round timber tables using the existing curved-seat furniture design. Updated the visible name to South garden & round tables, preserving its stable room ID. This correction follows the user's explicit identification and model screenshot; IMG_3991.HEIC was not decoded successfully by the available sandboxed FFmpeg, so no new photographic-detail claim is made from that file.

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

### Change-room block rebuilt — annotated plan and IMG_4028/4029/4034

The user supplied an annotated overhead of the change-room block naming each zone, plus three
photographs of its pool-facing elevation. Browser JPEG copies are `public/photos/site-4028.jpg`,
`site-4029.jpg` and `site-4034.jpg`; the HEIC originals are unchanged. Both supersede the earlier
generic cubicle-and-shower fit-out, which was invented from the low-resolution render.

Interior, from the annotation: timber change cubicles down the west wall, an accessible shower
and washroom in the north-west corner, a row of washroom stalls along the north wall, enclosed
individual showers through the middle, open standing showers below them, a three-basin vanity
against the east wall, and a steam room in the south-east corner. Zone positions are proportional
readings of the annotated overhead — the drawing carries no dimensions, so stall counts, partition
spacing and room sizes are interpretations, not measurements.

South elevation, from IMG_4029 and IMG_4034: dark grey stone panel cladding with a recessed entry,
three stainless outdoor shower columns west of it — each a slim wall panel with a rain-head arm,
a control box and a handheld hose — a life ring, a two-tier bottle filler and drinking fountain,
and a storage door with a frosted glass canopy and louvred vent above. IMG_4028 additionally
confirms the pool's dark mosaic coping band and its imperial/metric depth markers, which are not
modelled. Fixture sizes are proportional to the photographs.

The façade fixtures are attached to the block's wall group so they lower with the cutaway rather
than floating above the shortened walls.

### Change room renders at full height

At the user's request the change-room block is no longer lowered by the cutaway: its wall group
is kept out of `wallGroups`, so the shell and its south-elevation fixtures always render at the
full 3 m. It is Level 6's only enclosure, so the wall raise/lower control now has nothing to act
on there and is disabled while Level 6 is active.


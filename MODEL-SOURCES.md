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

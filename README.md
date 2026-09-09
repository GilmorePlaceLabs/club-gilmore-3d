# Club Gilmore — Level 4 interactive model

Standalone roofless 3D amenity explorer. Includes 45 browsable spaces, room selection from the model or list, category/search filters, photo references, plan/3D views, camera controls, adjustable cutaway walls and GLB export. A support-office zone is modeled but omitted from the public list.

## Open locally

From this directory:

```sh
npm install
npm run dev
```

Open http://127.0.0.1:4173/. Drag to orbit, right-drag to pan, scroll/pinch to zoom. Keyboard users can select from the room list and use the view buttons; arrow keys pan when the canvas is focused.

`Club-Gilmore-Level-4.glb` is the exported model, in metres, with textures and room identifiers. It was reopened using GLTFLoader and its main pool measured 20 m. The saved file uses the default lowered-wall view. The viewer's Download model button exports the currently displayed wall height. Open the GLB in a compatible 3D application to inspect or refine the geometry; the HTML room/photo interface is a separate web application.

## Model fidelity

Architectural L4 drawings provide the layout and grid calibration. The user's confirmed **20 m pool** overrides an older drawing label. Walls use the agreed uniform 3 m representation, displayed at 1.1 m for the default cutaway. Room boundaries are manually traced approximations, not a CAD/BIM conversion. Finishes and furnishings are representative interpretations of supplied photos. Some photo links show similar spaces; the interface calls them photo references. See MODEL-SOURCES.md for detailed evidence and assumptions.

## Files and future changes

- `src/rooms.js`: room identity, floor polygons, categories, photo references and future booking URL.
- `src/model.js`: procedural geometry, materials and furniture.
- `src/main.js`: camera, selection, browsing, photography and model export.
- `src/style.css`, `index.html`: responsive viewer interface.
- `public/photos`: resized derivatives of user-supplied photographs; originals remain untouched.
- `evidence`: browser screenshots and validation results.

To connect a room to the booking provider later, set its `bookingUrl` to the confirmed HTTPS room-specific destination. Null URLs show the explicit unconnected state. Do not infer provider resource IDs from architectural room IDs. Selection emits `club-gilmore:room-selected` on this window, with `{roomId, name, bookingUrl}`. This is a local event, not a cross-origin iframe bridge. The provider remains responsible for availability, authentication and reservations; none of those functions are implemented here.

## Build / deployment

```sh
npm run build
npm run preview
```

The `dist` directory is the static web build. Serve it over HTTP(S); opening index.html through file:// is unsupported. This custom WebGL surface is needed for genuine orbitable geometry, raycast room selection and GLB export. It can later be hosted and embedded alongside the native YCode site. No YCode layers or published site were changed, and embedding has not been tested. The source architectural PDFs are outside this app and are not copied into its production build.

## Validation

PASS for the reviewed desktop and mobile-emulated viewer scope, geometry sanity, 20 m pool, and GLB export/reimport. See QA.md. The inspection scripts use the workstation's bundled Playwright and Chrome paths; adapt those paths on another computer. The model has not been dimension-audited room by room, tested on physical phones, or connected to a booking account.

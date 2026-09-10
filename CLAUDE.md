# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm run dev      # vite dev server, fixed at http://127.0.0.1:4173 (strictPort)
npm run build    # static build to dist/
npm run preview  # serve dist/ on the same 127.0.0.1:4173
```

Verification (dev or preview server must already be running on 4173):

```sh
node scripts/inspect.cjs   # screenshots + perf stats -> evidence/
node scripts/verify.cjs    # full assert-based Playwright suite -> evidence/verification.json
```

There is no test framework. `scripts/verify.cjs` is the whole test suite: one `node:assert/strict` script covering geometry, selection, canvas raycast hit, filters, photos, GLB export and re-import, and mobile focus/touch targets. To run a subset, comment out lines or copy the relevant block into a scratch script — there is no per-test selector.

**Both scripts hardcode Windows paths** (`C:/Users/Qazim/.cache/...playwright`, `C:/Program Files/Google/Chrome/...`). On this macOS workstation they will fail until those two paths are edited to a local Playwright install and Chrome binary. `scripts/verify.cjs` also overwrites `Club-Gilmore-Level-4.glb` at the repo root with the freshly exported model.

## Architecture

A single-page Vite + Three.js app, no framework. Three source files, deliberately dense (~550 lines total), plus a hand-written `index.html` that owns the entire DOM — `main.js` never creates panels, only fills the existing elements by id.

**`src/rooms.js` — the data of record.** All 46 room zones as polygons in *trace units*: pixel coordinates read off the rendered 1824 px-wide architectural plan. `METRES_PER_TRACE_UNIT = 8.8392 / 138` (a 29 ft grid bay = 138 px) converts them. Each room is `{id, name, category, polygon, kind, photos, bookingUrl}`; `kind` is a furnishing/material archetype, not a category. Also holds `slabOutline`, `cores`, `majorLabels` (which rooms get floating 2D labels), and `categories`.

**`src/model.js` — procedural geometry.** `createClubModel()` walks `rooms` and builds, per room: a floor mesh (`userData.roomId` — this is what raycasting hits), a cutaway wall group, and a `furnish()` prop group. `toWorld()` recenters trace coords at (900, 1030) and scales to metres. Everything is generated in code — textures come from `canvasTexture()` 2D-canvas draws over a seeded `rng()`, furniture from `box`/`cyl`/`rod` primitive helpers. `mergeRoomGeometry()` merges each group's meshes per-material after construction to keep draw calls low; it skips transparent materials and anything tagged `userData.lengthMetres` (that tag is how the pool water mesh survives merging so the round-trip test can measure it). Returns `{root, roomGroups, floorMeshes, wallGroups, columnGroups, bounds, mats}` — `main.js` drives everything through that handle.

**`src/main.js` — viewer.** Orthographic camera + OrbitControls, **render-on-demand** (`requestRender()` sets a flag; there is no continuous rAF loop). Anything that changes the scene must call `requestRender()` or the frame never updates. Camera moves go through `frameBounds()`, which projects corner points onto the camera basis to compute a fitting zoom, then either snaps (instant / `prefers-reduced-motion`) or drives a manual `tween` object stepped inside `render()`. `updateViewOffset()` offsets the camera frustum so the model centres in the space *not* covered by the browser/detail panels — its return value feeds the zoom fit, so panel widths appear both in CSS and in that function and must stay in sync.

The cutaway is a scale trick: walls are modelled at the full 3 m `WALL_HEIGHT` and `wallGroups`/`columnGroups` get `scale.y = 1.1 / WALL_HEIGHT` for the default lowered view.

`window.clubGilmore` is the read-only test surface the Playwright scripts drive; `window.clubGilmore.ready` is their load gate. Keep it in place.

## Conventions and constraints

- **Documentation is part of the deliverable.** `MODEL-SOURCES.md` records every geometry assumption and its drawing-page evidence, `DESIGN.md` is the frozen design system (its front-matter tokens mirror `.impeccable/design.json`), `QA.md` is the validation record and `SURFACE.md` the direction contract. Geometry changes belong in MODEL-SOURCES.md, visual changes must stay inside DESIGN.md's palette/type/spacing, and a re-verified run updates QA.md.
- **User-confirmed measurements override traced geometry.** The 20 m pool beats the older drawing label; `POOL_LENGTH` and the pool assertions in `verify.cjs` both encode this.
- Brass `#d1b674` marks selection, orientation, measurement and the booking path only — never decoration or large surfaces.
- 44 px minimum touch targets at ≤760px, and mobile shows the room browser *or* the detail sheet, never both. Both were regressions caught in QA once already.
- Booking is intentionally unwired. Set a room's `bookingUrl` only to a confirmed `https://` destination; never derive one from an architectural room ID. Selection emits the `club-gilmore:room-selected` window event as the integration seam.
- Support-category rooms are modelled but filtered out of the public list in `renderList()`.
- Style is terse: single-letter locals, chained statements, `$(id)` for `getElementById`. Match it rather than expanding it.

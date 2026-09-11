# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm run dev      # vite dev server, fixed at http://127.0.0.1:4173 (strictPort)
npm run build    # static build to dist/
npm run preview  # serve dist/ on the same 127.0.0.1:4173
```

Verification (a dev or preview server must already be running on 4173):

```sh
node scripts/verify-level6.cjs   # Level 6 + floor switching -> evidence/level6-*.png, level6-verification.json
node scripts/verify.cjs          # Level 4 suite -> evidence/verification.json
node scripts/inspect.cjs         # Level 4 screenshots + perf stats -> evidence/
```

There is no test framework. Each script is one `node:assert/strict` file; to run a subset, comment out lines or copy the block into a scratch script.

- `verify-level6.cjs` works on this machine as-is and takes `PLAYWRIGHT_PATH` / `CHROME_PATH` env overrides.
- `verify.cjs` and `inspect.cjs` still **hardcode Windows paths** (`C:/Users/Qazim/...playwright`, `C:/Program Files/Google/Chrome/...`) and will fail until edited — copy the env-override pattern from `verify-level6.cjs`. `verify.cjs` also overwrites the root `Club-Gilmore-Level-4.glb` with a freshly exported model.

## Architecture

Single-page Vite + Three.js, no framework. `index.html` owns the entire DOM; `main.js` never creates panels, it only fills existing elements by id. Two floors share one viewer.

### Level 4 — `src/rooms.js` + `src/model.js`

`rooms.js` is the data of record: 46 zones as polygons in *trace units*, pixel coordinates read off the rendered 1824 px-wide architectural plan, converted by `METRES_PER_TRACE_UNIT = 8.8392 / 138` (a 29 ft grid bay = 138 px). Rooms are `{id, name, category, polygon, kind, photos, bookingUrl}`; `kind` is a furnishing/material archetype, not a category.

`model.js` `createClubModel()` walks those rooms building, per room: a floor mesh carrying `userData.roomId` (the raycast target), a cutaway wall group, and a `furnish()` prop group. Textures come from `canvasTexture()` 2D-canvas draws over a seeded `rng()`; furniture from `box`/`cyl`/`rod` primitives. **The bottom of `model.js` re-exports those primitives plus `mats`, `mergeRoomGeometry` and the furniture helpers for `level6.js` — it is the shared primitive library, not just the L4 builder.**

### Level 6 — `src/level6.js` + `src/playground.js`

A separate outdoor deck model with its own coordinate space: trace coords normalized to the supplied 1855 × 1344 overhead render, `U = 0.065` m per unit. **No measured L6 drawing exists** — scale, heights and dimensions are approximate, which is why `updateLevelUI()` hides the metre scale bar on L6. The L4 20 m pool confirmation does not transfer.

`level6Rooms` entries differ from L4's shape: `kind` is just the id, `category` defaults to `Outdoor`, and each carries an inline `description` string (L4 looks its description up from the `descriptions` map in `main.js` by `kind`). Photos here are full filenames with extensions; L4 photos are bare numbers that `updatePhoto()` suffixes with `.webp`. `playground.js` is split out only because the play equipment geometry is large.

### `src/main.js` — the viewer

Orthographic camera + OrbitControls, **render-on-demand**: `requestRender()` sets a flag, there is no continuous rAF loop. Anything that changes the scene must call it or the frame never updates.

Level state is module-level: `activeLevel`, a reassigned `rooms` binding, and a `models` Map that caches each built floor so switching back is instant. `switchLevel()` swaps `model.root` in the scene, moves the named `'Viewer ground'` plane (−0.43 for L4, −5 for L6), resets search/category, and calls `rebuildLabels()` + `renderList()` + `updateLevelUI()` + `home(true)`. Initial floor defaults to Level 6; `?level=4` or an `#L4-…` room hash opens Level 4, and `?level=` always wins.

Camera moves go through `frameBounds()`, which projects corner points onto the camera basis to compute a fitting zoom, then either snaps (instant / `prefers-reduced-motion`) or drives a manual `tween` object stepped inside `render()`. `updateViewOffset()` offsets the camera frustum so the model centres in the space *not* covered by the browser/detail panels; its return value feeds the zoom fit, so panel widths appear both in CSS and in that function and must stay in sync.

The L4 cutaway is a scale trick: walls are modelled at the full 3 m `WALL_HEIGHT` and `wallGroups`/`columnGroups` get `scale.y = 1.1 / WALL_HEIGHT`.

`window.clubGilmore` is the read-only surface the Playwright scripts drive — `ready` is their load gate, and `model`/`rooms`/`activeLevel` are **getters** because level switching reassigns them. Keep it that way.

## Conventions and constraints

- **Documentation is part of the deliverable.** `MODEL-SOURCES.md` records every geometry assumption with its evidence, `DESIGN.md` is the frozen design system (front-matter tokens mirror `.impeccable/design.json`), `QA.md` is the validation record, `SURFACE.md` the direction contract. Geometry changes go in MODEL-SOURCES.md, visual changes stay inside DESIGN.md's palette/type/spacing, a re-verified run updates QA.md.
- **Evidence hierarchy, most authoritative first:** an explicit user confirmation or annotation → actual site photographs (`public/photos/site-39xx.jpg`, from the user's IMG_39xx originals) → the supplied marketing render → inference. Later corrections supersede earlier ones and MODEL-SOURCES.md records the chain — the L4 20 m pool overriding a drawing label, and the L6 aerial photos overriding the render, are both worked examples. When adding a correction, append to that log rather than rewriting history.
- Never claim a visual PASS a browser run did not produce. QA.md deliberately marks edits as "pending validation" where a render was never captured.
- Brass `#d1b674` marks selection, orientation, measurement and the booking path only — never decoration or large surfaces.
- 44 px minimum touch targets at ≤760px, and mobile shows the room browser *or* the detail sheet, never both. Both were regressions caught in QA once already.
- Booking is intentionally unwired. Set a room's `bookingUrl` only to a confirmed `https://` destination; never derive one from an architectural room ID. Selection emits the `club-gilmore:room-selected` window event as the integration seam.
- Room IDs are stable public identifiers — rename a room's `name` freely, but keep its id (`L6-bbq-central` still holds the relabelled fireplace lounges).
- Support-category rooms are modelled but filtered out of the public list in `renderList()`.
- Style is terse: single-letter locals, chained statements, `$(id)` for `getElementById`. Match it rather than expanding it.

# Astra-Orchestrated Level 6 First-Person Walkthrough

## Summary

Use GPT-6 Astra as the root implementation agent. Astra will own architecture, integration, review, and final acceptance while delegating isolated implementation work to cheaper models with narrow context and exclusive file ownership.

Add a Level 6 first-person mode through a **Go into first person** button immediately left of **About the model**. Desktop will use Three.js `PointerLockControls`; custom classes will handle movement, collision, mobile controls, and the procedural body.

The player will spawn on the marked east circulation path at approximately trace coordinate `[1145, 675]` / world coordinate `[15.3, 0.3]`, facing toward the fire-pit and playground terraces.

## Implementation Orchestration

- Run the root task with `gpt-6-astra` at high reasoning.
- Astra first defines the shared navigation interfaces and assigns non-overlapping file ownership.
- Spawn up to three workers concurrently using bounded prompts without forwarding the full conversation:
  - `gpt-5.6-terra`: implement `NavigationWorld` and Level 6 navigation geometry, including walkable polygons, hazards, capsule collision, sliding, and safe-position recovery.
  - `gpt-5.6-terra`: implement `FirstPersonController` and `FirstPersonInput`, covering perspective-camera lifecycle, keyboard input, pointer lock, mouse fallback, and mobile joysticks.
  - `gpt-5.6-luna`: implement `FirstPersonAvatar` and initially inspect the responsive HUD requirements.
- Astra owns changes to the existing integration surfaces—`main.js`, `level6.js`, `index.html`, and shared CSS—to avoid concurrent merge conflicts.
- Workers edit only their assigned new modules and report assumptions, exported interfaces, and checks performed.
- Astra reviews every worker change, resolves integration issues, and remains responsible for correctness rather than accepting worker output automatically.
- After integration, reuse an idle Luna worker for focused regression-test updates and a Terra worker for collision/code review.
- Astra runs final browser verification, visual inspection, and build checks itself.
- If an agent stalls, exceeds its bounded task, or produces incompatible code, Astra reclaims that work instead of repeatedly delegating it.
- Do not create separate user-visible Codex tasks; use implementation subagents attached to this task.

## First-Person Architecture

- Add organized classes:
  - `FirstPersonController`: entry, exit, perspective camera, movement loop, pause/resume, and orbit-state restoration.
  - `NavigationWorld`: walkability, hazards, static collision, collision sliding, and recovery.
  - `FirstPersonInput`: WASD/arrows, desktop mouse look, pointer-lock fallback, and twin-stick touch input.
  - `FirstPersonAvatar`: procedural pants, shoes, forearms, hands, and walking animation.
- Add reusable model capability metadata:

  ```js
  navigation: {
    spawn: {
      tracePosition: [1145, 675],
      facingTarget: 'L6-fire'
    },
    floorHeight: 0.08,
    eyeHeight: 1.68,
    playerRadius: 0.30,
    walkSpeed: 2.2,
    walkablePolygons: [...],
    blockedPolygons: [...]
  }
  ```

- Enable the button whenever a model exposes `navigation`; Level 4 will not expose it during this stage.
- Preserve the orthographic camera position, target, zoom, selected room, and panel state, restoring them exactly after exit.
- Use a perspective camera with an approximately 68° field of view.
- Keep movement horizontal with no jumping, swimming, stairs, or elevators.
- Normalize diagonal movement and constrain vertical mouse look.
- Clear held inputs on pause, blur, tab hiding, pointer-lock loss, and orientation changes.

## Collision and Safety

- Build a Three.js octree from tagged solid scene geometry while excluding labels, outlines, water planes, and visual-only decoration.
- Collide with buildings, walls, railings, planters, furniture, play equipment, and major props.
- Author walkable polygons for connected Level 6 slabs, paths, lawns, and terraces.
- Exclude pools, hot tub, light wells, planted beds, and inaccessible surfaces.
- Inset exposed boundaries by the player radius.
- Slide along obstacles instead of stopping all movement.
- Validate every movement result against the navigation geometry.
- Retain a last-safe position and immediately restore it if movement enters a hazard, leaves the deck, or produces an unsupported position.
- Keep collision helpers and the avatar outside `model.root` so downloaded GLB files remain unchanged.

## Avatar and Controls

- Render a neutral low-poly first-person body matching the existing architectural style.
- Show pants and shoes when looking down and hands near the lower view edges.
- Add restrained limb motion and camera bob while walking; disable bob and minimize animation under reduced-motion preferences.
- Desktop entry requests pointer lock from the button gesture.
- Escape unlocks and pauses, presenting **Resume** and **Exit first person** actions.
- If pointer lock fails, retain keyboard movement with click-drag mouse look.
- Hide room panels, labels, compass, selection behavior, and orbit controls during first person.
- Show a subtle crosshair and concise control hint.

## Mobile Experience

- Detect touch/coarse-pointer capability instead of relying only on viewport width.
- Walk in both portrait and landscape (revised: the earlier portrait "Rotate your device to walk" block was removed at the user's request).
- Do not force orientation through browser APIs.
- In either orientation, display two vertical joysticks:
  - Left: forward, backward, and strafing movement.
  - Right: yaw and pitch look.
- Support simultaneous pointers, pointer capture, dead zones, clamped travel, safe-area insets, and automatic recentering.
- Clear joystick state when orientation changes or the page loses focus.
- Use a compact walking icon in constrained headers while retaining the full accessible **Go into first person** label.

## Interfaces and Regression Safety

- Change `window.clubGilmore.camera` and `controls` to getters because active objects change between modes.
- Add read-only `viewMode` and first-person controller state plus explicit QA entry/exit hooks.
- Preserve Level 4/Level 6 switching, room selection, deep links, responsive panels, and GLB export.
- Exiting first person before a level switch is mandatory.
- Do not add multiplayer, persistence, networking, analytics, or URL-based first-person state.

## Test Plan

- Verify button visibility, header order, accessible naming, and Level 4 exclusion.
- Verify the exact spawn, facing direction, perspective camera, and orbit-state restoration.
- Exercise WASD, arrows, mouse look, diagonal normalization, pause, and input clearing.
- Test collisions against furniture, the stair enclosure, planters, railings, pools, light wells, and every exposed deck edge.
- Confirm repeated movement into an edge never changes the player to an unsafe or lower-level position.
- Verify visible hands, pants, and shoes without clipping.
- Test pointer-lock rejection and drag-look fallback.
- Capture desktop spawn, look-down avatar, mobile landscape, and portrait-prompt screenshots.
- Test simultaneous mobile movement and look, safe-area layout, orientation changes, and document overflow.
- Confirm the avatar and collision helpers are absent from exported GLBs.
- Run existing Level 4 and Level 6 regression scripts and `npm run build`.
- Astra reviews all worker results and performs final visual QA before declaring completion.

## Assumptions

- Switch the current task to `gpt-6-astra` before implementation to satisfy the requested orchestration model.
- Terra and Luna workers receive narrowly scoped prompts and inspect only the files needed for their assignments.
- The marked spawn is `[1145, 675]` in Level 6 trace coordinates.
- All Level 6 walking remains on the main outdoor deck elevation.
- Each client has an independent local player instance.
- The currently passing production build is the regression baseline.

## References

- [Three.js PointerLockControls](https://threejs.org/docs/pages/PointerLockControls.html)
- [OpenAI GPT-6 Astra model guidance](https://developers.openai.com/api/docs/guides/latest-model)

---
name: Club Gilmore Model Viewer
description: A dark, precise architectural amenity explorer for Level 4.
colors:
  navy: "#141a24"
  viewport: "#18212b"
  panel: "#1c242e"
  line: "#36414c"
  muted: "#b1bbc4"
  gold: "#d1b674"
  text: "#e7eaef"
typography:
  display:
    fontFamily: "Archivo, sans-serif"
    fontSize: "26px"
    fontWeight: 500
    lineHeight: 1.18
    letterSpacing: "-0.025em"
  body:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: "12px"
    fontWeight: 400
rounded:
  compact: "2px"
  control: "3px"
  panel: "5px"
spacing:
  micro: "8px"
  compact: "12px"
  standard: "16px"
  panel: "24px"
  header: "32px"
components:
  view-toggle-active:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.viewport}"
    rounded: "{rounded.compact}"
    padding: "12px 14px"
    height: "44px"
  booking-link:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.navy}"
    rounded: "{rounded.control}"
    padding: "13px 15px"
  room-browser:
    backgroundColor: "{colors.navy}"
    rounded: "{rounded.control}"
    width: "282px"
---

# Design System: Club Gilmore Model Viewer

## Overview

**Creative North Star: "The Architectural Instrument"**

Club Gilmore's Level 4 explorer makes a furnished building model the dominant surface and keeps the interface quiet, technical, and immediately useful. It extends the community portal's midnight-navy and brass identity into a compact architectural control room: a whole-floor view, a precise room index, and a focused detail panel.

The experience is full-height and dark by default, with high-contrast light text and brass reserved for orientation, selection, and the booking path. Controls remain small and deliberate on desktop; on mobile, the room index becomes a bottom sheet and every interactive control meets a 44px target.

**Key Characteristics:**
- Full-screen 3D model with restrained overlay panels.
- Navy surfaces, thin slate structure, and sparing brass emphasis.
- Archivo for architectural headings; IBM Plex Sans for operational detail.
- Low-radius geometry and light ambient elevation.

## Colors

The palette is a dark architectural field with brass used as the single high-value interaction and orientation color.

### Primary
- **Gilmore Brass** (`#d1b674`): selected view state, selected room labels, compass, measurement detail, and the booking link.

### Neutral
- **Midnight Navy** (`#141a24`): header, panels, dialogs, and the principal application background.
- **Model Slate** (`#18212b`): full-bleed viewport background and active-toggle foreground.
- **Raised Slate** (`#1c242e`): available panel tone token for layered dark surfaces.
- **Structural Line** (`#36414c`): panel and field borders, dividers, and lightweight enclosure.
- **Operational Mist** (`#b1bbc4`): secondary copy, instructions, and quiet metadata.
- **Clear Text** (`#e7eaef`): primary copy and high-contrast interface labels.

**The Brass-Only-When-It-Means-Something Rule.** Keep brass for selected, navigational, measured, or primary-action states. It is not a general decoration color.

## Typography

**Display Font:** Archivo, with a sans-serif fallback.

**Body Font:** IBM Plex Sans, with a sans-serif fallback.

**Character:** Archivo gives the viewer its composed architectural voice; IBM Plex Sans keeps search, controls, amenity details, and status information compact and legible.

### Hierarchy
- **Display** (500, 26px desktop / 21px mobile, 1.18): the viewport heading and room-detail title use tight tracking (`-0.025em`).
- **Headline** (500, 28px desktop / 24px mobile, 1.2): dialog headings.
- **Title** (500, 17px, normal): brand wordmark and room-browser toggle.
- **Body** (400, 13px, 1.65): amenity descriptions and operational text.
- **Label** (400, 10–14px): controls, status text, metadata, and instructional copy; only compact metadata adds `0.06em` tracking.

## Layout

The viewport fills the available height below a 78px desktop header. The room browser is a 282px left overlay with a 24px outer offset; the detail panel is 330px at the right. The camera control group is bottom-centered relative to the usable model, while compass and scale live at the right edge.

At 761–1100px, overlay widths and offsets tighten. At 760px and below, the header becomes 62px, the room browser moves to a 12px-inset bottom sheet, and the detail panel occupies the lower half of the screen. When detail is open, the browser is hidden; when the browser is open, camera help and scale are hidden to prevent overlap.

Use the observed 8px, 12px, 16px, 24px, and 32px rhythm. Keep overlays anchored to the viewport rather than introducing a conventional page container.

## Elevation & Depth

Depth comes primarily from tonal contrast: navy panels sit over the model-slate viewport and thin slate borders define their edges. A restrained ambient shadow separates floating panels and controls (`0 14px 35px #0002` for the browser; `0 14px 35px #0003` for detail; `0 8px 25px #0003` for camera controls). The dialog alone uses the deeper `0 30px 80px #0006` shadow.

**The Quiet Overlay Rule.** Floating UI should read as a technical instrument over the model. Do not turn overlays into bright cards or use heavy decorative shadows.

## Shapes

The viewer uses near-square architectural geometry. Room rows and active view buttons use 2px corners; inputs, icon controls, panels, and action links use 3px corners; the camera group and mobile sheet can reach 5px. Borders are one-pixel slate lines. SVGs are outline drawings with 1.5px rounded strokes, reinforcing the architectural drawing language.

## Components

### Navigation

The top bar is a solid midnight-navy 78px strip with a one-pixel lower divider. The Archivo brand mark uses brass linework; Level 4 is brass within otherwise muted location text. Quiet utility buttons have transparent backgrounds and a 150ms background/color transition.

### Room Browser

- **Shape:** floating 282px navy panel with a 3px radius and 1px structural border.
- **Content:** Archivo browser title, search field, category select, result metadata, amenity rows, and a lightweight status footer.
- **States:** selected rooms use a muted olive-slate background with pale brass text; hover is cooler slate. On mobile it becomes a bottom sheet with a 5px radius.

### View and Camera Controls

- **Shape:** compact navy control rail with a 5px radius, thin border, and 44px minimum view-toggle height.
- **Active state:** the active view is solid brass with model-slate text. Pressed icon controls keep a transparent surface and switch their icon color to brass.
- **Focus:** keyboard focus is a 2px brass outline offset by 4px.

### Search and Select Fields

- **Style:** 44px search input on raised slate; select is transparent with a structural-line border. Both use 3px corners and light text.
- **Focus:** use the shared brass outline. Input carets are brass.

### Detail Panel

- **Corner Style:** 3px navy floating panel; 330px wide on desktop and a lower-half sheet on mobile.
- **Content:** brass category label, Archivo room heading, edge-to-edge photo within the panel, descriptive body copy, compact location row, and booking status.
- **Primary action:** the booking link is a full-width brass row with navy text and a 3px radius.

### Dialog

The about dialog is a maximum 550px midnight-navy surface with a 5px radius, structural border, and deep backdrop shadow. Definition-list labels use brass; body text remains muted for a calm informational read.

## Do's and Don'ts

### Do:
- **Do** keep the furnished 3D model as the largest visual surface.
- **Do** use brass (`#d1b674`) to identify an active view, selected amenity, orientation, measure, or primary booking path.
- **Do** retain 44px mobile targets for icon controls, view toggles, header utilities, and selects.
- **Do** preserve the brass 2px / 4px-offset focus treatment and honor reduced-motion preferences.
- **Do** move the browser and detail panel into non-overlapping bottom sheets on small screens.

### Don't:
- **Don't** introduce rounded, pastel, or high-elevation marketing-card styling.
- **Don't** use brass as a default body-text or large-surface background color.
- **Don't** obscure the model with simultaneous mobile browser, detail, help, and scale overlays.
- **Don't** replace the concise operational labels with promotional copy.

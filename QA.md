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

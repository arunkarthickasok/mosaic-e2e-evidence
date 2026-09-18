# CP-ADOPT-4 evidence album — the first outside component becomes usable (P1b + P1b-client)

Filmed 2026-09-18 against DDEV, real admin auth, `--project=journeys`, no sleeps. Journeys
`js/e2e/journeys/cp-adopt-4.spec.ts` (+ the mechanism witness `cp-adopt-4-witness.spec.ts`; `js/e2e/` is
gitignored — the frames + JSON are the artifact). Scratch node **988** places `olivero:teaser` with its
`content` slot filled by an owned `mosaic_heading`.

| Frame | Screen | Shows |
|---|---|---|
| `j1-libraries-olivero-enabled.png` | Component Libraries admin page | the **Olivero (theme) — theme-bound** library **enabled**; **Teaser** graded **Attention** (0 fields, 5 slots); "adopted libraries off by default" |
| `j2-canvas-teaser-tierb-ssr.png` | builder canvas (node 988/edit) | the adopted teaser rendered on the **canvas** via Tier-B SSR — its `content` slot drop zone holds **"Adopted Olivero"** (the Mosaic heading, portaled into the library's own slot marker) |
| `j3-page-teaser-olivero-css.png` | anon page (node 988) | the teaser rendered with Olivero's own markup + the Mosaic heading in its content slot |
| `canvas-computed.json` | canvas computed style | `.teaser` → **`position: relative`** + box 288×440 — Olivero's stylesheet applied ON THE CANVAS |
| `page-computed.json` | page computed style | `.teaser` → **`position: relative`** + box 788×144 — same on the page (canvas == page) |
| `palette-ids.json` | builder drupalSettings | the live palette contains `olivero:teaser` |
| `WITNESS.json` | mechanism probe | **before the fix:** `ssr: []`, `.teaser` count 0, the dashed generic scaffold; **the CSS was attached** (`teaser.css`) but the SSR was never requested |

## The mechanism (witnessed) → the fix
**Root cause:** the adapter's `slotKeys.length > 0` generic-scaffold branch (`MosaicPuckAdapter.ts:495`) ran
BEFORE the `requires_ssr_preview` Tier-B branch (`:539`), so an adopted component *with slots* rendered the
dashed placeholder and never requested its SSR (`WITNESS.json`: `ssr: []`, teaser count 0).
**Fix:** the Tier-B branch now precedes the generic scaffold; an adopted component with slots uses
`buildAdoptedRenderer` → `MosaicAdoptedPreview`, which renders the library's SSR chrome and **portals a Puck
slot drop zone into each `<mosaic-slot>` marker** the server emits — so the component renders with its own
markup AND its slots stay authorable.
**After the fix (re-witnessed):** `ssr: 1 (200)`, `.teaser` count 1, `position: relative`, `mosaic-ssr-preview`
present — the teaser renders on the canvas (j2), styled the same as the page (canvas-computed == page-computed).

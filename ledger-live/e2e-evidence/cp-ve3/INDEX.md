# CP-VE3 — album INDEX

Films for the Views-embed depth arc (CP-VE3: P0.5 → G0 + the P2-B/P4 live pass). Ship #39.
Content provisioned by the scratch `web/cpve3_content.php` (view `cpve3_ep` + hosts 983/984/985);
never staged into ship #39.

## P1 — SSR preview, panel-driven
| # | Frame | Shows |
|---|---|---|
| 01 | `01-admin-preview.png` | Admin: panel "Preview in canvas" → inert SSR snapshot in the view card (F-103). |
| 02 | `02-fe-preview.png` | Front-end builder: same panel-driven preview (parity). |

## P2-B — exposed filters + pager depth (live, 6 walks, all GREEN)
Row ids are the embedded view's `/node/N` links, in DOM order (view sorts by nid ASC, 2/page).

| Frame(s) | Walk | Witnessed |
|---|---|---|
| `p2b-a-pager-full-p0.png` / `-p1.png` | **D1** full pager | p0 = `1,2` → p1 = `3,4` (rows change by id, no overlap) |
| `p2b-a-pager-mini-p0.png` / `-p1.png` | **D2** mini pager | numbered-links = `0` (prev/next only); `1,2` → `3,4` |
| `p2b-b-exposed-before.png` / `-after.png` | **D3** AJAX exposed | Type=skill: `1,2` → `4,5`; **window marker survived = no full reload (AJAX)** |
| `p2b-e-cache-1filter.png` / `-2clear.png` / `-3refilter.png` | **D4** cache fix live | filter `4,5` → clear `1,2` → **refilter `4,5` (equals filter — no stale serve)** |
| `p2b-c-dual-before.png` / `-after.png` | **D5** dual embed | e1 `1,2`→`3,4`, e2 `1,2`→`1,2` → **INDEPENDENT (AJAX)**; see nuance below |
| `p2b-d-embed-paged.png` / `p2b-d-ownpage.png` | **D6** embed + own page | embed paged to `3,4`; `/cpve3-list` own page still `1,2` (coexist) |

**D5 nuance (both true, recorded honestly):** in the browser (JS/AJAX) the two embeds are
**INDEPENDENT** — Views AJAX replaces only the clicked embed's `js-view-dom-id` container. Under
**no-JS / a bookmarked `?page=1` URL** the same page shows `3,4,3,4` — both advance, because they
share pager element `id:0` (one `?page` key). MOSAIC.md author-note in `reports/WALK-CP-VE3.md` §D.

## P4 — preset round-trip (A3)
| Frame | Shows |
|---|---|
| `p4-preset-instance.png` | Node 986 = a `cpve3_preset` global-template instance rendering the round-tripped view. |

Data-layer verdict (real `MosaicGlobalTemplate` config entity): a configured mosaic_view
(`cpve2_termd0:embed_1` + `argument_sources:[{fixed,6,taxonomy_term}]` + `hide_when_empty:true`)
saved as template → inserted on a fresh node → **view_display + argument_sources + hide_when_empty
all INTACT** → "CONFIG ROUND-TRIPS INTACT".

## Backing gates (P5, 2026-09-15)
Kernel — mosaic_views FULL **53 / 816 / 0**. Vitest **537 / 1** (B-101). phpcs **0 ERRORS**.
phpstan **[OK]**. D4's cache fix is also Kernel-proven in `ViewsEmbedExposedPagerTest` (3/3);
the D4 film is its browser confirmation.

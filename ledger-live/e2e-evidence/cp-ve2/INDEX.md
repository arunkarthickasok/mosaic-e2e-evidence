# cp-ve2 — CP-VE2 argument-source film (SHIP #37 / N2)

Deterministic scratch content (`web/cpve2_content.php`): term tree Fruit(1)→Citrus(2)→
Lemon(4); Fruit(1)→Berry(3)→Straw(5). Content pages Navel(972)=Citrus, Orange(973)=Citrus,
Meyer(974)=Lemon, Blueberry(975)=Berry, Wild Straw(976)=Straw. Host pages embed a
`mosaic_view` with per-slot `argument_sources`.

| Frame | Scenario | Geometry oracle (asserted in the spec) |
|---|---|---|
| `03-fixed-term-page.png` | /node/977 — fixed source = Citrus, depth 0 | rows == **Navel, Orange** (exact Citrus) |
| `04a-urlparam-tid2-citrus.png` | /node/978?tid=2 — url_param source | rows == **Navel, Orange** |
| `04b-urlparam-tid3-berry.png` | /node/978?tid=3 — url_param source (SWAP) | rows == **Blueberry** (varies per ?tid) |
| `06-depth-root.png` | /node/979 — fixed = Fruit root, depth 2 | rows == **Navel, Orange, Meyer, Blueberry, Wild Straw** (child + grandchild) |
| `07-exclude-this-page.png` | /node/981 — this_page + native `not` (Exclude) | host's own row **absent**; other CPVE2 pages present |
| `05a-currentuser-admin.png` | /node/980 — current_user source, logged-in | admin (uid 1) sees the authored page rows |
| `05b-currentuser-anon.png` | /node/980 — current_user source, anonymous | anon (uid 0) sees **empty** (delta by viewer) |
| `01-panel-source-dropdown.png` | builder — the source dropdown | six sources; View-default reads "View default (show all)" (F-105) |
| `02-fixed-autocomplete.png` | builder (throwaway host 982) — fixed → entity autocomplete | REAL-POINTER fast-typed "Citrus" (50ms/key) → inputValue=="Citrus" (WC57 fix: no dropped keys) |
| `08-n1-exclude-help.png` | builder /node/981 — this_page on a nid arg (N1) | help: "To exclude this page, enable 'Exclude' …" |

Spec: `js/e2e/journeys/cp-ve2-film.spec.ts` (project `journeys`, admin storageState).
The published-page frames (03/04/06/07) carry PASSING geometry oracles; 05 is a viewer
delta (admin 50 rows vs anon 0 via clearCookies, also confirmed by curl); frame 02 asserts the
fast-typed input holds the full string (WALK-CATCH #57 fix). Builder frames are filmed on the
THROWAWAY host 982 (the builder persists panel edits — geometry hosts 977–981 are never typed into).

## Two real bugs this film caught (both fixed + regression-tested)
1. **buildRenderable ignored the resolved argument.** `renderView()` set the resolved
   args via `setArguments()` but called `buildRenderable($display, [])` — whose 2nd
   parameter IS the render-time contextual arguments — so the rendered embed showed the
   WHOLE unfiltered View. Fix: pass the resolved args to `buildRenderable`. Guard:
   `ViewsEmbedRenderTest::testEmbedAppliesResolvedArgument`.
2. **Per-component render cache didn't vary by cache context.** The CID keyed on static
   props only, so a `url_param` / `current_user` source served a stale render across
   values (?tid=2 and ?tid=3 collided). Fix: fold the component's cache contexts into the
   CID (MosaicRenderer). Guard: `ViewsEmbedRenderTest::testRenderCacheVariesByUrlParamContext`.

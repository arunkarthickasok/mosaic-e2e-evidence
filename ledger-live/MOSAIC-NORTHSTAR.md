# MOSAIC NORTHSTAR — market position, full-experience vision, and the road to a superior product
**Authored 2026-09-09 (reviewer synthesis of: CP-GRAND-AUDIT-CAPABILITY b20ba2e · four independent cold AI reviews · live market research). Owner: Arun Karthick. Repo overrules. Amend only by ratified ruling.**

---

## 1. THE MARKET MAP (September 2026, receipts held)

**TOP TIER — the experience bar authors expect (not competitors, but the standard):**
- **Webflow / Framer / Wix Studio:** on-canvas inline editing, pixel design freedom, instant visual feedback, template marketplaces. Their pain: proprietary lock-in, content models bolted on after design, enterprise governance weak. *Lesson for us: the feel — immediate, visual, confident. The escape-hatch question they fail is one we must pass.*
- **WordPress Gutenberg + Elementor (the volume kings):** Elementor's panel patterns (repeatable items, active-item sync — which we adopted deliberately) are the world's muscle memory. Their pain: plugin-stack fragility, update breakage, performance bloat on the public page. *Lesson: our JS-free anonymous render is a genuine, marketable differentiator against the biggest player on earth.*

**MID TIER — the composable/visual-CMS wave:** Builder.io, Plasmic, Storyblok's visual editor. Strong SDK-first stories, headless-native. Their pain: developer-first setup cost, content trapped in vendor clouds. *Lesson: our "it's just a Drupal field on your entities, stored in your database, rendered by your Twig" is the anti-cloud pitch — say it loudly in docs.*

**DRUPAL WORLD — the direct fight:**
- **Drupal Canvas (the giant):** 1.0.0 Dec 2025; now 1.8.0, monthly releases, core-team velocity. Translation stable (1.8), AI page-building agents (1.2+), auto component-instance updates, Search API indexing, entity-ref props. Its identity: *site builders theme and build the ENTIRE site in-browser with JSX/code components* — a theme-layer replacement, launched with **no integration API beyond SDC/Blocks**. Known community pains we hold receipts for: locked/restricted text formats (a contrib module exists just to unlock the editor), the block-context contextual-filter model with a decade of Layout Builder scar tissue, double-escaping issues, JSX-not-Twig rendering culture.
- **Layout Builder:** core-integrated, enterprise-entrenched, and universally described as clunky; contextual filters via block context = the pain our Views design targets by name.
- **Paragraphs:** rock-solid structured data, zero visual canvas. The migration pool: thousands of sites that want Paragraphs' data discipline WITH a canvas. (Our mosaic_paragraphs bridge is aimed exactly here — currently FUNCTIONAL-UNWALKED.)

**THE NICHE SENTENCE (ratified positioning, sharpened by Canvas 1.8 intel):**
*Canvas rebuilds your site as a JSX app; Mosaic gives content authors a world-class visual canvas on a FIELD inside the classically-themed, Twig-rendered, enterprise-governed Drupal site you already have — with nothing shipped to anonymous visitors but HTML and CSS.* Field-level attach · Twig-first render · core CKEditor + text formats respected · your theme stays your theme. That is a real, defensible, underserved position — validated independently by four cold AI reviews.

---

## 2. WHERE MOSAIC ACTUALLY STANDS (audit b20ba2e, honest)

**Live-witnessed truth:** the 6-enabled authoring product connects config → builder → save → anonymous render at HTTP 200 (columns/divider/heading/spacer/text; tabs with JS-free declarative shadow DOM; carousel), builder JS never leaks to anon, admin preview correctly gated. **No gap blocks the core author loop.** 2,853+ tests green; full-lifecycle Playwright with screenshot evidence; 48 maintainer walk-catches closed across the campaign.

**The 16-unit scoreboard:** 2 COMPLETE-WALKED (mosaic core, mosaic_components) · 11 FUNCTIONAL-UNWALKED (working code, never proven on a live walk — the honesty debt) · 1 EXPERIMENTAL (intelligence: Lighthouse/WCAG badges never populate — worker only logs) · 1 SKELETON (canvas_bridge + the Views embed, design-stage) · 1 BROKEN (commerce: twigs call `drupal_entity()` with twig_tweak absent from the codebase).

**The honest gap class (what the four AI reviews and the audit agree on):** not architecture — *evidence and completeness of the outer ring.* The center is proven; the ring of submodules, integrations, and enterprise stories (translation, moderation, export) is built-but-unproven or gapped.

---

## 3. THE FULL EXPERIENCE — the end-state in four persona journeys (every link must be WORKS-WALKED before tag or explicitly labeled post-tag)

**P-SB · The Site Builder (15 minutes, zero docs):** install → a setup-status page says exactly what to do next → apply the blog recipe → **the recipe attaches field_mosaic_layout + form/view displays itself (D-2)** → permission recipe offers three ready roles (author / editor+break-lock / admin) → adds the field to a second content type via normal Field UI, every setting labeled in human words → first page built in the first sitting. *No dead-ends, no "config exists but no UI," no manual field wiring.*
**P-AU · The Content Author (the daily loop — largely SHIPPED):** open node → canvas loads fast → palette in human words → every advertised component authorable (→ D-1: never advertise a data source with no resolver) → rich text in the editor they already know → media at the cursor, visibly → device layouts that really render → templates, locks that tell the truth, Preview that works → save → the public page is exactly what they built. *Remaining polish: carousel/search authoring (ship #33), Act 2 visual coherence, the picker at 100k templates (F-037).*
**P-DEV · The Developer:** one `.mosaic.yml` sidecar + SKILL-style docs → a custom component with typed, labeled fields appears in the palette with repeatable/richtext machinery for free → hooks/plugins for alteration → **a written storage-model + export guarantee ("your content is versioned JSON on your entities; here is the drush command that proves it leaves whole") — the escape-hatch doc all four AI reviews demanded.**
**P-ENT · The Enterprise Evaluator:** security posture documented (locks, CSRF, fail-closed, filter-pipeline rendering — shipped) → **upgrade-path rehearsal suite** (build a fleet of layouts, run every schema migration, render byte-faithful — Wave D) → translation/moderation ADRs with honest labels (D-4: langcode column + $langcode-aware formatter — *raised in priority by Canvas 1.8 shipping translation*) → device-tree content-governance guidance → a project page whose claims match the branch (the truth pass at tag).

---

## 4. GAP → SUPERIOR-SOLUTION MATRIX (the ruling material)

| # | Gap (audit/reviews) | Superior solution | Slot (rec.) |
|---|---|---|---|
| D-1 | views_result advertised, no resolver → silent empty render | Manifest gates dataSourceTypes() by installed+enabled plugins; author never sees a dead option | **Pre-tag, S — rides ship #34** |
| D-2 | Blog recipe doesn't attach the field | Recipe attaches field + displays + a starter template; 15-min P-SB journey test proves it | **Pre-tag, S — ship #34** |
| D-3 | Intelligence badges never populate | Hide-when-unconfigured now (XS); real Lighthouse pipeline = 1.1 roadmap, honestly labeled | **Pre-tag XS + 1.1** |
| D-4 | Translation: no langcode on revision table; formatter ignores $langcode | Schema update + langcode-aware load/render + ADR; Kernel cells per language | **Wave F (promoted — Canvas 1.8 pressure)** |
| D-5 | Views embed = design only | The ratified 3-CP arc (unchanged) | Views arc (post-#33) |
| D-6..14 | Disabled-submodule gaps incl. commerce BROKEN (twig_tweak absent), collab GC unwired, search/paragraphs LICENSE, registry, tokens, acsf | Wave-G bundle: enable-or-demote ruling per unit; commerce = replace `drupal_entity()` with a lazy_builder render (no contrib dep) or mark experimental-out-of-tag | **Wave G sheet (R-C7)** |
| AI-1 | Escape-hatch / lock-in fear | STORAGE-AND-EXPORT.md + `drush mosaic:export` proof + a "leave whole" test | **Pre-tag doc, S** |
| AI-2 | Upgrade fear (schema migrations) | Upgrade-rehearsal suite: fleet → migrate v1→current → byte-faithful render oracle | **Wave D** |
| AI-3 | Device-tree content drift | Authoring-guidance doc + a per-node "variants exist" indicator (XS) | Act 2 |
| AI-4 | Public page stale (rc3-era) | Project-page + release-notes truth pass; screenshots from Act 2 | **Tag campaign** |

---

## 5. THE RATIFIED ROAD (recommendation — Arun rules)
Ship #33 (carousel+search coupled landing, foundation banked) → **Ship #34 "AUTHOR-TRUST SLICE"** (D-1 + D-2 + D-3-hide + AI-1 escape-hatch doc — the four small cuts that make the product honest to strangers) → Views arc CP-1..3 → **ACT 2 visual campaign** (+ AI-3 indicator) → Wave D (test-desert + AI-2 upgrade-rehearsal + retrofits) + Wave F (D-4 translation promoted, F-072, F-059, F-069, F-076, B-101, F-086 recipe) → Wave G (the R-C7 enable-or-demote sheet, commerce fix, walk round 4) → dev push → soak → **tag 1.0.0 + truth pass** → post-tag ascent: first three production sites, co-maintainer hunt, 1.1 (real Lighthouse, headless path, Schema.org).

## 6. THE POST-TAG TRUTH (from four cold reviewers, kept honest)
1.0.0 is the starting gun, not the finish: production exposure, co-maintainers, and six months of wild usage are what convert "promising architecture" into "reliable choice." The tag campaign plans for that day one: case-study site, issue-queue SLA, the public evidence repo strategy.

*End. This document + MASTER-AUDIT-CAPABILITY.md together are the complete state of truth. Next amendment only by Arun's ratified ruling.*
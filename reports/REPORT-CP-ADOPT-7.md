# REPORT — CP-ADOPT-7 P0: external-library readiness probe (report-only)

**Baseline:** ship #46 `a36f028`. Mosaic git READ-ONLY; nothing staged; no dev DB/config writes.
This is a DISCOVERY packet — no product code was written for it. It STOPS after the gap register,
for Arun's read before any CP-ADOPT-7 build.

> **NAMING BAN (binds this whole report).** The adopted library is called **"the external library"**
> everywhere — never its name, vendor, region, or organization. Its SDC provider machine-name is
> written **`«ext»`**; its private CSS-token / custom-element namespace is written **`«ext»-`** /
> **`--«ext»-*`**; its module dir, version and JS bundle name are not printed. Component **local**
> names kept below are generic UI roles (accordion, card, modal, …) that carry no vendor/region/org
> signal. The library is **already enabled at the Drupal level by Arun**; it is **NOT** enabled in
> Mosaic's `component_library` config entity (that is Arun's walk) — this probe reads it through core
> SDC discovery + Mosaic's services, as Mosaic "sees" it today.

**Method:** drush reads through Mosaic's own services — `plugin.manager.sdc` (definitions);
`mosaic.manifest_builder::buildComponentEntry` (descriptors/slots/prop_types/…); grade from
`MosaicComponentGrader::grade()`; `mosaic.prop_shape_registry` (prop shapes); `mosaic.
global_styles_scanner::scanComponent` (SO-7); `MosaicComponentLibrary::isThemeBound` (theme-bound is a
LIBRARY-level flag); `mosaic.renderer::renderSingleComponent` (H4 render dry-run) — plus on-disk reads
of each component's twig/css/js/libraries. No dev pages, no config writes.

## Two headline readiness blockers (before the per-section detail)
1. **None of the 47 are authorable yet.** `MosaicComponentGovernance::isAuthorable()` returns FALSE
   for all 47 **even as uid 1**, because the `mosaic_component_library` config entity for `«ext»`
   **does not exist** (library sync never run). For an adopted provider, "no library entity" = nothing
   enabled = not in the palette. Creating + enabling that entity is **Arun's walk** (the probe did NOT
   do it). `adopt_palette` is unset → defaults TRUE, so that guard is not the blocker; the absent
   library entity is.
2. **`theme_bound` is uniformly FALSE** — the provider is a **module**, not a theme (derived from the
   extension type; the library entity itself is absent). So H6 theme-bound handling is not exercised
   by this library.

---

## §1 — DISCOVERY: every component as Mosaic sees it

Provider-count breakdown (`plugin.manager.sdc`): **`«ext»` = 47**, mosaic_components 13, olivero 1,
mosaic_views 1, mosaic_webform 1. `«ext»` is an **adopted / non-owned** provider
(`MosaicComponentAlias::providerIsOwned('«ext»') === false`).

**Every component grades ATTENTION (0 Ready, 0 Blocked)** — each has ≥1 raw prop (§2). `theme_bound` =
FALSE and `ships_global_styles` = FALSE for **every** row (§4); **no `variants`** declared on any
component; **no slot child-rules** anywhere (all `slot_descriptors` have `min=null`, no allowed list).
`render` = §5 result `pass(html_bytes)`.

| # | id (`«ext»:`) | grade | #props | prop kinds | #slots | slot names | render |
|---|---|---|---|---|---|---|---|
| 1 | accordion | attention | 4 | raw×3, select×1 | 1 | items | pass(121) |
| 2 | accordionitem | attention | 5 | formatted_text×1, raw×3, select×1 | 0 | — | pass(73) |
| 3 | alert | attention | 11 | raw×10, select×1 | 0 | — | pass(63) |
| 4 | avatar | attention | 10 | raw×10 | 0 | — | pass(49) |
| 5 | backtotop | attention | 3 | raw×3 | 0 | — | pass(40) |
| 6 | badge | attention | 9 | raw×6, select×3 | 0 | — | pass(91) |
| 7 | breadcrumbs | attention | 7 | raw×6, select×1 | 1 | items | pass(125) |
| 8 | button | attention | 23 | raw×19, select×4 | 0 | — | pass(148) |
| 9 | card | attention | 14 | formatted_text×2, raw×10, select×2 | 2 | preheading_content; footer | pass(662) |
| 10 | checkbox | attention | 19 | formatted_text×1, raw×17, select×1 | 0 | — | pass(82) |
| 11 | checkboxgroup | attention | 15 | formatted_text×1, raw×13, select×1 | 1 | options | pass(148) |
| 12 | combobox | attention | 15 | formatted_text×1, raw×13, select×1 | 1 | options | pass(139) |
| 13 | datepicker | attention | 20 | raw×19, select×1 | 0 | — | pass(88) |
| 14 | divider | attention | 2 | raw×2 | 0 | — | pass(34) |
| 15 | dropdownmenu | attention | 5 | raw×4, select×1 | 1 | (menu-items) | pass(160) |
| 16 | dropdownmenuitem | attention | 7 | raw×7 | 0 | — | pass(62) |
| 17 | (platform-button) | attention | 27 | raw×23, select×4 | 0 | — | pass(207) |
| 18 | errormessage | attention | 3 | raw×3 | 0 | — | pass(46) |
| 19 | globalfooter | attention | 5 | raw×5 | 1 | menu | pass(111) |
| 20 | globalheader | attention | 8 | raw×8 | 2 | menu; userActionsMenu | pass(116) |
| 21 | icon | attention | 8 | raw×6, select×2 | 0 | — | pass(71) |
| 22 | iconlist | attention | 2 | raw×2 | 1 | items | pass(98) |
| 23 | iconlistitem | attention | 3 | formatted_text×2, raw×1 | 0 | — | pass(47) |
| 24 | label | attention | 6 | raw×5, select×1 | 0 | — | pass(60) |
| 25 | modal | attention | 8 | formatted_text×1, raw×6, select×1 | 1 | actions | pass(156) |
| 26 | pagination | attention | 4 | raw×4 | 0 | — | pass(44) |
| 27 | processlist | attention | 5 | raw×4, select×1 | 1 | items | pass(138) |
| 28 | processlistitem | attention | 3 | formatted_text×1, raw×2 | 0 | — | pass(53) |
| 29 | radiobutton | attention | 16 | formatted_text×1, raw×14, select×1 | 0 | — | pass(82) |
| 30 | radiogroup | attention | 14 | formatted_text×1, raw×12, select×1 | 1 | options | pass(142) |
| 31 | select | attention | 16 | formatted_text×1, raw×14, select×1 | 1 | options | pass(126) |
| 32 | skipnav | attention | 2 | raw×2 | 0 | — | pass(35) |
| 33 | step | attention | 5 | raw×5 | 0 | — | pass(35) |
| 34 | stepper | attention | 3 | raw×3 | 2 | actions; steps | pass(199) |
| 35 | tab | attention | 4 | raw×4 | 0 | — | pass(31) |
| 36 | tabgroup | attention | 2 | raw×2 | 3 | tabs; tabpanels; (interleaved) | pass(230) |
| 37 | table | attention | 7 | formatted_text×1, raw×6 | 0 | — | pass(42) |
| 38 | tabpanel | attention | 3 | formatted_text×1, raw×2 | 0 | — | pass(39) |
| 39 | textarea | attention | 21 | formatted_text×1, raw×18, select×2 | 0 | — | pass(106) |
| 40 | textinput | attention | 24 | formatted_text×1, raw×21, select×2 | 0 | — | pass(109) |
| 41 | toggle | attention | 12 | formatted_text×1, raw×10, select×1 | 0 | — | pass(64) |
| 42 | tooltip | attention | 5 | raw×4, select×1 | 0 | — | pass(57) |
| 43 | (nav-footer) | attention | 1 | raw×1 | 0 | — | pass(38) |
| 44 | (nav-header) | attention | 5 | raw×5 | 0 | — | pass(44) |
| 45 | verticalnav | attention | 7 | formatted_text×2, raw×4, select×1 | 1 | menu | pass(132) |
| 46 | verticalnavgroup | attention | 5 | raw×5 | 1 | links | pass(120) |
| 47 | video | attention | 9 | raw×7, select×2 | 0 | — | pass(71) |

Only **two** known descriptor kinds appear across the whole library: `select` and `formatted_text`.
No `text`, `toggle`, `number`, `link`, `media`, `repeatable`, or `entity_ref` descriptors are produced
at all — see §2 for why.

> Note (method correction): `buildComponentEntry()` does not itself emit `grade`, `theme_bound`, or
> `ships_global_styles`; those columns are composed from `MosaicComponentGrader::grade()`, the
> library-level theme-bound flag, and `MosaicGlobalStylesScanner` respectively. Every entry's `label`
> came back **empty** (`""`) — the builder reads `$def['label']` (absent on these SDCs) not
> `$def['name']` (present) → **authors would see blank component names** (gap G2). `category` is
> uniformly **"Other"** (no SDC `group` set) → all 47 land in one palette bucket (gap G3).

---

## §2 — PROP-SHAPE COVERAGE (known descriptor vs raw)

Total props across the 47: **412**. Known descriptor → **59 (14.3%)**; fell to **RAW → 353 (85.7%)**.

| kind | count |
|---|---|
| raw | 353 |
| select | 39 |
| formatted_text | 20 |

**Root cause of the raw flood (the single highest-leverage finding).** The external library declares
nearly every prop as a **nullable JSON-schema union type** (`"type": ["string","null"]`,
`["boolean","null"]`, …). `PropShape::classify()` does `if (!is_string($type)) return self::RAW;` — an
**array** `type` is never classified, so it falls straight to raw. The 353 raw props by declared type:

| declared `type` | raw props |
|---|---|
| `["string","null"]` | 214 |
| `["boolean","null"]` | 114 |
| `["integer","null"]` | 12 |
| `["string","integer","number","null"]` | 5 |
| `["string","integer","null"]` | 3 |
| `["array","null"]` | 3 |
| `["string","object","null"]` | 1 |
| bare `object` (only non-union raw) | 1 |

`select` (39) and `formatted_text` (20) survive only because `enum` and scalar-string
`contentMediaType` are checked **before** the type-string test. **Unwrapping `["X","null"] → X`** in
`PropShape::classify()` would reclassify the vast majority — 214 string→text/link, 114 boolean→toggle,
12+ integer→number, 3 array→repeatable — and move most components from ATTENTION toward READY, and
(critically) restore their `bind`/`style` capabilities (raw props carry `bind:false, style:false`).

- **`$ref` usage:** none (0 props).
- **`meta:enum` labels:** none — all 39 `select` enums ship without `meta:enum`, so option labels fall
  back to the raw enum value (machine strings shown to authors). UX gap G4.
- **Bare-object raw prop:** `card.image` — `{"type":"object","required":["src"],"properties":{"src":
  {"type":"string"},…}}` (a structured image object; needs a `field_types` override to become a media
  field). Gap G5.
- **Formatted-text props (20):** all declared via **`contentMediaType: "text/html"`** (no `format`
  keyword anywhere), e.g. `card.content`, `accordionitem.content`, `modal.markup`, `table.table`,
  `*.longdescription`. These classify correctly as `formatted_text` (text-format-enforced richtext) —
  no action needed.

---

## §3 — SLOTS (plain content vs child components; nesting)

**17 components have slots.** Every slot expects **rendered child components (or free rich content)
passed as a raw HTML string** — the Twig prints `{{ slotname }}` straight into the custom element's
light DOM, where the web component projects it into its shadow `<slot>`. There are **no `slot_rules`**
anywhere, so Mosaic **cannot enforce** the child-type contracts — they exist only as Twig-docblock
prose. Representative templates (custom-element names redacted to `«ext»-*`):

```twig
{# accordion.twig — items expects accordion-item children #}
<«ext»-accordion ...>
  {% if items %}{{ items }}{% endif %}
</«ext»-accordion>
```
```twig
{# tabgroup.twig — three slots, each a specific child type #}
<«ext»-tabgroup ...>
  {% if tabs %}{{ tabs }}{% endif %}
  {% if tabpanels %}{{ tabpanels }}{% endif %}
  {% if tabtabpanels %}{{ tabtabpanels }}{% endif %}
</«ext»-tabgroup>
```
```twig
{# card.twig — free rich content into named light-DOM slots #}
{% if resolved_preheading_content|trim %}
  <div slot="preheading">{{ resolved_preheading_content }}</div>
{% endif %}
{% if resolved_footer|trim %}
  <div slot="footer">{{ resolved_footer }}</div>
{% endif %}
```

**Nesting contracts observed** (parent slot → intended child, prose-only, NOT machine-enforceable
today): `accordion.items→accordionitem`; `tabgroup.{tabs,tabpanels}→tab/tabpanel`;
`iconlist.items→iconlistitem`; `processlist.items→processlistitem`;
`verticalnav.menu` / `verticalnavgroup.links→verticalnavgroup`; `stepper.steps→step`;
`dropdownmenu→dropdownmenuitem`; `breadcrumbs.items`; `{checkboxgroup,combobox,radiogroup,select}.options`.
Several components also `{% include %}` **sibling `«ext»` components internally** — i.e. these SDCs
compose other SDCs. **Mosaic can express `allowed`/min/max slot rules today (Pillar C), but the library
ships none**; a sidecar could ADD them (H7) but that is per-component authoring (gap G6).

---

## §4 — ASSETS (behaviors / SO-7 / tokens)

This is a **shadow-DOM web-component (custom-element) library** — the decisive asset finding:

- **The module-level library ships JS only** — a single large ES module (`attributes: {type: module}`)
  that runs **55 `customElements.define()`** registrations (more than 47 — some elements are
  sub-elements). **No CSS is declared in the library's `*.libraries.yml` at all.**
- **No `Drupal.behaviors` anywhere** (0 files). Components self-register as custom elements on module
  load. **R10 relevance:** the attach-once / `Drupal.attachBehaviors` path Mosaic built (R5/R9/R10) is
  **not needed** by this library — BUT the module's ESM bundle **must be loaded** (on the page AND in
  the Puck canvas) for the custom elements to upgrade/hydrate. That loading is the real integration
  point, not behaviors.
- **No co-located `<machine>.css` files** (0 across all 47). All component CSS is **embedded in the JS
  and Shadow-DOM-encapsulated** (`:host`, `::slotted(...)`, internal classes inside the shadow root).
  Shadow-encapsulated CSS **cannot leak to the page**.
- **SO-7 `scanComponent`: `ships_global_styles = FALSE` for all 47** (element_selectors empty,
  important_count 0). Correct here — but for a subtle reason: the scanner only reads a co-located
  `<machine>.css`, of which there are **none**, and the real CSS (shadow-scoped, in the JS) genuinely
  poses no global-restyle risk. **Caveat (gap G8):** the SO-7 scanner is structurally **blind** to a
  module-level JS bundle AND to CSS declared via `*.libraries.yml`; a different library shipping a
  global stylesheet that way would slip past this per-component scan. Harmless for THIS library.
- **`!important`:** 19 occurrences, all inside the shadow-encapsulated CSS — contained, no page effect.
- **CSS custom properties / `:root`:** **no `:root {}` block anywhere** — the library injects no global
  tokens. Components *consume* **205 unique `--«ext»-*` design tokens** via
  `var(--«ext»-…, <hardcoded-fallback>)` plus private shadow-scoped `--_«ext»-*` vars. Because tokens
  carry fallbacks, components render standalone; **full theming needs a theme to define `--«ext»-*` at
  `:root`** (the module ships none).
- **Collision with Mosaic's owned-root tokens: NONE.** The library uses the `--«ext»-*` namespace;
  Mosaic owns `--mosaic-*`. Disjoint — **0 `--mosaic-*` references** in the whole library.

---

## §5 — RENDER DRY-RUN (hybrid renderer, default/example props — H4)

Example props built per prop: `default` → first `enum` value → type-appropriate placeholder (first
non-`null` type of the union). Each call wrapped in try/catch.

- **PASS: 47 / 47** · **FAIL: 0** · **empty-HTML: 0** (every call returned non-empty markup, 31–662
  bytes; e.g. `card` 662, `tabgroup` 230, `(platform-button)` 207).

The adopted-component render path (`buildAdoptedComponentElement` → `renderInIsolation`, core component
element) works for the **entire** library server-side. **Important scope note:** this is SSR of the
custom-element **light-DOM markup only**; the shadow DOM + all interactivity **hydrate client-side** from
the module's ESM bundle, which a server render does not exercise. Visual correctness on PAGE and CANVAS
therefore depends on that bundle loading (gap G9) — the §5 oracle walk step 4 must confirm it.

---

## §6 — GAP REGISTER + oracle-walk skeleton

### §6.a — Gap register (classified + sized)

| id | Gap | Class | Size | Note |
|---|---|---|---|---|
| **G1** | Nullable **union types** (`["X","null"]`) all fall to raw → 353/412 props raw; every component ATTENTION; `bind`/`style` disabled on raw props | **Mosaic fix (pre-tag)** | **M** | Unwrap `["X","null"] → X` in `PropShape::classify()`. Reclassifies ~350 props (214 string→text/link, 114 bool→toggle, 12 int→number, 3 array→repeatable) and restores bind/style. **The linchpin** — unblocks panels, binding AND style overrides for the whole library. |
| **G2** | Component **labels blank** (`buildComponentEntry` reads `label`, not `name`) | Mosaic fix (pre-tag) | **S** | `$def['label'] ?? $def['name'] ?? id`. Authors currently see empty names. |
| **G3** | `category` uniformly **"Other"** (no SDC `group`) → one palette bucket | Mosaic fix (S) / library advice | **S** | Optional grouping heuristic, or accept. |
| **G4** | Enums lack **`meta:enum`** → raw machine values shown as option labels | Library schema advice | **S** | Ask the library to add `meta:enum`, or accept raw labels. |
| **G5** | `card.image` bare **object** → raw (not a media field) | Mosaic fix (`field_types` override) | **S–M** | Map `object{src,…}` → image/media field. |
| **G6** | Slot **child-rule contracts prose-only** (no `slot_rules`) → Mosaic can't restrict `accordion.items→accordionitem`, etc. | Library schema advice / accepted limitation | **M** | Sidecar can ADD rules (H7) for the top compositional components; or accept free-content slots for tag. |
| **G7** | **Not authorable** — `mosaic_component_library` entity for `«ext»` absent (sync never run); `isAuthorable` FALSE for all 47 | **Arun's walk (config, not code)** | **S** | Run library sync + enable. The probe did NOT do this (naming/no-config-write constraint). |
| **G8** | **SO-7 scanner blind** to module-level JS + `*.libraries.yml`-declared CSS | Mosaic fix (robustness) | **M** | Harmless for THIS library (shadow-scoped); fix for generality so a global stylesheet via libraries.yml is caught. |
| **G9** | **Client hydration unverified** — server render is light-DOM only; the shadow DOM + interactivity need the ESM bundle to load on PAGE and in the Puck **canvas** (iframe.enabled=false) | Needs walk / possible Mosaic canvas-asset fix | **M–L** | Pillar D canvas-asset attachment must load the library's `type:module` bundle; custom-element upgrade timing in the canvas is the risk. Confirm in walk step 4. |
| **G10** | Formatted-text via `contentMediaType` (no `format` keyword) | Accepted (works) | — | Classifies correctly; no action. |

**Gap register size: 10 gaps** — Mosaic pre-tag fixes **5** (G1 M, G2 S, G3 S, G5 S–M, G8 M),
library schema advice **2** (G4 S, G6 M — G6 shared with accepted-limitation), Arun-walk config **1**
(G7 S), needs-walk/canvas **1** (G9 M–L), accepted **1** (G10). **S≈4, M≈4, L-ish≈1, none≈1.**
**G1 is the linchpin**; without it the panel/binding/style walk steps are degraded library-wide.

### §6.b — Walk-step readiness (from §6.b skeleton below, cross-referenced to gaps)

- Step 1 (discovery/grade): **READY** (all list; blank labels G2 + one bucket G3 are cosmetic).
- Step 2 (panels match schema): **DEGRADED by G1** — works, but 85.7% show raw text inputs until G1.
- Step 3 / 3k (child rules bite, incl. keyboard): **BLOCKED by G6** — no rules to enforce.
- Step 4 (render page + canvas): SSR **PASS** (§5); **canvas hydration UNVERIFIED — G9** (the risk).
- Step 5 (string + slot + media binding): **BLOCKED/DEGRADED by G1** (raw props carry `bind:false`) + G5 for media.
- Step 6 (apply/remove style override): **BLOCKED by G1** (raw props carry `style:false`).
- Step 7 (library update / drift): **READY** (drift engine is component-agnostic).
- Step 8 / 8t (uninstall → fallback + report; theme-bound): **READY** (fallback is generic; theme-bound N/A — module).

### §6.b — The §5 oracle-walk skeleton (ADOPT-DESIGN §5 + §8 riders + §9.f), mapped by pillar

Instantiated against the external library's real components (redacted). **Arun runs it; the AI never
enables the library.**

| # | Pillar | Walk step (external library) | Oracle / pass condition |
|---|---|---|---|
| 1 | A DISCOVERY | Library admin lists all 47 `«ext»` components with name + grade. | Count == 47; grades == §1 (all Attention until G1); Attention rows name the prop + reason. |
| 2 | B PANEL | Open a rich component (e.g. `card`, `textinput`): panel fields match schema — text/link/formatted-text(CKE5)/enum→select/boolean→toggle/number/media/repeatable. | Every prop renders its shape's field; raw-fallback props show the Attention raw field, no crash. **(G1 gates quality.)** |
| 3 | C SLOTS | On a slotted component (`accordion`, `tabgroup`, `card`): each slot is a drop zone; allowed child lands, disallowed child → **visible violation**; min/max banner bites. | Child rules enforced; storage stays `nodes[id].slots.{zone}`. **(G6: no rules ship — free content only until added.)** |
| 3k | C + RC-A3 | Repeat step 3 **keyboard-only** (Tab to the zone "+", Enter, arrows, Enter). | Slot drop + child-rule fully keyboard-operable. |
| 4 | D RENDER | Place `card` + `accordion`(+items) on a page → view anonymous AND on the canvas. | Renders with the library's OWN shadow-DOM styling on BOTH page and canvas; **the ESM bundle loads + custom elements upgrade (G9)**; markup/IDs/classes never rewritten. |
| 5 | E BINDING | Bind a string prop to a field/token; bind a slot to a View (View-field→prop map); bind `card.image`. | Bound values SHOW (not copied); a bound media prop carries **alt** (RC-A2). **(G1/G5 gate this.)** |
| 6 | E + §9.f STYLE | Apply then remove a spacing/token override on an adopted component. | Override applies in Mosaic's layer; removing it returns the component to the library's own look byte-for-byte. **(G1 gates `style` capability.)** |
| 7 | G UPDATE | (test env) add an optional prop → appears silently; remove → kept-hidden + notice; change a type → flagged; check Schema-changes report. | The four drift classes surface exactly; pages intact. |
| 8 | H DEGRADE | Disable `«ext»` → pages show the bounded fallback (slots in template order, bound rows), builder "Library missing" card keeps values + bindings, affected-pages report lists them. Re-enable → byte-identical. **M1:** fallback in BOTH draft + published. | Never a white page; REGION/STYLE oracles equal before/after re-enable. |
| 8t | H6 THEME | Theme-bound check. | N/A here — provider is a **module**, `theme_bound` FALSE for all 47. |
| — | dims | Geometry (no layout jump; canvas == FE) + Permission-Parity (anon vs editor) on every step. | Style-shasum baseline holds; anon never sees editor-only chrome. |

---

## Summary (paste figures)

- **Component count:** 47 (provider `«ext»`).
- **Grade distribution:** Attention **47** · Ready **0** · Blocked **0**.
- **Raw-shape count (§2):** **353 raw / 412 total (85.7%)**; known 59 (select 39, formatted_text 20).
- **Render dry-run (§5):** **pass 47 / fail 0** (empty 0).
- **Gap register (§6):** **10 gaps** — pre-tag Mosaic fixes 5, library-schema advice 2, Arun-walk
  config 1, needs-walk/canvas 1, accepted 1 (≈ S4 / M4 / L1 / none1). **G1 (union-type classifier) is
  the linchpin.**

**STOP — P0 is report-only. No build until Arun reads this and rules CP-ADOPT-7 scope.**

---

## CHECKPOINT-1 — CP-ADOPT-7 P1: gap fixes G1/G2/G3/G5/G8 + R9 + F-109 (BUILT)

**Baseline** ship #46 `a36f028`. Mosaic git READ-ONLY (edits left uncommitted for Arun); the external
library NOT enabled in Mosaic — the re-grade Kernel cell reads its definitions read-only, gated on the
`MOSAIC_EXT_PROVIDER` env var so the provider name never enters committed code (naming ban).

### G1 — nullable-union classifier (the linchpin)
`PropShape::classify()` now unwraps a nullable union to its single real type BEFORE classifying:
`type: [X, "null"]`, an `anyOf`/`oneOf` with a `{type: null}` branch, and `nullable: true`. A genuine
multi-type union (null aside) is left as an array → still raw. H4: a `default: null` is treated as
absent (falls through to `examples[0]` → type-empty), never seeding null.

**Re-grade of the external library (Kernel cell, recorded 2026-09-23):**
```
props total = 412     raw BEFORE = 353  →  raw AFTER = 9      (344 reclassified, 85.7% → 2.2%)
components  = 47      grade BEFORE = 0 Ready / 47 Attention / 0 Blocked
                      grade AFTER  = 38 Ready / 9 Attention / 0 Blocked
```
**Remaining 9 Attention** — every one is a single **typeless prop** (declared with NO `type` key at
all — genuinely unclassifiable, not a nullable union), so raw is correct:
`drupalbutton.value, button.value, toggle.value, textinput.value, checkbox.value, radiobutton.value,
select.value, combobox.value` (a `value` prop) and `card.media` (a `media` prop). Advice: a
library-schema fix (type those props) or accept — classed **library schema advice / accepted**, size S.

### G2 — never-blank labels
`PropShape::humanizeName()` humanises snake/kebab/**camelCase**/acronym-runs → Title Case
(`userActionsMenuHtml` → "User Actions Menu Html", `HTMLContent` → "HTML Content"). The prop-descriptor
label uses it; the component label (`MosaicManifestBuilder::componentLabel`) is `label` → SDC `name` →
humanised local id — so a blank palette entry is impossible.

### G3 — palette category
`buildComponentEntry` category = explicit `category` → SDC `group` → **provider** (an adopted library
groups under its provider, not the "Other" bucket).

### G5 — media-object → media field
`PropShape` maps an object with a `src` (or a `url` + an image corroborator alt/width/height/srcset), or
a `$ref` naming image/media, to the **media** kind. On the external library: `card.image` → media
(recorded). A `url`+`title` object stays raw (a link shape, not media).

### G8 — SO-7 reason for CSS-in-JS / shadow DOM
`MosaicGlobalStylesScanner::scanComponent` now returns a `reason`. A component with no co-located CSS
but a custom-element twig (or a co-located `.js`) reports **"styles in JavaScript (shadow DOM) —
isolated from the page"** — the libraries page reassures instead of a silent reasonless FALSE. (The
external library is entirely shadow-DOM styled → this is its result.) The scanner remains blind to a
global stylesheet declared via `*.libraries.yml` (gap G8 note carried; harmless for this library).

### R9 — core ^11.3 (#attributes) + F-109 (build script)
- `mosaic.info.yml`: `core_version_requirement: ^11.1 || ^12` → **`^11.3 || ^12`** (the core component
  element merges `#attributes` from 11.3). Kernel cell renders an adopted component
  (`olivero:teaser`) via `#type => component` with an Attribute bag and asserts the attribute reaches
  the markup.
- **F-109:** `js/package.json` `build` referenced a non-existent `vite.bundles.config.ts`; now
  `vite build --config vite.builder.config.ts && vite build --config vite.frontend-editor.config.ts`.
  `npm run build` proven: `dist/builder.js 5845c8db… · dist/frontend-editor.js e5d4d604…` — **identical
  across two consecutive rebuilds** (deterministic); byte-identical to the served bundles (no JS source
  changed this pass).

### Cells
Unit: `PropShapeTest` (G1 union forms, G5 media, G2 humanizeName), `MosaicPropShapeRegistryTest`
(G2 camel label + never-blank, H4 null→type-empty), `MosaicGlobalStylesScannerTest` (G8 shadow-DOM +
plain-no-reason). Kernel: `ExternalLibraryReadinessTest` (R9 #attributes, G2/G3 label+category,
env-gated «ext» re-grade + G5).

### Gates
Kernel+Unit **3103 / 0** (8632 assertions; 1 pre-existing risky-test warning + 7 D11.3 deprecations; the sole failure — the `Sprint50SmokeTest` cell that ENFORCED the old phantom `vite.bundles.config.ts` build script — was updated to assert the real F-109 configs, fixed + re-verified) · phpcs **0 errors** (changed files) · phpstan **0 errors** (changed src) ·
oracles **REGION 14e6cb9c…3954 + STYLE b7756795…ca982 4354 10** IDENTICAL before==after · dist
**1.0.64 → 1.0.65** (builder `5845c8db`, frontend-editor `e5d4d604`, renderer `9c7f9320`
byte-identical; served==built; deterministic rebuild). Ship count 63 (rider/build-pass; Arun commits).

**STOP — CHECKPOINT-1 filed. P2 (G9 canvas-hydration proof) next.**

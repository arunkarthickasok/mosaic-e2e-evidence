# REPORT — CP-ADOPT-7R: composition teardown + owned regression sweep (report-only; ship #47 HELD)

**Baseline:** ship #46 `a36f028` + the uncommitted CP-ADOPT-7 set (ship #47, HELD). Mosaic git
READ-ONLY; nothing staged; no dev DB/config writes. The external library («ext», an adopted SDC
design-system) is **enabled in Mosaic by Arun** — left enabled. Nodes are never saved.

> **NAMING BAN.** The library is **"the external library" / `«ext»`** everywhere; components are named
> by **display label** (Card, Accordion, …). Its public docs URL is read from `$MOSAIC_EXT_DOCS_URL`
> and never written here.

**Arun's findings (ledgered verbatim; tally 96–100, one per finding):**
- **WC#96** — Accordion: no title / no body / no "add more".
- **WC#97** — Card: shows a default image.
- **WC#98** — only one half-width Card; no multi-card row.
- **WC#99** — front-end styling off.
- **WC#100** — owned fields regressing with «ext» on.

**First read (decisive):** with «ext» ON, node/780 (owned components, anonymous) shasums are
**IDENTICAL to baseline** — REGION `14e6cb9c…3954`, STYLE `b7756795…ca982 4354 10`. So the anon
FE render of owned components is byte-identical with «ext» enabled. That relocates two findings:
**WC#100 is a BUILDER/panel-side regression** (not FE render), and **WC#99 is the «ext» components'
own global assets not attaching** (not owned-style drift).

---

## §1 — OWNED REGRESSION SWEEP

### 1.1 Automated gates (with «ext» ON)
- **Kernel+Unit 3107 / 0** (8659 assertions; 3 env-gated «ext» skips; 1 pre-existing warning + 7 D11.3
  deprecations). · **Vitest 654 / 1** (B-101, pre-existing). · tsc/phpcs clean.
- **Oracles with «ext» ON == baseline:** REGION `14e6cb9c…3954`, STYLE `b7756795…ca982 4354 10`. The
  anon FE render of owned components is **byte-identical** with the external library enabled.

### 1.2 WC#100 "owned fields regressing" — NOT REPRODUCED (owned path is healthy)
Headed, «ext» enabled, on node/993 (no save):
- Builder **mounts fully**; `0` page errors from the adapter. Owned **Heading** places → full panel
  (Text, Level h1–h6, Alignment, breakpoint fields, Data Sources, Padding, Space-after, token
  overrides); typing into the text field **landed in the transient layout**; enum selects correct.
  Owned **Columns** places → panel (Column count, gap, Bind Column 1–4). Place → panel → field-edit →
  enum **all work with «ext» on**.
- The only console error on load is a **malformed `mosaic_intelligence` URL** (`https://api/…/scores/
  node/993`) from a **disabled** module — **not «ext», not an adapter throw** (a separate latent bug,
  §1.4). The "one bad manifest entry breaks the whole builder" hypothesis is **false here**.
- **Verdict:** no owned-path regression. Kernel/Unit/Vitest green, shasums identical, owned panels
  work → **nothing to fix in the owned path this pass.** What reads as "the canvas is broken with «ext»
  on" is the adopted-preview bug in §1.3, which surrounds the (healthy) owned components with
  never-resolving adopted placeholders.

### 1.3 THE high-value finding — adopted Tier-B SSR preview never resolves on insert (mosaic-bug)
When an **adopted** «ext» component is inserted via the per-zone picker, its canvas preview stays
`div.mosaic-ssr-preview--loading` — **"«ext» X — loading…" forever**. The custom element IS defined in
the page (`customElements.get('«ext»-card') === true`), but the component's real markup + its slot drop
zones are **never emitted**: no `/api/mosaic/canvas/ssr` fetch is observed within 3.5 s of insert.
Owned/Olivero components in the same canvas DO render → this is specific to the adopted insert path.
**Suspected mechanism:** `tierBOptimistic.ts` schedules the SSR fetch only on a **data/prop change**,
not on the **initial insert** (the WC#88 setData-append path lands the child but never kicks its first
SSR). This single bug **cascades into every B/C red**: no rendered element (WC#99 on canvas), no slot
drop zones (so WC#96 "add item" and all slot-based components are unusable in the builder), no on-canvas
styling. It is a self-contained **Mosaic bug** (not a composition-model question) — **recommended as the
first fix once the reviewer rules** (see §3); NOT fixed this pass per the report-only / do-not-fix stance
and STOP-for-ruling.

### 1.4 Secondary: malformed `mosaic_intelligence` scores URL
Builder load fires `net::ERR_NAME_NOT_RESOLVED` for `https://api/mosaic/intelligence/scores/…` — the
base host isn't resolved (produces `https://api/…`). The module is disabled, so it's harmless today,
but it's a real URL-construction bug worth a fast follow (not «ext»-related, not owned-regression).

### 1.5 Owned regressions: found 0 / fixed 0
The sweep found **no owned regression**; owned components are healthy with «ext» enabled (gates green,
shasums identical, panels work). No owned fix was required this pass.

<!-- SECTION1 -->

---

## §2 — TEARDOWN: the COMPOSITION MODEL (47 rows)

**Sourcing:** all from the shipped code/config (component.yml, twig, ESM, the library's example-site
recipe + Canvas submodule + example theme). `$MOSAIC_EXT_DOCS_URL` was **unset** → no public docs
fetched (the code teardown stands on its own). Confidence: `[A]` = twig-slot deep-read; `[S]` =
first-hand grep of labels/status/variants + the full `libraryOverrides.dependencies` graph + the
example-theme repeater templates; `[I]` = inferred from the `[S]` graph.

### 2.1 Global assets — the decisive WC#99 finding
- The library ships **one base library `«ext»/«ext»-full`** — a **JS-only ES-module bundle** with all
  55 `customElements.define(...)`. It is attached **globally** via the module's `.info.yml`
  `libraries:` key (Drupal auto-attaches it to **every** page) — there is **no `.module` /
  hook_page_attachments**. Each component's `libraryOverrides` re-marks its own ESM `type: module` and
  declares deps on sibling `core/components.«ext»--<other>` libraries.
- **All CSS lives INSIDE the JS, encapsulated in Shadow DOM.** The module ships **no CSS file, no
  fonts, no icon SVGs**. Component styling reads design tokens as `var(--«ext»-*, <hardcoded
  fallback>)`; icons are shipped as JS chunks; the brand font is only a CSS-var fallback *name*.
- **WC#99 cause:** the full visual layer — the design-token theme, the brand font, the icon font — is
  shipped by the library's **example THEME** (`…-full.min.css` + a font-icon library), **NOT by the
  module**. A Mosaic site that enables the *module* gets the Shadow-DOM components with **fallback
  tokens, no brand font, no icon font** → "styling off." The base ESM loads (global `.info.yml`), so
  the elements upgrade, but the token/font/icon layer is absent. The composition contract's
  `global_libraries` (§3d) must point at that theme-shipped asset layer (or the author must install
  it) — this is a **library-packaging gap**, not a Mosaic render bug.

### 2.2 Paragraphs + Canvas — the composition model the SDCs DON'T encode
The library's own authoring model lives in its **Paragraphs recipe**, not the SDC metadata:

| Container | field (cardinality) | allowed child | → SDC slot |
|---|---|---|---|
| Page | `field_frames` (**-1**) | faqs, tabbed_content, cards | frame wrappers |
| Cards | `field_cards` (**max 3**) | card only | grid → Card ×N |
| FAQs | `field_faqs` (**-1**) | faq item only | Accordion `items` |
| Tabbed content | `field_tabs` (**max 10**) | tab only | Tab group `tabtabpanels` |

**Key insight:** each SDC container exposes **one slot that receives a pre-rendered blob**
(`accordion.items`, `tabgroup.tabtabpanels`); the **repeater semantics, cardinality caps, and
child-type allow-lists live in the Paragraph field config, NOT in the SDC.** That is exactly the layer
Mosaic must supply itself (§3). The **Canvas submodule** replaces only **Card** with a version that has
a **structured image `$ref` with a REAL default image** (a bundled 1600×900 jpg) + rich-HTML props +
named authored slots — **and NO parent→child restriction metadata anywhere** (no `.canvas.yml`, no
`allowedComponents`). **WC#97 cause:** that Canvas card's default image is an `examples`/`default`
preview that leaks as saved content.

### 2.3 Compositional families (9 true repeaters — container accepts exactly one child type, many)
Accordion→Accordion item · Tab group→Tab+Tab panel · Dropdown menu→Dropdown item · Icon list→Icon list
item · Process list→Process list item · Stepper→Step · Vertical nav→Vertical nav group · Checkbox
group→Checkbox · Radio group→Radio. **Card grid is a Paragraph concern (max 3), not an SDC child-slot**
(WC#98). Landmarks (Global header/footer, UNav) have generic untyped slots. Form leaves (Text input,
Select, …) *use* Label/Icon/Error internally (not authored children).

### 2.4 COMPOSITION MODEL — 47 rows
Universal (stated once): global-assets for every row = `«ext»/«ext»-full` (global via `.info.yml`) +
auto-attached `core/components.«ext»--<self>` + its declared sibling deps. **No component declares a
`required:` prop; nearly every value is an `examples:` PREVIEW** — only **Card** and **Drupal button**
carry a real `default:`. Labels are the display roles (org prefix stripped per the naming ban).

| # | component | role | requires-parent | accepts-children (+card.) | repeater? | preview-default? | variants |
|---|---|---|---|---|---|---|---|
|1|Accordion|container|—|Accordion item (many)|**YES**|preview|headingLevel h2–h6|
|2|Accordion item|item|**Accordion**|rich heading+body|no|preview|headingLevel|
|3|Alert|leaf|—|— (uses button/icon)|no|preview|type{info,success,warning,danger,emergency}|
|4|Avatar|leaf|—|—|no|preview|—|
|5|Back to top|leaf|—|—|no|preview|—|
|6|Badge|leaf|—|—|no|preview|size, intent, variant|
|7|Breadcrumbs|leaf (data)|—|link items (data, many)|data|preview|size|
|8|Button|leaf|—|—|no|preview|type, variant{filled,outline,ghost,text}|
|9|Card|container|—|body + footer slot|no|**REAL default (image)**|headingLevel, target, inset, elevated|
|10|Checkbox|item/leaf|Checkbox group (opt)|—|no|preview|size|
|11|Checkbox group|container|—|Checkbox (many)|**YES**|preview|size|
|12|Combobox|leaf|—|option data|no|preview|width|
|13|Datepicker|leaf|—|—|no|preview|width, inverted|
|14|Divider|leaf|—|—|no|preview|inverted, subtle|
|15|Dropdown menu|container|—|Dropdown item (many)|**YES**|preview|position|
|16|Dropdown item|item|**Dropdown menu**|— (defined in parent ESM)|no|preview|—|
|17|Drupal button|leaf|—|—|no|**REAL default (variant)**|type, variant, size, circle, fullWidth|
|18|Error message|leaf|—|—|no|preview|— (⚠ leaks Lit binding in twig)|
|19|Global footer|container (landmark)|—|generic menu slot (many)|generic|preview|—|
|20|Global header|container (landmark)|—|generic menu + user-actions (many)|generic|preview|—|
|21|Icon|leaf|—|—|no|preview|size, flip, rotate (⚠ twig hardcodes icon lib)|
|22|Icon list|container|—|Icon list item (many)|**YES**|preview|divider|
|23|Icon list item|item|**Icon list**|rich content + secondary slot|no|preview|—|
|24|Label|leaf|—|description slot|no|preview|flag{required,optional}, inverted|
|25|Modal|container|—|body + footer slots (generic)|no|preview|width|
|26|Pagination|leaf (data)|—|—|no|preview|—|
|27|Process list|container|—|Process list item (many)|**YES**|preview|size|
|28|Process list item|item|**Process list**|rich content|no|preview|—|
|29|Radio|item/leaf|Radio group (opt)|—|no|preview|size|
|30|Radio group|container|—|Radio (many)|**YES**|preview|size|
|31|Select|leaf|—|option data|no|preview|width|
|32|Skip nav|leaf|—|—|no|preview|—|
|33|Step|item|**Stepper**|rich content|no|preview|—|
|34|Stepper|container|—|Step (many)|**YES**|preview|—|
|35|Tab|item|**Tab group**|—|no|preview|—|
|36|Tab group|container|—|Tab + Tab panel (many)|**YES**|preview|—|
|37|Table|leaf (data)|—|—|no|preview|—|
|38|Tab panel|item|**Tab group**|rich content|no|preview|—|
|39|Text area|leaf|—|—|no|preview|resize, width|
|40|Text input|leaf|—|—|no|preview|type{email,number,…}, width|
|41|Toggle|leaf|—|—|no|preview|size|
|42|Tooltip|leaf|—|wraps a target|no|preview|position|
|43|UNav footer|leaf (landmark)|—|— (self-contained)|no|preview|—|
|44|UNav header|container (landmark)|—|generic slots + search|generic|preview|—|
|45|Vertical nav|container|—|Vertical nav group (many)|**YES**|preview|headingLevel|
|46|Vertical nav group|item|**Vertical nav**|nav links / nested|nested|preview|—|
|47|Video|leaf|—|—|no|preview|size, loading|

**Role tally:** ~14 containers (incl. landmarks) · 10 items · rest leaves · **9 true repeaters**.

### 2.5 GAP list vs Mosaic today
| # | Gap | Rows affected | Contract clause |
|---|---|---|---|
| C1 | **Repeaters** (container + one-child-type + cardinality) not modelled — Mosaic shows a bare drop zone, no per-item fields / "add item" | 9 repeater families (WC#96, WC#98) | §3b |
| C2 | **Requires-parent** items droppable at top level (Accordion item, Card, Tab, Step) with no wrap/refuse | 10 item rows | §3c |
| C3 | **Cardinality caps** (Card grid max 3, Tabs max 10) live only in Paragraph config — Mosaic has none | Card, Tab group | §3a/b |
| C4 | **Global asset layer** (tokens/font/icons) ships in the example THEME, not the module — «ext» renders unstyled | all (WC#99) | §3d |
| C5 | **Preview defaults leak as content** (Card default image; example prop values) | Card + any example-valued prop (WC#97) | §3e |
| C6 | **Child-in-parent-ESM** (Dropdown item, Icon list item) can't render without the parent's library loaded | 2 rows | §3d (attach parent lib) |
| C7 | **Library packaging bugs** (twig leaks Lit `?showDivider=${…}`; Icon twig hardcodes the icon lib) — upstream fixes | Error message, Icon | library advice |

<!-- SECTION2 -->

---

## §3 — ARCHITECTURE PROPOSAL (report-only; reviewer rules): the Library Composition Contract

The teardown (§2) shows the external library is **compositional**: it has containers (Accordion, Tab
group, Card group) that own item children (Accordion item, Tab/Tab panel, Card) with a cardinality
("add another"), it ships a **global/base stylesheet + tokens** that must be present for any component
to look right, and its component `examples` are **previews, not content** (WC#97's default image). Mosaic
today adopts each SDC as a flat component with free-content slots; it has no model for *containers +
repeatable items + required parents + library-global assets + preview-only defaults*. The **Library
Composition Contract** closes that gap. It is deliberately **source-ordered** so an SDC that declares
its own rules needs no Mosaic-side heuristics, and a library that ships an adoption profile gets exact
behaviour, with teardown heuristics only as a floor.

### (a) Source order for composition metadata (most-authoritative first)
1. **SDC slot metadata** — `slots[x].allowed` / a `min`/`max` (cardinality) / `required` in the
   `component.yml` (+ Mosaic's sidecar `.mosaic.yml` which may ADD rules, never redefine slot ids —
   H7). This is the truth when present.
2. **Adoption profile YAML shipped by the library** — `<provider>.mosaic-adopt.yml` (read at discovery,
   cached with the library cache tag). Shape:
   ```yaml
   containers:
     accordion: { item_slot: items, item_type: accordion_item }
     tab_group: { item_slot: tabs, item_type: tab, panel_slot: tabpanels, panel_type: tabpanel }
   items:      [accordion_item, tab, tabpanel, card]        # role=item
   repeaters:
     accordion.items: { child: accordion_item, min: 1, max: null }
   requiresParent:
     accordion_item: accordion
     card: [card_group, region]          # card may sit in a card group OR the page region
   global_libraries: ['«ext»/base']       # must load on any page/canvas using the library
   preview_defaults: true                 # examples are previews, never saved props
   thumbnails: { card: 'path/card.png' }
   ```
3. **Heuristics from the teardown (last resort)** — infer role/parent/cardinality when neither (1) nor
   (2) is present (e.g. a slot that accepts exactly one child type ⇒ repeater; a component whose twig
   requires a parent class ⇒ requiresParent). Always the floor, never overriding (1)/(2).

### (b) REPEATER UX
A slot that accepts **exactly one child type** (from any source above) is rendered in the panel as an
**inline item list**, not a bare drop zone: each item shows its own fields (e.g. Title / Body), with
**+ Add item**, **reorder** (drag/keyboard), and **remove**. Storage is UNCHANGED — each item is an
ordinary child component instance in the parent's slot (`nodes[parent].slots[x] = [childId, …]`), so
save/round-trip/fallback all work as they do today. This directly answers **WC#96** (Accordion gets a
title/body-per-item list + "add more") and **WC#98** (a Card group's slot is a repeater of Cards → a
real multi-card row).

### (c) REQUIRES-PARENT
Dropping an **item** (Accordion item, Card, Tab) at the top level (the page region) is either:
- **auto-wrapped** in its container — dropping a Card at top level creates a Card group (or the
  ruled default container) and places the Card inside; OR
- **refused with the reason** — "A Card must live inside a Card group" (author-grade), when auto-wrap
  is ambiguous. Ruling needed: auto-wrap vs refuse (recommendation: **auto-wrap** for a single
  unambiguous container, **refuse** when >1 container could hold it). The **palette lists containers
  first** (then items grouped under them), so the natural drop is the container.

### (d) GLOBAL ASSETS (library-level attach)
A **library-level attach rule**: whenever ANY «ext» instance is present — on a rendered page OR in the
builder canvas / iframe / FE dialog — the library's `global_libraries` (base CSS, tokens, fonts, icons)
attach **once**. Server: the page/SSR render adds the global library to `#attached` for any adopted
instance; the G9 harvest already resolves + ships per-component ESM — extend it to also emit the
library-global assets. Client: `mosaicAttach` already dedupes by URL, so "once" is free. This answers
**WC#99** (the components were unstyled because only the per-component ESM loaded, not the base
CSS/tokens the shadow DOM reads via `var(--«ext»-*)`).

### (e) PREVIEW DEFAULTS
A component's `examples` (H4) fill the **canvas preview only** — they are shown so an un-configured
component isn't blank, but they are **never written to saved props**. On save, an untouched
example-valued prop serializes as its type-empty (or is omitted), not the example. This answers
**WC#97** (the Card's default image is an example leaking as content). Requires a "value is the
example, not author-set" marker in the panel state (dirty-tracking per prop) so save can drop
untouched examples.

### (f) STYLING PARITY
Once (d) attaches the global assets on both surfaces, **page == canvas computed styles** for an «ext»
component (measured by a style-shasum of the component's own region on the page vs the canvas). This is
the acceptance oracle for WC#99's fix and becomes a standing regression row.

### Options + trade-offs (reviewer rules)
| Area | Option A | Option B | Recommendation |
|---|---|---|---|
| Metadata source | SDC/sidecar only (no profile) | + `<provider>.mosaic-adopt.yml` | **B** — the library can declare exact rules; heuristics stay a floor. |
| Requires-parent | Always refuse | Auto-wrap single / refuse ambiguous | **Auto-wrap single**, refuse ambiguous (author-grade reason). |
| Where the profile lives | Mosaic ships per-library profiles (helper module `mosaic_adopt_«ext»`) | The library ships its own profile | Support **both**: Mosaic reads a profile from EITHER the library OR a helper module; ship a helper for «ext» now, upstream it later. |
| Global assets | Author adds the base library by hand | Auto-attach per instance | **Auto-attach** (d). |
| Preview defaults | Keep examples as saved defaults | Preview-only + dirty-tracking | **Preview-only** (e). |

**Helper module vs library-ships:** the **repeater UX, requires-parent, global-asset auto-attach,
preview-default dirty-tracking, and the profile READER** are Mosaic core (they apply to any adopted
library). The **profile DATA** (`<provider>.mosaic-adopt.yml`) + thumbnails should ship with the
library; until then, a thin **helper module** (`mosaic_adopt_«ext»`) carries the «ext» profile so no
contrib fork is needed.

### Author guidelines (one page, draft)
1. Turn the library ON in **Component libraries**; grade what you'll use.
2. Build with **containers** (Accordion, Tab group, Card group) from the palette — they list first.
3. Inside a container, use **+ Add item** to add Cards / Accordion items / Tabs; reorder with the
   handle; each item has its own Title/Body fields.
4. A component that shows an example (an image, sample text) is showing a **preview** — replace it, or
   it saves empty. Previews never publish.
5. If you drop an item on the bare page, Mosaic wraps it in its container (or tells you which container
   it needs).
6. The library's look loads automatically wherever you use it — page, canvas, preview.
7. Owned Mosaic components and the library's components coexist; neither restyles the other.

---

## §4 — PER-COMPONENT LIFECYCLE REDS (top 12; written, run, expected red — NOT fixed this pass)

Headed, «ext» ON, in the builder, no save. Each component **places** and gets a Mosaic panel; the
**save → render → behaviours** steps are **not run** (no dev writes). The **earliest red is uniform**:
the adopted canvas SSR-preview stays "— loading…" (the §1.3 bug), so the element/slot markup is absent;
slot-based components add a **composition** gap (the slot drop zone never appears, so items can't be
added — WC#96).

| Component | place | panel | earliest red | cause class |
|---|---|---|---|---|
| Accordion | ok | slot "Accordion Items" | canvas "loading…", no slot dropzone → can't add items | mosaic-bug + composition |
| Card | ok | slots Preheading/Footer | "loading…"; default image via prop `default` | mosaic-bug; **defaults** |
| Button | ok | 8 scalar/bp controls | "loading…", element absent | mosaic-bug |
| Tab group | ok | slots Tabs/Tab panels | "loading…", no slot dropzone | mosaic-bug + composition |
| Alert | ok | 8 controls | "loading…" | mosaic-bug |
| Card (as hero) | ok | slots Preheading/Footer | "loading…"; default image | mosaic-bug; defaults |
| Icon list | ok | slot "Icon List Items" | "loading…", no slot dropzone | mosaic-bug + composition |
| Table | ok | 8 controls | "loading…" | mosaic-bug |
| Breadcrumbs | ok | slot "Items" | "loading…", no slot dropzone | mosaic-bug + composition |
| Global header | ok | slot "Menu Content" | "loading…", no slot dropzone | mosaic-bug + composition |
| Global footer | ok | slot "Menu Content" | "loading…", no slot dropzone | mosaic-bug + composition |
| Vertical nav | ok | slot "Menu…" | "loading…", no slot dropzone | mosaic-bug + composition |

**Cause-class tally (12):** mosaic-bug **12/12** (the SSR-preview-never-resolves bug, §1.3) · composition
**7/12** (slot-based: no dropzone → no add-item) · defaults **2/12** (Card default image, WC#97) ·
assets **0** *in-builder* (the base ESM loads; the token/font/icon layer gap — WC#99/C4 — bites on the
rendered page, which was not-run here). Films: `cp-adopt-7/r-teardown-sweep/` (`B-accordion.png`,
`B-card.png`, `B-card-row-attempt.png`, `B-fe-styling.png`, `A-owned-panel.png`).

**Not fixed this pass** (per the charter): these reds are unblocked by (1) the §1.3 SSR-on-insert fix
(mosaic-bug — unblocks all 12), then (2) the ruled composition contract (§3b/c repeaters + requires-
parent — the 7 composition reds), (3) §3e preview-defaults (the 2 defaults reds), (4) §3d global assets
(WC#99 on the page).

<!-- SECTION4 -->

---

## Summary (paste figures)
- **Owned regressions found / fixed: 0 / 0** — owned path healthy with «ext» ON (Kernel 3107/0 · Vitest
  654/1 · shasums IDENTICAL · owned place/panel/edit/enum all work). WC#100 **not reproduced**.
- **Composition-model rows: 47** (≈14 containers incl. landmarks · 10 items · rest leaves · **9 true
  repeaters**).
- **Top gap classes (counts):** `mosaic-bug` **1** (the SSR-preview-never-resolves-on-insert bug, §1.3
  — root of **12/12** lifecycle reds) · `composition` **3 gaps** (C1 repeaters → 9 families; C2
  requires-parent → 10 item rows; C3 cardinality caps → 2) · `assets` **1** (C4 token/font/icon layer
  ships in the theme not the module → all «ext» rows, WC#99) · `defaults` **1** (C5 preview leak → Card
  image + example-valued props, WC#97) · `packaging` **2** (C6 child-in-parent-ESM; C7 twig bugs).
- **Lifecycle reds per component: 12 / 12** red at render (all place + panel OK); 7/12 add a composition
  gap; 2/12 a defaults gap; save/render/behaviour steps not-run (no dev writes).
- **Reds that stayed red (none fixed — report-only, STOP for ruling):** the §1.3 adopted-SSR-on-insert
  bug (recommended #1 fix); WC#96/#98 (repeater UX — §3b); WC#97 (preview defaults — §3e); WC#99
  (global token/font/icon layer — §3d); the malformed `mosaic_intelligence` URL (§1.4, fast follow);
  pre-existing B-101 (Vitest) + B-102 (phpstan-drupal drift).

### Ordered fix plan (recommended to the reviewer)
1. **§1.3 SSR-on-insert** (mosaic-bug, self-contained) — schedule an adopted component's first
   `/api/mosaic/canvas/ssr` on insert; unblocks all 12 lifecycle reds + WC#99-on-canvas + the slot
   dropzones (WC#96/#98 preconditions). **Can be ruled independently — no architecture change.**
2. **§3 Library Composition Contract** (needs the ruling): §3a profile source-order → §3b repeater UX
   (WC#96/#98) → §3c requires-parent → §3d global-asset auto-attach (WC#99) → §3e preview defaults
   (WC#97) → §3f styling parity.
3. Library-packaging advice upstream (C4 token/font/icon library; C7 twig bugs).

**STOP — report-only. Ship #47 stays HELD. Awaiting the reviewer's ruling on the Library Composition
Contract (§3) before the composition build; the owned regression (§1) is the only fix this pass.**

---

## CHECKPOINT-1 — CP-ADOPT-7R P1: SSR-on-insert fix + global-asset attach (BUILT)

**Ledger:** §3 ruled (source-order B; core-vs-helper split; auto-wrap-single/refuse-ambiguous; global
auto-attach; preview-only defaults + dirty tracking). WC#100 closed **not-reproduced** (§1.2). Tag
impact ledgered: **+ ~1 week** for the ADOPT-7R composition work. Mosaic git READ-ONLY; «ext» stays ON;
no nodes saved; the helper module ships OUTSIDE the mosaic tree (Arun's site repo).

### 1 — SSR-ON-INSERT (§1.3 mosaic-bug) — FIXED
**Cause (file:line):** the ONLY thing that scheduled a Tier-B/adopted component's SSR was
`makeOptimisticResolveData` → `scheduleSsr` in `js/src/builder/tierBOptimistic.ts:151-191`, and Puck
runs `resolveData` **only on a field-onChange, never on initial mount** (documented in the file header,
`tierBOptimistic.ts:15-20`). So a freshly INSERTED adopted node (picker / drag / bind) never scheduled
its first SSR → its canvas preview sat at `mosaic-ssr-preview--loading` forever.
**Fix:** new `ensureSsr(id, type, props, basePath)` (`tierBOptimistic.ts`) schedules the first SSR
once when there's no result AND no fetch in flight (deduped by the abort map). A tiny mount-effect
component `EnsureSsr` (`MosaicPuckAdapter.ts`) is rendered inside BOTH loading skeletons
(`buildTierBRenderer` props-only + `buildAdoptedRenderer` slotted) and calls it on mount — so insert,
drag, bind AND load all resolve. `buildTierBRenderer` gained a `basePath` param (both call sites pass
the captured base path).
**Cells (Vitest `tierBOptimistic`, +5):** insert (no html) → exactly 1 SSR; drag path → same;
already-has-result → no fetch; two mounts before the fetch → 1 request (in-flight dedupe); ensureSsr +
an unchanged resolveData → no duplicate. **Headed (RESOLVED):** inserting an «ext» Card via the picker fires one `POST /api/mosaic/canvas/ssr` (200) on mount; the `mosaic-ssr-preview--loading` placeholder is gone by the first 500 ms poll and the real element renders — no "loading…" persists (film `cp-adopt-7/p1-checkpoint1/1-ssr-resolved.png`).

### 2 — GLOBAL-ASSET ATTACH (§3d) — BUILT
`MosaicRenderer::providerGlobalLibraries(provider)` reads the adoption-profile STUB
`<provider>.mosaic-adopt.yml` (key `global_libraries`) from a helper module `mosaic_adopt_<provider>`
or the provider's own module, **cached with the library cache tag** (a library toggle clears it; owned
providers → none). `renderSingleComponent` merges those globals (resolved to CSS/JS URLs, ESM
`type=module` preserved, deduped by src via `mergeAttachments`) into the SSR attachment delta, so
`mosaicAttach` loads them ONCE on the canvas (it already dedupes css/js by URL). Full profile semantics
(containers/repeaters/requiresParent/preview_defaults) land in P2.
**Helper module (OUTSIDE the mosaic tree, `web/modules/custom/mosaic_adopt_ext/`, untracked by mosaic;
Arun's site repo):** `mosaic_adopt_ext.info.yml` (deps: mosaic, the library) · `mosaic_adopt_ext.libraries.yml`
declaring `mosaic_adopt_ext/base` (depends on the library's shipped base ES-module bundle —
**copies nothing proprietary**) · `«ext».mosaic-adopt.yml` → `global_libraries: [mosaic_adopt_ext/base]`.
**What the helper's globals point at:** `mosaic_adopt_ext/base` → the library's own shipped base
ES-module bundle (all custom-element definitions + their shadow-DOM CSS, tokens read as
`var(--…, fallback)`). The brand **token/font/icon** layer ships in the library's example THEME, not the
module (§2.1/C4) — install that theme for full brand fidelity, or add it to `base` when it is packaged
as a module asset; the helper does not copy it.
**Cells (Kernel `AdoptGlobalAssetsTest`, 2):** an adopted component's SSR delta carries its provider
global CSS (fixture `adopt_fixture/adopt_base` → `adopt-base.css`) + the library name; an owned component
carries none. **Parity oracle:** new `scripts/qa/adopted-style-shasum.sh <url> <selector>` (§3f) — first baseline **`ed0ad566…3e48b`** — an «ext» Card resolved on the canvas is shape-styled by its shadow CSS (`display:block`, `box-sizing:border-box`, 16px/24px). **Caveat:** `font-family` resolves to the system-ui FALLBACK, not the brand font — the ESM globals attach but the token/font/icon layer ships in the library's example theme (C4), so full BRAND parity needs that theme (Arun's walk). Full page-vs-canvas parity with the helper enabled is Arun's walk (enabling
the helper is a config write).

### Gates
Kernel+Unit **3109 / 0** (8673 assertions; +2 AdoptGlobalAssets cells; 3 env-gated skips) · Vitest **659 / 1** (B-101; +5 ensureSsr cells) · tsc **clean** · phpcs
**0 errors** (changed) · phpstan MosaicRenderer **4 pre-existing** (0 new) · owned oracles **REGION
14e6cb9c…3954 + STYLE b7756795…ca982 4354 10** IDENTICAL (with «ext» ON) · dist **1.0.66 → 1.0.67**
(builder `4cf870ca`, frontend-editor `05738130`, renderer `9c7f9320` byte-identical; served==built).
Ship count 63 (build pass; folds into ship #47).

**STOP — CHECKPOINT-1 filed. P2 (profile reader full semantics + repeater UX) next.**

---

## CHECKPOINT-2 (P2 — profile reader, full semantics) — folds into ship #47

**Scope ruling (Arun, this pass): "Reader now, UX next pass."** Land the adoption-profile
reader (full parse / validate / cache) + extend the «ext» helper profile + Kernel cells +
the §1.4 fast-follow, fully gated. **The repeater-UX React build (§3b) is DEFERRED to its
own focused pass** — nothing UX-facing changed here; storage/render are untouched.

### §1.4 fast-follow — the malformed intelligence-scores URL (FIXED)
`js/src/builder/useLighthouseScore.ts` fetched `` `${basePath}/api/mosaic/intelligence/scores/…` ``.
`basePath` already ends in `/` (Drupal convention), so the extra leading slash produced
`//api/…` — a **protocol-relative** URL the browser resolves to host `api`
(`ERR_NAME_NOT_RESOLVED`), so the score panel silently never loaded on a root-install site.
Fix: drop the leading slash → `` `${basePath}api/mosaic/intelligence/scores/…` `` (matches every
other fetch in the file). **Cells:** the Vitest oracle previously used a `/drupal` (no trailing
slash) basePath that MASKED the bug; rewritten to two cells — root `/` → `'/api/mosaic/…'` +
`startsWith('//') === false`, and subdir `/drupal/` → `'/drupal/api/…'` (7/7). The PHP source-grep
smoke `Sprint60SmokeTest::testUseLighthouseScoreFetchesScoreEndpoint` asserted the OLD leading-slash
string (i.e. asserted the bug) — **retargeted** to `api/mosaic/intelligence/scores/` (the endpoint
path, not the slash); 46/46. This is an oracle-change I introduced by the fix, caught by the gate
and corrected — the only red in the full suite, now green.

### PART 1 — the profile reader (full semantics)
New `src/Sdc/MosaicAdoptionProfile.php` (`final`, DI: `@module_handler`, `@cache.default`,
`@mosaic.component_manager`; registered `mosaic.adoption_profile`). It reads
`<provider>.mosaic-adopt.yml` from the helper module `mosaic_adopt_<provider>` (or the provider's
own module) and parses **every** key into a typed shape: `containers{item_slot,item_type,
panel_slot?,panel_type?}`, `items[]`, `repeaters{"<component>.<slot>":{child,min:int|null,
max:int|null}}`, `requiresParent{item:[containers]}`, `global_libraries[]`, `preview_defaults:bool`,
`thumbnails{}`. **Source order (§3a, ruled B)** is honoured by the consumers (SDC/sidecar wins →
profile fills → heuristics floor); the reader is the "profile fills" source. **Validation:** every
LOCAL component id the profile names is checked against `componentManager->hasDefinition("$provider:$local")`
— an unknown id becomes a **warning** (surfaced on the libraries page), never a crash. **Cached**
`CACHE_PERMANENT` under `mosaic:adopt_profile:<provider>` with the library cache tag
(`MosaicComponentLibrary::cacheTagFor`) so a library toggle clears it. Owned / profile-less
providers return the EMPTY typed shape early (no I/O).

`MosaicRenderer::providerGlobalLibraries()` now **delegates** to the reader
(`$this->adoptionProfile->globalLibraries($provider)`) — the duplicated yaml/cache block from P1 is
removed; output is byte-identical (same YAML → same library list), so adopted rendering is unchanged.

**Kernel cells (`tests/src/Kernel/Adopt/MosaicAdoptionProfileTest.php`, 4 methods / 29 assertions):**
`testParsesEveryKey` (containers/items/repeaters typed with a null `max` preserved / requiresParent /
global_libraries / preview_defaults / thumbnails), `testUnknownComponentIdWarnsNotCrashes`
(the fixture's deliberate `not_a_real_component` warns; real ids do not), `testAccessors`,
`testOwnedProviderIsEmpty` (owned + non-existent provider → empty, no crash). Fixture
`tests/modules/adopt_fixture/adopt_fixture.mosaic-adopt.yml` extended to exercise every key +
the unknown-id path, naming-safely.

**«ext» helper profile extended** (`web/modules/custom/mosaic_adopt_ext/«ext».mosaic-adopt.yml`,
Arun's SITE repo — OUTSIDE the mosaic tree) with the 9 repeater families + requires-parent map:
```yaml
repeaters:
  accordion.items:                     { child: accordionitem, min: 1, max: null }
  tabgroup.tabs:                       { child: tab, min: 1, max: 10 }
  dropdownmenu.dropdownmenuitemshtml:  { child: dropdownmenuitem, min: 0, max: null }
  iconlist.items:                      { child: iconlistitem, min: 1, max: null }
  processlist.items:                   { child: processlistitem, min: 1, max: null }
  stepper.steps:                       { child: step, min: 1, max: null }
  verticalnav.menu:                    { child: verticalnavgroup, min: 1, max: null }
  checkboxgroup.options:               { child: checkbox, min: 1, max: null }
  radiogroup.options:                  { child: radiobutton, min: 1, max: null }
requiresParent:
  accordionitem: accordion
  tab: tabgroup
  tabpanel: tabgroup
  dropdownmenuitem: dropdownmenu
  iconlistitem: iconlist
  processlistitem: processlist
  step: stepper
  verticalnavgroup: verticalnav
```

### PART 2 — repeater UX (§3b) — DEFERRED (Arun's ruling)
Film frames (Accordion → +Add ×2 items; Card group → +Add ×3 = three-card row) are **N/A this
pass** — the React build (inline item-list panel, +Add/reorder/remove, min/max banner, owned-Tabs
unification, FE dialog parity, smoothness, Vitest + Kernel round-trip) is the scale of the Tabs
redesign and lands as its own focused pass. The `repeaters` + `requiresParent` data it consumes is
now present, validated, and cached.

### Gates
Kernel+Unit **3113 / 0** (8707 assertions; +4 AdoptionProfile cells; 3 env-gated skips, 1 warning;
the single full-run red was the §1.4 Sprint60 oracle, retargeted → re-run green) · Vitest **660 / 1**
(**B-101** only: `MosaicPuckAdapter.test.ts` still expects boolean→`{type:'checkbox'}` but the
adapter intentionally emits the Yes/No **radio** — Puck 0.21 has no checkbox field for props; stale
oracle, pre-existing, unrelated to this pass; +2 §1.4 useLighthouse cells → 661 total) · phpcs
**0 errors** (changed) · phpstan MosaicAdoptionProfile **0** + MosaicRenderer **4 pre-existing**
(B-102, 0 new) · owned oracles **REGION 14e6cb9c…3954 + STYLE b7756795…ca982 4354 10** IDENTICAL
(with «ext» ON) · dist **1.0.67 → 1.0.68** (builder `4cf870ca` → `a298662d` [§1.4 useLighthouse
fix]; frontend-editor `05738130` + renderer `9c7f9320` byte-identical; served==built).
**Adopted parity oracle:** NOT re-runnable this pass — no node persists an adopted component
(`node__field_mosaic_layout LIKE '%«ext»:%'` → empty) and the helper is disabled (enabling it is a
config write = Arun's walk), so there is no live subject; adopted rendering is behavior-preserved by
construction (reader delegation returns the identical global-libraries list). Baseline `ed0ad566…3e48b`
stands; full page-vs-canvas parity remains Arun's walk (as CHECKPOINT-1 flagged).
Ship count 64 (build pass; folds into ship #47).

**STOP — CHECKPOINT-2 filed. Next pass: repeater UX (§3b) React build; then P3 = requires-parent
enforcement (§3c) + preview defaults (§3e).**

---

## CHECKPOINT-3 (P2b — repeater UX §3b: MODEL + PANEL) — folds into ship #47

The §3b repeater UX, built + verified in two additive layers. Both are green; the
owned-Tabs field-UNIFICATION and the headed films are honestly deferred (below) —
neither is verifiable/filmable under this pass's constraints («ext» ON, helper NOT
enabled, no config writes, no saved Arun nodes).

### PART 1 — MODEL (the manifest emits a `repeater` per single-child slot)
A slot whose rules resolve to EXACTLY ONE child type is a repeater. Resolution
(§3a source order B): the **adoption profile** `repeaters['<component>.<slot>']`
(child + cardinality the library declares) WINS; the **heuristic floor** is a slot
whose `allowed` list is exactly one child type (so an owned single-child slot is a
repeater with no helper). Applied LAST in `buildSlotDescriptors` so identity +
sidecar rules are untouched. Storage unchanged — additive metadata only.
- `src/Sdc/SlotDescriptor.php` — `?array $repeater` ctor field + `withRepeater()` +
  `toArray()` emits `repeater` only when set (and `withRules()` preserves it).
- `src/Service/MosaicManifestBuilder.php` — injects `@mosaic.adoption_profile`;
  `resolveRepeater()` (profile → single-`allowed` heuristic) sets it per slot.
- `mosaic.services.yml` — `mosaic.manifest_builder` gains `@mosaic.adoption_profile`.
- `js/src/shared/types/schema.ts` — `SlotDescriptorJson.repeater?: {child,min,max}`.
- **Kernel `RepeaterDescriptorTest` (5 cells):** profile-sourced (`adopt_widget.content`
  → `{child: adopt_widget_v2, min:1, max:3}`); heuristic single-`allowed`; heuristic
  honours slot min/max; multi-`allowed` is NOT a repeater; unrestricted slot is NOT a
  repeater. The 3 `new MosaicManifestBuilder(...)` sites (2 unit, 1 kernel) updated.

### PART 2 — PANEL (`MosaicRepeaterField`: inline item list in the rail)
`js/src/builder/fields/MosaicRepeaterField.tsx` — one row per child, each showing
its first non-empty text prop as summary (tags stripped, `id`/`*Format` skipped,
truncated), with:
- **+ Add item** → the WC#88 shared insert path (`insertIntoSlot` + `getComponentDefaults`),
  the sole child type mapped to Puck's colon-free key;
- **reorder** — ↑/↓ buttons (ends disabled at the boundaries) + **ArrowUp/ArrowDown**
  on a focused row + an HTML5 drag handle → `reorderInSlot`;
- **remove** — min-guarded (disabled + no-op at the floor) → `removeFromSlot`;
- the **live min/max banner** with the EXACT existing wording (`Requires at least N
  item(s) — c/N` · `At most N allowed — c/N`), Add disabled at the ceiling;
- **row → canvas focus sync** — clicking a row → `selectSlotItem` (Puck `setUi`
  itemSelector on `<parentId>:<slotName>`).
New `tierBOptimistic` helpers mirroring `insertIntoSlot`: `readSlotItems`,
`reorderInSlot`, `removeFromSlot`, `selectSlotItem` (all deep-clone + history-recorded
`setData`). **DROP-PROOF:** the adapter adds the item list as a `_mosaic_repeater__
<slot>` **custom** field ALONGSIDE the `type:'slot'` field — the slot field, the canvas
drop zone, and the Puck data model are untouched; the synthetic key is never written
(no `onChange`, not in defaultProps) so it adds no saved prop.
- `js/src/builder/MosaicPuckAdapter.ts` — `repeaterFields` built beside `slotFields`
  (`CustomFieldRender` supplies the instance `id` = parentId), spread before slots.
- **Vitest (14 cells):** `MosaicRepeaterField.test.tsx` (rows/summary, +Add forwards
  child+defaults, remove min-guard on/off, up/down + keyboard reorder, min & max
  banners exact wording, Add disabled at max, row→select, empty-render guard,
  `summaryOf` 3 cells) + `MosaicPuckAdapterRepeater.test.ts` (a repeater slot emits
  BOTH the slot field AND the repeater field = DROP-PROOF; a non-repeater slot does not).
- **FE-dialog parity:** automatic — `FrontendBuilderDialog` builds the panel from the
  SAME `MosaicPuckAdapter.toConfig`, so the field flows to the FE dialog (frontend-editor
  bundle hash changed accordingly).

### DEFERRED (honest walk — not built/filmable this pass)
- **Owned-Tabs field UNIFICATION** ("the UI is one component"): owned Tabs stores tabs
  as an **array PROP** (`sets` via `field_types: repeatable` → Puck array field), NOT
  slot children — so routing it through `MosaicRepeaterField` means teaching the field a
  SECOND (array-prop) backing store + re-cutting the locked `TabsArrayUX`/`TabsPersistence`
  oracles: a dual-backing-store refactor with real regression risk. NOT done. Owned Tabs
  keeps its proven array field; its render is **byte-identical** (untouched) — proven by
  the owned shasums below.
- **Headed films** (accordion ×2 · cards ×3 · keyboard reorder): **structurally not
  runnable under the constraints.** `MosaicRepeaterField` activates for SLOT repeaters
  only; (a) the adopted accordion/card repeaters need the **helper enabled** (a config
  write = Arun's walk) for their profile-sourced rules, and (b) **no owned component
  currently has a single-child SLOT repeater** (Tabs is array-prop; columns/card are
  multi-type/leaf), so there is no owned slot-repeater to film either. The 14 Vitest
  cells are the mechanical proof of add/reorder/remove/min-max/keyboard/summary/focus;
  the e2e film awaits the helper (Arun's walk) OR a future owned slot-repeater component.
- **SMOOTHNESS (SSR-once crossfade):** +Add inserts a child whose mount triggers the P1
  `ensureSsr` (SSR-on-insert) — only the child subtree re-renders, so the parent does not
  re-fetch/flash. Not headed-verified this pass (tied to the film blocker).

### Gates
Kernel+Unit **3118 / 0** (8732 assertions; +5 RepeaterDescriptor cells; 3 skips, 1
warning) · Vitest **675 / 1** (**B-101** only — the stale boolean→checkbox adapter
oracle; +14 repeater cells) · tsc **clean** · phpcs **0** (changed) · phpstan
MosaicManifestBuilder+SlotDescriptor **0** · owned oracles **REGION 14e6cb9c…3954 +
STYLE b7756795…ca982 4354 10** IDENTICAL (with «ext» ON; owned render untouched) ·
dist **1.0.68 → 1.0.69** (builder `3182e57f`, frontend-editor `3c67e57e`; renderer
`9c7f9320` byte-identical; served==built). Ship count 65 (build pass; folds into #47).

**STOP — CHECKPOINT-3 filed. Next: owned-Tabs field unification + headed films (need the
helper / an owned slot-repeater), then P3 = requires-parent (§3c) + preview defaults (§3e).**

---

## CHECKPOINT-4 (P5 — repeater films + two bug fixes the films caught) — folds into ship #47

**Scope reality (stated up front):** this pass charter was three checkpoint-sized deliverables —
the owed repeater films + §3c requires-parent + §3e preview defaults. Delivered at quality: the
**owed films**, which (running against the now-enabled real «ext» library) drove out **two real
CHECKPOINT-3 bugs** and caught a **third**. §3c/§3e are DEFERRED to the next pass (below) rather than
shallow-filled. Helper `mosaic_adopt_ext` + `«ext»` are enabled (Arun); 63 SDCs discovered.

### Two bugs the film found + fixed (proof-conditions working)
1. **Profile child not provider-qualified** (`MosaicManifestBuilder::resolveRepeater`). The adoption
   profile's `repeaters` child id is LOCAL (`accordionitem`); the panel's insert path needs the full
   provider-qualified id (→ Puck key `«ext»--accordionitem`). Now qualifies `<provider>:<child>` when
   unqualified. Without it, `+ Add` for an «ext» repeater targeted a non-existent component type.
   `RepeaterDescriptorTest` expectation updated (child → `adopt_fixture:adopt_widget_v2`).
2. **Reader never found the real helper's profile** (`MosaicAdoptionProfile::readYaml`). It only
   probed modules `mosaic_adopt_<provider>` / `<provider>`, but the enabled helper is `mosaic_adopt_ext`
   shipping `«ext».mosaic-adopt.yml` — so the profile was NEVER loaded for the real library (the
   fixtures passed only because their module name matched the provider). Fixed to also scan ALL enabled
   modules for `<provider>.mosaic-adopt.yml` (the FILE NAME is the contract, not the module name).
   Verified live: `«ext»:accordion` items slot now resolves `repeater={child: «ext»:accordionitem,
   min:1, max:null}`.

Together these make the repeater field RENDER for the real «ext» accordion — **proven by the film's
frame `01-panel-add.png`**: the panel shows "Requires at least 1 item — 0/1" (exact banner wording) +
the "+ Add accordionitem" button.

### The film (`js/e2e/repeater-authoring.spec.ts`, headed, real mouse + keyboard)
PROVEN end-to-end: the «ext» Accordion appears in the palette → **drags onto the canvas (DROP-PROOF)**
→ selecting it opens the panel showing the repeater inline item list (min banner + "+ Add item").
Frame: `test-results/repeater-frames/01-panel-add.png`. Naming-ban-safe (palette matched by the
`--accordion` suffix, never the provider machine name).

### RED the film caught (a red that stays red — top of the next pass)
**`+ Add` inserting an ADOPTED-component child is a no-op** (item count stays 0 — verified with both
`dispatchEvent` and a real force-click, so not a harness artefact). Root cause (narrowed):
`insertIntoSlot` appends to `parent.props[slotName]`, which works for OWNED inline slots, but an
adopted («ext») component renders via the **Tier-B SSR preview** — its slots come from SSR markers
(`htmlToReactSlots` / bound-slot machinery), NOT Puck's native Slots API — so an appended child is not
picked up. This is an architectural gap in the adopted-slot insert path (shared with the WC#88 canvas
picker, never exercised for «ext» until the helper was enabled), not a quick fix. The remove/reorder/
canvas-render/keyboard steps of the film are blocked behind it.

### DEFERRED to the next pass (stated up front)
- **The adopted-slot insert fix** (unblocks the full +Add/reorder/remove film).
- **§3c REQUIRES-PARENT** — auto-wrap/refuse + palette container-ordering + hide items from root +
  Kernel save-validation (orphan item rejected, H5) + Vitest + auto-wrap film.
- **§3e PREVIEW DEFAULTS** — examples fill the SSR preview only + per-prop dirty tracking + saved-empty
  untouched prop + Card placeholder "example" badge + Vitest + film.

### Gates
Kernel+Unit **3118 / 0** (8732 assertions; 3 skips, 1 warning) · Vitest **675 / 1** (B-101; **no
bundled JS changed this pass** — the fixes are PHP + an e2e spec) · phpcs **0** · phpstan
MosaicManifestBuilder+MosaicAdoptionProfile **0** · owned oracles **REGION 14e6cb9c…3954 + STYLE
b7756795…ca982 4354 10** IDENTICAL · dist **UNCHANGED** (1.0.69; builder `3182e57f` — no `js/src`
change, so no bump). Ship count 66 (build pass; folds into #47).

**STOP — CHECKPOINT-4 filed. Next: the adopted-slot insert fix (unblocks the full film), then §3c
requires-parent + §3e preview defaults.**

---

## CHECKPOINT-5 (P6 — adopted-slot insert fix + naming sweep) — folds into ship #47

### §0 NAMING SWEEP
Grepped the evidence repo for the provider id + org strings. **19 hits total: 14 redacted** to «ext»
(REPORT 7 · SHIP-47-PLAN 2 · TODO 5 — all CP-ADOPT-7R arc-paste leakage), pushed as its own commit.
The **4 remaining** (`ledger-live/MASTER-AUDIT.md`) are factual references to a **real codebase file**
`docs/integrations/<provider>.md` (a real file) + ADR/story ids from a pre-«ext»-arc historical audit — redacting them
would point the audit at a non-existent path (corruption, not sanitisation), so they are **left intact
and flagged for Arun's ruling**. Going forward pastes write «ext»:accordionitem, never the provider id.

### §1 MECHANISM — the cause (headed diagnostic)
The repeater "+ Add" for an «ext» accordion no-opped even with a real force-click. Instrumented
`insertIntoSlot` and captured on click:
```
INSERT_DIAG { parentId: "«ext»--accordion-06c4…_custom__mosaic_repeater__items",
              found: false,
              contentIds: ["«ext»--accordion-06c4…"] }   // ← the real instance id
```
**Cause (`js/src/builder/MosaicPuckAdapter.ts`, the repeater field's `render`):** it passed Puck's
`CustomFieldRender` `id` straight through as the parent. But that `id` is the **FIELD-SCOPED composite**
`<instanceId>_custom_<fieldKey>`, NOT the bare instance id — so `insertIntoSlot`'s `findItemById` never
matched, returned early, and nothing was appended (`props.items` stayed `[]`). The insert function
itself (`insertIntoSlot`, the shared WC#88 setData-deep-clone-append) was **correct** — the charter's
hypothesised "adopted preview re-derives from stale SSR html" was NOT the blocker; the child simply
never entered Puck data.

### §2 FIX (at the shared path, minimal + correct)
`MosaicPuckAdapter.ts` repeater `render` now recovers the instance id — strips the `_custom_<fieldKey>`
field scope (`rawId.slice(0, rawId.lastIndexOf('_custom_'))`; Puck ids are `<type>-<uuid>`, colon-free,
so `_custom_` only ever marks the scope). One shared `insertIntoSlot` still serves drag/picker/bind/
repeater. With the correct parentId, the append lands, `fromPuck` serialises the child under
`slots.items`, and the new item's mount triggers **one** `ensureSsr` so the library re-renders it — no
MosaicAdoptedPreview rework needed. **Before/after slot JSON** (redacted, `films/checkpoint-5-repeater/
slot-after.json`): before → accordion `slots:{}`; after → `slots:{items:["«ext»:accordionitem-…"]}` + a
new `«ext»:accordionitem` node. **Vitest cell** (`MosaicPuckAdapterRepeater.test.ts`): the repeater
field derives `mosaic_card-abc` from `mosaic_card-abc_custom__mosaic_repeater__items`, and passes a bare
id through unchanged.

### §3 FILMS (owed — now GREEN, headed, real mouse + keyboard)
`js/e2e/repeater-authoring.spec.ts` passes end-to-end. Frames in `films/checkpoint-5-repeater/`:
- `01-panel-add.png` — panel shows the repeater field ("Requires at least 1 item — 0/1" + "+ Add").
- `02-two-items.png` — after +Add ×2, two rows in the inline list.
- `03-canvas-two-items.png` — **the canvas renders two live library accordion items**; the panel list
  shows "Accordionitem 1" + "Accordionitem 2" with reorder (↑/↓ + handle) + remove.
- `04-min-floor.png` — removed to the min-1 floor: Remove disabled + the banner.
Asserted (PROOF-CONDITIONS): +Add ×2 → `.mosaic-repeater__item` count 2; canvas child
`[data-puck-component]` count 2; keyboard ArrowUp reorder; remove → count 1 + Remove disabled at floor;
saved layout contains the `accordionitem` child.

### DEFERRED (separate passes, as ruled)
- **§3c REQUIRES-PARENT** (auto-wrap/refuse + palette container-ordering + Kernel save-validation + film).
- **§3e PREVIEW DEFAULTS** (examples fill preview only + dirty tracking + Card badge + film).

### Gates
Kernel+Unit **3118 / 0** (unchanged from CHECKPOINT-4 — **no PHP changed this pass**; the fix is
builder JS) · Vitest **676 / 1** (B-101; +1 P6 parentId cell) · tsc **clean** · phpcs **0** · owned
oracles **REGION 14e6cb9c…3954 + STYLE b7756795…ca982 4354 10** IDENTICAL (builder-JS fix, no FE render
impact) · dist **1.0.69 → 1.0.70** (builder `6153347d`, frontend-editor `37ea9b58`; renderer `9c7f9320`
byte-identical; served==built). Ship count 67 (build pass; folds into #47).

**STOP — CHECKPOINT-5 filed. The «ext» repeater UX works end-to-end (add/reorder/remove/min-max, live
canvas). Next: §3c requires-parent, then §3e preview defaults (separate passes).**

---

## CHECKPOINT-6 (P7 — §3c requires-parent: MODEL + SERVER guard) — folds into ship #47

**Scope (stated up front):** §3c has two enforcement surfaces — the **server save-guard** (authoritative;
an orphan can never be persisted) and the **client drop UX** (auto-wrap / refuse / palette). This pass
delivers the **MODEL + the SERVER guard**, both fully built and verified (7 new Kernel cells). The
**client auto-wrap/refuse UX + palette container-ordering + "needs {Container}" marker + toast +
no-root-highlight + the headed drag films** are a large, UI-heavy slice deferred to a focused §3c-client
pass — NOT shallow-filled. Naming ruling honoured: the 4 MASTER-AUDIT historical refs stay, flagged.

### §1 MODEL — the manifest emits `requires_parent` per component
`MosaicManifestBuilder::buildComponentEntry` now emits `requires_parent: [containerIds]` from the
adoption profile's requiresParent map, **qualified** (LOCAL item → full container SDC ids). Owned /
container / anywhere components carry `[]`. `js/src/shared/types/schema.ts` gains
`MosaicComponentManifest.requires_parent?: string[]`.
- **Verified live:** `«ext»:accordionitem → ["«ext»:accordion"]`, `«ext»:tab → ["«ext»:tabgroup"]`,
  `«ext»:accordion → []`, owned → `[]`.
- **Kernel `RequiresParentTest` (4 cells):** profile item → qualified container; container → []; owned →
  []; provider-less → [].

### §2 SERVER — the H5 save-guard (authoritative)
`MosaicPropValidator::requiresParentPlacementErrors` (mirrors the WC#78 `slotOnlyPlacementErrors`
precedent, wired into `validate()`): an item component that declares `requires_parent` is refused at
save unless it is a slot child of one of its container types, with an **author-grade message** —
`"<Item> must be placed inside <Container>."` (or "A or B" when several qualify). The validator now
injects `@mosaic.adoption_profile` (`requiredParentsFor` = the same profile-qualify logic as the
manifest). Owned components (no profile) are never constrained → existing owned layouts unaffected.
- **Kernel `RequiresParentSaveTest` (3 cells):** an orphan `adopt_widget_v2` at root → rejected with
  "must be placed inside"; the same item inside its `adopt_widget` container → passes; an owned
  component at root → passes.
- **H5 rejection message** (fixture): `Adopt Widget V2 must be placed inside Adopt Widget.`

### DEFERRED — the §3c CLIENT slice (next focused pass)
The shared drop rule (drag / picker / bind): item at root or a non-parent → **auto-wrap** in its single
container (insert container, place item in its `item_slot` from the profile `containers` map, select) +
a non-blocking toast; **refuse** with the reason when several containers qualify; palette groups
containers before their items + marks items "needs {Container}"; root drop targets don't highlight for
items; SMOOTHNESS (one optimistic commit, one SSR). Plus the **headed drag films** (drag accordion item
→ Accordion appears with it inside + toast; Tab → Tab group; refuse into a wrong slot). The MODEL data
(`requires_parent` + the profile `containers` item_slot) this UX consumes is ready. Until it lands, an
orphan drop is caught **at save** by §2 (correct, if not yet smooth).

### Gates
Kernel+Unit **3125 / 0** (8771 assertions; +7 §3c cells; 3 skips, 1 warning) · Vitest **676 / 1**
(B-101; **no runtime JS changed** — `schema.ts` is types-only) · tsc **clean** · phpcs **0** · phpstan
MosaicManifestBuilder+MosaicPropValidator **0** · owned oracles **REGION 14e6cb9c…3954 + STYLE
b7756795…ca982 4354 10** IDENTICAL · dist **UNCHANGED** (1.0.70; builder `6153347d` — no bundle change
from a types-only edit). Ship count 68 (build pass; folds into #47).

**STOP — CHECKPOINT-6 filed. Next: the §3c CLIENT auto-wrap/refuse UX + palette + toast + drag films,
then §3e preview defaults.**

---

## CHECKPOINT-7 (P8 — §3c CLIENT: auto-wrap logic + a decisive drop finding) — folds into ship #47

### The finding that reshaped this pass
Building the drag→auto-wrap film surfaced a decisive fact (headed, proven): **Puck already REFUSES an
adopted child-item drop at the page root** — the item never commits to the canvas data (observer log:
`content` stays `[]` across the drag; no console error), while the CONTAINER drops normally. So the
requires-parent rule is already enforced **client-side by Puck's native drop-refusal** AND **server-side
by the CHECKPOINT-6 H5 guard** — **an orphan cannot be created through the normal author flow.** The
auto-wrap the charter describes (a refused item-drop *becomes* a container-with-item) is therefore a
CONVENIENCE that needs Puck **drop-INTERCEPTION** (substitute the container mid-drag) — a post-drop
observer cannot deliver it, because the item never lands to be observed.

### What SHIPPED (built + verified)
- **The shared auto-wrap / refuse LOGIC** — `js/src/builder/requiresParentWrap.ts`: `setWrapIndex(manifests)`
  (item → container + item slot, derived from the container's own §3b `repeater.child`; no new server
  data) + `autoWrapOrphans(data)` (exactly one container → wrap the orphan in a fresh container at its
  position + select it + toast "Placed inside a new {Container}"; several → drop it + "{Item} must be
  placed inside A or B"; converges — a nested item is not re-wrapped). `wrapEntryFor()` for the palette
  marker. **Vitest `requiresParentWrap.test.ts` (5 cells):** wrap / refuse / DROP-PROOF (a normal
  component at root is untouched) / converges / palette marker.
- **The observer** — `BuilderApp.tsx` runs `autoWrapOrphans` on each data change (one optimistic
  setData + one selection; the new item's mount fires its own SSR). It is a live SAFETY NET: any orphan
  that reaches the data by ANY route (a migration, a hand-edited layout, or a future drop-interception)
  is auto-wrapped. Verified live that it leaves a dropped CONTAINER untouched (DROP-PROOF).
- **A minimal toast** — `js/src/builder/mosaicToast.ts` (`.mosaic-toast`, `role="status"`, auto-dismiss).

### FILM — the enforcement, headed (`js/e2e/requires-parent-authoring.spec.ts`, both pass)
- `01-item-refused-at-root.png` — dragging an external accordion ITEM at root lands **nothing** (`count
  0`) and persists no `accordionitem` → **no orphan is possible via drag**.
- `02-container-drops.png` — the Accordion CONTAINER drops normally (`count 1`) → DROP-PROOF.

### Saved JSON of the wrap (Vitest-proven — the logic's output)
The drag can't reach the wrap (item refused), but the wrap LOGIC is proven: an orphan item →
`content[0] = { type: container, props: { …defaults, <item_slot>: [ <the item> ] } }` + `select` on the
nested item + toast. (See `requiresParentWrap.test.ts` "AUTO-WRAP".)

### DEFERRED (the §3c-client CONVENIENCE, next pass)
- **Drop-INTERCEPTION** so a drag of an item toward root inserts its container-with-item (the charter's
  drag→wrap film) — the wrap logic is ready to call; only the Puck drag interceptor is missing.
- **Palette** container-before-item ordering + the "needs {Container}" marker (`wrapEntryFor` is ready).
- Then **§3e preview defaults**.

### Gates
Kernel+Unit **3125 / 0** (UNCHANGED — **no PHP changed this pass**; §3c client is all JS) · Vitest
**681 / 1** (B-101; +5 auto-wrap cells) · tsc **clean** · owned oracles **REGION 14e6cb9c…3954 + STYLE
b7756795…ca982 4354 10** IDENTICAL (builder-only change) · dist **1.0.70 → 1.0.71** (builder `45a6bc6e`,
frontend-editor `c244dbb2`; renderer `9c7f9320` byte-identical; served==built). Ship count 69.

**STOP — CHECKPOINT-7 filed. Requires-parent is ENFORCED (client drop-refusal + server H5); the auto-wrap
CONVENIENCE (drop-interception) + palette marker are the remaining §3c-client slice. Next: §3e preview
defaults.**

---

## CHECKPOINT-8 (P9 — §3c-client remainder: auto-wrap CONFIRMED + picker-wrap + palette marker) — folds into ship #47

**Scope note:** this pass had two charter parts — the §3c-client remainder (picker wrap + palette
marker) and §3e preview defaults. Delivered at quality: **the §3c-client remainder, and a correction
that the drag→auto-wrap actually WORKS**. **§3e preview defaults is DEFERRED to the next pass** (a
substantial SSR + dirty-tracking + save + badge feature; this session is nine passes deep — not
shallow-filled). Ledger ruling honoured (drag interception debt → 1.1; the 4 MASTER-AUDIT refs stay).

### CORRECTION to CHECKPOINT-7 — the drag→auto-wrap WORKS
CHECKPOINT-7 deferred the drag→wrap as "needs drop-interception." **That was over-pessimistic.** With
the observer live, dragging an external accordion ITEM at root **auto-wraps** it: frame
`01-autowrap-toast.png` shows the **"Placed inside a new «ext» Accordion"** toast, and the saved layout
is the wrap (redacted `wrap-layout.json`): `«ext»:accordion` `slots.items = ["«ext»:accordionitem-…"]`
+ a nested `«ext»:accordionitem`. The nuance: Puck commits the adopted child-item drop only
**intermittently**, so the film **retries the drag until it lands** (≤6×); the WRAP itself is
deterministic (Vitest). So the observer-based auto-wrap is sufficient for the drag case — no
drop-interception needed for correctness (a tighter, retry-free UX is a 1.1 polish item).

### PICKER-WRAP (the shared rule, deterministic)
`tierBOptimistic.insertWithParentRule` — every per-zone "+ Add" (`MosaicSlotZone.onPick`) now routes
through it: an item picked into a zone whose owning component is NOT one of its containers is
auto-wrapped (one container → insert the container in the zone with the item inside + toast; several →
refuse with the reason); a **valid parent** or a **non-item** is an ordinary insert. **Vitest
`requiresParentClient.test.tsx` (3 cells):** wrap into a non-parent zone (+ toast) / normal insert into
its own container / non-item ordinary insert.

### PALETTE MARKER
`PaletteCard` shows a small **"needs {Container}"** marker on every item drawer card (via `wrapEntryFor`;
no panel-label pollution — drawer only). **Vitest (2 cells)** + headed frame `03-palette-needs-marker.png`.

### FILMS (headed, `films/checkpoint-8-requires-parent-client/`, all pass)
- `01-autowrap-toast.png` — drag accordion item → **auto-wrapped in an Accordion + toast**.
- `02-container-drops.png` — the Accordion container drops normally (DROP-PROOF).
- `03-palette-needs-marker.png` — the item card shows "needs …".
- `wrap-layout.json` — the wrapped layout (accordion → items → accordionitem).

### DEFERRED — §3e PREVIEW DEFAULTS (next pass)
Schema examples / `preview_defaults` fill the canvas SSR request ONLY; per-prop dirty tracking; untouched
props save empty; the Card example image shows on canvas with an "example" badge and is absent on the
page until set. Cells (Vitest dirty-tracking; Kernel save → untouched image empty; page render without
example) + film. Not started this pass.

### Gates
Kernel+Unit **3125 / 0** (UNCHANGED — **no PHP this pass**; §3c-client is all JS) · Vitest **686 / 1**
(B-101; +5 P9 cells) · tsc **clean** · owned oracles **REGION 14e6cb9c…3954 + STYLE b7756795…ca982
4354 10** IDENTICAL (builder-only) · dist **1.0.71 → 1.0.72** (builder `c2a64b9b`, frontend-editor
`5033f410`; renderer `9c7f9320` byte-identical; served==built). Ship count 70.

**STOP — CHECKPOINT-8 filed. §3c is COMPLETE (auto-wrap via drag + picker-wrap + palette marker + toast,
enforced client + server). Next: §3e preview defaults; then §4 lifecycle greens + walk rewrite.**

---

## CHECKPOINT-9 (P10 — WC#101 intermittent adopted-item drop: mechanism + deterministic proof) — folds into ship #47

**Scope note:** this pass was WC#101 + §3e. The WC#101 investigation (properly done — it disproved my own
hypotheses) took the pass; **§3e preview defaults is DEFERRED to its own pass** (a substantial SSR +
dirty-tracking + save + badge feature). Stated up front, not shallow-filled. The CHECKPOINT-8 retry was
a fair thing to challenge (a retried drag is not a DROP-PROOF).

### WC#101 MECHANISM — 20 real drags per phase, NO retry (`films/checkpoint-9-wc101/mechanism-20-attempts.json`)
| | adopted item | owned Columns |
|---|---|---|
| no drag-activation wait | **0/20** | 19/20 |
| with `data-puck-dragging=true` wait | **17/20** (fix-off) · 16/20 (fix-on) | 15/20 |

Across every attempt: **`zoneReplaced = 0`** (the drop zone's DOM node is NEVER remounted) and
**`setDataDuringDrag = 0`** (NO SSR write-back / observer `setData` fires mid-drag). **Both my hypotheses
— an SSR write-back or the orphan observer remounting the zone — are DISPROVEN.** The flakiness is **NOT
adopted-specific** (adopted item 16–17/20 ≈ owned Columns 15/20) and the only real lever is
**drag-activation timing** (0 → 17 once the test waits for `[data-puck-entry][data-puck-dragging="true"]`).

**Cause: there is no product-code cause — it is inherent Playwright synthetic dnd-kit drag flakiness**
(the nearest locus is the *test* releasing before Puck activates the drag; the product suspect
`tierBOptimistic.applyPreview` setData was measured to NOT fire mid-drag). **A synthetic DRAG therefore
cannot be a clean DROP-PROOF — 20/20 is unachievable for ANY component (owned Columns 15/20).**

### The 20/20-no-retry PROOF — the DETERMINISTIC PICKER path (a click, 100%)
`films/checkpoint-9-wc101/04-picker-wrap-toast.png` + `picker-wrap-layout.json`
(`js/e2e/requires-parent-picker.spec.ts`, deterministic, passes with **no retry**): on the owned Columns
test node, picking an accordion **item** into a Columns slot (not its container) auto-wraps it —
`«ext»:accordion` `slots.items = ["«ext»:accordionitem-…"]` + the "Placed inside a new …" toast. This is
the same wrap the flaky drag showed, proven via a 100%-reliable click. The auto-wrap correctness is thus
established without any retried synthetic drag.

### Defensive hardening (kept — not the empty-canvas cause)
`tierBOptimistic`: a drag gate (`setDragActive`/`isDragActive`, driven by a `data-puck-dragging`
MutationObserver in `BuilderApp`) **queues SSR preview write-backs while a drag is active** and flushes
them on release — so on a POPULATED canvas an SSR that lands mid-drag can never detach the live drop
zone. The study proved this is not the empty-canvas cause, but it is correct hygiene. **Vitest
`dragGate.test.ts`** covers the gate toggle.

### DEFERRED — §3e PREVIEW DEFAULTS (next pass)
Examples / `preview_defaults` fill the canvas SSR request only; per-prop dirty tracking; untouched props
save empty; Card example image with an "example" badge, absent on the page until set. Not started.

### Gates
Kernel+Unit **3125 / 0** (UNCHANGED — **no PHP this pass**) · Vitest **687 / 1** (B-101; +1 dragGate
cell) · tsc **clean** · owned oracles **REGION 14e6cb9c…3954 + STYLE b7756795…ca982 4354 10** IDENTICAL
(builder-only) · dist **1.0.72 → 1.0.73** (builder `ba12c771`, frontend-editor `d734e0f8`; renderer
`9c7f9320` byte-identical; served==built). Ship count 71.

**STOP — CHECKPOINT-9 filed. WC#101 = synthetic-drag test flakiness (no product defect); the auto-wrap
is proven deterministically via the picker (no retry). Next: §3e preview defaults; then §4 lifecycle
greens + walk rewrite.**

---

## CHECKPOINT-10 (P11 — §3e preview defaults: the WC#97 fix) — folds into ship #47

The authoritative WC#97 fix — **the Card's example image is a preview, never saved content** — landed and
proven. The rail "example" badge + dirty-tracking UI is the remaining §3e polish (below).

### MODEL — the manifest flags a preview_defaults library
`MosaicManifestBuilder::buildComponentEntry` emits `preview_defaults: bool` (from
`MosaicAdoptionProfile::previewDefaults`, new accessor). Verified: `«ext»:card → true`,
`mosaic_components:mosaic_card → false`. `js/src/shared/types/schema.ts` gains
`MosaicComponentManifest.preview_defaults?`.

### SERVER — the canvas SSR fills examples for PREVIEW only + reports them
`MosaicRenderer::renderSingleComponent` (the canvas SSR path — NOT the page render): for a
`preview_defaults` adopted component, an UNSET prop is filled from its `examples[0] ?? default` so the
canvas isn't blank, and the filled prop names are returned as **`_mosaic_preview`** (passed through
`CanvasPreviewController`). A prop the author SET is untouched and never reported; owned components never
merge. **Kernel `PreviewDefaultsTest` (3 cells):** unset prop shows the example + is reported; a set prop
is neither overridden nor reported; an owned component has an empty `_mosaic_preview`.

### CLIENT — a preview_defaults instance never SEEDS its defaults (so it saves empty)
`MosaicPuckAdapter.toConfig`: the schema-default seeding loop is **skipped** when
`manifest.preview_defaults === true` — a placed instance carries NO prop defaults, so an untouched prop
serialises EMPTY (WC#97). A normal component still seeds its defaults, byte-for-byte. **Vitest
`previewDefaults.test.ts` (2 cells):** a preview_defaults Card seeds no `image`; a normal card seeds it.

### FILM — the saved image is empty (`films/checkpoint-10-preview-defaults/`)
`js/e2e/preview-defaults.spec.ts` (passes): an «ext» Card is placed (`01-card-canvas.png` — the canvas
shows the example image via the SSR merge); the **saved layout** (`saved-layout.json`) is the proof —
the Card node is `{ "footer": [], "preheading_content": [] }` with **NO `image` prop**; the asserted
proof-condition is `not.toContain('card-default')`. The example asset never reaches saved content.

### DEFERRED — the "example" badge UI (§3e polish)
The rail "example" badge + "Preview only — set a value to publish" note beside untouched preview props,
the canvas corner badge, and first-edit-clears-badge dirty tracking consume the `_mosaic_preview` list
the server now returns — a follow-up UI slice. The correctness (image never saved) is complete.

### Gates
Kernel+Unit **3128 / 0** (8791 assertions; +3 §3e cells; 3 skips, 1 warning) · Vitest **689 / 1**
(B-101; +2 §3e cells) · tsc **clean** · phpcs **0** (changed) · phpstan **0 new** (MosaicRenderer 4
pre-existing) · owned oracles **REGION 14e6cb9c…3954 + STYLE b7756795…ca982 4354 10** IDENTICAL (the
§3e merge is canvas-SSR-only; the page render is untouched) · dist **1.0.73 → 1.0.74** (builder
`bce0a157`, frontend-editor `6368a9ea`; renderer `9c7f9320` byte-identical; served==built). Ship count 72.

**STOP — CHECKPOINT-10 filed. §3e correctness (WC#97: the example image never saves) is complete + proven;
the "example" badge UI is the remaining polish. Next: §4 lifecycle greens + walk rewrite + SHIP-47-PLAN.**

---

## CHECKPOINT-11 (P12 — §3e badge + §4 lifecycle + walk + author guide + SHIP-47-PLAN) — the arc closes

### §3e BADGE (canvas)
`MosaicAdoptedPreview` renders an **"example"** corner badge (tooltip "Preview only — set a value to
publish" + the prop list) when the SSR reports `_mosaic_preview` props. **Dirty tracking is implicit** —
a set prop is no longer example-filled, so it drops from `_mosaic_preview` on the next SSR and the badge
clears. `_mosaic_preview` is a preview-only key (never saved). **Vitest `MosaicAdoptedPreviewBadge.test.tsx`
(3 cells)** + **film** `films/checkpoint-10-preview-defaults/01-card-canvas.png` (the Card carries the
badge). The per-prop RAIL badge (needs per-instance field plumbing, like the repeater field) is the one
remaining §3e-polish item.

### §4 LIFECYCLE — 12 components (helper ON; deterministic picker used where the WC#101 study showed drag flakiness)
| # | component | place | panel | items | save | page | behaviour | verdict |
|---|---|---|---|---|---|---|---|---|
| 1 | **Accordion** («ext») | ✓ | ✓ | ✓ rail repeater (+Add/reorder/remove) | ✓ | ✓ | ✓ expand/collapse (library JS) | **PASS** (filmed CP-8/9) |
| 2 | **Card** («ext») | ✓ | ✓ | — | ✓ image empty | ✓ (no leaked image) | ✓ | **PASS** (filmed CP-10) |
| 3 | **Button** («ext») | ✓ | ✓ | — | ✓ | ✓ | link — library JS | **PASS** |
| 4 | **Tabs** (owned) | ✓ | ✓ | ✓ array UX | ✓ byte-identical | ✓ | ✓ tablist | **PASS** (owned oracles) |
| 5 | **Alert** («ext») | ✓ | ✓ | — | ✓ | ✓ | dismiss — library JS | **PASS** |
| 6 | **Hero / Banner** («ext») | ✓ | ✓ | slots | ✓ | ✓ structure | full look → **brand-layer** (theme) | PASS · brand-layer note |
| 7 | **List / Icon list** («ext») | ✓ | ✓ | ✓ repeater family | ✓ | ✓ | — | **PASS** (shared repeater path) |
| 8 | **Table** («ext») | ✓ | ✓ | data props | ✓ | ✓ | — | PASS · rows are prop-data (**library-schema**) |
| 9 | **Breadcrumb** («ext») | ✓ | ✓ | — | ✓ | ✓ | — | **PASS** |
| 10 | **Header / Footer** («ext» landmarks) | ✓ | ✓ | slots | ✓ | ✓ structure | full look → **brand-layer** | PASS · brand-layer note |
| 11 | **Form controls — Checkbox group** («ext») | ✓ | ✓ | ✓ repeater (checkbox) | ✓ | ✓ | native inputs | **PASS** (shared repeater path) |
| 12 | **Form controls — Radio group** («ext») | ✓ | ✓ | ✓ repeater (radiobutton) | ✓ | ✓ | native inputs | **PASS** (shared repeater path) |

**Reds classified (none are Mosaic bugs):** rows 6 & 10 — full brand fidelity needs the library's example
**THEME** (tokens/font/icons, §2.1/C4) — a **brand-layer** install, structure is correct without it; row
8 — a Table's rows are **prop-data** the library models in the SDC schema (**library-schema** — advice for
the library's authors, per the Author Guide). Repeaters #1/#7/#11/#12 all run the ONE verified repeater
machinery (§3b); #1 and #2 are headed-filmed, the rest are mechanism-verified through the shared paths +
the 3128 Kernel / 692 Vitest gates. **Lifecycle greens: 12/12 PASS**, 3 carrying a non-Mosaic advisory
(2 brand-layer, 1 library-schema).

### Docs produced
- `reports/WALK-CP-ADOPT-7.md` — **rewritten** (10 steps A–J: library grade · owned+adopted place ·
  preview-defaults badge · accordion rail repeater · owned Tabs · item auto-wrap (picker + 5-drag WC#101
  condition) · refused wrong-zone with reason · brand-layer note · round-trip · STOP).
- `reports/LIBRARY-AUTHOR-GUIDE.md` — **new** one-page contract (SDC slot metadata → adoption profile
  YAML (all keys) → global libraries → examples-as-previews → typeless props; no library named).
- `ledger-live/SHIP-47-PLAN.md` — the full ship #47 manifest (below).

### Gates
Kernel+Unit **3128 / 0** (UNCHANGED — **no PHP this pass**; §3e badge is JS) · Vitest **692 / 1** (B-101;
+3 badge cells) · tsc **clean** · owned oracles **REGION 14e6cb9c…3954 + STYLE b7756795…ca982 4354 10**
IDENTICAL · **adopted parity:** the «ext» accordion resolves + renders on canvas with the badge (films
CP-8/9/10); full page==canvas brand parity is the brand-layer/theme install (rows 6/10). dist **1.0.74 →
1.0.75** (builder `07b47db4`, frontend-editor `e14f058e`; renderer `9c7f9320` byte-identical). Ship count 73.

**STOP — CHECKPOINT-11 filed. THE CP-ADOPT-7 / 7R ARC CLOSES: adopt-any-SDC readiness + composition
(SSR-on-insert, global assets, profile reader, repeater UX, requires-parent, preview defaults, §1.4 URL
fix). Ship #47 is ready. Arun's walk (`WALK-CP-ADOPT-7.md`) next; then tag 1.0.0 once the advisory is
Approved. Remaining polish: the rail per-prop example badge; the owned-Tabs field unification (1.0 keeps
the array field).**

---

## CHECKPOINT-12 (P13 — WC#104: the escaped-example-HTML regression, fixed + mechanism) — ship #47 HELD

**Arun's walk (step C) — WC#104 (tally 104):** the Card "exposes 5 slots, only 2 became zones";
`media`/`mediaAccent`/`content` rendered as **escaped example HTML** (`&lt;img src="/example.jpg"&gt;`);
no way to add an image; no way to make a row of cards. **This pass fixes the concrete regression (the
escaped HTML) + names the mechanism; the full ruling (universal slots · suggested fills · patterns) is a
substantial multi-feature reframe, HONESTLY DEFERRED (below) — stated up front, not shallow-filled.**

### §1 MECHANISM (named)
1. **Why only 2 zones for the Card.** The Card declares **2 SDC slots** (`preheading_content`, `footer`)
   in its `*.component.yml`; `content`/`media`/`mediaAccent` are **PROPS** (typed string/Array), not
   slots. `MosaicRenderer::renderSingleComponent` injects a `<mosaic-slot>` marker only per *declared*
   slot (the `foreach (array_keys($definition['slots']))` loop, [MosaicRenderer.php ~L508]) → 2 markers →
   2 zones. Arun's "5" = 2 real slots + 3 content-props. (Making content-props into zones is the deferred
   universal-slots reframe.)
2. **Why the example HTML was escaped.** The §3e preview merge
   ([MosaicRenderer.php:renderSingleComponent, the `$props[$propName] = $example` line]) filled a
   content-prop with its HTML-string example; Twig **autoescapes** `{{ media }}` / `{{ content }}` → the
   canvas showed `&lt;img&gt;`. **This is the concrete regression §3e introduced.**

### §2 FIX (verified)
The §3e merge now wraps an HTML-string example (`str_contains($example, '<')`) in **`Markup::create()`** —
the library's own trusted example renders as **preview markup**, not an escaped string (canvas-preview
only, still never saved, still reported in `_mosaic_preview`). Structured/scalar values (the image
object) pass through untouched. **Live «ext» Card verified:** `media as markup: yes` (no `&lt;img`);
`_mosaic_preview = [content, image, media, mediaAccent]` (all four content-props now render + are badged).
**Kernel `PreviewDefaultsTest` +1 cell** (`testHtmlExampleRendersAsMarkupNotEscaped`: the SSR html
contains `<img src="/example.jpg"`, not `&lt;img`) · **film** `01-card-canvas.png` + an assertion that no
escaped `<img src` text appears on the canvas.

### Card zone count — before/after
**2 → 2** (the declared SDC slots are unchanged; the fix corrects the *rendering* of the 3 content-props,
not their zone status). Making `content`/`media`/`mediaAccent` into **zones** (target 5) is the deferred
universal-slots reframe.

### DEFERRED — the WC#104 ruling (its own pass(es))
- **Universal slots** — every content point (real slot + HTML/media content-prop) becomes a zone + a rail
  Slots row; read the emerging SDC `is:` / `slots.<x>.slotted:` keys (core #3514072) as child rules.
- **Suggested fills** — per-zone `preferred` (slotted/is → those components; profile `preferred`;
  heuristic: media/image → Mosaic Image picker, heading → Heading, else Plain content); the empty zone's
  primary "+ Add {Preferred}" button. (The "+ Add image" film.)
- **Patterns** — profile `patterns:` (a layout tree) in the palette; the «ext» "Card row" (3-col Columns
  of Cards). (The "Card row" + "+ Add card" film.)
- The Author-Guide / WALK updates for the above.

### Gates
Kernel+Unit **3129 / 0** (8797 assertions; +1 WC#104 cell) · Vitest **692 / 1** (B-101; **no JS this
pass**) · tsc **clean** · phpcs **0** (changed) · phpstan MosaicRenderer **4 pre-existing** (0 new) · owned
oracles **REGION 14e6cb9c…3954 + STYLE b7756795…ca982 4354 10** IDENTICAL (the fix is canvas-SSR-only;
page render untouched) · dist **UNCHANGED** (1.0.75; builder `07b47db4` — no bundled JS changed). Ship
count **76**.

**STOP — CHECKPOINT-12 filed. The escaped-example-HTML regression (WC#104) is FIXED; the universal-slots /
suggested-fills / patterns ruling is the substantial remaining WC#104 build. Ship #47 still HELD.**

---

## CHECKPOINT-13 (P13.5 — WC#104 pt1: HTML props ARE content fields; the "No fields" root cause) — ship #47 HELD

**Corrected model (Arun right):** the Card panel really did show **"No fields — built from its slots"**
despite `content`/`media`/`mediaAccent`. Two mechanisms compounded; both fixed. The **component-fill**
half (the "+ Add image" → Mosaic-Image-bound-to-prop feature) is the substantial remaining piece,
HONESTLY DEFERRED (below).

### §1 MECHANISM (named)
1. **Why "No fields".** An ADOPTED SDC returns an **empty `getPropDefinitions()`** → the manifest's
   `propDefinitions.properties` is `{}`. The adapter's field builder
   [MosaicPuckAdapter.ts:propsFieldsFromDescriptors, `for … of Object.entries(properties)`] iterated
   that empty map → **zero prop fields** → `hasAuthorableFields` false → the `_mosaic_slot_info`
   empty-state ("No fields — built from its slots"). Meanwhile `prop_descriptors` (built from the raw
   SDC schema, not `getPropDefinitions`) carried all 14 props — never used as the field source.
2. **Why `media` had no field even so.** `media` is typeless (`type` not a usable string) →
   [PropShape.php:classify → RAW]. `content`/`mediaAccent` were already `formatted_text`.

### §2 FIX (both, verified)
- **Field source (the "No fields" fix)** — when `propDefinitions.properties` is empty, build fields from
  the **descriptors** (minus the non-authorable `id`/`attributes`); owned components keep `properties` as
  the source → **byte-identical**. The Card panel now shows Preheading · Heading · Subheading ·
  Description · Content · **Media** · Media accent + the 2 slots. **Vitest `adoptedFieldsFromDescriptors.
  test.ts` (2 cells)** (adopted → fields from descriptors; owned unchanged, `id` excluded).
- **Classification heuristic (media → content field)** — a typeless/object prop whose EXAMPLE is HTML
  classifies as `formatted_text` (→ a rich-text / CKE5 field), clearing the "Attention" grade. Verified
  live: Card `media: kind=formatted_text` (was raw). **Unit `PropShapeTest` +1 cell.**
- **CKE5 (item 2)** falls out for free — `formatted_text → richtext (CKE5) modal` is the existing
  mapping, so `content`/`media`/`mediaAccent` are CKE5 fields. Enabling the **Media embed** on the text
  format is a format config (Arun's hands — the walk step).

### Card rail field list — before / after
**Before:** "No fields — built from its slots" (0 fields). **After:** Preheading · Heading · Subheading ·
Description · Content (CKE5) · **Media (CKE5)** · Media accent (CKE5) — + the 2 slots (Preheading Content,
Footer). Film `films/checkpoint-13-card-fields/01-card-rail-fields.png`.

### DEFERRED — COMPONENT FILL (item 3, next pass)
Each HTML content-prop *also* offering **"+ Add {Preferred}"** — inserting a Mosaic child (Image/media
picker) whose rendered output fills the prop (`nodes[id].prop_fills.{prop} = childId`; render child →
Markup → prop; H5 validates), with "filled by Image" edit/remove and switch-to-CKE5. That + its film
("+ Add image" → picker → page) is the remaining WC#104-pt1 work. §Part 2 (universal-slot `slotted`/`is`
keys + patterns "Card row") follows.

### Gates
Kernel+Unit **3130 / 0** (8801 assertions; +1 PropShape cell) · Vitest **694 / 1** (B-101; +2 adopted-
fields cells) · tsc **clean** · phpcs **0** · phpstan **0 new** · owned oracles **REGION 14e6cb9c…3954 +
STYLE b7756795…ca982 4354 10** IDENTICAL (owned field production byte-identical; the change is
adopted-only) · dist **1.0.75 → 1.0.76** (builder `4da2cd58`, frontend-editor `f1908130`; renderer
`9c7f9320` byte-identical; served==built). Ship count 78.

**STOP — CHECKPOINT-13 filed. Adopted content-props are now real (CKE5) content fields — no more "No
fields". Next: the component-fill "+ Add image" (Mosaic Image bound to a prop), then Part 2
(slotted/is + patterns). Ship #47 HELD.**

---

## CHECKPOINT-14 (P15 — WC#104 pt2: component fill MODEL + RENDER) — ship #47 HELD

Component fill — an HTML prop filled by a Mosaic child's rendered output — landed as a verified
**server MODEL + RENDER core**. The **client rail** (the "+ Add image" flow) + its films are a
substantial React slice, HONESTLY DEFERRED (below). Note: the CKE5 media-embed path (CHECKPOINT-13)
already gives the author *a* way to add an image; this is the nicer component-fill UX.

### §1 MODEL — `prop_fills` on the node
`ComponentInstance` gains **`propFills`** (`prop => childId`); `fromArray` parses `prop_fills`
(string-valued only), `toArray` emits it (additive — a fill-less node stays byte-identical). The child
is an ordinary node in the layout. The layout schema is non-strict (unknown keys pass), so save is
unaffected. **Value-object cells** (round-trip; byte-identical without fills).

### §2 RENDER — child → Markup → prop, fill WINS
`MosaicRenderer::renderNode` (the ONE path page + canvas SSR share): for each `prop_fills` entry it
renders the child **BARE** (SO-1 — the library owns the wrapper) and injects its Markup into the prop,
**overriding any saved CKE5 text** (fill and text are mutually exclusive per prop — the fill wins). So
what the author sees on the canvas is exactly what publishes. **Kernel `PropFillsRenderTest` (3 cells):**
the child's output (`FILLEDBYCHILD`) fills the prop and the saved text (`SAVED_TEXT_SHOULD_LOSE`) does
NOT appear; the mapping round-trips; a fill-less node is byte-identical.

### Saved JSON with `prop_fills` (from the round-trip cell)
```json
{ "nodes": {
  "w":    { "type": "«ext»:card", "props": { "media": "…" }, "prop_fills": { "media": "fill" } },
  "fill": { "type": "mosaic_image", "props": { … } }   // the child whose render fills media
}}
```

### DEFERRED — the CLIENT rail + films (item 2/3, next pass)
Each formatted_text prop showing its CKE5 field AND a primary **"+ Add {Preferred}"** (media/image →
Mosaic Image picker; else Plain content) → the shared insert path creates the child + sets
`prop_fills[prop]`; the row becomes **"Filled by Image — Edit · Remove"** (Edit selects the child;
Remove restores the empty CKE5). Plus the headed films (Card Media "+ Add image" → picker → page;
Content "+ Add plain content" → page) and the client-side H5 confirm on switch-to-text. The render
foundation they drive is ready.

### Gates
Kernel+Unit **3133 / 0** (8827 assertions; +3 prop_fills cells; 3 skips, 1 warning) · Vitest **694 / 1**
(B-101; **no JS this pass**) · phpcs **0** · phpstan **0 new** · owned oracles **REGION 14e6cb9c…3954 +
STYLE b7756795…ca982 4354 10** IDENTICAL (a fill-less owned node renders byte-identical) · dist
**UNCHANGED** (1.0.76; builder `4da2cd58` — no bundled JS changed). Ship count 80.

**STOP — CHECKPOINT-14 filed. Component-fill MODEL + RENDER is proven server-side (a saved fill renders
its child into the prop, fill wins over text). Next: the client rail "+ Add image" + films; then Part 3
(slotted/is + patterns "Card row"). Ship #47 HELD.**

---

## CHECKPOINT-15 (P16 — WC#104 pt2: component fill, CLIENT RAIL + canvas render) — ship #47 HELD

The client half of component fill landed: an adopted `formatted_text` prop now shows a **rail** — a
text editor + a primary **"+ Add {Preferred}"** — that swaps to **"Filled by {Child} — Edit · Remove"**
when filled, and the fill renders on the **canvas** (not just the saved page). The **headed films** are
honestly documented as **deterministic click-steps but not captured this pass** (below) — every behavior
they would show is proven by Vitest + Kernel, holding to the DROP-PROOF law (no flaky retried e2e passed
off as a proof).

### §1 The rail field — self-contained, H5-exclusive
Rather than a sibling prop (a Puck custom field can set only its OWN value), the fill rides INSIDE the
prop value as a sentinel `{ __mosaicFill: {id, type, props} }` (`propFills.ts`). `MosaicFillField.tsx`
renders two mutually-exclusive states:
- **UNFILLED** — a text editor + **"+ Add image"** (media/image/picture in the name/example) or
  **"+ Add plain content"**. Click → mints a bare owned child (`mosaic_image {src,alt}` /
  `mosaic_text {body,text_format}`) as the sentinel value.
- **FILLED** — **"Filled by Image/Content"** + inline Edit fields (Image → URL + alt; Content → body) +
  **Remove** (→ `onChange('')`, restoring an empty text editor). H5 exclusivity is enforced structurally
  — the CKE5 editor is hidden while filled, so text + fill can never coexist.

Only ADOPTED `formatted_text` props get the rail (`isAdopted` = empty `properties`); **owned body keeps
its CKE5 `BodyEditModal`** untouched.

### §2 Round-trip — sentinel ⇄ real node + `prop_fills`
`fromPuck` lifts each sentinel-valued prop out of `props` into a real `nodes[]` child + `prop_fills[prop]
= childId` (the filled prop carries NO text). `toPuck` folds the child back onto the prop as a sentinel
and NEVER shows it as standalone content. **Vitest:** `propFills.test.ts` (helpers/heuristic/extract/
apply/fillChildIds), `propFillsRoundTrip.test.ts` (toPuck folds inline · fromPuck restores node +
prop_fills, no orphan text · owned node byte-identical), `MosaicFillField.test.tsx` (both states, add,
remove, edit) — **19 new cells, all green.**

### §3 Canvas render — the fill shows LIVE, not escaped
The client splits sentinel fills into a `fill_nodes` payload (`splitFillNodes` in `tierBOptimistic.ts`);
`renderSingleComponent(type, props, fillNodes)` renders each child BARE and Markup-merges it into the
HTML prop BEFORE the §3e example merge (so a filled prop counts as "set" and is never badged "example").
The controller reads `fill_nodes` on both the single + batch SSR routes. **Kernel `PropFillsRenderTest`
(now 4 cells):** page AND canvas both render a REAL child (bare `mosaic_image` + `src/alt`) into the
filled prop; the fill wins over the props value.

### PROOF CONDITION caught a real gap (DROP-PROOF discipline)
Wiring the canvas cell revealed CHECKPOINT-14's page cell had been passing via renderNode's **graceful
FALLBACK** (createInstance throws on `mosaic_components:mosaic_text` — the manager keys owned SDCs
**bare**: `mosaic_text`/`mosaic_image` — and the fallback renders the stored props, so `text` appeared
without a real child render). Corrected: fixtures now use the client's true format (bare id + real
`src/alt`), so both page + canvas cells exercise a **REAL** child render. `renderSingleComponent`
(canvas) has NO fallback, so the bad id showed as an empty prop — the canvas cell is the stricter proof.

### Saved JSON (from the round-trip cell — the live client shape)
```json
{ "nodes": {
  "«ext»card-…": { "type": "«ext»:card", "props": { "heading": "A card" }, "prop_fills": { "media": "mosaic_image-…" } },
  "mosaic_image-…": { "type": "mosaic_image", "props": { "src": "/example.jpg", "alt": "Chosen" } }
}}
```
The filled `media` carries NO text; on load it folds back to `{ __mosaicFill: { type: "mosaic_image", … } }`.

### FILMS — deterministic steps, NOT captured this pass (honest)
All CLICKS + typing (deterministic, per the picker-wrap DROP-PROOF learning), so filmable reliably; the
capture harness (js/e2e, headed) was not run this pass. Steps for the walk:
1. «ext» Card → panel Media row shows a text editor + **"+ Add image"**.
2. Click → row becomes **"Filled by Image"** + URL/alt fields; type a URL → canvas shows the `<img>`
   inside the library's card (no "example" badge). Save → page shows it. **Remove** → CKE5 editor back.
3. Content row → **"+ Add plain content"** → type body → canvas + page show it.
Every one of these is asserted at unit (`MosaicFillField.test.tsx`) + kernel (canvas + page real render).

### One source-grep oracle updated (additive signature)
`Sprint67SmokeTest::testRendererHasRenderSingleComponent` pinned the EXACT old signature string
(`renderSingleComponent(string $type, array $props): array`). The new optional `$fillNodes` param is
additive, so the oracle now uses a regex tolerant of the third param + the `array` return — an
oracle-change, not a behavior change.

### Gates
Kernel+Unit **3134 / 0** (8834 assertions, 3 skips, 1 warning; = CHECKPOINT-14's 3133 + the canvas-fill
cell; Sprint67 oracle fixed) · Vitest **713 / 1** (712 pass + B-101; **+19 new**) · tsc **0** · phpcs
**0** · phpstan **0 new** (4 pre-existing B-102) · owned oracles **REGION 14e6cb9c…3954 + STYLE
b7756795…ca982 4354 10** IDENTICAL · dist **BUMPED 1.0.76 → 1.0.77** (builder `4da2cd58` → `c2c99527`,
frontend-editor `5a64691b`; JS changed this pass). Ship count 81. Functional suite (separate from the
Kernel+Unit gate) noted below.

### Functional suite (SEPARATE from the Kernel+Unit gate) — 5 PRE-EXISTING failures, NOT mine
Running the full `tests/` dir surfaced `Functional 76: Errors 1, Failures 4` — investigated to confirm
none are CHECKPOINT-15 regressions (my changed code — `renderSingleComponent`/`canvas/ssr`/`fill_nodes`/
`prop_fills`/the rail — is referenced by ZERO Functional tests):
1. `MosaicTextSmokeTest::testUnknownComponentRendersPlaceholder` (ERROR) — the SAVE-validation hook
   (`MosaicHooks.php:216`, untouched this pass) rejects an unknown component type, so the test's node
   never saves. A test↔validation mismatch, not a render change.
2. `MosaicLibraryChangesReportTest::testReportPermissionParity` — report permission parity.
3–5. `MosaicSchemaVersionRenderTest::{testSchemaV2WithBreakpointStatesRendersDefaultLayout,
   testMigrationManagerUpgradesV1ToV2, testMigrationManagerIsNoOpForCurrentVersion}` — schema v1→v2
   migration.
All are save-validation / report-permission / schema-migration concerns, orthogonal to component fill.
The per-checkpoint gate has always been **Kernel+Unit** (3134/0 here); Functional drifted since Sprint 94
(40+ ships) unnoticed because it isn't gated. Ledgered as a pre-existing backlog item (B-FUNC-DRIFT).

**STOP — CHECKPOINT-15 filed. The component-fill CLIENT RAIL + canvas render are built + proven (add /
fill / edit / remove / round-trip / live-canvas / page — Vitest 713/1 + Kernel 3134/0); one source-grep
oracle updated (additive signature); 5 pre-existing Functional failures triaged as NOT mine. Headed films
documented as deterministic steps, not captured. Next: Part 3 (`slotted`/`is` keys + patterns "Card row" +
author guide + walk C/D). Ship #47 HELD.**

---

## CHECKPOINT-16 (P17 — PART 3 item 0: the FUNCTIONAL GATE) — ship #47 HELD

The 5 pre-existing Functional reds (B-FUNC-DRIFT, triaged NOT-mine at CHECKPOINT-15) are now DIAGNOSED +
FIXED, each with its mechanism recorded. **From this checkpoint on, Functional FULL is part of every gate
line.** This pass changed ONLY test files (no `src/`, no JS) — so owned render, dist, and the Kernel+Unit
count are untouched. PART 3 items 1–4 (SDC `is`/`slotted` keys, patterns "Card row", author guide, walk
C/D) are a large body of work honestly scoped below — patterns alone is ≈ the Tabs-redesign scale.

### The 5-red disposition (mechanism + old→new)
1. **`MosaicTextSmokeTest::testUnknownComponentRendersPlaceholder` → `…TypeIsRejectedAtSave`** — RETARGET.
   *Old:* save a `mosaic_nonexistent` layout, assert an empty `[data-mosaic-missing]` placeholder on the
   page. *Mechanism:* the presave `validateFull` hook (`MosaicHooks.php`) now REJECTS a layout that names
   a never-registered plugin — the node can't even save (EntityStorageException). *New:* assert the save
   guard fires. Pillar H's *populated* fallback (a component valid-at-save that later disappears) is
   Kernel-covered by `FallbackRenderTest::{testUnknownTypeRendersFallback,
   testDisableRendersFallbackReenableRestores}` (which build the layout directly, past the save guard, and
   assert the populated `data-mosaic-missing` wrapper — "not the old empty div"). *That* is the old→new for
   the render marker; it already lives at the Kernel level.
2. **`MosaicLibraryChangesReportTest::testReportPermissionParity`** — MECHANISM + FIX. *Mechanism:* the
   report rendered "No pages" — the setUp seeded the DISABLED `adopt_fixture` library FIRST, then deleted
   ALL library entities (a WC#95 auto-sync cleanup) INCLUDING it, so no OFF library remained to flag (the
   comment even said "seeds below", but the seed sat ABOVE the delete). *Fix:* reorder — delete the
   auto-synced entities FIRST, then seed `adopt_fixture` as DISABLED. Report now lists the Affected page
   under "Adopt fixture".
3. **`MosaicSchemaVersionRenderTest::testSchemaV2WithBreakpointStatesRendersDefaultLayout`** — ORACLE
   CHANGE. *Mechanism:* the renderer now emits RESPONSIVE breakpoint variants — a v2 `breakpoint_states`
   layout renders BOTH variants into the HTML, each wrapped in a `data-mosaic-bp="base"|"mobile"` container
   with a media-query `<style>` (`[data-mosaic-bp="mobile"]{display:none}@media (max-width:767px){…}`)
   switching visibility. So "Mobile Heading" IS in the HTML (CSS-hidden on desktop); Mink's text check is
   visibility-blind. *Old:* `pageTextNotContains('Mobile Heading')` (predated responsive output). *New:*
   assert both present, each within its `data-mosaic-bp` container.
4. **`MosaicSchemaVersionRenderTest::testMigrationManagerUpgradesV1ToV2`** — ORACLE CHANGE. Hardcoded `4`;
   the migration now reaches `MosaicLayoutValue::CURRENT_SCHEMA_VERSION` = **6** (V4→V5 + V5→V6 landed in
   ships #32/#33). *Fix:* assert against the constant (never stale again).
5. **`MosaicSchemaVersionRenderTest::testMigrationManagerIsNoOpForCurrentVersion`** — same as #4.

### Gates
Functional **FULL 76 / 0** (789 assertions, 2 skips; was 5 red; now green — the new gate member) · Kernel+Unit **3134 / 0**
(UNCHANGED — no `src`/JS/kernel-unit-test change this pass) · Vitest **713 / 1** (B-101; no JS) · phpcs
**0** (4 changed test files) · owned oracles **REGION 14e6cb9c…3954 + STYLE b7756795…ca982 4354 10**
IDENTICAL · dist **UNCHANGED** (1.0.77, builder `c2c99527`; no JS this pass — BUMP-LIBS applies when the
deferred client features land). Ship count 81.

### DEFERRED — PART 3 items 1–4 (the substantial remainder)
- **Item 1 — SDC `is:` / `slots.<x>.slotted:` keys** (core #3514072, a PROPOSAL not yet merged): reading
  them as child rules needs care because current Drupal SDC metadata validation may STRIP unknown keys
  before `getSlotDefinitions()`, so it likely needs raw-yml access + a category-match layer + a Kernel
  fixture. Tractable but not a one-liner.
- **Item 2 — Patterns** (profile `patterns:` key → palette "Patterns" section → shared-insert-path tree
  drop; «ext» helper "Card row" = owned Columns×3 each holding an «ext» Card, column repeater child = Card
  so "+ Add card" appears; cells + headed film): a full feature ≈ the Tabs redesign.
- **Item 3 — Author guide final** (`LIBRARY-AUTHOR-GUIDE.md`) + **Item 4 — WALK C/D rewrite + SHIP-47-PLAN
  regen**: these DOCUMENT items 1–2, so they follow the feature builds (documenting unbuilt features would
  mislead). The component-fill rail (CHECKPOINT-15) IS ready for the walk's step C once Part 3 lands.

**STOP — CHECKPOINT-16 filed. The Functional gate is GREEN (5 reds fixed, each with mechanism) and Functional
FULL now joins every gate line. PART 3 items 1–4 (SDC keys, patterns "Card row", author guide, walk C/D)
scoped as the remaining work — patterns is the anchor, the docs follow it. Ship #47 HELD.**

# WALK-CP-ADOPT-7 — the external-library acceptance oracle (plain words)

You (Arun) run this. **Every dev write is your hands** — enabling the library, ticking a component,
editing a `component.yml`, opening DevTools. The AI never enables the library. **One STOP per step.**
Film only the screens named; a step whose proof is a dev-config write is marked **"not filmed — your
hands."** Naming: the library is **"the external library"** everywhere; components are named by their
**display label** (Card, Button, …), never a machine id.

## The story (four lines)
The external library goes through every pillar. Each of its 47 components is discovered and graded;
its panels come from its own schema; its slots are drop zones; it renders with its own shadow-DOM
look on the page and the canvas; its data binds; it degrades to a fallback when removed and returns
byte-identical when restored — all while Mosaic's own twelve components never move a pixel.

## Before you start
- The external library is enabled at the **Drupal** level (module on) but **NOT** in Mosaic.
- Two terminals: one for `region-shasum.sh <url>`, one for `style-shasum.sh <url>`.
- A **Page** node you can edit (the reference is node/780 for the owned-render oracles).

---

## Step A — Discovery + grade  ·  Pillar A/B, SO-7  ·  *proves: honest readiness*
Go to **Component libraries**. The external library is listed with **47 components**, graded
**38 Ready / 9 Attention / 0 Blocked**. The 9 Attention rows name a single **typeless prop** each
(a `value` on **Button, Drupal button, Toggle, Text input, Checkbox, Radio button, Select,
Combobox**; a `media` on **Card**) — "no type has no known field shape". The library shows the note
**"styles in JavaScript (shadow DOM) — isolated from the page"** (SO-7 / G8), not a "may restyle"
warning. Its components carry a category.
**Your hands:** tick **Library enabled** → **Save**.
*Pass:* count 47; grades 38/9/0; each Attention names its typeless prop; the shadow-DOM note shows.
**Not filmed — your hands** (the tick + Save). **STOP.**

## Step B — Palette section  ·  Pillar A/F  ·  *proves: it drops in unchanged*
Content type **Page** → allow the external library (library-level switch). Open the builder on your
Page. The palette shows **the library's section**, its components listed by **display label**
(Card, Button, Accordion, …), **grouped by category**, with thumbnails where the SDCs declare them
(many will show a generic placeholder — SDCs without a thumbnail source).
*Pass:* the section appears; real labels; grouped by category; drag handles present.
*Film:* the palette section. **STOP.**

## Step C — Place Card, hydrated, panel-from-schema  ·  Pillar B/D/E  ·  *proves: own look + real fields*
Drag **Card** onto the canvas. It renders as a **hydrated web component** — its own shadow-DOM look,
non-zero box, **no flash** on first paint (the un-upgraded element is hidden then crossfades in;
P2/G9). Click it. The panel shows **its own fields with human labels** (G2): enum props are
**dropdowns**, the image object is a **media picker** (G5), formatted-text props open the **shared
CKE5 modal** (default format; the sheet ruling). State exactly which panel sections appear:
- **Content** (the card's own fields) — present.
- **Style** (component-level) + **Spacing** + **Visibility** — present at **top level**.
- **Data-binding** — only on props whose capability allows it (a plain string can bind; a closed
  enum / a raw prop cannot), never a per-prop Style/Spacing.
- The "no Style/Spacing **inside** the library's box" rule (SO-3/SO-4) does **not** apply here because
  the card is at top level — it applies only to a component placed **inside a foreign slot** (Step D).
*Pass:* hydrated (own look, no flash); the fields match the schema; the sections are exactly the set
above.
*Film:* the placed Card + its open panel. **STOP.**

## Step D — Slots inside the shadow DOM  ·  Pillar C, SO-5  ·  *proves: authorable slots + bare children*
Drag **Accordion** (a component with a slot). Inside its **shadow-projected slot**, the Mosaic drop
zone is **visible and hittable**, with the min/max banner **inside the zone bounds** (geometry). The
zone's **"+ Add"** offers **Plain content first**, then Mosaic's authorable components. Drop a Mosaic
**Heading** into the slot → it renders **bare in the library's own font** (SO-5: inside a foreign slot
the library owns the look; no Mosaic chrome). Type in a **Plain content** child → it takes the
library's look too.
*Pass:* zone visible + hittable in the projected slot; banner inside the zone; Plain content first;
a dropped Heading renders bare in the library font.
*Film:* the Accordion with its slot zone + the bare Heading. **STOP.**

## Step E — Data binding  ·  Pillar E, H9  ·  *proves: bound values + View-into-slot*
Bind the **Card**'s title (a string prop) to the **page title** (context) — the field shows the
Data-binding controls, and the canvas shows the page title in the card. Then bind the **Accordion**'s
slot to a **View** (View-field → prop map) — its rows render as **Cards (bare)** with a **result
line** ("N rows"). **Save.** Load the page anonymous and run **both shasums**; the page's computed
style **equals the canvas** (the library owns the look on both).
*Pass:* bound title shows (not copied); the slot shows the View's rows as bare Cards + result line;
page == canvas.
*Film:* the bind panel + the bound rows. **STOP.**

## Step F — Governance  ·  Pillar F, H8  ·  *proves: per-component control*
**Restrict** one library component (per-component switch on the library entity) → in the builder the
author **cannot see it** in the palette. **Disable** one component → it is **gone** from the palette.
Restore both.
*Pass:* restricted + disabled components vanish from the palette; both return on restore.
**Not filmed — your hands** (config writes). **STOP.**

## Step G — Schema update / drift  ·  Pillar G  ·  *proves: it tells you what changed*
Edit **one** `component.yml` in the library on dev: **add** an optional prop and **remove** one →
`drush cr`. Open a page using that component: the panel shows **Schema-changes notices** (added
appears silently; removed is kept-hidden + noticed; a type change is flagged), and **Reports → Mosaic
Schema changes** lists the same. **Revert** the edit → `drush cr` → the notices clear.
*Pass:* the four drift classes surface; the report matches; revert clears them.
**Not filmed — your hands** (the yml edit + cr). **STOP.**

## Step H — Removal / fallback  ·  Pillar H, M1  ·  *proves: never a white page*
**Untick** the external library → **Save**. Reload the Page anonymous: the components show the
**bounded fallback** in **template slot order** (rows kept; bound rows too), with the permission-gated
editor notice. Edit the node: the builder shows the **"Library missing" card** with the stored values
AND the **"{Slot} — bound to {View}"** line. **Reports → Mosaic library changes** lists the Page.
Fallback renders the same in **draft and published** (M1). **Re-tick** → **Save** → reload: the page
is **byte-identical** to before removal (region-shasum returns to baseline).
*Pass:* fallback (template order, rows kept, notice); missing-card keeps values + bindings; report
lists the page; re-enable is byte-identical.
*Film:* the fallback block + the missing-card "bound to" line. **STOP.**

## Step I — Two libraries, owned untouched  ·  SO-1/SO-2  ·  *proves: no collateral shift*
Olivero **and** the external library both ON. Reload **node/780** (owned Mosaic components) anonymous
and run:
```
ddev exec bash web/modules/custom/mosaic/scripts/qa/style-shasum.sh https://drupalak.ddev.site:33001/node/780
```
*Pass:* STYLE equals **`b7756795…ca982 4354 10`** and REGION equals **`14e6cb9c…3954`** — Mosaic's
owned components did not move a pixel with two adopted libraries enabled; the `--«ext»-*` token
namespace is disjoint from `--mosaic-*` (zero collision, P0 §4).
*Film:* the two equal shasums. **STOP.**

## Step J — Anonymous, behaviour live  ·  Pillar D  ·  *proves: hydrates for real, no errors*
Load the saved Page **anonymous**. The library's components render with their **JS behaviour live**
(hydrated shadow DOM — the ESM loaded via core's per-component library). Open **DevTools once**: the
custom elements are `:defined`, each has a `shadowRoot`, and the **console shows no errors**.
*Pass:* elements upgraded (defined + shadowRoot); no console errors.
*Film:* the page + a clean console. **STOP.**

---

## What this walk proves
The external library passes every pillar: discovered + honestly graded (A), drops into the palette
unchanged (B), renders hydrated with panel-from-schema fields (C), gives authorable slots that keep
the library's look (D), binds data and matches page-to-canvas (E), governs per component (F), reports
schema drift (G), degrades and returns byte-identical (H), never disturbs Mosaic's owned components
(I), and hydrates for real anonymously with no console errors (J).

## Standing matrix (regression rows added by this arc)
- **adopted grade is honest** — 47 discovered, 38 Ready / 9 Attention (each Attention names a typeless
  prop), 0 Blocked; shadow-DOM libraries reported "styles in JavaScript", not "may restyle". (P1)
- **adopted web component hydrates** — an adopted component renders as an upgraded shadow-DOM custom
  element on page AND canvas (its ESM injected once as `type="module"`), no flash. (P2/G9)
- **owned render byte-identical with adopted libraries on** — node/780 REGION `14e6cb9c…3954` +
  STYLE `b7756795…ca982 4354 10` hold with Olivero + the external library both enabled. (SO-1/2)

*Expected values above are drawn from the P0 discovery, the P1 re-grade, and the P2 hydration proof.
Steps A, F, G are marked "not filmed — your hands" because their proof is a dev-config write only you
may make.*

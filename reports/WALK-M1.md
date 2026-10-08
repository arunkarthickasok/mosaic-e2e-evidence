# WALK — M1 (ADOPT): the adopt-any-SDC story in one walk (Arun)

Site: `https://drupalak.ddev.site:33001`. «ext» = the real third-party (non-Mosaic) design-system library;
its machine name never appears here. One STOP per step; filmed screens only (machine-only checks — shasums,
Kernel oracles — are named in the backing, not walked). Album: `films/cp-adopt-9r-*/`.

**The story (four lines).**
1. **What changed:** across ships #42–#50 Mosaic learned to ADOPT any third-party SDC library — grade it, open
   it in the palette, author its components (widgets/labels/help/capabilities/patterns), bind their props and
   slots to data, and render them — with no change to Mosaic's own (owned) output.
2. **Why:** a site can author with its own design system's components in the same builder as Mosaic's, instead
   of being limited to Mosaic-authored components.
3. **What proves it:** this walk (reference library = the engine; «ext» = the real third party) plus the
   rehearsal reports — `REPORT-REHEARSAL-W0-W9.md`, `REPORT-REHEARSAL-AJ.md`, `REPORT-REHEARSAL-EXT.md`.
4. **Claim under test:** *a 47-component third-party design system authors, binds, and renders through Mosaic
   just as the owned library does — and owned output never changes.*

---

## ACT 1 — the engine, walked on the reference library

### 1 · W0 — the owned migration is a no-op (command)
Run **`ddev drush updb`**. EXPECT: `mosaic_update_10004`/`10006`/**`10007`** (the #50 re-qualify hook) run and
log their counts; **no rendered page and nothing in the builder changes**. → **STOP if updb errors, or any
owned/rendered node changes.** *(Command step — no screen; byte-identical backing in the report.)*

### 2 · W2 — Manage authoring → the builder rail follows
Screen: **`films/cp-adopt-9r-w0-w9/W2_3-builder.png`**. On **/admin/config/mosaic/component-libraries** →
**Manage authoring** for **Reference Card**, relabel a field and hide a non-required one, **Save**; open a
Reference-Card node in the builder. EXPECT: the rail reflects the new label, the hidden field is gone, and the
media fill rows read **"+ Add content"** — with **no cache clear**. → **STOP if the rail does not follow the
saved authoring.**

### 3 · W3 — H5 refuses hiding a required field
Screen: **`films/cp-adopt-9r-w0-w9/W3.png`**. Set a **library-required** field's widget to **Hidden**; **Save**.
EXPECT: a row error — *"… is required by the component and cannot be hidden."* — and **nothing saves**.
→ **STOP if it saves, or the error does not name the field.**

### 4 · W6 — an adopted image prop is a real media picker, and the page shows the image
Screen: **`films/cp-adopt-9r-w0-w9/W6.png`**. Open a Reference-Card node; the **Card Image** field is **our
media picker** (not raw `src`/`alt` boxes). Pick a media item; **Save**; view the node. EXPECT: the chosen
**`<img>` renders** on the page. → **STOP if the field is raw text boxes or the page shows no image.**

### 5 · W9 — patterns Show/Hide at the library → the palette follows
Screen: **`films/cp-adopt-9r-w0-w9/W9.png`**. On the libraries page, open a library's **Patterns** section;
**untick** one pattern's "Shown in palette"; **Save**; open the builder's Patterns panel. EXPECT: the unticked
pattern is **gone** (no cache clear); re-tick → it returns. → **STOP if the palette does not follow.**

---

## ACT 2 — the real third party («ext»)

### 6 · A — «ext» grades on the Component libraries page
Screen: **`films/cp-adopt-9r-aj/A-grade.png`** (the grading UI, shown on the reference library — the «ext»
admin surface is not filmed under the naming ban). EXPECT: a library's components carry a **Ready** grade badge
beside a **Restricted** column. **«ext» grades 47 Ready / 0 / 0** (probe-confirmed; report). → **STOP if the
grade/Restricted columns are missing.**

### 7 · C — place + a schema-built prop panel
Screen: **`films/cp-adopt-9r-rail/02-rail-selected.png`** (the schema-built panel; «ext» C probe-confirmed —
its rail labels the component, so it is not filmed under the ban). EXPECT: a placed adopted component exposes a
prop panel **built from its SDC schema** (controls + help from the prop descriptions). → **STOP if the panel is
empty or not schema-derived.**

### 8 · D — «ext» accordion slots + items render
Screen: **`films/cp-adopt-9r-ext/D-ext-accordion-render.png`**. EXPECT: the «ext» accordion renders its
populated `items` slot (real adopted slot + child components on a live page). → **STOP if the slot/items do not
render.**

### 9 · E — bind a Card title to the page title AND an Accordion slot to a View  ⟵ *Arun's eyes*
Screens: **`films/cp-adopt-9r-ext/E-prop-render.png`** + **`films/cp-adopt-9r-ext/E-slot-render.png`**
(node/1010, node/1011).
- **Prop binding (rows):** the Card's `heading` ← **Context · `entity.label`** (the page title).
  **RESULT:** the card's title on the page is **identical to the page title** (the stored placeholder never
  shows). See `E-prop-render.png`.
- **Slot binding (rows):** the Accordion's `items` slot ← **View · `cpve1_list:embed_1`**, row field
  `title` → child `text`, child type **`mosaic_heading`**. **RESULT:** the accordion lists the View's rows —
  **"CPVE1 Article 1" / "CPVE1 Article 2"** — and the static seed child is **hidden**. See `E-slot-render.png`.
- **FINDING E1 (Mosaic-side, #51 rider candidate):** the slot's child type is `mosaic_heading` (owned), NOT the
  «ext» accordion-item, because **`MosaicPropValidator::childDescriptors()` reads `getPropDefinitions()` — which
  is EMPTY for an adopted SDC** (adopted props live in `getDefinition().props.properties`) — so a field_map to
  an **adopted** child is wrongly rejected (*"prop 'heading' … does not exist"*). Same class as the CP-9
  x-allowed-schemes fix. The binding engine itself is correct (owned-child binding renders); only the
  adopted-child field_map validation needs the full-schema fallback.
→ **STOP if the card title does not mirror the page title, or the accordion does not list the View's rows.**

### 10 · H — library OFF → graceful fallback (content preserved), ON → byte-identical
Screen: **`films/cp-adopt-9r-ext/H-ext-fallback.png`**. Turn «ext» **OFF**; view an «ext» page. EXPECT: the
components are replaced by a **safe fallback that keeps all authored content** (no crash, no white page). Turn
«ext» **ON**; the page returns. → **STOP if content is lost or the page breaks.** *(Byte-identical on return —
region-shasum `9d8eee1e…8dd3` out and back — is the machine backing in the report.)*

### 11 · J — anonymous render, console clean
Screen: **`films/cp-adopt-9r-ext/J-ext-anon.png`**. Visit an «ext» page **logged out**. EXPECT: the «ext»
components render, and the **browser console has zero errors**. → **STOP if anything fails to render or the
console shows an error.**

---

*11 steps. Backing (machine-only, not walked): owned byte-identical invariant — region `14e6cb9c…3954` + style
`b7756795…ca982 4354 10` verbatim with «ext» ON and OFF (node/780); «ext» grade 47/47; H round-trip shasum
`9d8eee1e…8dd3`; the full gate for ship #50 (Kernel+Unit 3184/0, Functional 89/0). Reports:
`REPORT-REHEARSAL-W0-W9.md`, `REPORT-REHEARSAL-AJ.md`, `REPORT-REHEARSAL-EXT.md`. One open finding: **E1** (a
#51 rider candidate) — the adopted-child slot field_map validation. ADOPT closes on Arun's sign-off of this
walk.*

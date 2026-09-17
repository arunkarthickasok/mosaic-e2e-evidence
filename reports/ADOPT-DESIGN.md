# ADOPT — "Adopt any SDC" design packet (RATIFIED 2026-09-17 (delegated ruling, overrule open))
Date: 2026-09-16 · Author: reviewer window · Evidence base:
reports/PROBE-COMPONENT-PIPELINE.md (commit 1df630c) · Status: NOTHING
BUILT. No CP-ADOPT-n directive may issue until Arun ratifies §7.
Standing rule: no third-party library, vendor, region or organization
is named anywhere in this packet or its descendants. Acceptance uses
"the external library".

## 0. Problem statement (witnessed)
Mosaic cannot use a component it did not author. Sole admission gate:
SdcComponentDiscovery.php:45-48 — a component is dropped unless BOTH
`.component.yml` and Mosaic's private `.mosaic.yml` exist. Live diff:
15 SDC ids on dev, 14 in Mosaic's registry; `olivero:teaser` excluded
for that reason alone. Consequences: SDC `slots:` never parsed
(Q4); render is direct Twig, not core `#type=>component` (Q5,
MosaicRenderer.php:785-793), so a component's own CSS reaches the page
via core auto-attach but NOT the builder canvas / Tier-B SSR JSON
(CanvasPreviewController.php:103 returns html only) / iframe;
`component_package` is schema-only, zero consumers,
hasDefinition()=false (Q6); five panel sections added to every
component unconditionally (MosaicPuckAdapter.ts:598-623, Q8);
registry ids strip the provider prefix (Q1).

## 1. The movie (target experience, plain words)
S1 Site builder installs a component-library module built the standard
Drupal way. Mosaic → Component libraries lists it with a readiness
status per component (Ready / Attention / Blocked). She flips it ON
and ticks allowed libraries + components per content type. No code.
S2 Author drags "Hero" in; the right panel shows exactly Hero's own
fields with the library's labels — no section a field can't use. It
renders on the canvas with the library's own CSS.
S3 "Card Grid" has a slot → drop zone; only allowed children accepted,
violation shown not silently refused. Heading bound to page title;
the zone bound to a View — each row becomes a Card via its own fields.
S4 Library v2 ships: new optional prop appears silently; removed prop
kept-but-hidden with a notice; type changes flagged in a report. No
page breaks.

## 2. World scan (sources in reviewer transcript; summary)
Canvas: SDC slots build the tree, prop shapes map to field types /
widgets (alterable), $ref forward-port, versioned instances, strict
schema gate rejected most contrib/theme SDCs (slots-only SDCs), SDC
spec gaining slot restrictions / variants / internal.
UI Patterns 2: any SDC → form from props+slots; sources gated by prop
type; variants with labels; "Unknown ⚠️" honest state; sdc_devel audit.
Builder.io: registerComponent inputs, canHaveChildren,
childRequirements, defaultChildren, requiresParent, hideFromInsertMenu.
Figma Slots GA: minChildren/maxChildren/allowPreferredValuesOnly/
displayEmptyByDefault + limitViolations.
AEM Universal Editor: definitions / models / filters triad; library
markup is the untouchable contract.
Failures learned from: Gutenberg (markup-coupled storage → invalid-
content errors, lossy recovery); WPBakery/Divi (plugin off → page
gone); Layout Builder (orphaned revisions, per-instance entities,
overwhelming palette); Webflow DevLink (copied code overwritten, slots
unsupported, rewritten IDs break CSS); Sanity (design-driven modelling
→ duplicated entities, variant explosion).

## 3. Pillars (A–H)
A DISCOVERY — admit every SDC on the site; sidecar becomes optional
  enhancer; slots-only SDCs admitted (no props = no props); readiness
  grade per component (Ready: all props map; Attention: some prop fell
  to raw fallback — names prop + reason; Blocked: unusable) with
  Blocked hidden by default; read `group` (category), `replaces`,
  `internal`, slot restrictions, `variants` so Canvas-targeted
  libraries drop in unchanged.
B PANEL FROM SCHEMA — PHP prop-shape registry (alterable): string→text;
  string format uri/uri-reference→link; string contentMediaType
  text/html→formatted text (CKE5, text-format enforced); enum /
  variants→select with labels; boolean→toggle; integer|number(+min/
  max)→number; object with known $ref (image/media/link/attributes)→
  matching field type; array of objects→repeatable; unknown→raw text +
  Attention. Emits ABSTRACT descriptors (H3); Puck adapter maps last.
  Translatable-by-shape flag (string/html/uri) for the i18n ADR.
C SLOTS — SDC `slots:` → Puck slot fields (storage unchanged:
  nodes[id].slots.{zone}); rendered as core `#slots`; rules per slot:
  allowed / preferred children, min/max, default children, empty
  display; violations surfaced visibly. Sidecar may ADD rules, never
  redefine slot ids (H7).
D RENDER — adopted components via core `#type=>component` (#props,
  #slots, #variants, #attributes only — library markup/IDs/classes
  never rewritten); Mosaic's own 12 stay direct-Twig for 1.0 (HYBRID),
  all-in migration = 1.1 ADR. Canvas fix: builder route attaches
  enabled libraries' assets; Tier-B SSR returns attachments with html;
  iframe attaches the same; adopted components are ALWAYS SSR in the
  canvas (no React scaffold).
E DATA BINDING, TYPED — per-prop binding gated by shape (string shapes
  ← fields/tokens; media shapes ← media/image fields; slots ← Views/
  lists with a View-field→prop mapping, views_row_sdc shape). Entity
  binding SHOWS an entity, never copies it. Field types declare
  capabilities (bindable / breakpointable / stylable); the five panel
  sections appear only where a capability says so. (Absorbs the
  panel-semantics item.)
F LIBRARIES + GOVERNANCE — promote `component_package` to a real
  "Component library" config entity, auto-created per provider on
  discovery: status, components[] with per-component enabled +
  restricted (H8), thumbnail source, readiness summary; palette
  sections by library; node-type allowlist gains library-level switch
  + per-component refinement; variant governance at library level;
  the admin page doubles as living docs from schema. Exportable
  config. Decide fate of `default_component_package: base` (no
  consumer) in the truth pass.
G UPDATES — per-instance schema hash over BEHAVIOUR keys only (type,
  enum, required, $ref, format, contentMediaType, items, properties,
  slot ids; NOT title/description/examples); new optional prop appears
  silently; removed prop kept-but-hidden + notice; type change
  flagged; "library changes" report. Full versioned upgrade = 1.1.
H GRACEFUL DEGRADATION — fallback renderer shows stored values in a
  plain accessible template (children rendered) when a library/
  component is missing; builder shows "library missing" card with
  values intact; affected-pages report. Theme-bound libraries flagged
  (H6). Never a white page.

## 4. Pinned contracts (decide-once, before CP-ADOPT-1)
H1 adopted ids = full `provider:id`; Mosaic's 12 keep bare ids via
   alias map (no saved-layout change).
H2 discovery DERIVES from core `plugin.manager.sdc` (definitions,
   cache invalidation, core $ref resolution); Mosaic only decorates.
H3 abstract field descriptors in PHP; Puck mapping is the last step.
H4 default policy: schema `default` → `examples[0]` → type-empty;
   required prop with neither → Attention.
H5 save-time validation through the prop-shape registry (core validates
   only under assertions); HTML-bearing props always via text format.
H6 module libraries first-class; theme libraries admitted + flagged
   theme-bound; H fallback covers theme switch.
H7 SDC descriptor is truth for slot ids; sidecar adds rules only.
H8 `restricted` lives on the library entity per component (config).
H9 Views-into-slot = explicit View-field→prop mapping model.

## 5. Acceptance oracle (tag-gating)
Install the external library on dev; enable in Mosaic; walk: every
component listed with name/thumbnail + grade → panels match schema →
slots are drop zones → child rules bite with visible violation →
renders with own CSS on PAGE and CANVAS → string-prop and slot data
binding → library update (add + remove a prop) leaves pages intact →
uninstall → fallback renders + report. `olivero:teaser` = day-one
smoke. Geometry + Permission-Parity dimensions apply.

## 6. Proposed CP order (after ratification)
CP-ADOPT-1 = A + F + H1/H2/H8 + olivero:teaser smoke.
CP-ADOPT-2 = B + H3/H4/H5. CP-ADOPT-3 = C + H7. CP-ADOPT-4 = D (canvas
attachments). CP-ADOPT-5 = E + H9 (absorbs panel semantics).
CP-ADOPT-6 = G + H + H6. CP-ADOPT-7 = §5 oracle walk. Each CP:
probe-then-report, RED→GREEN, derived matrices, eye-test before ship.

## 7. Decision sheet (Arun)
D1 admission: admit-all-and-grade (lean) vs sidecar-or-Ready only.
D2 derivation in PHP (lean) vs TS.
D3 render: hybrid for 1.0 (lean) vs all-in core element.
D4 promote component_package → Component library entity (lean yes).
D5 scope: A–H + cheap G in 1.0; registry/headless/full versioning 1.1.
D6 external-library oracle walk = tag-gating acceptance.
D7 naming: "Component library", "Adopt", Ready/Attention/Blocked.
D8 contracts H1–H9 pinned as written.
D9 campaign order: ADOPT first; author-trust slice; backend config
   audit; Wave D; Wave F; Wave G; minimal ACT 2; soak; tag.

### §7 RULINGS — RATIFIED 2026-09-17 (delegated: "you are sole responsibility to this now so take a right call"; recorded as Arun's; overrule open)
D1 admit-all-and-grade, Blocked hidden.
D2 derivation in PHP.
D3 hybrid render 1.0, all-in = 1.1 ADR.
D4 promote component_package → Component library config entity, auto-created.
D5 scope A–H + cheap G in 1.0; registry/CEM, headless, versioned upgrades, render migration = 1.1.
D6 external-library oracle walk = tag-gating.
D7 names: Component library / Adopt / Ready-Attention-Blocked.
D8 H1–H9 pinned.
D9 order: 0 ADOPT → 1 author-trust slice (D-1, D-2, D-3-hide, F-095, D-8, D-14) → 2 backend config audit (+M3) → 3 Wave D (+M1 Kernel cells) → 4 Wave F (+M2 RC-A3 keyboard-drag spike, RC-A2 alt-text; +M4 F-081, F-079) → 5 Wave G (+M1 live walk) → 6 minimal ACT 2 (consistency + ugliness only; F-037 → 1.1 labelled) → 7 dev push → soak → tag 1.0.0 + truth pass (+M1 ADR).

## 8. Post-ratification additions (M1–M7, ruled 2026-09-17)
M1 moderation: Kernel cells at Wave D, live walk at Wave G, ADR at the truth pass.
M2 as above (RC-A3 keyboard-drag spike + RC-A2 alt-text at Wave F); RC-A1 Schema.org → 1.1.
M3 onboarding links (setup-status page, three-role permission recipe) folded into the backend config audit; the audit sizes them: S = pre-tag, otherwise labelled post-tag.
M4 as above (F-081, F-079 at Wave F); D-6 → 1.1, R-C5 → post-tag.
M5 F-037 media picker → 1.1.
M6 production sites → post-tag (Northstar §5).
M7 Northstar P-DEV amended.
Panel-semantics item ABSORBED by ADOPT Pillar E. Timeline of record: 6–7.5 weeks to tag.

### §8 acceptance riders where a11y + moderation touch ADOPT
- **RC-A3 (keyboard operability):** Pillar C child rules (allowed/preferred children, min/max, drop into slot)
  MUST be keyboard-operable — the §5 oracle walk includes a keyboard-only pass over slot drop + child-rule
  violation. (Builder keyboard-drag itself is the RC-A3 spike, Wave F.)
- **RC-A2 (alt text):** any image/media prop surfaced by Pillar B/E requires an accessible-name path (alt/label)
  in its field; the oracle checks a bound media prop carries alt.
- **M1 (moderation) fallback rider:** Pillar H graceful degradation MUST render the fallback in BOTH draft and
  published states (a missing library must never white-page a moderated/unpublished revision either).

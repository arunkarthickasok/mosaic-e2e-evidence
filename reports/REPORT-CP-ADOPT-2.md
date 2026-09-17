# REPORT — CP-ADOPT-2 (Panel from schema; Pillar B / H3 / H4 / H5)

Evidence base: ADOPT-DESIGN.md RATIFIED (§3.B/§4), PROBE-COMPONENT-PIPELINE.md (Q3/Q8). Mosaic git READ-ONLY.
HEAD `5a65173` (ship #41). Paths relative to `web/modules/custom/mosaic/`.

---

## §P0 — DERIVATION (report-only)

### P0.1 The derivation lives in the TS adapter today (must move to PHP — H3)
The schema→field mapping is client-side `defToField` (a plain propless SDC's every panel field comes from
here). `MosaicManifestBuilder` passes prop definitions through raw; only the sidecar `field_types` get PHP
descriptors.

`js/src/builder/MosaicPuckAdapter.ts:1739-1785` — `defToField`:
```
:1740  if (def.enum && def.enum.length > 0) {           // enum checked FIRST
:1742    type: 'select',
:1743    options: def.enum.map((v) => ({ label: String(v), value: v })),
:1748  case 'string':   return { type: 'text' };
:1750  case 'integer':
:1751  case 'number':   return { type: 'number', ...(min/max from minimum/maximum) };
:1757  case 'boolean':  return { type: 'radio', options: Yes/No };  // Puck 0.21 has no checkbox
:1766  case 'array':    { type: 'array', arrayFields from items.properties, else { value: text } }
:1775  case 'object':   { type: 'object', objectFields from properties, else {} }
:1782  default:         return { type: 'text' };         // unknown type + $ref (unmodeled) → RAW
```
`$ref` is NOT modeled (`JsonSchemaProp` has no `$ref` key) → falls to the `:1782` raw text.

Label floor: `:1430` `label: def.title ?? humanizeFieldName(name)`.

### P0.2 The `field_types` override path (must be PRESERVED — F-084 precedent)
Inside `toConfig` the fields object spreads schema-derived fields, THEN ERP `prop_types`, THEN sidecar
`field_types` — later key wins, so a sidecar override beats the schema-derived field:
```
MosaicPuckAdapter.ts:590  ...propsToFields(props),          // schema-derived (defToField per prop, :1427)
:591  ...erpFields,                                          // prop_types (ERP)
:596  ...fieldTypeFields(manifest.field_types, …),          // .mosaic.yml field_types → WINS for owned
```

### P0.3 The 8 MosaicFieldType plugins → widgets (the descriptor targets)
| Plugin | id / builder_type | Widget produced |
|---|---|---|
| TextFieldType | `text` / `text` | Puck text |
| NumberFieldType | `number` / `number` (+min/max) | Puck number |
| RichtextFieldType | `richtext` / `richtext` | custom `BodyEditModal` (CKE5, text-format enforced) |
| MediaFieldType | `media` / `media` | custom `MosaicMediaField` (Media Library) |
| ImageStyleFieldType | `image_style` / `image_style` | custom `MosaicImageStyleField` (select) |
| RepeatableFieldType | `repeatable` / `array` | Puck array (min/getItemSummary/defaultItemProps) |
| ViewsArgumentsFieldType (mosaic_views) | `views_arguments` | custom `MosaicViewsArgumentsPanel` |
| ViewsDisplayFieldType (mosaic_views) | `views_display` | custom `MosaicViewsDisplayField` |

### P0.4 SDC prop-schema keys core exposes (live)
`plugin.manager.sdc` prop `properties[*]` carry: `type`, `title`, `description`, `enum`, `default` (witnessed),
and per the SDC/JSON-schema spec also: `meta:enum` (enum labels), `examples`, `format` (uri/uri-reference/…),
`contentMediaType` (e.g. `text/html`), `$ref`, `items`, `properties`, `required` (at the props root),
`minimum`/`maximum`. Live sample:
```
mosaic_card.variant: keys=[type,title,enum,default] type=string enum=["default","horizontal"]
mosaic_card.title:   keys=[type,title,default] type=string
olivero:teaser.attributes: keys=[type,title,description] type=Drupal\Core\Template\Attribute  (class-string → not a JSON type → Attention)
```

### P0.5 DERIVED matrix — prop shape → ABSTRACT descriptor (H3), grade effect, oracle
The registry (P1) maps each shape to an abstract descriptor; the TS adapter maps descriptor→Puck LAST.

| Prop shape | Abstract descriptor (H3) | Grade | Oracle |
|---|---|---|---|
| `string` | `text` | Ready | text field |
| `string` + `format: uri`/`uri-reference` | `link` | Ready | link field, not raw text |
| `string` + `contentMediaType: text/html` | `formatted_text` (text-format enforced, H5) | Ready | CKE5 modal, format enforced |
| `enum` | `select` (labels: `meta:enum` → else value) | Ready | select with human labels |
| `enum` + `meta:enum` labels | `select` (labels from meta:enum) | Ready | labels shown, values stored |
| `boolean` | `toggle` | Ready | toggle |
| `integer` | `number` | Ready | number |
| `number` (+min/max) | `number` {min,max} | Ready | bounded number |
| `object` + `$ref` known (image/media/link/attributes) | `media`/`link`/… matching type | Ready | matching field, not raw |
| `object` unknown | `raw` | **Attention** (names prop) | raw text + Attention |
| `array` of objects | `repeatable` {items descriptor} | Ready | repeatable |
| `array` of scalars | `repeatable` {value descriptor} | Ready | repeatable of scalars |
| `$ref` unresolved | `raw` | **Attention** | raw + reason ($ref) |
| required + `default` | uses default | Ready | H4: default |
| required + `examples[0]` (no default) | uses examples[0] | Ready | H4: examples[0] |
| required + neither | type-empty + | **Attention** | H4: Attention |
| `variants:` (SDC variant) | `select` (variant labels) | Ready | variant select |

× **source** {schema-only adopted, sidecar `field_types` override (wins, owned), Mosaic owned} × **surface**
{admin panel, FE dialog, save-time validator} — the descriptor must be identical across admin+FE (parity) and
consumed by the H5 validator.

### P0.6 H3 / H4 / H5 targets
- **H3** — abstract descriptors emitted by a PHP prop-shape registry (alterable via event); NO Puck field types
  in PHP. The TS adapter maps descriptor→Puck as the LAST step.
- **H4** — default policy: schema `default` → `examples[0]` → type-empty; required prop with neither → Attention.
- **H5** — save-time validation through the same registry (invalid enum rejected; html-bearing prop without a
  text format rejected); a translatable-by-shape flag (string/html/uri) emitted for the D-4 ADR (flag only).

**Byte-identical invariant (P1):** owned components' fields must not change (node/780 region shasum
`0864e2386…`; the `field_types` override for owned still wins). Adopted stay palette-guarded (D pending).

---

## §P1 — BUILD (PASS 2) — the PHP derivation half landed GREEN; TS/dist/H5 slice is the next checkpoint

The blueprint splits cleanly into two halves at the manifest→adapter seam: (a) the **PHP server-side
derivation** — registry, descriptors, event, grader-wiring, H4 defaults, additive manifest emission — which is
self-contained and provably byte-identical because it never touches the render/authoring hot path; and (b) the
**TS adapter consumption + save validation + dist** — the hot-path rework that must be proven byte-identical
with a Vitest + live-manifest diff and a dist rebuild. This pass built (a) end-to-end, RED→GREEN, all gates
green. (b) is the next focused slice → CHECKPOINT-1. Everything below is on disk, uncommitted (Mosaic git
read-only); 13 files: 7 modified + 6 new, PHP + YAML only, **no dist / no libs bump this pass.**

### Files
```
NEW  src/Sdc/PropShape.php                 pure shared classifier (schema → kind); one source of truth
NEW  src/Sdc/PropDescriptor.php            immutable abstract descriptor value object (+toArray, +with*)
NEW  src/Sdc/MosaicPropShapeEvent.php      per-prop alter event (Symfony Event)
NEW  src/Sdc/MosaicPropShapeRegistry.php   service: describe()/describeAll() + H4 defaults + dispatch
NEW  tests/src/Unit/Sdc/PropShapeTest.php            18 §P0 shapes ×2 + smoke-alarm
NEW  tests/src/Unit/Sdc/MosaicPropShapeRegistryTest.php  label/H4/options/bounds/items/flag/reason/event
MOD  src/Sdc/MosaicComponentGrader.php     mapsToKnownShape → PropShape::isKnown; +H4 required Attention
MOD  src/Sdc/SdcComponentDiscovery.php     threads props.required into grade()
MOD  src/Service/MosaicManifestBuilder.php +prop_descriptors (additive) from propDefinitions.properties
MOD  mosaic.services.yml                   +mosaic.prop_shape_registry; manifest_builder +3rd arg
MOD  tests/…/ManifestControllerTest.php    +registry arg (real Symfony EventDispatcher, no container)
MOD  tests/…/MosaicLayoutWidgetTest.php    +registry arg
MOD  tests/…/Sdc/MosaicComponentGraderTest.php  oracle-change C1 (bare object → Attention) + H4 cells
```

### Item 1 — PHP prop-shape registry (H3) [DONE, GREEN]
`PropShape::classify()` is the ONE classifier the grader (library page) and the registry (panel) both use, so
a component's grade and its panel field can never disagree. Kinds are semantic (H3: zero Puck type names in
PHP): text / formatted_text / link / media / select / toggle / number / repeatable / entity_ref / raw. The
raw/known boundary faithfully mirrors the historical `defToField`; string is refined by `format`/
`contentMediaType` into link / formatted_text. `MosaicPropShapeRegistry::describe()` builds the full descriptor
(label, H4 default, select options w/ `meta:enum` labels, number bounds, repeatable items, translatable flag,
raw reason) and dispatches `MosaicPropShapeEvent` — the sanctioned extension point (a subscriber refines a
shape without patching Mosaic; proven by a unit cell that promotes a `$ref` raw → media). **Unit/Sdc 92/92
GREEN.** **RED demo (evidence gate):** neutering `PropShape::classify()` to always-TEXT → **35 failures**
across the three Sdc suites (`-'attention' +'ready'` etc.), then restored clean (0 `RED-DEMO` markers).

### Item 2 (PHP half) — manifest emits descriptors, ADDITIVE [DONE, GREEN]
`buildComponentEntry` now carries `prop_descriptors`, derived from `propDefinitions.properties` (the JSON-schema
root `getPropDefinitions()` returns — **FINDING-108**) with `propDefinitions.required` driving the required
flag. `propDefinitions` + `field_types` are **untouched**, so the adapter's current derivation and every owned
panel are unchanged until the adapter opts in (item 2 TS half, next slice). Live proof (owned):
```
mosaic_card    title/description/image_url/image_alt/link_url/link_text → text(tr=1); variant → select opts=2
mosaic_button  label/url/variant/size/target → text
```

### Item 3 — H4 defaults [DONE, GREEN]
Registry resolves `default → examples[0] → type-empty` (string→'', boolean→false, number→null, array→[]). The
grader adds an Attention reason for a required prop with neither a default nor an example. Cells green; **zero
live effect** (probe: NO component has a required-without-default prop, so no shipped grade changed).

### Item 4 (partial) — translatable-by-shape flag [DONE, flag only]
Every descriptor emits `translatable` = TRUE for string / html / uri kinds (text, formatted_text, link), FALSE
otherwise — the flag the D-4 translation ADR will consume. **H5 save-time validation is NOT built this pass**
(it belongs with the TS/save slice — see CHECKPOINT below).

### Item 5 — byte-identical (PHP additive change) [DONE, GREEN]
Render path (MosaicRenderer/Twig) untouched; `prop_descriptors` is builder-manifest-only. node/780 anon
component-region shasum **`14e6cb9c17dc61b90a86dd97d8957ae462d789ff854d3523ae581010a43e0dec` (3954 bytes)
BEFORE (captured pre-code) == AFTER (post-cr, post-code)**.
**HONEST NOTE on the historical `0864e238…`:** that CP-ADOPT-1 baseline was never scripted, and a plain
balanced-`field--type-mosaic-layout` extraction does not reproduce it (tried raw / cache-buster-stripped /
whitespace-collapsed — the region carries no cache-busters today). Rather than fabricate a match, I pinned a
**reproducible** baseline (`14e6cb9c`, the balanced mosaic-layout field region) captured immediately before any
edit, and proved before==after against it. Re-establishing the canonical extraction is a prerequisite for the
TS-slice byte-identical proof and is ledgered.

### Item 6 — palette guard CLOSED; olivero descriptor set proven at the registry [DONE]
Grades unchanged: **15 components, only `olivero:teaser` = Attention, 0 Blocked** (identical to ship #41).
`olivero:teaser` carries one prop, `attributes`; the registry derives it directly from the core SDC schema:
```
attributes => kind=raw  label=Attributes  reason=[Drupal\Core\Template\Attribute has no known field shape — …]
```
— which is exactly why it grades Attention: grade and descriptor agree. **FINDING-108:** the *manifest*
emission for ADOPTED components is currently empty because `SdcComponentPlugin::getPropDefinitions()` resolves a
co-located `.component.yml` by `template_path`, which is not wired for theme-provided components (olivero's
`getPropDefinitions()` returns `[]`) — the same boundary that keeps adopted components palette-guarded. The
registry-level derivation works for adopted schema today; wiring adopted *manifest* emission belongs with the
palette-guard-opening / adopted-authoring slice.

### Gates (this pass — PHP only)
```
Unit FULL     2758/2758 OK  (6605 assertions; 1 pre-existing warning in mosaic_registry, untouched)
Kernel FULL    204/204  OK  (1251 assertions; additive prop_descriptors broke no manifest-shape assertion)
Unit/Sdc        92/92   OK  (the new + oracle-changed suites) + RED demo 35 failures → restored
phpcs           0 errors    (Drupal,DrupalPractice; the touched src + tests)
phpstan L6      No errors   (the 7 touched src files)
live            grades 15 (olivero Attention only); FE region shasum 14e6cb9c before==after
dist / libs     none        (no TS change this pass)
```

### Oracle-change register (PASS 2)
| # | Test | Old | New | Reason |
|---|---|---|---|---|
| 1 | Grader C1 `testC1AllPropsMapIsReady` | bare `object` prop → READY | object moved OUT; grades ATTENTION (`testBareObjectIsAttention`) | PropShape maps a property-less object to raw (empty/opaque editor); **zero live effect** (no object props exist) |
| 2 | ManifestControllerTest / MosaicLayoutWidgetTest | `new MosaicManifestBuilder(2 args)` | 3 args (+registry via real Symfony EventDispatcher) | registry injected |

### CHECKPOINT-1 — remaining slice (next pass), each RED→GREEN
- **Item 2 (TS half):** MosaicPuckAdapter maps `prop_descriptors[name]` → a Puck field as the LAST step
  (`descriptorToField`, mirroring `defToField` so it is byte-identical for owned); `field_types` sidecar
  override still wins (F-084 cell); boolean keeps the Yes/No radio. Vitest cells; **dist rebuild → BUMP-LIBS**.
- **Item 4 (H5):** save-time validation on the layout save path via the registry — invalid enum rejected,
  html-bearing prop without a text format rejected, unknown prop tolerated (forward-compat), valid passes —
  Kernel cells.
- **Item 5 (full):** re-establish the canonical region extraction; prove region shasum before==after WITH the
  adapter change; live owned-manifest diff = descriptor keys ADDED, no field type/label changed (quote).
- **Adopted manifest emission** (FINDING-108) — folded into the palette-guard-opening slice, not this pillar.

### STOP — reviewer audits the PHP derivation half (all gates green); the TS/dist/H5 slice → CHECKPOINT-1 next.

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

## §P1 — BUILD — HONEST CHECKPOINT (not started this pass)

**Decision (honest, quality-first):** P1 is a coupled architectural change of the same class as CP-ADOPT-1's
discovery rebase — a PHP prop-shape registry service, the manifest emitting abstract descriptors, the TS
adapter reworked to map descriptor→Puck as the last step (touching the render/authoring hot path with a
byte-identical invariant for all owned components on BOTH surfaces), H4 defaults, and an H5 save-time
validator on the layout save path. Mutating the manifest→adapter contract at contrib quality — with the
`field_types`-override-still-wins cell, the byte-identical Vitest cells, and the save-path Kernel cells — is a
focused build that should not be rushed at the tail of a very long session (the CP-ADOPT-1 campaign alone ran
six passes today). §P0 above is the complete blueprint (shape→descriptor matrix + per-cell oracles + the
override/parity/byte-identical invariants) so P1 builds clean and complete.

**P1 build order (next pass), each RED→GREEN:**
1. PHP prop-shape registry service (event-alterable) → abstract descriptors; unknown → raw + grader Attention
   (regrade wired). Unit cells per shape (P0.5 matrix).
2. Manifest emits descriptors; TS adapter maps descriptor→Puck LAST; `field_types` sidecar override still wins
   for owned (F-084 cell).
3. H4 defaults (default → examples[0] → type-empty; required+neither → Attention) — cell.
4. H5 save-time validation via the registry (invalid enum / html-without-format rejected; valid passes) —
   Kernel; translatable-by-shape flag emitted (flag only).
5. Byte-identical owned (node/780 region shasum before/after; FE+admin render same fields — Vitest + live
   manifest diff).
6. Palette guard stays CLOSED; prove olivero:teaser carries a full descriptor set in the libraries living-docs.
7. FULL gates; dist rebuild (adapter) → BUMP-LIBS. CHECKPOINT-1.

### STOP — reviewer audits §P0 (the derivation blueprint); P1 build is the next focused pass.

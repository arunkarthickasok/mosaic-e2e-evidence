# REPORT — CP-ADOPT-8 P0 (Canvas-dialect shapes) — blueprint, report-only

> Report-only. NO Mosaic code changed; the library's Canvas submodule («ext-canvas») was **read from
> disk, never enabled**. Naming ban: the library is «ext», its Canvas submodule «ext-canvas». All numbers
> below are from a disk-only inventory of «ext» **1.20.0-beta1** (47 base components + «ext-canvas»),
> parsed with Symfony YAML — not from memory or the older grading.

## 0. Headline (what the evidence actually says)
The premise "9 typeless props" is **STALE** — «ext» updated to 1.20.0-beta1, and a fresh disk parse finds
**0 props without a `type` key**. The library is now well-typed and expresses its "shapes" two ways:
- **`contentMediaType`** (standard JSON Schema) — **24** props carry `contentMediaType: text/html` (rich
  HTML → CKE5). Base «ext» uses **no** Canvas `$ref` at all.
- **Canvas `$ref`** — exactly **1** occurrence, and only in the never-enabled **«ext-canvas»** submodule:
  `json-schema-definitions://canvas.module/image`.

So CP-ADOPT-8's real job for THIS library is small and precise: (a) read `contentMediaType` properly, (b)
resolve `json-schema-definitions://<ext>/<def>` for Canvas-ready libraries **without Canvas installed**,
(c) merge structurally-identical shapes. The re-grade forecast is already **47/47 Ready** for base «ext»
under CP-ADOPT-7's classifier + a small `contentMediaType` rule — before any Canvas work.

## 1. `$ref` + shape-key inventory (disk-parsed, «ext» 1.20.0-beta1)

### Distinct `$ref` strings × count
| `$ref` | count | where |
|---|---|---|
| `json-schema-definitions://canvas.module/image` | **1** | «ext-canvas»/card `image` prop only |

Base «ext» (47 components): **0** `$ref`.

### Canvas-dialect / shape keys × count (base «ext»)
| key | count | meaning → descriptor |
|---|---|---|
| `contentMediaType: text/html` | **24** | rich HTML → CKE5 (formatted_text) |
| `contentMediaType: image/*` | 1 (nested in `card.image.src`) | image URL → media/URL |
| `meta:enum` | **0** | — |
| `x-formatting-context` | **0** | — |
| `enum` (plain) | **39** | → select |

### Prop `type` distribution (base «ext», top values)
`string|null` 253 · `boolean|null` 114 · `string` 20 · `integer|null` 12 · `string|integer|number|null` 5
· `string|integer|null` 3 · `array|null` 3 · `object` 1 · `string|object|null` 1.

### Which of the "9 typeless" props are `$ref`-only?
**None — there are 0 typeless props.** Verdict recorded in §Typeless below.

## Typeless-props verdict
The earlier "9 typeless" count does **not** reproduce against «ext» 1.20.0-beta1: **0 props lack a `type`
key**, **0** are `Drupal\Core\Template\Attribute`-typed, **0** are `object` with no `properties`. The
grades that remain "Attention" now come from **union-with-object/array** props (`string|object|null` ×1,
`array|null` ×3, `object` ×1), not typelessness — and CP-ADOPT-7 P1's nullable-union classifier already
handles the common `…|null` unions. **Conclusion:** typelessness is no longer a real gap for this library;
the shape work is about `contentMediaType` + Canvas `$ref`, not bare props.

## 2. «ext-canvas» read FROM DISK (never enabled)
- **«ext-canvas» `.info.yml`**: `type: module`; `core_version_requirement: ^11`; **`dependencies:
  [«ext»:«ext», canvas:canvas]`** (requires the Canvas module — which is **NOT on disk** in this
  checkout, so its `$defs` cannot be quoted here); version `1.20.0-beta1`.
- **Files**: exactly one component — `components/card/{card.component.yml, card.twig, assets/card-default.jpg}`.
  **No `schema.json`, no `*.module`, no `*_prop_shape_alter` hook, no PHP.** It is a pure component override.
- **The `$ref` prop** (canvas card `image`):
  ```yaml
  image:
    title: Card Image
    description: Image displayed at the top of the card when rich media HTML is not provided.
    $ref: json-schema-definitions://canvas.module/image
    type: object
    default: …
  ```
  Note it declares **both** `$ref` and `type: object` — the `$ref` names the shared shape; `type: object`
  is the local fallback if the ref cannot resolve.
- **The base «ext» equivalent** (base card `image`) is a **structured object** — `src` (`format:
  uri-reference`, `contentMediaType: image/*`, `x-allowed-schemes: [http, https]`) + `alt` — i.e. the same
  image concept expressed inline. This structural equivalence is exactly what the resolver must exploit
  (merge, don't fail).

## 3. Canvas 1.x well-known shapes + Mosaic's bundled copy (design)
> **Honesty:** the Canvas module is **not on disk** in this checkout, so the shapes below are from the
> Canvas / Experience-Builder **convention** and the core-11.3 `$ref`-resolution issue, and MUST be
> confirmed against real Canvas source when CP-ADOPT-8 is built. Only `…/image` is disk-verified (it is the
> single `$ref` «ext-canvas» actually uses).

Canvas exposes reusable prop shapes under `json-schema-definitions://canvas.module/<def>` — the well-known
set is understood to include **image, video, link, date-range, heading, icon** (and more). Their resolved
schemas are object shapes (image ≈ `{src, alt, width?, height?}`; link ≈ `{uri, title?}`; date-range ≈
`{start, end}`; heading ≈ `{text, level}`).

**Mosaic's bundled copy** — `config/schema/mosaic.canvas-shapes.json` (proposed): a checked-in JSON file
holding Mosaic's own copy of the well-known shape `$defs`, so adoption works whether or not Canvas is
installed. Keyed by shape name; each value the resolved schema. Versioned + documented as "our snapshot of
Canvas 1.x shapes; core `$ref` resolution wins when present."

**Resolver** — `json-schema-definitions://<extension>/<def>` (design):
1. Parse the URI → `(extension, def)`.
2. **If core (11.3+) resolves `$ref` already** → defer to it (do nothing; avoid double-resolution).
3. Else locate `<extension>` **on disk** (enabled or not — `\Drupal::service('extension.list.module')` path
   lookup, then read its `schema.json`/`$defs` from disk); if found, use its `$defs[<def>]`.
4. Else fall back to Mosaic's bundled `mosaic.canvas-shapes.json[<def>]`.
5. **Merge structurally-identical defs** (e.g. the base «ext» inline image object vs the Canvas image shape)
   rather than failing — same required keys ⇒ same descriptor.
6. **Never double-resolve** when Canvas itself is installed (guard on step 2).

## 4. Shape → descriptor table + re-grade FORECAST
| shape / key | → Mosaic descriptor | surface |
|---|---|---|
| `…/image`, `contentMediaType: image/*`, inline `{src,alt}` | **media picker** (or URL when no media entity) | admin/FE/page/SSR |
| `…/video` | **media** (video) | all |
| `…/link`, link object | **link** field | all |
| `…/date-range` | **dates** (start/end) | all |
| `string` + `contentMediaType: text/html` (+ `x-formatting-context` when present) | **CKE5** (formatted_text) | all |
| `enum` (+ `meta:enum` labels when present) | **select** with labels | all |
| `examples` | **previews** (never saved — §3e) | canvas/SSR |
| unknown `$ref` | **Attention**, naming the exact URI | libraries page |

### Re-grade forecast
- **«ext» (base, 47):** **47 / 47 Ready** forecast — every prop is typed; the 24 `contentMediaType:
  text/html` map to CKE5 (already true via CP-13's heuristic; CP-ADOPT-8 makes it explicit by the key, not
  the example), 39 enums → select, nullable-unions handled by CP-7 P1. The 5 union-with-object/array props
  render via their structured fields (no regress). **No Canvas dependency for base Ready.**
- **«ext-canvas» (1):** its card `image` `$ref` → **media** once the resolver lands; **Attention** (naming
  the URI) until then — never a crash (the `type: object` fallback renders the structured object).
- **adopt_fixture:** unchanged (no `$ref`, no `contentMediaType`) — stays Ready; the fixture GAINS a
  `$ref`-shape cell when CP-ADOPT-8 is built (a new fixture component using `json-schema-definitions://…`).

## 5. DERIVED matrix (shape × source × surface × Canvas × core-$ref)
Each cell needs an oracle + a smoke-alarm when built:
| shape | source | surface | Canvas installed | core $ref | oracle / alarm |
|---|---|---|---|---|---|
| image | SDC `$ref` | admin | absent | absent | resolver→media picker; alarm: raw `$ref` string in panel |
| image | SDC `$ref` | page/SSR | absent | absent | Markup image renders; alarm: `[object]`/escaped |
| image | SDC inline `{src,alt}` | all | absent | absent | media/URL field; alarm: JSON textarea |
| html | `contentMediaType` | admin | n/a | n/a | CKE5; alarm: bare text input |
| image | SDC `$ref` | any | **present** | present | **defer to core** (no double-resolve); alarm: two resolutions |
| any | site-config (ADOPT-9 placeholder) | all | either | either | config precedence honoured; alarm: profile beats config |
| unknown | SDC `$ref` to missing ext | libraries | absent | absent | Attention naming URI; alarm: fatal/blank |

Source precedence (ruled for ADOPT-9): **SDC hard limits → site config → profile → shape table →
heuristics**. Owned oracles (node/780 REGION+STYLE) remain the gate across every cell.

## 6. Risks + build order
| # | risk | mitigation |
|---|---|---|
| 1 | **Def collisions** — two extensions define `<def>` differently | merge only when structurally identical (same required keys); else namespace by extension + warn |
| 2 | **Canvas co-installed** — double resolution | step-2 guard: if core resolved the `$ref`, do nothing |
| 3 | **`$ref` to a missing extension** | Attention naming the exact URI; render the `type` fallback; never crash |
| 4 | **`examples` that are objects, not strings** | the §3e/WC#104 Markup rule is string-only — object examples pass through as structured preview data, not `Markup::create` |
| 5 | **Canvas not on disk** (this checkout) | bundled `mosaic.canvas-shapes.json` is the floor; confirm real `$defs` against Canvas source at build |
| 6 | **`type: object` + `$ref` both present** (as «ext-canvas» does) | prefer the resolved shape; keep `type: object` as the no-resolve fallback |

**Risk count: 6.**

**Build order** — one subsystem per pass, each with CHECKPOINTS, owned oracles the gate:
1. `contentMediaType` → descriptor (explicit, base «ext» 47/47; no Canvas). 2. Bundled shapes file +
resolver (disk lookup, merge, core-defer). 3. `$ref` → descriptor wiring + Attention-with-URI. 4. Fixture
`$ref` component + the derived-matrix cells. 5. ADOPT-9 site-config precedence (separate arc).

## Sources
- Disk parse of «ext» 1.20.0-beta1 `*.component.yml` (Symfony YAML), `nys_ds_canvas.info.yml`, the
  «ext-canvas» card `$ref` — all quoted above, verified this pass.
- Canvas well-known shapes + core-11.3 `$ref` resolution: **convention/issue, NOT disk-verified here**
  (Canvas absent) — flagged for build-time confirmation.

---

## CHECKPOINT-1 (P2 BUILD) — resolver + bundled shapes + shape table (image/video) + re-grade

Built + verified (report-only pass promoted to code in the Mosaic tree; Arun commits — I commit only
evidence; Canvas NEVER enabled; «ext-canvas» read from disk only).

### Built
- **`config/schema/mosaic.canvas-shapes.json`** — bundled snapshot of the well-known shapes (image,
  video, link, date-range, heading, icon), each marked **convention-derived** (Canvas not on disk;
  confirm-at-build); image = `{src, alt, width, height}`.
- **`src/Sdc/MosaicSchemaRefResolver.php`** (service `mosaic.schema_ref_resolver`) — resolves
  `json-schema-definitions://<ext>/<def>`: locate the extension on disk via the module/theme/profile
  extension lists (enabled OR not) → read its `schema.json` `$defs`/`definitions`; **bundled fallback** for
  `canvas.module/*`; **merge** the shape into the prop (prop's own title/default win); **defer** when the
  ref is already resolved or is a plain local `#/$defs/…` ref (no double-resolution); **unresolvable → keep
  renderable via the `type` fallback + stamp `_mosaic_unresolved_ref` = the exact URI**.
- **Wired** into `MosaicPropShapeRegistry::describe` (resolve → classify) + `rawReason` names the exact
  unresolved URI (Attention).
- **Scalar-union refinement** in `PropShape::unwrapNullable` — a union of ONLY scalars
  (`string|integer|number|boolean`) collapses to `string` (a text field holds any scalar); a union with
  object/array stays raw. (This, not the shape work, is what took «ext» from 39→47 Ready — see re-grade.)

### Proven (Kernel `CanvasShapesTest`, 7 cells + `PropShapeTest` updated)
- `canvas.module/image` resolves from the **bundled** fallback → `{src,…}`.
- A **module-local** `$ref` (`adopt_fixture.module/local_media`) resolves from that module's **on-disk
  `schema.json`**.
- **Unknown** ext/def → `resolveUri` NULL + `resolve()` stamps `_mosaic_unresolved_ref` (Attention, not silent).
- **Defer:** an already-resolved schema + a plain local `$ref` are returned unchanged.
- **Merge:** the prop's `title`/`default` win over the resolved shape.
- **image → MEDIA** and the module-local media shape → MEDIA (registry `describe`).
- Fixture **`adopt_fixture:adopt_shaped`** (image + thumbnail shape-refs + heading) grades with **no raw
  props**.
- `PropShapeTest`: the "genuine multi-type union stays raw" oracle updated — a **scalar-only** union → TEXT
  (new cell), a **structural** union (with object) → RAW (new cell).

### RE-GRADE (live, quoted)
- **«ext» base: 47 / 47 Ready** (was 39/47 before the scalar-union refinement — the 8 form components'
  `value: [string,integer,number,null]` props now → text). No Canvas dependency.
- **«ext-canvas» card `image`** (parsed from disk, module NEVER enabled) → **media** — the `$ref` was
  `json-schema-definitions://canvas.module/image`, resolved via the bundled fallback. (Witnessed by a
  throwaway disk probe; NOT baked into a committed test — a generic contrib module must not name a specific
  external library. The identical `canvas.module/image` case is covered generically by the fixture.)

### HONEST — shape → descriptor coverage this checkpoint
Delivered: **image → media, video → media** (both resolve to objects with `src`, caught by the existing
`looksLikeMedia`), **icon (string) → text**, **scalar-union → text**, **contentMediaType/enum** already
handled. **NOT yet delivered:** **link → link, date-range → dates, heading → text** — their resolved
objects (`{uri,title}`, `{start,end}`, `{text,level}`) currently fall to **RAW/Attention** because
`classify` has no object-shape detector for them (only media). That is safe (Attention names the shape,
never a crash) and is **CHECKPOINT-2** (object-shape detectors: `looksLikeLink`, `looksLikeDateRange`,
`looksLikeHeading`). No real adopted library in hand uses those shapes yet (only `…/image` appears).

### Gates
Kernel+Unit **3150 / 0** (8900 assert) (+7 CanvasShapesTest, PropShapeTest updated) · Functional **76 / 0** · Vitest
**724 / 1** (B-101; **no JS this pass**) · phpcs **0** · phpstan **0 new** · owned oracles **REGION
14e6cb9c…3954 + STYLE b7756795…ca982 4354 10** IDENTICAL (the resolver + scalar-union touch the PANEL, not
render) · dist **UNCHANGED** (1.0.79; **no adapter/JS change** — resolution is server-side). Ship count
becomes #48's.

**STOP after gates — CHECKPOINT-1 filed. The resolver + bundled shapes + image/video→media + scalar-union→
text land «ext» at 47/47; «ext-canvas» image → media without Canvas. Object-shape detectors (link/
date-range/heading) = CHECKPOINT-2. Next charter item: CP-ADOPT-9 P0 (Manage-authoring blueprint).**

---

## CHECKPOINT-2 (S) — link detector + media render + honest defer of compound shapes

### Delivered
- **`looksLikeLink`** in `PropShape` — an object with a URL-ish key (`url`/`href`/`uri`) + optional
  `text`/`title`, and NO media corroborator (`src`/`alt`/`width`/…), classifies as **LINK** (checked AFTER
  `looksLikeMedia`, so a media object never mis-reads as a link). Kernel: `canvas.module/link` → LINK; the
  fixture `adopt_shaped.cta` → LINK.
- **Media render cell** — `adopt_shaped` with `image = {src, alt, width, height}` renders an `<img>` on the
  page/SSR through the hybrid renderer (`/canvas-shape.jpg` + `Shaped image` present).

### HONEST — date-range + heading DEFERRED (not a small build)
The resolved **date-range** `{from/start, to/end}` and **heading** `{text, level}` are COMPOUND objects.
Rendering them as real widgets (a dates picker; text + level-select) needs **sub-field descriptors** — but
`PropDescriptor` carries only a single `items` (for REPEATABLE), no general properties/sub-field map, and
the rail has no compound widget for adopted objects. Forcing them to a single text field would show the
object value as garbage while claiming "Ready" — worse than honest Attention. So they **stay raw
(Attention), never a crash**, until sub-field descriptor support lands (a genuine, non-small follow-up).
**No adopted library in hand uses them** — only `…/image` appears. Kernel cell asserts they stay RAW.

### FINDING — a `$ref` in a component schema needs Canvas's stream wrapper AT RENDER
Rendering an SDC whose schema carries `$ref: json-schema-definitions://…` fails without Canvas:
Drupal's SDC validates props against the schema at render and `file_get_contents(json-schema-definitions://…)`
has no stream wrapper unless Canvas is installed. This is **not a gap for real libraries**: «ext-canvas»
*depends on* `canvas:canvas` (wrapper present at render), and base «ext» uses **inline** shapes (0 `$ref`)
so it renders without Canvas. **Mosaic's resolver serves the author-time panel/grade** (registry
`describe`), where no stream wrapper is involved. So the fixture `adopt_shaped` uses **inline** shapes for
the render cell; the resolver ($ref → shape) is proven via `resolveUri()` + `describe()` on **explicit
`$ref` schemas** (CHECKPOINT-1 + this checkpoint's link cell).

### H4 / H5
- **H4 defaults:** unchanged — the registry's `resolveDefault` (schema `default` → `examples[0]` →
  type-empty) already covers object shapes (the object's own default).
- **H5 object-shape validation:** object shape VALUES are already validated at two layers — Drupal SDC prop
  validation **at render** (strict, as the finding above shows) and the layout JSON schema **at save**. A
  dedicated per-shape refusal (e.g. a media object missing `src`) is a small follow-up if a case appears;
  no new mechanism was added here (the existing layers cover it).

### Gates
Kernel+Unit **3153 / 0** (8910 assert) (+3 CanvasShapes cells → 10 total) · Functional **76 / 0** · Vitest **724 / 1**
(B-101; **no JS this pass** — detectors are server-side) · phpcs **0** · phpstan **0 new** · owned oracles
**REGION 14e6cb9c…3954 + STYLE b7756795…ca982 4354 10** IDENTICAL · dist **UNCHANGED** (1.0.79).

**STOP after gates — CHECKPOINT-2 filed. link → link + media renders; date-range/heading honestly deferred
(sub-field infra); the `$ref`-at-render finding recorded. CP-ADOPT-8 is descriptor-complete for the shapes
real libraries use (image/video/link + contentMediaType + enum + scalar-union). Next: CP-ADOPT-9.**

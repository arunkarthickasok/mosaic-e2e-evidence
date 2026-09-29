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

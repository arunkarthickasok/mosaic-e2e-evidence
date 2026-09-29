# ROADMAP — post-1.0 submodules (ruled 2026-09-29)

Ruling (Arun, "approve word by word"): **1.0 ships six modules walked green** — core +
`mosaic_components` + `mosaic_views` + `mosaic_media` + `mosaic_webform` + `mosaic_builder_ui`. **Every
other submodule is REMOVED from the 1.0 tree** and recorded here. `mosaic_acsf` is **DROPPED entirely**
(no roadmap target).

## Removal process (NOT done in this pass)
Removal happens in its **own numbered ship**, and only after a **read-only EVIDENCE TABLE per submodule**:
files · routes · config entities/schema · permissions · tests · **every reference from KEPT code (grep)** ·
uninstall implications for dev sites that enabled it (config/tables to clean, uninstall hooks needed).
**Hard rule: nothing kept may depend on a removed module** — the grep step is the gate. The held-file rule
for `SdcComponentPlugin.php` is **RETIRED** (no delta since HEAD; ledgered in SHIP-47.md).

## Kept in 1.0 (walked green)
| module | role |
|---|---|
| `mosaic` (core) | the builder, renderer, adoption, schema |
| `mosaic_components` | the owned SDC set |
| `mosaic_views` | Views-into-slots data binding |
| `mosaic_media` | media picker / drupal_media resolution |
| `mosaic_webform` | webform embed |
| `mosaic_builder_ui` | palette / panel CSS + chrome |

## Removed from 1.0 (→ this roadmap; targets are estimates pending each evidence table)
| submodule | status | what exists (to confirm in its evidence table) | target |
|---|---|---|---|
| `mosaic_acsf` | **DROPPED** | Acquia Site Factory glue | **none — dropped** |
| `mosaic_search` | removed | Search-API bridge (the Search-API into-slot path) | **1.1** (WAVE G note) |
| `mosaic_canvas_bridge` | removed | early Canvas interop — **superseded by CP-ADOPT-8** (bundled shapes + resolver in core) | 1.1+ (likely folded into ADOPT-8) |
| `mosaic_paragraphs` | removed | Paragraphs → component data-source bridge | 1.1 |
| `mosaic_commerce` | removed | Commerce product data source | 1.1 |
| `mosaic_collab` | removed | CRDT / Hocuspocus live collaboration | 1.1+ |
| `mosaic_intelligence` | removed | AI generate / Lighthouse scores | 1.1+ |
| `mosaic_registry` | removed | component registry / CEM catalog | 1.1 (P4 "registry/CEM catalog") |
| `mosaic_metatag` | removed | Metatag integration | 1.1 |
| `mosaic_tokens` | removed | token/design-token surface | 1.1 |

> The "what exists" column is provisional (from module names + prior ledger references); each row's real
> inventory is produced by its **evidence table** in the removal ship, before any file is deleted. No code
> was read deeply for this table this pass — it records the POLICY + the list, not an audit.

## WAVE G (1.0) — the six kept, plus
- The six modules above **walked green**.
- **CP-DATA-FABRIC:** component index + `hook_views_data`.
- **Moderation** live walk.
- `mosaic_search`'s Search-API bridge is explicitly **1.1**, not WAVE G.

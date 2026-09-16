# PROBE — COMPONENT PIPELINE (read-only research) — 2026-09-16

Read-only research. No fixes, no staging, no DB/config writes, no module enables. Every claim is backed by a
`file:line` quote or a live read-only probe (drush php:eval read / curl GET). No recommendations — evidence
only; the design is the reviewer's job. Paths are relative to
`web/modules/custom/mosaic/` unless noted.

---

## Q1 — DISCOVERY: how MosaicComponentManager finds components

**Not a wrapper of `plugin.manager.sdc`.** `MosaicComponentManager` is a core `DefaultPluginManager` with TWO
discovery sources merged: (a) its own PHP-Attribute scan of `Plugin/MosaicComponent/`, and (b) a custom
`SdcComponentDiscovery` injected by setter.

- `src/Plugin/MosaicComponentManager.php:32` — `class MosaicComponentManager extends DefaultPluginManager {`
- Docblock `src/Plugin/MosaicComponentManager.php:19-23` — "Discovers component plugins declared with the
  `#[MosaicComponent]` PHP Attribute in Plugin/MosaicComponent/ across all enabled modules. SDC-declared
  components (with a .mosaic.yml sidecar) are merged in via SdcComponentDiscovery. PHP class definitions take
  precedence on ID conflict."
- Constructor `:55-69` configures the attribute scan (`'Plugin/MosaicComponent'`, `MosaicComponent::class`);
  **no** `plugin.manager.sdc` is injected. SDC discovery is wired by setter `:77-79`
  `setSdcComponentDiscovery(...)`.
- Merge `findDefinitions()` `:101-158`: `$phpDefinitions = parent::findDefinitions();` then
  `$sdcComponents = $this->sdcDiscovery->discover($this->collectNamespacePaths());` — SDC defs first, PHP
  overwrites on id conflict; `alterDefinitions($merged)` re-run at `:155`.
- Directories scanned are ALL enabled module/theme roots (`collectNamespacePaths()` `:176-184`), not a fixed
  Mosaic path — so there is **no namespace/allowlist** gate at discovery.

**THE GATE (why foreign SDCs are excluded):** `SdcComponentDiscovery::discover()` admits a component only
when BOTH `[name].component.yml` AND `[name].mosaic.yml` exist:
- `src/Sdc/SdcComponentDiscovery.php:45-48` —
  `// Silently skip components without a .mosaic.yml sidecar (AC3).`
  `if (!file_exists($componentYml) || !file_exists($mosaicYml)) { continue; }`
- Docblock `:16-18` — "If only .component.yml exists (no .mosaic.yml), the component is silently skipped — it
  is a plain SDC component, not a Mosaic builder component."
- Only Mosaic's own submodules ship `.mosaic.yml` sidecars (19 found, all under mosaic_components / mosaic_views
  / mosaic_webform / etc.). `webform_embed` is itself a Mosaic submodule component
  (`modules/mosaic_webform/components/webform_embed/webform_embed.mosaic.yml`), not an external SDC.

**LIVE PROBE (the diff IS the answer)** — `drush scr`, `plugin.manager.sdc` vs `mosaic.component_manager`:
```
=== ALL core SDC ids on site (15) ===
  mosaic_components:mosaic_button … mosaic_text   (12)
  mosaic_views:mosaic_view
  mosaic_webform:webform_embed
  olivero:teaser                        <-- a THEME's SDC
=== Mosaic getDefinitions() (14) ===   (the 12 mosaic_components + mosaic_view + webform_embed, prefix stripped)
=== SDC (by machine name) NOT in Mosaic registry ===
  olivero:teaser
olivero:teaser provider = olivero  (theme)
```
So **SDCs from other modules/themes do NOT appear** — `olivero:teaser` is present on the site but excluded,
solely because it has no `.mosaic.yml`. Mosaic also strips the `provider:` prefix (registry ids are bare
machine names like `mosaic_button`).

**How a discovered SDC becomes a component:** `ComponentDefinition::toPluginDefinition()`
(`src/Sdc/ComponentDefinition.php:148-161`) sets `'class' => SdcComponentPlugin::class` and carries
`prop_types`, `slots`, `field_types` + canvas keys. `SdcComponentPlugin`
(`src/Plugin/MosaicComponent/SdcComponentPlugin.php:20`) reads props from the co-located `.component.yml` at
runtime (`:69`) and resolves the template as an SDC id `provider:id` (`:83-89`).

**Two RUNTIME filters (post-discovery, per-user — not discovery gates):**
- `restricted` (non-admins) — `src/Controller/ManifestController.php:73-80`;
  `src/Plugin/Field/FieldWidget/MosaicLayoutWidget.php:624-627`. `restricted` is NOT a sidecar key — its only
  source is the PHP attribute default `src/Attribute/MosaicComponent.php:62` `restricted = FALSE`.
- per-bundle `allowed_components` allowlist — `MosaicLayoutWidget.php:628-631` (`empty = all allowed`).

---

## Q2 — SIDECAR: `.mosaic.yml`

**An SDC with NO `.mosaic.yml` is DROPPED, not admitted with defaults** — `src/Sdc/SdcComponentDiscovery.php:45-48`
(the `continue` above). Defaults apply only to components that HAVE a sidecar but omit individual keys.

**Full key inventory:**

*A. Read in `ComponentDefinition::fromSidecarYaml()` (`src/Sdc/ComponentDefinition.php`):*
`id` (:125, default fallback id) · `label` (:126, default id) · `category` (:127, default `'General'`) ·
`icon` (:128, default NULL) · `prop_types` (:96-98, default `[]`) · `slots` (:101-103, default `[]`) ·
`field_types` (:109-115, default `[]`; per-entry must be an array with a string `type`).

*B. `SIDECAR_KEYS` copied verbatim if present (`ComponentDefinition.php:26-37`, read loop `:117-122`):*
`canvas_class, canvas_tag, tag_prop, tag_map, canvas_text_prop, canvas_class_modifiers,
inline_editable_prop, style_tokens, requires_ssr_preview, level` (10 keys).

*C. Defaults APPLIED when the manifest entry is built (`src/Service/MosaicManifestBuilder.php:51-77`):*
`level → 0` (:59) · `prop_types → []` (:62) · `field_types → []` (:65) · `requires_ssr_preview → FALSE` (:74)
· `style_tokens → []` (:75) · `tag_map → []` (:71) · `canvas_class_modifiers → []` (:73) · `canvas_class /
canvas_tag / tag_prop / canvas_text_prop / inline_editable_prop → NULL` (:68-76) · id/label/category → `''`
(:55-57).

*D. Nested sub-keys:* `style_tokens[].name` + `style_tokens[].governance` (`'restricted'` strips the token
from non-admins) — `MosaicManifestBuilder.php:186-193` (shipped example
`mosaic_components/components/mosaic_card/mosaic_card.mosaic.yml:21` `governance: restricted`);
`field_types[].type` (:101, default `'text'`); richtext `formats` (:130); repeatable `fields` (:141-142) +
`summary` (`src/Plugin/MosaicFieldType/RepeatableFieldType.php:42-43`).

*E. NOT read from the sidecar:* `restricted` (only the PHP attribute, Q1) · top-level `summary` (only a
repeatable sub-key + the unrelated remote-CEM loader).

---

## Q3 — PANEL DERIVATION (no `field_types`): schema → panel fields

**Derivation is client-side in the TS adapter, not PHP.** `MosaicManifestBuilder` passes prop definitions
through raw (`src/Service/MosaicManifestBuilder.php:60` `'propDefinitions' => $propDefinitions,`) and only
builds descriptors for the sidecar `field_types` (`:65`, `:97`). The adapter reads the schema `properties`
and maps them:
- `js/src/builder/MosaicPuckAdapter.ts:403` — `const props = manifest.propDefinitions?.properties ?? {};`
- `:590` — `...MosaicPuckAdapter.propsToFields(props),` → `:1427` `...MosaicPuckAdapter.defToField(def),`

**Schema → Puck-field mapping (`defToField`, `MosaicPuckAdapter.ts:1739-1785`):**

| JSON-schema input | Puck field | Quote |
|---|---|---|
| `enum` (checked FIRST) | `select` | `:1740` `if (def.enum && def.enum.length > 0)` → `:1742-1743` `type:'select', options: def.enum.map(...)` |
| `string` | `text` | `:1748-1749` |
| `integer`/`number` | `number` (+min/max from minimum/maximum) | `:1750-1755` |
| `boolean` | `radio` Yes/No | `:1757-1762` ("Puck 0.21 has no 'checkbox' type") |
| `array` | `array` (item fields from `items.properties`, else single `value` text) | `:1766-1772` |
| `object` | `object` (sub-fields from `properties`, else `{}`) | `:1775-1780` |
| `$ref` | **NOT handled** — no `$ref` case; not modeled on `JsonSchemaProp` (`js/src/shared/types/schema.ts:179-195`) → falls to default `text` | `:1782-1783` |
| any other/unknown type (RAW fallback) | `text` | `:1782-1783` `default: return { type: 'text' };` |

Label floor on every schema-derived field: `:1430` `label: def.title ?? humanizeFieldName(name)`
(humanize `:1439-1445`).

**`field_types` OVERRIDE / SUPPLEMENT** the schema-derived fields (spread AFTER `propsToFields`):
`MosaicPuckAdapter.ts:589-596` — `fields: { ...propsToFields(props), ...erpFields, ...fieldTypeFields(manifest.field_types, ...) }`
(later key wins on shared name; new names supplement). `prop_types` (ERP) also override (`:566-578`).

---

## Q4 — SLOTS

**The SDC `.component.yml` `slots:` schema is NOT read anywhere.** `SdcComponentDiscovery` only `file_exists()`
the `.component.yml`; it parses ONLY the `.mosaic.yml` (`src/Sdc/SdcComponentDiscovery.php:42-51`). The one
runtime reader of `.component.yml` (`SdcComponentPlugin::getPropDefinitions()` `:68-69`) reads `props` only,
never `slots`.

**Mosaic's slot definitions come from a PHP class OR the `.mosaic.yml` sidecar `slots:` — never the SDC
descriptor.**
- `SdcComponentPlugin::getSlotDefinitions()` `:31-36` returns `$definition['slots']`, sourced from the parsed
  sidecar (`ComponentDefinition.php:101-103`).
- Container components define slots in PHP: `MosaicColumnsComponent.php:53-60` returns
  `['column_1' => ['label' => 'Column 1'], … 'column_4' => …]`. The shipped `mosaic_columns.component.yml`
  and `.mosaic.yml` have NO `slots:` key.

**Zone model = Puck Slots API (`{ type: 'slot' }`), NOT Puck DropZone.** `MosaicPuckAdapter.ts:580-585`
(`for (const slotKey of slotKeys) { slotFields[slotKey] = { type: 'slot' }; }`). `DropZone` appears ONLY in
tests; the `zones` map in the adapter is explicitly legacy back-compat (`:1185-1186`, new data emits
`zones: {}` `:1069`). The Puck `render` places slots via `renderProps[slotName]` (columns `:790-802`; generic
scaffold `:506-521`).

**Children stored as `nodes[id].slots.{zone}: [childIds]`** (`fromPuck` `:1177`; multi-child roots wrapped in a
synthetic `mosaic_region` `:1219`; type `js/src/shared/types/schema.ts:23`). Example
`recipes/mosaic-landing-page/recipe.yml:56` (`"type":"mosaic_columns", … "slots":{"column_1":[…]}`). The server
renderer walks the same map (`src/Service/MosaicRenderer.php:703-708`) → `$renderedSlots` → Twig `slots`
variable (`:787`) → `mosaic_columns.twig:23` `{{ slots.column_1 }}`.

**SDC slots vs Mosaic zones = unrelated mechanisms sharing the name.** The only point of contact is nominal —
the assembled Twig `slots` variable is what a component's `.twig` reads, but its keys/definitions come entirely
from Mosaic's own sources (PHP `getSlotDefinitions()` / sidecar), never from an SDC `slots:` declaration.

---

## Q5 — RENDER

**NO `'#type' => 'component'` anywhere in `src/` (grep = zero).** The renderer calls Twig DIRECTLY.
- `src/Service/MosaicRenderer.php:785-793` — `$this->twig->render($plugin->getTemplatePath(), ['props'=>…,
  'slots'=>$renderedSlots, 'attributes'=>…, 'mosaic'=>$this->twigHelper])` inside
  `coreRenderer->executeInRenderContext(...)`. Canvas-SSR path same at `:469`.
- Template path = the SDC id string `provider:id` (`SdcComponentPlugin::getTemplatePath()` `:83-89`; columns
  hard-code `'mosaic_components:mosaic_columns'` `MosaicColumnsComponent.php:66`), resolved by Drupal's core
  ComponentLoader Twig loader. Output wrapped as `['#markup' => Markup::create($markup)]` (`:399-401`).

**Attachment behavior — manual capture (no SDC render element auto-attach).** Because it bypasses
`'#type'=>'component'`, the renderer wraps Twig in a render context and harvests whatever bubbled:
`MosaicRenderer.php:794-798` (`$bubbled = $twigContext->pop(); $componentMeta->addAttachments($bubbled->getAttachments());`)
→ bubbled to the field build `:831-832`; warm-cache hits replay stored attachments `:688-690`.

**How a component's declared assets reach the PAGE — three routes:**
1. Explicit `attach_library` in the component Twig — `mosaic_tabs.twig:18` `{{ attach_library('mosaic/renderer') }}`
   (also carousel `:18`, live_search `:17`). Bubbles through the capture.
2. SDC `.component.yml` `css:` / `libraryDependencies` — **no Mosaic code reads these keys** (grep
   `libraryDependencies`/`libraryOverrides` in `src/` = nothing). Delivery relies on CORE SDC auto-attaching
   the component library during the raw `$twig->render('mosaic_components:mosaic_columns')`, whose bubbled
   metadata is captured at `:794-798`.
3. The formatter always attaches `mosaic/renderer` (design-system CSS only, NOT per-component) —
   `src/Plugin/Field/FieldFormatter/MosaicLayoutFormatter.php:150`; `mosaic/renderer` = tokens/spacing/
   visibility/a11y (`mosaic.libraries.yml:10-20`), not `mosaic_columns.css`.

**LIVE PROBE (confirms route 2 reaches the page)** — `curl /node/780` (11 components):
```
mosaic component CSS <link>:  /modules/custom/mosaic/css/mosaic-design-system.css, mosaic-spacing.css, mosaic-visibility.css
per-component SDC css present: mosaic_components/components/mosaic_columns/mosaic_columns.css
                              mosaic_components/components/mosaic_image/mosaic_image.css
render markers: data-component-id="mosaic_components:mosaic_button" … (each component present)
```
So the SDC's OWN co-located css (`mosaic_columns.css`, `mosaic_image.css`) DOES reach the published page — and
appears only when those components are present (per-component SDC library auto-attach, route 2).

**Canvas reach — foreign-component CSS/JS does NOT reach the builder canvas (a witnessed GAP).**
- Builder libraries (`mosaic.libraries.yml:114-132`) + frontend_editor (`:51-73`) load design-system + builder +
  Puck CSS only — NO per-component `.component.yml` css. No code attaches an SDC component library to the
  builder route.
- Tier B SSR preview returns HTML ONLY (`src/Controller/CanvasPreviewController.php:103`
  `new JsonResponse(['html' => $html])`; `MosaicRenderer.php:467-478` never pops the context for attachments).
- The iframe preview loads only the active THEME's libraries (`RenderPreviewController.php:241,253`), which do
  not depend on `mosaic_columns.css`.
- Net: the canvas renders React scaffolds with BEM `className` strings (`MosaicPuckAdapter.ts:787`) that rely on
  the design-system CSS in the builder library; a component's own layout css (`mosaic_columns.css`) is not in
  the canvas libraries, not in the Tier B SSR JSON, and not in the theme-only iframe set.

---

## Q6 — PACKAGES + REGISTRY

**`component_package` is a SCHEMA-ONLY config entity with ZERO runtime consumers — no PHP class, no shipped
config, nothing loads it.**
- Schema `config/schema/mosaic.schema.yml:78-109` `mosaic.component_package.*` → `id, label, description,
  components[] (component plugin IDs), allowed_bundles[] (entity_type.bundle), status`.
- **No `#[ConfigEntityType]` class** — `src/Entity/` holds only `MosaicDesignTokenSet.php`,
  `MosaicGlobalTemplate.php`, `MosaicTemplate.php`. Grep for `component_package`/`ComponentPackage` finds only
  the menu/route/schema/settings + tests — no `loadMultiple`/storage load anywhere.
- **LIVE PROBE:** `entityTypeManager->hasDefinition('component_package') = false` (not registered).
  Registered Mosaic config entities: `mosaic_design_token_set` (1), `mosaic_global_template` (1).
- `config/install/mosaic.settings.yml:31-33` `default_component_package: base` — but **no consumer**
  (`grep default_component_package src/ js/src/` → 0 hits) and **no shipped `mosaic.component_package.base.yml`**.
- **`mosaic_registry`: DORMANT** — `module_handler->moduleExists('mosaic_registry') = false`; not in
  `core.extension.yml`.

**The "Component Packages" admin page = a provider-MODULE grouping, not the config entity.**
- Route `mosaic.routing.yml:111-118` `mosaic.admin.component_packages` → `/admin/config/mosaic/component-packages`
  → `ComponentPackagesController::packages` (`_permission: mosaic.administer`).
- `ComponentPackagesController.php:58-68` groups `componentManager->getDefinitions()` by `provider`; docblock
  `:17-22` "A 'component package' is any enabled module that provides one or more MosaicComponent plugins …
  grouped by the 'provider' key … which equals the module machine name." Empty state `:73` "Enable
  `mosaic_components` or another package module."

**Per-bundle governance is a node_type THIRD-PARTY SETTING `mosaic.allowed_components`, NOT the config
entity's `allowed_bundles`.**
- Defined + saved on the node-type form — `src/Hook/MosaicFormHooks.php:39-75` (checkboxes
  `allowed_components`) + `:91-99` (`setThirdPartySetting('mosaic', 'allowed_components', …)`).
- Enforced in the palette — `src/Plugin/Field/FieldWidget/MosaicLayoutWidget.php:621-631`
  (`if (!empty($allowedComponents) && !in_array($id, $allowedComponents, TRUE)) { continue; }`); the list comes
  from `getAllowedComponentIds()` `:662-673` (`$nodeType->getThirdPartySetting('mosaic', 'allowed_components', [])`).

**The dormant `mosaic_registry` CEM importer creates NO Drupal config/entities.** It parses a REMOTE CEM v2.1.0
JSON manifest into in-memory value objects; "install" = Composer require + module enable.
- Schema disclaimer `modules/mosaic_registry/config/schema/mosaic_registry.schema.yml:1-4` "No config entities …
  manifest URL is read from settings.php via `Settings::get('mosaic_registry_manifest_url')`".
- `MosaicManifestLoader.php:166-185` — parses `data['modules'][].declarations[]` →
  `MosaicComponent::fromCemDeclaration()` value objects (`Value/MosaicComponent.php:87-111`:
  `composerPackage, drupalModule, puckCategory, totalInstalls, maintenanceStatus`). URL from
  `Settings::get('mosaic_registry_manifest_url','')` (`:109`), empty → empty list.
- Install path = `MosaicPackageInstaller.php:116-123` `getInstallCommand()` → `'composer require … && drush en …'`;
  Drush `MosaicRegistryCommands.php:91-100` `componentEnable()` → `moduleInstaller->install([$module])`. Public
  catalog route `mosaic_registry.routing.yml:3-10` `/api/mosaic/components`. So a CEM manifest CREATES nothing
  in config — it drives Composer/module installation.

---

## Q7 — STYLE/VARIANT PROPS + DESIGN TOKENS

**Enum "variant" prop → `select`, applied at render as a BEM class modifier (not a distinct prop path).**
- Declared `mosaic_components/components/mosaic_card/mosaic_card.component.yml:31-35`
  (`variant: {type: string, enum: [default, horizontal]}`).
- → select via `defToField` (`MosaicPuckAdapter.ts:1740-1745`, the enum branch above).
- Applied at render as a class: canvas `:822,830` (`className = \`${block} ${block}--${variant}\``); the generic
  Tier-A renderer builds modifiers from `canvas_class_modifiers` `:687-694`, driven by the sidecar
  (`mosaic_card.mosaic.yml:11-14` `canvas_class: 'mosaic-card'` + `canvas_class_modifiers: {variant: ''}`);
  server Twig `mosaic_card.twig:24,29-31,38` (`'mosaic-card--' ~ variant` → `attributes.addClass(classes)`).

**No free-text `className`/`class_name`/`extra_classes` prop is exposed** — class names are DERIVED
(`canvas_class` + BEM modifiers, `MosaicPuckAdapter.ts:681-694`), never author-typed. Grep for
`class_name`/`extra_classes`/`attributes.class` → no author-facing class input.

**Design tokens are surfaced THREE ways — page-wide CSS vars + a per-instance override control — never as enum
options.** (`mosaic_tokens` submodule present but NOT enabled.)
1. Active `MosaicDesignTokenSet` config entity → `:root { --name: value; }` page-wide —
   `src/Service/MosaicTokenManager.php:95-109` (buildCss), attached `src/Hook/MosaicHooks.php:108-118`
   (`html_head` inline `<style id="mosaic-design-tokens">`). Entity `src/Entity/MosaicDesignTokenSet.php:50-63`
   (keys `tokens, is_active, source, token_data`; single-active `preSave` `:144-159`).
2. External→internal bridge `:root { --external: var(--mosaic-*); }` —
   `src/Service/MosaicTokenBridgeService.php:79-91`, attached `MosaicHooks.php:122-132` (`mosaic-token-bridge`).
3. **Per-instance `StyleOverridesControl` (component-level) = one TEXT input per `style_tokens` name, NOT enum
   options.** Sidecar declares token names (`mosaic_card.mosaic.yml:16-21`, incl. `governance: restricted`) →
   normalized into the manifest (restricted stripped for non-admins, `MosaicManifestBuilder.php:75,176-197`) →
   `StyleOverridesControl.tsx:30-45` renders a row per token (input `:123-138`, placeholder `'e.g. #fff or 8px'`)
   → wired with captured tokens `MosaicPuckAdapter.ts:406,617-620` → applied as inline CSS custom properties on
   the element via `_mosaic_style_overrides` (`extractOverrideStyle` `:210-219`; `style: overrideStyle`
   `:695-696,804-807,894-897`).

---

## Q8 — FIELD-TYPE INVENTORY + SECTION ASSEMBLY

**LIVE PROBE — `mosaic.field_type_manager->getDefinitions()` (8 plugins):**
```
media (media) · image_style (image_style) · repeatable (array) · richtext (richtext) ·
number (number) · text (text)                     [mosaic core, 6]
views_arguments (views_arguments) · views_display (views_display)   [mosaic_views, 2]
```

**Per-plugin id → builder_type → Puck field** (attribute + `descriptorToPuckField` quotes):

| Plugin | id / builder_type | Puck field produced |
|---|---|---|
| `TextFieldType.php:14-16` | `text` / `text` | generic tail `MosaicPuckAdapter.ts:1586` → Puck **text** |
| `NumberFieldType.php:14-16` (+min/max :26/:29) | `number` / `number` | tail `:1586` → Puck **number** |
| `RichtextFieldType.php:18-20` | `richtext` / `richtext` | `:1536-1540` custom → `BodyEditModal` (CKEditor 5 modal) |
| `MediaFieldType.php:24-26` | `media` / `media` | `:1542-1546` custom → `MosaicMediaField` (Media Library) |
| `ImageStyleFieldType.php:22-24` | `image_style` / `image_style` | `:1548-1550` custom → `MosaicImageStyleField` (select) |
| `RepeatableFieldType.php:22-24` | `repeatable` / `array` | `:1500-1532` Puck **array** (min/getItemSummary/defaultItemProps) |
| `ViewsArgumentsFieldType` (mosaic_views) | `views_arguments` / `views_arguments` | `:1567` custom → `MosaicViewsArgumentsPanel` |
| `ViewsDisplayFieldType` (mosaic_views) | `views_display` / `views_display` | `:1552` custom → `MosaicViewsDisplayField` |

Base descriptor `{ type: builderType(), label }` — `src/Plugin/MosaicFieldType/MosaicFieldTypePluginBase.php:43`.

**SECTION ASSEMBLY — five sections added to EVERY component UNCONDITIONALLY** (plain keys in the `fields`
object literal, no `if` guard; `MosaicPuckAdapter.ts` `toConfig`, single `for (const manifest of manifests)`
loop `:402`; defaults seeded `:409-415`):

| Section | `label:` | Added at | Renders |
|---|---|---|---|
| Breakpoint overrides | `:427` `'Breakpoint overrides'` | `:598` `_mosaic_bp` | `BreakpointOverrideField` (custom) |
| Visibility | `:442` `'Visibility'` | `:599` `_mosaic_visibility` | `VisibilityField` (custom) |
| Data source | `:457` `'Data source'` | `:600` `_mosaic_ds` | `MosaicDataSourceField` (custom) |
| Spacing | `:603` `'Spacing'` | `:601-611` `_mosaic_spacing` | `SpacingControl` (custom) |
| Style overrides | `:614` `'Style overrides'` | `:612-623` `_mosaic_style_overrides` | `StyleOverridesControl` (custom) |

Docstring confirms intent: `:390` "Every component gets `_mosaic_bp`" / `:391` "Every component gets
`_mosaic_visibility`". CONDITIONAL (not part of the five): ERP fields only for `prop_types` entries (`:570`);
slot fields only for slot keys (`:583`); field-type fields only for `field_types` entries (`:596`). Note: the
five section labels are hard-coded English literals (e.g. `:427`), NOT run through `t()` (contrast the
richtext format label `:1718` `label: t('richtext_format_label', 'Text format')`).

---

## Cross-cutting evidence findings (factual, no recommendations)

- **Foreign SDCs are excluded by exactly one gate:** the `.mosaic.yml` sidecar requirement
  (`SdcComponentDiscovery.php:45-48`). `olivero:teaser` (a theme SDC) is present on the live site but not in
  Mosaic's registry — no `.mosaic.yml`.
- **Schema→field derivation lives in the TS adapter, not PHP;** `$ref` is unmodeled and falls to a raw `text`
  input (`MosaicPuckAdapter.ts:1782-1783`, schema type `js/src/shared/types/schema.ts:179-195`).
- **The five panel sections (Breakpoint overrides / Visibility / Data source / Spacing / Style overrides) are
  unconditional on every component,** hard-coded English labels not run through `t()` (`MosaicPuckAdapter.ts:427,442,457,603,614`).
- **SDC `slots:` schema is never parsed;** Mosaic's children model is its own Puck-Slots mechanism sourced from
  PHP `getSlotDefinitions()` / `.mosaic.yml`.
- **Rendering is direct Twig (`provider:id`), not `#type => component`;** a component's own `.component.yml`
  css reaches the PAGE via core SDC auto-attach (live-probed: `mosaic_columns.css`/`mosaic_image.css`) but does
  NOT reach the builder canvas / Tier-B SSR / iframe preview (witnessed gap, Q5).
- **`component_package` config entity + `default_component_package: base` are schema-only with zero runtime
  consumers and no shipped config;** governance is actually a `node_type` third-party setting
  `mosaic.allowed_components`. `mosaic_registry` + `mosaic_tokens` submodules are present-but-disabled; the CEM
  importer creates no Drupal config (drives Composer/module install).
- **Design tokens are `:root` CSS vars page-wide + per-instance text-input override slots** (StyleOverridesControl),
  never enum select options; variant enums become BEM class modifiers.

## Probe method
Live reads via `ddev drush scr` (throwaway `web/probe_pipeline.php`, deleted after each run — never staged) and
`curl -sk` GET against the dev site. Code quotes are fresh reads at the cited `file:line`. No writes, no config
changes, no module enables were performed. Four read-only sub-readers gathered the code quotes; all quotes were
re-anchored to `file:line` here.

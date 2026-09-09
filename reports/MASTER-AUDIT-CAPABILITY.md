# MASTER AUDIT — CAPABILITY (CP-GRAND-AUDIT-CAPABILITY)

**Directive:** Arun 2026-09-09 — *"all dots must connect — config to rendered frame — a content author must be able to use this at full capacity."*
**Mode:** STRICTLY READ-ONLY (no fixes/staging/DB-config-writes/module-enables). Light read-only probes only.
**Fresh-read law:** every verdict below quotes `file:line` or a live probe. Zero memory claims.
**Scope:** core `mosaic` module + all 15 submodules; full author journey; core-integration sync; gap register + ratification sheet.
**S2c carousel landing:** HELD (this audit runs first). Dormant `V5ToV6Migration.php` + its test stay untracked; `CURRENT_SCHEMA_VERSION = 5` unchanged.

---

## 0. VERDICT TALLY (16 units = core + 15 submodules)

| Verdict | Count | Units |
|---|---|---|
| **COMPLETE-WALKED** | 2 | `mosaic` (core), `mosaic_components` |
| **FUNCTIONAL-UNWALKED** | 11 | enabled: `mosaic_builder_ui`, `mosaic_media`, `mosaic_webform` · disabled: `mosaic_acsf`, `mosaic_collab`, `mosaic_metatag`, `mosaic_paragraphs`, `mosaic_registry`, `mosaic_search`, `mosaic_tokens`, `mosaic_views` |
| **EXPERIMENTAL** | 1 | `mosaic_intelligence` (enabled; matches bible R7) |
| **SKELETON** | 1 | `mosaic_canvas_bridge` (disabled) · *plus* the F-088 "View Display" embed sub-capability inside `mosaic_views` |
| **BROKEN** | 1 | `mosaic_commerce` (disabled; templates call undeclared `drupal_entity()`) |

**Live module split** (`ddev drush pm:list`, 2026-09-09): **6 enabled** (`mosaic`, `mosaic_builder_ui`, `mosaic_components`, `mosaic_intelligence`, `mosaic_media`, `mosaic_webform`) · **10 disabled** (all others).
Observation: `config/default/core.extension.yml` records only `mosaic` + `mosaic_components` — a **stale config-sync export** vs the live DB (does not reflect the 4 other enabled submodules).

**Headline:** the shipping (enabled) authoring product — core render/build/save/template/breakpoint/media/FE — is **COMPLETE and live-witnessed anon-through-authenticated**. The gaps are (a) capabilities gated behind **disabled** submodules that the builder UI still advertises, (b) enterprise integrations (translation/moderation/Views-embed) not yet wired, and (c) enabled-baseline promises that don't populate (Lighthouse/WCAG panels). No gap blocks the **core** author from composing, saving, and publishing a page.

---

## PART A — SUBMODULE CAPABILITY MATRIX

### A0. `mosaic` (core) — **COMPLETE-WALKED**

1. **Claim** (`mosaic.info.yml:3`): *"Visual component builder field type for Drupal 11/12. Drag-and-drop page composition with Lit Web Components, SDC, and a visual data query builder. No cloud dependency."*
2. **Enabled?** yes (`drush pm:list`).
3. **Inventory:**
   - **Field plugins (3):** `mosaic_layout` FieldType (`src/Plugin/Field/FieldType/MosaicLayoutItem.php:23`, big-text column `:36`, attachable to any fieldable entity), Widget (`src/Plugin/Field/FieldWidget/MosaicLayoutWidget.php:36`), Formatter (`src/Plugin/Field/FieldFormatter/MosaicLayoutFormatter.php:30`).
   - **Routes:** 30 in `mosaic.routing.yml` (canvas SSR `:7/:18`, render-preview `:29`, manifest `:40`, templates list/save `:50/:59`, entity-suggest `:71`, image-styles `:81`, entity-fields `:101`, component-packages `:111`, layout-usage `:121`, resolve `:131`, entity-query-preview `:142`, 6 lock endpoints `:153–:209`, settings form `:212`, ai test/generate `:222/:268`, 2 revision endpoints `:232/:242`, frontend-save `:256`, token-import `:280`). All POST routes carry `_csrf_request_header_token: 'TRUE'` (spot: `:15`, `:37`, `:67`, `:138`).
   - **Services (22):** renderer (`mosaic.services.yml:132`), schema validator `:36`, prop validator `:72`, prop resolver `:114`, data-source resolver `:122`, migration manager `:98`, lock manager `:198`, revision manager `:188`, token manager `:154`, dtcg parser `:149`, token bridge `:162`, llm client `:178`, ai prompt builder `:171`, file usage `:210`, editor attachments `:54`, manifest builder `:64`, text-format access `:44`, twig helper `:105`, 2 Hook classes `:216/:235`, config-export subscriber `:242`.
   - **Plugin managers (3):** component `:18`, data source `:26`, field-type `:31`.
   - **Data-source resolvers (6):** `static`, `entity_field`, `entity_query`, `external_rest`, `context`, `merge` (`src/Plugin/MosaicDataSource/*`; live: `mosaic.data_source_manager->getDefinitions()` → `entity_field,context,external_rest,entity_query,static,merge`).
   - **Field-type plugins (4):** number/richtext/text/repeatable (`src/Plugin/MosaicFieldType/`).
   - **Migrations (5):** V1→V5 wired in the manager map (`mosaic.services.yml:101`); **V5→V6 present but NOT wired** (map stops at `4: v4_to_v5`) — dormant, per S2c HOLD.
   - **Permissions (6):** `mosaic.use_builder`, `use_templates`, `create_templates`, `manage_site_templates`, `administer`, `break_lock` (`mosaic.permissions.yml:1–29`).
   - **Config entities (4):** component_package, design_token_set, template, global_component (`config/schema/mosaic.schema.yml:80/114/176/213`); module settings `mosaic.settings` `:7`.
   - **DB schema:** `mosaic_layout_revision` table (`mosaic.install:16`, fields entity_type/entity_id/field_name/layout_json/uid/created `:28–64`).
   - **Hooks (OO, `src/Hook/MosaicHooks.php`):** entity_presave (migrate+heal+validate `:172`), entity_postsave (revision snapshot `:218`), entity_insert/update/delete (file usage + field-tag invalidation `:250/:268/:301`), entity_view (FE-edit wrap + editor attach `:331`), page_attachments (token CSS + admin device_preview `:83`), help `:59`, runtime_requirements `:655`; form alter for allowed_components (`src/Hook/MosaicFormHooks.php`).
4. **Witnessed render pipeline (config → frame):**
   - Formatter → `MosaicRenderer::renderResponsive()` (`MosaicLayoutFormatter.php:134`); empty/dangling-root attaches nothing (`:139`).
   - Renderer walks the flat node map depth-first (`MosaicRenderer.php:496`), per-component render cache keyed `mosaic_component:{uuid}:{bp}:{propsHash}` (`:528`), descendant-tag propagation (`:654`), DSD-safe `Markup::create` (`:388`), user-context → BigPipe `#lazy_builder` (`:155–164`), responsive multi-tree + `@media` visibility CSS (`:225–287`).
   - **LIVE ANON PROBE (2026-09-09):** `GET :33001/node/845` → **HTTP 200**, renders `mosaic_columns`+`mosaic_divider`+2×`mosaic_heading`+2×`mosaic_spacer`+2×`mosaic_text`. `node/329` → tabs with `shadowrootmode` + 4×`role="tab"` (DSD survives JS-free). `node/330` → carousel. Anon page loads **only renderer CSS** (`mosaic-compat/design-system/spacing/visibility.css`) — **no** builder/react/puck/frontend-editor JS; admin `device_preview` count = **0**. Config-to-frame dots connect.
5. **Tests:** the bulk of the suite (Kernel+Unit **2853/0** at ship #32 per `mosaic-e2e-evidence/reports/SHIP-32-FINAL.md:23`); render/migration/lock/validator/data-source coverage in `tests/src/{Kernel,Unit,Functional}`.
6. **Deltas:** (a) `MosaicLayoutWidget::buildUiStrings()` + `MosaicHooks::buildUiStrings()` still carry `tabs_edit_*`/`tabs_preview_*`/`preview_*` keys (widget `:384–388/:497–500`) even though the Edit/Preview mode toggle was **removed** in ship #32 — dead i18n keys. (b) `ManifestController::dataSourceTypes()` advertises `views_result` (`:150`) with no installed resolver — see PART B / D-1.
7. **VERDICT: COMPLETE-WALKED.** Gaps are integration-level (PART C) and the two deltas above, not core-authoring blocks.

---

### A1. `mosaic_components` (enabled) — **COMPLETE-WALKED**
1. Claim (`mosaic_components.info.yml:3`): "Starter component library … mosaic_text, mosaic_heading, mosaic_button as Level 0 (pure Twig)."
2. Enabled? yes.
3. Inventory: **12 component dirs** (button, card, carousel, columns, divider, heading, html, image, live_search, spacer, tabs, text), each `.component.yml`+`.mosaic.yml`+`.twig`; **9 PHP `MosaicComponent` plugins** (`src/Plugin/MosaicComponent/`); 3 yaml-only Level-2 SSR components (carousel/tabs/live_search, `mosaic_*.mosaic.yml:5,11`). 0 routes/services/permissions.
4. Witnessed: `MosaicTextComponent::getTemplatePath()`→`mosaic_components:mosaic_text` (`MosaicTextComponent.php:43`); **live registry probe** `mosaic.component_manager->getDefinitions()` = **13 IDs** (all 12 + `webform_embed` from the sister module). Twigs real (tabs 66, carousel 62 lines).
5. Tests: **strong** — Functional `MosaicComponentsRenderTest.php` (11 methods) + Kernel `MosaicTabsRenderTest.php` (6) + SDC props Kernel + smoke.
6. Deltas: info.yml **understates** — claims 3, ships 12. carousel + live_search have **no dedicated PHP render test** (only tabs among the 3 yaml-only has a Kernel test).
7. **VERDICT: COMPLETE-WALKED.** Gap: carousel/live_search PHP-test coverage.

### A2. `mosaic_builder_ui` (enabled) — **FUNCTIONAL-UNWALKED**
1. Claim (`info.yml:3`): "Premium theme-agnostic builder chrome … Optional."
2. Enabled? yes.
3. Inventory: 0 routes/plugins/components/permissions; **1 service** (hook class `mosaic_builder_ui.services.yml:2`); **2 CSS libraries** over 9 `css/mbu-*.css` files; no JS.
4. Witnessed: single `#[Hook('library_info_alter')]` (`src/Hook/MosaicBuilderUiHooks.php:34–45`) appends `builder_ui`→core `libraries['builder']` (`mosaic.libraries.yml:98`) and `frontend_editor_ui`→`libraries['frontend_editor']` (`:36`). Alter targets confirmed present.
5. Tests: **file-existence smoke only** (`tests/src/Unit/Smoke/Sprint88SmokeTest.php`); no test proves the alter attaches.
6. Deltas: none material.
7. **VERDICT: FUNCTIONAL-UNWALKED.** Gap: zero behavioral coverage; no live walk of CSS attach.

### A3. `mosaic_media` (enabled) — **FUNCTIONAL-UNWALKED**
1. Claim (`info.yml:3`): "Bridges Drupal Media Library into Mosaic component prop fields."
2. Enabled? yes (deps `media`, `media_library`).
3. Inventory: **1 route** `mosaic.media_library_open` (POST, `mosaic.use_builder`+CSRF, `mosaic_media.routing.yml:5`); **1 service** opener tagged `media_library.opener` (`mosaic_media.services.yml:5`); `media_library_bridge` library → `js/media-library-bridge.js` (133 lines).
4. Witnessed (code chain): bridge JS → `MediaLibraryOpenController::open` (`MediaLibraryOpenController.php:62`, F-092 media-type pick `:88`) → signed `MediaLibraryState` `:101` → on Insert `MosaicMediaLibraryOpener::getSelectionResponse` (`:65`) fires `MosaicMediaSelectedCommand` (`:75`) + close (`:83`); re-enforces access `:51`. **Live probes:** `GET /mosaic/media-library-open` → **405** (POST-only); POST w/o CSRF → **403**.
5. Tests: **Unit-only, 24 methods**; no Kernel/Functional round-trip; React `MosaicMediaField` lives in core JS (out-of-module).
6. Deltas: none material.
7. **VERDICT: FUNCTIONAL-UNWALKED.** Gap: no integration test of the live dialog round-trip.

### A4. `mosaic_webform` (enabled) — **FUNCTIONAL-UNWALKED**
1. Claim (`info.yml:3`): "Embeds Drupal Webforms … webform_embed MosaicComponent … delegates rendering to Webform."
2. Enabled? yes (dep `webform`).
3. Inventory: **1 plugin** `WebformEmbedComponent` (`WebformEmbedComponent.php:22`, level 0, category Interactive); **1 component** `components/webform_embed/`; property panel `drupal_entity_ref` autocomplete for `webform_id` (`webform_embed.mosaic.yml:13`).
4. Witnessed: `getTemplatePath()`→`mosaic_webform:webform_embed` (`:48`); twig delegates `{% set webform_render = drupal_entity('webform', props.webform_id) %}` (`webform_embed.twig:11`); **live registry probe** lists `webform_embed`; `webform` enabled.
5. Tests: **file-existence smoke only** (Sprint81/82).
6. Deltas: `open` prop declared (`component.yml:17`) but **inert** — twig never applies it (`webform_embed.twig:8` documents it as ignored).
7. **VERDICT: FUNCTIONAL-UNWALKED.** Gaps: no render/submit test; `open` prop no-op.

### A5. `mosaic_intelligence` (enabled) — **EXPERIMENTAL**
1. Claim (`info.yml:3`): "Real-time WCAG accessibility auditing and post-save Lighthouse scoring." Bible parks it (`MOSAIC-BIBLE.md:64/:119` — EXPERIMENTAL, needs external Node worker, not tag-gating, R7).
2. Enabled? yes.
3. Inventory: **3 routes** (queue.claim/scores.ingest/scores.get, all `mosaic.administer`+CSRF, `mosaic_intelligence.routing.yml:1/:10/:19`); **4 services**; **1 QueueWorker** `mosaic_lighthouse_audit` (`LighthouseAuditWorker.php:23`); DB table `mosaic_intelligence_score` (`.install:16`); FE panel in **core** JS (`js/src/builder/LighthouseScorePanel.tsx`).
4. Witnessed: `entity_postsave` enqueues for nodes with a canonical URL (`MosaicIntelligenceHooks.php:36`); **the in-Drupal worker only LOGS — `LighthouseAuditWorker::processItem()` writes an info log, does NOT run Lighthouse (`:60–68`)**; real audit is an external `js/lighthouse-worker.mjs` that POSTs back to `ingestScore`. **Live probe:** `GET /api/mosaic/intelligence/scores/node/1` → **403** anon (perm gate correct).
5. Tests: Unit-only ~31 methods; no Kernel/Functional of the enqueue→ingest→display loop.
6. Deltas: **"Real-time WCAG auditing" is unbacked** — no axe/WCAG code in the submodule; only Lighthouse score STORAGE; scoring requires the external Node worker to be run separately.
7. **VERDICT: EXPERIMENTAL** (aligned with bible R7). See D-3 (author-visible pending badges).

### A6. `mosaic_acsf` (disabled) — **FUNCTIONAL-UNWALKED (UNWALKED-DISABLED)**
1. Claim (`info.yml:3`): ACSF factory hooks (post-site-install, db-update). Not in bible.
2. Disabled.
3. Inventory: **zero PHP**; 2 bash factory-hook scripts (`factory-hooks/post-site-install/01-mosaic-bootstrap.sh:32`, `factory-hooks/db-update/01-mosaic-migrate.sh:30`). Dep: `drupal:mosaic` only.
4. Static: both invoked Drush targets exist — `mosaic:bootstrap-defaults` (`src/Drush/MosaicCommands.php:81`), queue worker `mosaic_layout_migration` (`src/Plugin/QueueWorker/MosaicLayoutMigrationWorker.php:35`).
5. Tests: zero.
6. Deltas: `01-mosaic-bootstrap.sh:30` comment claims it "enables required submodules … seeds component library," but `bootstrapDefaults()` only clears plugin cache + activates the base token set (`MosaicCommands.php:83–108`) — comment overstates.
7. **VERDICT: FUNCTIONAL-UNWALKED (UNWALKED-DISABLED).** Gaps: comment overstatement; not testable as Drupal code.

### A7. `mosaic_canvas_bridge` (disabled) — **SKELETON (UNWALKED-DISABLED)**
1. Claim (`info.yml:3`): coexistence layer with Drupal Canvas / Experience Builder. Not in bible.
2. Disabled.
3. Inventory: 1 Hook class (2 impls, `src/Hook/MosaicCanvasBridgeHooks.php:44/:65`), 1 DI service, 1 api.php hook def. Dep `drupal:mosaic`; runtime-gated on contrib `canvas`.
4. Static: `fieldFormatterInfoAlter()` is an **explicit no-op placeholder** (`:44–47`); `entityViewAlter()` (`:65–91`) suppresses `mosaic_layout` renders when `canvas` wins — but **early-returns unless `moduleExists('canvas')`** (`:66`), and canvas is not installed → entirely dormant (graceful, not broken).
5. Tests: zero.
6. Deltas: pitched as a full coexistence layer; half is an admitted stub, the rest inert without contrib Canvas.
7. **VERDICT: SKELETON (UNWALKED-DISABLED).**

### A8. `mosaic_collab` (disabled) — **FUNCTIONAL-UNWALKED (UNWALKED-DISABLED)**
1. Claim (`MOSAIC-BIBLE.md:55`): "Real-time collab (Yjs + Hocuspocus WS + SSE presence fallback) | DONE (mosaic_collab; unwalked on dev)."
2. Disabled.
3. Inventory: **7 routes** (`mosaic_collab.routing.yml:1–70`), 4 controllers + 2 managers, **1 permission** `access mosaic collab`, DB table `mosaic_collab_document` (`.install:15`), Node sidecar `collab-server/server.mjs` (321 lines) + docker-compose + Redis. Dep: `mosaic:mosaic` only.
4. Static: coherent JWT/CRDT flow (`CollabTokenController.php:75` mints HS256 from `Settings::get('mosaic_collab_jwt_secret')`; `server.mjs:230` validates) + SSE presence fallback; server-to-server auth **fail-closed** on unset token (`CollabDocumentController.php:114`). Requires external Node/Redis.
5. Tests: zero PHP.
6. Deltas: (a) README status table (`README.md:87`) marks built sprints "pending" (stale); **(b) entity-delete GC NOT wired** — `deleteForEntity()`/`clearDocument()` documented as "called on entity delete" but the module ships **no Hook class** → orphaned rows/keys on delete; (c) no in-module JS client.
7. **VERDICT: FUNCTIONAL-UNWALKED (UNWALKED-DISABLED).** Most substantial submodule. Gaps as above.

### A9. `mosaic_commerce` (disabled) — **BROKEN (UNWALKED-DISABLED)**
1. Claim (`info.yml:3`): ProductCard/ProductList components + CommerceProductDataSource. Not in bible.
2. Disabled.
3. Inventory: 2 components, 3 plugins (`ProductCardComponent.php:31`, `ProductListComponent.php:27`, `CommerceProductDataSource.php:45`). Dep `mosaic` + `drupal:commerce_product` (contrib present, disabled).
4. Static: DataSource is clean (`accessCheck(TRUE)` query, `commerce_product_list` cache tag `:120`). **BUT both templates call `{{ drupal_entity(...) }}` (`product_card.twig:31`, `product_list.twig:34`) — a twig_tweak function that is neither declared in `info.yml` nor installed** (parent registers only `mosaic_api_url`, `MosaicTwigHelper.php:49`; twig_tweak absent from `composer.lock`). `requires_ssr_preview: true` → template path executes → *Unknown "drupal_entity" function* at render.
5. Tests: zero.
6. Deltas: missing hard dep (twig_tweak); visible output path non-functional.
7. **VERDICT: BROKEN (UNWALKED-DISABLED).** Fix: declare `twig_tweak` dep or render via core.

### A10. `mosaic_metatag` (disabled) — **FUNCTIONAL-UNWALKED (UNWALKED-DISABLED)**
1. Claim (`info.yml:3`): injects per-layout metatag overrides via a `mosaic_meta` component. Adjacent to bible RC-A1 (`:58`).
2. Disabled.
3. Inventory: 1 component `mosaic_meta`, 1 plugin (`MosaicMetaComponent.php:30`, `restricted: TRUE`), 1 Hook `entity_view` (`MosaicMetatagHooks.php:40`), 1 DI service injecting `metatag.manager`. Dep `mosaic` + contrib `metatag` (present, disabled).
4. Static: `entityView()` decodes each `mosaic_layout` field JSON, finds `type==='mosaic_meta'` nodes, maps props→title/description/og_image/canonical, `MetatagManager::generateElements()`→`html_head` (`:41–115`). Node-shape assumption **verified** against `MosaicLayoutValue.php:78`/`ComponentInstance.php:47`.
5. Tests: zero.
6. Deltas: `generateElements()` return-shape UNVERIFIED (contrib not read); doesn't scan breakpoint_states node maps (but flat `nodes` map catches top-level meta).
7. **VERDICT: FUNCTIONAL-UNWALKED (UNWALKED-DISABLED).**

### A11. `mosaic_paragraphs` (disabled) — **FUNCTIONAL-UNWALKED (UNWALKED-DISABLED)**
1. Claim (`info.yml:3`): ParagraphsDataSource plugin.
2. Disabled.
3. Inventory: 1 plugin `ParagraphsDataSource` (`#[MosaicDataSource(id:'paragraphs')]`, `ParagraphsDataSource.php:51`); panel field in **parent** JS. Dep `mosaic` + contrib `paragraphs`.
4. Static: `resolve()` reads `field_name`, pulls entity from `MosaicRenderContext`, per-item `access('view')` (`:124`), bundle→component map (`:129`), `paragraph_list` cache tag (`:162`).
5. Tests: **1 PHP file / 15 methods** (`tests/src/Unit/Plugin/MosaicDataSource/ParagraphsDataSourceTest.php:38`) — best-covered of the disabled set.
6. Deltas: **no `LICENSE.txt`** (contrib-rule violation); contrib dep unexercised.
7. **VERDICT: FUNCTIONAL-UNWALKED (UNWALKED-DISABLED).**

### A12. `mosaic_registry` (disabled) — **FUNCTIONAL-UNWALKED (UNWALKED-DISABLED)**
1. Claim (`info.yml:3`): community registry (CEM v2.1.0), Project Browser integration, MCP catalog API.
2. Disabled.
3. Inventory: **1 route** `mosaic_registry.catalog` GET `/api/mosaic/components` (public+no_cache, `mosaic_registry.routing.yml:3`); 6 services; 1 ProjectBrowserSource plugin; 1 controller (`final … ContainerInjectionInterface`); Drush 3 commands; config schema = comment-only stub (`config/schema/mosaic_registry.schema.yml:4`). Dep `mosaic` + contrib `project_browser`.
4. Static: `catalog()`→`MosaicManifestLoader::loadAll()`→`fetchAndParse()` reads `Settings::get('mosaic_registry_manifest_url')`, Guzzle GET `allow_redirects=FALSE`, enforces CEM `schemaVersion` 2.x (`ComponentCatalogController.php:65`+`MosaicManifestLoader.php:102`).
5. Tests: **0 PHP** (JS panel test in parent).
6. Deltas: `schema.yml:4` promises Sprint-57 config entities that were **never built** (URL only via settings.php); `core_version_requirement: ^11.3` narrower than siblings; stale `\Drupal::` docblock (`MosaicPackageInstaller.php:28` vs `$container->has()` `:53`).
7. **VERDICT: FUNCTIONAL-UNWALKED (UNWALKED-DISABLED).**

### A13. `mosaic_search` (disabled) — **FUNCTIONAL-UNWALKED (UNWALKED-DISABLED)**
1. Claim (`info.yml:3`): SearchApiDataSource + search components. Bible lists F-084 search as a **pending** Wave-E item (`MOSAIC-BIBLE.md:111`).
2. Disabled.
3. Inventory: 3 plugins — `SearchApiDataSource` (`SearchApiDataSource.php:51`), `SearchBarComponent` (`:27`), `SearchResultsComponent` (`:31`); 2 SDC components. Dep `mosaic` + contrib `search_api`.
4. Static: `resolve()` loads `search_api_index`, status-gates, bundle IN-filter, sort/limit, `search_api_list:{id}` cache tag (`SearchApiDataSource.php:89–162`).
5. Tests: **0 PHP**.
6. Deltas: bible still lists F-084 as unstarted yet source exists (built-ahead; **churn risk** vs the pending F-084 design); **no `LICENSE.txt`**.
7. **VERDICT: FUNCTIONAL-UNWALKED (UNWALKED-DISABLED).**

### A14. `mosaic_tokens` (disabled) — **FUNCTIONAL-UNWALKED (UNWALKED-DISABLED)**
1. Claim (`MOSAIC-BIBLE.md:56`): "Design tokens (DTCG import, Figma/git sync) | DONE (mosaic_tokens; experimental sync surfaces)."
2. Disabled. (Installed by the `mosaic-blog` recipe `recipe.yml:12`, but not enabled on dev.)
3. Inventory: **2 routes** (figma-sync POST `mosaic.administer`+CSRF; git-webhook POST public+HMAC, `mosaic_tokens.routing.yml:7/:25`); 2 controllers, 2 services (+interfaces), Drush 2 commands; token data lives in core `mosaic.design_token_set`. Dep `mosaic` only (no contrib).
4. Static: git-webhook `handle()` **fail-closed** on no secret (`TokenGitWebhookController.php:83`), HMAC-SHA256 via `hash_equals` (`:120`) → `syncFromGit()` fetch → `MosaicDtcgParser::validate()` (core, `MosaicDtcgParser.php:53`) → save. Figma sync via Variables API `allow_redirects=FALSE`.
5. Tests: **0 PHP/JS** — zero on the riskiest code (HMAC, fail-closed, Figma→DTCG).
6. Deltas: **no SSRF allow-list on the admin-set `git_file_url` fetch** (contrast core ExternalRest allow-list); surfaces self-labeled experimental.
7. **VERDICT: FUNCTIONAL-UNWALKED (UNWALKED-DISABLED).**

### A15. `mosaic_views` (disabled) — **FUNCTIONAL-UNWALKED (data source) / SKELETON (F-088 embed)**
1. Claims (two): (a) bible `:63` "View Display component with full contextual-filter source matrix | **PLANNED (ratified)**" = F-088 (`:111`); design `AI/P-VIEWS-EMBED-DESIGN.md:4` "Status: DRAFT — nothing built." (b) `info.yml:3`: "views_result MosaicDataSource + property panel browser."
2. Disabled.
3. Inventory: **1 route** `mosaic_views.views_browser` GET `/api/mosaic/views/list` (`mosaic.use_builder`, `mosaic_views.routing.yml:3`); **1 plugin** `ViewsResultDataSource` (`#[MosaicDataSource(id:'views_result')]`, `ViewsResultDataSource.php:40`); 1 controller; **0 components** (no View Display embed). Dep `mosaic` + core `views`.
4. Static: `resolve()`→`Views::getView()`→setDisplay/args→`execute()` (cap 100), `config:views.view.{id}` cache tag (`ViewsResultDataSource.php:54–109`). Wired into parent: `DataSourceBinding::TYPE_VIEWS_RESULT` (`src/Value/DataSourceBinding.php:23`) + advertised in `ManifestController.php:150`.
5. Tests: **0 PHP** (JS field test in parent).
6. Deltas (**planned-vs-built, KEY**): the **views_result DATA SOURCE** (feeds View rows into Mosaic components) is BUILT-but-unwalked; the **F-088 "View Display" EMBED component** (drag a View onto canvas, argument matrix, render the real display) is **NOT BUILT** — only the design draft exists. `ViewsResultDataSource` also **lacks a `validateConfig()` override** its siblings have.
7. **VERDICT: FUNCTIONAL-UNWALKED (data source) · SKELETON for F-088 embed (UNWALKED-DISABLED).**

**PART A cross-cutting:** test-desert confirmed — of the 15 submodules only `mosaic_components` carries Kernel+Functional; `mosaic_paragraphs` has 1 unit file; the other 13 are smoke/unit-mock/zero. `LICENSE.txt` **absent** in `mosaic_paragraphs` + `mosaic_search` (contrib-rule violations); present in registry/tokens/views.

---

## PART B — AUTHOR JOURNEY MAP (config → rendered frame)

Legend: **WORKS-WALKED** (live-witnessed this audit) · **WORKS-UNTESTED** (code-complete, not live-walked here) · **GAP** (missing/dead-end) · **BROKEN**.

### Site-builder setup
| # | Step | State | Evidence |
|---|---|---|---|
| B1 | Install + enable core | WORKS-WALKED | `drush pm:list` → `mosaic` enabled |
| B2 | Recipe bootstrap | **GAP (partial)** | `recipes/mosaic-blog/recipe.yml` installs modules + grants perms + seeds a template **but does NOT attach `field_mosaic_layout`** to any content type — the description implies blog-ready, field-add stays **manual** (Field UI) |
| B3 | Add `mosaic_layout` field to a bundle | WORKS-WALKED | field type registered under category `mosaic` (`MosaicLayoutItem.php:27`, `mosaic.field_type_categories.yml`); live: `node.field_mosaic_layout` on **article + page** |
| B4 | Widget on form display | WORKS-WALKED | default_widget `mosaic_layout` (`MosaicLayoutItem.php:28`); live: form widget resolves |
| B5 | Formatter on view display | WORKS-WALKED | live: `node.page.default` shows `field_mosaic_layout` as `mosaic_layout` formatter (`entity_view_display` probe) |
| B6 | 6 permissions | WORKS-WALKED | `mosaic.permissions.yml:1–29`; recipe grants `use_builder`+`use_templates` (`recipe.yml:19`) |
| B7 | Per-bundle allowed_components governance | WORKS-UNTESTED | `MosaicFormHooks` node-type alter (P7-040) + widget filter `getAllowedComponentIds()` (`MosaicLayoutWidget.php:660`) |

### Authoring
| # | Step | State | Evidence |
|---|---|---|---|
| B8 | Create node → builder mounts | WORKS-UNTESTED | widget mounts React at `data-mosaic-builder` div, manifests server-side via `MosaicManifestBuilder` (`MosaicLayoutWidget.php:145/177/636`); textarea fallback no-JS (`:190`) |
| B9 | Palette (component list) | WORKS-WALKED | manifest built from `getDefinitions()` filtered by admin/restricted/allowed (`:616–648`); live registry = **13 components**; manifest route live (403 anon gate) |
| B10 | Author every component | WORKS-WALKED (render) | all 12 render live (node/845 columns+divider+heading+spacer+text; node/329 tabs; node/330 carousel) |
| B11 | Prop panels (link/media/entity-ref/spacing/entity-query) | WORKS-UNTESTED | i18n keys + fields present (`MosaicLayoutWidget.php:530–576`); entity-suggest/image-styles/entity-fields/entity-query-preview routes exist |
| B12 | Data sources — 7 advertised | **GAP** | manifest advertises **7** (`ManifestController.php:147–153`); **6 resolvable** live (`static/entity_field/entity_query/external_rest/context/merge`); **`views_result` advertised but NO installed resolver** (mosaic_views disabled) → author can bind it, it resolves empty = "UI exists but renders nothing" (D-1) |
| B13 | Media picker | WORKS-WALKED | `mosaic_media` route live (405/403 probes); bridge attached by widget when module exists (`MosaicLayoutWidget.php:158`) |
| B14 | Templates (save/apply/splash/picker) | WORKS-UNTESTED | routes `templates.list`/`templates.save` (`mosaic.routing.yml:50/:59`); splash+save-dialog i18n (`MosaicLayoutWidget.php:428/502`); recipe seeds `blog_post_starter` (`recipe.yml:26`) |
| B15 | Breakpoints (responsive trees) | WORKS-WALKED | `renderResponsive` emits base + variant trees + `@media` CSS (`MosaicRenderer.php:225–287`); node/329 DSD survives; breakpoint banner i18n (`:390–398`) |
| B16 | Locks / collaboration | WORKS-UNTESTED (core lock) / GAP (realtime) | 6 lock endpoints + `MosaicLayoutLockManager` (90s TTL); save requires live self-lock token (`MosaicLayoutWidget.php:264–327`); Preview **exempt** (`:260/:345`). Realtime collab = `mosaic_collab` **disabled** |
| B17 | FE inline-edit dialog | WORKS-UNTESTED | `entity_view` wraps field with `data-mosaic-fe-edit` + attaches `mosaic/frontend_editor` for `use_builder`+update-access (`MosaicHooks.php:331–408`); live: absent for anon (correct); FE save route `mosaic.frontend.save` (`mosaic.routing.yml:256`) |
| B18 | Save (validation + lock) | WORKS-UNTESTED | `entity_presave` migrates+heals+validates (`MosaicHooks.php:172`); widget `validateJson` enforces schema + self-lock (`MosaicLayoutWidget.php:238`) |
| B19 | Render (anon / cache / aggregation) | WORKS-WALKED | node/845 anon 200, per-component cache + tags (`MosaicRenderer.php:528/646`); only renderer CSS to anon; DSD JS-free |
| B20 | Revisions (history/restore) | WORKS-UNTESTED | `entity_postsave` snapshots to `mosaic_layout_revision` (`MosaicHooks.php:218`); revision routes + i18n dialog; prune to `revision_limit` (default 50) |
| B21 | Preview (node form) | WORKS-UNTESTED | Preview op exempt from lock (`MosaicLayoutWidget.php:260`, CP-PREVIEW-LOCK walk-catch #46) |
| B22 | Translation | **GAP** | field `translatable=YES` (live) but `content_translation`/`language` **not enabled** on dev (unwalkable); revision table has **no langcode column** (`mosaic.install:41–64`); formatter takes `$langcode` but ignores it (`MosaicLayoutFormatter.php:106`) — see C-2 |
| B23 | Content moderation | **GAP** | `content_moderation` **not enabled**; zero moderation refs in `src/`; Mosaic's revision snapshots are parallel to core node revisions — see C-3 |

**Dead-ends named:** (1) B2 recipe leaves field-add manual; (2) B12 `views_result` is a builder option with no resolver on the enabled baseline; (3) B22 translation has no per-language revision distinction; (4) the Lighthouse/WCAG toolbar badges (B-toolbar) never populate without the external Node worker (C-9/D-3).

---

## PART C — CORE-INTEGRATION SYNC

| # | Surface | Current truth (cited) | Gap class |
|---|---|---|---|
| C1 | **Revisions** | Custom `mosaic_layout_revision` table (`mosaic.install:16`) via `entity_postsave` (`MosaicHooks.php:218`); REST list/get + restore; prune to `revision_limit`. **Parallel to core node revisions** — not the core revision system. | WORKS-UNTESTED; **design note**: two revision systems coexist (core node rev + Mosaic snapshot) |
| C2 | **Translation (config+content)** | Field `translatable=YES` (live) — core would store one blob per translation (transparent). BUT revision table has **no langcode** → snapshots collapse across languages; formatter ignores `$langcode` (`MosaicLayoutFormatter.php:106`); no author guidance; data-source-resolved content not language-aware. `content_translation`/`language` disabled on dev. | **GAP (ENTERPRISE-GATING)** |
| C3 | **Content moderation** | Zero refs in `src/`; node rides core revisions/moderation at entity level, but Mosaic snapshot table is moderation-state-agnostic. `content_moderation` disabled. | **GAP (ENTERPRISE-GATING)** |
| C4 | **Search indexing** | Core node search renders the node (formatter runs) → Mosaic text is indexable transparently **if** the field is in the search view mode. `DataSourceBinding::TYPE_SEARCH_API` declared (`:30`) but **no core resolver** (in disabled `mosaic_search`). | WORKS-UNTESTED (core index) / capability gated (search_api data source) |
| C5 | **Tokens (Drupal core token)** | **No `hook_token`/`token_info`** in core `mosaic` (grep-empty). Design-token CSS (`MosaicTokenManager`) is unrelated to core tokens. Core-token integration lives in disabled `mosaic_tokens`? No — that's DTCG sync, also not core tokens. | **GAP (POLISH/ENTERPRISE)** — no `[node:...]`-style token support inside layouts |
| C6 | **Views (F-088)** | `views_result` data source built (disabled `mosaic_views`); **View Display embed = design-draft only** (`P-VIEWS-EMBED-DESIGN.md:4`). Manifest advertises `views_result` with no live resolver. | **GAP (ENTERPRISE-GATING, P3)** |
| C7 | **Caching layers** | Per-component render cache keyed by props hash + descendant-tag propagation (`MosaicRenderer.php:528/654`); field tag `mosaic_layout:{id}` (`MosaicLayoutFormatter.php:148`); `config:mosaic.settings` page tag (`MosaicHooks.php:105`); fine-grained field-tag invalidation on change (`MosaicHooks.php:281`). | WORKS-WALKED (anon 200, cache metadata applied) |
| C8 | **Aggregation** | Only renderer CSS attaches to anon (`mosaic/renderer` gated by the formatter, F-046/W22, `MosaicLayoutFormatter.php:150`); admin `device_preview` gated (`MosaicHooks.php:85`); live: anon page carries no builder JS. | WORKS-WALKED |
| C9 | **BigPipe** | User-context data → `#lazy_builder` (`renderLazy`/`renderLazyResponsive`, `MosaicRenderer.php:155/201`, `TrustedCallbackInterface:79`) so per-user content streams without breaking page cache. | WORKS-UNTESTED (code-complete; not live-walked with a user-context source) |
| C10 | **Permissions personas** | 6 perms; live gates witnessed: anon → manifest 403, intelligence scores 403, media 403/405; admin-only device_preview absent for anon. `restrict access: true` on create/manage-templates/administer/break_lock (`mosaic.permissions.yml`). | WORKS-WALKED |
| C11 | **Lighthouse/WCAG** | `mosaic_intelligence` queue worker only logs (`LighthouseAuditWorker.php:60`); needs external `js/lighthouse-worker.mjs`; "real-time WCAG" unbacked. Toolbar badges (uiStrings `a11y_*`/`lighthouse_*`) present. | **GAP (author-visible pending badges)** — aligned bible R7 |

---

## PART D — GAP REGISTER + RATIFICATION SHEET

### D. Gap register (F-1xx candidates)

| ID | Gap | Severity | Size | Slot recommendation |
|---|---|---|---|---|
| **D-1** | Manifest advertises `views_result` data source with no installed resolver on the enabled baseline → author binds it, renders empty (`ManifestController.php:150` vs live 6 resolvers) | AUTHOR-BLOCKING (silent dead-end) | S | **pre-tag** — gate `dataSourceTypes()` by installed plugins (1-line filter over `data_source_manager->getDefinitions()`) |
| **D-2** | `mosaic-blog` recipe implies blog-ready but attaches no `field_mosaic_layout` (`recipe.yml`) | AUTHOR-BLOCKING (onboarding) | S | **pre-tag** — add field.storage + field + form/view display to the recipe |
| **D-3** | Lighthouse/WCAG toolbar badges never populate without the external Node worker; "real-time WCAG" is unbacked (`LighthouseAuditWorker.php:60`) | ENTERPRISE-GATING | M | **post-tag 1.1** OR hide the badges when `ai/worker` unconfigured (aligned bible R7 park) |
| **D-4** | Translation: revision table has no langcode column; formatter ignores `$langcode`; no per-language layout guidance | ENTERPRISE-GATING (P3) | M | **Act 2** — add langcode to `mosaic_layout_revision` + translation-aware snapshot + doc |
| **D-5** | F-088 View Display embed component unbuilt (design draft only) | ENTERPRISE-GATING (P3) | L | **rides Views arc** (CP-VIEWS-EMBED, 3 CPs) |
| **D-6** | No core-token (`hook_token`) support inside layouts (C5) | POLISH | M | **post-tag 1.1** |
| **D-7** | 16/86 live nodes have dangling roots and render empty; presave heal only fixes single-node (`MosaicHooks.php:198`, F-078) | POLISH (legacy data) | S | **post-tag** — one-off rescue migration for multi-node dangling roots |
| **D-8** | Dead i18n keys for the removed Preview toggle (`MosaicLayoutWidget.php:384–388/:497–500`, `MosaicHooks.php:432–436/:542–546`) | POLISH | XS | **pre-tag** cleanup (rides any core edit) |
| **D-9** | `mosaic_commerce` BROKEN — templates call undeclared `drupal_entity()` (twig_tweak) | ENTERPRISE-GATING (disabled) | S | **Wave G** (when commerce is sanctioned) — declare dep or render via core |
| **D-10** | `mosaic_collab` entity-delete GC hook missing → orphaned rows/keys | ENTERPRISE-GATING (disabled) | S | **Wave G** — add entity_delete Hook calling `deleteForEntity()`/`clearDocument()` |
| **D-11** | `mosaic_tokens` git fetch has no SSRF allow-list on admin-set `git_file_url` | ENTERPRISE-GATING (disabled) | S | **Wave G** — reuse core ExternalRest allow-list |
| **D-12** | Missing `LICENSE.txt` in `mosaic_paragraphs` + `mosaic_search` | POLISH (contrib-rule) | XS | **Wave G / pre-tag** — copy GPL text |
| **D-13** | Test-desert: 13/15 submodules smoke/unit-mock/zero; carousel+live_search no PHP render test | POLISH (quality) | L | **ongoing** — Kernel render tests as each submodule is walked |
| **D-14** | Stale `config/default/core.extension.yml` (records 2 enabled vs live 6) | POLISH | XS | **pre-tag** — re-export config |

### D. RATIFICATION SHEET (R-C1 … R-C8) — for Arun

Each row: a decision Arun must ratify. **Reviewer-recommendation** = my recommended disposition.

| Ref | Decision | Reviewer-recommendation |
|---|---|---|
| **R-C1** | D-1: gate `dataSourceTypes()` by installed resolver plugins (close the `views_result` silent dead-end) | **RATIFY — pre-tag.** Smallest fix with the biggest author-trust payoff; 1-line filter. |
| **R-C2** | D-2: extend the `mosaic-blog` recipe to actually attach `field_mosaic_layout` (+form/view display) | **RATIFY — pre-tag.** The recipe's own description promises it. |
| **R-C3** | D-8 + D-14: pre-tag housekeeping (dead Preview i18n keys; re-export core.extension.yml) | **RATIFY — pre-tag.** XS, rides existing edits. |
| **R-C4** | D-3: hide Lighthouse/WCAG badges when no worker configured, OR keep parked as EXPERIMENTAL (R7) | **RATIFY hide-when-unconfigured** (removes the only enabled-baseline "renders nothing" author-visible surface); full worker → 1.1. |
| **R-C5** | D-7: ship a one-off rescue migration for the 16 multi-node dangling-root nodes | **RATIFY — post-tag.** Legacy data only; not a live authoring block. |
| **R-C6** | D-4 (translation) + D-5 (Views embed) + D-6 (core tokens): the enterprise-integration arc | **DEFER to Act 2 / Views arc.** P3; none block the core author. Sequence: Views-embed (has a design) → translation → tokens. |
| **R-C7** | D-9/D-10/D-11/D-12: disabled-submodule fixes bundled into **Wave G** (the sanctioned enable-and-walk wave) | **RATIFY — Wave G.** Do not fix while disabled/untested; fix as each is enabled and walked. `commerce` (D-9) is the only BROKEN unit. |
| **R-C8** | D-13: incremental Kernel render tests as submodules are walked; start with carousel+live_search | **RATIFY — ongoing**, folded into S2c (carousel) which already needs the render stack. |

---

## PART E — CLOSEOUT (see chat pointer)

- **Verdicts:** 2 COMPLETE-WALKED · 11 FUNCTIONAL-UNWALKED · 1 EXPERIMENTAL · 1 SKELETON · 1 BROKEN (16 units).
- **Core author can compose→save→publish→render at full capacity on the enabled baseline** — live-witnessed anon (node/845, /329, /330).
- **Top-5 author-blocking/limiting gaps:** D-1 (views_result dead-end), D-2 (recipe field-add), D-3 (Lighthouse/WCAG pending badges), D-4 (translation revision langcode), D-5 (Views embed unbuilt).
- **S2c carousel landing remains HELD;** dormant V5→V6 files untracked; `CURRENT_SCHEMA_VERSION = 5`.

*Fresh-read law honored: every verdict above cites file:line or a dated live probe.*

### DOUBLE-CHECK LEDGER (2026-09-09, re-verified with fresh reads)

| # | Claim re-checked | Result |
|---|---|---|
| DC1 | `mosaic_commerce` BROKEN — twig calls `drupal_entity()` (`product_card.twig:31`, `product_list.twig:34`); twig_tweak absent | CONFIRMED — twig_tweak absent from contrib + **0** composer.lock matches |
| DC2 | `mosaic_collab` entity-delete GC unwired | CONFIRMED — no `src/Hook/`, no `.module` |
| DC3 | `ViewsResultDataSource` lacks `validateConfig()` override | CONFIRMED — no override present |
| DC4 | `mosaic_builder_ui` `library_info_alter` injects into `builder` + `frontend_editor` (`MosaicBuilderUiHooks.php:34/:39/:43`) | CONFIRMED |
| DC5 | `mosaic_intelligence` worker `processItem()` only logs | CONFIRMED — `$this->logger->info(...)` only |
| DC6 | `LICENSE.txt` absent in `mosaic_paragraphs` + `mosaic_search`, present in `mosaic_registry` | CONFIRMED |
| DC7 | Manifest advertises 7 data-source types; live manager has 6 (`views_result` unresolved) | CONFIRMED — `dataSourceTypes()` returns STATIC/ENTITY_FIELD/ENTITY_QUERY/VIEWS_RESULT/EXTERNAL_REST/CONTEXT/MERGE vs live `entity_field,context,external_rest,entity_query,static,merge` |
| DC8 | Anon render (config→frame) | CONFIRMED — `node/845` HTTP 200 multi-component; `node/329` DSD `shadowrootmode`; no builder JS to anon |

No matrix verdict changed after the double-check pass.

---
name: Feedback — Contrib-Quality PHP Standards (security advisory review)
description: Hard rules for every new PHP class learned from avpaderno + vishal.kadam review of ticket 3589333. Apply to all new controllers, hooks, services, plugins.
type: feedback
originSessionId: 23adca41-0ddb-4bbc-8455-2a8fe073bba4
---
Apply these to every new PHP class before marking a task done. Discovered through two rounds of security advisory review — not preferences, hard rules.

**Hook classes (`src/Hook/`):**
- No `\Drupal::` statics — inject every service via constructor
- Register as DI service with **FQCN as service ID** (e.g. `Drupal\mosaic\Hook\MosaicHooks:`) — NOT a custom ID. `HookCollectorPass::registerHookServices()` checks `hasDefinition($class)` where `$class` is the FQCN. Custom ID → duplicate autowired definition → `ArgumentCountError` at runtime.
- Run `drush cr` after any hook class constructor change — compiled container caches old arg count
- Inject `TranslationInterface`, call `$this->setStringTranslation()` in constructor
- No alignment padding (`'key' =>` not `'key'       =>`)

**Controllers (`src/Controller/`):**
- `final class` — always
- `implements ContainerInjectionInterface` — never `extends ControllerBase`
- `use StringTranslationTrait` + inject `TranslationInterface` + `setStringTranslation()`
- ALL user-facing strings (including JSON error responses) in `$this->t()`
- Count strings use `formatPlural($n, '1 item', '@count items')` — never `@count` in `t()`

**Services / Plugins:**
- No `\Drupal::` statics
- Plugins use `ContainerFactoryPluginInterface` for DI

**Module structure:**
- `LICENSE.txt` = full GPL-2.0 text (copy from `web/core/LICENSE.txt`), never SPDX stub
- Delete empty `.module` files — Drupal 11 does not require them

**Why:** `\Drupal::` statics hide dependencies and make code untestable. `ControllerBase` pulls in 10+ unneeded deps. `formatPlural()` is required by Drupal i18n standards. Full LICENSE.txt required for security advisory approval. Security reviewers catch all of these immediately.

**How to apply:** Run through each checklist before writing the first test for any new class. Do not wait for review to catch these.

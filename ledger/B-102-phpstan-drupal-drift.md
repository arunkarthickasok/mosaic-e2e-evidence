# B-102 — phpstan-drupal rules-version drift (77 pre-existing module errors)

**Found:** CP-ADOPT-6 P3 (CHECKPOINT-3), while running the full-module phpstan gate.

**Symptom.** `./vendor/bin/phpstan analyse --configuration=web/modules/custom/mosaic/phpstan.neon.dist`
(the QA-script invocation, from project root so extension-installer loads phpstan-drupal) reports
**77 errors** at HEAD — none introduced by P3. Spread ~1 error/file across ~40 untouched files.

**Identifier distribution (the 77):**
- `drupal.entityStoragePropertyAssignment` ×12 — storing entity storage as a class property
- `dependencySerializationTraitProperty.unsupportedPrivateProperty` ×11
- `dependencySerializationTraitProperty.unsupportedReadOnlyProperty` ×9
- `argument.missing` ×9 · `argument.type` ×8 · `argument.unknown` ×6
- `property.notFound` ×7 · `missingType.parameter` ×3 · `method.notFound` ×3
- `parameter.phpDocType` ×2 · `method.impossibleType` ×2 · `function.deprecated` ×2
- `class.toStringDeprecated` ×2 · `method.childReturnType` ×1

**Diagnosis.** Newer sniffs (`class.toStringDeprecated`, `drupal.entityStoragePropertyAssignment`,
the `dependencySerializationTrait*` family) are a **phpstan-drupal version bump** that post-dates the
last green "PHPStan L6" run — a `composer update` raised the ruleset and the module accreted a
pre-existing baseline. Not a P3 regression: P3's new methods (`renderSingleComponent`,
`harvestAttachments`, `withAssetUrls`, bound-slot attach) add **0** errors; `MosaicRenderer.php`
carries 3 of the 77 (`renderNode` `@param` phpDocType ×2 @:688; `MosaicLayoutItem::$value` @:224) —
all on lines untouched by P3.

**Remediation options (future cleanup charter, NOT P3-scoped):**
1. Adopt a `phpstan-baseline.neon` to freeze the 77 and gate only new errors (fastest; honest).
2. Fix by class: the DI-anti-pattern ones (`entityStoragePropertyAssignment`,
   `dependencySerializationTrait*`) are mechanical; the `argument.*` are mostly test-mock typing.
3. Pin the phpstan-drupal version if the new rules are deemed out of scope for 1.0.0.

**Recommendation:** option 1 now (a baseline makes the gate meaningful again — new errors fail, the 77
are acknowledged), then chip at the baseline in a dedicated pass. Blocks a clean "phpstan 0/0" claim
until addressed.

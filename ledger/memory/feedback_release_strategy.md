---
name: Feedback — Drupal.org Release Strategy (use dev, not rc tags)
description: Use 1.0.x-dev during active development. No rc tags while security advisory is open. Tag 1.0.0 only after advisory is Approved.
type: feedback
originSessionId: 23adca41-0ddb-4bbc-8455-2a8fe073bba4
---
Use `1.0.x-dev` while the security advisory review is open. Do not create rc tags.

**Rule:** fix → commit → push to `1.0.x`. That is all. No version bumps, no release nodes.

**How dev releases work:** Any push to `1.0.x` automatically updates `1.0.x-dev` on drupal.org. Reviewers install with `composer require drupal/mosaic:1.0.x-dev`. No manual release node needed.

**When to tag:** Only after the security advisory application is **Approved** (status = Fixed/Closed). Then tag `1.0.0` — one stable release.

**Why:** Each rc tag required version bump → commit → push → release node → reply to reviewer (4 manual steps). Dev requires only push (1 step). The rc chain (rc1, rc2, rc3) was unnecessary churn that also gave a false signal of stability during active review.

**How to apply:** Never bump `version:` in `mosaic.info.yml` or create a drupal.org release node while a reviewer issue is open. Update CHANGELOG.md as a record, but do not tag.

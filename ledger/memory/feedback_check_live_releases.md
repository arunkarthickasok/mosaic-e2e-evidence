---
name: Feedback — Check live Drupal.org releases before bumping version
description: Always fetch drupal.org/project/mosaic/releases before deciding what the next version number should be
type: feedback
originSessionId: 23adca41-0ddb-4bbc-8455-2a8fe073bba4
---
Always check `https://www.drupal.org/project/mosaic/releases` before bumping the version in `mosaic.info.yml` and `composer.json`.

**Why:** In Sprint 38, the version was bumped to rc2 without checking — rc2 was already live on Drupal.org. The correct version was rc3. User caught this by sharing the releases URL directly.

**How to apply:** Before any `version:` bump, run `WebFetch` on the releases page and read the highest existing tag. The next version is that +1. Never assume the local `mosaic.info.yml` version reflects what is live on Drupal.org.

---
name: feedback_isolation_law
description: PATH ALLOWLIST LAW — state-changing git permitted in exactly ONE dir (evidence repo); everywhere else read-only; isolation self-check on every sync
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 23adca41-0ddb-4bbc-8455-2a8fe073bba4
  modified: 2026-09-09T19:02:42.416Z
---

**PATH ALLOWLIST LAW (Arun-ratified 2026-09-09, verbatim):**

State-changing git (`add`/`commit`/`push`/`branch`/`stash`/`reset`) is permitted in EXACTLY ONE directory: `/Users/arun/projects/Drupal/drupalak/mosaic-e2e-evidence`. Everywhere else on this machine — the mosaic module repo, the drupalak site root, and ANY other repo or directory (including all of Arun's work projects) — is read-only territory: **before ANY git state op, verify cwd is the allowlisted path, else HARD ABORT + report.** `AI/**` and implementer `.md` files travel ONLY to the evidence repo `ledger/`, never to the mosaic repo (gitignored + ceremony noise-grep enforce), never to drupal.org, never anywhere else.

(Editing a gitignored file such as `AI/TODO.md` in the mosaic module is a file write, NOT a git state op, so it is permitted — only git state ops are path-locked.)

**ISOLATION SELF-CHECK — run + PRINT on EVERY post-ship sync + every run closeout. Any failure = STOP everything + report:**
- (a) `git -C <mosaic> check-ignore AI` → must report `AI` ignored. NOTE: after the LEDGER RELOCATION, `AI` is a **symlink**, so check the bare `AI` (the mosaic `.gitignore` line is `AI`, no trailing slash — a slash would only match a directory). Do NOT use `check-ignore AI/TODO.md`: git errors `fatal: … beyond a symbolic link` on any pathspec through the symlink (that error is itself proof git cannot traverse into the ledger — harmless).
- (b) `git -C <mosaic> status --short | grep '^[AM].*AI'` → must be empty (no `AI` symlink or AI-path staged/added in the mosaic repo).
- (c) evidence repo `git remote -v` → must be `arunkarthickasok/mosaic-e2e-evidence`.
- (d) secret-guard result (`password|secret|token=|api_key|BEGIN.*PRIVATE|hash_salt`; see [[feedback_evidence_repo_law]]).
- (e) `readlink <mosaic>/AI` → must resolve to `<evidence-repo>/ledger-live`.

**LEDGER RELOCATION (Arun-ratified 2026-09-09):** `<mosaic>/AI` physical home moved OUT of the module INTO `<evidence-repo>/ledger-live`; `<mosaic>/AI` is now an absolute **symlink** → `ledger-live`, so every existing `AI/...` path still resolves. Report/album/ledger writes land in `ledger-live` **directly** (no copy step). The mosaic `.gitignore` line was changed `AI/` → `AI` so the symlink stays ignored (evidence commit `d8949d0`). Repo stays public until tag, then private.

**ROLLBACK RECIPE (recorded):** `rm <mosaic>/AI && mv <evidence-repo>/ledger-live <mosaic>/AI` (then revert the mosaic `.gitignore` line `AI` → `AI/`).

Complements [[feedback_evidence_repo_law]] (what may be pushed + the guard) and [[feedback_commit_flow]] (mosaic git is Arun-only). See [[project_mosaic]].

---
name: feedback-commit-flow
description: "When AI thinks a commit is needed, checkout the branch, do git add, then give Arun one line commit message to run himself"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 23adca41-0ddb-4bbc-8455-2a8fe073bba4
---

When it's time to commit: AI checks out the branch, runs `git add` on the right files, then tells Arun what's staged and gives him ONE LINE commit message to paste himself.

**Why:** Arun performs all commits personally (per working agreement), but he wants AI to handle the branch/staging legwork so he only has to paste a single command.

**How to apply:** After proving a story local, do:
1. `git checkout -b feature/s0.N-...` (or checkout existing branch)
2. `git add <specific non-gitignored files>`
3. Tell Arun: "Staged. Run: `git commit -m '...'`"

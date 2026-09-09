---
name: Project — Reactak (Portfolio Site)
description: Headless Drupal 11 portfolio with React 19 frontend + Express BFF. Status: feature-complete except image optimization and prod deployment.
type: project
originSessionId: 23adca41-0ddb-4bbc-8455-2a8fe073bba4
---
**What it is:** Personal portfolio for Arun Karthick (Senior Drupal Developer). Drupal 11 as pure JSON:API backend, React 19 TypeScript frontend, Express BFF for OAuth.

**Status (May 2026):** Feature-complete. Remaining: image optimization + production deployment.

**Architecture:**
- React frontend (Vite, React Router, Three.js landing, AuthContext, Axios) — separate repo at `~/projects/CORE/react/reactak/`
- Express BFF on port 4000 — proxies OAuth, keeps secrets server-side
- Drupal 11 on DDEV, HTTP port 33000 (NOT HTTPS — Node rejects DDEV self-signed certs)

**Key gotchas documented in REACTAK_NOTES.md:**
- Use HTTP port 33000 for server-to-server calls (HTTPS 33001 breaks Node)
- Google Fonts via `<link>` in index.html (NOT `@import` in CSS — Vite 500 error)
- React StrictMode removed (Three.js double-mounts canvas)
- Vite 8 uses `rolldownOptions` not `rollupOptions`; ES module output (NOT IIFE)
- Token stored in memory/AuthContext (not localStorage)

**Contrib modules for headless:** simple_oauth, jsonapi_extras, consumers, restui

**Why:** Deploy target: Netlify/Vercel (frontend), Railway/Render/VPS (BFF), Acquia Cloud/Pantheon (Drupal).
**How to apply:** When suggesting changes to Reactak, keep the BFF pattern intact and respect the token-in-memory auth strategy.

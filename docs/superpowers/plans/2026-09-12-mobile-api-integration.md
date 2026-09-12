# OWC Mobile/PWA API Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect the existing OWC PWA to OWC-owned APIs while preserving the current UI and keeping CPPS, Drupal and external integrations server-side.

**Architecture:** Add a small typed client boundary in `src/lib/api.ts` using `NEXT_PUBLIC_OWC_API_BASE_URL`. Screens consume OWC-normalized contracts only. Mock data remains an explicit fallback until a live OWC endpoint is configured.

**Tech Stack:** Next.js 15, React 18, TypeScript, Bun, Tailwind CSS.

**Spec:** `docs/superpowers/specs/2026-09-12-mobile-api-integration-design.md`

## Global Constraints

- Mobile/PWA must never call CPPS, Drupal, Supabase service-role operations, banking, NID, IRC, or other authoritative services directly.
- Preserve existing screen structure and navigation unless live-data states require minimal changes.
- Use test-first development for every production behavior.
- CI must run tests, type-check/lint and production build before merge.

---

### Task 1: Establish API client seam and CI

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `src/lib/api.test.ts`
- Create after RED verification: `src/lib/api.ts`

**Interfaces:**
- Produces: `buildOwcApiUrl(path: string, baseUrl?: string): string`
- Produces: `isOwcApiConfigured(baseUrl?: string): boolean`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, test } from "bun:test";

describe("OWC mobile API client", () => {
  test("builds normalized OWC API URLs", async () => {
    let api: Record<string, unknown> = {};
    try { api = await import("./api"); } catch {}
    const build = api.buildOwcApiUrl as undefined | ((path: string, base?: string) => string);
    expect(build?.("/api/claims/track", "https://owc.gov.pg/")).toBe("https://owc.gov.pg/api/claims/track");
  });
});
```

- [ ] **Step 2: Run CI and verify RED**

Expected: `bun test` fails because `buildOwcApiUrl` is absent.

- [ ] **Step 3: Implement minimal API URL helper**

Create `src/lib/api.ts` with URL normalization and configured-state helper only.

- [ ] **Step 4: Re-run CI and verify GREEN**

Expected: tests, lint/type-check and build pass.

- [ ] **Step 5: Commit**

Commit message: `feat: add OWC mobile API client boundary`.

### Task 2: Claim tracking adapter

**Files:**
- Modify: `src/lib/api.test.ts`
- Modify: `src/lib/api.ts`
- Modify: `src/components/screens/track-screen.tsx`

**Interfaces:**
- Produces: `trackClaim(input, options?): Promise<MobileClaimTrackResult>`

- [ ] **Step 1: Add failing tests for configured API and mock fallback**
- [ ] **Step 2: Verify RED**
- [ ] **Step 3: Implement normalized claim tracking adapter**
- [ ] **Step 4: Connect tracking screen to adapter with loading/error state**
- [ ] **Step 5: Verify tests, lint and build GREEN**
- [ ] **Step 6: Commit**

### Task 3: Claim lodgement and employer services

**Files:**
- Modify: `src/lib/api.test.ts`
- Modify: `src/lib/api.ts`
- Modify: `src/components/screens/lodge-screen.tsx`
- Modify: `src/components/screens/employer-screen.tsx`

**Interfaces:**
- Produces: `lodgeClaim(input, options?)`
- Produces: `verifyEmployer(input, options?)`
- Produces: `reportInjury(input, options?)`

- [ ] **Step 1: Add failing contract tests**
- [ ] **Step 2: Verify RED**
- [ ] **Step 3: Implement minimal adapters**
- [ ] **Step 4: Wire existing forms to live adapters without redesigning screens**
- [ ] **Step 5: Verify GREEN**
- [ ] **Step 6: Commit**

### Task 4: Drupal-backed public content through OWC API

**Files:**
- Modify: `src/lib/api.test.ts`
- Modify: `src/lib/api.ts`
- Modify: `src/components/screens/news-screen.tsx`
- Modify: `src/components/screens/forms-screen.tsx`

**Interfaces:**
- Produces: `getPublicNews(options?)`
- Produces: `getPublicForms(options?)`

- [ ] **Step 1: Add failing normalized-content tests**
- [ ] **Step 2: Verify RED**
- [ ] **Step 3: Implement OWC public-content adapters**
- [ ] **Step 4: Wire screens with explicit fallback behavior**
- [ ] **Step 5: Verify GREEN**
- [ ] **Step 6: Commit**

### Task 5: PWA security and release verification

**Files:**
- Modify only if needed: `public/sw.js`, `README.md`, `.env.example`

- [ ] **Step 1: Confirm service worker does not cache claim/API responses**
- [ ] **Step 2: Document `NEXT_PUBLIC_OWC_API_BASE_URL`**
- [ ] **Step 3: Run full CI**
- [ ] **Step 4: Open draft PR to `main`**
- [ ] **Step 5: Review diff and verify no credentials or direct authoritative-system calls exist**

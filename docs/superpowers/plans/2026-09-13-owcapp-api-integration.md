# OWC Mobile/PWA API Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect the OWC mobile/PWA to the main OWC API through typed, server-mediated interfaces for claims, employer services, and public content.

**Architecture:** The PWA browser talks only to same-origin Next.js route handlers. Those handlers use a server-only typed OWC client configured with `OWC_API_BASE_URL` to call the main OWC platform. Existing local reference data remains available only as an explicitly controlled public-content preview fallback; transactional claim and employer operations fail closed when the OWC API is unavailable.

**Tech Stack:** Next.js 15.3.7, React 18.3.1, TypeScript 5.8, Bun test runner, existing Tailwind/shadcn UI.

**Spec:** `docs/superpowers/specs/2026-09-13-owcapp-api-integration-design.md`

## Global Constraints

- PWA must never call CPPS, NID, IRC, IPA, banks, medical providers, insurers, or notification services directly.
- `OWC_API_BASE_URL` is server-only; no service credential may be placed in `NEXT_PUBLIC_*`.
- Main OWC remains the authorization, audit, integration-policy, and downstream-system boundary.
- Transactional claim/employer operations fail closed if the authoritative OWC API is unavailable.
- Public presentation copy must not expose demo/mock/sandbox wording.
- Preserve the current mobile-first interaction and visual structure unless a functional integration requires a targeted change.

---

### Task 1: Test harness and typed API foundation

**Files:**
- Modify: `package.json`
- Create: `src/lib/api/contracts.ts`
- Create: `src/lib/api/client.ts`
- Create: `src/lib/api/client.test.ts`
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Produces: `owcRequest<T>(path: string, init?: RequestInit): Promise<T>`
- Produces typed claim, employer, news, and forms contracts used by later tasks.

- [ ] **Step 1: Write failing tests for URL joining, JSON response handling, non-2xx normalization, malformed response handling, and timeout behavior.**
- [ ] **Step 2: Run `bun test src/lib/api/client.test.ts` and confirm failures are due to missing client behavior.**
- [ ] **Step 3: Add `"test": "bun test"` to `package.json`; implement minimal typed contracts and `owcRequest` using server-only `OWC_API_BASE_URL`.**
- [ ] **Step 4: Run `bun test`, `bun run lint`, and `bun run build`; confirm all pass.**
- [ ] **Step 5: Add CI that runs install, tests, lint/type-check, and production build on pushes/PRs.**
- [ ] **Step 6: Commit `test/api foundation` changes.**

### Task 2: Same-origin claim tracking proxy

**Files:**
- Create: `src/app/api/owc/claims/track/route.ts`
- Create: `src/app/api/owc/claims/track/route.test.ts`
- Modify: `src/components/screens/track-claim.tsx`

**Interfaces:**
- Consumes: `owcRequest<ClaimTrackResponse>`
- Produces: POST `/api/owc/claims/track` with `{ reference: string }` and normalized tracking response.

- [ ] **Step 1: Write failing route/client tests for valid tracking request, invalid/empty reference, upstream 404, and upstream unavailability.**
- [ ] **Step 2: Run the focused tests and verify RED.**
- [ ] **Step 3: Implement the proxy route with validation and safe error mapping.**
- [ ] **Step 4: Replace the screen's hard-coded tracking lookup with same-origin fetch while retaining current UI state/labels.**
- [ ] **Step 5: Run focused tests plus full test/lint/build suite.**
- [ ] **Step 6: Commit claim tracking integration.**

### Task 3: Claim lodgement proxy

**Files:**
- Create: `src/app/api/owc/claims/lodge/route.ts`
- Create: `src/app/api/owc/claims/lodge/route.test.ts`
- Modify: `src/components/screens/lodge-claim.tsx`

**Interfaces:**
- Consumes: `owcRequest<ClaimLodgeResponse>`
- Produces: POST `/api/owc/claims/lodge` using the existing lodgement form payload and returns a claim reference/receipt.

- [ ] **Step 1: Write failing tests for required claimant/employer/injury fields, successful reference creation, upstream validation failure, and service failure.**
- [ ] **Step 2: Verify focused tests fail for missing route behavior.**
- [ ] **Step 3: Implement proxy/normalization without introducing downstream-system calls.**
- [ ] **Step 4: Connect the existing lodgement form and confirmation state to the route.**
- [ ] **Step 5: Run full verification.**
- [ ] **Step 6: Commit claim lodgement integration.**

### Task 4: Employer services integration

**Files:**
- Create: `src/app/api/owc/employers/verify/route.ts`
- Create: `src/app/api/owc/injuries/route.ts`
- Create: focused tests for both routes
- Modify: `src/components/screens/employer-services.tsx`

**Interfaces:**
- Consumes: main OWC employer verification and injury-report endpoints.
- Produces: same-origin employer verification and injury-report operations for the screen.

- [ ] **Step 1: Write failing validation/upstream/error tests.**
- [ ] **Step 2: Verify RED.**
- [ ] **Step 3: Implement routes through the typed main-OWC client only.**
- [ ] **Step 4: Connect existing employer-service UI actions.**
- [ ] **Step 5: Run full verification.**
- [ ] **Step 6: Commit employer integration.**

### Task 5: Public news and forms through OWC content service

**Files:**
- Create: `src/app/api/owc/content/news/route.ts`
- Create: `src/app/api/owc/content/forms/route.ts`
- Create: `src/lib/api/public-content.ts`
- Create: tests for normalization/fallback policy
- Modify: `src/components/screens/news.tsx`
- Modify: `src/components/screens/forms.tsx`

**Interfaces:**
- Consumes: main OWC public-content interface, which may be Drupal-backed.
- Produces: typed news/forms arrays for existing PWA screens.

- [ ] **Step 1: Write failing tests proving remote content is preferred and controlled local fallback is used only when explicitly enabled.**
- [ ] **Step 2: Verify RED.**
- [ ] **Step 3: Implement public content helpers/routes; do not connect the PWA directly to Drupal.**
- [ ] **Step 4: Connect news/forms screens without visible demo/mock/sandbox labels.**
- [ ] **Step 5: Run full verification.**
- [ ] **Step 6: Commit public-content integration.**

### Task 6: Operational documentation and final branch verification

**Files:**
- Modify: `README.md`
- Create or modify: `.env.example` if absent/present

**Interfaces:**
- Documents: `OWC_API_BASE_URL`, preview fallback switch if implemented, deployment boundary, and production requirements.

- [ ] **Step 1: Document server-only API configuration and explicitly prohibit `NEXT_PUBLIC_OWC_API_BASE_URL` for authenticated/service traffic.**
- [ ] **Step 2: Document which screens are live-integrated and which external integrations remain mediated by the main OWC platform.**
- [ ] **Step 3: Run `bun test`, `bun run lint`, `bun run build`, and inspect latest GitHub Actions run.**
- [ ] **Step 4: Review branch diff for credentials, direct downstream URLs, demo/mock/sandbox presentation copy, and unrelated changes.**
- [ ] **Step 5: Commit documentation/final cleanup and prepare branch for review.**

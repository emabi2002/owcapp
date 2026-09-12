# OWC Mobile/PWA API Integration Design

## Goal
Connect the existing OWC mobile/PWA experience to OWC-owned application APIs without allowing the mobile client to call CPPS, Drupal, Supabase service-role operations, or external government/financial services directly.

## Architecture
The mobile/PWA remains the presentation client. It calls a single configurable OWC API base URL. The OWC web/platform application remains the policy and integration boundary and is responsible for claim processing, CPPS access, Drupal content access, security, auditing, notifications, and future agency integrations.

Mobile/PWA -> OWC API -> OWC application/integration services -> CPPS / Drupal / approved external services.

## Scope
1. Introduce a typed mobile API client in `src/lib/api.ts`.
2. Keep a controlled mock fallback for offline/demo operation while clearly reporting the response source.
3. Integrate claim tracking and claim lodgement first.
4. Integrate employer verification/reporting next.
5. Integrate public content (news/forms) through OWC-owned APIs; Drupal is never called directly by the mobile client.
6. Preserve the existing UI and navigation unless a screen needs a minimal loading/error state to support live data.
7. Add automated CI for tests, type-check/lint, and production build.

## API contract
The mobile client uses `NEXT_PUBLIC_OWC_API_BASE_URL` as the only public backend base URL. Initial endpoints:
- `POST /api/claims/track`
- `POST /api/claims/lodge`
- `POST /api/employers/verify`
- `POST /api/injuries`
- `POST /api/enquiries`

Public content endpoints will be exposed by OWC and may internally source Drupal content. The client must not require Drupal credentials or Drupal-specific response shapes.

## Data and security rules
- No CPPS API key, Supabase service-role key, Drupal administrative credential, banking credential, government service credential, or malware-scanner credential is stored in the PWA.
- Public API responses must be safe for a browser/mobile client.
- Errors returned to users are non-sensitive and actionable.
- Claim and identity information is not persisted in service-worker caches beyond existing static assets.
- Existing mock data remains available only as an explicit development/demo fallback until the live OWC endpoint is configured.

## Testing
Use Bun tests. Every new API behavior is introduced test-first. CI runs:
1. `bun install --frozen-lockfile`
2. `bun test`
3. `bun run lint`
4. `bun run build`

## Rollout
Phase 1 creates the API seam and CI. Phase 2 connects claim tracking. Phase 3 connects claim lodgement and employer services. Phase 4 connects Drupal-backed public content. Phase 5 verifies PWA/offline behavior and removes any remaining production dependency on mock operational data.

## Acceptance criteria
- Existing PWA builds successfully.
- API URL composition is deterministic and strips duplicate slashes.
- Claim tracking can use OWC live API when configured and deterministic local fallback when not configured.
- No external authoritative system is contacted directly from client code.
- CI is green before any merge to `main`.

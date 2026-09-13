# OWC Mobile/PWA API Integration Design

## Purpose

Connect the existing OWC mobile-first PWA to the authoritative OWC web/API platform without allowing the browser application to connect directly to CPPS, NID, IRC, banks, medical providers, insurers, or other external agency systems.

## Architecture

The PWA remains a separate Next.js application and communicates only with the OWC application/API boundary. Browser-facing screens use same-origin Next.js route handlers where practical; those route handlers call the configured OWC API base URL on the server. This keeps deployment credentials and integration policy out of public `NEXT_PUBLIC_*` variables and avoids making the mobile browser responsible for CORS or downstream agency authentication.

The main OWC platform continues to own authorization, claim-processing policy, audit, external integrations, and Drupal content mediation. The mobile application is a presentation/client channel, not a second system of record.

## Initial scope

The first implementation slice covers claim tracking, claim lodgement, employer services, and public news/forms. Existing screen structure and presentation are retained where possible. Hard-coded data may remain as a controlled preview fallback only when the remote API is unavailable or not configured; the visible UI must not label the experience as demo, mock, sandbox, or synthetic.

## API client boundary

A typed client under `src/lib/api/` defines request/response contracts and one URL/request helper. Application screens do not construct remote URLs directly. Same-origin route handlers under `src/app/api/owc/` proxy supported operations to the main OWC platform using a server-only `OWC_API_BASE_URL` setting.

No API key, service credential, or downstream integration secret is placed in a `NEXT_PUBLIC_*` environment variable.

## Data flow

Claim tracking: PWA form -> same-origin OWC route -> main OWC `/api/claims/track` -> normalized response -> existing tracking UI.

Claim lodgement: PWA form -> same-origin OWC route -> main OWC `/api/claims/lodge` -> claim reference/receipt -> confirmation UI.

Employer services: PWA form -> same-origin OWC route -> main OWC employer/injury endpoints -> normalized response -> employer screen.

News/forms: PWA -> same-origin public-content route/client -> main OWC content service -> Drupal-backed content when configured, with the main OWC service retaining its existing fallback policy.

## Failure policy

Client-facing errors are normalized into safe, plain-language messages. Remote HTTP errors, malformed payloads, and timeouts do not expose credentials or internal URLs. In controlled preview environments, existing local reference data can keep selected public screens usable when explicitly allowed. Production deployment should fail closed for transactional claim/employer operations when the authoritative OWC API is unavailable.

## Testing

Use Bun tests for URL construction, response normalization, error mapping, and fallback policy. GitHub Actions runs tests, type-check/lint, and the Next.js production build. Screen integration follows test-first changes around the client functions before replacing hard-coded helpers.

## Security and governance constraints

- Mobile/PWA never calls CPPS, NID, IRC, IPA, banks, medical systems, insurers, or notification providers directly.
- No server credential is exposed through `NEXT_PUBLIC_*`.
- Main OWC remains the authorization, audit, and integration-policy boundary.
- Presentation-facing copy does not claim an external production integration is live unless it has been verified.
- Restricted claim evidence and compensation/payment records remain outside Drupal.

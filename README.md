# OWC PNG — Workers Compensation Mobile App

Official mobile services for the **Office of Workers Compensation (OWC)**, Ministry of Labour & Employment, Independent State of Papua New Guinea.

Built as an **installable Progressive Web App (PWA)** so it can be added to the home screen on Android and iOS, with an architecture that maps cleanly to a future native mobile client.

## Features

- **Splash + sign-in experience** — phone/email, guest mode and staff entry points
- **Home dashboard** — quick actions, claim snapshot, news ticker and install prompt
- **Lodge a claim** — guided multi-step claim form and declaration
- **Track a claim** — OWC API-backed reference lookup with status timeline
- **Employer services** — employer verification plus reporting/compliance guidance
- **Forms & downloads** — searchable OWC public forms catalogue with authoritative download links when published
- **News & public notices** — OWC public-content API with local demonstration fallback
- **Contact & enquiry** — enquiry form and office details
- **Fraud reporting** — confidential reporting experience
- **Notifications centre** and **user account / profile**
- **Staff quick review** — admin-lite claim queue

## Enterprise integration model

The PWA is a presentation client. It does **not** connect directly to CPPS, Drupal, Supabase service-role operations, banking services, NID, IRC or other authoritative external systems.

```text
Mobile / PWA
    |
    v
OWC Public & Application APIs
    |
    +--> OWC claims/application services --> CPPS
    +--> OWC public content layer ---------> Drupal (preferred CMS)
    |                                        -> Supabase migration fallback
    |                                        -> seed fallback
    +--> OWC controlled integration layer --> approved external services
```

The browser-visible backend setting is:

```env
NEXT_PUBLIC_OWC_API_BASE_URL=https://owc.gov.pg
```

If it is left blank, the PWA uses explicit local demonstration data. See `.env.example`.

### Initial OWC API contracts

- `POST /api/claims/track`
- `POST /api/claims/lodge`
- `POST /api/employers/verify`
- `POST /api/injuries`
- `GET /api/public/news`
- `GET /api/public/forms`

News and forms are normalized by the OWC platform. The PWA does not depend on Drupal credentials or Drupal-specific JSON:API shapes.

## Evidence files and CAPTCHA

The current claim-lodgement screen lets a user select document/photo metadata and records the document count with the claim. **The selected file bytes are not yet transferred by the PWA during initial lodgement.** Secure evidence upload is handled as a separate controlled evidence workflow and must be completed before claiming end-to-end mobile document upload.

The existing arithmetic security check is compatible with the OWC server's `fallback` CAPTCHA mode. When Turnstile, reCAPTCHA or hCaptcha is enabled on the OWC platform, the PWA must supply the corresponding provider token; the server will correctly reject a missing/invalid production token.

## Installable PWA and offline policy

- Web app manifest with square + maskable icons (192/512)
- Service worker for installability and offline shell/static-asset caching
- In-app install banner — one-tap install on Android and Add-to-Home-Screen guidance on iOS
- **`/api/` traffic is never intercepted or stored in the PWA cache**, preventing claim/status or other operational API responses from being retained for offline replay

## Tech stack

- Next.js 15 (App Router, static export)
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Bun package manager and tests
- Lucide icons and Sonner toasts

## Getting started

```bash
cp .env.example .env.local
bun install
bun run dev
```

Open `http://localhost:3000`.

For demonstration mode, leave `NEXT_PUBLIC_OWC_API_BASE_URL` blank. For live API mode, set it before building because `NEXT_PUBLIC_*` variables are compiled into the static client bundle.

## Build and verification

```bash
bun test
bun run lint
bun run build
```

The production static export is written to `./out`.

GitHub Actions runs the same test, type-check/lint and build gate on pushes and pull requests.

## Hosting note

The PWA uses a static export. The preferred deployment is an OWC-controlled same-origin or reverse-proxied topology so browser calls reach OWC APIs without broad cross-origin exposure. If the PWA is hosted on a separate origin, the OWC API must use a restrictive allowlist for the approved PWA origin; do not use wildcard CORS for claim or identity-related endpoints.

## Project structure

```text
src/
  app/                    # Next.js app router, layout, global styles
  components/
    app/                  # phone shell, status bar, bottom nav, install banner
    employer/             # employer-service integration UI
    screens/              # one file per app screen
    ui/                   # shadcn/ui primitives
  lib/
    api.ts                # typed OWC API boundary + explicit demo fallbacks
    api.test.ts           # operational API contract tests
    claim-lodgement.ts    # mobile form -> OWC claim contract mapping
    owc-data.ts           # local demonstration content/data fallback
    nav.tsx               # stage/screen/role navigation
    pwa.tsx               # PWA install + service-worker registration
public/
  manifest.json
  sw.js                   # static/offline cache; excludes /api/ traffic
  icons
```

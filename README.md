# OWC PNG — Workers Compensation Mobile App

Official mobile services for the **Office of Workers Compensation (OWC)**, Ministry of Labour & Employment, Independent State of Papua New Guinea.

Built as an **installable Progressive Web App (PWA)** for Android and iOS. The PWA uses the OWC portal/API as its single application boundary so claim, employer, injury and public-content services remain governed centrally.

## Features

- **Splash + secure sign-in** — phone/email with one-time passcode (OTP), guest mode, and OWC staff sign-in
- **Home dashboard** — quick actions, claim snapshot, news ticker, install prompt
- **Lodge a claim** — guided multi-step form that registers the claim through the OWC service and returns the OWC claim reference
- **Track a claim** — OWC claim-reference lookup with a status timeline
- **Employer services** — employer registration verification, workplace injury reporting and compliance guidance
- **Forms & downloads** — OWC-managed forms library
- **News & public notices** — OWC-managed news and article detail
- **Contact & enquiry** — enquiry form, office details, emergency line
- **Fraud reporting** — secure, anonymous-capable reporting
- **Notifications centre** and **user account / profile**
- **Staff quick review** — admin-lite claim queue

## OWC API boundary

The browser does not call CPPS, NID, IRC, banks, insurers, medical providers or other downstream systems directly. Browser requests go to same-origin Next.js handlers under `src/app/api/owc/**`; those server handlers call the authoritative OWC portal/API using the server-only `OWC_API_BASE_URL` setting. This keeps credentials, authorization, audit policy and downstream integrations outside the browser.

Transactional operations such as claim tracking, claim lodgement, employer verification and injury reporting fail closed when the OWC API is unavailable. Public news and forms can use the controlled local content set only when `NEXT_PUBLIC_OWC_PUBLIC_CONTENT_FALLBACK=true`; this flag is non-secret and is intended for controlled presentation/offline use rather than authoritative production data.

## Environment

Copy `.env.example` to the deployment environment and set the OWC API base URL:

```env
OWC_API_BASE_URL="https://www.owc.gov.pg"
NEXT_PUBLIC_OWC_PUBLIC_CONTENT_FALLBACK="false"
```

Do **not** create a `NEXT_PUBLIC_OWC_API_BASE_URL`; the upstream OWC endpoint belongs on the server side.

## Installable PWA

- Web app manifest with square + maskable icons (192/512)
- Service worker for installability and offline-ready caching
- In-app install banner — one-tap install on Android, Add-to-Home-Screen guidance on iOS

## Tech stack

- [Next.js 15](https://nextjs.org) App Router with server route handlers
- TypeScript
- Tailwind CSS + [shadcn/ui](https://ui.shadcn.com)
- [Bun](https://bun.sh) package manager and test runner
- Lucide icons, Sonner toasts

## Getting started

```bash
bun install
cp .env.example .env.local
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

```bash
bun test
bun run lint
bun run build
```

GitHub Actions runs the same test, type-check/lint and production-build gates on feature branches and pull requests.

## Project structure

```text
src/
  app/
    api/owc/     # same-origin proxies to authoritative OWC services
    layout.tsx
    page.tsx
  components/
    app/         # phone shell, status bar, bottom nav, install banner
    brand/       # national emblem + Bird-of-Paradise seal
    screens/     # mobile service screens
    ui/          # shadcn/ui primitives
  lib/
    api/         # typed OWC API contracts and server-only client
    owc-data.ts  # controlled local public-content/reference data
    nav.tsx      # stage/screen/role navigation
    pwa.tsx      # PWA install + service-worker registration
public/
  manifest.json, sw.js, icons
```

The OWC portal remains responsible for Drupal-backed editorial content and for mediating CPPS and other agency integrations. The mobile application consumes those capabilities through OWC interfaces rather than duplicating them.

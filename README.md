# OWC PNG — Workers Compensation Mobile App

Official mobile services for the **Office of Workers Compensation (OWC)**, Ministry of Labour & Employment, Independent State of Papua New Guinea.

Built as an **installable Progressive Web App (PWA)** so it can be added to the home screen on Android and iOS, with an architecture that maps 1:1 to React Native screens for a future native port.

## Features

- **Splash + secure sign-in** — phone/email with one-time passcode (OTP), guest mode, and OWC staff sign-in
- **Home dashboard** — quick actions, claim snapshot, news ticker, install prompt
- **Lodge a claim** — guided multi-step form with document/photo upload and declaration
- **Track a claim** — reference lookup with a status timeline
- **Employer services** — registration, reporting and compliance guidance
- **Forms & downloads** — searchable forms library
- **News & public notices** — listing with article detail
- **Contact & enquiry** — enquiry form, office details, emergency line
- **Fraud reporting** — secure, anonymous-capable reporting
- **Notifications centre** and **user account / profile**
- **Staff quick review** — admin-lite claim queue

## Installable (PWA)

- Web app manifest with square + maskable icons (192/512)
- Service worker for installability and offline-ready caching
- In-app install banner — one-tap install on Android, Add-to-Home-Screen guidance on iOS

## Tech stack

- [Next.js 15](https://nextjs.org) (App Router, static export)
- TypeScript
- Tailwind CSS + [shadcn/ui](https://ui.shadcn.com)
- [Bun](https://bun.sh) package manager
- Lucide icons, Sonner toasts

## Getting started

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build (static export)

```bash
bun run build   # outputs to ./out
```

## Project structure

```
src/
  app/          # Next.js app router, layout, global styles
  components/
    app/        # phone shell, status bar, bottom nav, install banner
    brand/      # national emblem + Bird-of-Paradise seal
    screens/    # one file per app screen
    ui/         # shadcn/ui primitives (customised)
  lib/
    owc-data.ts # content + mock data (swap for the live OWC API)
    nav.tsx     # stage/screen/role navigation
    pwa.tsx     # PWA install + service-worker registration
public/
  manifest.json, sw.js, icons
```

> Data is mock content in `src/lib/owc-data.ts` — replace with the live OWC API when ready.

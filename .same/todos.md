# OWC Mobile App — Build Plan

PWA (Next.js + shadcn) styled as a native mobile app for the PNG Office of Workers Compensation.

## Foundation
- [x] Brand tokens (navy/gold/white) + fonts (serif headings, Public Sans body)
- [x] Phone-shell layout + status bar + bottom tab bar
- [x] Screen navigation context (stack push/pop + tabs + transitions)
- [x] OWC data lib (org, news, forms, faqs, enquiries, sample claims, notifications)
- [x] Emblem + Bird-of-Paradise seal components
- [x] PWA manifest + theme color

## Screens
- [x] Splash screen (animated seal)
- [x] Login / OTP verification
- [x] Home dashboard (quick actions, ticker, stats)
- [x] Lodge a Claim (guided multi-step form + uploads/photo + declaration)
- [x] Track a Claim (reference lookup + status timeline)
- [x] Employer Services
- [x] Forms & Downloads (search/filter library)
- [x] News & Public Notices (+ article detail)
- [x] Contact & Enquiry (form + office + emergency)
- [x] Fraud Reporting (anonymous toggle, secure)
- [x] Notifications centre
- [x] User Account / profile
- [x] Staff quick review (admin lite)

## Polish
- [x] Lint clean
- [x] Version + screenshot review (home, lodge, track, account, staff, contact)
- [x] Restore production splash → login → app flow
- [x] Installable PWA (manifest + service worker + Android/iOS install banner + icons)
- [x] Deploy → https://same-n3jqlm8px04-latest.netlify.app (PWA files verified live)

## Notes
- Built as a mobile-first PWA (Same runs web apps; RN/Expo can't preview here).
- Screen architecture maps 1:1 to React Native screens for a later native port.
- Mock data via `src/lib/owc-data.ts` — swap for the live OWC API when ready.

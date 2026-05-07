# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- In progress

## Current Goal

- Continue to the next scoped feature unit after the completed authentication foundation.

## Completed

- Standardized project branding as TuneMove across package metadata, app metadata/UI text, and context documentation.
- Simplified `app/globals.css` to only the Tailwind import directive.
- Replaced `app/page.tsx` with a minimal centered "Tune Move" component.
- Removed default SVG assets from `public/`.
- Verified `app/page.module.css` is already absent.
- Completed feature `01-design-system` from `context/feature-specs/01-design-system.md`.
- Initialized `shadcn/ui` (`components.json`) for the existing Next.js + Tailwind v4 setup.
- Added shared `cn()` utility at `lib/utils.ts`.
- Added required UI primitives in `components/ui/*`:
  Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea, Badge, DropdownMenu, Separator, Skeleton.
- Added required dependencies for the design system baseline, including `lucide-react`.
- Replaced generated default theme values in `app/globals.css` with the project dark token system and mapped token utilities via `@theme inline`.
- Updated root metadata and enabled dark mode at the root layout level.
- Verified production build success with `npm run build`.
- Completed feature `02-authentication` from `context/feature-specs/02-authentication.md`.
- Installed `@clerk/ui` and configured `ClerkProvider` at the root with Clerk dark theme plus CSS-variable appearance overrides.
- Added root `proxy.ts` route protection with Clerk middleware, using `NEXT_PUBLIC_CLERK_SIGN_IN_URL` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL` for public auth route matching.
- Added minimal auth UI routes with Clerk components at:
  `/sign-in/[[...sign-in]]` and `/sign-up/[[...sign-up]]`, with a shared two-panel desktop / form-only mobile layout.
- Updated `/` to redirect authenticated users to `/dashboard` and unauthenticated users to `/sign-in`.
- Added `/dashboard` shell with a navbar and Clerk `UserButton` in the right section.
- Added Clerk sign-in/sign-up URL and fallback redirect env vars to `env.local`.
- Re-verified production build success with `npm run build`.

## In Progress

- None currently.

## Next Up

- Start the next feature spec on top of the completed auth + design system baseline.

## Open Questions

- None currently.

## Architecture Decisions

- Adopt `shadcn/ui` as the UI primitive baseline and keep generated files under `components/ui/*` unmodified unless explicitly re-generated.
- Use `proxy.ts` (Next.js 16 convention) with Clerk middleware as the default route protection boundary, while keeping auth UI routes public by env-driven matcher patterns.

## Session Notes

- Design system baseline is implemented and verified; future feature work should consume the tokenized utilities and generated primitives.
- Project naming is now standardized on TuneMove/tunemove.
- Authentication foundation is now wired end to end (provider, proxy protection, auth pages, root redirect, dashboard user menu) and passes production build.

# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- In progress

## Current Goal

- Continue to the next scoped feature unit after completing the dashboard layout shell.

## Completed

- Replaced the default Next.js README with a comprehensive TuneMove project README covering product overview, stack, workflow, architecture notes, setup steps, roadmap, and security guidance.
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
- Completed feature `03-dashboard-layout` from `context/feature-specs/03-dashboard-layout.md`.
- Added reusable dashboard chrome components:
  `components/dashboard/dashboard-navbar.tsx`,
  `components/dashboard/dashboard-sidebar.tsx`,
  `components/dashboard/dashboard-shell.tsx`,
  `components/dashboard/page-container.tsx`.
- Refactored `app/dashboard/layout.tsx` to enforce `auth.protect()` at the layout boundary and render the shared `DashboardShell`.
- Updated `app/dashboard/page.tsx` to use the shared `PageContainer`.
- Added base dashboard routes and starter pages for:
  `/dashboard/transfer`,
  `/dashboard/playlists`,
  `/dashboard/history`,
  `/dashboard/connections`,
  `/dashboard/settings`.

## In Progress

- None currently.

## Next Up

- Start the next feature spec on top of the completed auth + dashboard shell baseline.

## Open Questions

- None currently.

## Architecture Decisions

- Adopt `shadcn/ui` as the UI primitive baseline and keep generated files under `components/ui/*` unmodified unless explicitly re-generated.
- Use `proxy.ts` (Next.js 16 convention) with Clerk middleware as the default route protection boundary, while keeping auth UI routes public by env-driven matcher patterns.
- Keep dashboard chrome state in a single client shell (`DashboardShell`) and derive active nav/page-title UI from the current pathname.

## Session Notes

- Repository onboarding docs are now project-specific via the updated `README.md`.
- Design system baseline is implemented and verified; future feature work should consume the tokenized utilities and generated primitives.
- Project naming is now standardized on TuneMove/tunemove.
- Authentication foundation is now wired end to end (provider, proxy protection, auth pages, root redirect, dashboard user menu) and passes production build.
- Dashboard layout foundation is now implemented with responsive sidebar behavior, route-aware navigation highlighting, and reusable page containers for all base dashboard routes.
- Fixed dashboard sidebar toggle behavior so close/open controls now work correctly across both desktop and mobile viewports by separating desktop and mobile sidebar state handling.
- Added sidebar icon motion polish: animated nav icons on hover/active, rotating mobile close icon, and animated `New Transfer` icon interactions with reduced-motion safeguards.

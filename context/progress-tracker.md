# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- In progress

## Current Goal

- Continue to the next scoped feature unit after completing Spotify integration.

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
- Completed feature `04-dashboard-home-ui` from `context/feature-specs/04-dashboard-home-ui.md`.
- Implemented polished dashboard home modules:
  `components/dashboard/platform-status-card.tsx`,
  `components/dashboard/quick-transfer-card.tsx`,
  `components/dashboard/empty-activity-card.tsx`.
- Replaced `app/dashboard/page.tsx` placeholder content with the four required sections:
  welcome header, connected platforms, quick transfer panel, and recent activity empty state.
- Extended `components/dashboard/page-container.tsx` with optional width and content-spacing overrides and used `max-w-7xl` for the dashboard home layout.
- Verified production build success with `npm run build`.
- Refined dashboard quick transfer platform selection UX in `components/dashboard/quick-transfer-card.tsx` by disabling the selected source platform in destination options and clearing destination when source changes to the same platform.
- Re-verified production build success with `npm run build`.
- Completed feature `05-dashboard-ui-polish` from `context/feature-specs/05-dashboard-ui-polish.md`.
- Enhanced dashboard navbar hierarchy and presence with route-aware subtitles, subtle blur, improved control polish, and stronger visual separation.
- Refined sidebar depth and navigation polish with elevated surface treatment, improved active/hover states, smoother transitions, and upgraded CTA button interactions.
- Polished dashboard home cards (platform status, quick transfer, recent activity) with subtle hover lift, stronger elevation, softer borders, cleaner spacing, and calm microinteractions.
- Added restrained Spotify/Apple visual emphasis to connected platform cards while preserving the dark minimal aesthetic.
- Increased quick transfer panel prominence through hierarchy/spacing updates and refined control alignment without adding transfer business logic.
- Improved recent activity empty state density and icon container, plus a subtle CTA to start a transfer.
- Verified no raw Tailwind neutral palettes or hardcoded colors were introduced in the dashboard polish changes.
- Verified production build success with `npm run build`.
- Completed feature `06-spotify-integration` from `context/feature-specs/06-spotify-integration.md`.
- Added Spotify API client utilities and normalized Spotify types:
  `lib/spotify.ts`, `types/spotify.ts`.
- Added temporary server-only Spotify connection metadata storage:
  `lib/spotify-connection-store.ts`.
- Added Spotify API routes:
  `app/api/spotify/connect/route.ts`,
  `app/api/spotify/callback/route.ts`,
  `app/api/spotify/profile/route.ts`,
  `app/api/spotify/playlists/route.ts`.
- Updated `/dashboard/connections` with a Spotify connection card and connect/reconnect action linking to `/api/spotify/connect`.
- Updated `/dashboard/playlists` with Spotify playlist loading, error/not-connected, empty, and playlist-card list states via `app/dashboard/playlists/loading.tsx` and `components/dashboard/spotify-playlists-panel.tsx`.
- Updated architecture context to document temporary in-memory Spotify OAuth connection storage prior to database-backed persistence.
- Verified production build success with `npm run build`.
- Refined local Spotify OAuth routing behavior by adding `allowedDevOrigins` in `next.config.ts` and replacing internal `Link` navigation to `/api/spotify/connect` with direct anchor navigation to avoid RSC payload fallback warnings.
- Reverted forced host redirection in `proxy.ts` after it caused page load instability during local development.
- Fixed repeated Spotify connect failures across mixed local hosts by moving OAuth `state` handling to a server-side one-time store (`lib/spotify-oauth-state-store.ts`) keyed by state token, then consuming that state in callback to recover the initiating user and return origin without relying on callback-host cookies/session.
- Updated Spotify connect/callback routes to use one-time state consumption and redirect back to the origin that initiated the OAuth flow.
- Re-verified lint/build success with `npm run lint` and `npm run build`.
- Marked `/api/spotify/callback` as a public route in `proxy.ts` so Clerk middleware does not block Spotify callbacks before route-handler state validation runs.
- Added callback failure reason propagation (`reason` query param) and surfaced connection outcome messaging on `/dashboard/connections` for faster OAuth troubleshooting.
- Re-verified lint/build success with `npm run lint` and `npm run build`.
- Replaced in-memory pending OAuth state storage with signed stateless OAuth state payloads in `lib/spotify-oauth-state.ts` and updated connect/callback routes to create/verify HMAC-signed state with expiry.
- Removed `lib/spotify-oauth-state-store.ts` to eliminate cross-request memory coupling that could invalidate callback state under local dev runtime behavior.
- Expanded failed-connection UI messaging to include unmapped callback reasons directly (`spotify=failed&reason=...`) for immediate diagnostics.
- Added callback failure status tagging for Spotify API errors (e.g. `spotify_profile_fetch_failed_401` / `_403`) and surfaced targeted guidance in Connections UI for faster root-cause isolation.
- Re-verified lint/build success with `npm run lint` and `npm run build`.
- Re-verified lint/build success with `npm run lint` and `npm run build`.
- Added Spotify disconnect capability with a protected `POST /api/spotify/disconnect` route that clears the current user’s stored Spotify connection and redirects back to `/dashboard/connections?spotify=disconnected`.
- Updated `/dashboard/connections` to show a `Disconnect Spotify` button only when connected and to surface a success banner after disconnection.
- Re-verified lint/build success with `npm run lint` and `npm run build`.
- Fixed playlists-not-loading reliability issue by replacing volatile in-memory Spotify connection storage with encrypted HTTP-only cookie persistence in `lib/spotify-connection-store.ts`.
- Updated Spotify connection read/write call sites (callback, profile, playlists, disconnect routes and connections/playlists dashboard components) to the new async persistent store API.
- Updated architecture documentation to reflect encrypted cookie-based temporary Spotify connection persistence.
- Re-verified lint/build success with `npm run lint` and `npm run build`.
- Hardened Spotify callback connect behavior so token exchange success can still establish a connection even if profile fetch returns 401/403, by persisting a minimal fallback profile and allowing post-connect playlist fetch to proceed independently.
- Added `show_dialog=true` to Spotify authorize URL and improved playlist panel handling for 403 insufficient-scope errors with explicit reconnect guidance.
- Re-verified lint/build success with `npm run lint` and `npm run build`.
- Fixed local host drift during Spotify OAuth by canonicalizing callback return origin from `SPOTIFY_REDIRECT_URI` in connect/callback routes instead of relying on request origin, preventing post-callback redirects to `localhost` when local setup uses `127.0.0.1`.
- Added Clerk force-redirect env values in `.env.local` targeting `http://127.0.0.1:3000/dashboard` to keep sign-in completion on the same local host as Spotify callback flow.
- Re-verified lint/build success with `npm run lint` and `npm run build`.
- Improved Spotify playlists load reliability by adding transient-error retry handling (`429` and `5xx`) with backoff in `lib/spotify.ts`.
- Expanded playlist error mapping in `app/api/spotify/playlists/route.ts` to return explicit `SPOTIFY_RATE_LIMITED`, `SPOTIFY_INSUFFICIENT_SCOPE`, and `SPOTIFY_UPSTREAM_UNAVAILABLE` responses where applicable.
- Updated `components/dashboard/spotify-playlists-panel.tsx` to show dedicated playlist states for rate limiting and temporary Spotify unavailability, and removed debug logging from server render.
- Re-verified lint/build success with `npm run lint` and `npm run build`.
- Fixed dashboard home Spotify action wiring by adding optional `actionHref` support to `PlatformStatusCard` and linking the Spotify card CTA to `/api/spotify/connect`.
- Removed leftover server-side debug logging from `components/dashboard/spotify-playlists-panel.tsx`.
- Re-verified lint/build success with `npm run lint` and `npm run build`.
- Updated dashboard home Spotify card status to reflect live connection state from `getSpotifyConnection(userId)`, switching status/action label between connected/disconnected states.
- Re-verified lint/build success with `npm run lint` and `npm run build`.
- Refactored `components/dashboard/spotify-playlists-panel.tsx` to client-driven loading via `/api/spotify/playlists` so playlist UI now uses the same backend auth/token-refresh/error mapping path as the API route.
- Added explicit client-side handling for not-connected, insufficient-scope, rate-limited, temporary-unavailable, and retry flows based on API response status/error codes.
- Re-verified lint/build success with `npm run lint` and `npm run build`.
- Implemented timeout- and network-aware Spotify fetch handling in `lib/spotify.ts` using request abort timeouts and typed Spotify error codes for `_TIMEOUT`, `_NETWORK`, and invalid playlist payload parsing failures.
- Expanded `/api/spotify/playlists` error classification and diagnostics with explicit responses for `SPOTIFY_REQUEST_TIMEOUT`, `SPOTIFY_NETWORK_ERROR`, and `SPOTIFY_RESPONSE_INVALID`, plus structured server logging for failure categories.
- Fixed client playlist fetch body-consumption bug in `components/dashboard/spotify-playlists-panel.tsx` (duplicate `response.json()` call) and mapped new API error codes to dedicated UI states/messages.
- Re-verified lint/build success with `npm run lint` and `npm run build`.
- Fixed Spotify playlist normalization crash when upstream playlist items omit nested fields (e.g., missing `tracks.total`) by hardening `normalizeSpotifyPlaylist` and filtering invalid items instead of throwing.
- Re-verified lint/build success with `npm run lint` and `npm run build`.
- Added server-side fallback track-count resolution for zero-count playlists by querying Spotify playlist details (`fields=tracks.total`) and patching counts when list payloads omit `tracks.total`.
- Re-verified lint/build success with `npm run lint` and `npm run build`.
- Updated Spotify playlist response typing/normalization to support both `tracks.total` and `items.total` from upstream list payload variants, reducing false `0 tracks` displays.
- Re-verified lint/build success with `npm run lint` and `npm run build`.

## In Progress

- None currently.

## Next Up

- Start the next feature spec on top of the completed auth + dashboard shell + dashboard home + dashboard polish + Spotify integration baseline.

## Open Questions

- None currently.

## Architecture Decisions

- Adopt `shadcn/ui` as the UI primitive baseline and keep generated files under `components/ui/*` unmodified unless explicitly re-generated.
- Use `proxy.ts` (Next.js 16 convention) with Clerk middleware as the default route protection boundary, while keeping auth UI routes public by env-driven matcher patterns.
- Keep dashboard chrome state in a single client shell (`DashboardShell`) and derive active nav/page-title UI from the current pathname.
- Keep page-level layout sizing and spacing adaptable through `PageContainer` props rather than duplicating wrapper layout logic per dashboard route.
- Use an encrypted HTTP-only cookie store for temporary Spotify OAuth metadata until database-backed connected account persistence is implemented.
- Use signed stateless OAuth state tokens (HMAC + expiry) for Spotify callback correlation, avoiding request-handler memory persistence assumptions.

## Session Notes

- Repository onboarding docs are now project-specific via the updated `README.md`.
- Design system baseline is implemented and verified; future feature work should consume the tokenized utilities and generated primitives.
- Project naming is now standardized on TuneMove/tunemove.
- Authentication foundation is now wired end to end (provider, proxy protection, auth pages, root redirect, dashboard user menu) and passes production build.
- Dashboard layout foundation is now implemented with responsive sidebar behavior, route-aware navigation highlighting, and reusable page containers for all base dashboard routes.
- Fixed dashboard sidebar toggle behavior so close/open controls now work correctly across both desktop and mobile viewports by separating desktop and mobile sidebar state handling.
- Added sidebar icon motion polish: animated nav icons on hover/active, rotating mobile close icon, and animated `New Transfer` icon interactions with reduced-motion safeguards.
- Dashboard home UI is now implemented with a compact welcome header, platform connection placeholders, quick transfer placeholders, and a recent activity empty state using tokenized styling only.
- Quick transfer platform dropdowns now enforce source/destination uniqueness at the UI layer for the placeholder transfer setup panel.
- Dashboard UI polish pass is complete: navbar subtitle hierarchy, refined sidebar depth/interaction, upgraded card elevation/hover microinteractions, music-accented platform card polish, stronger quick-transfer visual priority, and tighter recent-activity empty state; build remains green.
- Spotify integration feature is complete for the current scope: OAuth connect/callback flow, server-side token exchange and profile fetch, authenticated Spotify profile/playlists routes, Spotify connection UI, and Spotify playlists UI with loading/error/empty/list states; build remains green.
- Local development no longer force-redirects hosts at middleware level; host consistency for Spotify OAuth is handled operationally by using the same origin throughout a session.
- Spotify callback no longer depends on callback-host Clerk cookies for user resolution; it now resolves the initiating user through consumed server-side OAuth state and returns to the initiating dashboard origin.
- Spotify callback route is explicitly middleware-public and self-validates OAuth state, reducing false failures caused by auth middleware interception on callback requests.
- Spotify callback validation no longer depends on shared in-memory pending state; signed state verification now survives request/runtime boundaries in local development.
- Users can now explicitly remove their stored Spotify connection from the Connections page without reconnecting or restarting the app session.
- Spotify connection metadata now persists across reloads/dev restarts through encrypted HTTP-only cookies instead of process memory, resolving playlist visibility regressions after reconnect.
- Spotify connection establishment no longer hard-fails solely on profile fetch errors; callback now treats profile retrieval as best-effort and continues with token-backed connection state.
- Spotify playlist loading now retries transient Spotify API failures (rate limit and server errors) before surfacing UI errors, reducing false-negative empty/error states for connected accounts.
- Dashboard home "Connect Spotify" now performs actual navigation to the Spotify OAuth connect route instead of rendering a non-functional placeholder button.
- Dashboard home Spotify card now shows dynamic connected/not-connected status and CTA text based on the authenticated user’s stored Spotify connection.
- Playlists UI now resolves Spotify data through the authenticated playlist API route instead of direct server-component Spotify calls, reducing connection-state drift between connection success and playlist fetch outcomes.
- Spotify playlist loading now distinguishes timeout/network/upstream-payload failures from generic errors, improving root-cause visibility for persistent `502` responses.
- Spotify playlist loading no longer fails hard on partial upstream playlist objects; malformed entries are skipped and valid playlists continue to render.
- Playlist cards now recover accurate track counts via a detail-endpoint fallback when Spotify list responses omit track totals.
- Playlist track counts now read from either `tracks.total` or `items.total` in list responses, matching current Spotify payload variations.

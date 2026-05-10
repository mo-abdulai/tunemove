# 06 - Spotify Integration

Read `AGENTS.md` before starting.

We are implementing Spotify account connection and playlist fetching for TuneMove.

This feature is Spotify-only.

Do not implement Apple Music, playlist transfer logic, track matching, or database-heavy transfer workflows yet.

## Goal

Allow an authenticated TuneMove user to connect Spotify and view their Spotify playlists inside the dashboard.

This feature should add:

- Spotify OAuth start route
- Spotify OAuth callback route
- Spotify token exchange
- Spotify profile fetch
- Spotify playlist fetch
- Spotify connection state UI
- Spotify playlists UI

## Spotify API Scope

Use Spotify Authorization Code Flow.

Required Spotify scopes:

```txt
user-read-private
user-read-email
playlist-read-private
playlist-read-collaborative
```

Spotify uses scopes to control what user data an app can access, and the current user profile endpoint requires `user-read-private` and `user-read-email`. The current user playlists endpoint requires playlist read scopes for private/collaborative playlists.  
Sources: Spotify Web API docs for Authorization Code Flow, Current User Profile, and Current User Playlists.

## Environment Variables

Use existing env patterns if already present.

Required variables:

```txt
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REDIRECT_URI=
```

Do not expose `SPOTIFY_CLIENT_SECRET` to the client.

Do not prefix Spotify secrets with `NEXT_PUBLIC_`.

## Routes

Create these route handlers:

```txt
app/api/spotify/connect/route.ts
app/api/spotify/callback/route.ts
app/api/spotify/profile/route.ts
app/api/spotify/playlists/route.ts
```

## Spotify Connect Route

Create:

```txt
app/api/spotify/connect/route.ts
```

Responsibilities:

- require Clerk auth
- generate Spotify authorization URL
- include required scopes
- include redirect URI
- include CSRF `state`
- redirect user to Spotify authorization page

Do not do token exchange here.

## Spotify Callback Route

Create:

```txt
app/api/spotify/callback/route.ts
```

Responsibilities:

- validate returned `state`
- exchange authorization code for access token
- fetch current Spotify user profile
- persist or temporarily store connection metadata based on current project storage setup
- redirect user back to `/dashboard/connections`

If database persistence is not implemented yet, keep storage minimal and clearly documented.

Do not implement transfer logic.

## Spotify Profile Route

Create:

```txt
app/api/spotify/profile/route.ts
```

Responsibilities:

- require Clerk auth
- use stored Spotify access token
- fetch current Spotify profile from Spotify
- return normalized profile data

Return shape:

```ts
{
  success: true,
  data: {
    id: string;
    displayName: string | null;
    email: string | null;
    imageUrl: string | null;
  }
}
```

## Spotify Playlists Route

Create:

```txt
app/api/spotify/playlists/route.ts
```

Responsibilities:

- require Clerk auth
- use stored Spotify access token
- fetch current user playlists
- normalize playlist data
- support pagination if simple to add
- return predictable response shape

Return shape:

```ts
{
  success: true,
  data: {
    playlists: Array<{
      id: string;
      name: string;
      description: string | null;
      imageUrl: string | null;
      trackCount: number;
      ownerName: string | null;
      externalUrl: string | null;
    }>;
  }
}
```

## Spotify Client

Create:

```txt
lib/spotify.ts
```

Responsibilities:

- build Spotify authorization URL
- exchange authorization code for tokens
- refresh access token if refresh token exists
- fetch current user profile
- fetch current user playlists
- normalize Spotify responses

Keep this file focused on Spotify API communication only.

## Types

Create if useful:

```txt
types/spotify.ts
```

Include normalized app-level types.

Avoid leaking raw Spotify API response shapes across the app.

## UI Updates

Update:

```txt
app/dashboard/connections/page.tsx
```

Add a Spotify connection card.

Requirements:

- show Spotify card
- show placeholder connection state
- connect button links to `/api/spotify/connect`
- use Spotify accent subtly
- no hardcoded colors
- no raw Tailwind color classes
- no Apple Music logic in this feature

Update:

```txt
app/dashboard/playlists/page.tsx
```

Add Spotify playlist UI.

Requirements:

- show loading state
- show empty state
- show playlist cards when data exists
- show playlist name, artwork placeholder/image, and track count
- do not implement transfer actions yet

## Styling Rules

Use semantic Tailwind utilities from `globals.css`.

Allowed examples:

```txt
bg-base
bg-surface
bg-elevated
text-copy-primary
text-copy-secondary
text-copy-muted
text-brand
border-surface-border
```

Do not use:

```txt
zinc-*
slate-*
gray-*
neutral-*
```

Do not hardcode colors.

For Spotify-specific accents, use the project token if available:

```txt
text-spotify
bg-spotify
border-spotify
```

If these utilities do not exist, add token mappings instead of hardcoding Spotify green.

## Security Rules

- never expose Spotify client secret to the browser
- all Spotify API requests with secrets happen server-side
- require Clerk auth for all Spotify routes
- validate OAuth `state`
- do not trust client-provided user IDs
- do not log access tokens or refresh tokens
- do not commit real env values

## Out of Scope

Do not implement:

- Apple Music integration
- playlist transfer logic
- track matching
- creating playlists
- adding tracks to playlists
- transfer history
- analytics
- billing
- advanced retry queues
- background jobs

## Check When Done

- Spotify connect route exists
- Spotify callback route exists
- Spotify profile route exists
- Spotify playlists route exists
- Spotify client utility exists
- Spotify connection card appears on Connections page
- Spotify playlist UI appears on Playlists page
- unauthenticated users cannot call Spotify routes
- Spotify secret stays server-only
- no Apple Music logic added
- no playlist transfer logic added
- no database-heavy workflow added unless already required by existing app structure
- no hardcoded colors added
- no raw Tailwind color classes added
- `npm run build` passes
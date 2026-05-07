# TuneMove

TuneMove is a modern playlist transfer application that helps users move playlists between music streaming platforms such as Spotify and Apple Music.

The app is built with Next.js, Clerk authentication, Tailwind CSS, shadcn/ui, and a scalable feature-spec workflow designed for AI-assisted development.

---

## Overview

TuneMove solves a simple problem: users should not have to manually rebuild their playlists when switching music platforms.

The application allows users to:

- Sign in securely
- Connect music platforms
- Select a source platform
- Select a destination platform
- Fetch playlists
- Match tracks across services
- Review matched and unmatched songs
- Transfer playlists
- View transfer history

The initial MVP focuses on:

```txt
Spotify -> Apple Music
```

Future versions may support additional platforms such as YouTube Music, Tidal, Deezer, and Amazon Music.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js App Router |
| Language | TypeScript |
| Authentication | Clerk |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Icons | lucide-react |
| Animations | Framer Motion |
| Database | PostgreSQL |
| ORM | Prisma |
| Validation | Zod |
| Deployment | Vercel |
| External APIs | Spotify Web API, Apple Music API |

## Core Features

### Authentication

- Clerk-powered sign-in and sign-up
- Protected dashboard routes
- Auth-aware redirects
- User profile menu using Clerk UserButton

### Music Platform Connections

- Connect Spotify account
- Connect Apple Music account
- Store platform connection metadata securely
- Support future platform integrations

### Playlist Fetching

- Fetch user playlists from the source platform
- Display playlist name, artwork, and track count
- Allow users to select a playlist for transfer

### Playlist Transfer

- Fetch source playlist tracks
- Search destination platform catalog
- Match tracks using title, artist, album, and duration
- Create destination playlist
- Add matched tracks to the new playlist

### Transfer Review

- Show matched tracks
- Show unmatched tracks
- Display confidence levels
- Allow user review before final transfer

### Transfer History

- Store transfer results
- Show completed, failed, and pending transfers
- Track matched and unmatched counts

## Project Structure

```txt
.
├── app/
│   ├── sign-in/
│   ├── sign-up/
│   ├── dashboard/
│   ├── api/
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── dashboard/
│   ├── platforms/
│   └── transfers/
│
├── context/
│   ├── architecture.md
│   ├── code-standards.md
│   ├── progress-tracker.md
│   ├── project-overview.md
│   ├── ui-context.md
│   └── feature-specs/
│       ├── 01-design-system.md
│       ├── 02-authentication.md
│       ├── 03-dashboard-layout.md
│       ├── 04-spotify-integration.md
│       ├── 05-apple-music-integration.md
│       ├── 06-playlist-transfer-engine.md
│       ├── 07-transfer-review-system.md
│       └── 08-transfer-history.md
│
├── lib/
│   ├── utils.ts
│   ├── auth.ts
│   ├── spotify.ts
│   └── apple-music.ts
│
├── server/
│   ├── services/
│   ├── transfer/
│   └── matching/
│
├── prisma/
│   └── schema.prisma
│
├── public/
├── styles/
├── proxy.ts
├── package.json
└── README.md
```

## Context-Driven Development

TuneMove uses a context-first development workflow.

The `context/` folder contains product, architecture, UI, and implementation guidance for both human developers and AI coding agents.

### Global Context Files

| File | Purpose |
| --- | --- |
| `project-overview.md` | Defines the product vision, goals, scope, and user flow |
| `architecture.md` | Defines the stack, system boundaries, storage model, and invariants |
| `ui-context.md` | Defines the visual language, design tokens, layout rules, and component conventions |
| `code-standards.md` | Defines TypeScript, Next.js, styling, API, and testing standards |
| `progress-tracker.md` | Tracks current phase, completed work, open questions, and next steps |

### Feature Specs

Feature specs live in:

`context/feature-specs/`

Each feature should be implemented from a dedicated spec file.

Examples:

- `01-design-system.md`
- `02-authentication.md`
- `03-dashboard-layout.md`
- `04-spotify-integration.md`

This keeps development:

- Focused
- Incremental
- Easier to test
- Easier for AI agents to follow
- Less likely to introduce unrelated changes

## Design System

TuneMove uses a dark-only premium interface.

The UI should feel:

- Minimal
- Professional
- Smooth
- Music-focused
- Modern
- Responsive

### Styling Rules

- Use CSS custom property tokens defined in `globals.css`
- Do not use raw Tailwind color classes like `zinc-*`, `slate-*`, `gray-*`, or `neutral-*`
- Do not hardcode hex colors inside React components
- Reference tokens through semantic Tailwind utilities

Example:

```tsx
<div className="bg-base text-copy-primary border border-surface-border" />
```

### Radius Scale

| Context | Class |
| --- | --- |
| Small elements, buttons, inputs | `rounded-xl` |
| Cards and panels | `rounded-2xl` |
| Modals and overlays | `rounded-3xl` |
| Pills and badges | `rounded-full` |

## Authentication

TuneMove uses Clerk for authentication.

Auth behavior:

- `/sign-in` is public
- `/sign-up` is public
- All app routes are protected by default
- Signed-out users are redirected to `/sign-in`
- Signed-in users are redirected to `/dashboard`
- Clerk `UserButton` is used for profile and logout actions

The project uses `proxy.ts` for Clerk route protection.

## Environment Variables

Create a `.env.local` file in the project root.

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

# Database
DATABASE_URL=

# Spotify
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REDIRECT_URI=

# Apple Music
APPLE_MUSIC_TEAM_ID=
APPLE_MUSIC_KEY_ID=
APPLE_MUSIC_PRIVATE_KEY=
APPLE_MUSIC_DEVELOPER_TOKEN=
```

Do not commit real secrets.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/tunemove.git
cd tunemove
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create `.env.local`, then add the required values listed above.

### 4. Run the development server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

`npm run dev`  
Start the development server.

`npm run build`  
Create a production build.

`npm run start`  
Start the production server.

`npm run lint`  
Run lint checks.

`npm run typecheck`  
Run TypeScript checks if configured.

## Planned Database Models

The initial data model may include:

```prisma
model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  email     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  accounts  ConnectedAccount[]
  transfers Transfer[]
}

model ConnectedAccount {
  id           String   @id @default(cuid())
  userId       String
  platform     String
  accessToken  String
  refreshToken String?
  expiresAt    DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user User @relation(fields: [userId], references: [id])
}

model Transfer {
  id              String   @id @default(cuid())
  userId          String
  sourcePlatform  String
  targetPlatform  String
  playlistName    String
  totalTracks     Int
  matchedTracks   Int
  failedTracks    Int
  status          String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user User @relation(fields: [userId], references: [id])
}
```

This schema may evolve as the transfer engine becomes more detailed.

## Playlist Transfer Flow

The transfer engine follows this process:

1. User selects source platform
2. User selects destination platform
3. App fetches source playlists
4. User selects a playlist
5. App fetches playlist tracks
6. App normalizes track metadata
7. App searches destination platform
8. App computes match confidence
9. User reviews matches
10. App creates destination playlist
11. App adds matched tracks
12. App saves transfer results

## Track Matching Strategy

Track matching should compare:

- Track title
- Primary artist
- Album name
- Duration
- ISRC if available

Suggested scoring:

| Field | Weight |
| --- | --- |
| Title match | 40 |
| Artist match | 35 |
| Duration similarity | 15 |
| Album match | 10 |

A match confidence score should determine whether a track is:

- Matched
- Needs Review
- Unmatched

## API Route Strategy

API routes should be focused and single-purpose.

Possible route structure:

```txt
app/api/spotify/connect/route.ts
app/api/spotify/callback/route.ts
app/api/spotify/playlists/route.ts
app/api/spotify/playlists/[id]/tracks/route.ts

app/api/apple-music/search/route.ts
app/api/apple-music/playlists/route.ts

app/api/transfers/route.ts
app/api/transfers/[id]/route.ts
```

All protected API routes must:

- Require authentication
- Validate input
- Enforce ownership
- Return consistent response shapes

Example response shape:

```ts
{
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
```

## Code Standards

### General

- Keep modules small and single-purpose
- Fix root causes, not symptoms
- Avoid mixing unrelated concerns
- Keep business logic outside UI components
- Prefer readable code over clever abstractions

### TypeScript

- Use strict TypeScript
- Avoid `any`
- Validate external input with Zod
- Define shared types in `types/`
- Narrow unknown API responses before use

### Next.js

- Default to Server Components
- Use Client Components only when interactivity requires it
- Keep route handlers focused
- Do not place business logic directly inside pages

### Styling

- Use semantic Tailwind utilities
- Use CSS variables from `globals.css`
- Do not hardcode colors
- Do not manually modify generated `components/ui/*` files after installation

## AI Agent Workflow

Before asking an AI coding agent to implement a feature:

- Read `AGENTS.md`
- Read the relevant global context files
- Read the active feature spec
- Implement only that feature
- Avoid unrelated changes
- Update `progress-tracker.md`
- Run build checks

Example prompt:

```txt
Read AGENTS.md before starting.

Implement context/feature-specs/02-authentication.md.

Stay within the scope of this feature only.

Do not implement Spotify, Apple Music, database models, or transfer logic.

Update context/progress-tracker.md when done.

Run npm run build.
```

## Roadmap

### Phase 1 - Foundation

- Project setup
- Design system
- shadcn/ui setup
- Clerk authentication
- Dashboard shell

### Phase 2 - Platform Connections

- Spotify OAuth
- Spotify playlist fetching
- Apple Music auth
- Apple Music catalog search

### Phase 3 - Transfer Engine

- Track normalization
- Match scoring
- Transfer preview
- Playlist creation
- Track insertion

### Phase 4 - History and Polish

- Transfer history
- Retry failed transfers
- Better loading states
- Responsive polish
- Error reporting

### Phase 5 - Future Enhancements

- YouTube Music support
- Tidal support
- Deezer support
- Recurring sync
- AI-assisted matching
- Public playlist sharing
- Transfer analytics

## Security Notes

- Never expose OAuth secrets to the client
- Store sensitive tokens securely
- Enforce ownership on every private resource
- Validate all external API responses
- Do not trust client-provided user IDs
- Use Clerk auth helpers on server routes
- Do not commit `.env.local`

## Contribution Notes

This project is currently under active development.

When contributing:

- Follow the context files
- Work from feature specs
- Keep changes scoped
- Update progress tracking
- Run build checks before submitting changes

## License

MIT License

## Status

Current status:

Planning and early implementation

Initial focus:

Design system -> Authentication -> Dashboard -> Spotify integration

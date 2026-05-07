# Architecture Context

## Stack

| Layer     | Technology                           | Role                                          |
| --------- | -------------------------------------| --------------------------------------------- |
| Framework | Next.js 16 + TypeScript              | Full-stack app with server/client boundaries  |
| UI        | Tailwind + shadcn/ui + Framer Motion | Design system and animations                  |
| Auth      | Clerk.                               | User identity and route protection            |
| Database  | PostgreSQL + Prisma ORM              | Persistent storage and relational data        |
| Validation | Zod                                  |  Runtime validation and schema safety        |
| API Integration | Spotify Web API | Playlist fetching and metadata                               |
| API Integration | Apple Music API + MusicKit | Playlist creation and track search                |
| State Management | React Query / TanStack Query | Server state caching and synchronization       |
| Hosting | Vercel | Frontend and API deployment                                                   |
| Background Jobs | Trigger.dev or Inngest | Async playlist processing                             |
| Analytics | PostHog | Product analytics and events |
| Icons | Lucide React | Icon system |

## System Boundaries

- `app/api` — Authenticated request handlers: input validation, ownership checks, task triggering, and persistence.
- `components/` — Shared reusable UI components and dashboard modules
- `lib/` — API clients, utilities, auth helpers, validation, platform integrations
- `server/` — Business logic, transfer engine, matching logic, database services
- `prisma/` — Prisma schema and database migrations
- `types/` — Shared TypeScript types and interfaces
- `hooks/` — React hooks and query hooks
- `styles/` — Global styles, theme tokens, animation styles
- `context/` — React providers and application context

## Storage Model

PostgreSQL Database

Stores:

- Users
- Connected music accounts
- OAuth metadata
- Playlist metadata
- Transfer history
- Track matching results
- Audit metadata
- Transfer status

Session Storage

Stores:

- Temporary UI state
- Active filters
- Dashboard preferences
- External APIs

Spotify and Apple Music remain the source of truth for:

- Playlist contents
- Music metadata
- User music libraries

The application does not permanently duplicate complete music libraries.

## Auth and Access Model

- Every user authenticates through Clerk.
- Every database record is tied to a Clerk user ID.
- Only authenticated users can access dashboard routes.
- Users can only access their own connected accounts and transfers.
- OAuth access tokens are encrypted before persistence.
- Sensitive API credentials never reach the client.
- Platform API requests requiring secrets execute only on the server.

## Transfer Engine Architecture

The transfer system follows a staged pipeline:

1. Fetch source playlist metadata
2. Fetch source playlist tracks
3. Normalize track information
4. Search destination platform catalog
5. Compute similarity scores
6. Select best matches
7. Generate transfer preview
8. Create destination playlist
9. Insert matched tracks
10. Save transfer results

Track normalization includes:

- Title cleanup
- Artist normalization
- Album normalization
- Duration comparison
- Duplicate reduction

## Invariants

1. Client components never directly access platform secrets.
2. OAuth tokens are never exposed publicly.
3. Long-running transfer work does not block request handlers.
4. Every database mutation validates ownership.
5. Route handlers remain single-purpose.
6. Transfer failures never corrupt transfer history.
7. UI components remain presentation-focused.
8. External API input is validated before usage.
9. All authenticated routes require Clerk middleware.
10. Database schema changes require Prisma migrations.

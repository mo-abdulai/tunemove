# Code Standards

## General

- Keep modules small and single-purpose.
- Prefer composition over deeply nested inheritance.
- Fix root causes instead of layering workarounds.
- Avoid hidden side effects.
- Keep UI components presentation-focused.
- Business logic belongs in services or server modules.
- Avoid duplicate platform integration logic.
- Every major feature should remain independently testable.

## TypeScript

- TypeScript strict mode is required.
- Avoid `any` whenever possible.
- Prefer explicit interfaces and discriminated unions.
- Validate all external API responses.
- Shared types belong in types/.
- Narrow unknown data before use.
- Route handlers must validate request payloads.
- Prefer readonly structures where appropriate.

## Next.js Standards

- Default to Server Components.
- Add `use client` only when interactivity requires it.
- Keep route handlers single-purpose.
- Do not place business logic inside page components.
- Async data fetching belongs on the server when possible.
- Streaming and Suspense may be used for dashboard loading.
- Avoid unnecessary client-side fetching.

## Styling

- Use CSS custom property tokens defined in `globals.css` — no raw Tailwind color classes like `zinc-*` or hardcoded hex values.
- Reference tokens through their Tailwind utility names: `bg-base`, `text-copy-primary`, `border-surface-border`,`text-brand`, etc.
- Maintain the border radius scale: `rounded-xl` for small elements, `rounded-2xl` for cards, `rounded-3xl` for modals.
- Follow spacing consistency across all layouts and components.
- Reusable UI belongs in shared components.
- Avoid inline styles unless unavoidable.

## API Routes

- Validate all request input with Zod.
- Authenticate before mutations.
- Enforce ownership before access.
- Never expose secrets to the client.
- Return consistent response shapes.
- Use structured error handling.
- Separate route parsing from business logic.

Standard API response shape:
```
{
  success: boolean,
  data?: T,
  error?: {
    code: string,
    message: string
  }
}
```

## Data and Storage

- Prisma is the only ORM.
- Database schema changes require migrations.
- Use relations instead of manual joins.
- Do not store unnecessary duplicated track data.
- Encrypt sensitive OAuth credentials.
- Store timestamps on all major entities.

## File Organization

- `app/api` — routes, layouts, pages, API route handlers for auth
- `components/` — reusable UI and feature components
- `server/` — services, transfer engine, business logic
- `lib/` — helpers, utilities, API clients
- `hooks/` — React hooks and query hooks
- `types/` — shared TypeScript types
- `styles/` — theme and global styles
- `prisma/` — schema and migrations
- `public/` — static assets

## Testing

- Critical logic should be unit testable.
- Matching algorithms require dedicated tests.
- API integration utilities should be mockable.
- UI components should avoid tightly coupled side effects.
- Verify transfer flows end to end.

## Performance

- Avoid unnecessary re-renders.
- Paginate playlist results when needed.
- Cache repeated API requests.
- Use optimistic UI carefully.
- Lazy-load heavy dashboard sections.
- Use image optimization.
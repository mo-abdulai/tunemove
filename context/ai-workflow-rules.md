# AI Workflow Rules

## Approach

Build this project incrementally using a spec-driven workflow.

The context files define:

- What to build
- How to build it
- Current implementation status
- Architectural boundaries
- UI constraints
- Product scope

Every implementation must follow the specifications inside:

- `project-overview.md`
- `architecture.md`
- `ui-context.md`
- `code-standards.md`
- `progress-tracker.md`

Do not invent product behavior outside the documented scope.

Implementation should prioritize:

- Stability
- Clear architecture
- Incremental progress
- Verifiable functionality
- Production-quality structure

## Scoping Rules

- Work on one feature unit at a time.
- Prefer small, testable increments.
- Do not combine unrelated system boundaries.
- Avoid massive multi-feature commits.
- Keep implementations independently verifiable.

Good example:

- Build Spotify OAuth flow independently before playlist transfer.

Bad example:

- Build auth, transfer engine, analytics, and dashboard redesign together.
  
## Recommended Build Order

- Project setup
- Tailwind + shadcn setup
- Clerk authentication
- Database schema
- Dashboard shell
- Spotify OAuth integration
- Fetch Spotify playlists
- Apple Music integration
- Transfer engine
- Transfer review UI
- Transfer history
- Loading states and polish
- Analytics and observability
- Background job processing

## When to Split Work

Split implementation work if it combines:

- UI redesigns and backend integration logic
- Multiple unrelated API routes
- Multiple database schema changes
- Auth and unrelated business logic
- Background jobs and frontend rendering
- Ambiguous product behavior

If a feature cannot be tested quickly end to end, split the scope.

## Handling Missing Requirements

- Do not invent undefined behavior.
- Resolve ambiguity inside context files first.
- Keep architecture documentation synchronized.
- Avoid assumptions about external APIs.
- If a requirement is missing, add it as an open question
  in `progress-tracker.md` before continuing

## Protected Files

Do not modify unless explicitly instructed:

- components/ui/*
- Generated Prisma migrations
- Clerk-generated configuration
- Third-party package internals
- shadcn-generated components

## Keeping Docs in Sync

Update context documentation whenever:

- Architecture changes
- New system boundaries are added
- Database models change
- API contracts change
- UI conventions evolve
- Product scope changes
- Platform integrations change

Always keep:

- `progress-tracker.md`
- `architecture.md`
- `project-overview.md`

synchronized with implementation.

## Before Moving to the Next Unit

Before continuing:

1. Current feature works end to end.
2. Type safety passes.
3. Authentication remains secure.
4. Architecture invariants are preserved.
5. npm run build passes.
6. Progress tracker is updated.
7. No undocumented behavior was introduced.

## AI Assistant Expectations

When using AI coding assistants:

- Generate production-quality code.
- Follow project conventions strictly.
- Prefer readability over clever abstractions.
- Explain architectural tradeoffs.
- Do not silently introduce dependencies.
- Keep generated code modular.
- Preserve design consistency.
- Maintain strong TypeScript typing.

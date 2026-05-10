# 04 - Dashboard Home UI

Read `AGENTS.md` before starting.

We are building the polished TuneMove dashboard home page UI only. No API integrations yet.

## Goal

Create a sleek, premium dashboard home experience that feels inspired by:

- Linear
- Vercel
- Spotify
- Raycast

The dashboard should feel:

- minimal
- calm
- spacious
- modern
- music-focused
- highly polished

Do not build a generic admin dashboard.

## Design Rules

Keep the dashboard clean and intentional.

Avoid:

- gradients
- oversized hero sections
- noisy backgrounds
- cluttered statistics
- feature overload
- hardcoded colors
- raw Tailwind color classes like `zinc-*`, `slate-*`, `gray-*`, or `neutral-*`

Use semantic Tailwind utilities from `globals.css`.

## Dashboard Sections

Update:

```txt
app/dashboard/page.tsx
```

The page should include four polished sections.

## 1. Welcome Header

Create a compact intro section.

Content:

```txt
Welcome back
Move your playlists between platforms without rebuilding them manually.
```

Requirements:

- compact layout
- no giant hero
- subtle spacing
- clean typography
- left aligned

## 2. Connected Platforms

Create two polished platform cards:

```txt
Spotify
Apple Music
```

Each card should include:

- platform icon or badge
- platform name
- placeholder connection status
- subtle platform accent
- small placeholder action button

Suggested statuses:

```txt
Not connected
Ready to connect
```

Do not implement real connections yet.

Suggested component:

```txt
components/dashboard/platform-status-card.tsx
```

## 3. Quick Transfer Panel

Create the primary action surface for the dashboard.

Content:

```txt
Start a playlist transfer
Choose a source platform, destination platform, and playlist to begin.
```

Include placeholder UI for:

- source platform
- destination platform
- playlist selection

Add placeholder action button:

```txt
Start Transfer
```

Do not implement transfer logic yet.

Suggested component:

```txt
components/dashboard/quick-transfer-card.tsx
```

## 4. Recent Activity

Create a polished empty state.

Content:

```txt
No transfers yet
Your completed playlist transfers will appear here.
```

Requirements:

- simple empty state surface
- subtle icon
- centered content
- calm spacing

Suggested icons:

```txt
History
ListMusic
```

Suggested component:

```txt
components/dashboard/empty-activity-card.tsx
```

## Layout Requirements

The dashboard should use:

```txt
max-w-7xl
```

Use comfortable spacing between sections.

Suggested layout:

```txt
Welcome Header

Connected Platforms

Quick Transfer Panel

Recent Activity
```

Do not overcrowd the page.

## Styling Rules

Use semantic Tailwind utilities only:

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

Use radius scale:

```txt
rounded-xl
rounded-2xl
rounded-3xl
rounded-full
```

## Motion

Use subtle motion only.

Good uses:

- soft hover states
- opacity transitions
- small card hover lift
- subtle button transitions

Avoid:

- bouncing animations
- flashy effects
- animated gradients
- slow transitions

Use Framer Motion only if already installed.

Otherwise use Tailwind transitions.

## Accessibility

Requirements:

- buttons must be keyboard accessible
- placeholder inputs must have labels
- cards should maintain readable contrast
- hover states should not rely only on color

## Out of Scope

Do not implement:

- Spotify API
- Apple Music API
- OAuth
- transfer logic
- playlist fetching
- database models
- analytics
- real activity history
- settings persistence

This feature is only for polished dashboard home UI.

## Check When Done

- dashboard home looks polished and spacious
- connected platform cards render
- quick transfer panel renders
- recent activity empty state renders
- no API calls added
- no database logic added
- no hardcoded colors
- no raw Tailwind color classes like `zinc-*`, `slate-*`, `gray-*`, or `neutral-*`
- no gradients or oversized hero sections added
- dashboard remains responsive
- `npm run build` passes
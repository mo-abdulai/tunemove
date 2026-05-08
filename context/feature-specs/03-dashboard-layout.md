# 03 - Dashboard Layout

Read `AGENTS.md` before starting.

We need the base dashboard chrome components that frame every authenticated TuneMove screen — the top navbar, the left sidebar shell, and the main dashboard content area. These will be reused and extended in every feature that follows.

## Dashboard Navbar

Create `components/dashboard/dashboard-navbar.tsx`.

Requirements:

- fixed-height top navbar
- left, center, and right sections
- left section contains sidebar toggle button
- use `PanelLeftOpen` / `PanelLeftClose` icons based on sidebar state
- center section contains current page title when provided
- right section contains Clerk `UserButton`
- dark background with subtle bottom border
- use existing color tokens from `globals.css`
- no hardcoded colors
- no raw Tailwind color classes like `zinc-*`, `slate-*`, `gray-*`, or `neutral-*`

## Dashboard Sidebar

Create `components/dashboard/dashboard-sidebar.tsx`.

Requirements:

- sidebar should frame the dashboard on desktop
- sidebar should slide in from the left on smaller screens
- accepts `isOpen` and `onClose` props
- opening it on mobile should not permanently push page content
- desktop sidebar can remain visible as part of the shell
- header with `TuneMove` title + close button on mobile
- navigation links:
  - Dashboard
  - Transfer
  - Playlists
  - History
  - Connections
  - Settings
- use `lucide-react` icons:
  - `LayoutDashboard`
  - `Repeat`
  - `ListMusic`
  - `History`
  - `Cable`
  - `Settings`
- active route should be visually highlighted
- full-width `New Transfer` button at the bottom with `Plus` icon
- dark background with subtle right border
- use existing color tokens from `globals.css`

## Dashboard Shell

Create `components/dashboard/dashboard-shell.tsx`.

Requirements:

- owns sidebar open/close state
- renders `DashboardNavbar`
- renders `DashboardSidebar`
- renders page content through `children`
- uses a full-height dashboard layout
- main content should be scrollable
- sidebar should not break mobile layout
- dashboard background should use `bg-base`
- content panels should use `bg-surface` or `bg-elevated`

## Page Container

Create `components/dashboard/page-container.tsx`.

Requirements:

- reusable wrapper for dashboard pages
- accepts `title`, `description`, and `children`
- consistent page padding
- max content width
- title uses `text-copy-primary`
- description uses `text-copy-secondary`
- does not fetch data
- does not contain business logic

## Routes

Create the base dashboard routes:

```txt
app/dashboard/layout.tsx
app/dashboard/page.tsx
app/dashboard/transfer/page.tsx
app/dashboard/playlists/page.tsx
app/dashboard/history/page.tsx
app/dashboard/connections/page.tsx
app/dashboard/settings/page.tsx
# UI Context

## Theme

The application uses a dark-only premium music dashboard aesthetic inspired by modern streaming platforms and AI tools.

The design language emphasizes:

- Near-black layered surfaces
- Smooth gradients
- Glassmorphism panels
- Minimal clutter
- Soft shadows
- Animated interactions
- High contrast typography
- Vibrant accent colors

The interface should feel:

- Modern
- Sleek
- Premium
- Responsive
- Interactive
- Highly polished

No light mode will exist in the initial release.

All colors are defined as CSS custom properties in `globals.css` and mapped to Tailwind tokens via `@theme inline`. Components must use these tokens — no hardcoded hex values or raw Tailwind color classes like `zinc-*`.

## Colors

| Role             | CSS Variable           | Hex / Value               |
| ---------------- | ---------------------- | ------------------------- |
| Page background  | `--bg-base`              |         `#07070A `        |
|Surface background | `--bg-surface `          |          `#111217`       | 
| Elevated surface | `--bg-elevated` | `#181A20` |
|Primary text  | `--text-primary` |`#F5F7FA` |
|Secondary text  | `--text-secondary` | `#B5BAC5` |
|Muted text | `--text-muted` | `#7B8190` |
| Primary accent | `--accent-primary` | `#8B5CF6` |
|Secondary accent | `--accent-secondary` | `#3B82F6` |
|Spotify accent |  `--spotify-green` | `#1DB954` |
|Apple accent |`--apple-red` | `#FA233B`|
|Border | `--border-default` | `#262933` |
|Error | `--state-error` | `#EF4444` |
|Success | `--state-success` | `#22C55E` |
|Warning | `--state-warning` | `#F59E0B` |

Tailwind utility names map to these variables. Use `bg-base`, `bg-surface`, `text-copy-primary`, `text-copy-muted`, `border-surface-border`, `text-brand`, `bg-accent-dim`, etc.

## Typography

| Role      | Font              | Variable            |
| --------- | ----------------- | --------------------|
| UI text   | Geist Sans        | `--font-geist-sans` |
| Code/mono | Geist Mono        | `--font-geist-mono` |

Typography hierarchy:

- Hero titles: bold, large tracking-tight
- Dashboard headings: semibold
- Supporting text: muted medium weight
- Small metadata: muted and compact

Both fonts are loaded via `next/font/google` and applied as CSS variables on the `<html>` element. The base `body` uses Geist Sans with `antialiased`.

## Border Radius

Radius increases with surface depth — smaller for inner elements, larger for outer containers.

| Context           | Class            |
| ----------------- | ---------------- |
| Inline / small UI | `rounded-md`     |
| Cards / panels    | `rounded-2xl`    |
| Modals / overlays | `rounded-3xl`    |
| Pills / badges.   | `rounded-full`   |

## Component Library

- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide React

All reusable components belong inside:

- components/ui/
- components/dashboard/
- components/platforms/
- components/transfers/

## Layout Patterns

### App Layout

- Full-height dashboard
- Left sidebar navigation
- Sticky top navbar
- Main content container with max width

### Sidebar

- Fixed width
- Soft border separator
- Compact navigation items
- Active item highlight
  
### Dashboard Cards

- Layered dark surfaces
- Soft borders
- Gradient hover states
- Motion transitions

### Modals

- Centered overlay
- Backdrop blur
- Animated scale and fade

### Tables and Lists

- Minimal separators
- Compact density
- Hover feedback
- Smooth row transitions

## Motion and Animation

Use Framer Motion for:

- Page transitions
- Loading states
- Card hover interactions
- Modal transitions
- Progress animations
- Skeleton loading effects

Animation rules:

- Fast and subtle
- No excessive bounce
- Prioritize responsiveness
- Avoid distracting effects

## Icons

Use Lucide React exclusively.

Sizes:

- Inline: `h-4 w-4`
- Buttons: `h-5 w-5`
- Feature cards: `h-6 w-6`
- Hero graphics: `h-8 w-8`

## Responsive Behavior

The application must support:

- Desktop first
- Tablet layouts
- Mobile dashboards

Mobile behavior:

- Collapsible sidebar
- Stacked cards
- Horizontal scroll only where unavoidable
- Large touch targets


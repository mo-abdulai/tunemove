Read AGENTS.md before starting.

Refine and polish the TuneMove dashboard UI to feel more premium, smooth, and modern while preserving the existing structure and layout.

The visual direction should feel like a mix of:
- Linear
- Vercel
- Spotify
- Raycast

Focus only on UI polish and microinteractions.

Do not add API integrations, database logic, or new business functionality.

## Navbar Improvements

The navbar currently feels too empty.

Improve it by:

- adding a small subtitle/description under the page title
- slightly increasing navbar visual presence
- adding subtle backdrop blur
- improving separation from the main content
- preserving the minimal aesthetic

Example structure:

Dashboard
Manage playlist transfers and connected platforms

Do not make the navbar oversized.

## Sidebar Improvements

Improve the sidebar depth and polish.

Requirements:

- sidebar should feel slightly elevated above the background
- stronger visual separation from the main content
- improve active navigation item styling
- improve hover states
- add subtle transitions

Suggested styling direction:

- `bg-surface/80`
- subtle backdrop blur
- softer border
- smoother hover transitions

The sidebar should still feel minimal and calm.

## Card Polish

Improve dashboard cards:

- connected platform cards
- quick transfer panel
- recent activity card

Requirements:

- subtle hover lift
- smoother transitions
- improved surface depth
- slightly stronger elevation
- softer borders
- cleaner spacing

Suggested motion:

- `hover:-translate-y-0.5`
- `transition-all duration-200`

Keep motion subtle and premium.

## Connected Platform Cards

Make Spotify and Apple Music cards feel more music-focused.

Requirements:

- subtle Spotify green accents
- subtle Apple Music red accents
- improve badge styling
- improve button polish
- maintain calm dark aesthetic

Do not overuse bright colors.

## Quick Transfer Panel

This should feel like the primary product action.

Improve by:

- slightly increasing visual importance
- improving spacing
- stronger typography hierarchy
- cleaner input alignment
- stronger surface elevation

Do not add real transfer functionality yet.

## Recent Activity Empty State

The current empty state feels too empty.

Improve it by:

- reducing unnecessary empty vertical space
- adding a better icon container
- improving typography hierarchy
- optionally adding a subtle placeholder CTA

Keep it minimal.

## Motion and Microinteractions

Add subtle premium interactions across the dashboard.

Good examples:

- hover transitions
- fade-in transitions
- smooth sidebar animation
- smooth button interactions
- subtle card hover states

Avoid:

- bouncing animations
- flashy effects
- animated gradients
- heavy motion

## Styling Rules

Use only semantic Tailwind utilities from `globals.css`.

Allowed examples:

- `bg-base`
- `bg-surface`
- `bg-elevated`
- `text-copy-primary`
- `text-copy-secondary`
- `text-copy-muted`
- `text-brand`
- `border-surface-border`

Do not use:

- `zinc-*`
- `slate-*`
- `gray-*`
- `neutral-*`

Do not hardcode hex colors.

Maintain the existing radius scale:

- `rounded-xl`
- `rounded-2xl`
- `rounded-3xl`
- `rounded-full`

## Important

Do not:

- redesign the layout structure
- change routing
- add API calls
- add Spotify integrations
- add Apple Music integrations
- add database logic
- add charts or analytics
- clutter the dashboard

The goal is refinement and polish, not redesign.

## Check When Done

- dashboard feels more premium and polished
- navbar has better visual hierarchy
- sidebar feels elevated and refined
- cards have subtle hover polish
- connected platform cards feel more music-focused
- quick transfer panel feels more important
- empty state feels intentional
- motion remains subtle and smooth
- no hardcoded colors added
- no raw Tailwind color classes added
- no API/database logic added
- `npm run build` passes
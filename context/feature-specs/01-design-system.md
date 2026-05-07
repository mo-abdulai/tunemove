# 01 - Design System

Read `AGENTS.md` before starting.

We're adding the foundational design system and UI primitive components for the playlist transfer app.

This feature establishes the styling foundation that every future feature must follow.

## Goal

Set up the base UI system using:

- Tailwind CSS
- CSS custom property tokens
- shadcn/ui
- lucide-react
- Shared `cn()` utility
- Dark theme styling from `globals.css`

## Tasks

### 1. Install and configure shadcn/ui

Initialize `shadcn/ui` for the project.

Use the existing Next.js and Tailwind setup.

Add these shadcn components:

- Button
- Card
- Dialog
- Input
- Tabs
- Textarea
- ScrollArea
- Badge
- DropdownMenu
- Separator
- Skeleton

Do not manually modify generated files inside:

```txt
components/ui/*
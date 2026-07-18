---
name: ui-ux-design
description: UI/UX design and frontend implementation for the BlueBook (小蓝书) platform. Use when creating or modifying pages, components, CSS styles, animations, layouts, navigation, or visual components. Enforces the Industrial Masculine design system, bilingual CN/EN workflow, dark-mode-first approach, and distinctive anti-template aesthetics.
---

# UI/UX Design — BlueBook (小蓝书)

## Overview

Design and implement UI/UX for BlueBook, a male-oriented content community platform. Enforces the project's Industrial Masculine aesthetic — hard shadows, angular geometry, dark-mode-first, with amber orange accents. No soft, rounded, pastel, or feminine design elements.

## Mandatory Rules

1. **Dark mode first**: Default is dark. Light mode is secondary. Every component must look correct in dark mode before considering light.
2. **Industrial Masculine**: Hard shadows, angular cards (8px radius max), 2px stroke linear icons, metallic textures. No soft shadows, no excessive border-radius, no pastel colors.
3. **Anti-generic-AI**: No purple gradients. No template-looking layouts. No default Inter/Roboto as primary. No "warm cream" aesthetic. This is an industrial, hard-edged design language.
4. **Bilingual sync**: Key UI strings must work in both CN and EN via the i18n system.

## Design System Quick Reference

- **Palette**:
  - Deep Blue `#1A1D2E` — primary surface
  - Iron Gray `#2C3040` — secondary surface
  - Amber Orange `#E8782A` — accent/CTA
  - Military Green `#4A5D4E` — fitness section
  - Dark Gold `#B8963E` — finance section
  - Surface 0 `#13151F` — app background
- **Typography**: Inter + Noto Sans SC (via `next/font`), bold for headings
- **Background**: `#13151F` (deep dark), never pure `#000000`
- **Shadows**: Hard shadows `2px 2px 0px rgba(0,0,0,0.3)`, not soft/diffused
- **Border radius**: Cards 8px, Buttons 6px, Badges 4px — never more rounded
- **Icons**: Lucide React, 2px stroke, linear style, rounded caps

## Section Color System

Each of the 5 core sections has a distinctive accent color:
- 🛡️ 清醒学堂 (Awareness): `#7B68EE` (Medium Purple)
- 🔍 社交观察室 (Social): `#5B9BD5` (Steel Blue)
- 🎮 游戏营地 (Gaming): `#9B59B6` (Amethyst)
- 💪 铁馆 (Fitness): `#4A5D4E` (Military Green)
- 💰 搞钱研究院 (Finance): `#B8963E` (Dark Gold)

## Animation Guidelines

- **Like button**: Particle explosion — amber squares burst outward from center
- **Pull-to-refresh**: Gear (cog) icon rotation driven by drag distance
- **Bookmark**: Card shrinks into folder icon animation
- **Section tabs**: Metallic gradient indicator with shimmer effect
- **Page transitions**: Slide-in from right with spring physics
- **Cards**: Lift on hover with shadow elevation change
- **Easing**: Spring-based for interactive elements, `ease-out` for reveals
- Use Framer Motion for all complex animations
- CSS keyframes for simple loops (shimmer, gear-rotate, pulse-glow)

## Layout Principles

- Mobile-first design: all base styles target 375px
- Desktop: content centered in `max-w-lg` (512px) container — looks like a mobile app centered in browser
- Waterfall/masonry grid for feed — CSS columns approach
- Fixed bottom tab bar (5 tabs, center Create button is amber)
- Sticky top app bar with search link
- Horizontal scrolling category tabs with metallic indicator
- Full-bleed section hero banners with themed color gradients

## Component Patterns

- **Feed cards**: Gradient cover placeholder + title (2-line clamp) + author avatar + like count + section badge
- **Post detail**: Image gallery + full content + dual-tab comments (Rational Analysis / Hot)
- **Profile**: Stats dashboard + influence score bar + achievement badges (rarity colors) + posts grid
- **Create post**: Format selector (image/long-text/poll) + AI title suggestion + section picker
- **Messages**: Tab-based (Comments/Likes/System/DMs) + notification list

## Visual Details

- **Backgrounds**: Layered dark surfaces with subtle color tints per section, never flat black
- **Borders**: `#2C3040` default, `#E8782A` for active/focus states
- **Cards**: Hard shadow + border, never shadowless or overly rounded
- **Scrollbars**: Thin 6px, dark thumb, hidden for horizontal scroll areas
- **Selection colors**: Amber orange for text selection

## Text Hierarchy

- **Primary**: `#E8E9ED` — main content, headings
- **Secondary**: `#9DA2B3` — descriptions, timestamps
- **Tertiary**: `#6B7084` — placeholders, disabled states

## Bilingual Workflow

- i18n powered by client-side context (`src/i18n/provider.tsx`)
- Message files: `messages/zh.json` (default), `messages/en.json`
- Use `t("key.path")` from `useI18n()` hook for all user-facing strings
- Toggle via `LocaleToggle` component (shows current locale, click to switch)

## Tech Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- shadcn/ui (base-nova style) for foundational components
- Zustand for client state management
- Framer Motion for animations
- Lucide React for icons

## Resources

- `references/design-system.md` — Full design tokens, color palettes, section colors, CSS variable names, animation specs

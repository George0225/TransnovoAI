# BlueBook Design System Reference

## Tech Stack
- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- shadcn/ui (base-nova style, dark mode default)
- Zustand (state), Framer Motion (animation), Lucide React (icons)
- Client-side i18n via `src/i18n/provider.tsx`

## CSS Variables (globals.css)

### Surface Colors
```
--bb-surface-0: #13151F   /* App background */
--bb-surface-1: #1A1D2E   /* Card background (Deep Blue) */
--bb-surface-2: #2C3040   /* Elevated surface (Iron Gray) */
--bb-surface-3: #3A3F52   /* Hover/active states */
```

### Text Colors
```
--bb-text-primary: #E8E9ED   /* Main content */
--bb-text-secondary: #9DA2B3 /* Descriptions */
--bb-text-tertiary: #6B7084  /* Placeholders */
```

### Accent Colors
```
--bb-amber-orange: #E8782A   /* CTA, primary accent */
--bb-military-green: #4A5D4E /* Fitness section */
--bb-dark-gold: #B8963E      /* Finance section */
```

### Section Colors
```
--bb-section-awareness: #7B68EE  /* Purple */
--bb-section-social: #5B9BD5     /* Blue */
--bb-section-gaming: #9B59B6     /* Amethyst */
--bb-section-fitness: #4A5D4E    /* Green */
--bb-section-finance: #B8963E    /* Gold */
```

### Radii
```
--bb-radius-card: 8px
--bb-radius-button: 6px
--bb-radius-badge: 4px
```

### Shadows (hard, industrial)
```
--bb-shadow-card: 2px 2px 0px rgba(0,0,0,0.3)
--bb-shadow-elevated: 4px 4px 0px rgba(0,0,0,0.4)
--bb-shadow-button: 2px 2px 0px rgba(0,0,0,0.5)
```

## Tailwind Color Classes
All CSS variables are mapped to Tailwind utility classes:
- `bg-bb-surface-0`, `bg-bb-surface-1`, `bg-bb-surface-2`, `bg-bb-surface-3`
- `text-bb-text-1`, `text-bb-text-2`, `text-bb-text-3`
- `bg-bb-amber`, `text-bb-amber`, `bg-bb-gold`, `text-bb-gold`
- `bg-bb-military`
- `border-bb-border`, `border-bb-border-active`
- `shadow-bb-card`, `shadow-bb-elevated`, `shadow-bb-button`
- `rounded-card`, `rounded-button`, `rounded-badge`

## Typography
- Font: Inter (loaded via `next/font/google`, variable `--font-sans`)
- CJK fallback: Noto Sans SC (system fallback)
- Headings: Bold/Black weight
- Body: Regular/Medium weight
- Captions: Small text with tertiary color

## Animation Specs

### Like Particle Explosion
- 8 particles (amber `#E8782A` squares, 6×6px)
- Burst outward from center at random angles
- Scale: [0 → 1.5 → 0], Opacity: [1 → 1 → 0]
- Duration: 500ms, ease-out

### Pull-to-Refresh Gear
- Lucide `Cog` icon
- Rotation proportional to pull distance
- Continuous spin during refresh
- 1s per rotation

### Metallic Indicator
- Gradient: `linear-gradient(90deg, #6B7084, #E8E9ED, #6B7084)`
- Background-size: 200% for shimmer animation
- 2s infinite shimmer

### Page Slide-in
- From right: `x: "100%" → 0`
- Spring physics: damping 25, stiffness 200
- Exit: slide left with fade

## Component Sizes
- Avatar sm: 24px, md: 32px, lg: 48px, xl: 80px
- Bottom tab bar: fixed, ~56px height
- Top app bar: sticky, 56px height
- Feed card cover: aspect ratio varies (0.75–1.33)

## Responsive Breakpoints
- Mobile: < 640px (base)
- Tablet: 640px–1024px (sm/md)
- Desktop: > 1024px (lg) — content centered in 512px container

## File Structure
- Pages: `src/app/[route]/page.tsx`
- Components: `src/components/[category]/component.tsx`
- Types: `src/types/*.ts`
- Mock data: `src/data/mock-*.ts`
- Stores: `src/stores/*-store.ts`
- i18n: `messages/zh.json`, `messages/en.json`

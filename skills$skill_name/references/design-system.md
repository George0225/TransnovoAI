# Transnovo Design System Reference

## Tech Stack
- Pure static HTML/CSS/JS — no framework, no build step
- Deploy: Vercel (`vercel --prod`), project `transnovo-new`
- Shared: `css/common.css` (nav, mobile, base design tokens) + `js/lang-switch.js` (i18n toggle)
- Per-page: inline `<style>` block overrides `:root` CSS variables

## Dual-Page i18n
- Every page has CN (`page.html`) + EN (`page-en.html`) — always edit both
- `lang-switch.js` uses `data-i18n` attributes + translation dictionary for shared UI text
- Page-specific content is hardcoded in each language's HTML
- Language detection: URL pattern `-en.html` = English
- `localStorage` persists language preference

## Color Palettes

### common.css (Medical Tech Blue — nav/footer shared components)
```
--primary-500: #1a59e0  --accent-500: #e61e6c
--slate-800: #1a2433    --bg-primary: #ffffff
Font: 'Plus Jakarta Sans', system-ui, sans-serif
```

### Per-Page Override (Warm Cream/Gold — page content)
```
--primary-500: #c4bdae  --accent-500: #a48546
--slate-800: #2a2926    --bg-primary: #fdfdfc
Font: 'Cormorant Garamond', 'Noto Serif SC', serif
```

## Typography
- Display: `Playfair Display` (600-700)
- Body CN: `Noto Serif SC` (400-700)
- Body EN: `Cormorant Garamond` (400-700)
- Fallback: `Plus Jakarta Sans` (300-800)
- Google Fonts CDN: all loaded via `<link>`

## Animation Patterns
- CSS keyframes: `fadeUp`, `fadeIn`, `slideInLeft`, `shimmer`
- Canvas: particle system (warm cream/gold particles with connection lines)
- Canvas: world map with animated markers
- Scroll-triggered: `IntersectionObserver` with `.fade-up` class toggling
- Nav: transparent → solid on scroll
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`
- Number counting animations on scroll

## Responsive Breakpoints
- Desktop: > 1200px
- Tablet: 992px–1200px
- Mobile: < 992px (mobile-nav-panel with slide-in)

## Navigation Structure
- 3-level dropdown mega-menu (Devices/Drugs/IVD with subcategories)
- Mobile: hamburger → slide-in panel
- Language switch button injected dynamically by JS

## File Naming
- CN: `page-name.html` | EN: `page-name-en.html`
- Images: `images/` directory, kebab-case names
- All 44 pages = 22 bilingual pairs

## Why

The application is currently branded as "SimuMatch AI" but is being migrated to the "ExpectedScore.app" identity. The existing branding does not communicate the product's core value proposition — statistical auditing of past matches — and the design system (dark-only theme, outdated palette) does not align with the premium analytical SaaS aesthetic the product needs to convey.

## What Changes

- Replace all visible "SimuMatch AI" brand references with "ExpectedScore.app" across the UI (header, footer, loading state, meta title, i18n strings)
- Update the app header logo to use the bicolor typographic treatment: **"expected"** (bold, white) / **"score"** (light, green mint) as described in the branding report
- Create a favicon/browser icon using the "e·s" isotipo concept in SVG via `src/app/icon.tsx`
- Replace the dark-only theme with a light-mode-only design: remove the `@media (prefers-color-scheme: light)` block, invert the default tokens so the background is light and text is dark
- Adjust the primary color token `--primary` from `#00d9a3` to `#10b981` (Green Mint Tecnológico as specified in the branding report), with consistent updates to `--primary-hover` and `--primary-alpha`
- Replace the minimal `info-banner` welcome block on the landing page with an expanded hero section including the new H1/subtitle copy and a three-column "Cómo funciona" explanation block
- All layout changes must be fully responsive (mobile, tablet, desktop)

## Capabilities

### New Capabilities

- `brand-identity`: Visual identity tokens, logo component, and favicon reflecting the ExpectedScore.app brand
- `landing-hero`: Hero section on the main landing page with new copy, H1/subtitle, and three-column "Cómo funciona" explainer block

### Modified Capabilities

- None

## Impact

- `src/app/globals.css`: Color token changes (`--primary`, `--primary-hover`, `--primary-alpha`), removal of dark-mode media query, addition of light background tokens, new hero/explainer CSS classes
- `src/app/layout.tsx`: No structural changes expected; metadata title/description updated via i18n
- `src/app/loading.tsx`: Brand name update
- `src/app/icon.tsx` (new): SVG favicon component
- `src/infrastructure/ui/layout/Header/Header.tsx`: Logo markup updated to bicolor typographic treatment
- `src/infrastructure/ui/layout/Footer/Footer.tsx`: Copyright text updated
- `src/infrastructure/ui/i18n/messages/es.json`: `layout.title`, `layout.description`, `match.welcome`, `match.selectCompetition` keys updated; new hero section keys added
- `src/infrastructure/ui/i18n/messages/en.json`: Same keys updated
- `src/app/page.tsx`: Replaced `info-banner` welcome block with new `LandingHero` component when no league is selected
- New component: `src/infrastructure/ui/components/LandingHero.tsx`

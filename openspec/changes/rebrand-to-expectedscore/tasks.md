## 1. Color Tokens and Light Theme

- [ ] 1.1 In `src/app/globals.css`, update `:root` default block: set `--bg-primary: #f8fafc`, `--bg-surface: #ffffff`, `--bg-elevated: #f1f5f9`, `--bg-hover: #e2e8f0`
- [ ] 1.2 In `:root`, update text tokens: `--text-primary: #0f172a`, `--text-secondary: #475569`, `--text-tertiary: #94a3b8`
- [ ] 1.3 In `:root`, update border tokens: `--border-subtle: #e2e8f0`, `--border-default: #cbd5e1`
- [ ] 1.4 In `:root`, update shadow tokens for light mode (reduce opacity: `rgba(0,0,0,0.06)` for sm, etc.)
- [ ] 1.5 In `:root`, update `--primary: #10b981`, `--primary-hover: #059669`, `--primary-alpha: rgba(16, 185, 129, 0.12)`
- [ ] 1.6 In `:root`, update `--success: #22c55e` to avoid collision with the new `--primary`
- [ ] 1.7 Remove the entire `@media (prefers-color-scheme: light)` block — it is no longer needed
- [ ] 1.8 Update the CSS comment header from "DESIGN TOKENS - SimuMatch AI" to "DESIGN TOKENS - ExpectedScore.app"

## 2. Favicon

- [ ] 2.1 Create `src/app/icon.tsx` exporting a default function that returns SVG markup for the "e·s" isotipo (32×32, slate `#0f172a` background, `#10b981` text, Space Grotesk or system sans-serif fallback)

## 3. Header Logo

- [ ] 3.1 In `src/infrastructure/ui/layout/Header/Header.tsx`, replace the `<h1 className="app-title">SimuMatch AI</h1>` and `<p className="app-subtitle">...</p>` block with a semantic logo element using three inline spans: `.logo-expected` (bold, white), `.logo-score` (light, `#10b981`), `.logo-domain` (muted `.app` suffix)
- [ ] 3.2 In `src/app/globals.css`, add CSS classes `.logo-expected`, `.logo-score`, `.logo-domain` implementing the bicolor typographic treatment using `--font-display` (Space Grotesk)
- [ ] 3.3 Remove or repurpose the now-unused `.app-title` and `.app-subtitle` CSS rules

## 4. Footer and Loading Brand Strings

- [ ] 4.1 In `src/infrastructure/ui/layout/Footer/Footer.tsx`, update the copyright text to "© 2026 ExpectedScore.app"
- [ ] 4.2 In `src/app/loading.tsx`, update the `<h2>` brand text to "ExpectedScore.app"

## 5. i18n Brand Strings

- [ ] 5.1 In `src/infrastructure/ui/i18n/messages/es.json`, update `layout.title` to `"ExpectedScore.app | ¿Quién mereció ganar? Simulador de Justicia Estadística"`
- [ ] 5.2 In `es.json`, update `layout.description` to `"Simulamos cada partido 10.000 veces con los xG reales. Eliminamos el factor suerte para descubrir el marcador estadísticamente más justo."`
- [ ] 5.3 In `es.json`, update `match.welcome` to `"Audita los Resultados de la Jornada"`
- [ ] 5.4 In `es.json`, update `match.selectCompetition` to `"El marcador final no siempre cuenta la historia completa. Selecciona una liga para descubrir qué partidos se ganaron por puro azar y cuáles por mérito real."`
- [ ] 5.5 In `es.json`, add `layout.hero` namespace with keys: `headline`, `subtitle`, `steps.xg.title`, `steps.xg.description`, `steps.montecarlo.title`, `steps.montecarlo.description`, `steps.score.title`, `steps.score.description`
- [ ] 5.6 In `src/infrastructure/ui/i18n/messages/en.json`, update `layout.title` to `"ExpectedScore.app | Who deserved to win? Statistical Justice Simulator"`
- [ ] 5.7 In `en.json`, update `layout.description` to `"We simulate each match 10,000 times using real xG data. We eliminate luck to reveal the statistically fairest scoreline."`
- [ ] 5.8 In `en.json`, update `match.welcome` to `"Audit the Matchday Results"`
- [ ] 5.9 In `en.json`, update `match.selectCompetition` to `"The final score doesn't always tell the whole story. Select a league to discover which matches were won by pure luck and which by real merit."`
- [ ] 5.10 In `en.json`, add `layout.hero` namespace with the English equivalents of all keys added in 5.5

## 6. LandingHero Component

- [ ] 6.1 Create `src/infrastructure/ui/components/LandingHero.tsx` as a server component that reads from `next-intl` and renders: H1 (`layout.hero.headline`), subtitle paragraph (`layout.hero.subtitle`), and a three-column grid with the three "Cómo funciona" steps
- [ ] 6.2 In `src/app/globals.css`, add CSS classes for the hero section: `.landing-hero`, `.landing-hero-headline`, `.landing-hero-subtitle`, `.how-it-works-grid`, `.how-it-works-step`, `.how-it-works-step-title`, `.how-it-works-step-body`
- [ ] 6.3 Implement `.how-it-works-grid` as `display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--spacing-xl)` for automatic responsive collapse
- [ ] 6.4 In `src/app/page.tsx`, replace the `<div className="info-banner">` block (no-league branch) with `<LandingHero />` imported from the new component

## 7. Visual QA and Contrast Check

- [ ] 7.1 Visually inspect the Header, Sidebar, MatchCard, and Footer in the browser after token changes; fix any contrast issues (white-on-white, etc.)
- [ ] 7.2 Confirm the `.app-logo` gradient in `.app-title` no longer references the old dark background assumption; update if needed
- [ ] 7.3 Check `--border-focus` (currently `#3b82f6`) remains visible against the new light backgrounds; adjust if needed

## Context

The app uses Next.js 16 with `next-intl` for i18n (ES/EN). All visible copy lives in `src/infrastructure/ui/i18n/messages/{es,en}.json`. The design system is CSS custom properties defined in `src/app/globals.css` — no Tailwind token config, pure CSS variables consumed throughout the stylesheet. The current `--primary` is `#00d9a3` (green-turquoise); `--success` is already `#10b981` (green mint). There is no existing favicon or `public/` directory. The app is dark-mode by default with a light-mode override via `@media (prefers-color-scheme: light)`.

The landing welcome block (`info-banner`) is rendered inside `src/app/page.tsx` when no league is selected; it is a static JSX block, not a reusable component.

## Goals / Non-Goals

**Goals:**

- Replace all user-visible "SimuMatch AI" references with the ExpectedScore.app brand
- Implement the bicolor typographic logo in the header (`expected` bold white + `score` light green mint)
- Create a Next.js SVG icon component (`src/app/icon.tsx`) for the browser tab favicon using the "e·s" isotipo
- Switch to **light-mode only**: remove `@media (prefers-color-scheme: light)` override block, make the default `:root` tokens use a light palette coherent with the branding report (off-white/light slate backgrounds, dark slate text, `#10b981` green mint accent)
- Change `--primary` to `#10b981` with consistent derivations
- Replace the `info-banner` welcome block with a full-page `LandingHero` component containing the new H1/subtitle and three-column "Cómo funciona" explainer
- Fully responsive layout (mobile-first: single column on small screens, three columns on ≥ md)

**Non-Goals:**

- YouTube channel assets, banners, or thumbnails
- Domain/CNAME configuration
- Any changes to MongoDB, API routes, or business logic
- Dark mode toggle or user-selectable theme
- Changes to test builder fixtures (`builders.ts`) — those are internal test data

## Decisions

### D1: Light-mode-only approach

**Decision:** Remove the `@media (prefers-color-scheme: light)` block entirely. Rewrite the `:root` block with light tokens directly. No dark-mode fallback.

**Rationale:** The branding report explicitly calls for an "off-white / azul pizarra" aesthetic for the light variant. Maintaining two themes for a product that the owner wants light-only adds complexity with no benefit.

**Alternatives considered:** CSS `color-scheme: light` forced — rejected because it only affects browser chrome, not our custom tokens.

**Light palette tokens (coherent with report):**

```
--bg-primary:   #f8fafc   (slate-50 — off-white, clean)
--bg-surface:   #ffffff
--bg-elevated:  #f1f5f9   (slate-100)
--bg-hover:     #e2e8f0   (slate-200)

--text-primary: #0f172a   (slate-900 — azul pizarra oscuro)
--text-secondary: #475569 (slate-600)
--text-tertiary:  #94a3b8 (slate-400)

--border-subtle:  #e2e8f0
--border-default: #cbd5e1
```

### D2: Primary color migration `#00d9a3` → `#10b981`

**Decision:** Replace `--primary` with `#10b981`, derive `--primary-hover` as `#059669`, `--primary-alpha` as `rgba(16, 185, 129, 0.12)`.

**Rationale:** The branding report explicitly names `#10b981` as "Verde Mint Tecnológico". The current `--success` token already uses it, so we also need to differentiate `--success` to `#22c55e` to avoid collision.

### D3: Logo component — inline JSX, no SVG file asset

**Decision:** Implement the bicolor logo directly in `Header.tsx` as styled JSX spans. No external SVG file or image asset.

**Rationale:** The logo is purely typographic (two weights/colors of the same font). An SVG image would complicate localization and makes the DOM harder to maintain. Inline spans are simpler, accessible, and match the existing font stack (`--font-display: Space Grotesk`).

**Markup pattern:**

```html
<span class="logo-expected">expected</span><span class="logo-score">score</span>
<span class="logo-domain">.app</span>
```

### D4: Favicon via Next.js `icon.tsx` convention

**Decision:** Create `src/app/icon.tsx` exporting an SVG component using Next.js metadata file convention.

**Rationale:** No `public/` directory exists. Next.js 13+ supports `icon.tsx` in the app directory which auto-generates the `<link rel="icon">` tag. The "e·s" isotipo renders cleanly as an inline SVG with a slate background and mint-colored glyphs.

**Size:** `32x32`. Content: "e·s" in Space Grotesk, `#10b981` on `#0f172a` background.

### D5: LandingHero as a server component

**Decision:** Extract the welcome block into `src/infrastructure/ui/components/LandingHero.tsx`, a pure server component (no interactivity needed).

**Rationale:** Consistent with the existing pattern — `page.tsx` delegates rendering to leaf components. The hero is static copy from i18n.

**Three-column layout approach:** CSS Grid `grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))` — this naturally collapses to single column on mobile and two/three columns on wider screens without explicit breakpoints in the component.

### D6: i18n keys for new hero copy

**Decision:** Add new keys under `layout.hero.*` namespace in both locale files rather than repurposing `match.welcome` / `match.selectCompetition`.

**Rationale:** The welcome keys are also used on loading states and other contexts. A dedicated `layout.hero` namespace avoids coupling and allows independent updates.

## Risks / Trade-offs

- **[Color contrast on light bg]** Switching to light mode may reveal insufficient contrast in components that were designed for dark backgrounds (e.g., white text on white) → Mitigation: After implementing tokens, visually scan key components (MatchCard, Header, Sidebar, Footer) and fix any contrast issues inline.
- **[--success collision]** Changing `--success` to avoid collision with new `--primary` may alter the appearance of status badges or result indicators → Mitigation: Search for all usages of `--success` in the CSS before shipping; the change is minor (`#10b981` → `#22c55e`, same green family).
- **[Existing screenshots/E2E tests]** Visual regression tests (Playwright) may fail if they rely on color or text snapshot → Mitigation: Update test fixtures that reference brand strings; visual comparison tests will need a baseline update.
- **[Font rendering]** The "e·s" favicon relies on Space Grotesk being available at icon generation time in Next.js → Mitigation: Use a system-safe SVG path fallback or inline font reference in the icon SVG.

## Open Questions

- None. All decisions are resolved based on the branding report and codebase exploration.

## Context

The match list page (`/`) is a Next.js App Router Server Component that reads `searchParams` (league, season, page, team). When a user clicks a `MatchCard`, they navigate to `/match/[id]`. The match detail page currently constructs its "Back to matches" link using only `match.league` and `match.season` from the match data, discarding any pagination or team filter state from the original URL.

The fix needs to work entirely within SSR/RSC: no client state, no session storage.

## Goals / Non-Goals

**Goals:**

- Preserve all list URL params (league, season, page, team) when returning from match detail.
- Prevent open redirect: the `back` value must be a relative URL within the app.
- Zero regression for direct-link access to `/match/[id]` (fallback to `/?league=...&season=...`).

**Non-Goals:**

- Preserving scroll position.
- Persisting navigation state across sessions or tabs.
- Handling the simulation or chronicle sub-pages (their back link goes to `/match/[id]`, which is unaffected).

## Decisions

### Decision 1: Pass full back URL as a query param (`?back=`)

**Chosen**: Encode the full return URL in a `back` query param when linking from the list to the detail page.

Example:

```
/match/abc123?back=%2F%3Fleague%3DX%26season%3DY%26page%3D4%26team%3Dspain
```

**Alternatives considered**:

- `router.back()` (browser history): Breaks on direct links, new tabs, or external navigation. Not SSR-compatible.
- Passing params individually (`fromPage`, `fromTeam`): The detail page would need to know the full URL schema of the list, creating coupling. Also doesn't generalize if new params are added.
- Session storage / cookie: Client-side complexity, not needed for this scope.

**Why `?back=`**: Pure SSR, no client code needed, works with shared/direct links (graceful fallback), and the pattern is idiomatic in Next.js App Router.

### Decision 2: Server-side validation of `back` param

The `back` value is validated before use: it must start with `/` (relative path). This prevents open redirect attacks where an attacker crafts a link like `/match/id?back=https://evil.com`.

Validation rule: `back.startsWith('/')` — if it fails, fall back to `/?league=...&season=...`.

### Decision 3: Build `backUrl` in `page.tsx`, pass via `MatchCard` prop

The list page (`src/app/page.tsx`) already has all `searchParams`. It builds the `backUrl` string and passes it to `MatchCard` as a prop. `MatchCard` appends it to the `/match/[id]` link href. This keeps the URL construction in one place (the server component with access to searchParams) and avoids prop drilling through intermediate components.

## Risks / Trade-offs

- **URL length**: Encoding the back URL adds ~60-80 chars to match detail URLs. Negligible in practice.
  → No mitigation needed.

- **`back` param visible in address bar**: Users see the encoded URL in `/match/[id]?back=...`. Slightly less clean.
  → Accepted trade-off. The alternative approaches are worse.

- **`MatchCard` gains a new optional prop**: Small interface change. Existing usages without `backUrl` fall back gracefully.
  → Prop is optional with a sensible default.

## Why

When a user navigates to match detail from a filtered list (with `page`, `team`, etc.) and clicks "Back to matches", the filter state is lost because the back link is hardcoded to only `league` and `season`. This breaks the expected navigation flow.

## What Changes

- The match list page (`/`) encodes the full current URL as a `back` query param when linking to match detail.
- The match detail page (`/match/[id]`) reads the `back` query param and uses it as the destination for the "Back to matches" link.
- The `back` param is validated server-side to start with `/` to prevent open redirect vulnerabilities.
- If no valid `back` param exists, the link falls back to `/?league=...&season=...` as before.

## Capabilities

### New Capabilities

- `match-detail-back-navigation`: Preserves full URL state (page, team filter) when navigating from match list to match detail and back.

### Modified Capabilities

## Impact

- `src/app/page.tsx`: `MatchCard` receives a `backUrl` prop built from current `searchParams`.
- `src/infrastructure/ui/components/MatchCard.tsx`: passes `backUrl` through to the link href of the match detail route.
- `src/app/match/[id]/page.tsx`: reads `searchParams.back`, validates it, and uses it in the "Back to matches" `<Link>`.

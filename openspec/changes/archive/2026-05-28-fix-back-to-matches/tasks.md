## 1. MatchCard — Add backUrl prop

- [x] 1.1 Add optional `backUrl` prop to `MatchCard` component interface
- [x] 1.2 Append `?back=<encoded backUrl>` to the `/match/${match.id}` link href when `backUrl` is provided

## 2. Home page — Build and pass backUrl

- [x] 2.1 In `src/app/page.tsx`, build `backUrl` from current `searchParams` (league, season, page, team) using `URLSearchParams`
- [x] 2.2 Pass `backUrl` to each `<MatchCard>` in the matches grid

## 3. Match detail page — Use backUrl with validation

- [x] 3.1 Add `back?: string` to the `searchParams` type in `src/app/match/[id]/page.tsx`
- [x] 3.2 Read `searchParams.back`, validate it starts with `/`, and assign to `backHref`
- [x] 3.3 Replace the hardcoded `/?league=...&season=...` href in the `<Link>` with `backHref`

## 4. Tests

- [x] 4.1 Add unit test: `backUrl` is correctly built and encoded in `page.tsx`
- [x] 4.2 Add unit test: match detail falls back when `back` param is missing or invalid (absolute URL)
- [x] 4.3 Add unit test: match detail uses valid `back` param as href

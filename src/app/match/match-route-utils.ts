import { FindMatchByIdResult } from "@/application/results/find-match-by-id.result";

interface MatchRouteQueryParams {
  back: string | undefined;
}

function encodePathSegment(value: string): string {
  return encodeURIComponent(value.trim());
}

export function buildMatchRouteQuery(
  params?: MatchRouteQueryParams
): string | undefined {
  if (!params) {
    return undefined;
  }

  const searchParams = new URLSearchParams();

  if (params.back) {
    searchParams.set("back", params.back);
  }

  const queryString = searchParams.toString();
  return queryString.length > 0 ? queryString : undefined;
}

export function buildCanonicalMatchHref(
  match: Pick<FindMatchByIdResult, "id" | "tournamentSlug" | "matchSlug">,
  params?: MatchRouteQueryParams
): string | null {
  const tournamentSlug = match.tournamentSlug?.trim();
  const matchSlug = match.matchSlug?.trim();

  if (!tournamentSlug || !matchSlug) {
    return null;
  }

  const baseHref = `/match/${encodePathSegment(tournamentSlug)}/${encodePathSegment(
    matchSlug
  )}/${encodePathSegment(match.id)}`;

  const queryString = buildMatchRouteQuery(params);
  return queryString ? `${baseHref}?${queryString}` : baseHref;
}

export function buildCanonicalMatchSimulationHref(
  match: Pick<FindMatchByIdResult, "id" | "tournamentSlug" | "matchSlug">,
  params?: MatchRouteQueryParams
): string | null {
  const canonicalMatchHref = buildCanonicalMatchHref(match, params);
  return canonicalMatchHref ? `${canonicalMatchHref}/simulation` : null;
}

export function buildCanonicalMatchChronicleHref(
  match: Pick<FindMatchByIdResult, "id" | "tournamentSlug" | "matchSlug">,
  params?: MatchRouteQueryParams
): string | null {
  const canonicalMatchHref = buildCanonicalMatchHref(match, params);
  return canonicalMatchHref ? `${canonicalMatchHref}/chronicle` : null;
}

export function isCanonicalMatchPath(
  match: Pick<FindMatchByIdResult, "tournamentSlug" | "matchSlug">,
  currentTournamentSlug: string,
  currentMatchSlug: string
): boolean {
  return (
    match.tournamentSlug?.trim() === currentTournamentSlug.trim() &&
    match.matchSlug?.trim() === currentMatchSlug.trim()
  );
}

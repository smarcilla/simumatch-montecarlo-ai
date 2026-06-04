import { notFound, redirect } from "next/navigation";
import MatchPage from "@/app/match/_internal/[id]/page";
import { getMatchById } from "@/infrastructure/actions/match.actions";
import {
  buildCanonicalMatchHref,
  isCanonicalMatchPath,
} from "@/app/match/match-route-utils";

interface CanonicalMatchPageProps {
  params: Promise<{
    tournamentSlug: string;
    matchSlug: string;
    id: string;
  }>;
  searchParams: Promise<{ back: string | undefined }>;
}

export default async function CanonicalMatchPage({
  params,
  searchParams,
}: Readonly<CanonicalMatchPageProps>) {
  const [{ tournamentSlug, matchSlug, id }, { back }] = await Promise.all([
    params,
    searchParams,
  ]);

  const match = await getMatchById(id);
  if (!match) {
    notFound();
  }

  if (!isCanonicalMatchPath(match, tournamentSlug, matchSlug)) {
    const canonicalHref = buildCanonicalMatchHref(match, { back });
    if (canonicalHref) {
      redirect(canonicalHref);
    }
  }

  return MatchPage({
    params: Promise.resolve({ id }),
    searchParams: Promise.resolve({ back }),
    skipCanonicalRedirect: true,
  });
}

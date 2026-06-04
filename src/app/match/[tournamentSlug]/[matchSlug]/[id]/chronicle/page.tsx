import { notFound, redirect } from "next/navigation";
import ChroniclePage from "@/app/match/_internal/[id]/chronicle/page";
import { getMatchById } from "@/infrastructure/actions/match.actions";
import { getChronicleByMatchId } from "@/infrastructure/actions/simulation.actions";
import {
  buildCanonicalMatchChronicleHref,
  buildCanonicalMatchHref,
  isCanonicalMatchPath,
} from "@/app/match/match-route-utils";

interface CanonicalMatchChroniclePageProps {
  params: Promise<{
    tournamentSlug: string;
    matchSlug: string;
    id: string;
  }>;
}

export default async function CanonicalMatchChroniclePage({
  params,
}: Readonly<CanonicalMatchChroniclePageProps>) {
  const { tournamentSlug, matchSlug, id } = await params;

  const match = await getMatchById(id);
  if (!match) {
    notFound();
  }

  if (!isCanonicalMatchPath(match, tournamentSlug, matchSlug)) {
    const canonicalChronicleHref = buildCanonicalMatchChronicleHref(match);
    if (canonicalChronicleHref) {
      redirect(canonicalChronicleHref);
    }
  }

  const chronicle = await getChronicleByMatchId(id);
  if (!chronicle) {
    redirect(buildCanonicalMatchHref(match) ?? "/");
  }

  return ChroniclePage({
    params: Promise.resolve({ id }),
    skipCanonicalRedirect: true,
  });
}

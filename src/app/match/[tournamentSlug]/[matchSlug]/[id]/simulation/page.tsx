import { notFound, redirect } from "next/navigation";
import SimulationPage from "@/app/match/_internal/[id]/simulation/page";
import { getMatchById } from "@/infrastructure/actions/match.actions";
import { getSimulationByMatchId } from "@/infrastructure/actions/simulation.actions";
import {
  buildCanonicalMatchHref,
  buildCanonicalMatchSimulationHref,
  isCanonicalMatchPath,
} from "@/app/match/match-route-utils";

interface CanonicalMatchSimulationPageProps {
  params: Promise<{
    tournamentSlug: string;
    matchSlug: string;
    id: string;
  }>;
}

export default async function CanonicalMatchSimulationPage({
  params,
}: Readonly<CanonicalMatchSimulationPageProps>) {
  const { tournamentSlug, matchSlug, id } = await params;

  const match = await getMatchById(id);
  if (!match) {
    notFound();
  }

  if (!isCanonicalMatchPath(match, tournamentSlug, matchSlug)) {
    const canonicalSimulationHref = buildCanonicalMatchSimulationHref(match);
    if (canonicalSimulationHref) {
      redirect(canonicalSimulationHref);
    }
  }

  const simulation = await getSimulationByMatchId(id);
  if (!simulation) {
    redirect(buildCanonicalMatchHref(match) ?? `/match/${id}`);
  }

  return SimulationPage({
    params: Promise.resolve({ id }),
    skipCanonicalRedirect: true,
  });
}

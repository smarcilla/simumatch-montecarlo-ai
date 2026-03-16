import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getMatchById } from "@/infrastructure/actions/match.actions";
import { getSimulationByMatchId } from "@/infrastructure/actions/simulation.actions";
import { DashboardLayout } from "@/infrastructure/ui/layout/DashboardLayout";
import { MatchDetailCard } from "@/infrastructure/ui/components/MatchDetailCard";
import { SimulationProbabilityChart } from "@/infrastructure/ui/components/SimulationProbabilityChart";
import { SimulationXptsCards } from "@/infrastructure/ui/components/SimulationXptsCards";
import { ScoreDistributionChart } from "@/infrastructure/ui/components/ScoreDistributionChart";
import { PlayerStatsChart } from "@/infrastructure/ui/components/PlayerStatsChart";
import { MomentumTimelineChart } from "@/infrastructure/ui/components/MomentumTimelineChart";

interface SimulationPageProps {
  params: Promise<{ id: string }>;
}

export default async function SimulationPage({
  params,
}: Readonly<SimulationPageProps>) {
  const { id } = await params;

  const [match, simulation] = await Promise.all([
    getMatchById(id),
    getSimulationByMatchId(id),
  ]);

  if (!match) notFound();
  if (!simulation) redirect(`/match/${id}`);

  const t = await getTranslations("common");

  return (
    <DashboardLayout>
      <div
        className="simulation-page"
        style={
          {
            "--team-home-primary": match.homeColorPrimary,
            "--team-home-secondary": match.homeColorSecondary,
            "--team-away-primary": match.awayColorPrimary,
            "--team-away-secondary": match.awayColorSecondary,
          } as React.CSSProperties
        }
      >
        <Link href={`/match/${id}`} className="match-detail-back">
          {t("backToMatch")}
        </Link>
        <MatchDetailCard match={match} />
        <SimulationProbabilityChart
          homeWinProbability={simulation.homeWinProbability}
          drawProbability={simulation.drawProbability}
          awayWinProbability={simulation.awayWinProbability}
          homeTeam={match.home}
          awayTeam={match.away}
          homeColor={match.homeColorPrimary}
          awayColor={match.awayColorPrimary}
          homeColorSecondary={match.homeColorSecondary}
          awayColorSecondary={match.awayColorSecondary}
        />
        <SimulationXptsCards
          xPtsHome={simulation.xPtsHome}
          xPtsAway={simulation.xPtsAway}
          homeTeam={match.home}
          awayTeam={match.away}
          homeColor={match.homeColorPrimary}
          awayColor={match.awayColorPrimary}
          homeColorSecondary={match.homeColorSecondary}
          awayColorSecondary={match.awayColorSecondary}
        />
        <ScoreDistributionChart
          scoreDistribution={simulation.scoreDistribution}
          homeTeam={match.home}
          awayTeam={match.away}
          homeColor={match.homeColorPrimary}
          awayColor={match.awayColorPrimary}
          homeColorSecondary={match.homeColorSecondary}
          awayColorSecondary={match.awayColorSecondary}
        />
        <PlayerStatsChart
          playerStats={simulation.playerStats}
          homeTeam={match.home}
          awayTeam={match.away}
          homeColor={match.homeColorPrimary}
          awayColor={match.awayColorPrimary}
          homeColorSecondary={match.homeColorSecondary}
          awayColorSecondary={match.awayColorSecondary}
        />
        <MomentumTimelineChart
          momentumTimeline={simulation.momentumTimeline}
          homeTeam={match.home}
          awayTeam={match.away}
          homeColor={match.homeColorPrimary}
          awayColor={match.awayColorPrimary}
          homeColorSecondary={match.homeColorSecondary}
          awayColorSecondary={match.awayColorSecondary}
        />
      </div>
    </DashboardLayout>
  );
}

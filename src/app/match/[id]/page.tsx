import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getMatchById,
  getShotsByMatch,
  getShotStatsByMatch,
} from "@/infrastructure/actions/match.actions";
import { DashboardLayout } from "@/infrastructure/ui/layout/DashboardLayout";
import { MatchDetailCard } from "@/infrastructure/ui/components/MatchDetailCard";
import { MatchActionsPanel } from "@/infrastructure/ui/components/MatchActionsPanel";
import { ShotsTable } from "@/infrastructure/ui/components/ShotsTable";
import { ShotStatsPanel } from "@/infrastructure/ui/components/ShotStatsPanel";
import { createFindShotsByMatchCommand } from "@/application/commands/find-shots-by-match.command";

interface MatchPageProps {
  params: Promise<{ id: string }>;
}

export default async function MatchPage({ params }: Readonly<MatchPageProps>) {
  const { id } = await params;

  const [match, initialShots, shotStats] = await Promise.all([
    getMatchById(id),
    getShotsByMatch(
      createFindShotsByMatchCommand(id, { page: 0, pageSize: 20 })
    ),
    getShotStatsByMatch(id),
  ]);

  if (!match) {
    notFound();
  }

  return (
    <DashboardLayout>
      <div className="match-detail-page">
        <Link
          href={`/?league=${match.league}&season=${match.season}`}
          className="match-detail-back"
        >
          ← Volver a partidos
        </Link>
        <MatchDetailCard match={match} />
        <MatchActionsPanel match={match} />
        <ShotStatsPanel
          stats={shotStats}
          homeTeam={match.home}
          awayTeam={match.away}
        />
        <ShotsTable
          matchId={id}
          initialData={initialShots}
          homeTeam={match.home}
          awayTeam={match.away}
        />
      </div>
    </DashboardLayout>
  );
}

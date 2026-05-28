import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
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
import { createFindShotsByMatchCommand } from "@/infrastructure/mappers/find-shots-by-match.mapper";

interface MatchPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ back?: string }>;
}

export function resolveBackHref(
  back: string | undefined,
  league: string,
  season: string
): string {
  const fallbackHref = `/?league=${league}&season=${season}`;

  if (!back) {
    return fallbackHref;
  }

  const normalizedBack = back.trim();

  if (!normalizedBack.startsWith("/") || normalizedBack.startsWith("//")) {
    return fallbackHref;
  }

  return normalizedBack;
}

export default async function MatchPage({
  params,
  searchParams,
}: Readonly<MatchPageProps>) {
  const [{ id }, { back }] = await Promise.all([params, searchParams]);

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

  const backHref = resolveBackHref(back, match.league, match.season);
  const t = await getTranslations("common");

  return (
    <DashboardLayout>
      <div
        className="match-detail-page"
        style={
          {
            "--team-home-primary": match.homeColorPrimary,
            "--team-home-secondary": match.homeColorSecondary,
            "--team-away-primary": match.awayColorPrimary,
            "--team-away-secondary": match.awayColorSecondary,
          } as React.CSSProperties
        }
      >
        <Link href={backHref} className="match-detail-back">
          {t("backToMatches")}
        </Link>
        <MatchDetailCard match={match} />
        <MatchActionsPanel match={match} />
        <ShotStatsPanel
          stats={shotStats}
          homeTeam={match.home}
          awayTeam={match.away}
          homeColor={match.homeColorPrimary}
          awayColor={match.awayColorPrimary}
          homeColorSecondary={match.homeColorSecondary}
          awayColorSecondary={match.awayColorSecondary}
          homeFlag={match.homeFlag}
          awayFlag={match.awayFlag}
        />
        <ShotsTable
          matchId={id}
          initialData={initialShots}
          homeTeam={match.home}
          awayTeam={match.away}
          homeColor={match.homeColorPrimary}
          awayColor={match.awayColorPrimary}
          homeColorSecondary={match.homeColorSecondary}
          awayColorSecondary={match.awayColorSecondary}
          homeFlag={match.homeFlag}
          awayFlag={match.awayFlag}
        />
      </div>
    </DashboardLayout>
  );
}

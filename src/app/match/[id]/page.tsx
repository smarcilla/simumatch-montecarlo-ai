import { notFound } from "next/navigation";
import Link from "next/link";
import { getMatchById } from "@/infrastructure/actions/match.actions";
import { DashboardLayout } from "@/infrastructure/ui/layout/DashboardLayout";
import { MatchDetailCard } from "@/infrastructure/ui/components/MatchDetailCard";
import { MatchActionsPanel } from "@/infrastructure/ui/components/MatchActionsPanel";

interface MatchPageProps {
  params: Promise<{ id: string }>;
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { id } = await params;
  const match = await getMatchById(id);

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
      </div>
    </DashboardLayout>
  );
}

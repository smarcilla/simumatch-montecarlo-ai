"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FindLeagueResult } from "@/application/results/find-leagues.result";

interface SidebarProps {
  readonly leagues: FindLeagueResult[];
}

export function SidebarClient({ leagues }: SidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeLeague = searchParams.get("league") || leagues[0]?.id || "";

  // Set initial params if missing
  useEffect(() => {
    const currentLeague = searchParams.get("league");
    const currentSeason = searchParams.get("season");

    // If params are missing and we have leagues, set the first league and its first season
    if ((!currentLeague || !currentSeason) && leagues.length > 0) {
      const firstLeague = leagues[0]!;
      const firstSeason = firstLeague.seasons[0];

      if (firstLeague.id && firstSeason?.id) {
        const queryParams = new URLSearchParams(searchParams);
        queryParams.set("league", firstLeague.id);
        queryParams.set("season", firstSeason.id);
        router.replace(`/?${queryParams.toString()}`);
      }
    }
  }, [leagues, searchParams, router]);

  const handleLeagueClick = (leagueId: string, seasonId?: string) => {
    const league = leagues.find((l) => l.id === leagueId);
    const selectedSeasonId = seasonId || league?.seasons[0]?.id;

    if (!selectedSeasonId) return;

    const queryParams = new URLSearchParams();
    queryParams.set("league", leagueId);
    queryParams.set("season", selectedSeasonId);

    router.push(`/?${queryParams.toString()}`);
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Competiciones</h2>
      </div>

      <nav>
        <ul className="league-list">
          {leagues.map((league) => (
            <li key={league.name} className="league-item">
              <button
                className={`league-button ${activeLeague === league.id ? "active" : ""}`}
                onClick={() => handleLeagueClick(league.id!)}
              >
                {league.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

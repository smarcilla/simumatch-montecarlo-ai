"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FindLeagueResult } from "@/application/results/find-leagues.result";

interface SidebarProps {
  readonly leagues: FindLeagueResult[];
}

export function SidebarClient({ leagues }: SidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeLeague = searchParams.get("league") || leagues[0]?.id || "";

  const handleLeagueClick = (
    leagueId: string,
    seasonId: string = "season-25-26"
  ) => {
    const queryParams = new URLSearchParams(searchParams);
    queryParams.set("league", leagueId);
    queryParams.set("season", seasonId);

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

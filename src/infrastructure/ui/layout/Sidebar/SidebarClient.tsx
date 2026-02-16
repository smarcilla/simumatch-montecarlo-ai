"use client";

import { LeagueDTO } from "@/infrastructure/dtos/league.dto";
import { useState } from "react";

interface SidebarProps {
  readonly leagues: LeagueDTO[];
}

export function SidebarClient({ leagues }: SidebarProps) {
  const [activeLeague, setActiveLeague] = useState<string>(
    leagues[0]?.name ?? ""
  );

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
                className={`league-button ${activeLeague === league.name ? "active" : ""}`}
                onClick={() => setActiveLeague(league.name)}
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

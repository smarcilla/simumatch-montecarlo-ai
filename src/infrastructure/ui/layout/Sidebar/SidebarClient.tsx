"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FindLeagueResult } from "@/application/results/find-leagues.result";

interface SidebarProps {
  readonly leagues: FindLeagueResult[];
}

export function SidebarClient({ leagues }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeLeague = searchParams.get("league") || leagues[0]?.id || "";
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsOpen((prev) => !prev);
    globalThis.addEventListener("toggle-mobile-menu", handler);
    return () => globalThis.removeEventListener("toggle-mobile-menu", handler);
  }, []);

  const close = () => setIsOpen(false);

  useEffect(() => {
    const currentLeague = searchParams.get("league");
    const currentSeason = searchParams.get("season");

    if (pathname !== "/") return;

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
  }, [leagues, pathname, searchParams, router]);

  const handleLeagueClick = (leagueId: string, seasonId?: string) => {
    const league = leagues.find((l) => l.id === leagueId);
    const selectedSeasonId = seasonId || league?.seasons[0]?.id;

    if (!selectedSeasonId) return;

    const queryParams = new URLSearchParams();
    queryParams.set("league", leagueId);
    queryParams.set("season", selectedSeasonId);

    close();
    router.push(`/?${queryParams.toString()}`);
  };

  return (
    <>
      {isOpen && (
        <div className="sidebar-overlay" onClick={close} aria-hidden="true" />
      )}
      <aside
        className={`dashboard-sidebar${isOpen ? " sidebar-drawer-open" : ""}`}
      >
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
    </>
  );
}

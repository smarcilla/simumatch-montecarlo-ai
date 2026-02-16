import { DIContainer } from "@/infrastructure/di-container";
import { SidebarClient } from "./SidebarClient";
import { LeagueMapper } from "@/infrastructure/mappers/league.mapper";

export async function Sidebar() {
  const leagueRepository = DIContainer.getLeagueRepository();
  const leagues = await leagueRepository.getLeagues();

  const leagueDTOs = LeagueMapper.toDTOList(leagues);
  return <SidebarClient leagues={leagueDTOs} />;
}

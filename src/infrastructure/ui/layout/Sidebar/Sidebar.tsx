import { DIContainer } from "@/infrastructure/di-container";
import { SidebarClient } from "./SidebarClient";

export async function Sidebar() {
  const findLeaguesResult = await (
    await DIContainer.getFindLeaguesUseCase()
  ).execute();

  return <SidebarClient leagues={findLeaguesResult} />;
}

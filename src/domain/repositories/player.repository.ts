import { Player } from "@/domain/entities/player.entity";

export interface PlayerRepository {
  findByExternalId(externalId: number): Promise<Player | null>;
  upsert(player: Player): Promise<void>;
}

import { Player } from "@/domain/entities/player.entity";
import { PlayerRepository } from "@/domain/repositories/player.repository";
import { IPlayerDocument, PlayerModel } from "../db/models/player.model";

export class MongoosePlayerRepository implements PlayerRepository {
  async findByExternalId(externalId: number): Promise<Player | null> {
    const doc = await PlayerModel.findOne({
      externalId,
    }).lean<IPlayerDocument>();
    if (!doc) return null;
    return new Player(
      (doc._id as { toString(): string }).toString(),
      doc.externalId,
      doc.name,
      doc.slug,
      doc.shortName,
      doc.position,
      doc.jerseyNumber
    );
  }

  async upsert(player: Player): Promise<void> {
    await PlayerModel.updateOne(
      { externalId: player.externalId },
      {
        $set: {
          name: player.name,
          slug: player.slug,
          shortName: player.shortName,
          position: player.position,
          jerseyNumber: player.jerseyNumber,
          externalId: player.externalId,
        },
      },
      { upsert: true }
    );
  }
}

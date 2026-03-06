import { Season } from "@/domain/entities/season.entity";
import { SeasonRepository } from "@/domain/repositories/season.repository";
import { ISeasonDocument, SeasonModel } from "../db/models/season.model";
import { SeasonYear } from "@/domain/value-objects/season-year.value";
import { Types } from "mongoose";

export class MongooseSeasonRepository implements SeasonRepository {
  async findByExternalId(externalId: number): Promise<Season | null> {
    const doc = await SeasonModel.findOne({
      externalId,
    }).lean<ISeasonDocument>();
    if (!doc) return null;
    return this.mapToEntity(doc);
  }

  async upsert(season: Season, leagueId: string): Promise<void> {
    await SeasonModel.updateOne(
      { externalId: season.externalId },
      {
        $set: {
          name: season.name,
          seasonYear: season.year.value,
          leagueId: new Types.ObjectId(leagueId),
          externalId: season.externalId,
        },
      },
      { upsert: true }
    );
  }

  async deleteAll(): Promise<void> {
    await SeasonModel.deleteMany({});
  }

  private mapToEntity(doc: ISeasonDocument): Season {
    return new Season(
      doc.name,
      new SeasonYear(doc.seasonYear),
      doc._id.toString(),
      doc.externalId
    );
  }
}

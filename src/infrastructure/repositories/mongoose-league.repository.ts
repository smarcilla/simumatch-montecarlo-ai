// src/infrastructure/repositories/mongoose-league.repository.ts
import { League } from "@/domain/entities/league.entity";
import { Season } from "@/domain/entities/season.entity";
import { LeagueRepository } from "@/domain/repositories/league.repository";
import { LeagueModel } from "../db/models/league.model";
import { ISeasonDocument } from "../db/models/season.model";
import { SeasonYear } from "@/domain/value-objects/season-year.value";
import { Types } from "mongoose";

interface ILeagueWithSeasons {
  _id: Types.ObjectId;
  name: string;
  country: string;
  externalId?: string;
  numericExternalId?: number;
  seasons: ISeasonDocument[];
}

export class MongooseLeagueRepository implements LeagueRepository {
  async getLeagues(): Promise<League[]> {
    const leaguesWithSeasons = await LeagueModel.aggregate<ILeagueWithSeasons>([
      {
        $lookup: {
          from: "seasons",
          localField: "_id",
          foreignField: "leagueId",
          as: "seasons",
        },
      },
      {
        $match: {
          "seasons.0": { $exists: true }, // ← Solo leagues que tienen al menos 1 season
        },
      },
      {
        $addFields: {
          seasons: {
            $sortArray: {
              input: "$seasons",
              sortBy: { seasonYear: -1 },
            },
          },
        },
      },
    ]);

    return leaguesWithSeasons.map(this.mapToEntity);
  }

  private mapToEntity(doc: ILeagueWithSeasons): League {
    const seasons = doc.seasons.map(
      (s) =>
        new Season(
          s.name,
          new SeasonYear(s.seasonYear),
          s._id.toString(),
          s.externalId
        )
    );

    return new League(
      doc.name,
      doc.country,
      seasons,
      doc._id.toString(),
      doc.externalId,
      doc.numericExternalId
    );
  }
}

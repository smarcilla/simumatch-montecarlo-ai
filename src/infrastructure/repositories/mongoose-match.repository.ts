// src/infrastructure/repositories/mongoose-match.repository.ts
import { Match } from "@/domain/entities/match.entity";
import { MatchRepository } from "@/domain/repositories/match.repository";
import { IMatchPopulated, MatchModel } from "../db/models/match.model";
import { TeamModel } from "../db/models/team.model";
import { LeagueModel } from "../db/models/league.model";
import { SeasonModel } from "../db/models/season.model";
import { PaginationOptions } from "@/application/options/pagination.options";
import { Types } from "mongoose";
import { League } from "@/domain/entities/league.entity";
import { SeasonYear } from "@/domain/value-objects/season-year.value";
import { Season } from "@/domain/entities/season.entity";
import { Team } from "@/domain/entities/team.entity";
import { Color } from "@/domain/value-objects/color.value";
import { MatchDate } from "@/domain/value-objects/match-date.value";
import { Score } from "@/domain/value-objects/score.value";
import { MatchStatus } from "@/domain/value-objects/match-status.value";
import { PaginatedResult } from "@/application/results/paginated.result";

export class MongooseMatchRepository implements MatchRepository {
  private static readonly REGISTERED_MODELS = Object.freeze({
    season: SeasonModel,
    team: TeamModel,
    league: LeagueModel,
  });

  async findByLeagueAndSeason(
    leagueId: string,
    seasonId: string,
    options: PaginationOptions
  ): Promise<PaginatedResult<Match>> {
    const filter = {
      leagueId: new Types.ObjectId(leagueId),
      seasonId: new Types.ObjectId(seasonId),
    };

    const paginationOptions = {
      page: options?.page ?? 0,
      pageSize: options?.pageSize ?? 12,
    };

    const total = await MatchModel.countDocuments(filter);

    const matches = await MatchModel.find(filter)
      .populate("leagueId")
      .populate("seasonId")
      .populate("homeTeamId")
      .populate("awayTeamId")
      .sort({ date: 1 })
      .skip(paginationOptions.page * paginationOptions.pageSize)
      .limit(paginationOptions.pageSize)
      .lean<IMatchPopulated[]>();

    const totalPages = Math.ceil(total / paginationOptions.pageSize);
    return {
      results: matches.map((doc) => this.mapToEntity(doc)),
      total,
      page: paginationOptions.page,
      pageSize: paginationOptions.pageSize,
      totalPages,
      hasNextPage: paginationOptions.page < totalPages - 1,
      hasPreviousPage: paginationOptions.page > 0,
    };
  }

  private mapToEntity(doc: IMatchPopulated): Match {
    // Mapear League
    const league = new League(
      doc.leagueId.name,
      doc.leagueId.country,
      [], // No necesitamos seasons aquí
      doc.leagueId._id.toString(),
      doc.leagueId.externalId,
      doc.leagueId.numericExternalId
    );

    // Mapear Season
    const season = new Season(
      doc.seasonId.name,
      new SeasonYear(doc.seasonId.seasonYear),
      doc.seasonId._id.toString(),
      doc.seasonId.externalId
    );

    // Mapear Home Team
    const homeTeam = new Team(
      doc.homeTeamId._id.toString(),
      doc.homeTeamId.externalId,
      doc.homeTeamId.name,
      doc.homeTeamId.slug,
      doc.homeTeamId.shortName,
      Color.create(doc.homeTeamId.primaryColor),
      Color.create(doc.homeTeamId.secondaryColor)
    );

    // Mapear Away Team
    const awayTeam = new Team(
      doc.awayTeamId._id.toString(),
      doc.awayTeamId.externalId,
      doc.awayTeamId.name,
      doc.awayTeamId.slug,
      doc.awayTeamId.shortName,
      Color.create(doc.awayTeamId.primaryColor),
      Color.create(doc.awayTeamId.secondaryColor)
    );

    // Mapear Value Objects
    const matchDate = MatchDate.create(doc.date.getTime());
    const score = Score.create(doc.homeScore ?? 0, doc.awayScore ?? 0);
    const status = MatchStatus.create(doc.status);

    return new Match(
      doc._id.toString(),
      doc.externalId,
      league,
      season,
      matchDate,
      score,
      status,
      homeTeam,
      awayTeam
    );
  }
}

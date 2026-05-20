import mongoose from "mongoose";
import { DIContainer } from "../di-container";
import { LeagueModel } from "../db/models/league.model";
import { SeasonModel } from "../db/models/season.model";
import { MatchModel } from "../db/models/match.model";
import { ShotModel } from "../db/models/shot.model";
import { DerivedSyncFilters, describeDerivedSyncFilters } from "./derived-sync";

export async function clearFilteredDerivedCollections(
  filters: DerivedSyncFilters
): Promise<void> {
  const targets = await resolveDerivedTargets(filters);

  console.log(
    `Clearing filtered derived collections for ${describeDerivedSyncFilters(filters)}...`
  );

  await (
    await DIContainer.getClearChroniclesByMatchIdsUseCase()
  ).execute(targets.matchIds);
  await (
    await DIContainer.getClearSimulationsByMatchIdsUseCase()
  ).execute(targets.matchIds);
  await deleteManyByIds(ShotModel, targets.shotIds, "shots");
  await deleteManyByIds(MatchModel, targets.matchIds, "matches");
  await deleteManyByIds(SeasonModel, targets.seasonIds, "seasons");
}

export async function resolveDerivedTargets(
  filters: DerivedSyncFilters
): Promise<DerivedDocumentTargets> {
  if (!filters.league) {
    return emptyDerivedTargets();
  }

  const league = await LeagueModel.findOne({ externalId: filters.league })
    .select("_id")
    .lean();

  if (!league?._id) {
    return emptyDerivedTargets();
  }

  const seasonQuery: {
    leagueId: mongoose.Types.ObjectId | string;
    seasonYear?: { $in: string[] };
  } = {
    leagueId: league._id,
  };

  if (filters.seasons.length > 0) {
    seasonQuery.seasonYear = { $in: filters.seasons };
  }

  const seasons = await SeasonModel.find(seasonQuery).select("_id").lean();
  const seasonIds = seasons.map((season) => season._id.toString());

  if (seasonIds.length === 0) {
    return {
      ...emptyDerivedTargets(),
      seasonIds,
    };
  }

  const matches = await MatchModel.find({
    leagueId: league._id,
    seasonId: { $in: seasonIds },
  })
    .select("_id")
    .lean();

  const matchIds = matches.map((match) => match._id.toString());

  if (matchIds.length === 0) {
    return {
      seasonIds,
      matchIds,
      shotIds: [],
    };
  }

  const shots = await ShotModel.find({
    matchId: { $in: matchIds },
  })
    .select("_id")
    .lean();

  return {
    seasonIds,
    matchIds,
    shotIds: shots.map((shot) => shot._id.toString()),
  };
}

async function deleteManyByIds(
  model: mongoose.Model<unknown>,
  ids: string[],
  label: string
): Promise<void> {
  if (ids.length === 0) {
    console.log(`No ${label} matched the requested filters`);
    return;
  }

  const result = await model.deleteMany({ _id: { $in: ids } });
  console.log(`${capitalize(label)} cleared: ${result.deletedCount ?? 0}`);
}

function emptyDerivedTargets(): DerivedDocumentTargets {
  return {
    seasonIds: [],
    matchIds: [],
    shotIds: [],
  };
}

function capitalize(value: string): string {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

export interface DerivedDocumentTargets {
  seasonIds: string[];
  matchIds: string[];
  shotIds: string[];
}

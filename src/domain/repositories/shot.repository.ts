import { Shot } from "../entities/shot.entity";
import { PaginationOptions } from "@/application/options/pagination.options";
import { ShotFilterOptions } from "@/application/options/shot-filter.options";
import { PaginatedResult } from "@/application/results/paginated.result";

export interface ShotRepository {
  findByExternalId(externalId: number): Promise<Shot | null>;
  upsert(shot: Shot): Promise<void>;
  findByMatchId(
    matchId: string,
    options: PaginationOptions,
    filters: ShotFilterOptions
  ): Promise<PaginatedResult<Shot>>;
  findAllByMatchId(matchId: string): Promise<Shot[]>;
  deleteAll(): Promise<void>;
}

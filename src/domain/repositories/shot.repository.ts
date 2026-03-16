import { Shot } from "../entities/shot.entity";
import { PaginationOptions, PaginatedResult } from "@/domain/types/pagination";
import { ShotFilterOptions } from "@/domain/types/shot-filter";

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

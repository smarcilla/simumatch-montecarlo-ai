import { Shot } from "../entities/shot.entity";

export interface ShotRepository {
  findByExternalId(externalId: number): Promise<Shot | null>;
  upsert(shot: Shot): Promise<void>;
}

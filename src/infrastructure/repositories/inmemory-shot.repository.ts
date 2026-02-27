import { Shot } from "@/domain/entities/shot.entity";
import { Player } from "@/domain/entities/player.entity";
import { ShotRepository } from "@/domain/repositories/shot.repository";
import { PaginationOptions } from "@/application/options/pagination.options";
import { ShotFilterOptions } from "@/application/options/shot-filter.options";
import { PaginatedResult } from "@/application/results/paginated.result";
import { ShotType } from "@/domain/value-objects/shot-type.value";
import { ShotSituation } from "@/domain/value-objects/shot-situation.value";
import { BodyPart } from "@/domain/value-objects/body-part.value";

const MATCH_A = "match-la-liga-id-season-22-23-0";
const MATCH_B = "match-la-liga-id-season-22-23-1";

function makePlayer(
  id: string,
  externalId: number,
  name: string,
  shortName: string
): Player {
  return new Player(
    id,
    externalId,
    name,
    `${name}-slug`,
    shortName,
    "forward",
    "9"
  );
}

function makeShot(
  id: string,
  externalId: number,
  matchId: string,
  isHome: boolean,
  shotType: string,
  situation: string,
  xg: number,
  xgot: number,
  timeSeconds: number,
  player: Player,
  goalkeeper: Player | null
): Shot {
  return new Shot(
    id,
    externalId,
    xg,
    xgot,
    isHome,
    ShotType.create(shotType),
    ShotSituation.create(situation),
    BodyPart.create("right-foot"),
    timeSeconds,
    player,
    goalkeeper,
    matchId
  );
}

const playerA = makePlayer("player-1", 101, "Lionel Messi", "Messi");
const playerB = makePlayer("player-2", 102, "Karim Benzema", "Benzema");
const playerC = makePlayer("player-3", 103, "Vinicius Jr", "Vinicius");
const gkHome = makePlayer(
  "player-gk-home",
  201,
  "Marc-Andre ter Stegen",
  "Ter Stegen"
);
const gkAway = makePlayer(
  "player-gk-away",
  202,
  "Thibaut Courtois",
  "Courtois"
);

export const SHOT_FIXTURES: Shot[] = [
  makeShot(
    "shot-1",
    1001,
    MATCH_A,
    true,
    "goal",
    "regular",
    0.72,
    0.85,
    300,
    playerA,
    gkAway
  ),
  makeShot(
    "shot-2",
    1002,
    MATCH_A,
    true,
    "save",
    "assisted",
    0.45,
    0.6,
    900,
    playerA,
    gkAway
  ),
  makeShot(
    "shot-3",
    1003,
    MATCH_A,
    true,
    "miss",
    "regular",
    0.12,
    0,
    1500,
    playerB,
    null
  ),
  makeShot(
    "shot-4",
    1004,
    MATCH_A,
    false,
    "goal",
    "regular",
    0.55,
    0.7,
    1200,
    playerC,
    gkHome
  ),
  makeShot(
    "shot-5",
    1005,
    MATCH_A,
    false,
    "save",
    "corner",
    0.3,
    0.4,
    2400,
    playerC,
    gkHome
  ),
  makeShot(
    "shot-6",
    1006,
    MATCH_A,
    true,
    "goal",
    "penalty",
    0.76,
    0.9,
    3000,
    playerA,
    gkAway
  ),
  makeShot(
    "shot-7",
    1007,
    MATCH_A,
    false,
    "block",
    "regular",
    0.08,
    0,
    3600,
    playerB,
    null
  ),
  makeShot(
    "shot-8",
    1008,
    MATCH_B,
    true,
    "miss",
    "regular",
    0.1,
    0,
    600,
    playerB,
    null
  ),
];

export class InMemoryShotRepository implements ShotRepository {
  private readonly shots: Shot[];

  constructor(shots: Shot[] = SHOT_FIXTURES) {
    this.shots = shots;
  }

  async findByExternalId(externalId: number): Promise<Shot | null> {
    return this.shots.find((s) => s.externalId === externalId) ?? null;
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  async upsert(_shot: Shot): Promise<void> {
    return;
  }

  async findAllByMatchId(matchId: string): Promise<Shot[]> {
    return this.shots.filter((s) => s.matchId === matchId);
  }

  async findByMatchId(
    matchId: string,
    options: PaginationOptions,
    filters: ShotFilterOptions
  ): Promise<PaginatedResult<Shot>> {
    let filtered = this.shots.filter((s) => s.matchId === matchId);

    if (filters.shotTypes && filters.shotTypes.length > 0) {
      filtered = filtered.filter((s) =>
        filters.shotTypes!.includes(s.shotType.value)
      );
    }
    if (filters.situations && filters.situations.length > 0) {
      filtered = filtered.filter((s) =>
        filters.situations!.includes(s.situation.value)
      );
    }
    if (filters.isHome !== undefined) {
      filtered = filtered.filter((s) => s.isHome === filters.isHome);
    }

    const sortField = filters.sortBy === "xg" ? "xg" : "timeSeconds";
    const sortDir = filters.sortOrder === "desc" ? -1 : 1;
    filtered = [...filtered].sort(
      (a, b) => (a[sortField] - b[sortField]) * sortDir
    );

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / options.pageSize));
    const paged = filtered.slice(
      options.page * options.pageSize,
      (options.page + 1) * options.pageSize
    );

    return {
      results: paged,
      total,
      page: options.page,
      pageSize: options.pageSize,
      totalPages,
      hasNextPage: options.page < totalPages - 1,
      hasPreviousPage: options.page > 0,
    };
  }
}

import { Types } from "mongoose";
import {
  ChronicleGeneratedContent,
  ChronicleGenerationContext,
  Chronicle,
} from "@/domain/entities/chronicle.entity";
import {
  ILeagueDocument,
  LeagueModel,
} from "@/infrastructure/db/models/league.model";
import { SeasonModel } from "@/infrastructure/db/models/season.model";
import { TeamModel } from "@/infrastructure/db/models/team.model";
import { MatchModel } from "@/infrastructure/db/models/match.model";
import { ShotModel } from "@/infrastructure/db/models/shot.model";
import { PlayerModel } from "@/infrastructure/db/models/player.model";
import { SimulationModel } from "@/infrastructure/db/models/simulation.model";
import { ChronicleModel } from "@/infrastructure/db/models/chronicle.model";

let counter = 0;

const nextId = () => ++counter;

export async function buildLeague(overrides: Record<string, unknown> = {}) {
  const id = nextId();
  return LeagueModel.create({
    name: `League ${id}`,
    country: "Spain",
    externalId: `ext-${id}`,
    ...overrides,
  }) as Promise<ILeagueDocument>;
}

export async function buildSeason(
  leagueId: Types.ObjectId | string,
  overrides: Record<string, unknown> = {}
) {
  const id = nextId();
  const y1 = String(id % 100).padStart(2, "0");
  const y2 = String((id + 1) % 100).padStart(2, "0");
  return SeasonModel.create({
    name: `Season ${y1}/${y2}`,
    seasonYear: `${y1}/${y2}`,
    leagueId: new Types.ObjectId(leagueId.toString()),
    externalId: id,
    ...overrides,
  });
}

export async function buildTeam(overrides: Record<string, unknown> = {}) {
  const id = nextId();
  return TeamModel.create({
    name: `Team ${id}`,
    slug: `team-${id}`,
    shortName: `T${id}`,
    primaryColor: "#ffffff",
    secondaryColor: "#000000",
    externalId: id,
    ...overrides,
  });
}

export async function buildPlayer(overrides: Record<string, unknown> = {}) {
  const id = nextId();
  return PlayerModel.create({
    name: `Player ${id}`,
    slug: `player-${id}`,
    shortName: `P${id}`,
    position: "forward",
    jerseyNumber: `${id % 99}`,
    externalId: id,
    ...overrides,
  });
}

export async function buildMatch(
  leagueId: Types.ObjectId | string,
  seasonId: Types.ObjectId | string,
  homeTeamId: Types.ObjectId | string,
  awayTeamId: Types.ObjectId | string,
  overrides: Record<string, unknown> = {}
) {
  const id = nextId();
  return MatchModel.create({
    leagueId: new Types.ObjectId(leagueId.toString()),
    seasonId: new Types.ObjectId(seasonId.toString()),
    homeTeamId: new Types.ObjectId(homeTeamId.toString()),
    awayTeamId: new Types.ObjectId(awayTeamId.toString()),
    date: new Date(),
    status: "finished",
    homeScore: 1,
    awayScore: 0,
    externalId: id,
    ...overrides,
  });
}

export async function buildShot(
  matchId: Types.ObjectId | string,
  playerId: Types.ObjectId | string,
  overrides: Record<string, unknown> = {}
) {
  const id = nextId();
  return ShotModel.create({
    xg: 0.1,
    xgot: 0.05,
    isHome: true,
    shotType: "save",
    situation: "regular",
    bodyPart: "right-foot",
    timeSeconds: id * 30,
    externalId: id,
    playerId: new Types.ObjectId(playerId.toString()),
    matchId: new Types.ObjectId(matchId.toString()),
    ...overrides,
  });
}

export async function buildShots(
  matchId: Types.ObjectId | string,
  count: number,
  overrides: Record<string, unknown> = {}
) {
  const shots = [];
  for (let i = 0; i < count; i++) {
    const player = await buildPlayer();
    shots.push(await buildShot(matchId, player._id, overrides));
  }
  return shots;
}

export async function buildMatchWithContext(
  overrides: { match?: Record<string, unknown> } = {}
) {
  const league = await buildLeague();
  const season = await buildSeason(league._id);
  const homeTeam = await buildTeam();
  const awayTeam = await buildTeam();
  const match = await buildMatch(
    league._id,
    season._id,
    homeTeam._id,
    awayTeam._id,
    overrides.match
  );
  return { league, season, homeTeam, awayTeam, match };
}

export async function buildSimulation(
  matchId: Types.ObjectId | string,
  overrides: Record<string, unknown> = {}
) {
  return SimulationModel.create({
    matchId: new Types.ObjectId(matchId.toString()),
    homeWinProbability: 0.5,
    drawProbability: 0.3,
    awayWinProbability: 0.2,
    xPtsHome: 1.8,
    xPtsAway: 0.9,
    scoreDistribution: [],
    playerStats: [],
    momentumTimeline: [],
    ...overrides,
  });
}

export async function buildChronicle(
  matchId: Types.ObjectId | string,
  overrides: Record<string, unknown> = {}
) {
  return ChronicleModel.create({
    matchId: new Types.ObjectId(matchId.toString()),
    kicker: "Crónica táctica",
    title: "Un partido inclinado por los detalles",
    summary:
      "La simulación anticipaba un duelo equilibrado y el marcador real terminó cerca de esa lectura. La secuencia de probabilidades marcó un giro en la segunda mitad.",
    sections: [
      {
        id: "pulse",
        title: "Inicio con tensión medida",
        paragraphs: [
          "El encuentro arrancó con una distribución de fuerzas relativamente abierta.",
          "La simulación detectó un partido largo antes de inclinarse con claridad.",
        ],
        quote: {
          text: "La historia se movió por márgenes pequeños.",
          attribution: "Mesa editorial SimuMatch",
        },
      },
      {
        id: "turning-point",
        title: "El giro del tramo medio",
        paragraphs: [
          "El punto de inflexión llegó cuando la probabilidad cambió con mayor violencia.",
          "A partir de ese momento el reparto de escenarios perdió equilibrio.",
        ],
      },
      {
        id: "closing",
        title: "Cierre acorde al guion",
        paragraphs: [
          "El desenlace confirmó parte de lo que venía enseñando la muestra simulada.",
          "La lectura final deja un partido competido pero no arbitrario.",
        ],
      },
    ],
    highlights: [
      { label: "Lectura", value: "Esperado", accent: "neutral" },
      { label: "Pulso", value: "Cambiante", accent: "home" },
      { label: "Riesgo", value: "Controlado", accent: "away" },
    ],
    keyStats: [
      {
        label: "Marcador real",
        value: "1-0",
        context: "Resultado compatible con los escenarios altos de la muestra.",
        accent: "home",
      },
      {
        label: "xPts local",
        value: "1.80",
        context: "La simulación mantuvo ventaja local en el agregado.",
        accent: "home",
      },
      {
        label: "Pico visitante",
        value: "28%",
        context:
          "El visitante tuvo fases, pero nunca dominó la lectura completa.",
        accent: "away",
      },
    ],
    timeline: [
      {
        minute: "12'",
        title: "Aviso inicial",
        description: "Primer cambio visible en el reparto de probabilidades.",
        accent: "neutral",
      },
      {
        minute: "48'",
        title: "Giro del modelo",
        description:
          "El sesgo del encuentro cambió con fuerza en el tramo medio.",
        accent: "home",
      },
      {
        minute: "82'",
        title: "Cierre del guion",
        description: "El último tramo consolidó la tendencia principal.",
        accent: "home",
      },
    ],
    author: "SimuMatch Editorial Desk",
    sourceLabel: "Simulation data chronicle",
    generatedAt: new Date().toISOString(),
    relatedSimulation: {
      homeWinProbability: 0.5,
      drawProbability: 0.3,
      awayWinProbability: 0.2,
      momentumTimeline: [
        {
          minute: 12,
          homeWinProbability: 0.45,
          drawProbability: 0.35,
          awayWinProbability: 0.2,
        },
      ],
      playerStats: [
        {
          playerId: new Types.ObjectId().toString(),
          playerName: "Player 1",
          playerShortName: "P1",
          isHome: true,
          goalProbability: 35,
          sga: 0.4,
        },
      ],
      scoreDistribution: [{ home: 1, away: 0, count: 1200, percentage: 12 }],
      xPtsHome: 1.8,
      xPtsAway: 0.9,
      homeTeam: "Team Home",
      awayTeam: "Team Away",
    },
    ...overrides,
  });
}

export function buildGeneratedChronicleContent(
  overrides: Partial<ChronicleGeneratedContent> = {}
): ChronicleGeneratedContent {
  return {
    kicker: "Crónica táctica",
    title: "Crónica de control local",
    summary:
      "La simulación sugería un partido equilibrado, pero el marcador real cayó del lado local tras un giro en la segunda mitad.",
    sections: [
      {
        id: "pulse",
        title: "Inicio vigilado",
        paragraphs: [
          "El arranque dejó más control que ruptura.",
          "La muestra tardó en inclinarse con claridad.",
        ],
        quote: {
          text: "Todo se decidió por pequeños desplazamientos.",
          attribution: "SimuMatch Editorial Desk",
        },
      },
      {
        id: "turning-point",
        title: "El giro clave",
        paragraphs: [
          "El punto de inflexión cambió la lectura del modelo.",
          "Desde ahí el local ganó terreno en los escenarios principales.",
        ],
      },
      {
        id: "closing",
        title: "Final consistente",
        paragraphs: [
          "El cierre sostuvo la ventaja prevista en la fase final.",
          "El desenlace encajó con parte de la distribución dominante.",
        ],
      },
    ],
    highlights: [
      { label: "Marcador", value: "Esperado", accent: "neutral" },
      { label: "Tramo", value: "Segundo tiempo", accent: "home" },
      { label: "Riesgo", value: "Moderado", accent: "away" },
    ],
    keyStats: [
      {
        label: "Escenario",
        value: "1-0",
        context: "Uno de los marcadores fuertes de la muestra.",
        accent: "home",
      },
      {
        label: "xPts",
        value: "1.80",
        context: "El local conservó mejor expectativa agregada.",
        accent: "home",
      },
      {
        label: "Pico visitante",
        value: "22%",
        context: "La amenaza visitante fue real, pero episódica.",
        accent: "away",
      },
    ],
    timeline: [
      {
        minute: "11'",
        title: "Fase de estudio",
        description: "Las probabilidades todavía no rompían el equilibrio.",
        accent: "neutral",
      },
      {
        minute: "54'",
        title: "Cambio de inercia",
        description: "El modelo empezó a empujar el relato hacia el local.",
        accent: "home",
      },
      {
        minute: "81'",
        title: "Cierre del pronóstico",
        description: "La tendencia final consolidó el escenario ganador.",
        accent: "home",
      },
    ],
    author: "SimuMatch Editorial Desk",
    sourceLabel: "Simulation data chronicle",
    generatedAt: "2026-03-10T10:00:00.000Z",
    ...overrides,
  };
}

export function buildGeneratedChronicle(
  generationContext: ChronicleGenerationContext,
  overrides: Partial<ChronicleGeneratedContent> = {}
): Chronicle {
  return Chronicle.createGenerated(
    generationContext,
    buildGeneratedChronicleContent(overrides)
  );
}

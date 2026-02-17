// src/infrastructure/repositories/fixtures/teams.fixture.ts
import { Team } from "@/domain/entities/team.entity";
import { Color } from "@/domain/value-objects/color.value";

export const TEAMS_BY_LEAGUE = {
  "La Liga": [
    new Team(
      "team-1",
      1,
      "Real Madrid",
      "real-madrid",
      "RMA",
      new Color("#FEBE10"),
      new Color("#00529F")
    ),
    new Team(
      "team-2",
      2,
      "Barcelona",
      "barcelona",
      "BAR",
      new Color("#A50044"),
      new Color("#004D98")
    ),
    new Team(
      "team-3",
      3,
      "Atlético Madrid",
      "atletico-madrid",
      "ATM",
      new Color("#CB3524"),
      new Color("#1B3D6D")
    ),
    new Team(
      "team-4",
      4,
      "Sevilla",
      "sevilla",
      "SEV",
      new Color("#F43333"),
      new Color("#FFFFFF")
    ),
    new Team(
      "team-5",
      5,
      "Valencia",
      "valencia",
      "VAL",
      new Color("#EE3424"),
      new Color("#000000")
    ),
    new Team(
      "team-6",
      6,
      "Villarreal",
      "villarreal",
      "VIL",
      new Color("#FFED02"),
      new Color("#005187")
    ),
    new Team(
      "team-7",
      7,
      "Real Sociedad",
      "real-sociedad",
      "RSO",
      new Color("#0050A5"),
      new Color("#FFFFFF")
    ),
    new Team(
      "team-8",
      8,
      "Athletic Club",
      "athletic-club",
      "ATH",
      new Color("#EE2523"),
      new Color("#FFFFFF")
    ),
  ],
  "Premier League": [
    new Team(
      "team-20",
      20,
      "Manchester City",
      "manchester-city",
      "MCI",
      new Color("#6CABDD"),
      new Color("#1C2C5B")
    ),
    new Team(
      "team-21",
      21,
      "Arsenal",
      "arsenal",
      "ARS",
      new Color("#EF0107"),
      new Color("#FFFFFF")
    ),
    new Team(
      "team-22",
      22,
      "Liverpool",
      "liverpool",
      "LIV",
      new Color("#C8102E"),
      new Color("#00B2A9")
    ),
    new Team(
      "team-23",
      23,
      "Chelsea",
      "chelsea",
      "CHE",
      new Color("#034694"),
      new Color("#DBA111")
    ),
    new Team(
      "team-24",
      24,
      "Manchester United",
      "manchester-united",
      "MUN",
      new Color("#DA291C"),
      new Color("#FBE122")
    ),
    new Team(
      "team-25",
      25,
      "Tottenham",
      "tottenham",
      "TOT",
      new Color("#132257"),
      new Color("#FFFFFF")
    ),
    new Team(
      "team-26",
      26,
      "Newcastle",
      "newcastle",
      "NEW",
      new Color("#241F20"),
      new Color("#FFFFFF")
    ),
    new Team(
      "team-27",
      27,
      "Aston Villa",
      "aston-villa",
      "AVL",
      new Color("#670E36"),
      new Color("#95BFE5")
    ),
  ],
  "Serie A": [
    new Team(
      "team-40",
      40,
      "Inter",
      "inter",
      "INT",
      new Color("#0068A8"),
      new Color("#000000")
    ),
    new Team(
      "team-41",
      41,
      "AC Milan",
      "ac-milan",
      "MIL",
      new Color("#FB090B"),
      new Color("#000000")
    ),
    new Team(
      "team-42",
      42,
      "Juventus",
      "juventus",
      "JUV",
      new Color("#000000"),
      new Color("#FFFFFF")
    ),
    new Team(
      "team-43",
      43,
      "Napoli",
      "napoli",
      "NAP",
      new Color("#00A7E1"),
      new Color("#FFFFFF")
    ),
    new Team(
      "team-44",
      44,
      "Roma",
      "roma",
      "ROM",
      new Color("#A50034"),
      new Color("#F7B500")
    ),
    new Team(
      "team-45",
      45,
      "Lazio",
      "lazio",
      "LAZ",
      new Color("#87CDEE"),
      new Color("#FFFFFF")
    ),
    new Team(
      "team-46",
      46,
      "Atalanta",
      "atalanta",
      "ATA",
      new Color("#1B1B1B"),
      new Color("#00529F")
    ),
    new Team(
      "team-47",
      47,
      "Fiorentina",
      "fiorentina",
      "FIO",
      new Color("#5B2B82"),
      new Color("#FFFFFF")
    ),
  ],
  Bundesliga: [
    new Team(
      "team-60",
      60,
      "Bayern Munich",
      "bayern-munich",
      "BAY",
      new Color("#DC052D"),
      new Color("#0066B2")
    ),
    new Team(
      "team-61",
      61,
      "Borussia Dortmund",
      "borussia-dortmund",
      "BVB",
      new Color("#FDE100"),
      new Color("#000000")
    ),
    new Team(
      "team-62",
      62,
      "RB Leipzig",
      "rb-leipzig",
      "RBL",
      new Color("#DD0741"),
      new Color("#FFFFFF")
    ),
    new Team(
      "team-63",
      63,
      "Bayer Leverkusen",
      "bayer-leverkusen",
      "B04",
      new Color("#E32221"),
      new Color("#000000")
    ),
    new Team(
      "team-64",
      64,
      "Union Berlin",
      "union-berlin",
      "FCU",
      new Color("#EB1923"),
      new Color("#F4CC14")
    ),
    new Team(
      "team-65",
      65,
      "Eintracht Frankfurt",
      "eintracht-frankfurt",
      "SGE",
      new Color("#E1000F"),
      new Color("#000000")
    ),
    new Team(
      "team-66",
      66,
      "Wolfsburg",
      "wolfsburg",
      "WOB",
      new Color("#65B32E"),
      new Color("#FFFFFF")
    ),
    new Team(
      "team-67",
      67,
      "Borussia M'gladbach",
      "borussia-mgladbach",
      "BMG",
      new Color("#000000"),
      new Color("#FFFFFF")
    ),
  ],
  "Ligue 1": [
    new Team(
      "team-80",
      80,
      "PSG",
      "psg",
      "PSG",
      new Color("#004170"),
      new Color("#DA291C")
    ),
    new Team(
      "team-81",
      81,
      "Marseille",
      "marseille",
      "OM",
      new Color("#2FAEE0"),
      new Color("#FFFFFF")
    ),
    new Team(
      "team-82",
      82,
      "Monaco",
      "monaco",
      "ASM",
      new Color("#E1000F"),
      new Color("#FFFFFF")
    ),
    new Team(
      "team-83",
      83,
      "Lyon",
      "lyon",
      "OL",
      new Color("#DA0812"),
      new Color("#004F9E")
    ),
    new Team(
      "team-84",
      84,
      "Lille",
      "lille",
      "LOSC",
      new Color("#CE0E2D"),
      new Color("#00305E")
    ),
    new Team(
      "team-85",
      85,
      "Lens",
      "lens",
      "RCL",
      new Color("#FFC300"),
      new Color("#CC0000")
    ),
    new Team(
      "team-86",
      86,
      "Nice",
      "nice",
      "OGCN",
      new Color("#ED1C24"),
      new Color("#000000")
    ),
    new Team(
      "team-87",
      87,
      "Rennes",
      "rennes",
      "SRF",
      new Color("#E30613"),
      new Color("#000000")
    ),
  ],
} as const;

export function getTeamsByLeague(leagueName: string): Team[] {
  return [
    ...(TEAMS_BY_LEAGUE[leagueName as keyof typeof TEAMS_BY_LEAGUE] || []),
  ];
}

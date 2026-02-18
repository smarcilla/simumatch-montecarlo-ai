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
      Color.create("#FEBE10"),
      Color.create("#00529F")
    ),
    new Team(
      "team-2",
      2,
      "Barcelona",
      "barcelona",
      "BAR",
      Color.create("#A50044"),
      Color.create("#004D98")
    ),
    new Team(
      "team-3",
      3,
      "Atlético Madrid",
      "atletico-madrid",
      "ATM",
      Color.create("#CB3524"),
      Color.create("#1B3D6D")
    ),
    new Team(
      "team-4",
      4,
      "Sevilla",
      "sevilla",
      "SEV",
      Color.create("#F43333"),
      Color.create("#FFFFFF")
    ),
    new Team(
      "team-5",
      5,
      "Valencia",
      "valencia",
      "VAL",
      Color.create("#EE3424"),
      Color.create("#000000")
    ),
    new Team(
      "team-6",
      6,
      "Villarreal",
      "villarreal",
      "VIL",
      Color.create("#FFED02"),
      Color.create("#005187")
    ),
    new Team(
      "team-7",
      7,
      "Real Sociedad",
      "real-sociedad",
      "RSO",
      Color.create("#0050A5"),
      Color.create("#FFFFFF")
    ),
    new Team(
      "team-8",
      8,
      "Athletic Club",
      "athletic-club",
      "ATH",
      Color.create("#EE2523"),
      Color.create("#FFFFFF")
    ),
  ],
  "Premier League": [
    new Team(
      "team-20",
      20,
      "Manchester City",
      "manchester-city",
      "MCI",
      Color.create("#6CABDD"),
      Color.create("#1C2C5B")
    ),
    new Team(
      "team-21",
      21,
      "Arsenal",
      "arsenal",
      "ARS",
      Color.create("#EF0107"),
      Color.create("#FFFFFF")
    ),
    new Team(
      "team-22",
      22,
      "Liverpool",
      "liverpool",
      "LIV",
      Color.create("#C8102E"),
      Color.create("#00B2A9")
    ),
    new Team(
      "team-23",
      23,
      "Chelsea",
      "chelsea",
      "CHE",
      Color.create("#034694"),
      Color.create("#DBA111")
    ),
    new Team(
      "team-24",
      24,
      "Manchester United",
      "manchester-united",
      "MUN",
      Color.create("#DA291C"),
      Color.create("#FBE122")
    ),
    new Team(
      "team-25",
      25,
      "Tottenham",
      "tottenham",
      "TOT",
      Color.create("#132257"),
      Color.create("#FFFFFF")
    ),
    new Team(
      "team-26",
      26,
      "Newcastle",
      "newcastle",
      "NEW",
      Color.create("#241F20"),
      Color.create("#FFFFFF")
    ),
    new Team(
      "team-27",
      27,
      "Aston Villa",
      "aston-villa",
      "AVL",
      Color.create("#670E36"),
      Color.create("#95BFE5")
    ),
  ],
  "Serie A": [
    new Team(
      "team-40",
      40,
      "Inter",
      "inter",
      "INT",
      Color.create("#0068A8"),
      Color.create("#000000")
    ),
    new Team(
      "team-41",
      41,
      "AC Milan",
      "ac-milan",
      "MIL",
      Color.create("#FB090B"),
      Color.create("#000000")
    ),
    new Team(
      "team-42",
      42,
      "Juventus",
      "juventus",
      "JUV",
      Color.create("#000000"),
      Color.create("#FFFFFF")
    ),
    new Team(
      "team-43",
      43,
      "Napoli",
      "napoli",
      "NAP",
      Color.create("#00A7E1"),
      Color.create("#FFFFFF")
    ),
    new Team(
      "team-44",
      44,
      "Roma",
      "roma",
      "ROM",
      Color.create("#A50034"),
      Color.create("#F7B500")
    ),
    new Team(
      "team-45",
      45,
      "Lazio",
      "lazio",
      "LAZ",
      Color.create("#87CDEE"),
      Color.create("#FFFFFF")
    ),
    new Team(
      "team-46",
      46,
      "Atalanta",
      "atalanta",
      "ATA",
      Color.create("#1B1B1B"),
      Color.create("#00529F")
    ),
    new Team(
      "team-47",
      47,
      "Fiorentina",
      "fiorentina",
      "FIO",
      Color.create("#5B2B82"),
      Color.create("#FFFFFF")
    ),
  ],
  Bundesliga: [
    new Team(
      "team-60",
      60,
      "Bayern Munich",
      "bayern-munich",
      "BAY",
      Color.create("#DC052D"),
      Color.create("#0066B2")
    ),
    new Team(
      "team-61",
      61,
      "Borussia Dortmund",
      "borussia-dortmund",
      "BVB",
      Color.create("#FDE100"),
      Color.create("#000000")
    ),
    new Team(
      "team-62",
      62,
      "RB Leipzig",
      "rb-leipzig",
      "RBL",
      Color.create("#DD0741"),
      Color.create("#FFFFFF")
    ),
    new Team(
      "team-63",
      63,
      "Bayer Leverkusen",
      "bayer-leverkusen",
      "B04",
      Color.create("#E32221"),
      Color.create("#000000")
    ),
    new Team(
      "team-64",
      64,
      "Union Berlin",
      "union-berlin",
      "FCU",
      Color.create("#EB1923"),
      Color.create("#F4CC14")
    ),
    new Team(
      "team-65",
      65,
      "Eintracht Frankfurt",
      "eintracht-frankfurt",
      "SGE",
      Color.create("#E1000F"),
      Color.create("#000000")
    ),
    new Team(
      "team-66",
      66,
      "Wolfsburg",
      "wolfsburg",
      "WOB",
      Color.create("#65B32E"),
      Color.create("#FFFFFF")
    ),
    new Team(
      "team-67",
      67,
      "Borussia M'gladbach",
      "borussia-mgladbach",
      "BMG",
      Color.create("#000000"),
      Color.create("#FFFFFF")
    ),
  ],
  "Ligue 1": [
    new Team(
      "team-80",
      80,
      "PSG",
      "psg",
      "PSG",
      Color.create("#004170"),
      Color.create("#DA291C")
    ),
    new Team(
      "team-81",
      81,
      "Marseille",
      "marseille",
      "OM",
      Color.create("#2FAEE0"),
      Color.create("#FFFFFF")
    ),
    new Team(
      "team-82",
      82,
      "Monaco",
      "monaco",
      "ASM",
      Color.create("#E1000F"),
      Color.create("#FFFFFF")
    ),
    new Team(
      "team-83",
      83,
      "Lyon",
      "lyon",
      "OL",
      Color.create("#DA0812"),
      Color.create("#004F9E")
    ),
    new Team(
      "team-84",
      84,
      "Lille",
      "lille",
      "LOSC",
      Color.create("#CE0E2D"),
      Color.create("#00305E")
    ),
    new Team(
      "team-85",
      85,
      "Lens",
      "lens",
      "RCL",
      Color.create("#FFC300"),
      Color.create("#CC0000")
    ),
    new Team(
      "team-86",
      86,
      "Nice",
      "nice",
      "OGCN",
      Color.create("#ED1C24"),
      Color.create("#000000")
    ),
    new Team(
      "team-87",
      87,
      "Rennes",
      "rennes",
      "SRF",
      Color.create("#E30613"),
      Color.create("#000000")
    ),
  ],
} as const;

export function getTeamsByLeague(leagueName: string): Team[] {
  return [
    ...(TEAMS_BY_LEAGUE[leagueName as keyof typeof TEAMS_BY_LEAGUE] || []),
  ];
}

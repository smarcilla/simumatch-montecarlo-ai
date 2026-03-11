import { z } from "genkit";

const AccentSchema = z.enum(["neutral", "home", "away"]);

const MomentumPointSchema = z.object({
  minute: z.number().int().min(0).max(130),
  homeWinProbability: z.number().min(0).max(1),
  drawProbability: z.number().min(0).max(1),
  awayWinProbability: z.number().min(0).max(1),
});

const PlayerStatSchema = z.object({
  playerId: z.string(),
  playerName: z.string(),
  playerShortName: z.string(),
  isHome: z.boolean(),
  goalProbability: z.number().min(0).max(100),
  sga: z.number(),
});

const ScoreDistributionSchema = z.object({
  home: z.number().int().min(0),
  away: z.number().int().min(0),
  count: z.number().int().min(0),
  percentage: z.number().min(0).max(100),
});

const QuoteSchema = z.object({
  text: z.string(),
  attribution: z.string(),
});

const SectionSchema = z.object({
  id: z.enum(["pulse", "turning-point", "closing"]),
  title: z.string(),
  paragraphs: z.array(z.string()).min(2).max(3),
  quote: QuoteSchema.optional(),
});

const HighlightSchema = z.object({
  label: z.string(),
  value: z.string(),
  accent: AccentSchema,
});

const KeyStatSchema = z.object({
  label: z.string(),
  value: z.string(),
  context: z.string(),
  accent: AccentSchema,
});

const TimelineEntrySchema = z.object({
  minute: z.string().regex(/^\d+'$/),
  title: z.string(),
  description: z.string(),
  accent: AccentSchema,
});

export const ChronicleInputSchema = z.object({
  matchId: z.string(),
  relatedSimulation: z.object({
    awayWinProbability: z.number().min(0).max(1),
    drawProbability: z.number().min(0).max(1),
    homeWinProbability: z.number().min(0).max(1),
    homeScore: z.number().int().min(0),
    awayScore: z.number().int().min(0),
    momentumTimeline: z.array(MomentumPointSchema),
    playerStats: z.array(PlayerStatSchema),
    scoreDistribution: z.array(ScoreDistributionSchema),
    xPtsAway: z.number().min(0),
    xPtsHome: z.number().min(0),
    homeTeam: z.string(),
    awayTeam: z.string(),
  }),
});

export const GeneratedChronicleSchema = z.object({
  kicker: z.string(),
  title: z.string(),
  summary: z.string(),
  sections: z.array(SectionSchema).length(3),
  highlights: z.array(HighlightSchema).length(3),
  keyStats: z.array(KeyStatSchema).length(3),
  timeline: z.array(TimelineEntrySchema).length(3),
  author: z.string(),
  sourceLabel: z.string(),
  generatedAt: z.string().datetime(),
});

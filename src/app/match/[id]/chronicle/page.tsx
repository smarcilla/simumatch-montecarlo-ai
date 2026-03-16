import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getMatchById } from "@/infrastructure/actions/match.actions";
import { getChronicleByMatchId } from "@/infrastructure/actions/simulation.actions";
import { DashboardLayout } from "@/infrastructure/ui/layout/DashboardLayout";
import { MatchDetailCard } from "@/infrastructure/ui/components/MatchDetailCard";
import {
  ChronicleAccent,
  ChronicleResult,
} from "@/application/results/chronicle.result";
import {
  MomentumPointData,
  ScoreDistributionItemData,
  SimulationPlayerStat,
} from "@/domain/entities/simulation.types";

interface ChroniclePageProps {
  params: Promise<{ id: string }>;
}

function getAccentClass(accent: ChronicleAccent): string {
  if (accent === "home") return "is-home";
  if (accent === "away") return "is-away";
  return "is-neutral";
}

function formatDate(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

function formatSignedNumber(value: number): string {
  if (value > 0) {
    return `+${value.toFixed(2)}`;
  }

  return value.toFixed(2);
}

function getTopPlayers(
  playerStats: SimulationPlayerStat[]
): SimulationPlayerStat[] {
  return [...playerStats]
    .sort((left, right) => right.goalProbability - left.goalProbability)
    .slice(0, 5);
}

function getTopScorelines(
  scoreDistribution: ScoreDistributionItemData[]
): ScoreDistributionItemData[] {
  return [...scoreDistribution]
    .sort((left, right) => right.percentage - left.percentage)
    .slice(0, 5);
}

interface MomentumInsight {
  label: string;
  minute: number;
  value: number;
  accent: ChronicleAccent;
  description: string;
}

function getMomentumInsights(
  timeline: MomentumPointData[],
  labels: {
    peakHome: string;
    peakHomeDescription: string;
    peakAway: string;
    peakAwayDescription: string;
    maxEquilibrium: string;
    maxEquilibriumDescription: string;
  }
): MomentumInsight[] {
  const [initialPoint, ...restOfTimeline] = timeline;

  if (!initialPoint) {
    return [];
  }

  const peakHome = restOfTimeline.reduce(
    (currentPeak, point) =>
      point.homeWinProbability > currentPeak.homeWinProbability
        ? point
        : currentPeak,
    initialPoint
  );

  const peakAway = restOfTimeline.reduce(
    (currentPeak, point) =>
      point.awayWinProbability > currentPeak.awayWinProbability
        ? point
        : currentPeak,
    initialPoint
  );

  const peakDraw = restOfTimeline.reduce(
    (currentPeak, point) =>
      point.drawProbability > currentPeak.drawProbability ? point : currentPeak,
    initialPoint
  );

  return [
    {
      label: labels.peakHome,
      minute: peakHome.minute,
      value: peakHome.homeWinProbability,
      accent: "home",
      description: labels.peakHomeDescription,
    },
    {
      label: labels.peakAway,
      minute: peakAway.minute,
      value: peakAway.awayWinProbability,
      accent: "away",
      description: labels.peakAwayDescription,
    },
    {
      label: labels.maxEquilibrium,
      minute: peakDraw.minute,
      value: peakDraw.drawProbability,
      accent: "neutral",
      description: labels.maxEquilibriumDescription,
    },
  ];
}

function getTeamName(
  chronicle: ChronicleResult,
  isHome: boolean,
  fallbackName: string
): string {
  if (!chronicle.relatedSimulation) {
    return fallbackName;
  }

  return isHome
    ? chronicle.relatedSimulation.homeTeam
    : chronicle.relatedSimulation.awayTeam;
}

interface TopScorer {
  playerShortName: string;
  goalProbability: string;
  home: ChronicleAccent;
}

interface MostLikelyScoreline {
  home: number;
  away: number;
  percentage: string;
}

interface ChronicleHeroProps {
  chronicle: ChronicleResult;
  matchHome: string;
  matchAway: string;
  mostLikelyScoreline: MostLikelyScoreline | null;
  topScorer: TopScorer | null;
  mostDecisivePulse: MomentumInsight | null;
  locale: string;
  labels: {
    dominantScore: string;
    percentOfSimulations: (v: string) => string;
    mainThreat: string;
    percentGoalProbability: (v: string) => string;
    peakTensionPoint: string;
    maxTilt: (v: string) => string;
    keyMoments: string;
  };
}

function ChronicleHero({
  chronicle,
  matchHome,
  matchAway,
  mostLikelyScoreline,
  topScorer,
  mostDecisivePulse,
  locale,
  labels,
}: Readonly<ChronicleHeroProps>) {
  return (
    <>
      <section className="chronicle-hero">
        <div className="chronicle-hero-copy">
          <span className="chronicle-kicker">{chronicle.kicker}</span>
          <h1 className="chronicle-title">{chronicle.title}</h1>
          <p className="chronicle-summary">{chronicle.summary}</p>
          <div className="chronicle-meta-list">
            <span>
              {matchHome} vs {matchAway}
            </span>
            <span>{chronicle.author}</span>
            <span>{chronicle.sourceLabel}</span>
            <span>{formatDate(chronicle.generatedAt, locale)}</span>
          </div>

          <div className="chronicle-hero-insights">
            {mostLikelyScoreline ? (
              <article className="chronicle-hero-insight is-neutral">
                <span className="chronicle-hero-insight-label">
                  {labels.dominantScore}
                </span>
                <strong className="chronicle-hero-insight-value">
                  {mostLikelyScoreline.home}-{mostLikelyScoreline.away}
                </strong>
                <p>
                  {labels.percentOfSimulations(mostLikelyScoreline.percentage)}
                </p>
              </article>
            ) : null}

            {topScorer ? (
              <article
                className={`chronicle-hero-insight ${getAccentClass(topScorer.home)}`}
              >
                <span className="chronicle-hero-insight-label">
                  {labels.mainThreat}
                </span>
                <strong className="chronicle-hero-insight-value">
                  {topScorer.playerShortName}
                </strong>
                <p>
                  {labels.percentGoalProbability(topScorer.goalProbability)}
                </p>
              </article>
            ) : null}

            {mostDecisivePulse ? (
              <article
                className={`chronicle-hero-insight ${getAccentClass(mostDecisivePulse.accent)}`}
              >
                <span className="chronicle-hero-insight-label">
                  {labels.peakTensionPoint}
                </span>
                <strong className="chronicle-hero-insight-value">
                  {`${mostDecisivePulse.minute}'`}
                </strong>
                <p>{labels.maxTilt(formatPercent(mostDecisivePulse.value))}</p>
              </article>
            ) : null}
          </div>
        </div>
      </section>

      <section className="chronicle-highlights" aria-label={labels.keyMoments}>
        {chronicle.highlights.map((highlight) => (
          <article
            key={`${highlight.label}-${highlight.value}`}
            className={`chronicle-highlight-card ${getAccentClass(highlight.accent)}`}
          >
            <span className="chronicle-highlight-label">{highlight.label}</span>
            <strong className="chronicle-highlight-value">
              {highlight.value}
            </strong>
          </article>
        ))}
      </section>
    </>
  );
}

interface ChronicleSidebarProps {
  chronicle: ChronicleResult;
  matchHome: string;
  matchAway: string;
  topPlayers: SimulationPlayerStat[];
  topScorelines: ScoreDistributionItemData[];
  momentumInsights: MomentumInsight[];
  labels: {
    readingKeys: string;
    simulationSupport: string;
    draw: string;
    modelEquilibriumWindow: string;
    offensiveThreats: string;
    goalLabel: (v: string) => string;
    mostLikelyScores: string;
    percentOfTotal: (v: string) => string;
    simulationCount: (count: number) => string;
    editorialTimeline: string;
  };
}

function ChronicleSidebar({
  chronicle,
  matchHome,
  matchAway,
  topPlayers,
  topScorelines,
  momentumInsights,
  labels,
}: Readonly<ChronicleSidebarProps>) {
  return (
    <aside className="chronicle-sidebar">
      <section className="chronicle-sidebar-card">
        <h2 className="chronicle-sidebar-title">{labels.readingKeys}</h2>
        <div className="chronicle-key-stats">
          {chronicle.keyStats.map((stat) => (
            <article
              key={`${stat.label}-${stat.value}`}
              className={`chronicle-key-stat ${getAccentClass(stat.accent)}`}
            >
              <span className="chronicle-key-stat-label">{stat.label}</span>
              <strong className="chronicle-key-stat-value">{stat.value}</strong>
              <p className="chronicle-key-stat-context">{stat.context}</p>
            </article>
          ))}
        </div>
      </section>

      {chronicle.relatedSimulation ? (
        <section className="chronicle-sidebar-card">
          <h2 className="chronicle-sidebar-title">
            {labels.simulationSupport}
          </h2>
          <div className="chronicle-simulation-grid">
            <article className="chronicle-simulation-item is-home">
              <span className="chronicle-simulation-label">
                {chronicle.relatedSimulation.homeTeam}
              </span>
              <strong>
                {formatPercent(chronicle.relatedSimulation.homeWinProbability)}
              </strong>
              <p>xPts {chronicle.relatedSimulation.xPtsHome.toFixed(2)}</p>
            </article>
            <article className="chronicle-simulation-item is-neutral">
              <span className="chronicle-simulation-label">{labels.draw}</span>
              <strong>
                {formatPercent(chronicle.relatedSimulation.drawProbability)}
              </strong>
              <p>{labels.modelEquilibriumWindow}</p>
            </article>
            <article className="chronicle-simulation-item is-away">
              <span className="chronicle-simulation-label">
                {chronicle.relatedSimulation.awayTeam}
              </span>
              <strong>
                {formatPercent(chronicle.relatedSimulation.awayWinProbability)}
              </strong>
              <p>xPts {chronicle.relatedSimulation.xPtsAway.toFixed(2)}</p>
            </article>
          </div>

          {momentumInsights.length > 0 ? (
            <div className="chronicle-momentum-list">
              {momentumInsights.map((insight) => (
                <article
                  key={`${insight.label}-${insight.minute}`}
                  className={`chronicle-momentum-item ${getAccentClass(insight.accent)}`}
                >
                  <div>
                    <span className="chronicle-key-stat-label">
                      {insight.label}
                    </span>
                    <strong className="chronicle-key-stat-value">
                      {`${insight.minute}'`}
                    </strong>
                  </div>
                  <div>
                    <p className="chronicle-key-stat-context">
                      {insight.description}
                    </p>
                    <p className="chronicle-momentum-value">
                      {formatPercent(insight.value)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {topPlayers.length > 0 ? (
        <section className="chronicle-sidebar-card">
          <h2 className="chronicle-sidebar-title">{labels.offensiveThreats}</h2>
          <div className="chronicle-player-list">
            {topPlayers.map((player) => (
              <article
                key={player.playerId}
                className={`chronicle-player-row ${getAccentClass(player.isHome ? "home" : "away")}`}
              >
                <div className="chronicle-player-copy">
                  <strong>{player.playerShortName}</strong>
                  <span className="chronicle-player-team">
                    {getTeamName(
                      chronicle,
                      player.isHome,
                      player.isHome ? matchHome : matchAway
                    )}
                  </span>
                </div>
                <div className="chronicle-player-metrics">
                  <span className="chronicle-player-metric">
                    {labels.goalLabel(player.goalProbability.toFixed(2) + "%")}
                  </span>
                  <span className="chronicle-player-metric">
                    SGA {formatSignedNumber(player.sga)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {topScorelines.length > 0 ? (
        <section className="chronicle-sidebar-card">
          <h2 className="chronicle-sidebar-title">{labels.mostLikelyScores}</h2>
          <div className="chronicle-score-list">
            {topScorelines.map((scoreline) => (
              <article
                key={`${scoreline.home}-${scoreline.away}-${scoreline.count}`}
                className="chronicle-score-row"
              >
                <strong className="chronicle-score-badge">
                  {scoreline.home}-{scoreline.away}
                </strong>
                <div className="chronicle-score-copy">
                  <span>
                    {labels.percentOfTotal(scoreline.percentage.toFixed(2))}
                  </span>
                  <p>{labels.simulationCount(scoreline.count)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="chronicle-sidebar-card">
        <h2 className="chronicle-sidebar-title">{labels.editorialTimeline}</h2>
        <div className="chronicle-timeline">
          {chronicle.timeline.map((item) => (
            <article
              key={`${item.minute}-${item.title}`}
              className={`chronicle-timeline-item ${getAccentClass(item.accent)}`}
            >
              <span className="chronicle-timeline-minute">{item.minute}</span>
              <div className="chronicle-timeline-copy">
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </aside>
  );
}

function renderSections(chronicle: ChronicleResult) {
  return chronicle.sections.map((section) => (
    <section key={section.id} className="chronicle-article-section">
      <h2 className="chronicle-article-title">{section.title}</h2>
      <div className="chronicle-article-body">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {section.quote ? (
        <blockquote className="chronicle-quote">
          <p>{section.quote.text}</p>
          <footer>{section.quote.attribution}</footer>
        </blockquote>
      ) : null}
    </section>
  ));
}

export default async function ChroniclePage({
  params,
}: Readonly<ChroniclePageProps>) {
  const { id } = await params;

  const [match, chronicle] = await Promise.all([
    getMatchById(id),
    getChronicleByMatchId(id),
  ]);

  if (!match) {
    notFound();
  }

  if (!chronicle) {
    redirect(`/match/${id}`);
  }

  const [t, tCommon, locale] = await Promise.all([
    getTranslations("chronicle"),
    getTranslations("common"),
    getLocale(),
  ]);

  const topPlayers = chronicle.relatedSimulation
    ? getTopPlayers(chronicle.relatedSimulation.playerStats)
    : [];
  const topScorelines = chronicle.relatedSimulation
    ? getTopScorelines(chronicle.relatedSimulation.scoreDistribution)
    : [];
  const momentumInsights = chronicle.relatedSimulation
    ? getMomentumInsights(chronicle.relatedSimulation.momentumTimeline, {
        peakHome: t("peakHome"),
        peakHomeDescription: t("peakHomeDescription"),
        peakAway: t("peakAway"),
        peakAwayDescription: t("peakAwayDescription"),
        maxEquilibrium: t("maxEquilibrium"),
        maxEquilibriumDescription: t("maxEquilibriumDescription"),
      })
    : [];
  const topScorer: TopScorer | null = topPlayers[0]
    ? {
        playerShortName: topPlayers[0].playerShortName,
        goalProbability: topPlayers[0].goalProbability.toFixed(2),
        home: (topPlayers[0].isHome ? "home" : "away") as ChronicleAccent,
      }
    : null;
  const mostLikelyScoreline: MostLikelyScoreline | null = topScorelines[0]
    ? {
        home: topScorelines[0].home,
        away: topScorelines[0].away,
        percentage: topScorelines[0].percentage.toFixed(2),
      }
    : null;
  const mostDecisivePulse =
    [...momentumInsights].sort((left, right) => right.value - left.value)[0] ??
    null;

  return (
    <DashboardLayout>
      <div
        className="chronicle-page"
        style={
          {
            "--team-home-primary": match.homeColorPrimary,
            "--team-home-secondary": match.homeColorSecondary,
            "--team-away-primary": match.awayColorPrimary,
            "--team-away-secondary": match.awayColorSecondary,
          } as React.CSSProperties
        }
      >
        <Link href={`/match/${id}`} className="match-detail-back">
          {tCommon("backToMatch")}
        </Link>

        <MatchDetailCard match={match} />

        <ChronicleHero
          chronicle={chronicle}
          matchHome={match.home}
          matchAway={match.away}
          mostLikelyScoreline={mostLikelyScoreline}
          topScorer={topScorer}
          mostDecisivePulse={mostDecisivePulse}
          locale={locale}
          labels={{
            dominantScore: t("dominantScore"),
            percentOfSimulations: (v: string) =>
              t("percentOfSimulations", { value: v }),
            mainThreat: t("mainThreat"),
            percentGoalProbability: (v: string) =>
              t("percentGoalProbability", { value: v }),
            peakTensionPoint: t("peakTensionPoint"),
            maxTilt: (v: string) => t("maxTilt", { value: v }),
            keyMoments: t("keyMoments"),
          }}
        />

        <div className="chronicle-content-grid">
          <article className="chronicle-article">
            {renderSections(chronicle)}
          </article>

          <ChronicleSidebar
            chronicle={chronicle}
            matchHome={match.home}
            matchAway={match.away}
            topPlayers={topPlayers}
            topScorelines={topScorelines}
            momentumInsights={momentumInsights}
            labels={{
              readingKeys: t("readingKeys"),
              simulationSupport: t("simulationSupport"),
              draw: tCommon("draw"),
              modelEquilibriumWindow: t("modelEquilibriumWindow"),
              offensiveThreats: t("offensiveThreats"),
              goalLabel: (v: string) => t("goalLabel", { value: v }),
              mostLikelyScores: t("mostLikelyScores"),
              percentOfTotal: (v: string) => t("percentOfTotal", { value: v }),
              simulationCount: (count: number) =>
                t("simulationCount", { count }),
              editorialTimeline: t("editorialTimeline"),
            }}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

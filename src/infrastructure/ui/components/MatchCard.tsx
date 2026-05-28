"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { FindMatchByLeagueAndSeasonResult } from "@/application/results/find-matches-by-league-and-season.result";
import { TeamBadge } from "@/infrastructure/ui/components/TeamBadge";

const STATUS_KEYS: Record<string, string> = {
  finished: "finished",
  simulated: "simulated",
  chronicle_generated: "chronicle_generated",
};

interface MatchCardProps {
  readonly match: FindMatchByLeagueAndSeasonResult;
}

function getCompactShortName(shortName: string, fallbackName: string): string {
  const normalizedShortName = shortName.trim();
  if (normalizedShortName.length > 0) {
    return normalizedShortName.slice(0, 3);
  }
  return fallbackName.trim().slice(0, 3);
}

export function MatchCard({ match }: MatchCardProps) {
  const [tooltip, setTooltip] = useState<string | null>(null);
  const t = useTranslations("match.status");
  const locale = useLocale();
  const homeCompactShortName = getCompactShortName(
    match.homeShortName,
    match.home
  );
  const awayCompactShortName = getCompactShortName(
    match.awayShortName,
    match.away
  );

  return (
    <Link href={`/match/${match.id}`} className="match-card-link">
      <div
        className="match-card"
        style={
          {
            "--team-home-primary": match.homeColorPrimary,
            "--team-home-secondary": match.homeColorSecondary,
            "--team-away-primary": match.awayColorPrimary,
            "--team-away-secondary": match.awayColorSecondary,
          } as React.CSSProperties
        }
      >
        <div className="match-teams">
          <div className="team-side home">
            <TeamBadge
              primary={match.homeColorPrimary}
              secondary={match.homeColorSecondary}
              teamName={match.home}
              flagUrl={match.homeFlag}
            />
            <button
              className="team-name"
              aria-label={match.home}
              onMouseEnter={() => setTooltip(match.home)}
              onMouseLeave={() => setTooltip(null)}
              onFocus={() => setTooltip(match.home)}
              onBlur={() => setTooltip(null)}
              onTouchStart={() => setTooltip(match.home)}
              onTouchEnd={() => setTooltip(null)}
            >
              <span className="team-name-full">{match.home}</span>
              <span className="team-name-short">{homeCompactShortName}</span>
            </button>
            {tooltip === match.home && (
              <div className="team-tooltip">{match.home}</div>
            )}
          </div>

          <div className="match-score">
            <span className="score-number">{match.homeScore}</span>
            <span className="score-separator">-</span>
            <span className="score-number">{match.awayScore}</span>
          </div>

          <div className="team-side away">
            <button
              className="team-name"
              aria-label={match.away}
              onMouseEnter={() => setTooltip(match.away)}
              onMouseLeave={() => setTooltip(null)}
              onFocus={() => setTooltip(match.away)}
              onBlur={() => setTooltip(null)}
              onTouchStart={() => setTooltip(match.away)}
              onTouchEnd={() => setTooltip(null)}
            >
              <span className="team-name-full">{match.away}</span>
              <span className="team-name-short">{awayCompactShortName}</span>
            </button>
            {tooltip === match.away && (
              <div className="team-tooltip">{match.away}</div>
            )}
            <TeamBadge
              primary={match.awayColorPrimary}
              secondary={match.awayColorSecondary}
              teamName={match.away}
              flagUrl={match.awayFlag}
            />
          </div>
        </div>

        <div className="match-footer">
          <span className="match-date">
            {new Date(match.date).toLocaleDateString(locale, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="match-status">
            {STATUS_KEYS[match.status]
              ? t(STATUS_KEYS[match.status]!)
              : match.status}
          </span>
        </div>
      </div>
    </Link>
  );
}

"use client";

import { useLocale, useTranslations } from "next-intl";
import { FindMatchByIdResult } from "@/application/results/find-match-by-id.result";
import { TeamBadge } from "@/infrastructure/ui/components/TeamBadge";

const STATUS_KEYS: Record<string, string> = {
  finished: "finished",
  simulated: "simulated",
  chronicle_generated: "chronicle_generated",
};

interface MatchDetailCardProps {
  readonly match: FindMatchByIdResult;
}

export function MatchDetailCard({ match }: MatchDetailCardProps) {
  const t = useTranslations("match.status");
  const locale = useLocale();

  return (
    <div
      className="match-detail-card"
      style={
        {
          "--team-home-primary": match.homeColorPrimary,
          "--team-home-secondary": match.homeColorSecondary,
          "--team-away-primary": match.awayColorPrimary,
          "--team-away-secondary": match.awayColorSecondary,
        } as React.CSSProperties
      }
    >
      <div className="match-detail-teams">
        <div className="match-detail-team home">
          <TeamBadge
            primary={match.homeColorPrimary}
            secondary={match.homeColorSecondary}
            teamName={match.home}
            flagUrl={match.homeFlag}
            size="detail"
          />
          <span className="match-detail-team-name">
            <span className="team-name-full">{match.home}</span>
            <span className="team-name-short">{match.homeShortName}</span>
          </span>
        </div>

        <div className="match-detail-score">
          <span className="match-detail-score-number">{match.homeScore}</span>
          <span className="match-detail-score-separator">-</span>
          <span className="match-detail-score-number">{match.awayScore}</span>
        </div>

        <div className="match-detail-team away">
          <TeamBadge
            primary={match.awayColorPrimary}
            secondary={match.awayColorSecondary}
            teamName={match.away}
            flagUrl={match.awayFlag}
            size="detail"
          />
          <span className="match-detail-team-name">
            <span className="team-name-full">{match.away}</span>
            <span className="team-name-short">{match.awayShortName}</span>
          </span>
        </div>
      </div>

      <div className="match-detail-footer">
        <span className="match-detail-date">
          {new Date(match.date).toLocaleDateString(locale, {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
        <span className="match-detail-status">
          {STATUS_KEYS[match.status]
            ? t(STATUS_KEYS[match.status]!)
            : match.status}
        </span>
      </div>
    </div>
  );
}

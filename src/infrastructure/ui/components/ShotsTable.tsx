"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { FindShotResult } from "@/application/results/find-shots-by-match.result";

import { getShotsByMatch } from "@/infrastructure/actions/match.actions";
import { ShotTypeValue } from "@/domain/value-objects/shot-type.value";
import { ShotSituationValue } from "@/domain/value-objects/shot-situation.value";
import { createFindShotsByMatchCommand } from "@/infrastructure/mappers/find-shots-by-match.mapper";
import {
  BodyPartIcon,
  SituationIcon,
  ShotTypeIcon,
  TableTeamShield,
} from "@/infrastructure/ui/components/ShotIcons";
import { PaginatedResult } from "@/domain/types/pagination";

const SHOT_TYPE_KEYS: ShotTypeValue[] = [
  "goal",
  "save",
  "miss",
  "block",
  "post",
];
const SITUATION_KEYS: ShotSituationValue[] = [
  "regular",
  "assisted",
  "corner",
  "penalty",
  "set-piece",
  "free-kick",
  "throw-in-set-piece",
  "fast-break",
];

interface ShotsTableProps {
  readonly matchId: string;
  readonly initialData: PaginatedResult<FindShotResult>;
  readonly homeTeam: string;
  readonly awayTeam: string;
  readonly homeColor: string;
  readonly awayColor: string;
  readonly homeColorSecondary: string;
  readonly awayColorSecondary: string;
}

export function ShotsTable({
  matchId,
  initialData,
  homeTeam,
  awayTeam,
  homeColor,
  awayColor,
  homeColorSecondary,
  awayColorSecondary,
}: ShotsTableProps) {
  const [data, setData] =
    useState<PaginatedResult<FindShotResult>>(initialData);
  const [shotTypesFilter, setShotTypesFilter] = useState("");
  const [situationsFilter, setSituationsFilter] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [sortBy, setSortBy] = useState<"timeSeconds" | "xg">("timeSeconds");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isPending, startTransition] = useTransition();
  const tShots = useTranslations("shots");
  const tFilters = useTranslations("filters");

  const fetchPage = (
    page: number,
    overrides?: {
      shotTypesFilter?: string;
      situationsFilter?: string;
      teamFilter?: string;
      sortBy?: "timeSeconds" | "xg";
      sortOrder?: "asc" | "desc";
    }
  ) => {
    const st = overrides?.shotTypesFilter ?? shotTypesFilter;
    const sit = overrides?.situationsFilter ?? situationsFilter;
    const team = overrides?.teamFilter ?? teamFilter;
    const sb = overrides?.sortBy ?? sortBy;
    const so = overrides?.sortOrder ?? sortOrder;

    startTransition(async () => {
      const result = await getShotsByMatch(
        createFindShotsByMatchCommand(
          matchId,
          { page, pageSize: 20 },
          st || undefined,
          sit || undefined,
          team || undefined,
          sb,
          so
        )
      );
      setData(result);
    });
  };

  const handleFilterChange =
    (
      setter: React.Dispatch<React.SetStateAction<string>>,
      key: "shotTypesFilter" | "situationsFilter" | "teamFilter"
    ) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setter(e.target.value);
      fetchPage(0, { [key]: e.target.value });
    };

  const handleSortChange = (field: "timeSeconds" | "xg") => {
    const newOrder = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(field);
    setSortOrder(newOrder);
    fetchPage(0, { sortBy: field, sortOrder: newOrder });
  };

  const formatMinute = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    return `${min}'`;
  };

  const shotTypesOptions = SHOT_TYPE_KEYS.map((t) => ({
    value: t,
    label: tShots(`shotType.${t}`),
  }));
  const situationsOptions = SITUATION_KEYS.map((s) => ({
    value: s,
    label: tShots(`situation.${s}`),
  }));

  return (
    <div className="shots-section">
      <div className="shots-filters">
        <div className="filter-group">
          <label className="filter-label" htmlFor="shots-type-filter">
            {tFilters("result")}
          </label>
          <select
            id="shots-type-filter"
            className="filter-select"
            value={shotTypesFilter}
            onChange={handleFilterChange(setShotTypesFilter, "shotTypesFilter")}
          >
            <option value="">{tFilters("all")}</option>
            {shotTypesOptions.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label" htmlFor="shots-situation-filter">
            {tFilters("situation")}
          </label>
          <select
            id="shots-situation-filter"
            className="filter-select"
            value={situationsFilter}
            onChange={handleFilterChange(
              setSituationsFilter,
              "situationsFilter"
            )}
          >
            <option value="">{tFilters("allFeminine")}</option>
            {situationsOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label" htmlFor="shots-team-filter">
            {tFilters("team")}
          </label>
          <select
            id="shots-team-filter"
            className="filter-select"
            value={teamFilter}
            onChange={handleFilterChange(setTeamFilter, "teamFilter")}
          >
            <option value="">{tFilters("both")}</option>
            <option value="true">{homeTeam}</option>
            <option value="false">{awayTeam}</option>
          </select>
        </div>
      </div>

      <div
        className={`shots-table-wrapper${isPending ? " shots-loading" : ""}`}
      >
        <table className="shots-table">
          <thead>
            <tr>
              <th
                className="shots-th shots-th-sortable"
                onClick={() => handleSortChange("timeSeconds")}
              >
                {tShots("tableHeaders.player")}
                {sortBy === "timeSeconds" && (
                  <span className="shots-sort-icon">
                    {sortOrder === "asc" ? " ↑" : " ↓"}
                  </span>
                )}
              </th>
              <th className="shots-th">{tShots("tableHeaders.team")}</th>
              <th className="shots-th">{tShots("tableHeaders.situation")}</th>
              <th
                className="shots-th shots-th-sortable shots-th-right"
                onClick={() => handleSortChange("xg")}
              >
                xG
                {sortBy === "xg" && (
                  <span className="shots-sort-icon">
                    {sortOrder === "asc" ? " ↑" : " ↓"}
                  </span>
                )}
              </th>
              <th className="shots-th">{tShots("tableHeaders.resultShort")}</th>
            </tr>
          </thead>
          <tbody>
            {data.results.length === 0 ? (
              <tr>
                <td colSpan={5} className="shots-empty">
                  {tShots("noShotsFound")}
                </td>
              </tr>
            ) : (
              data.results.map((shot) => (
                <tr
                  key={shot.id}
                  className={`shots-row shots-row-${shot.shotType}`}
                >
                  <td className="shots-td">
                    <span className="shots-player">{shot.playerShortName}</span>
                    <span className="shots-td-sub">
                      {formatMinute(shot.timeSeconds)}
                    </span>
                  </td>
                  <td className="shots-td">
                    <TableTeamShield
                      primary={shot.isHome ? homeColor : awayColor}
                      secondary={
                        shot.isHome ? homeColorSecondary : awayColorSecondary
                      }
                      name={shot.isHome ? homeTeam : awayTeam}
                    />
                    <span className="shots-td-sub">
                      <BodyPartIcon
                        value={shot.bodyPart}
                        label={tShots(`bodyPart.${shot.bodyPart}`)}
                      />
                    </span>
                  </td>
                  <td className="shots-td">
                    <SituationIcon
                      value={shot.situation}
                      label={tShots(`situation.${shot.situation}`)}
                    />
                  </td>
                  <td className="shots-td shots-td-number">
                    <span>{shot.xg.toFixed(2)}</span>
                    <span className="shots-td-sub">
                      {shot.xgot > 0 ? shot.xgot.toFixed(2) : "—"}
                    </span>
                  </td>
                  <td className="shots-td">
                    <span
                      className={`shots-type-badge shots-type-${shot.shotType}`}
                    >
                      <ShotTypeIcon
                        value={shot.shotType}
                        label={tShots(`shotType.${shot.shotType}`)}
                      />
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data.totalPages > 1 && (
        <div className="shots-pagination">
          <button
            className="shots-page-btn"
            disabled={!data.hasPreviousPage || isPending}
            onClick={() => fetchPage(data.page - 1)}
          >
            {tShots("previous")}
          </button>
          <span className="shots-page-info">
            {data.page + 1} / {data.totalPages}
          </span>
          <button
            className="shots-page-btn"
            disabled={!data.hasNextPage || isPending}
            onClick={() => fetchPage(data.page + 1)}
          >
            {tShots("next")}
          </button>
        </div>
      )}
    </div>
  );
}

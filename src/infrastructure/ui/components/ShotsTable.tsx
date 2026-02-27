"use client";

import { useState, useTransition } from "react";
import { FindShotResult } from "@/application/results/find-shots-by-match.result";
import { PaginatedResult } from "@/application/results/paginated.result";
import { getShotsByMatch } from "@/infrastructure/actions/match.actions";
import { ShotTypeValue } from "@/domain/value-objects/shot-type.value";
import { ShotSituationValue } from "@/domain/value-objects/shot-situation.value";
import { createFindShotsByMatchCommand } from "@/application/commands/find-shots-by-match.command";

const SHOT_TYPE_LABELS: Record<ShotTypeValue, string> = {
  goal: "Gol",
  save: "Parada",
  miss: "Fuera",
  block: "Bloqueado",
  post: "Poste",
};

const SITUATION_LABELS: Record<ShotSituationValue, string> = {
  regular: "Jugada",
  assisted: "Asistido",
  corner: "Córner",
  penalty: "Penalti",
  "set-piece": "Balón parado",
  "free-kick": "Falta",
  "throw-in-set-piece": "Saque lateral",
  "fast-break": "Contragolpe",
};

const BODY_PART_LABELS: Record<string, string> = {
  head: "Cabeza",
  "left-foot": "Pie izq.",
  "right-foot": "Pie der.",
  other: "Otro",
};

interface ShotsTableProps {
  readonly matchId: string;
  readonly initialData: PaginatedResult<FindShotResult>;
  readonly homeTeam: string;
  readonly awayTeam: string;
}

export function ShotsTable({
  matchId,
  initialData,
  homeTeam,
  awayTeam,
}: ShotsTableProps) {
  const [data, setData] =
    useState<PaginatedResult<FindShotResult>>(initialData);
  const [shotTypesFilter, setShotTypesFilter] = useState("");
  const [situationsFilter, setSituationsFilter] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [sortBy, setSortBy] = useState<"timeSeconds" | "xg">("timeSeconds");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isPending, startTransition] = useTransition();

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

  return (
    <div className="shots-section">
      <div className="shots-filters">
        <div className="filter-group">
          <label className="filter-label" htmlFor="shots-type-filter">
            Resultado
          </label>
          <select
            id="shots-type-filter"
            className="filter-select"
            value={shotTypesFilter}
            onChange={handleFilterChange(setShotTypesFilter, "shotTypesFilter")}
          >
            <option value="">Todos</option>
            {(Object.keys(SHOT_TYPE_LABELS) as ShotTypeValue[]).map((t) => (
              <option key={t} value={t}>
                {SHOT_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label" htmlFor="shots-situation-filter">
            Situación
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
            <option value="">Todas</option>
            {(Object.keys(SITUATION_LABELS) as ShotSituationValue[]).map(
              (s) => (
                <option key={s} value={s}>
                  {SITUATION_LABELS[s]}
                </option>
              )
            )}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label" htmlFor="shots-team-filter">
            Equipo
          </label>
          <select
            id="shots-team-filter"
            className="filter-select"
            value={teamFilter}
            onChange={handleFilterChange(setTeamFilter, "teamFilter")}
          >
            <option value="">Ambos</option>
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
                Jugador
                {sortBy === "timeSeconds" && (
                  <span className="shots-sort-icon">
                    {sortOrder === "asc" ? " ↑" : " ↓"}
                  </span>
                )}
              </th>
              <th className="shots-th">Equipo</th>
              <th className="shots-th">Situación</th>
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
              <th className="shots-th">Res.</th>
            </tr>
          </thead>
          <tbody>
            {data.results.length === 0 ? (
              <tr>
                <td colSpan={5} className="shots-empty">
                  No hay disparos con los filtros aplicados
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
                    <span
                      className={`shots-team-badge shots-team-badge-${shot.isHome ? "home" : "away"}`}
                    >
                      {shot.isHome ? homeTeam : awayTeam}
                    </span>
                    <span className="shots-td-sub">
                      {BODY_PART_LABELS[shot.bodyPart] ?? shot.bodyPart}
                    </span>
                  </td>
                  <td className="shots-td">
                    {SITUATION_LABELS[shot.situation]}
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
                      {SHOT_TYPE_LABELS[shot.shotType]}
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
            Anterior
          </button>
          <span className="shots-page-info">
            {data.page + 1} / {data.totalPages}
          </span>
          <button
            className="shots-page-btn"
            disabled={!data.hasNextPage || isPending}
            onClick={() => fetchPage(data.page + 1)}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}

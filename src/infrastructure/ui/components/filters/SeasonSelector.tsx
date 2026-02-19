"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SeasonResult } from "@/application/results/find-leagues.result";

interface SeasonSelectorProps {
  readonly seasons: SeasonResult[];
  readonly currentSeasonId: string;
}

export function SeasonSelector({
  seasons,
  currentSeasonId,
}: SeasonSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSeasonId = e.target.value;
    const params = new URLSearchParams(searchParams);

    params.set("season", selectedSeasonId);
    params.set("page", "0");
    params.delete("statuses");
    params.delete("dateFrom");
    params.delete("dateTo");

    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="filter-group">
      <label htmlFor="season-selector" className="filter-label">
        Temporada
      </label>
      <select
        id="season-selector"
        className="filter-select"
        value={currentSeasonId}
        onChange={handleChange}
      >
        {seasons.map((season) => (
          <option key={season.id} value={season.id}>
            {season.year}
          </option>
        ))}
      </select>
    </div>
  );
}

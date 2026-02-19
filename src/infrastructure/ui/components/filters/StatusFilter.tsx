"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { MatchStatusValue } from "@/domain/value-objects/match-status.value";

const STATUS_LABELS: Record<MatchStatusValue, string> = {
  finished: "Finalizado",
  simulated: "Simulado",
  chronicle_generated: "Crónica generada",
};

const ALL_STATUSES: MatchStatusValue[] = [
  "finished",
  "simulated",
  "chronicle_generated",
];

export function StatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusesParam = searchParams.get("statuses") ?? "";
  const selectedStatuses = statusesParam
    ? statusesParam.split(",").filter(Boolean)
    : [];

  const handleChange = (status: MatchStatusValue, checked: boolean) => {
    const params = new URLSearchParams(searchParams);
    const updated = checked
      ? [...selectedStatuses, status]
      : selectedStatuses.filter((s) => s !== status);

    if (updated.length > 0) {
      params.set("statuses", updated.join(","));
    } else {
      params.delete("statuses");
    }
    params.set("page", "0");
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="filter-group">
      <span className="filter-label">Estado</span>
      <div className="filter-checkbox-group">
        {ALL_STATUSES.map((status) => (
          <label key={status} className="filter-checkbox-item">
            <input
              type="checkbox"
              value={status}
              checked={selectedStatuses.includes(status)}
              onChange={(e) => handleChange(status, e.target.checked)}
            />
            <span>{STATUS_LABELS[status]}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

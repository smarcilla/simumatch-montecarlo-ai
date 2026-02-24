"use client";

import { useState } from "react";
import { FindMatchByIdResult } from "@/application/results/find-match-by-id.result";
import {
  simulateMatch,
  viewSimulation,
  writeChronicle,
  readChronicle,
} from "@/infrastructure/actions/simulation.actions";

interface MatchActionsPanelProps {
  readonly match: FindMatchByIdResult;
}

export function MatchActionsPanel({ match }: MatchActionsPanelProps) {
  const [isPending, setIsPending] = useState(false);
  const { id, status } = match;

  const handleAction = async (action: (id: string) => Promise<void>) => {
    setIsPending(true);
    try {
      await action(id);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="match-actions-panel">
      {status === "finished" && (
        <button
          className="match-action-btn primary"
          disabled={isPending}
          onClick={() => handleAction(simulateMatch)}
        >
          {isPending ? "Procesando..." : "Simular partido"}
        </button>
      )}

      {(status === "simulated" || status === "chronicle_generated") && (
        <button
          className="match-action-btn secondary"
          disabled={isPending}
          onClick={() => handleAction(viewSimulation)}
        >
          {isPending ? "Procesando..." : "Ver simulación"}
        </button>
      )}

      {status === "simulated" && (
        <button
          className="match-action-btn secondary"
          disabled={isPending}
          onClick={() => handleAction(writeChronicle)}
        >
          {isPending ? "Procesando..." : "Escribir crónica"}
        </button>
      )}

      {status === "chronicle_generated" && (
        <button
          className="match-action-btn secondary"
          disabled={isPending}
          onClick={() => handleAction(readChronicle)}
        >
          {isPending ? "Procesando..." : "Leer crónica"}
        </button>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FindMatchByIdResult } from "@/application/results/find-match-by-id.result";
import {
  simulateMatch,
  writeChronicle,
} from "@/infrastructure/actions/simulation.actions";

interface MatchActionsPanelProps {
  readonly match: FindMatchByIdResult;
}

export function MatchActionsPanel({ match }: MatchActionsPanelProps) {
  const [isPending, setIsPending] = useState(false);
  const { id, status } = match;
  const router = useRouter();
  const t = useTranslations("match.actions");
  const tCommon = useTranslations("common");

  const handleAction = async (action: (id: string) => Promise<unknown>) => {
    setIsPending(true);
    try {
      await action(id);
      router.refresh();
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
          {isPending ? tCommon("processing") : t("simulate")}
        </button>
      )}

      {(status === "simulated" || status === "chronicle_generated") && (
        <button
          className="match-action-btn secondary"
          disabled={isPending}
          onClick={() => router.push(`/match/${id}/simulation`)}
        >
          {t("viewSimulation")}
        </button>
      )}

      {status === "simulated" && (
        <button
          className="match-action-btn secondary"
          disabled={isPending}
          onClick={() => handleAction(writeChronicle)}
        >
          {isPending ? tCommon("processing") : t("writeChronicle")}
        </button>
      )}

      {status === "chronicle_generated" && (
        <button
          className="match-action-btn secondary"
          disabled={isPending}
          onClick={() => router.push(`/match/${id}/chronicle`)}
        >
          {t("readChronicle")}
        </button>
      )}
    </div>
  );
}

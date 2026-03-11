import { beforeEach, describe, expect, it } from "vitest";
import { FindChronicleByMatchIdUseCase } from "@/application/use-cases/find-chronicle-by-match-id.use-case";
import { DIContainer } from "@/infrastructure/di-container";
import { buildChronicle } from "@/tests/helpers/builders";

describe("FindChronicleByMatchIdUseCase", () => {
  let useCase: FindChronicleByMatchIdUseCase;

  beforeEach(async () => {
    useCase = new FindChronicleByMatchIdUseCase(
      DIContainer.getChronicleRepository()
    );
  });

  it("should return a chronicle when it exists", async () => {
    const chronicle = await buildChronicle("507f1f77bcf86cd799439011", {
      title: "Crónica encontrada",
    });

    const result = await useCase.execute(chronicle.matchId.toString());

    expect(result).not.toBeNull();
    expect(result?.matchId).toBe(chronicle.matchId.toString());
    expect(result?.title).toBe("Crónica encontrada");
  });

  it("should return null when the chronicle does not exist", async () => {
    const result = await useCase.execute("507f1f77bcf86cd799439011");

    expect(result).toBeNull();
  });
});

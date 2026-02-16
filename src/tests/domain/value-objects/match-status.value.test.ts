import { describe, it, expect } from "vitest";
import { MatchStatus } from "@/domain/value-objects/match-status.value";

describe("MatchStatus Value Object", () => {
  it("should create a MatchStatus instance with 'finished' status", () => {
    const status = MatchStatus.finished();
    expect(status.value).toBe("finished");
  });

  it("should create a MatchStatus instance with 'simulated' status", () => {
    const status = MatchStatus.simulated();
    expect(status.value).toBe("simulated");
  });

  it("should create a MatchStatus instance with 'chronicle_generated' status", () => {
    const status = MatchStatus.chronicleGenerated();
    expect(status.value).toBe("chronicle_generated");
  });

  it("should consider two MatchStatus instances equal if their values are the same", () => {
    const status1 = MatchStatus.finished();
    const status2 = MatchStatus.finished();
    const status3 = MatchStatus.simulated();

    expect(status1.equals(status2)).toBe(true);
    expect(status1.equals(status3)).toBe(false);
  });
});

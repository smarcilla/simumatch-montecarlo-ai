import { describe, it, expect } from "vitest";
import { Score } from "@/domain/value-objects/score.value";

describe("Score Value Object", () => {
  it("should create a Score instance with valid home and away scores", () => {
    const score = new Score(2, 1);
    expect(score.home).toBe(2);
    expect(score.away).toBe(1);
  });

  it("should throw an error if home score is negative", () => {
    expect(() => new Score(-1, 1)).toThrow(
      "Scores cannot be negative: home=-1, away=1"
    );
  });

  it("should throw an error if away score is negative", () => {
    expect(() => new Score(1, -1)).toThrow(
      "Scores cannot be negative: home=1, away=-1"
    );
  });

  it("should consider two Score instances equal if their home and away scores are the same", () => {
    const score1 = new Score(2, 1);
    const score2 = new Score(2, 1);
    const score3 = new Score(1, 2);

    expect(score1.equals(score2)).toBe(true);
    expect(score1.equals(score3)).toBe(false);
  });
});

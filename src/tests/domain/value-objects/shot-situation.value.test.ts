import { describe, expect, it } from "vitest";
import { ShotSituation } from "@/domain/value-objects/shot-situation.value";

describe("ShotSituation", () => {
  it("should create a valid ShotSituation with 'corner'", () => {
    const ss = ShotSituation.create("corner");
    expect(ss.value).toBe("corner");
  });

  it("should create a valid ShotSituation with 'assisted'", () => {
    const ss = ShotSituation.create("assisted");
    expect(ss.value).toBe("assisted");
  });

  it("should create a valid ShotSituation with 'penalty'", () => {
    const ss = ShotSituation.create("penalty");
    expect(ss.value).toBe("penalty");
  });

  it("should throw for an invalid value", () => {
    expect(() => ShotSituation.create("openPlay")).toThrow(
      "Invalid ShotSituation value: openPlay"
    );
  });

  it("should return true for equals with same value", () => {
    const a = ShotSituation.create("corner");
    const b = ShotSituation.create("corner");
    expect(a.equals(b)).toBe(true);
  });

  it("should return false for equals with different values", () => {
    const a = ShotSituation.create("corner");
    const b = ShotSituation.create("penalty");
    expect(a.equals(b)).toBe(false);
  });
});

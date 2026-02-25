import { describe, expect, it } from "vitest";
import { ShotType } from "@/domain/value-objects/shot-type.value";

describe("ShotType", () => {
  it("should create a valid ShotType with 'miss'", () => {
    const st = ShotType.create("miss");
    expect(st.value).toBe("miss");
  });

  it("should create a valid ShotType with 'save'", () => {
    const st = ShotType.create("save");
    expect(st.value).toBe("save");
  });

  it("should create a valid ShotType with 'goal'", () => {
    const st = ShotType.create("goal");
    expect(st.value).toBe("goal");
  });

  it("should create a valid ShotType with 'block'", () => {
    const st = ShotType.create("block");
    expect(st.value).toBe("block");
  });

  it("should throw for an invalid value", () => {
    expect(() => ShotType.create("unknown")).toThrow(
      "Invalid ShotType value: unknown"
    );
  });

  it("should return true for equals with same value", () => {
    const a = ShotType.create("goal");
    const b = ShotType.create("goal");
    expect(a.equals(b)).toBe(true);
  });

  it("should return false for equals with different values", () => {
    const a = ShotType.create("goal");
    const b = ShotType.create("miss");
    expect(a.equals(b)).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import { BodyPart } from "@/domain/value-objects/body-part.value";

describe("BodyPart", () => {
  it("should create a valid BodyPart with 'head'", () => {
    const bp = BodyPart.create("head");
    expect(bp.value).toBe("head");
  });

  it("should create a valid BodyPart with 'left-foot'", () => {
    const bp = BodyPart.create("left-foot");
    expect(bp.value).toBe("left-foot");
  });

  it("should create a valid BodyPart with 'right-foot'", () => {
    const bp = BodyPart.create("right-foot");
    expect(bp.value).toBe("right-foot");
  });

  it("should throw for an invalid value", () => {
    expect(() => BodyPart.create("chest")).toThrow(
      "Invalid BodyPart value: chest"
    );
  });

  it("should return true for equals with same value", () => {
    const a = BodyPart.create("head");
    const b = BodyPart.create("head");
    expect(a.equals(b)).toBe(true);
  });

  it("should return false for equals with different values", () => {
    const a = BodyPart.create("head");
    const b = BodyPart.create("left-foot");
    expect(a.equals(b)).toBe(false);
  });
});

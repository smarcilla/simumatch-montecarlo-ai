import { describe, expect, it } from "vitest";

import { Color } from "@/domain/value-objects/color.value";

describe("Color Value Object", () => {
  it("should create a Color instance with a valid hex code", () => {
    const color = new Color("#FF5733");
    expect(color.hex).toBe("#FF5733");
  });

  it("should throw an error for an invalid hex code", () => {
    expect(() => new Color("invalid")).toThrow("Invalid hex color: invalid");
    expect(() => new Color("#12345")).toThrow("Invalid hex color: #12345");
    expect(() => new Color("#GGGGGG")).toThrow("Invalid hex color: #GGGGGG");
  });

  it("should consider two Color instances equal if their hex codes are the same", () => {
    const color1 = new Color("#FF5733");
    const color2 = new Color("#FF5733");
    const color3 = new Color("#33FF57");

    expect(color1.equals(color2)).toBe(true);
    expect(color1.equals(color3)).toBe(false);
  });
});

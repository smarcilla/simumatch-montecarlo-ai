import { describe, it, expect } from "vitest";
import { Shot } from "@/domain/entities/shot.entity";
import { Player } from "@/domain/entities/player.entity";
import { ShotType } from "@/domain/value-objects/shot-type.value";
import { ShotSituation } from "@/domain/value-objects/shot-situation.value";
import { BodyPart } from "@/domain/value-objects/body-part.value";

function makeShot(shotType: string, situation: string): Shot {
  const player = new Player(
    "p1",
    1,
    "Player One",
    "player-one",
    "P. One",
    "forward",
    "9"
  );
  return new Shot(
    "shot-1",
    1,
    0.5,
    0.6,
    true,
    ShotType.create(shotType),
    ShotSituation.create(situation),
    BodyPart.create("right-foot"),
    600,
    player,
    null,
    "match-1"
  );
}

describe("Shot entity", () => {
  describe("isGoal()", () => {
    it("should return true when shotType is goal", () => {
      expect(makeShot("goal", "regular").isGoal()).toBe(true);
    });

    it("should return false when shotType is save", () => {
      expect(makeShot("save", "regular").isGoal()).toBe(false);
    });

    it("should return false when shotType is miss", () => {
      expect(makeShot("miss", "regular").isGoal()).toBe(false);
    });

    it("should return false when shotType is block", () => {
      expect(makeShot("block", "regular").isGoal()).toBe(false);
    });

    it("should return false when shotType is post", () => {
      expect(makeShot("post", "regular").isGoal()).toBe(false);
    });
  });

  describe("isSave()", () => {
    it("should return true when shotType is save", () => {
      expect(makeShot("save", "regular").isSave()).toBe(true);
    });

    it("should return false when shotType is goal", () => {
      expect(makeShot("goal", "regular").isSave()).toBe(false);
    });

    it("should return false when shotType is miss", () => {
      expect(makeShot("miss", "regular").isSave()).toBe(false);
    });
  });

  describe("isOnTarget()", () => {
    it("should return true when shotType is goal", () => {
      expect(makeShot("goal", "regular").isOnTarget()).toBe(true);
    });

    it("should return true when shotType is save", () => {
      expect(makeShot("save", "regular").isOnTarget()).toBe(true);
    });

    it("should return false when shotType is miss", () => {
      expect(makeShot("miss", "regular").isOnTarget()).toBe(false);
    });

    it("should return false when shotType is block", () => {
      expect(makeShot("block", "regular").isOnTarget()).toBe(false);
    });

    it("should return false when shotType is post", () => {
      expect(makeShot("post", "regular").isOnTarget()).toBe(false);
    });
  });

  describe("isPenalty()", () => {
    it("should return true when situation is penalty", () => {
      expect(makeShot("goal", "penalty").isPenalty()).toBe(true);
    });

    it("should return false when situation is regular", () => {
      expect(makeShot("goal", "regular").isPenalty()).toBe(false);
    });

    it("should return false when situation is corner", () => {
      expect(makeShot("goal", "corner").isPenalty()).toBe(false);
    });

    it("should return false when situation is free-kick", () => {
      expect(makeShot("goal", "free-kick").isPenalty()).toBe(false);
    });
  });
});

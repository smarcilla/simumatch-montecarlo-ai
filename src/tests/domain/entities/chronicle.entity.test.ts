import { describe, it, expect } from "vitest";
import {
  Chronicle,
  ChronicleGeneratedContent,
  ChronicleGenerationContext,
  ChronicleHighlight,
  ChronicleKeyStat,
  ChronicleSection,
  ChronicleTimelineItem,
} from "@/domain/entities/chronicle.entity";
import { buildGeneratedChronicleContent } from "@/tests/helpers/builders";

function makeGenerationContext(): ChronicleGenerationContext {
  return new ChronicleGenerationContext("match-1", {
    homeWinProbability: 0.5,
    drawProbability: 0.3,
    awayWinProbability: 0.2,
    momentumTimeline: [],
    playerStats: [],
    scoreDistribution: [],
    xPtsHome: 1.8,
    xPtsAway: 0.9,
    homeTeam: "Home FC",
    awayTeam: "Away FC",
    homeScore: 2,
    awayScore: 1,
  });
}

function validContent(): ChronicleGeneratedContent {
  return buildGeneratedChronicleContent();
}

function sections(): [ChronicleSection, ChronicleSection, ChronicleSection] {
  const s = validContent().sections;
  return [s[0]!, s[1]!, s[2]!];
}

function highlights(): [
  ChronicleHighlight,
  ChronicleHighlight,
  ChronicleHighlight,
] {
  const h = validContent().highlights;
  return [h[0]!, h[1]!, h[2]!];
}

function keyStats(): [ChronicleKeyStat, ChronicleKeyStat, ChronicleKeyStat] {
  const k = validContent().keyStats;
  return [k[0]!, k[1]!, k[2]!];
}

function timeline(): [
  ChronicleTimelineItem,
  ChronicleTimelineItem,
  ChronicleTimelineItem,
] {
  const t = validContent().timeline;
  return [t[0]!, t[1]!, t[2]!];
}

function createChronicle(
  overrides: Partial<ChronicleGeneratedContent> = {}
): Chronicle {
  return Chronicle.createGenerated(
    makeGenerationContext(),
    buildGeneratedChronicleContent(overrides)
  );
}

describe("Chronicle entity", () => {
  describe("createGenerated()", () => {
    it("should create a valid chronicle with correct generated content", () => {
      const chronicle = createChronicle();

      expect(chronicle.matchId).toBe("match-1");
      expect(chronicle.sections).toHaveLength(3);
      expect(chronicle.highlights).toHaveLength(3);
      expect(chronicle.keyStats).toHaveLength(3);
      expect(chronicle.timeline).toHaveLength(3);
    });

    it("should reject when sections count is not 3", () => {
      const [s0, s1] = sections();

      expect(() => createChronicle({ sections: [s0, s1] })).toThrow(
        "Chronicle must have exactly 3 sections, got 2."
      );
    });

    it("should reject when section ids are not in required order", () => {
      const [s0, s1, s2] = sections();

      expect(() =>
        createChronicle({
          sections: [{ ...s0, id: "closing" }, s1, s2],
        })
      ).toThrow(
        "Chronicle section ids must be [pulse, turning-point, closing] in order"
      );
    });

    it("should reject when a section has fewer than 2 paragraphs", () => {
      const [s0, s1, s2] = sections();

      expect(() =>
        createChronicle({
          sections: [{ ...s0, paragraphs: ["Only one."] }, s1, s2],
        })
      ).toThrow('Section "pulse" must have between 2 and 3 paragraphs, got 1.');
    });

    it("should reject when a section has more than 3 paragraphs", () => {
      const [s0, s1, s2] = sections();

      expect(() =>
        createChronicle({
          sections: [s0, { ...s1, paragraphs: ["A.", "B.", "C.", "D."] }, s2],
        })
      ).toThrow(
        'Section "turning-point" must have between 2 and 3 paragraphs, got 4.'
      );
    });

    it("should reject when highlights count is not 3", () => {
      expect(() => createChronicle({ highlights: [] })).toThrow(
        "Chronicle must have exactly 3 highlights, got 0."
      );
    });

    it("should reject when keyStats count is not 3", () => {
      const [k0] = keyStats();

      expect(() => createChronicle({ keyStats: [k0] })).toThrow(
        "Chronicle must have exactly 3 key stats, got 1."
      );
    });

    it("should reject when timeline count is not 3", () => {
      const [t0, t1, t2] = timeline();
      const extra: ChronicleTimelineItem = {
        minute: "90'",
        title: "Extra",
        description: "Extra item.",
        accent: "neutral",
      };

      expect(() => createChronicle({ timeline: [t0, t1, t2, extra] })).toThrow(
        "Chronicle must have exactly 3 timeline items, got 4."
      );
    });

    it("should reject an invalid accent value", () => {
      const [, h1, h2] = highlights();
      const invalid: ChronicleHighlight = {
        label: "X",
        value: "Y",
        accent: "invalid" as never,
      };

      expect(() => createChronicle({ highlights: [invalid, h1, h2] })).toThrow(
        'Invalid accent value: "invalid"'
      );
    });

    it("should reject a timeline minute with invalid format", () => {
      const [t0, t1, t2] = timeline();

      expect(() =>
        createChronicle({ timeline: [{ ...t0, minute: "12" }, t1, t2] })
      ).toThrow('Invalid timeline minute format: "12"');
    });
  });
});

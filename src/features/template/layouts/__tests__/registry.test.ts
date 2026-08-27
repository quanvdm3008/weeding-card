import { describe, expect, it } from "vitest";
import { getLayoutStrategy } from "../registry";
import type { ExperienceLayout } from "@/data/templateExperiences";

const ALL_LAYOUTS: ExperienceLayout[] = ["storybook", "editorial", "destination", "royal", "minimal", "timeline"];

describe("layout registry", () => {
  it("Every ExperienceLayout can be mapped to a strategy", () => {
    for (const layout of ALL_LAYOUTS) {
      expect(getLayoutStrategy(layout)).toBeDefined();
      expect(typeof getLayoutStrategy(layout).renderSections).toBe("function");
    }
  });

  it("Each art direction uses a separate strategy", () => {
    for (const layout of ALL_LAYOUTS) {
      expect(getLayoutStrategy(layout).id).toBe(layout);
    }
  });

  it("strange value/undefined storybook-safe fallback", () => {
    expect(getLayoutStrategy(undefined).id).toBe("storybook");
    expect(getLayoutStrategy("does-not-exist" as ExperienceLayout).id).toBe("storybook");
  });
});

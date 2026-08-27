import { describe, expect, it } from "vitest";
import { templates } from "@/data/templates";
import { getTemplatePresentation, templatePresentations } from "@/data/templatePresentation";

describe("template presentation profiles", () => {
  it("Each card template has its own RSVP content, greetings and background music", () => {
    for (const template of templates) {
      const profile = templatePresentations[template.id];
      expect(profile, template.id).toBeDefined();
      expect(profile.rsvp.title.length, template.id).toBeGreaterThan(3);
      expect(profile.wishes.title.length, template.id).toBeGreaterThan(3);
      expect(profile.music.label.length, template.id).toBeGreaterThan(1);
    }
  });

  it("keep the default profile safe for unknown templates", () => {
    expect(getTemplatePresentation("not-found")).toEqual(getTemplatePresentation());
  });
});

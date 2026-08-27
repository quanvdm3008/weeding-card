import { describe, expect, it } from "vitest";
import { templates } from "@/data/templates";
import { themes } from "@/data/themes";
import { getTemplateExperience, templateExperiences } from "@/data/templateExperiences";
import { getLayoutStrategy } from "@/features/template/layouts";
import { getTemplateImage } from "@/features/templates/catalog/templateAssets";

// Prevent drift between templates, themes, and experiences.
// Every theme component must remain discoverable from the catalog.
describe("template catalog consistency", () => {
  it("every catalog template has a theme entry (no silent-fallback)", () => {
    const missing = templates.filter((t) => !themes[t.id]).map((t) => t.id);
    expect(missing).toEqual([]);
  });

  it("every theme id matches its record key", () => {
    for (const [key, theme] of Object.entries(themes)) {
      expect(theme.id).toBe(key);
    }
  });

  it("every catalog template resolves a template experience without throwing", () => {
    for (const t of templates) {
      expect(() => getTemplateExperience(t.id)).not.toThrow();
    }
  });

  it("keeps one explicit opening profile for each of the 26 catalog templates", () => {
    expect(templates).toHaveLength(26);
    expect(Object.keys(templateExperiences).sort()).toEqual(templates.map((template) => template.id).sort());
  });

  it("The layout of every experience template has a corresponding LayoutStrategy", () => {
    for (const t of templates) {
      const { layout } = getTemplateExperience(t.id);
      expect(getLayoutStrategy(layout)).toBeDefined();
    }
  });

  it("catalog ids are unique", () => {
    const ids = templates.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("featured art templates have their own catalog thumbnail", () => {
    const fallback = getTemplateImage("missing-template");
    for (const id of ["coastal", "winter", "violet_dream", "parallax_love"]) {
      expect(getTemplateImage(id)).not.toBe(fallback);
    }
  });
});

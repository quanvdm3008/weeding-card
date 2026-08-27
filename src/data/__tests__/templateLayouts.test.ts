import { describe, expect, it } from "vitest";
import { templates } from "@/data/templates";
import { getTemplateLayout, templateLayouts } from "@/data/templateLayouts";

describe("template layout profiles", () => {
  it("gives every template a distinct RSVP and wishes composition", () => {
    const rsvpCompositions = new Set<string>();
    const wishesCompositions = new Set<string>();

    for (const template of templates) {
      const layout = templateLayouts[template.id];
      expect(layout, template.id).toBeDefined();
      rsvpCompositions.add(layout.rsvp.composition);
      wishesCompositions.add(layout.wishes.composition);
    }

    expect(rsvpCompositions.size).toBe(templates.length);
    expect(wishesCompositions.size).toBe(templates.length);
  });

  it("falls back to the canvas composition for unknown templates", () => {
    expect(getTemplateLayout("not-found")).toEqual(getTemplateLayout());
  });
});

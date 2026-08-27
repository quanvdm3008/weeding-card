import { describe, expect, it } from "vitest";
import "../registry";
import { getCardComponentDefinition, listCardComponentDefinitions } from "../registry";
import { validateCardDocument } from "../schema/schema";
import { createComponent, createEmptyDocument } from "../schema/defaults";

/** List of component types committed to support — add new types here. */
const EXPECTED_TYPES = [
  "text",
  "button",
  "divider",
  "countdown",
  "timeline",
  "social",
  "image",
  "frame",
  "video",
  "gallery",
  "music",
  "qrcode",
  "shape",
  "icon",
  "sticker",
  "flowers",
  "decoration",
  "group",
  "rsvp",
  "guestbook",
  "map",
];

describe("component registry", () => {
  it("register all types of committed components", () => {
    const registered = listCardComponentDefinitions().map((d) => d.type);
    for (const type of EXPECTED_TYPES) {
      expect(registered, `missing type"${type}"`).toContain(type);
    }
  });

  it("Each definition has enough label/icon/size/renderer", () => {
    for (const def of listCardComponentDefinitions()) {
      expect(def.label, def.type).toBeTruthy();
      expect(def.icon, def.type).toBeTruthy();
      expect(def.defaultSize.width, def.type).toBeGreaterThan(0);
      expect(def.defaultSize.height, def.type).toBeGreaterThan(0);
      expect(def.Renderer, def.type).toBeTruthy();
      expect(["content", "Media", "decor", "widget"]).toContain(def.category);
    }
  });

  it("Components created from default of all types can pass schema validation", () => {
    const doc = createEmptyDocument();
    const sectionId = doc.pages[0].sections[0].id;
    for (const def of listCardComponentDefinitions()) {
      const c = createComponent(def.type, sectionId, {
        content: structuredClone(def.defaultContent),
        size: { ...def.defaultSize },
      });
      if (def.defaultStyle) c.style = { ...c.style, ...structuredClone(def.defaultStyle) };
      doc.pages[0].components.push(c);
    }
    expect(validateCardDocument(doc)).not.toBeNull();
  });

  it("The inspector field declaring select must have options", () => {
    for (const def of listCardComponentDefinitions()) {
      for (const field of def.inspector) {
        if (field.type === "select") {
          expect(field.options?.length, `${def.type}.${field.key}`).toBeGreaterThan(0);
        }
        if (field.type === "item-list") {
          expect(field.itemFields?.length, `${def.type}.${field.key}`).toBeGreaterThan(0);
        }
      }
    }
  });

  it("getCardComponentDefinition returns undefined for strange type", () => {
    expect(getCardComponentDefinition("non-existence")).toBeUndefined();
  });
});

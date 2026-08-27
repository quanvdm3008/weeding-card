import { describe, expect, it } from "vitest";
import {
  cardDocumentHasContent,
  parseCardDocument,
  serializeCardDocument,
  validateCardDocument,
} from "../schema/schema";
import { createComponent, createEmptyDocument, createSection } from "../schema/defaults";
import { CARD_SCHEMA_VERSION } from "../schema/types";

describe("CardDocument schema", () => {
  it("round-trip: serialize then parse to return the equivalent document", () => {
    const doc = createEmptyDocument("Test");
    const sectionId = doc.pages[0].sections[0].id;
    doc.pages[0].components.push(createComponent("text", sectionId, { content: { text: "Hello" } }));

    const parsed = parseCardDocument(serializeCardDocument(doc));

    expect(parsed).not.toBeNull();
    expect(parsed!.name).toBe("Test");
    expect(parsed!.pages[0].components).toHaveLength(1);
    expect(parsed!.pages[0].components[0].content.text).toBe("Hello");
  });

  it("parse returns null for corrupt/empty JSON instead of throw", () => {
    expect(parseCardDocument("{not json")).toBeNull();
    expect(parseCardDocument("")).toBeNull();
    expect(parseCardDocument(null)).toBeNull();
    expect(parseCardDocument(undefined)).toBeNull();
    expect(parseCardDocument('{"hello":"world"}')).toBeNull(); /* missing required field*/
  });

  it("Fill default for missing style/animation field (forward-compatible)", () => {
    const minimal = {
      schemaVersion: 1,
      id: "doc-1",
      pages: [
        {
          id: "p-1",
          sections: [{ id: "s-1" }],
          components: [
            {
              id: "c-1",
              type: "text",
              parentId: "s-1",
              position: { x: 0, y: 0 },
              size: { width: 100, height: 40 },
            },
          ],
        },
      ],
    };
    const doc = validateCardDocument(minimal);
    expect(doc).not.toBeNull();
    const c = doc!.pages[0].components[0];
    expect(c.style.opacity).toBe(1);
    /* Missing block animation → use standard default (entrance fade)*/
    expect(c.animation.entrance.type).toBe("fade");
    expect(c.responsive.hiddenOn).toEqual([]);
    expect(c.locked).toBe(false);
    expect(doc!.settings.showOnPublicPage).toBe(false);
    expect(doc!.pages[0].sections[0].height).toBe(600);
  });

  it("The document is valid and has a current schemaVersion", () => {
    const doc = createEmptyDocument();
    expect(doc.schemaVersion).toBe(CARD_SCHEMA_VERSION);
    expect(validateCardDocument(doc)).not.toBeNull();
    expect(cardDocumentHasContent(doc)).toBe(false);
  });

  it("cardDocumentHasContent true when there is at least 1 component", () => {
    const doc = createEmptyDocument();
    doc.pages[0].components.push(createComponent("text", doc.pages[0].sections[0].id));
    expect(cardDocumentHasContent(doc)).toBe(true);
  });

  it("Newly created section has default background + hiddenOn", () => {
    const s = createSection();
    expect(s.background.color).toBeTruthy();
    expect(s.hiddenOn).toEqual([]);
  });
});

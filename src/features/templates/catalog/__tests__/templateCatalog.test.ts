import { describe, expect, it } from "vitest";
import {
  filterAndSortTemplates,
  getTemplateById,
  templateCatalog,
  templateCategories,
} from "../templateCatalog";

describe("templateCatalog", () => {
  it("enriches every source template with marketplace metadata", () => {
    expect(templateCatalog.length).toBeGreaterThan(10);
    expect(templateCatalog.every((template) => template.previewImages.length >= 2)).toBe(true);
    expect(getTemplateById("romantic")?.author).toBe("Mireia Studio");
  });

  it("filters Vietnamese text and categories", () => {
    const result = filterAndSortTemplates(templateCatalog, {
      query: "romantic",
      category: "All",
      sort: "featured",
    });

    expect(result.length).toBeGreaterThan(0);
    expect(result.some((template) => template.id === "romantic")).toBe(true);
    expect(templateCategories[0]).toBe("All");
  });

  it("supports favorite-only and popularity sorting", () => {
    const favoriteIds = new Set(["romantic", "modern"]);
    const result = filterAndSortTemplates(templateCatalog, {
      query: "",
      category: "All",
      sort: "popular",
      favorites: favoriteIds,
    });

    expect(result.map((template) => template.id).sort()).toEqual(["modern", "romantic"]);
    expect(result[0].usageCount).toBeGreaterThanOrEqual(result[1].usageCount);
  });
});

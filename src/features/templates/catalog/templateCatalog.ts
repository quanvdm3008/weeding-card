import { templates, type WeddingTemplate } from "@/data/templates";
import { getTemplateImage, getTemplateMoodImage } from "./templateAssets";

export type TemplateSort = "featured" | "popular" | "rating" | "newest" | "name";

export interface TemplateCatalogItem extends WeddingTemplate {
  author: string;
  version: string;
  updatedAt: string;
  rating: number;
  reviewCount: number;
  usageCount: number;
  featured: boolean;
  isNew: boolean;
  typography: [string, string];
  includedPages: string[];
  animations: string[];
  occasions: string[];
  previewImages: string[];
}

const featuredIds = new Set(["romantic", "luxury", "magazine", "traditional", "layered3d", "korean"]);
const newIds = new Set(["cyberpunk_luxe", "nordic_aurora", "magazine", "traditional"]);

const typographyByCategory: Record<string, [string, string]> = {
  "romantic": ["Cormorant Garamond", "Inter"],
  "Modern": ["Playfair Display", "Inter"],
  "minimalist": ["Inter", "Inter"],
  "classic": ["Playfair Display", "Cormorant Garamond"],
  "Luxurious": ["Cormorant Garamond", "Inter"],
  "traditional": ["Playfair Display", "Inter"],
};

export const templateCatalog: TemplateCatalogItem[] = templates.map((template, index) => ({
  ...template,
  author: "Mireia Studio",
  version: `2.${(index % 6) + 1}.0`,
  updatedAt: new Date(Date.UTC(2026, 6, Math.max(1, 20 - (index % 18)))).toISOString(),
  rating: Number((4.7 + (index % 3) * 0.1).toFixed(1)),
  reviewCount: 84 + index * 17,
  usageCount: 920 + ((templates.length - index) * 311),
  featured: featuredIds.has(template.id),
  isNew: newIds.has(template.id),
  typography: typographyByCategory[template.category] ?? ["Cormorant Garamond", "Inter"],
  includedPages: ["INVITATION", "Story", "Schedule", "Photo gallery", "RSVP", "Wish"],
  animations: template.id === "minimalist" ? ["Delicate fade", "Smooth scroll"] : ["Section reveal", "Parallax photos", "Micro-interactions"],
  occasions: ["Wedding ceremony", "Celebration ceremony", "Intimate party"],
  previewImages: [getTemplateImage(template.id), getTemplateMoodImage(template.id)],
}));

export const templateCategories = ["All", ...Array.from(new Set(templateCatalog.map((template) => template.category)))];

export function getTemplateById(templateId?: string) {
  return templateCatalog.find((template) => template.id === templateId);
}

export function filterAndSortTemplates(
  items: TemplateCatalogItem[],
  options: { query: string; category: string; sort: TemplateSort; favorites?: Set<string> },
) {
  const normalizedQuery = options.query.trim().toLocaleLowerCase("vi");
  const filtered = items.filter((template) => {
    const matchesCategory = options.category === "All" || template.category === options.category;
    const haystack = [template.name, template.nameVi, template.description, template.mood, ...template.highlights]
      .join(" ")
      .toLocaleLowerCase("vi");
    const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
    const matchesFavorite = !options.favorites || options.favorites.has(template.id);
    return matchesCategory && matchesQuery && matchesFavorite;
  });

  return [...filtered].sort((a, b) => {
    if (options.sort === "popular") return b.usageCount - a.usageCount;
    if (options.sort === "rating") return b.rating - a.rating || b.reviewCount - a.reviewCount;
    if (options.sort === "newest") return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
    if (options.sort === "name") return a.nameVi.localeCompare(b.nameVi, "vi");
    return Number(b.featured) - Number(a.featured) || b.usageCount - a.usageCount;
  });
}

export function formatUsageCount(value: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

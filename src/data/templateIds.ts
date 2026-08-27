/** The only template identifiers accepted by the public catalogue and invitation renderer. */
export const TEMPLATE_IDS = [
  "canvas", "romantic", "modern", "tropical", "rustic", "sakura", "minimalist",
  "vintage", "boho", "royal", "garden", "flat2d", "layered3d", "photo25d",
  "cosmic", "pixel", "luxury", "korean", "magazine", "traditional",
  "cyberpunk_luxe", "nordic_aurora", "coastal", "winter", "violet_dream",
  "parallax_love",
] as const;

export type TemplateId = (typeof TEMPLATE_IDS)[number];

export const isTemplateId = (value: string): value is TemplateId =>
  (TEMPLATE_IDS as readonly string[]).includes(value);

import { z } from "zod";
import type { CardDocument } from "./types";
import { CARD_SCHEMA_VERSION } from "./types";
import { defaultAnimation, defaultSectionBackground, defaultStyle } from "./defaults";

/**
 * Zod schema for CardDocument — JSON contract between frontend and backend.
 * All field styles/animations have defaults → old documents that lack fields can still be parsed
 * (forward-compatible), strange fields are stripped so the backend doesn't bloat with junk data.
 */

const deviceKindSchema = z.enum(["desktop", "tablet", "mobile"]);

const gradientSchema = z.object({
  enabled: z.boolean().default(false),
  from: z.string().default("#E8B4B8"),
  to: z.string().default("#FDFBF7"),
  angle: z.number().default(135),
});

const borderSchema = z.object({
  enabled: z.boolean().default(false),
  width: z.number().min(0).default(1),
  style: z.enum(["solid", "dashed", "dotted", "double"]).default("solid"),
  color: z.string().default("#E8B4B8"),
});

const shadowSchema = z.object({
  enabled: z.boolean().default(false),
  x: z.number().default(0),
  y: z.number().default(8),
  blur: z.number().min(0).default(24),
  spread: z.number().default(0),
  color: z.string().default("rgba(0,0,0,0.15)"),
});

const styleSchema = z
  .object({
    opacity: z.number().min(0).max(1).default(1),
    radius: z.number().min(0).default(0),
    border: borderSchema.default(defaultStyle().border),
    shadow: shadowSchema.default(defaultStyle().shadow),
    blur: z.number().min(0).default(0),
    padding: z.number().min(0).default(0),
    margin: z.number().min(0).default(0),
    background: z.string().default(""),
    gradient: gradientSchema.default(defaultStyle().gradient),
    color: z.string().default("#4A3F3C"),
    fontFamily: z.string().default("Inter"),
    fontSize: z.number().min(1).default(18),
    fontWeight: z.number().min(100).max(900).default(400),
    fontStyle: z.enum(["normal", "italic"]).default("normal"),
    textAlign: z.enum(["left", "center", "right"]).default("center"),
    lineHeight: z.number().min(0.5).default(1.5),
    letterSpacing: z.number().default(0),
  })
  .default(defaultStyle());

const animationSpecSchema = z.object({
  type: z
    .enum([
      "none",
      "fade",
      "slide-up",
      "slide-down",
      "slide-left",
      "slide-right",
      "zoom-in",
      "zoom-out",
      "rotate-in",
      "bounce",
    ])
    .default("none"),
  duration: z.number().min(0).default(0.8),
  delay: z.number().min(0).default(0),
  easing: z.enum(["ease-out", "ease-in", "ease-in-out", "linear", "spring"]).default("ease-out"),
});

const loopSpecSchema = z.object({
  type: z.enum(["none", "float", "pulse", "heartbeat", "sway", "spin", "twinkle", "depth-float", "perspective-sway"]).default("none"),
  duration: z.number().min(0.2).default(3),
});

const animationSchema = z
  .object({
    entrance: animationSpecSchema.default(defaultAnimation().entrance),
    exit: animationSpecSchema.default(defaultAnimation().exit),
    /* old document without loop → default none (backwards compatible)*/
    loop: loopSpecSchema.default(defaultAnimation().loop),
  })
  .default(defaultAnimation());

const componentSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  name: z.string().default(""),
  parentId: z.string().min(1),
  order: z.number().int().default(0),
  position: z.object({ x: z.number(), y: z.number() }),
  size: z.object({ width: z.number().min(1), height: z.number().min(1) }),
  rotation: z.number().default(0),
  locked: z.boolean().default(false),
  hidden: z.boolean().default(false),
  style: styleSchema,
  content: z.record(z.unknown()).default({}),
  animation: animationSchema,
  responsive: z
    .object({ hiddenOn: z.array(deviceKindSchema).default([]) })
    .default({ hiddenOn: [] }),
  metadata: z.record(z.unknown()).default({}),
});

const sectionSchema = z.object({
  id: z.string().min(1),
  name: z.string().default("section"),
  order: z.number().int().default(0),
  height: z.number().min(80).default(600),
  background: z
    .object({
      color: z.string().default("#FDFBF7"),
      gradient: gradientSchema.default(defaultSectionBackground().gradient),
      imageUrl: z.string().default(""),
      imageOpacity: z.number().min(0).max(1).default(1),
    })
    .default(defaultSectionBackground()),
  hiddenOn: z.array(deviceKindSchema).default([]),
});

const pageSchema = z.object({
  id: z.string().min(1),
  name: z.string().default("Page 1"),
  sections: z.array(sectionSchema).min(1),
  components: z.array(componentSchema).default([]),
});

export const cardDocumentSchema = z.object({
  schemaVersion: z.number().int().min(1),
  id: z.string().min(1),
  name: z.string().default("My card"),
  pages: z.array(pageSchema).min(1),
  settings: z
    .object({
      showOnPublicPage: z.boolean().default(false),
      outerBackground: z.string().default("#F5F0EB"),
    })
    .default({ showOnPublicPage: false, outerBackground: "#F5F0EB" }),
  metadata: z.record(z.unknown()).default({}),
});

/** Migrate documents from old schemaVersion to current (no old version yet — this is the connection point). */
export function migrateDocument(raw: Record<string, unknown>): Record<string, unknown> {
  const version = typeof raw.schemaVersion === "number" ? raw.schemaVersion : 1;
  let doc = raw;
  /* switch-fallthrough by version when v2+ is available; Currently, only version is standardized.*/
  if (version < CARD_SCHEMA_VERSION) {
    doc = { ...doc, schemaVersion: CARD_SCHEMA_VERSION };
  }
  return doc;
}

/** Parse JSON string from backend → CardDocument. Returns null if empty/corrupt (not thrown). */
export function parseCardDocument(json: string | null | undefined): CardDocument | null {
  if (!json?.trim()) return null;
  try {
    const raw = JSON.parse(json) as Record<string, unknown>;
    const result = cardDocumentSchema.safeParse(migrateDocument(raw));
    return result.success ? (result.data as CardDocument) : null;
  } catch {
    return null;
  }
}

/** Validate object (already a JS object) — used in testing and before saving. */
export function validateCardDocument(doc: unknown): CardDocument | null {
  const result = cardDocumentSchema.safeParse(doc);
  return result.success ? (result.data as CardDocument) : null;
}

export function serializeCardDocument(doc: CardDocument): string {
  return JSON.stringify(doc);
}

/** Does the document have real content (at least 1 component) — decide whether to render publicly or not. */
export function cardDocumentHasContent(doc: CardDocument | null): boolean {
  return !!doc && doc.pages.some((p) => p.components.length > 0);
}

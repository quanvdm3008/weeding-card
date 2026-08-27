import type { SectionStyle } from "@/store/weddingConfigStore";
import type { BankInfo, FaqItem, ParentInfo, ScheduleEvent, StoryMilestone } from "@/data/seedData";

/**
 * Builder configuration (cursor, particle effects, section list, section style).
 * From H8: saved in real field `builderConfig` (JSON) on backend.
 * Old data may still be behind the delimiter "|__CONFIG__|" in extraInfoContent —
 * all reads must go through resolveBuilderConfig for backward compatibility.
 */

export const LEGACY_CONFIG_DELIMITER = "|__CONFIG__|";

export interface BuilderConfig {
  cursorType: "default" | "follow" | "ripple";
  particlesType: "none" | "sparkles" | "petals" | "leaves" | "galaxy" | "pixel" | "sakura" | "hearts" | "gold_stars" | "snow" | "fireflies" | "bubbles" | "gold_dust";
  photoFilter?: "none" | "grayscale" | "sepia" | "vintage" | "blur";
  headingFont?: string;
  bodyFont?: string;
  headingWeight?: 400 | 500 | 600 | 700 | 800 | 900;
  headingCase?: "normal" | "uppercase";
  accentStyle?: "minimal" | "underline" | "highlight" | "editorial";
  customSections: string[];
  sectionStyles: Record<string, SectionStyle>;
  /** There is no default — undefined means not filled in, completely hiding the corresponding wedding gift section. */
  groomBank?: BankInfo;
  brideBank?: BankInfo;
  /** There is no default — undefined means using a sample love story (seed data). */
  stories?: StoryMilestone[];
  groomParents?: ParentInfo;
  brideParents?: ParentInfo;
  schedule?: ScheduleEvent[];
  dressCodeColors?: string[];
  faqs?: FaqItem[];
}

/** Wedding data is persisted independently from visual/editor presentation settings. */
export interface InvitationContentConfig {
  groomBank?: BankInfo;
  brideBank?: BankInfo;
  stories?: StoryMilestone[];
  groomParents?: ParentInfo;
  brideParents?: ParentInfo;
  schedule?: ScheduleEvent[];
  dressCodeColors?: string[];
  faqs?: FaqItem[];
}

export const DEFAULT_BUILDER_CONFIG: BuilderConfig = {
  cursorType: "follow",
  particlesType: "sparkles",
  photoFilter: "none",
  headingFont: "Cormorant Garamond",
  bodyFont: "Inter",
  headingWeight: 600,
  headingCase: "normal",
  accentStyle: "minimal",
  customSections: ["couple", "countdown", "story", "message", "details", "gallery", "events", "wishes", "rsvp"],
  sectionStyles: {},
};

function mergeWithDefaults(parsed: Partial<BuilderConfig>): BuilderConfig {
  return {
    cursorType: parsed.cursorType ?? DEFAULT_BUILDER_CONFIG.cursorType,
    particlesType: parsed.particlesType ?? DEFAULT_BUILDER_CONFIG.particlesType,
    photoFilter: parsed.photoFilter ?? DEFAULT_BUILDER_CONFIG.photoFilter,
    headingFont: parsed.headingFont ?? DEFAULT_BUILDER_CONFIG.headingFont,
    bodyFont: parsed.bodyFont ?? DEFAULT_BUILDER_CONFIG.bodyFont,
    headingWeight: parsed.headingWeight ?? DEFAULT_BUILDER_CONFIG.headingWeight,
    headingCase: parsed.headingCase ?? DEFAULT_BUILDER_CONFIG.headingCase,
    accentStyle: parsed.accentStyle ?? DEFAULT_BUILDER_CONFIG.accentStyle,
    customSections: parsed.customSections ?? DEFAULT_BUILDER_CONFIG.customSections,
    sectionStyles: parsed.sectionStyles ?? DEFAULT_BUILDER_CONFIG.sectionStyles,
    groomBank: parsed.groomBank,
    brideBank: parsed.brideBank,
    stories: parsed.stories,
    groomParents: parsed.groomParents,
    brideParents: parsed.brideParents,
    schedule: parsed.schedule,
    dressCodeColors: parsed.dressCodeColors,
    faqs: parsed.faqs,
  };
}

/** Parse JSON builderConfig from backend. Returns null if empty/corrupt (not thrown). */
export function parseBuilderConfig(json: string | null | undefined): BuilderConfig | null {
  if (!json?.trim()) return null;
  try {
    return mergeWithDefaults(JSON.parse(json) as Partial<BuilderConfig>);
  } catch {
    return null;
  }
}

export function resolveBuilderConfig(
  builderConfig: string | null | undefined,
  extraInfoContent: string | null | undefined
): { content: string; config: BuilderConfig } {
  const raw = extraInfoContent ?? "";
  const [content, legacyJson] = raw.includes(LEGACY_CONFIG_DELIMITER)
    ? (raw.split(LEGACY_CONFIG_DELIMITER) as [string, string])
    : [raw, null];

  const config = parseBuilderConfig(builderConfig) ?? parseBuilderConfig(legacyJson) ?? DEFAULT_BUILDER_CONFIG;
  return { content, config };
}

/** Serialize config to send to backend (field builderConfig). */
export function serializeBuilderConfig(config: BuilderConfig): string {
  return JSON.stringify(config);
}

export function parseInvitationContentConfig(json: string | null | undefined): InvitationContentConfig | null {
  if (!json?.trim()) return null;
  try {
    return JSON.parse(json) as InvitationContentConfig;
  } catch {
    return null;
  }
}

/** New content config wins; old builder-config content remains readable during migration. */
export function resolveInvitationContentConfig(
  contentConfig: string | null | undefined,
  builderConfig: string | null | undefined,
  extraInfoContent: string | null | undefined,
): InvitationContentConfig {
  const current = parseInvitationContentConfig(contentConfig);
  if (current) return current;
  const legacy = resolveBuilderConfig(builderConfig, extraInfoContent).config;
  return {
    groomBank: legacy.groomBank,
    brideBank: legacy.brideBank,
    stories: legacy.stories,
    groomParents: legacy.groomParents,
    brideParents: legacy.brideParents,
    schedule: legacy.schedule,
    dressCodeColors: legacy.dressCodeColors,
    faqs: legacy.faqs,
  };
}

export function serializeInvitationContentConfig(config: InvitationContentConfig): string {
  return JSON.stringify(config);
}

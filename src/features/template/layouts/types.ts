import type { ReactNode } from "react";
import type { WeddingTheme } from "@/data/themes";
import type { SectionStyle } from "@/store/weddingConfigStore";
import type { ExperienceLayout } from "@/data/templateExperiences";

/**
 * A section is ready for layout construction: id (section key), node (rendered JSX)
 * and user's custom style (from Builder). Layout decides how to wrap/arrange these items.
 */
export interface LayoutSectionItem {
  id: string;
  node: ReactNode;
  style: SectionStyle;
}

export interface LayoutRenderContext {
  sections: LayoutSectionItem[];
  theme: WeddingTheme;
  accentColor: string;
}

/**
 * Layout strategy for the generic rendering branch of WeddingFullPage.
 * Only responsible for the BODY (between Hero and Footer) — Hero/Quote/Footer is the common scaffold.
 */
export interface LayoutStrategy {
  id: ExperienceLayout;
  renderSections: (ctx: LayoutRenderContext) => ReactNode;
}

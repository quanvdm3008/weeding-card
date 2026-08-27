import { SectionFrame } from "./SectionFrame";
import type { LayoutStrategy } from "./types";

/**
 * Default layout: vertical stack of section-cards, fully respecting user style customization
 * (padding, rounded corners, shadow, glass, background, title). This is the historical generic layout of
 * WeddingFullPage — all templates that do not have their own strategy are mapped here to keep the display intact.
 */
export const storybookLayout: LayoutStrategy = {
  id: "storybook",
  renderSections: ({ sections, theme, accentColor }) => (
    <div className="invitation-layout invitation-layout--storybook">
      {sections.map((item, index) => (
        <SectionFrame
          key={item.id}
          item={item}
          index={index}
          theme={theme}
          accentColor={accentColor}
          marker={<span className="invitation-storybook-mark" style={{ color: accentColor }} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>}
        />
      ))}
    </div>
  ),
};

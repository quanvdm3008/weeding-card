import { SectionFrame } from "./SectionFrame";
import type { LayoutStrategy } from "./types";

export const minimalLayout: LayoutStrategy = {
  id: "minimal",
  renderSections: ({ sections, theme, accentColor }) => (
    <div className="invitation-layout invitation-layout--minimal">
      {sections.map((item, index) => (
        <SectionFrame
          key={item.id}
          item={item}
          index={index}
          theme={theme}
          accentColor={accentColor}
          className={index % 3 === 1 ? "is-narrow" : ""}
          marker={<span className="invitation-minimal-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>}
        />
      ))}
    </div>
  ),
};

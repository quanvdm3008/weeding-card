import { SectionFrame } from "./SectionFrame";
import type { LayoutStrategy } from "./types";

export const editorialLayout: LayoutStrategy = {
  id: "editorial",
  renderSections: ({ sections, theme, accentColor }) => (
    <div className="invitation-layout invitation-layout--editorial">
      <div className="invitation-editorial-masthead" aria-hidden="true">
        <span>Wedding edition</span>
        <i style={{ backgroundColor: accentColor }} />
        <span>Est. forever</span>
      </div>
      {sections.map((item, index) => (
        <SectionFrame
          key={item.id}
          item={item}
          index={index}
          theme={theme}
          accentColor={accentColor}
          className={index % 2 ? "is-offset-right" : "is-offset-left"}
          marker={<span className="invitation-editorial-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>}
        />
      ))}
    </div>
  ),
};

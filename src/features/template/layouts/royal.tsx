import { Crown } from "lucide-react";
import { SectionFrame } from "./SectionFrame";
import type { LayoutStrategy } from "./types";

export const royalLayout: LayoutStrategy = {
  id: "royal",
  renderSections: ({ sections, theme, accentColor }) => (
    <div className="invitation-layout invitation-layout--royal">
      <div className="invitation-royal-crest" style={{ color: accentColor }} aria-hidden="true">
        <i /><Crown /><i />
      </div>
      {sections.map((item, index) => (
        <SectionFrame
          key={item.id}
          item={item}
          index={index}
          theme={theme}
          accentColor={accentColor}
          marker={<span className="invitation-royal-index" style={{ color: accentColor }} aria-hidden="true">Chapter {index + 1}</span>}
        />
      ))}
    </div>
  ),
};

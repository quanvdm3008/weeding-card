import { MapPin, Navigation } from "lucide-react";
import { SectionFrame } from "./SectionFrame";
import type { LayoutStrategy } from "./types";

export const destinationLayout: LayoutStrategy = {
  id: "destination",
  renderSections: ({ sections, theme, accentColor }) => (
    <div className="invitation-layout invitation-layout--destination">
      <div className="invitation-route-line" style={{ borderColor: `${accentColor}55` }} aria-hidden="true" />
      {sections.map((item, index) => (
        <SectionFrame
          key={item.id}
          item={item}
          index={index}
          theme={theme}
          accentColor={accentColor}
          className={index % 2 ? "is-coast" : "is-inland"}
          marker={
            <span className="invitation-destination-pin" style={{ color: accentColor, borderColor: `${accentColor}55` }} aria-hidden="true">
              {index % 2 ? <Navigation /> : <MapPin />}
            </span>
          }
        />
      ))}
    </div>
  ),
};

import { SectionFrame } from "./SectionFrame";
import type { LayoutStrategy } from "./types";

/**
 * Layout "timeline": sections strung along a vertical axis (spine) with landmarks
 * numbering. Keep section content near full-width (just indented off the axis) so it doesn't break
 * internal layout of each section — suitable for storytelling cards in order.
 */
export const timelineLayout: LayoutStrategy = {
  id: "timeline",
  renderSections: ({ sections, theme, accentColor }) => (
    <div className="invitation-layout invitation-layout--timeline relative mx-auto max-w-6xl px-4 @md:px-8 py-10">
      <div
        className="pointer-events-none absolute top-0 bottom-0 left-7 @md:left-1/2 w-px"
        style={{ background: `linear-gradient(to bottom, transparent, ${accentColor}55, ${accentColor}55, transparent)` }}
      />
      <div className="space-y-2">
        {sections.map((item, index) => (
          <SectionFrame
            key={item.id}
            item={item}
            index={index}
            theme={theme}
            accentColor={accentColor}
            className={`pl-14 @md:pl-0 @md:w-[48%] ${index % 2 ? "@md:ml-auto" : "@md:mr-auto"}`}
            marker={
              <span
                className={`absolute left-7 @md:top-1/2 ${index % 2 ? "@md:left-0" : "@md:left-full"} top-16 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full text-xs font-semibold text-white shadow-md ring-4 ring-background`}
                style={{ backgroundColor: accentColor }}
                aria-hidden="true"
              >
                {index + 1}
              </span>
            }
          />
        ))}
      </div>
    </div>
  ),
};

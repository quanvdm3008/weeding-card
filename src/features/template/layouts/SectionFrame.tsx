import type { CSSProperties, ReactNode } from "react";
import { SectionAnimation } from "./SectionAnimation";
import type { LayoutSectionItem } from "./types";
import type { WeddingTheme } from "@/data/themes";

interface SectionFrameProps {
  item: LayoutSectionItem;
  index: number;
  theme: WeddingTheme;
  accentColor: string;
  className?: string;
  marker?: ReactNode;
}

const shadowClass: Record<string, string> = {
  none: "",
  sm: "invitation-section-shadow-sm",
  md: "invitation-section-shadow-md",
  lg: "invitation-section-shadow-lg",
  neumorphic: "invitation-section-shadow-soft",
};

const backgroundClass: Record<string, string> = {
  default: "",
  glass: "invitation-section-surface-glass",
  tint: "invitation-section-surface-tint",
  transparent: "invitation-section-surface-clear",
};

export function SectionFrame({
  item,
  index,
  theme,
  accentColor,
  className = "",
  marker,
}: SectionFrameProps) {
  const style = item.style;
  const paddingY = style.paddingY ?? 80;
  const borderRadius = style.borderRadius ?? 0;
  const surfaceStyle: CSSProperties = {
    borderRadius: borderRadius ? `${borderRadius}px` : undefined,
    backdropFilter: style.glassEffect ? "blur(18px)" : undefined,
  };

  return (
    <article
      className={`invitation-section-frame ${className}`}
      data-invitation-section={item.id}
      style={{ "--section-space": `${Math.max(32, paddingY)}px` } as CSSProperties}
    >
      {marker}
      <SectionAnimation variant={theme.sectionAnimation} index={index}>
        <div
          className={`invitation-section-content ${shadowClass[style.shadow || "none"] || ""} ${backgroundClass[style.background || "default"] || ""}`}
          style={surfaceStyle}
        >
          {style.customTitle && (
            <header className="invitation-section-custom-title">
              <span aria-hidden="true" style={{ color: accentColor }}>0{index + 1}</span>
              <h2>{style.customTitle}</h2>
              <i style={{ backgroundColor: accentColor }} />
            </header>
          )}
          {item.node}
        </div>
      </SectionAnimation>
    </article>
  );
}

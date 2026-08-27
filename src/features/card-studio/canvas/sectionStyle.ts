import type { CSSProperties } from "react";
import type { CardSectionBackground } from "../schema/types";

/** CSS background section — common to editor canvas and public renderer. */
export function sectionBackgroundStyle(bg: CardSectionBackground): CSSProperties {
  const css: CSSProperties = { background: bg.color };
  if (bg.gradient.enabled) {
    css.background = `linear-gradient(${bg.gradient.angle}deg, ${bg.gradient.from}, ${bg.gradient.to})`;
  }
  return css;
}

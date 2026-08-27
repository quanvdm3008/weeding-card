import type { CSSProperties } from "react";
import type { CardComponentStyle } from "../schema/types";

/** Map CardComponentStyle → CSS for the component's box. */
export function boxStyleFromCard(style: CardComponentStyle): CSSProperties {
  const css: CSSProperties = {
    opacity: style.opacity,
    borderRadius: style.radius,
    padding: style.padding,
  };
  if (style.background) css.background = style.background;
  if (style.gradient.enabled) {
    css.background = `linear-gradient(${style.gradient.angle}deg, ${style.gradient.from}, ${style.gradient.to})`;
  }
  if (style.border.enabled) {
    css.border = `${style.border.width}px ${style.border.style} ${style.border.color}`;
  }
  if (style.shadow.enabled) {
    const s = style.shadow;
    css.boxShadow = `${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}`;
  }
  if (style.blur > 0) css.backdropFilter = `blur(${style.blur}px)`;
  return css;
}

/** Map the typography part of the style → CSS for text content. */
export function textStyleFromCard(style: CardComponentStyle): CSSProperties {
  return {
    color: style.color,
    fontFamily: fontFamilyStack(style.fontFamily),
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    fontStyle: style.fontStyle,
    textAlign: style.textAlign,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
  };
}

/** Fonts are preloaded in the app (index.css) — for typography dropdown. */
export const CARD_FONT_OPTIONS = [
  { value: "Inter", label: "Inter (modern)" },
  { value: "Playfair Display", label: "Playfair Display (serif sang)" },
  { value: "Cormorant Garamond", label: "Cormorant Garamond (classic)" },
  { value: "Great Vibes", label: "Great Vibes (handwritten)" },
  { value: "Poppins", label: "Poppins (round)" },
] as const;

export function fontFamilyStack(family: string): string {
  switch (family) {
    case "Playfair Display":
      return "'Playfair Display', serif";
    case "Cormorant Garamond":
      return "'Cormorant Garamond', serif";
    case "Great Vibes":
      return "'Great Vibes', cursive";
    case "Poppins":
      return "'Poppins', sans-serif";
    default:
      return "'Inter', sans-serif";
  }
}

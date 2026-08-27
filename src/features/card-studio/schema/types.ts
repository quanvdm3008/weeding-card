/**
 * Card Studio — editor's JSON data model (Builder V2).
 *
 * Guidelines: frontend does NOT save raw HTML. The entire editor state is a JSON document
 * (Page → Section → Component) — the backend only persists this JSON string (column `card_document`),
 * The frontend rebuilds the page from JSON so the template can be versioned/migrated.
 *
 * Coordinates using "design space": fixed width CARD_DESIGN_WIDTH (design px),
 * When rendering publicly, the entire card scales according to the viewport width → WYSIWYG for all devices.
 */

export const CARD_DESIGN_WIDTH = 800;
export const CARD_SCHEMA_VERSION = 1;

export type DeviceKind = "desktop" | "tablet" | "mobile";

export interface CardPosition {
  x: number;
  y: number;
}

export interface CardSize {
  width: number;
  height: number;
}

export interface CardShadow {
  enabled: boolean;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
}

export interface CardBorder {
  enabled: boolean;
  width: number;
  style: "solid" | "dashed" | "dotted" | "double";
  color: string;
}

export interface CardGradient {
  enabled: boolean;
  from: string;
  to: string;
  angle: number;
}

/** General styles are supported by all components — the inspector on the right directly adjusts these fields. */
export interface CardComponentStyle {
  opacity: number; // 0..1
  radius: number; // px
  border: CardBorder;
  shadow: CardShadow;
  blur: number; /* px backdrop-ish blur on the element itself*/
  padding: number; // px
  margin: number; /* px — used for auxiliary layout (block components)*/
  background: string; /* "" = transparent*/
  gradient: CardGradient; /* overlay the background when enabled*/
  color: string; /* main text/icon color*/
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fontStyle: "normal" | "italic";
  textAlign: "left" | "center" | "right";
  lineHeight: number;
  letterSpacing: number;
}

export type CardAnimationType =
  | "none"
  | "fade"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "zoom-in"
  | "zoom-out"
  | "rotate-in"
  | "bounce";

export interface CardAnimationSpec {
  type: CardAnimationType;
  duration: number; /* second*/
  delay: number; /* second*/
  easing: "ease-out" | "ease-in" | "ease-in-out" | "linear" | "spring";
}

/** Infinite loop effect — make the component "live" continuously on the card page. */
export type CardLoopAnimationType =
  | "none"
  | "float" /* floating up and down*/
  | "pulse" /* Slightly inflates rhythmically*/
  | "heartbeat" /* beating like a heartbeat*/
  | "sway" /* swing back and forth*/
  | "spin" /* rotate evenly*/
  | "twinkle" /* sparkles dimly*/
  | "depth-float" /* drifting lightly in 3D depth*/
  | "perspective-sway"; /* tilted in 3D perspective*/

export interface CardLoopSpec {
  type: CardLoopAnimationType;
  /** Cycle 1 loop (seconds). */
  duration: number;
}

export interface CardAnimation {
  entrance: CardAnimationSpec;
  exit: CardAnimationSpec;
  loop: CardLoopSpec;
}

/** Hide/show by device; overrides for separate layout of each breakpoint (schema v2+). */
export interface CardResponsive {
  hiddenOn: DeviceKind[];
}

export interface CardComponent {
  id: string;
  type: string; // Key in the component registry (text/image/shape/etc.).
  name: string; /* name displayed in the Layer Panel*/
  parentId: string; /* id of the section or group containing it*/
  order: number; /* z-order in parent (big = top)*/
  position: CardPosition; /* px design-space, relative to parent*/
  size: CardSize;
  rotation: number; /* degree*/
  locked: boolean;
  hidden: boolean;
  style: CardComponentStyle;
  content: Record<string, unknown>; /* Separate payload by type — validated by registry*/
  animation: CardAnimation;
  responsive: CardResponsive;
  metadata: Record<string, unknown>;
}

export interface CardSectionBackground {
  color: string;
  gradient: CardGradient;
  imageUrl: string;
  imageOpacity: number; // 0..1
}

export interface CardSection {
  id: string;
  name: string;
  order: number;
  height: number; // px design-space
  background: CardSectionBackground;
  /** Hide section on any device (responsive visibility at section level). */
  hiddenOn: DeviceKind[];
}

export interface CardPage {
  id: string;
  name: string;
  sections: CardSection[];
  components: CardComponent[]; /* flat — parent/child relationship via parentId (easy to diff/migrate)*/
}

export interface CardDocumentSettings {
  /** When true, the public card page renders this design instead of the classic template. */
  showOnPublicPage: boolean;
  /** Background color outside the card (letterbox) when the viewport is wider than the card. */
  outerBackground: string;
}

export interface CardDocument {
  schemaVersion: number;
  id: string;
  name: string;
  pages: CardPage[];
  settings: CardDocumentSettings;
  metadata: Record<string, unknown>;
}

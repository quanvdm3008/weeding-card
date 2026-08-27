import type {
  CardAnimation,
  CardComponent,
  CardComponentStyle,
  CardDocument,
  CardPage,
  CardSection,
  CardSectionBackground,
} from "./types";
import { CARD_DESIGN_WIDTH, CARD_SCHEMA_VERSION } from "./types";

let idCounter = 0;

/** Id is short, unique enough within 1 document (no need for standard UUID). */
export function newCardId(prefix: string): string {
  idCounter = (idCounter + 1) % 0xffff;
  return `${prefix}-${Date.now().toString(36)}-${idCounter.toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}

export function defaultStyle(overrides: Partial<CardComponentStyle> = {}): CardComponentStyle {
  return {
    opacity: 1,
    radius: 0,
    border: { enabled: false, width: 1, style: "solid", color: "#E8B4B8" },
    shadow: { enabled: false, x: 0, y: 8, blur: 24, spread: 0, color: "rgba(0,0,0,0.15)" },
    blur: 0,
    padding: 0,
    margin: 0,
    background: "",
    gradient: { enabled: false, from: "#E8B4B8", to: "#FDFBF7", angle: 135 },
    color: "#4A3F3C",
    fontFamily: "Inter",
    fontSize: 18,
    fontWeight: 400,
    fontStyle: "normal",
    textAlign: "center",
    lineHeight: 1.5,
    letterSpacing: 0,
    ...overrides,
  };
}

export function defaultAnimation(): CardAnimation {
  return {
    entrance: { type: "fade", duration: 0.8, delay: 0, easing: "ease-out" },
    exit: { type: "none", duration: 0.4, delay: 0, easing: "ease-in" },
    loop: { type: "none", duration: 3 },
  };
}

export function defaultSectionBackground(
  overrides: Partial<CardSectionBackground> = {}
): CardSectionBackground {
  return {
    color: "#FDFBF7",
    gradient: { enabled: false, from: "#FDFBF7", to: "#F5E6E8", angle: 180 },
    imageUrl: "",
    imageOpacity: 1,
    ...overrides,
  };
}

export function createSection(partial: Partial<CardSection> = {}): CardSection {
  return {
    id: newCardId("sec"),
    name: "New sections",
    order: 0,
    height: 600,
    background: defaultSectionBackground(),
    hiddenOn: [],
    ...partial,
  };
}

export function createComponent(
  type: string,
  parentId: string,
  partial: Partial<CardComponent> = {}
): CardComponent {
  return {
    id: newCardId("cmp"),
    type,
    name: type,
    parentId,
    order: 0,
    position: { x: 100, y: 100 },
    size: { width: 200, height: 100 },
    rotation: 0,
    locked: false,
    hidden: false,
    style: defaultStyle(),
    content: {},
    animation: defaultAnimation(),
    responsive: { hiddenOn: [] },
    metadata: {},
    ...partial,
  };
}

export function createEmptyDocument(name = "My card"): CardDocument {
  const hero = createSection({ name: "Opening", order: 0, height: 900 });
  const page: CardPage = {
    id: newCardId("page"),
    name: "Page 1",
    sections: [hero],
    components: [],
  };
  return {
    schemaVersion: CARD_SCHEMA_VERSION,
    id: newCardId("doc"),
    name,
    pages: [page],
    settings: { showOnPublicPage: false, outerBackground: "#F5F0EB" },
    metadata: {},
  };
}

export { CARD_DESIGN_WIDTH };

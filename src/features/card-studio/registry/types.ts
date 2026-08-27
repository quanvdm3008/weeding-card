import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import type { CardComponent } from "../schema/types";

/**
 * Plugin registry — add new component types WITHOUT editing editor core:
 * create a file in registry/components/, call registerCardComponent(), import into index.ts.
 * Editor (canvas/library/inspector/renderer) only reads through the registry.
 */

/** Render context: editor (static, placeholder for dynamic widget) vs public (real run). */
export interface CardRenderContext {
  mode: "editor" | "public";
  /** Public greeting slug — dynamic widget (RSVP/guestbook) needed to call API. */
  slug?: string;
  /** Current scale (public renderer scale according to viewport) — component needs to know to draw 1px strokes. */
  scale: number;
}

export interface CardComponentRendererProps {
  component: CardComponent;
  context: CardRenderContext;
}

/** Describe a field in the Inspector — the inspector renders the form automatically from this list. */
export type InspectorFieldType =
  | "text"
  | "textarea"
  | "number"
  | "slider"
  | "color"
  | "select"
  | "toggle"
  | "url"
  | "date"
  | "datetime"
  | "image-list"
  | "item-list";

export interface InspectorSelectOption {
  value: string;
  label: string;
}

export interface InspectorField {
  /** Key in component.content. */
  key: string;
  label: string;
  type: InspectorFieldType;
  options?: InspectorSelectOption[]; // Select-field choices.
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  /** With item-list: child columns of each item. */
  itemFields?: { key: string; label: string; type: "text" | "textarea" }[];
}

export interface CardComponentDefinition {
  type: string;
  /** Vietnamese labels are displayed in the component library. */
  label: string;
  icon: LucideIcon;
  /** Group in library: content | media | decor | widgets */
  category: "content" | "Media" | "decor" | "widget";
  defaultSize: { width: number; height: number };
  /** default content when dragged onto canvas. */
  defaultContent: Record<string, unknown>;
  /** default override style (overrides the general defaultStyle). */
  defaultStyle?: Partial<CardComponent["style"]>;
  /** Default name in layer panel. */
  defaultName: string;
  /** Type's own content field — displayed in the Inspector's "Content" tab. */
  inspector: InspectorField[];
  /** Does the Typography group appear in the inspector (component has text). */
  supportsTypography?: boolean;
  /** Keep aspect ratio when resizing with corner handle (image/sticker/QR). */
  preserveAspect?: boolean;
  Renderer: ComponentType<CardComponentRendererProps>;
}

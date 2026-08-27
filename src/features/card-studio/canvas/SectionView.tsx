import { useMemo, useRef, type DragEvent, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import type { CardSection } from "../schema/types";
import { CARD_DESIGN_WIDTH } from "../schema/types";
import { useEditorStore } from "../store/editorStore";
import { useInteractionStore } from "../store/interactionStore";
import * as ops from "../store/documentOps";
import { ComponentView } from "./ComponentView";
import { SelectionOverlay } from "./SelectionOverlay";
import { sectionBackgroundStyle } from "./sectionStyle";
import { rectsIntersect, type Rect } from "./interactions";

interface Props {
  section: CardSection;
  zoom: number;
  isFirst: boolean;
  isLast: boolean;
}

export const LIBRARY_DRAG_MIME = "application/x-card-component-type";

/** 1 section on canvas: background + components + marquee + guides + toolbar section. */
export function SectionView({ section, zoom, isFirst, isLast }: Props) {
  const documentState = useEditorStore((s) => s.document);
  const activeSectionId = useEditorStore((s) => s.activeSectionId);
  const guides = useInteractionStore((s) => s.guides);
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<{ pointerId: number; startX: number; startY: number; moved: boolean } | null>(null);
  const heightDragRef = useRef<{ pointerId: number; startClientY: number; startHeight: number; started: boolean } | null>(null);
  const localMarquee = useInteractionStore((s) => s.marquee);

  const components = useMemo(
    () => ops.childrenOf(documentState, section.id),
    [documentState, section.id]
  );
  const isActive = activeSectionId === section.id;

  /** Pointer coordinates → section coordinates (design px). */
  const toLocal = (e: { clientX: number; clientY: number }) => {
    const rect = containerRef.current!.getBoundingClientRect();
    return { x: (e.clientX - rect.left) / zoom, y: (e.clientY - rect.top) / zoom };
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.button !== 0) return;
    const store = useEditorStore.getState();
    store.setActiveSection(section.id);
    if (!e.shiftKey) store.clearSelection();
    const p = toLocal(e);
    marqueeRef.current = { pointerId: e.pointerId, startX: p.x, startY: p.y, moved: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    const m = marqueeRef.current;
    if (!m || e.pointerId !== m.pointerId) return;
    const p = toLocal(e);
    if (!m.moved && Math.abs(p.x - m.startX) < 4 && Math.abs(p.y - m.startY) < 4) return;
    m.moved = true;
    const rect: Rect = {
      x: Math.min(m.startX, p.x),
      y: Math.min(m.startY, p.y),
      width: Math.abs(p.x - m.startX),
      height: Math.abs(p.y - m.startY),
    };
    useInteractionStore.getState().setMarquee({ ...rect, active: true });
    const hit = components
      .filter((c) => !c.hidden && !c.locked)
      .filter((c) =>
        rectsIntersect(rect, { x: c.position.x, y: c.position.y, width: c.size.width, height: c.size.height })
      )
      .map((c) => c.id);
    useEditorStore.getState().select(hit);
  };

  const onPointerUp = (e: ReactPointerEvent) => {
    const m = marqueeRef.current;
    if (!m || e.pointerId !== m.pointerId) return;
    marqueeRef.current = null;
    useInteractionStore.getState().setMarquee(null);
  };

  const onDragOver = (e: DragEvent) => {
    if (e.dataTransfer.types.includes(LIBRARY_DRAG_MIME)) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    }
  };

  const onDrop = (e: DragEvent) => {
    const type = e.dataTransfer.getData(LIBRARY_DRAG_MIME);
    if (!type) return;
    e.preventDefault();
    const p = toLocal(e);
    useEditorStore.getState().addComponent(type, section.id, p);
  };

  /* Drag the bottom edge to change the section height*/
  const startHeightDrag = (e: ReactPointerEvent) => {
    e.stopPropagation();
    heightDragRef.current = {
      pointerId: e.pointerId,
      startClientY: e.clientY,
      startHeight: section.height,
      started: false,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onHeightDragMove = (e: ReactPointerEvent) => {
    const d = heightDragRef.current;
    if (!d || e.pointerId !== d.pointerId) return;
    const store = useEditorStore.getState();
    if (!d.started) {
      d.started = true;
      store.beginTransient();
    }
    const dh = (e.clientY - d.startClientY) / zoom;
    store.updateTransient((doc) =>
      ops.updateSection(doc, section.id, (s) => {
        s.height = Math.max(120, Math.round(d.startHeight + dh));
      })
    );
  };
  const onHeightDragUp = (e: ReactPointerEvent) => {
    const d = heightDragRef.current;
    if (!d || e.pointerId !== d.pointerId) return;
    heightDragRef.current = null;
    if (d.started) useEditorStore.getState().commitTransient();
  };

  const sectionGuides = guides.filter((g) => g.sectionId === section.id);
  const store = useEditorStore.getState();

  return (
    <div className="relative group/section" style={{ width: CARD_DESIGN_WIDTH }}>
      {/* Toolbar section (left) — appears on hover/active */}
      <div
        className={`absolute -left-11 top-2 flex flex-col gap-1 transition-opacity ${
          isActive ? "opacity-100" : "opacity-0 group-hover/section:opacity-100"
        }`}
        style={{ transform: `scale(${1 / zoom})`, transformOrigin: "top right" }}
      >
        <button
          className="w-8 h-8 rounded-md bg-card border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30"
          disabled={isFirst}
          onClick={() => store.moveSection(section.id, -1)}
          title="Bring up the section"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <button
          className="w-8 h-8 rounded-md bg-card border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30"
          disabled={isLast}
          onClick={() => store.moveSection(section.id, 1)}
          title="Bring the section down"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
        <button
          className="w-8 h-8 rounded-md bg-card border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-destructive disabled:opacity-30"
          disabled={isFirst && isLast}
          onClick={() => store.removeSection(section.id)}
          title="Delete section"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Section name label. */}
      <div
        className={`absolute left-2 -top-6 text-[11px] font-medium tracking-wide px-2 py-0.5 rounded bg-card border border-border text-muted-foreground ${
          isActive ? "opacity-100" : "opacity-0 group-hover/section:opacity-100"
        }`}
        style={{ transform: `scale(${1 / zoom})`, transformOrigin: "bottom left" }}
      >
        {section.name} · {Math.round(section.height)}px
      </div>

      <div
        ref={containerRef}
        data-section-id={section.id}
        className={`relative overflow-hidden ${isActive ? "ring-1 ring-primary/40" : ""}`}
        style={{ width: CARD_DESIGN_WIDTH, height: section.height, ...sectionBackgroundStyle(section.background) }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        {section.background.imageUrl && (
          <img
            src={section.background.imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ opacity: section.background.imageOpacity }}
            draggable={false}
          />
        )}

        {components.map((c) => (
          <ComponentView key={c.id} component={c} section={section} zoom={zoom} />
        ))}

        {/* Smart guides */}
        {sectionGuides.map((g, i) =>
          g.orientation === "v" ? (
            <div
              key={i}
              className="absolute top-0 bottom-0 pointer-events-none bg-pink-500"
              style={{ left: g.position, width: Math.max(1, 1 / zoom) }}
            />
          ) : (
            <div
              key={i}
              className="absolute left-0 right-0 pointer-events-none bg-pink-500"
              style={{ top: g.position, height: Math.max(1, 1 / zoom) }}
            />
          )
        )}

        {/* Marquee */}
        {localMarquee?.active && isActive && (
          <div
            className="absolute pointer-events-none border border-primary bg-primary/10"
            style={{
              left: localMarquee.x,
              top: localMarquee.y,
              width: localMarquee.width,
              height: localMarquee.height,
            }}
          />
        )}

        <SelectionOverlay section={section} zoom={zoom} />
      </div>

      {/* Section height resize handle. */}
      <div
        className="absolute left-0 right-0 -bottom-1 h-2 cursor-ns-resize flex items-center justify-center opacity-0 group-hover/section:opacity-100"
        onPointerDown={startHeightDrag}
        onPointerMove={onHeightDragMove}
        onPointerUp={onHeightDragUp}
        title="Drag to change section height"
      >
        <div className="w-16 h-1 rounded-full bg-primary/60" />
      </div>
    </div>
  );
}

import { useMemo, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { RotateCw } from "lucide-react";
import type { CardSection } from "../schema/types";
import { useEditorStore } from "../store/editorStore";
import { getCardComponentDefinition } from "../registry/registry";
import * as ops from "../store/documentOps";
import { resizeRect, rotationFromPointer, type Rect, type ResizeHandle } from "./interactions";

interface Props {
  section: CardSection;
  zoom: number;
}

const HANDLES: { handle: ResizeHandle; cursor: string; style: React.CSSProperties }[] = [
  { handle: "nw", cursor: "nwse-resize", style: { left: -5, top: -5 } },
  { handle: "n", cursor: "ns-resize", style: { left: "calc(50% - 5px)", top: -5 } },
  { handle: "ne", cursor: "nesw-resize", style: { right: -5, top: -5 } },
  { handle: "e", cursor: "ew-resize", style: { right: -5, top: "calc(50% - 5px)" } },
  { handle: "se", cursor: "nwse-resize", style: { right: -5, bottom: -5 } },
  { handle: "s", cursor: "ns-resize", style: { left: "calc(50% - 5px)", bottom: -5 } },
  { handle: "sw", cursor: "nesw-resize", style: { left: -5, bottom: -5 } },
  { handle: "w", cursor: "ew-resize", style: { left: -5, top: "calc(50% - 5px)" } },
];

/** Selection frame + resize/rotate handle, drawing in section coordinates (already in the scale area). */
export function SelectionOverlay({ section, zoom }: Props) {
  const documentState = useEditorStore((s) => s.document);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const boxRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    kind: "resize" | "rotate";
    handle?: ResizeHandle;
    startClientX: number;
    startClientY: number;
    startRect: Rect;
    preserveAspect: boolean;
    started: boolean;
    centerClient?: { x: number; y: number };
  } | null>(null);

  const selectedInSection = useMemo(
    () =>
      selectedIds
        .map((id) => ops.findComponent(documentState, id))
        .filter((c) => !!c && ops.sectionIdOf(documentState, c.id) === section.id),
    [documentState, selectedIds, section.id]
  );

  if (!selectedInSection.length) return null;

  const rects = selectedInSection.map((c) => {
    const abs = ops.absolutePosition(documentState, c!.id);
    return { c: c!, rect: { x: abs.x, y: abs.y, width: c!.size.width, height: c!.size.height } };
  });

  const single = rects.length === 1 ? rects[0] : null;

  const bbox: Rect = {
    x: Math.min(...rects.map((r) => r.rect.x)),
    y: Math.min(...rects.map((r) => r.rect.y)),
    width: Math.max(...rects.map((r) => r.rect.x + r.rect.width)) - Math.min(...rects.map((r) => r.rect.x)),
    height: Math.max(...rects.map((r) => r.rect.y + r.rect.height)) - Math.min(...rects.map((r) => r.rect.y)),
  };

  const startResize = (e: ReactPointerEvent, handle: ResizeHandle) => {
    if (!single || single.c.locked) return;
    e.stopPropagation();
    const def = getCardComponentDefinition(single.c.type);
    dragRef.current = {
      pointerId: e.pointerId,
      kind: "resize",
      handle,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startRect: { x: single.c.position.x, y: single.c.position.y, ...single.c.size },
      preserveAspect: !!def?.preserveAspect,
      started: false,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const startRotate = (e: ReactPointerEvent) => {
    if (!single || single.c.locked) return;
    e.stopPropagation();
    const box = boxRef.current?.getBoundingClientRect();
    if (!box) return;
    dragRef.current = {
      pointerId: e.pointerId,
      kind: "rotate",
      startClientX: e.clientX,
      startClientY: e.clientY,
      startRect: { x: single.c.position.x, y: single.c.position.y, ...single.c.size },
      preserveAspect: false,
      started: false,
      centerClient: { x: box.left + box.width / 2, y: box.top + box.height / 2 },
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    const drag = dragRef.current;
    if (!drag || e.pointerId !== drag.pointerId || !single) return;
    const store = useEditorStore.getState();
    if (!drag.started) {
      drag.started = true;
      store.beginTransient();
    }

    if (drag.kind === "resize" && drag.handle) {
      const dx = (e.clientX - drag.startClientX) / zoom;
      const dy = (e.clientY - drag.startClientY) / zoom;
      const preserve = drag.preserveAspect || e.shiftKey;
      const next = resizeRect(drag.startRect, drag.handle, dx, dy, preserve);
      store.updateTransient((doc) =>
        ops.updateComponents(doc, [single.c.id], (c) => {
          c.position = { x: next.x, y: next.y };
          c.size = { width: next.width, height: next.height };
        })
      );
    } else if (drag.kind === "rotate" && drag.centerClient) {
      const angle = rotationFromPointer(drag.centerClient, { x: e.clientX, y: e.clientY }, e.shiftKey);
      store.updateTransient((doc) =>
        ops.updateComponents(doc, [single.c.id], (c) => {
          c.rotation = angle;
        })
      );
    }
  };

  const onPointerUp = (e: ReactPointerEvent) => {
    const drag = dragRef.current;
    if (!drag || e.pointerId !== drag.pointerId) return;
    dragRef.current = null;
    if (drag.started) useEditorStore.getState().commitTransient();
  };

  const handleSizePx = 10 / zoom;

  return (
    <>
      {/* Border each item when multi-select */}
      {rects.length > 1 &&
        rects.map(({ c, rect }) => (
          <div
            key={c.id}
            className="absolute pointer-events-none border border-primary/70"
            style={{ left: rect.x, top: rect.y, width: rect.width, height: rect.height }}
          />
        ))}

      {/* Main frame (single: by component, multi: bounding box) */}
      <div
        ref={boxRef}
        className="absolute pointer-events-none"
        style={{
          left: single ? single.rect.x : bbox.x,
          top: single ? single.rect.y : bbox.y,
          width: single ? single.rect.width : bbox.width,
          height: single ? single.rect.height : bbox.height,
          transform: single && single.c.rotation ? `rotate(${single.c.rotation}deg)` : undefined,
          transformOrigin: "center center",
          border: `${1.5 / zoom}px solid hsl(var(--primary))`,
          zIndex: 50,
        }}
      >
        {single && !single.c.locked && (
          <>
            {HANDLES.map(({ handle, cursor, style }) => (
              <div
                key={handle}
                className="absolute bg-white border border-primary rounded-sm pointer-events-auto"
                style={{ ...style, width: handleSizePx, height: handleSizePx, cursor, borderWidth: 1.5 / zoom }}
                onPointerDown={(e) => startResize(e, handle)}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
              />
            ))}
            <div
              className="absolute pointer-events-auto flex items-center justify-center bg-white border border-primary rounded-full shadow-sm"
              style={{
                left: `calc(50% - ${12 / zoom}px)`,
                top: -32 / zoom,
                width: 24 / zoom,
                height: 24 / zoom,
                cursor: "grab",
              }}
              onPointerDown={startRotate}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              title="Rotate (hold Shift to rotate in 15° steps)"
            >
              <RotateCw style={{ width: 14 / zoom, height: 14 / zoom }} className="text-primary" />
            </div>
          </>
        )}
      </div>
    </>
  );
}

import { useMemo, useRef, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import type { CardComponent, CardSection } from "../schema/types";
import { getCardComponentDefinition } from "../registry/registry";
import { textStyleFromCard } from "../registry/styleUtils";
import { useEditorStore } from "../store/editorStore";
import { useInteractionStore } from "../store/interactionStore";
import * as ops from "../store/documentOps";
import { computeSnap, snapToGrid, type Rect } from "./interactions";

interface Props {
  component: CardComponent;
  section: CardSection;
  zoom: number;
}

const SNAP_THRESHOLD = 6;

/** Render a component in the editor: select, drag (with smart guides), edit inline text, recursively group. */
export function ComponentView({ component, section, zoom }: Props) {
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const editingTextId = useEditorStore((s) => s.editingTextId);
  const documentState = useEditorStore((s) => s.document);
  const isSelected = selectedIds.includes(component.id);
  const isEditingText = editingTextId === component.id;
  const children = useMemo(
    () =>
      component.type === "group"
        ? documentState.pages[0].components
            .filter((c) => c.parentId === component.id)
            .sort((a, b) => a.order - b.order)
        : null,
    [documentState, component.type, component.id]
  );
  const dragRef = useRef<{
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startPositions: Map<string, { x: number; y: number }>;
    primaryStartAbs: Rect;
    siblingRects: Rect[];
    started: boolean;
  } | null>(null);

  const def = getCardComponentDefinition(component.type);
  if (!def || component.hidden) return null;

  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.button !== 0 || isEditingText) return;
    e.stopPropagation();
    const store = useEditorStore.getState();

    /* Select before dragging (shift = add/subtract from selection)*/
    if (e.shiftKey) {
      store.select([component.id], true);
      return; /* shift-click only selects, does not drag the whole cluster at once*/
    }
    if (!store.selectedIds.includes(component.id)) {
      store.select([component.id]);
    }
    if (component.locked) return;

    const doc = useEditorStore.getState().document;
    const selection = useEditorStore.getState().selectedIds;
    const startPositions = new Map<string, { x: number; y: number }>();
    for (const id of selection) {
      const c = ops.findComponent(doc, id);
      if (c && !c.locked) startPositions.set(id, { ...c.position });
    }
    const abs = ops.absolutePosition(doc, component.id);
    const selectedSet = new Set(selection.flatMap((id) => [id, ...ops.descendantsOf(doc, id).map((d) => d.id)]));
    const siblingRects: Rect[] = ops
      .childrenOf(doc, section.id)
      .filter((c) => !selectedSet.has(c.id) && !c.hidden)
      .map((c) => ({ x: c.position.x, y: c.position.y, width: c.size.width, height: c.size.height }));

    dragRef.current = {
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startPositions,
      primaryStartAbs: { x: abs.x, y: abs.y, width: component.size.width, height: component.size.height },
      siblingRects,
      started: false,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    const drag = dragRef.current;
    if (!drag || e.pointerId !== drag.pointerId) return;
    const store = useEditorStore.getState();
    const interaction = useInteractionStore.getState();

    const rawDx = (e.clientX - drag.startClientX) / zoom;
    const rawDy = (e.clientY - drag.startClientY) / zoom;
    if (!drag.started) {
      if (Math.abs(rawDx) < 3 && Math.abs(rawDy) < 3) return;
      drag.started = true;
      store.beginTransient();
    }

    let dx = rawDx;
    let dy = rawDy;
    if (interaction.snapEnabled) {
      const proposedX = snapToGrid(drag.primaryStartAbs.x + rawDx);
      const proposedY = snapToGrid(drag.primaryStartAbs.y + rawDy);
      const proposed: Rect = { ...drag.primaryStartAbs, x: proposedX, y: proposedY };
      const snap = computeSnap(
        proposed,
        drag.siblingRects,
        800,
        section.height,
        section.id,
        SNAP_THRESHOLD
      );
      dx = proposedX + snap.dx - drag.primaryStartAbs.x;
      dy = proposedY + snap.dy - drag.primaryStartAbs.y;
      interaction.setGuides(snap.guides);
    } else {
      interaction.setGuides([]);
    }

    store.updateTransient((doc) =>
      ops.updateComponents(doc, [...drag.startPositions.keys()], (c) => {
        const start = drag.startPositions.get(c.id)!;
        c.position = { x: Math.round(start.x + dx), y: Math.round(start.y + dy) };
      })
    );
  };

  const onPointerUp = (e: ReactPointerEvent) => {
    const drag = dragRef.current;
    if (!drag || e.pointerId !== drag.pointerId) return;
    dragRef.current = null;
    useInteractionStore.getState().setGuides([]);
    if (drag.started) useEditorStore.getState().commitTransient();
  };

  const onDoubleClick = (e: ReactPointerEvent | React.MouseEvent) => {
    e.stopPropagation();
    if (component.locked) return;
    if (component.type === "text") {
      useEditorStore.getState().setEditingText(component.id);
    }
    /* Double click on photo/frame/collection → open and select photo (import from original card or URL)*/
    if (component.type === "image" || component.type === "frame" || component.type === "gallery") {
      useInteractionStore.getState().openImagePicker(component.id);
    }
    if (component.type === "group") {
      /* Double into group → select the child below the cursor (simple: select the first child)*/
      const firstChild = ops.childrenOf(useEditorStore.getState().document, component.id)[0];
      if (firstChild) useEditorStore.getState().select([firstChild.id]);
    }
  };

  const commitText = (value: string) => {
    const store = useEditorStore.getState();
    store.apply((doc) =>
      ops.updateComponents(doc, [component.id], (c) => {
        c.content = { ...c.content, text: value };
      })
    );
    store.setEditingText(null);
  };

  const wrapperStyle: CSSProperties = {
    position: "absolute",
    left: component.position.x,
    top: component.position.y,
    width: component.size.width,
    height: component.size.height,
    transform: component.rotation ? `rotate(${component.rotation}deg)` : undefined,
    transformOrigin: "center center",
    cursor: component.locked ? "default" : "move",
    outline: isSelected ? "none" : undefined,
  };

  return (
    <div
      data-component-id={component.id}
      style={wrapperStyle}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onDoubleClick={onDoubleClick}
      className={component.locked ? "" : "hover:[outline:1.5px_dashed_rgba(232,180,184,0.9)]"}
    >
      {isEditingText ? (
        <textarea
          autoFocus
          defaultValue={String(component.content.text ?? "")}
          className="w-full h-full resize-none bg-white/70 outline outline-2 outline-primary rounded-sm p-1"
          style={{ ...textStyleFromCard(component.style), fontSize: component.style.fontSize }}
          onBlur={(e) => commitText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") commitText((e.target as HTMLTextAreaElement).value);
            e.stopPropagation();
          }}
          onPointerDown={(e) => e.stopPropagation()}
        />
      ) : (
        <div className="w-full h-full pointer-events-none">
          <def.Renderer component={component} context={{ mode: "editor", scale: zoom }} />
        </div>
      )}
      {/* Render group children recursively and restore pointer events for child selection. */}
      {children?.map((child) => (
        <ComponentView key={child.id} component={child} section={section} zoom={zoom} />
      ))}
    </div>
  );
}

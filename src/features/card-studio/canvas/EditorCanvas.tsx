import { useMemo, useRef, type WheelEvent } from "react";
import { Plus } from "lucide-react";
import { CARD_DESIGN_WIDTH } from "../schema/types";
import { useEditorStore } from "../store/editorStore";
import { SectionView } from "./SectionView";

/**
 * Central canvas area: scroll freely, zoom (Ctrl+mouse wheel), stack section in order.
 * Card renders at fixed design-width; device preview = viewport scale (WYSIWYG).
 */
export function EditorCanvas() {
  const documentState = useEditorStore((s) => s.document);
  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sections = useMemo(
    () => [...documentState.pages[0].sections].sort((a, b) => a.order - b.order),
    [documentState]
  );
  const totalHeight = sections.reduce((sum, s) => sum + s.height, 0);

  const onWheel = (e: WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    setZoom(zoom * (e.deltaY > 0 ? 0.92 : 1.08));
  };

  const clearIfBackground = (e: React.PointerEvent) => {
    if (e.target === e.currentTarget) {
      useEditorStore.getState().clearSelection();
    }
  };

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-auto min-w-0"
      /* "Background color on card" in Design must be visible in the editor (previously only applied on public pages).*/
      /* No custom background has been set yet → design-tool style translucent dot-grid (Figma/Canva) replaces the plain gray background.*/
      style={
        documentState.settings.outerBackground
          ? { background: documentState.settings.outerBackground }
          : {
              backgroundColor: "hsl(var(--muted))",
              backgroundImage: "radial-gradient(hsl(var(--foreground) / 0.08) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }
      }
      onWheel={onWheel}
      onPointerDown={clearIfBackground}
    >
      <div
        className="mx-auto py-14 px-16 w-fit"
        onPointerDown={clearIfBackground}
      >
        <div
          style={{
            width: CARD_DESIGN_WIDTH * zoom,
            height: totalHeight * zoom + 60,
          }}
          onPointerDown={clearIfBackground}
        >
          <div
            className="shadow-2xl ring-1 ring-black/5"
            style={{
              width: CARD_DESIGN_WIDTH,
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
            }}
          >
            {sections.map((section, i) => (
              <SectionView
                key={section.id}
                section={section}
                zoom={zoom}
                isFirst={i === 0}
                isLast={i === sections.length - 1}
              />
            ))}

            {/* Add a section at the end of the page. */}
            <div className="flex justify-center py-4" style={{ width: CARD_DESIGN_WIDTH }}>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/60 transition"
                style={{ transform: `scale(${Math.max(1, 1 / zoom)})` }}
                onClick={() => useEditorStore.getState().addSection(sections[sections.length - 1]?.id)}
              >
                <Plus className="w-4 h-4" /> Add section
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

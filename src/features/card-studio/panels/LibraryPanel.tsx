import type { DragEvent } from "react";
import { listCardComponentDefinitions } from "../registry";
import { useEditorStore } from "../store/editorStore";
import { LIBRARY_DRAG_MIME } from "../canvas/SectionView";

const CATEGORY_LABELS: { key: "content" | "Media" | "decor" | "widget"; label: string }[] = [
  { key: "content", label: "Content" },
  { key: "Media", label: "Photos & Media" },
  { key: "decor", label: "Decorate" },
  { key: "widget", label: "Interact" },
];

/** Component library: drag and drop onto canvas or click to add to the currently selected section. */
export function LibraryPanel() {
  const definitions = listCardComponentDefinitions().filter((d) => d.type !== "group");

  const onDragStart = (e: DragEvent, type: string) => {
    e.dataTransfer.setData(LIBRARY_DRAG_MIME, type);
    e.dataTransfer.effectAllowed = "copy";
  };

  const addByClick = (type: string) => {
    const store = useEditorStore.getState();
    const sectionId = store.activeSectionId ?? store.document.pages[0].sections[0]?.id;
    if (sectionId) store.addComponent(type, sectionId);
  };

  return (
    <div className="flex flex-col gap-4 p-3">
      {CATEGORY_LABELS.map((cat) => {
        const items = definitions.filter((d) => d.category === cat.key);
        if (!items.length) return null;
        return (
          <div key={cat.key}>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-2">
              {cat.label}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {items.map((def) => {
                const Icon = def.icon;
                return (
                  <button
                    key={def.type}
                    draggable
                    onDragStart={(e) => onDragStart(e, def.type)}
                    onClick={() => addByClick(def.type)}
                    className="group flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl border border-border/70 bg-card/80 hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-grab active:cursor-grabbing active:translate-y-0"
                    title={`${def.label} — drag to canvas or click to add`}
                  >
                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:shadow-gold transition-all duration-200">
                      <Icon style={{ width: 15, height: 15 }} />
                    </span>
                    <span className="text-[11px] leading-tight text-center">{def.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

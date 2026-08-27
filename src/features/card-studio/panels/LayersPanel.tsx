import { useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, GripVertical, Lock, LockOpen } from "lucide-react";
import type { CardComponent, CardSection } from "../schema/types";
import { useEditorStore } from "../store/editorStore";
import * as ops from "../store/documentOps";
import { getCardComponentDefinition } from "../registry";

/** Layer Panel: section tree → component (top first), drag and drop to change z-order, lock/hide/rename. */
export function LayersPanel() {
  const documentState = useEditorStore((s) => s.document);
  const sections = useMemo(
    () => [...documentState.pages[0].sections].sort((a, b) => a.order - b.order),
    [documentState]
  );

  return (
    <div className="flex flex-col gap-1 p-2">
      {sections.map((section) => (
        <SectionLayers key={section.id} section={section} />
      ))}
    </div>
  );
}

function SectionLayers({ section }: { section: CardSection }) {
  const documentState = useEditorStore((s) => s.document);
  const activeSectionId = useEditorStore((s) => s.activeSectionId);
  const store = useEditorStore.getState();

  /* show the top layer first (descending order)*/
  const children = useMemo(
    () => ops.childrenOf(documentState, section.id).slice().reverse(),
    [documentState, section.id]
  );

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const displayIndex = children.findIndex((c) => c.id === over.id);
    if (displayIndex < 0) return;
    /* display descending → index in ascending list*/
    const ascIndex = children.length - 1 - displayIndex;
    store.apply((doc) => ops.reorderComponent(doc, String(active.id), ascIndex));
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <button
        className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between ${
          activeSectionId === section.id ? "bg-primary/10 text-foreground" : "bg-muted/50 text-muted-foreground hover:text-foreground"
        }`}
        onClick={() => {
          store.setActiveSection(section.id);
          store.clearSelection();
        }}
      >
        {section.name}
        <span className="font-normal opacity-60">{children.length}</span>
      </button>
      {children.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={children.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col">
              {children.map((c) => (
                <LayerRow key={c.id} component={c} depth={0} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

function LayerRow({ component, depth }: { component: CardComponent; depth: number }) {
  const documentState = useEditorStore((s) => s.document);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const store = useEditorStore.getState();
  const [renaming, setRenaming] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: component.id,
    disabled: depth > 0, // Only top-level sections are sortable; grouped children stay static.
  });

  const def = getCardComponentDefinition(component.type);
  const Icon = def?.icon;
  const isSelected = selectedIds.includes(component.id);
  const groupChildren =
    component.type === "group"
      ? documentState.pages[0].components
          .filter((c) => c.parentId === component.id)
          .sort((a, b) => b.order - a.order)
      : [];

  const commitRename = (value: string) => {
    setRenaming(false);
    if (value && value !== component.name) {
      store.apply((doc) => ops.updateComponents(doc, [component.id], (c) => (c.name = value)));
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
        className={`flex items-center gap-1 pr-2 py-1.5 text-sm border-t border-border/60 cursor-pointer ${
          isSelected ? "bg-primary/10" : "hover:bg-muted/60"
        }`}
        onClick={(e) => store.select([component.id], e.shiftKey)}
        onDoubleClick={() => setRenaming(true)}
      >
        <span
          className="px-1 text-muted-foreground/60 cursor-grab touch-none"
          style={{ marginLeft: depth * 14 }}
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-3.5 h-3.5" />
        </span>
        {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
        {renaming ? (
          <input
            autoFocus
            defaultValue={component.name}
            className="flex-1 min-w-0 h-6 px-1 text-sm border border-primary/50 rounded bg-background outline-none"
            onBlur={(e) => commitRename(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              e.stopPropagation();
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className={`flex-1 truncate ${component.hidden ? "opacity-40" : ""}`}>{component.name}</span>
        )}
        <button
          className="p-0.5 text-muted-foreground/70 hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation();
            store.apply((doc) => ops.updateComponents(doc, [component.id], (c) => (c.hidden = !c.hidden)));
          }}
          title={component.hidden ? "Presently" : "Hide"}
        >
          {component.hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
        <button
          className="p-0.5 text-muted-foreground/70 hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation();
            store.apply((doc) => ops.updateComponents(doc, [component.id], (c) => (c.locked = !c.locked)));
          }}
          title={component.locked ? "Unlock" : "Lock"}
        >
          {component.locked ? <Lock className="w-3.5 h-3.5" /> : <LockOpen className="w-3.5 h-3.5" />}
        </button>
      </div>
      {groupChildren.map((child) => (
        <LayerRow key={child.id} component={child} depth={depth + 1} />
      ))}
    </>
  );
}

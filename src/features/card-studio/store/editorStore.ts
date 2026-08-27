import { create } from "zustand";
import type { CardComponent, CardDocument, CardSection, DeviceKind } from "../schema/types";
import { createEmptyDocument } from "../schema/defaults";
import * as ops from "./documentOps";
import { commitSnapshot, executeCommand, mutationCommand, redoSnapshot, undoSnapshot } from "@/features/editor/domain/commands";

/**
 * Card Studio's central store.
 *
 * Undo/redo according to snapshot: all document changes go through `apply()` (1 step = 1 undo),
 * or `beginTransient()`/`updateTransient()`/`commitTransient()` pair for pull operation
 * continuous (drag/resize/rotate) — only 1 history entry for the entire drag chain.
 */

const HISTORY_LIMIT = 100;

export type SaveState = "idle" | "saving" | "saved" | "error";

interface EditorState {
  document: CardDocument;
  invitationId: string | null;
  selectedIds: string[];
  editingTextId: string | null;
  activeSectionId: string | null;
  clipboard: CardComponent[];
  zoom: number;
  device: DeviceKind;
  dirty: boolean;
  saveState: SaveState;
  past: CardDocument[];
  future: CardDocument[];
  transientBase: CardDocument | null;

  // lifecycle
  initialize: (doc: CardDocument | null, invitationId: string | null) => void;
  markSaved: () => void;
  setSaveState: (s: SaveState) => void;

  // document change core
  apply: (mutate: (doc: CardDocument) => CardDocument) => void;
  beginTransient: () => void;
  updateTransient: (mutate: (doc: CardDocument) => CardDocument) => void;
  commitTransient: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // selection
  select: (ids: string[], additive?: boolean) => void;
  clearSelection: () => void;
  setEditingText: (id: string | null) => void;
  setActiveSection: (id: string | null) => void;

  // component ops
  addComponent: (type: string, sectionId: string, position?: { x: number; y: number }) => void;
  updateSelected: (mutator: (c: CardComponent) => void) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  copySelected: () => void;
  paste: () => void;
  groupSelected: () => void;
  ungroupSelected: () => void;
  bringToFront: () => void;
  sendToBack: () => void;
  nudgeSelected: (dx: number, dy: number) => void;

  // section ops
  addSection: (afterSectionId?: string) => void;
  removeSection: (sectionId: string) => void;
  moveSection: (sectionId: string, direction: -1 | 1) => void;
  updateSection: (sectionId: string, mutator: (s: CardSection) => void) => void;

  // viewport
  setZoom: (zoom: number) => void;
  setDevice: (device: DeviceKind) => void;

  // settings
  setDocumentName: (name: string) => void;
  setShowOnPublicPage: (show: boolean) => void;
}

export const useEditorStore = create<EditorState>()((set, get) => ({
  document: createEmptyDocument(),
  invitationId: null,
  selectedIds: [],
  editingTextId: null,
  activeSectionId: null,
  clipboard: [],
  zoom: 0.9,
  device: "desktop",
  dirty: false,
  saveState: "idle",
  past: [],
  future: [],
  transientBase: null,

  initialize: (doc, invitationId) => {
    const document = doc ?? createEmptyDocument();
    set({
      document,
      invitationId,
      selectedIds: [],
      editingTextId: null,
      activeSectionId: document.pages[0]?.sections[0]?.id ?? null,
      past: [],
      future: [],
      dirty: false,
      saveState: "idle",
      transientBase: null,
    });
  },

  markSaved: () => set({ dirty: false, saveState: "saved" }),
  setSaveState: (saveState) => set({ saveState }),

  apply: (mutate) => {
    const { document, past } = get();
    const result = executeCommand(
      { present: document, past, future: get().future },
      mutationCommand("canvas-update", mutate),
      HISTORY_LIMIT,
    );
    if (result.present === document) return;
    set({
      document: result.present,
      past: result.past,
      future: result.future,
      dirty: true,
    });
  },

  beginTransient: () => {
    if (!get().transientBase) set({ transientBase: get().document });
  },

  updateTransient: (mutate) => {
    set({ document: mutate(get().document) });
  },

  commitTransient: () => {
    const { transientBase, document, past } = get();
    if (!transientBase) return;
    const result = commitSnapshot(
      { present: document, past, future: get().future },
      transientBase,
      HISTORY_LIMIT,
    );
    if (result.past === past) {
      set({ transientBase: null });
      return;
    }
    set({
      transientBase: null,
      past: result.past,
      future: result.future,
      dirty: true,
    });
  },

  undo: () => {
    const { past, future, document } = get();
    const result = undoSnapshot({ present: document, past, future }, HISTORY_LIMIT);
    if (result.present === document) return;
    set({
      document: result.present,
      past: result.past,
      future: result.future,
      dirty: true,
      selectedIds: get().selectedIds.filter((id) => !!ops.findComponent(result.present, id)),
    });
  },

  redo: () => {
    const { past, future, document } = get();
    const result = redoSnapshot({ present: document, past, future }, HISTORY_LIMIT);
    if (result.present === document) return;
    set({
      document: result.present,
      past: result.past,
      future: result.future,
      dirty: true,
      selectedIds: get().selectedIds.filter((id) => !!ops.findComponent(result.present, id)),
    });
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,

  select: (ids, additive = false) => {
    if (additive) {
      const current = new Set(get().selectedIds);
      for (const id of ids) {
        if (current.has(id)) current.delete(id);
        else current.add(id);
      }
      set({ selectedIds: [...current], editingTextId: null });
    } else {
      set({ selectedIds: ids, editingTextId: null });
    }
    const first = ids[0];
    if (first) {
      const sectionId = ops.sectionIdOf(get().document, first);
      if (sectionId) set({ activeSectionId: sectionId });
    }
  },

  clearSelection: () => set({ selectedIds: [], editingTextId: null }),
  setEditingText: (editingTextId) => set({ editingTextId }),
  setActiveSection: (activeSectionId) => set({ activeSectionId }),

  addComponent: (type, sectionId, position) => {
    let created: CardComponent | null = null;
    get().apply((doc) => {
      const result = ops.addComponentOfType(doc, type, sectionId, position);
      created = result.component;
      return result.doc;
    });
    if (created) set({ selectedIds: [(created as CardComponent).id], activeSectionId: sectionId });
  },

  updateSelected: (mutator) => {
    const ids = get().selectedIds;
    if (!ids.length) return;
    get().apply((doc) => ops.updateComponents(doc, ids, mutator));
  },

  deleteSelected: () => {
    const ids = get().selectedIds.filter((id) => {
      const c = ops.findComponent(get().document, id);
      return c && !c.locked;
    });
    if (!ids.length) return;
    get().apply((doc) => ops.removeComponents(doc, ids));
    set({ selectedIds: [] });
  },

  duplicateSelected: () => {
    const ids = get().selectedIds;
    if (!ids.length) return;
    let newIds: string[] = [];
    get().apply((doc) => {
      const result = ops.duplicateComponents(doc, ids);
      newIds = result.newIds;
      return result.doc;
    });
    set({ selectedIds: newIds });
  },

  copySelected: () => {
    const { document, selectedIds } = get();
    if (!selectedIds.length) return;
    const items: CardComponent[] = [];
    for (const id of selectedIds) {
      const c = ops.findComponent(document, id);
      if (!c) continue;
      items.push(structuredClone(c), ...ops.descendantsOf(document, id).map((d) => structuredClone(d)));
    }
    set({ clipboard: items });
  },

  paste: () => {
    const { clipboard, activeSectionId, document } = get();
    if (!clipboard.length) return;
    const sectionId = activeSectionId ?? document.pages[0].sections[0]?.id;
    if (!sectionId) return;
    let newIds: string[] = [];
    get().apply((doc) => {
      const result = ops.pasteComponents(doc, structuredClone(clipboard), sectionId);
      newIds = result.newIds;
      return result.doc;
    });
    set({ selectedIds: newIds });
  },

  groupSelected: () => {
    const ids = get().selectedIds;
    if (ids.length < 2) return;
    let groupId: string | null = null;
    get().apply((doc) => {
      const result = ops.groupComponents(doc, ids);
      groupId = result.groupId;
      return result.doc;
    });
    if (groupId) set({ selectedIds: [groupId] });
  },

  ungroupSelected: () => {
    const { document, selectedIds } = get();
    const group = selectedIds
      .map((id) => ops.findComponent(document, id))
      .find((c) => c?.type === "group");
    if (!group) return;
    let childIds: string[] = [];
    get().apply((doc) => {
      const result = ops.ungroupComponent(doc, group.id);
      childIds = result.childIds;
      return result.doc;
    });
    if (childIds.length) set({ selectedIds: childIds });
  },

  bringToFront: () => {
    const ids = get().selectedIds;
    if (ids.length) get().apply((doc) => ops.bringToFront(doc, ids));
  },

  sendToBack: () => {
    const ids = get().selectedIds;
    if (ids.length) get().apply((doc) => ops.sendToBack(doc, ids));
  },

  nudgeSelected: (dx, dy) => {
    const ids = get().selectedIds;
    if (!ids.length) return;
    get().apply((doc) =>
      ops.updateComponents(doc, ids, (c) => {
        if (c.locked) return;
        c.position = { x: c.position.x + dx, y: c.position.y + dy };
      })
    );
  },

  addSection: (afterSectionId) => {
    let created: CardSection | null = null;
    get().apply((doc) => {
      const result = ops.addSection(doc, afterSectionId);
      created = result.section;
      return result.doc;
    });
    if (created) set({ activeSectionId: (created as CardSection).id });
  },

  removeSection: (sectionId) => {
    get().apply((doc) => ops.removeSection(doc, sectionId));
    const doc = get().document;
    if (get().activeSectionId === sectionId) {
      set({ activeSectionId: doc.pages[0].sections[0]?.id ?? null });
    }
    set({ selectedIds: get().selectedIds.filter((id) => !!ops.findComponent(doc, id)) });
  },

  moveSection: (sectionId, direction) => {
    get().apply((doc) => ops.moveSection(doc, sectionId, direction));
  },

  updateSection: (sectionId, mutator) => {
    get().apply((doc) => ops.updateSection(doc, sectionId, mutator));
  },

  setZoom: (zoom) => set({ zoom: Math.min(2.5, Math.max(0.2, zoom)) }),
  setDevice: (device) => set({ device }),

  setDocumentName: (name) => {
    get().apply((doc) => ({ ...structuredClone(doc), name }));
  },

  setShowOnPublicPage: (show) => {
    get().apply((doc) => {
      const next = structuredClone(doc);
      next.settings.showOnPublicPage = show;
      return next;
    });
  },
}));

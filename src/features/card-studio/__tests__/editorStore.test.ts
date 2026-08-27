import { beforeEach, describe, expect, it } from "vitest";
import "../registry"; /* Register component types*/
import { useEditorStore } from "../store/editorStore";
import * as ops from "../store/documentOps";
import { createEmptyDocument } from "../schema/defaults";

function store() {
  return useEditorStore.getState();
}

function sectionId() {
  return store().document.pages[0].sections[0].id;
}

describe("editorStore", () => {
  beforeEach(() => {
    useEditorStore.getState().initialize(createEmptyDocument("Test"), null);
  });

  it("addComponent adds the component with default from the registry and selects it itself", () => {
    store().addComponent("text", sectionId());
    const doc = store().document;
    expect(doc.pages[0].components).toHaveLength(1);
    const c = doc.pages[0].components[0];
    expect(c.type).toBe("text");
    expect(c.content.text).toBeTruthy();
    expect(store().selectedIds).toEqual([c.id]);
  });

  it("undo/redo restores documents step by step", () => {
    store().addComponent("text", sectionId());
    store().addComponent("shape", sectionId());
    expect(store().document.pages[0].components).toHaveLength(2);

    store().undo();
    expect(store().document.pages[0].components).toHaveLength(1);
    store().undo();
    expect(store().document.pages[0].components).toHaveLength(0);
    expect(store().canUndo()).toBe(false);

    store().redo();
    store().redo();
    expect(store().document.pages[0].components).toHaveLength(2);
    expect(store().canRedo()).toBe(false);
  });

  it("transient (mouse drag) only creates 1 undo step for the entire sequence", () => {
    store().addComponent("text", sectionId());
    const id = store().selectedIds[0];

    store().beginTransient();
    for (let i = 1; i <= 5; i++) {
      store().updateTransient((doc) =>
        ops.updateComponents(doc, [id], (c) => {
          c.position = { x: i * 10, y: i * 10 };
        })
      );
    }
    store().commitTransient();

    expect(ops.findComponent(store().document, id)!.position).toEqual({ x: 50, y: 50 });
    store().undo(); /* 1 single step back to original position*/
    const after = ops.findComponent(store().document, id)!;
    expect(after.position.x).not.toBe(50);
  });

  it("copy/paste creates a copy with new id, position offset", () => {
    store().addComponent("text", sectionId());
    const originalId = store().selectedIds[0];
    const original = ops.findComponent(store().document, originalId)!;

    store().copySelected();
    store().paste();

    const doc = store().document;
    expect(doc.pages[0].components).toHaveLength(2);
    const pastedId = store().selectedIds[0];
    expect(pastedId).not.toBe(originalId);
    const pasted = ops.findComponent(doc, pastedId)!;
    expect(pasted.position.x).toBe(original.position.x + 24);
  });

  it("duplicate copy with the option to switch to a new version", () => {
    store().addComponent("sticker", sectionId());
    const firstId = store().selectedIds[0];
    store().duplicateSelected();
    expect(store().document.pages[0].components).toHaveLength(2);
    expect(store().selectedIds[0]).not.toBe(firstId);
  });

  it("deleteSelected ignores locked components", () => {
    store().addComponent("text", sectionId());
    const id = store().selectedIds[0];
    store().updateSelected((c) => (c.locked = true));
    store().select([id]);
    store().deleteSelected();
    expect(store().document.pages[0].components).toHaveLength(1);
  });

  it("group/ungroup preserves the child's absolute position", () => {
    store().addComponent("text", sectionId());
    const id1 = store().selectedIds[0];
    store().apply((doc) => ops.updateComponents(doc, [id1], (c) => (c.position = { x: 100, y: 100 })));
    store().addComponent("shape", sectionId());
    const id2 = store().selectedIds[0];
    store().apply((doc) => ops.updateComponents(doc, [id2], (c) => (c.position = { x: 300, y: 200 })));

    store().select([id1, id2]);
    store().groupSelected();

    const groupId = store().selectedIds[0];
    const group = ops.findComponent(store().document, groupId)!;
    expect(group.type).toBe("group");
    expect(group.position).toEqual({ x: 100, y: 100 });
    expect(ops.absolutePosition(store().document, id1)).toEqual({ x: 100, y: 100 });
    expect(ops.absolutePosition(store().document, id2)).toEqual({ x: 300, y: 200 });

    store().ungroupSelected();
    expect(ops.findComponent(store().document, groupId)).toBeUndefined();
    const c1 = ops.findComponent(store().document, id1)!;
    expect(c1.parentId).toBe(sectionId());
    expect(c1.position).toEqual({ x: 100, y: 100 });
  });

  it("nudgeSelected moves all currently selected components", () => {
    store().addComponent("text", sectionId());
    const id = store().selectedIds[0];
    const before = ops.findComponent(store().document, id)!.position;
    store().nudgeSelected(5, -3);
    const after = ops.findComponent(store().document, id)!.position;
    expect(after).toEqual({ x: before.x + 5, y: before.y - 3 });
  });

  it("section: add/move/delete, always keep at least 1 section", () => {
    const firstSection = sectionId();
    store().addSection(firstSection);
    expect(store().document.pages[0].sections).toHaveLength(2);
    const second = store().document.pages[0].sections.find((s) => s.id !== firstSection)!;

    store().moveSection(second.id, -1);
    const sorted = [...store().document.pages[0].sections].sort((a, b) => a.order - b.order);
    expect(sorted[0].id).toBe(second.id);

    store().removeSection(second.id);
    store().removeSection(firstSection); /* final section — do not delete*/
    expect(store().document.pages[0].sections).toHaveLength(1);
  });

  it("Deleting a section deletes the component inside", () => {
    const firstSection = sectionId();
    store().addSection(firstSection);
    const second = store().document.pages[0].sections.find((s) => s.id !== firstSection)!;
    store().addComponent("text", second.id);
    expect(store().document.pages[0].components).toHaveLength(1);

    store().removeSection(second.id);
    expect(store().document.pages[0].components).toHaveLength(0);
  });

  it("reorder z-order qua bringToFront/sendToBack", () => {
    store().addComponent("text", sectionId());
    const a = store().selectedIds[0];
    store().addComponent("shape", sectionId());
    const b = store().selectedIds[0];

    const orderOf = (id: string) => ops.findComponent(store().document, id)!.order;
    expect(orderOf(b)).toBeGreaterThan(orderOf(a));

    store().select([a]);
    store().bringToFront();
    expect(orderOf(a)).toBeGreaterThan(orderOf(b));

    store().sendToBack();
    expect(orderOf(a)).toBeLessThan(orderOf(b));
  });

  it("undo after removing the lost id type from selection", () => {
    store().addComponent("text", sectionId());
    const id = store().selectedIds[0];
    store().deleteSelected();
    expect(store().selectedIds).toEqual([]);
    store().undo();
    expect(ops.findComponent(store().document, id)).toBeDefined();
  });
});

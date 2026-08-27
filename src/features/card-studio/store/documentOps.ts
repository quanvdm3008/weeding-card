import type { CardComponent, CardDocument, CardSection } from "../schema/types";
import { createComponent, createSection, newCardId } from "../schema/defaults";
import { getCardComponentDefinition } from "../registry/registry";

/**
 * Pure transformations on CardDocument — no side-effects, easy to test.
 * All functions return NEW documents (clone), do not mutate input.
 */

function clone(doc: CardDocument): CardDocument {
  return structuredClone(doc);
}

export function getPage(doc: CardDocument) {
  return doc.pages[0];
}

export function findComponent(doc: CardDocument, id: string): CardComponent | undefined {
  return getPage(doc).components.find((c) => c.id === id);
}

export function findSection(doc: CardDocument, id: string): CardSection | undefined {
  return getPage(doc).sections.find((s) => s.id === id);
}

/** Direct children of parent (section or group), sorted in ascending z-order. */
export function childrenOf(doc: CardDocument, parentId: string): CardComponent[] {
  return getPage(doc)
    .components.filter((c) => c.parentId === parentId)
    .sort((a, b) => a.order - b.order);
}

/** All descendants (recursively through group). */
export function descendantsOf(doc: CardDocument, id: string): CardComponent[] {
  const direct = getPage(doc).components.filter((c) => c.parentId === id);
  return direct.flatMap((c) => [c, ...descendantsOf(doc, c.id)]);
}

/** Section contains components (goes back through the parent group if any). */
export function sectionIdOf(doc: CardDocument, componentId: string): string | undefined {
  let current = findComponent(doc, componentId);
  while (current) {
    if (findSection(doc, current.parentId)) return current.parentId;
    current = findComponent(doc, current.parentId);
  }
  return undefined;
}

/** Absolute position in section (cumulative parent group offset). */
export function absolutePosition(doc: CardDocument, componentId: string): { x: number; y: number } {
  let x = 0;
  let y = 0;
  let current = findComponent(doc, componentId);
  while (current) {
    x += current.position.x;
    y += current.position.y;
    current = findComponent(doc, current.parentId);
  }
  return { x, y };
}

function nextOrder(doc: CardDocument, parentId: string): number {
  const siblings = childrenOf(doc, parentId);
  return siblings.length ? Math.max(...siblings.map((s) => s.order)) + 1 : 0;
}

/* --------------------------------- Component -------------------------------- */

export function addComponentOfType(
  doc: CardDocument,
  type: string,
  sectionId: string,
  position?: { x: number; y: number }
): { doc: CardDocument; component: CardComponent } {
  const def = getCardComponentDefinition(type);
  const next = clone(doc);
  const size = def?.defaultSize ?? { width: 200, height: 100 };
  const component = createComponent(type, sectionId, {
    name: def?.defaultName ?? type,
    size: { ...size },
    position: position
      ? { x: Math.round(position.x - size.width / 2), y: Math.round(position.y - size.height / 2) }
      : { x: Math.round((800 - size.width) / 2), y: 80 },
    content: structuredClone(def?.defaultContent ?? {}),
    order: nextOrder(next, sectionId),
  });
  if (def?.defaultStyle) component.style = { ...component.style, ...structuredClone(def.defaultStyle) };
  getPage(next).components.push(component);
  return { doc: next, component };
}

export function updateComponents(
  doc: CardDocument,
  ids: string[],
  mutator: (c: CardComponent) => void
): CardDocument {
  const next = clone(doc);
  for (const c of getPage(next).components) {
    if (ids.includes(c.id)) mutator(c);
  }
  return next;
}

export function removeComponents(doc: CardDocument, ids: string[]): CardDocument {
  const next = clone(doc);
  const toRemove = new Set<string>();
  for (const id of ids) {
    toRemove.add(id);
    for (const d of descendantsOf(next, id)) toRemove.add(d.id);
  }
  const page = getPage(next);
  page.components = page.components.filter((c) => !toRemove.has(c.id));
  return next;
}

/** Duplicate components (with descendants), offset slightly to see the copy. Return new version id. */
export function duplicateComponents(
  doc: CardDocument,
  ids: string[],
  offset = 24
): { doc: CardDocument; newIds: string[] } {
  const next = clone(doc);
  const page = getPage(next);
  const newIds: string[] = [];

  const cloneTree = (original: CardComponent, parentId: string, applyOffset: boolean): string => {
    const copy = structuredClone(original);
    copy.id = newCardId("cmp");
    copy.parentId = parentId;
    copy.order = nextOrder(next, parentId);
    if (applyOffset) {
      copy.position = { x: copy.position.x + offset, y: copy.position.y + offset };
    }
    page.components.push(copy);
    for (const child of doc.pages[0].components.filter((c) => c.parentId === original.id)) {
      cloneTree(child, copy.id, false);
    }
    return copy.id;
  };

  for (const id of ids) {
    const original = findComponent(doc, id);
    if (original) newIds.push(cloneTree(original, original.parentId, true));
  }
  return { doc: next, newIds };
}

/** Paste components from clipboard (serialized) into the target section. */
export function pasteComponents(
  doc: CardDocument,
  payload: CardComponent[],
  targetSectionId: string,
  offset = 24
): { doc: CardDocument; newIds: string[] } {
  const next = clone(doc);
  const page = getPage(next);
  const newIds: string[] = [];
  const idMap = new Map<string, string>();

  /* Only keep items whose parent is outside the payload (root of the selection) or whose parent is also in the payload.*/
  const payloadIds = new Set(payload.map((c) => c.id));
  for (const item of payload) {
    const copy = structuredClone(item);
    const oldId = copy.id;
    copy.id = newCardId("cmp");
    idMap.set(oldId, copy.id);
    if (payloadIds.has(copy.parentId) && idMap.has(copy.parentId)) {
      copy.parentId = idMap.get(copy.parentId)!;
    } else if (payloadIds.has(copy.parentId)) {
      /* parent appears later in the array — map in round 2*/
    } else {
      copy.parentId = targetSectionId;
      copy.position = { x: copy.position.x + offset, y: copy.position.y + offset };
      copy.order = nextOrder(next, targetSectionId);
      newIds.push(copy.id);
    }
    page.components.push(copy);
  }
  /* Round 2: fix the parentId for the item whose parent is mapped later*/
  for (const c of page.components) {
    if (payloadIds.has(c.parentId) && idMap.has(c.parentId)) {
      c.parentId = idMap.get(c.parentId)!;
    }
  }
  return { doc: next, newIds };
}

/** Change z-order: move the component to a new index in the child list of the same parent. */
export function reorderComponent(doc: CardDocument, id: string, newIndex: number): CardDocument {
  const next = clone(doc);
  const target = findComponent(next, id);
  if (!target) return next;
  const siblings = childrenOf(next, target.parentId).filter((c) => c.id !== id);
  const clamped = Math.max(0, Math.min(newIndex, siblings.length));
  siblings.splice(clamped, 0, target);
  siblings.forEach((c, i) => {
    const real = findComponent(next, c.id)!;
    real.order = i;
  });
  return next;
}

export function bringToFront(doc: CardDocument, ids: string[]): CardDocument {
  const next = clone(doc);
  for (const id of ids) {
    const c = findComponent(next, id);
    if (c) c.order = nextOrder(next, c.parentId);
  }
  return next;
}

export function sendToBack(doc: CardDocument, ids: string[]): CardDocument {
  const next = clone(doc);
  for (const id of ids) {
    const c = findComponent(next, id);
    if (!c) continue;
    const siblings = childrenOf(next, c.parentId);
    const min = siblings.length ? Math.min(...siblings.map((s) => s.order)) : 0;
    c.order = min - 1;
  }
  return next;
}

/* ----------------------------------- Group ---------------------------------- */

/** Group components of the same section into 1 group; Child positions are converted to relative groups. */
export function groupComponents(
  doc: CardDocument,
  ids: string[]
): { doc: CardDocument; groupId: string | null } {
  if (ids.length < 2) return { doc, groupId: null };
  const sectionIds = new Set(ids.map((id) => sectionIdOf(doc, id)));
  if (sectionIds.size !== 1) return { doc, groupId: null }; /* only group in the same section*/
  const sectionId = [...sectionIds][0]!;

  /* Only group components that are direct children of the section (do not group nested across multiple levels)*/
  const members = ids
    .map((id) => findComponent(doc, id))
    .filter((c): c is CardComponent => !!c && c.parentId === sectionId);
  if (members.length < 2) return { doc, groupId: null };

  const minX = Math.min(...members.map((m) => m.position.x));
  const minY = Math.min(...members.map((m) => m.position.y));
  const maxX = Math.max(...members.map((m) => m.position.x + m.size.width));
  const maxY = Math.max(...members.map((m) => m.position.y + m.size.height));

  let next = clone(doc);
  const group = createComponent("group", sectionId, {
    name: "Group",
    position: { x: minX, y: minY },
    size: { width: maxX - minX, height: maxY - minY },
    order: nextOrder(next, sectionId),
  });
  getPage(next).components.push(group);
  next = updateComponents(next, members.map((m) => m.id), (c) => {
    c.parentId = group.id;
    c.position = { x: c.position.x - minX, y: c.position.y - minY };
  });
  return { doc: next, groupId: group.id };
}

/** Split group: child returns to section with absolute position. */
export function ungroupComponent(
  doc: CardDocument,
  groupId: string
): { doc: CardDocument; childIds: string[] } {
  const group = findComponent(doc, groupId);
  if (!group || group.type !== "group") return { doc, childIds: [] };
  const children = childrenOf(doc, groupId);
  let next = updateComponents(doc, children.map((c) => c.id), (c) => {
    c.parentId = group.parentId;
    c.position = { x: c.position.x + group.position.x, y: c.position.y + group.position.y };
  });
  const page = getPage(next);
  page.components = page.components.filter((c) => c.id !== groupId);
  /* Put the children on top in the same order*/
  next = bringToFront(next, children.map((c) => c.id));
  return { doc: next, childIds: children.map((c) => c.id) };
}

/* ---------------------------------- Section --------------------------------- */

export function addSection(doc: CardDocument, afterSectionId?: string): { doc: CardDocument; section: CardSection } {
  const next = clone(doc);
  const page = getPage(next);
  const sorted = [...page.sections].sort((a, b) => a.order - b.order);
  const index = afterSectionId ? sorted.findIndex((s) => s.id === afterSectionId) + 1 : sorted.length;
  const section = createSection({ name: `Section ${page.sections.length + 1}` });
  sorted.splice(index, 0, section);
  sorted.forEach((s, i) => (s.order = i));
  page.sections = sorted;
  return { doc: next, section };
}

export function removeSection(doc: CardDocument, sectionId: string): CardDocument {
  if (getPage(doc).sections.length <= 1) return doc; /* Always keep at least 1 section*/
  let next = clone(doc);
  const ids = childrenOf(next, sectionId).map((c) => c.id);
  next = removeComponents(next, ids);
  const page = getPage(next);
  page.sections = page.sections.filter((s) => s.id !== sectionId);
  [...page.sections].sort((a, b) => a.order - b.order).forEach((s, i) => (s.order = i));
  return next;
}

export function moveSection(doc: CardDocument, sectionId: string, direction: -1 | 1): CardDocument {
  const next = clone(doc);
  const page = getPage(next);
  const sorted = [...page.sections].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((s) => s.id === sectionId);
  const swapWith = index + direction;
  if (index < 0 || swapWith < 0 || swapWith >= sorted.length) return doc;
  [sorted[index], sorted[swapWith]] = [sorted[swapWith], sorted[index]];
  sorted.forEach((s, i) => (s.order = i));
  return next;
}

export function updateSection(
  doc: CardDocument,
  sectionId: string,
  mutator: (s: CardSection) => void
): CardDocument {
  const next = clone(doc);
  const section = findSection(next, sectionId);
  if (section) mutator(section);
  return next;
}

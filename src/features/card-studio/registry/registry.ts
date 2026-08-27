import type { CardComponentDefinition } from "./types";

const definitions = new Map<string, CardComponentDefinition>();

export function registerCardComponent(def: CardComponentDefinition): void {
  if (definitions.has(def.type)) {
    /* Allow re-register when HMR — new version wins.*/
    definitions.delete(def.type);
  }
  definitions.set(def.type, def);
}

export function getCardComponentDefinition(type: string): CardComponentDefinition | undefined {
  return definitions.get(type);
}

export function listCardComponentDefinitions(): CardComponentDefinition[] {
  return Array.from(definitions.values());
}

export function listCardComponentsByCategory(
  category: CardComponentDefinition["category"]
): CardComponentDefinition[] {
  return listCardComponentDefinitions().filter((d) => d.category === category);
}

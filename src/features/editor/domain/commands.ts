export interface EditorCommand<TDocument> {
  id: string;
  label: string;
  execute: (document: TDocument) => TDocument;
}

export interface SnapshotHistory<TDocument> {
  present: TDocument;
  past: TDocument[];
  future: TDocument[];
}

export function mutationCommand<TDocument>(
  label: string,
  execute: (document: TDocument) => TDocument,
): EditorCommand<TDocument> {
  return { id: `mutation:${label}`, label, execute };
}

export function executeCommand<TDocument>(
  history: SnapshotHistory<TDocument>,
  command: EditorCommand<TDocument>,
  limit = 100,
): SnapshotHistory<TDocument> {
  const next = command.execute(history.present);
  if (next === history.present) return history;
  return {
    present: next,
    past: [...history.past.slice(-limit + 1), history.present],
    future: [],
  };
}

export function commitSnapshot<TDocument>(
  history: SnapshotHistory<TDocument>,
  previous: TDocument,
  limit = 100,
): SnapshotHistory<TDocument> {
  if (JSON.stringify(previous) === JSON.stringify(history.present)) return history;
  return {
    present: history.present,
    past: [...history.past.slice(-limit + 1), previous],
    future: [],
  };
}

export function undoSnapshot<TDocument>(
  history: SnapshotHistory<TDocument>,
  limit = 100,
): SnapshotHistory<TDocument> {
  if (!history.past.length) return history;
  const previous = history.past[history.past.length - 1];
  return {
    present: previous,
    past: history.past.slice(0, -1),
    future: [history.present, ...history.future].slice(0, limit),
  };
}

export function redoSnapshot<TDocument>(
  history: SnapshotHistory<TDocument>,
  limit = 100,
): SnapshotHistory<TDocument> {
  if (!history.future.length) return history;
  const next = history.future[0];
  return {
    present: next,
    past: [...history.past, history.present].slice(-limit),
    future: history.future.slice(1),
  };
}

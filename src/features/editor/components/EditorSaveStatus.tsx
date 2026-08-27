import type { EditorSaveState } from "../domain/types";

export function EditorSaveStatus({ saveState, dirty }: { saveState: EditorSaveState; dirty: boolean }) {
  if (saveState === "saving") {
    return <span className="rounded bg-muted px-2 py-1 text-[11px] text-muted-foreground">Saving...</span>;
  }
  if (saveState === "error") {
    return <span className="rounded border border-destructive/30 bg-destructive/10 px-2 py-1 text-[11px] text-destructive">Save error</span>;
  }
  if (dirty) {
    return <span className="rounded border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] text-amber-700">Not saved yet</span>;
  }
  if (saveState === "saved") {
    return <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] text-emerald-700">Saved</span>;
  }
  return <span className="text-[11px] text-muted-foreground">Draft</span>;
}

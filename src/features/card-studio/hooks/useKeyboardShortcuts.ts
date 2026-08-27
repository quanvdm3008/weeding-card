import { useEffect } from "react";
import { useEditorStore } from "../store/editorStore";

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.tagName === "input" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT" ||
    target.isContentEditable
  );
}

/**
 * Shortcuts of Card Studio:
 * Ctrl+Z/Y undo-redo · Ctrl+C/V/D copy-paste-duplicate · Ctrl+G/Shift+G group/split
 * Delete delete · move arrow (Shift = 10px) · Ctrl+S save · Esc deselect · Ctrl+0/± zoom
 */
export function useKeyboardShortcuts(onSave: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const store = useEditorStore.getState();
      if (isTypingTarget(e.target) || store.editingTextId) return;
      const mod = e.ctrlKey || e.metaKey;

      if (mod && !e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        store.undo();
      } else if ((mod && e.key.toLowerCase() === "y") || (mod && e.shiftKey && e.key.toLowerCase() === "z")) {
        e.preventDefault();
        store.redo();
      } else if (mod && e.key.toLowerCase() === "c") {
        e.preventDefault();
        store.copySelected();
      } else if (mod && e.key.toLowerCase() === "v") {
        e.preventDefault();
        store.paste();
      } else if (mod && e.key.toLowerCase() === "d") {
        e.preventDefault();
        store.duplicateSelected();
      } else if (mod && e.shiftKey && e.key.toLowerCase() === "g") {
        e.preventDefault();
        store.ungroupSelected();
      } else if (mod && e.key.toLowerCase() === "g") {
        e.preventDefault();
        store.groupSelected();
      } else if (mod && e.key.toLowerCase() === "s") {
        e.preventDefault();
        onSave();
      } else if (mod && e.key === "0") {
        e.preventDefault();
        store.setZoom(1);
      } else if (mod && (e.key === "=" || e.key === "+")) {
        e.preventDefault();
        store.setZoom(store.zoom * 1.15);
      } else if (mod && e.key === "-") {
        e.preventDefault();
        store.setZoom(store.zoom / 1.15);
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (store.selectedIds.length) {
          e.preventDefault();
          store.deleteSelected();
        }
      } else if (e.key === "Escape") {
        store.clearSelection();
      } else if (e.key.startsWith("Arrow") && store.selectedIds.length) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
        const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
        store.nudgeSelected(dx, dy);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSave]);
}

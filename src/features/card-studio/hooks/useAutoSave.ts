import { useCallback, useEffect, useRef } from "react";
import { useEditorStore } from "../store/editorStore";
import { editorRepository } from "@/features/editor/infrastructure/browserEditorRepository";
import { useEditorSession } from "@/features/editor/store/editorSessionStore";

const AUTOSAVE_DEBOUNCE_MS = 1500;

/**
 * Auto Save: debounce after last adjustment. Have invitationId → PUT backend;
 * not available (Studio draft) → localStorage. Returns the saveNow function for Ctrl+S/Save button.
 */
export function useAutoSave() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = useRef(false);
  const queuedRef = useRef(false);

  const saveNow = useCallback(async () => {
    const store = useEditorStore.getState();
    const { dirty } = store;
    if (!dirty) return;
    if (savingRef.current) {
      queuedRef.current = true;
      return;
    }
    const canvasAtSaveStart = store.document;
    try {
      savingRef.current = true;
      store.setSaveState("saving");
      useEditorSession.getState().setSaveState("saving");
      const sessionDocument = useEditorSession.getState().document;
      if (!sessionDocument) throw new Error("Editor session is not initialized");
      const result = await editorRepository.save(sessionDocument, "canvas");
      useEditorSession.getState().applySavedDocument(result.document, "canvas");
      if (useEditorStore.getState().document === canvasAtSaveStart) {
        store.markSaved();
      } else {
        queuedRef.current = true;
        store.setSaveState("idle");
      }
    } catch {
      store.setSaveState("error");
      useEditorSession.getState().setSaveState("error");
    } finally {
      savingRef.current = false;
      if (queuedRef.current) {
        queuedRef.current = false;
        timerRef.current = setTimeout(() => void saveNow(), 0);
      }
    }
  }, []);

  const dirty = useEditorStore((s) => s.dirty);
  const documentState = useEditorStore((s) => s.document);

  useEffect(() => {
    if (!dirty) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => void saveNow(), AUTOSAVE_DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [dirty, documentState, saveNow]);

  return saveNow;
}

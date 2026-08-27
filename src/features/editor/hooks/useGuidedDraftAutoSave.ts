import { useEffect, useRef } from "react";
import { useWeddingConfig } from "@/store/weddingConfigStore";
import { withCanvasDocument } from "../domain/adapters";
import { editorRepository } from "../infrastructure/browserEditorRepository";
import { useEditorSession } from "../store/editorSessionStore";

const DRAFT_DEBOUNCE_MS = 1200;

export function useGuidedDraftAutoSave() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = useRef(false);
  const queuedRef = useRef(false);

  useEffect(() => {
    const saveNow = async () => {
      const store = useWeddingConfig.getState();
      if (!store.dirty) return;
      if (savingRef.current) {
        queuedRef.current = true;
        return;
      }

      const historyAtSaveStart = store.past;
      const session = useEditorSession.getState();
      const document = session.document;
      if (!document) return;

      try {
        savingRef.current = true;
        store.setSaveState("saving");
        session.setSaveState("saving");

        if (!document.invitationId) {
          editorRepository.saveDraft(document);
          if (useWeddingConfig.getState().past === historyAtSaveStart) {
            useWeddingConfig.getState().markSaved();
            useEditorSession.getState().markSaved("guided");
          } else {
            queuedRef.current = true;
          }
          return;
        }

        const result = await editorRepository.save(document, "guided");
        if (useWeddingConfig.getState().past === historyAtSaveStart) {
          const latestCanvas = useEditorSession.getState().document?.canvas ?? null;
          const savedDocument = withCanvasDocument(result.document, latestCanvas);
          useWeddingConfig.getState().load(savedDocument.guided);
          useWeddingConfig.getState().markSaved();
          useEditorSession.getState().applySavedDocument(savedDocument, "guided");
        } else {
          queuedRef.current = true;
        }
      } catch {
        useWeddingConfig.getState().setSaveState("error");
        useEditorSession.getState().setSaveState("error");
      } finally {
        savingRef.current = false;
        if (queuedRef.current) {
          queuedRef.current = false;
          timerRef.current = setTimeout(() => void saveNow(), 0);
        }
      }
    };

    const unsubscribe = useWeddingConfig.subscribe((state, previous) => {
      // History only changes when the editable document changes. Save-state updates
      // must not schedule another draft write.
      if (!state.dirty || state.past === previous.past) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => void saveNow(), DRAFT_DEBOUNCE_MS);
    });

    return () => {
      unsubscribe();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
}

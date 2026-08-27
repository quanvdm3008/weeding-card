import { useEffect } from "react";
import { useEditorStore } from "@/features/card-studio/store/editorStore";
import { getWeddingConfigSnapshot, useWeddingConfig } from "@/store/weddingConfigStore";
import type { EditorWorkspace } from "../domain/types";
import { useEditorSession } from "../store/editorSessionStore";

export function useEditorSessionBridge(workspace: EditorWorkspace) {
  useEffect(() => {
    const session = useEditorSession.getState();
    if (!session.document) {
      session.initialize(getWeddingConfigSnapshot(), workspace);
    } else {
      session.setWorkspace(workspace);
    }

    const unsubscribeGuided = useWeddingConfig.subscribe((state, previous) => {
      if (state === previous) return;
      useEditorSession.getState().syncGuided(getWeddingConfigSnapshot(), state.dirty);
    });

    const unsubscribeCanvas = useEditorStore.subscribe((state, previous) => {
      if (state.document === previous.document && state.dirty === previous.dirty) return;
      useEditorSession.getState().syncCanvas(state.document, state.dirty);
    });

    return () => {
      unsubscribeGuided();
      unsubscribeCanvas();
    };
  }, [workspace]);
}

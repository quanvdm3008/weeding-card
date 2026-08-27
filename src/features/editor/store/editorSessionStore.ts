import { create } from "zustand";
import type { CardDocument } from "@/features/card-studio/schema/types";
import type { EditorSaveState, EditorWorkspace, GuidedInvitationConfig } from "../domain/types";
import {
  guidedConfigToInvitationDocument,
  type EditorInvitationDocument,
  withActiveWorkspace,
  withCanvasDocument,
} from "../domain/adapters";

interface EditorSessionState {
  document: EditorInvitationDocument | null;
  dirtyWorkspaces: EditorWorkspace[];
  saveState: EditorSaveState;
  initialize: (guided: GuidedInvitationConfig, workspace: EditorWorkspace, canvas?: CardDocument | null) => void;
  replaceDocument: (document: EditorInvitationDocument) => void;
  applySavedDocument: (document: EditorInvitationDocument, workspace: EditorWorkspace) => void;
  syncGuided: (guided: GuidedInvitationConfig, dirty: boolean) => void;
  syncCanvas: (canvas: CardDocument, dirty: boolean) => void;
  setWorkspace: (workspace: EditorWorkspace) => void;
  setSaveState: (saveState: EditorSaveState) => void;
  markSaved: (workspace?: EditorWorkspace) => void;
  clear: () => void;
}

function addDirty(current: EditorWorkspace[], workspace: EditorWorkspace) {
  return current.includes(workspace) ? current : [...current, workspace];
}

export const useEditorSession = create<EditorSessionState>()((set) => ({
  document: null,
  dirtyWorkspaces: [],
  saveState: "idle",

  initialize: (guided, workspace, canvas = null) => set({
    document: guidedConfigToInvitationDocument(guided, {
      canvas,
      activeWorkspace: workspace,
      source: guided.invitationId ? "existing" : guided.templateId ? "template" : "blank",
    }),
    dirtyWorkspaces: [],
    saveState: "idle",
  }),

  replaceDocument: (document) => set({ document, dirtyWorkspaces: [], saveState: "idle" }),

  applySavedDocument: (document, workspace) => set((state) => ({
    document,
    dirtyWorkspaces: state.dirtyWorkspaces.filter((item) => item !== workspace),
    saveState: "saved",
  })),

  syncGuided: (guided, dirty) => set((state) => ({
    document: guidedConfigToInvitationDocument(guided, {
      existing: state.document,
      canvas: state.document?.canvas,
      activeWorkspace: state.document?.activeWorkspace ?? "guided",
    }),
    dirtyWorkspaces: dirty ? addDirty(state.dirtyWorkspaces, "guided") : state.dirtyWorkspaces,
    saveState: dirty ? "idle" : state.saveState,
  })),

  syncCanvas: (canvas, dirty) => set((state) => ({
    document: state.document ? withCanvasDocument(state.document, canvas) : null,
    dirtyWorkspaces: dirty ? addDirty(state.dirtyWorkspaces, "canvas") : state.dirtyWorkspaces,
    saveState: dirty ? "idle" : state.saveState,
  })),

  setWorkspace: (workspace) => set((state) => ({
    document: state.document ? withActiveWorkspace(state.document, workspace) : null,
  })),

  setSaveState: (saveState) => set({ saveState }),

  markSaved: (workspace) => set((state) => ({
    dirtyWorkspaces: workspace
      ? state.dirtyWorkspaces.filter((item) => item !== workspace)
      : [],
    saveState: "saved",
  })),

  clear: () => set({ document: null, dirtyWorkspaces: [], saveState: "idle" }),
}));

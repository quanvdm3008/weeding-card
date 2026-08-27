import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import type { CardDocument } from "@/features/card-studio/schema/types";
import type { EditorWorkspace } from "@/features/editor/domain/types";
import { getApiErrorMessage } from "@/lib/api";
import { getWeddingConfigSnapshot, useWeddingConfig } from "@/store/weddingConfigStore";
import { templates } from "@/data/templates";
import { guidedConfigToInvitationDocument } from "../domain/adapters";
import { useEditorSessionBridge } from "../hooks/useEditorSessionBridge";
import { useGuidedDraftAutoSave } from "../hooks/useGuidedDraftAutoSave";
import { editorRepository } from "../infrastructure/browserEditorRepository";
import { useEditorSession } from "../store/editorSessionStore";

const BuilderShell = lazy(() => import("@/features/builder/components/BuilderShell"));
const CardEditor = lazy(() => import("@/features/card-studio/CardEditor"));

const EditorPage = () => {
  const { invitationId } = useParams<{ invitationId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [initialCanvas, setInitialCanvas] = useState<CardDocument | null>(null);
  const workspace: EditorWorkspace = searchParams.get("workspace") === "canvas" ? "canvas" : "guided";
  const workspaceRef = useRef(workspace);
  workspaceRef.current = workspace;
  const requestedTemplate = searchParams.get("template");
  const setTemplate = useWeddingConfig((state) => state.setTemplate);
  const loadGuided = useWeddingConfig((state) => state.load);

  useEditorSessionBridge(workspace);
  useGuidedDraftAutoSave();

  useEffect(() => {
    let cancelled = false;
    const initialize = async () => {
      setLoading(true);
      try {
        if (invitationId) {
          const document = await editorRepository.load(invitationId);
          if (cancelled) return;
          loadGuided(document.guided);
          useEditorSession.getState().replaceDocument(document);
          useEditorSession.getState().setWorkspace(workspaceRef.current);
          setInitialCanvas(document.canvas);
          return;
        }

        let current = getWeddingConfigSnapshot();
        const validTemplate = requestedTemplate && templates.some((template) => template.id === requestedTemplate);
        if (validTemplate && current.templateId !== requestedTemplate) {
          setTemplate(requestedTemplate);
          current = getWeddingConfigSnapshot();
        }
        const document = validTemplate
          ? guidedConfigToInvitationDocument(current, { source: "template" })
          : editorRepository.loadDraft(current);
        if (cancelled) return;
        loadGuided(document.guided);
        useEditorSession.getState().replaceDocument(document);
        useEditorSession.getState().setWorkspace(workspaceRef.current);
        setInitialCanvas(document.canvas);
      } catch (error) {
        if (!cancelled) {
          toast.error(getApiErrorMessage(error, "Cannot open card"));
          navigate("/dashboard", { replace: true });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void initialize();
    return () => {
      cancelled = true;
    };
  }, [invitationId, loadGuided, navigate, requestedTemplate, setTemplate]);

  if (loading) return <EditorLoading />;

  return (
    <Suspense fallback={<EditorLoading />}>
      {workspace === "canvas" ? (
        <CardEditor
          invitationId={invitationId ?? null}
          initialTemplateId={requestedTemplate}
          forceTemplateImport={searchParams.get("import") === "1"}
          startBlank={searchParams.get("blank") === "1"}
          managedDocument={useEditorSession.getState().document?.canvas ?? initialCanvas}
        />
      ) : (
        <BuilderShell
          onBack={() => navigate("/dashboard")}
        />
      )}
    </Suspense>
  );
};

function EditorLoading() {
  return (
    <div className="grid h-screen place-items-center bg-background">
      <div className="text-center">
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-3 text-sm text-muted-foreground">Loading design...</p>
      </div>
    </div>
  );
}

export default EditorPage;

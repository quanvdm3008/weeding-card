import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Eye,
  History,
  Layers,
  LayoutTemplate,
  Magnet,
  Minus,
  Monitor,
  Plus,
  Redo2,
  Shapes,
  Smartphone,
  Tablet,
  Undo2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import "./registry"; /* Register all component types (side-effect)*/
import type { DeviceKind } from "./schema/types";
import { cardDocumentHasContent } from "./schema/schema";
import { createEmptyDocument } from "./schema/defaults";
import { seedDocumentFromTemplate, type TemplateSeedData } from "./schema/templateSeed";
import { templates, type WeddingTemplate } from "@/data/templates";
import { WEDDING_SEED_DATA } from "@/data/seedData";
import { useWeddingConfig } from "@/store/weddingConfigStore";
import { useEditorStore } from "./store/editorStore";
import { useInteractionStore } from "./store/interactionStore";
import { EditorCanvas } from "./canvas/EditorCanvas";
import { LibraryPanel } from "./panels/LibraryPanel";
import { LayersPanel } from "./panels/LayersPanel";
import { InspectorPanel } from "./panels/InspectorPanel";
import { ImagePickerDialog } from "./panels/ImagePickerDialog";
import { CardRenderer } from "./render/CardRenderer";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useAutoSave } from "./hooks/useAutoSave";
import {
  type CardDocumentVersionDto,
} from "@/lib/cardDocument";
import { getApiErrorMessage } from "@/lib/api";
import { AmbientLayer } from "@/components/ui/AmbientLayer";
import { Button } from "@/components/ui/button";
import { EditorWorkspaceSwitcher } from "@/features/editor/components/EditorWorkspaceSwitcher";
import type { CardDocument } from "./schema/types";
import { editorRepository } from "@/features/editor/infrastructure/browserEditorRepository";
import { useEditorSession } from "@/features/editor/store/editorSessionStore";
import { EditorSaveStatus } from "@/features/editor/components/EditorSaveStatus";

interface Props {
  invitationId: string | null;
  initialTemplateId?: string | null;
  forceTemplateImport?: boolean;
  startBlank?: boolean;
  managedDocument?: CardDocument | null;
}

const PREVIEW_WIDTHS: Record<DeviceKind, number> = { desktop: 1280, tablet: 820, mobile: 390 };

/** Card Studio — Canva-style free card designer (Builder V2). */
export function CardEditor({ invitationId, initialTemplateId, forceTemplateImport = false, startBlank = false, managedDocument }: Props) {
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [seedOpen, setSeedOpen] = useState(false);
  const [leftTab, setLeftTab] = useState<"library" | "layers">("library");

  const zoom = useEditorStore((s) => s.zoom);
  const saveState = useEditorStore((s) => s.saveState);
  const dirty = useEditorStore((s) => s.dirty);
  const canUndo = useEditorStore((s) => s.past.length > 0);
  const canRedo = useEditorStore((s) => s.future.length > 0);
  const documentName = useEditorStore((s) => s.document.name);
  const device = useEditorStore((s) => s.device);
  const snapEnabled = useInteractionStore((s) => s.snapEnabled);

  const saveNow = useAutoSave();
  useKeyboardShortcuts(saveNow);

  /* Load document: backend (if there is invitationId) → localStorage draft → empty document*/
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      let doc = null;
      if (managedDocument !== undefined) doc = managedDocument;
      if (!cancelled) {
        const canSeedInitial = Boolean(
          initialTemplateId
          && templates.some((template) => template.id === initialTemplateId)
          && (forceTemplateImport || !cardDocumentHasContent(doc))
        );
        const initialDocument = startBlank
          ? createEmptyDocument()
          : canSeedInitial
          ? seedDocumentFromTemplate(initialTemplateId!, (() => {
              const config = useWeddingConfig.getState();
              return {
                groomName: config.groomName,
                brideName: config.brideName,
                date: config.date,
                time: config.time,
                venue: config.venue,
                address: config.address,
                message: config.message,
                musicUrl: config.musicUrl,
                coverImageUrl: config.coverImageUrl || WEDDING_SEED_DATA.coverImageUrl,
                galleryImageUrls: config.galleryImageUrls.length ? config.galleryImageUrls : WEDDING_SEED_DATA.galleryImageUrls,
                groomBank: config.groomBank,
                brideBank: config.brideBank,
                groomParents: config.groomParents,
                brideParents: config.brideParents,
              };
            })())
          : doc ?? createEmptyDocument();
        useEditorStore.getState().initialize(initialDocument, invitationId);
        if (canSeedInitial && forceTemplateImport) {
          const cleanUrl = new URL(window.location.href);
          cleanUrl.searchParams.delete("import");
          window.history.replaceState(null, "", `${cleanUrl.pathname}${cleanUrl.search}`);
        }
        setLoading(false);
        if (!startBlank && !canSeedInitial && !cardDocumentHasContent(doc)) setSeedOpen(true);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [forceTemplateImport, initialTemplateId, invitationId, managedDocument, startBlank]);

  const store = useEditorStore.getState();

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background font-body">
        <div className="relative flex items-center justify-center">
          <div className="w-14 h-14 rounded-full border-2 border-t-transparent border-primary animate-spin" />
          <div className="absolute font-display text-xl text-primary animate-pulse">❤</div>
        </div>
        <span className="mt-4 text-xs tracking-[0.25em] uppercase text-muted-foreground animate-pulse">
          Card Studio
        </span>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-muted/30 font-body">
      {/* Glass top bar with a subtle gold divider (Depth/Layer System §17). */}
      <header className="relative h-14 px-3 border-b border-border bg-card/85 backdrop-blur-xl flex items-center gap-2 flex-none z-20">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 gold-divider" />
        <Link
          to="/dashboard"
          className="flex items-center gap-1 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Come back
        </Link>
        <div className="w-px h-6 bg-border" />
        <EditorWorkspaceSwitcher active="canvas" invitationId={invitationId} compact />
        {/* Brand mark and design name. */}
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-gold shrink-0"
          style={{ background: "var(--gradient-rose-gold, linear-gradient(135deg, hsl(346 45% 55%), hsl(38 47% 61%)))" }}
        >
          <LayoutTemplate className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate max-w-48 leading-tight" title={documentName}>
            {documentName}
          </div>
          <div className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground leading-tight">Card Studio</div>
        </div>
        {/* Save status uses a colored pill for quick recognition. */}
        <span className="min-w-16"><EditorSaveStatus saveState={saveState} dirty={dirty} /></span>

        <div className="flex-1" />

        {/* Segmented undo and redo controls. */}
        <div className="flex items-center gap-0.5 p-0.5 bg-muted/60 rounded-lg">
          <button
            className="p-2 rounded-md hover:bg-card hover:shadow-sm disabled:opacity-30 transition"
            disabled={!canUndo}
            onClick={() => store.undo()}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            className="p-2 rounded-md hover:bg-card hover:shadow-sm disabled:opacity-30 transition"
            disabled={!canRedo}
            onClick={() => store.redo()}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Segmented zoom and snap controls. */}
        <div className="flex items-center gap-0.5 p-0.5 bg-muted/60 rounded-lg">
          <button className="p-2 rounded-md hover:bg-card hover:shadow-sm transition" onClick={() => store.setZoom(zoom / 1.15)} title="Zoom out">
            <Minus className="w-4 h-4" />
          </button>
          <button
            className="px-1.5 py-1 rounded-md hover:bg-card hover:shadow-sm text-xs tabular-nums w-12 text-center transition"
            onClick={() => store.setZoom(1)}
            title="Return to 100% (Ctrl+0)"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button className="p-2 rounded-md hover:bg-card hover:shadow-sm transition" onClick={() => store.setZoom(zoom * 1.15)} title="Enlarge">
            <Plus className="w-4 h-4" />
          </button>
          <button
            className={`p-2 rounded-md transition ${snapEnabled ? "bg-card text-primary shadow-sm" : "hover:bg-card text-muted-foreground"}`}
            onClick={() => useInteractionStore.getState().toggleSnap()}
            title={snapEnabled ? "Turn off snap & smart guides" : "Turn on snap & smart guides"}
          >
            <Magnet className="w-4 h-4" />
          </button>
        </div>

        {/* Quick View Mode Toggle */}
        <div className="flex items-center gap-0.5 p-0.5 bg-muted/60 rounded-lg">
          <button
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-medium transition ${zoom < 0.6 ? "bg-card text-primary shadow-sm" : "hover:bg-card text-muted-foreground"}`}
            onClick={() => store.setZoom(0.4875)}
            title="Mobile size"
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile
          </button>
          <button
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-medium transition ${zoom >= 0.6 ? "bg-card text-primary shadow-sm" : "hover:bg-card text-muted-foreground"}`}
            onClick={() => store.setZoom(1)}
            title="Web Size"
          >
            <Monitor className="w-3.5 h-3.5" /> Web
          </button>
        </div>

        <div className="w-px h-6 bg-border" />

        <Button
          variant="ghost-luxury"
          className="rounded-lg px-3 py-2 text-sm font-medium border"
          onClick={() => setSeedOpen(true)}
          title="Select a theme and load it into editable layers"
        >
          <LayoutTemplate className="w-4 h-4" /> <span className="hidden md:inline">Use samples</span>
        </Button>
        {invitationId && (
          <Button
            variant="ghost-luxury"
            className="rounded-lg px-3 py-2 text-sm font-medium border"
            onClick={() => setHistoryOpen(true)}
          >
            <History className="w-4 h-4" /> <span className="hidden md:inline">History</span>
          </Button>
        )}
        <Button
          variant="ghost-luxury"
          className="rounded-lg px-3 py-2 text-sm font-medium border"
          onClick={() => setPreviewOpen(true)}
        >
          <Eye className="w-4 h-4" /> <span className="hidden md:inline">Preview</span>
        </Button>
        <Button
          variant="luxury"
          className="rounded-lg px-4 py-2 text-sm font-semibold"
          onClick={() => void saveNow()}
          disabled={!dirty || saveState === "saving"}
        >
          Save
        </Button>
      </header>

      <div className="flex-1 flex min-h-0">
        {/* Left panel: library and layers. */}
        <aside className="relative overflow-hidden w-64 flex-none bg-card border-r border-border flex flex-col min-h-0">
          <AmbientLayer variant="particle" density="low" className="z-0" />
          <div className="relative z-10 flex flex-col h-full min-h-0">
          <div className="p-2 pb-0">
            <div className="flex p-1 bg-muted/70 rounded-lg">
              <button
                className={`flex-1 py-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  leftTab === "library" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setLeftTab("library")}
              >
                <Shapes className="w-3.5 h-3.5" /> More
              </button>
              <button
                className={`flex-1 py-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  leftTab === "layers" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setLeftTab("layers")}
              >
                <Layers className="w-3.5 h-3.5" /> Class
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {leftTab === "library" ? <LibraryPanel /> : <LayersPanel />}
          </div>
          </div>
        </aside>

        {/* Canvas */}
        <EditorCanvas />

        {/* Right panel: inspector. */}
        <aside className="w-72 flex-none bg-card border-l border-border overflow-y-auto min-h-0">
          <InspectorPanel />
        </aside>
      </div>

      {previewOpen && <PreviewOverlay device={device} onClose={() => setPreviewOpen(false)} />}
      {historyOpen && invitationId && (
        <HistoryDialog invitationId={invitationId} onClose={() => setHistoryOpen(false)} />
      )}
      {seedOpen && <TemplateSeedDialog onClose={() => setSeedOpen(false)} />}
      <ImagePickerDialog />
    </div>
  );
}

/* -------------------------------- Preview -------------------------------- */

function PreviewOverlay({ device: initial, onClose }: { device: DeviceKind; onClose: () => void }) {
  const documentState = useEditorStore((s) => s.document);
  const [device, setDevice] = useState<DeviceKind>(initial);
  const width = PREVIEW_WIDTHS[device];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col">
      <div className="h-14 flex items-center justify-center gap-2 flex-none">
        <div className="flex items-center gap-1 p-1 bg-card rounded-lg shadow">
          {(["desktop", "tablet", "mobile"] as DeviceKind[]).map((d) => {
            const Icon = d === "desktop" ? Monitor : d === "tablet" ? Tablet : Smartphone;
            return (
              <button
                key={d}
                onClick={() => setDevice(d)}
                className={`px-3 py-1.5 rounded-md ${device === d ? "bg-muted shadow-sm" : "text-muted-foreground"}`}
                title={d}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
        <button
          onClick={onClose}
          className="absolute right-4 flex items-center gap-1.5 px-3 py-2 rounded-md bg-card text-sm font-medium shadow hover:bg-muted"
        >
          <X className="w-4 h-4" /> Close
        </button>
      </div>
      <div className="flex-1 overflow-auto flex justify-center py-4">
        <div
          className="bg-white rounded-xl shadow-2xl overflow-y-auto"
          style={{ width: Math.min(width, window.innerWidth - 48), height: "calc(100vh - 100px)" }}
        >
          <CardRenderer document={documentState} forceDevice={device} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------- Start from topic -------------------------- */

function SeedThemePreview({ template }: { template: WeddingTemplate }) {
  const [primary, secondary = primary, tertiary = secondary] = template.colors;
  return (
    <div className="relative mb-2.5 h-24 overflow-hidden border border-black/10" style={{ background: `linear-gradient(135deg, ${primary}, ${secondary} 58%, ${tertiary})` }}>
      {template.id === "cosmic" && <><i className="absolute left-1/2 top-1/2 h-14 w-20 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/50 [transform:translate(-50%,-50%)_rotate(-18deg)]" /><i className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20" /><span className="absolute left-3 top-3 text-[9px] font-bold uppercase text-white">Celestial</span></>}
      {template.id === "pixel" && <><div className="absolute inset-0 opacity-30 [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:10px_10px]" /><div className="absolute bottom-3 left-3 h-7 w-7 bg-[#7FE0C3] shadow-[10px_-10px_0_#FFCE67,20px_0_0_white]" /><span className="absolute right-3 top-3 text-[9px] font-black uppercase text-white">Love.exe</span></>}
      {template.id === "layered3d" && <><i className="absolute left-[32%] top-4 h-16 w-11 -rotate-6 border-2 border-white/70 bg-white/25 shadow-lg" /><i className="absolute left-[48%] top-3 h-16 w-11 rotate-6 border-2 border-white/70 bg-white/25 shadow-lg" /><span className="absolute bottom-2 right-3 text-[9px] font-bold uppercase text-white">3D layers</span></>}
      {!(["cosmic", "pixel", "layered3d"].includes(template.id)) && <><div className="absolute bottom-0 right-3 h-20 w-14 border border-white/50 bg-black/15" /><span className="absolute left-3 top-3 max-w-[58%] text-[10px] font-bold uppercase leading-tight text-white">{template.nameVi}</span><i className="absolute bottom-4 left-3 h-px w-12 bg-white/60" /></>}
    </div>
  );
}

function TemplateSeedDialog({ onClose }: { onClose: () => void }) {
  const hasContent = cardDocumentHasContent(useEditorStore((s) => s.document));
  const [seeding, setSeeding] = useState<string | null>(null);
  const featuredIds = ["cosmic", "pixel", "layered3d"];
  const studioTemplates = [...templates].sort((a, b) => {
    const aRank = featuredIds.indexOf(a.id);
    const bRank = featuredIds.indexOf(b.id);
    return (aRank === -1 ? 99 : aRank) - (bRank === -1 ? 99 : bRank);
  });

  const buildSeedData = (): TemplateSeedData => {
    const s = useEditorSession.getState().document?.guided ?? useWeddingConfig.getState();
    return {
      groomName: s.groomName,
      brideName: s.brideName,
      date: s.date,
      time: s.time,
      venue: s.venue,
      address: s.address,
      message: s.message,
      musicUrl: s.musicUrl,
      coverImageUrl: s.coverImageUrl || WEDDING_SEED_DATA.coverImageUrl,
      galleryImageUrls: s.galleryImageUrls.length ? s.galleryImageUrls : WEDDING_SEED_DATA.galleryImageUrls,
      groomBank: s.groomBank,
      brideBank: s.brideBank,
      groomParents: s.groomParents,
      brideParents: s.brideParents,
    };
  };

  const seed = async (templateId: string) => {
    try {
      setSeeding(templateId);
      const data = buildSeedData();
      const store = useEditorStore.getState();
      store.apply(() => seedDocumentFromTemplate(templateId, data));
      store.clearSelection();
      toast.success("Loaded design from template — freely edit each element, Ctrl+Z to undo");
      onClose();
    } finally {
      setSeeding(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 gold-divider" />
          <div>
            <h2 className="font-display text-lg font-semibold">Start from available templates</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Load 1 in {templates.length} themes into editable sections and layers — with your card data included.
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted shrink-0" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
        {hasContent && (
          <p className="mx-5 mt-3 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            The current design will be replaced — you can always Ctrl+Z to go back.
          </p>
        )}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {studioTemplates.map((t) => (
            <button
              key={t.id}
              disabled={seeding !== null}
              onClick={() => void seed(t.id)}
              className="border border-border/70 p-2.5 text-left hover:border-primary/60 hover:shadow-elegant hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 group bg-card"
            >
              <SeedThemePreview template={t} />
              <div className="text-sm font-semibold leading-tight group-hover:text-primary transition-colors">
                {seeding === t.id ? "Loading..." : t.nameVi}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{t.category}</div>
            </button>
          ))}
        </div>
        <div className="px-5 py-3 border-t border-border text-right">
          <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline">
            {hasContent ? "Keep the current design" : "Start with a blank page"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Version history ---------------------------- */

function HistoryDialog({ invitationId, onClose }: { invitationId: string; onClose: () => void }) {
  const [versions, setVersions] = useState<CardDocumentVersionDto[] | null>(null);
  const [restoring, setRestoring] = useState<number | null>(null);

  useEffect(() => {
    editorRepository.listVersions(invitationId)
      .then(setVersions)
      .catch((error) => {
        toast.error(getApiErrorMessage(error, "Unable to download version history"));
        setVersions([]);
      });
  }, [invitationId]);

  const restore = async (version: number) => {
    try {
      setRestoring(version);
      const doc = await editorRepository.restoreVersion(invitationId, version);
      useEditorStore.getState().initialize(doc, invitationId);
      useEditorStore.getState().markSaved();
      toast.success(`Version restored ${version}`);
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to restore version"));
    } finally {
      setRestoring(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-card rounded-xl shadow-2xl w-full max-w-md max-h-[70vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">Version history</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {versions === null && <div className="text-sm text-muted-foreground p-3">Loading...</div>}
          {versions?.length === 0 && (
            <div className="text-sm text-muted-foreground p-3">There are no saved versions yet.</div>
          )}
          {versions?.map((v) => (
            <div key={v.version} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-muted">
              <div>
                <div className="text-sm font-medium">Version {v.version}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(v.createdAtUtc).toLocaleString("en-US")}
                </div>
              </div>
              <button
                className="px-3 py-1.5 rounded-md border border-border text-xs font-medium hover:bg-card disabled:opacity-50"
                onClick={() => void restore(v.version)}
                disabled={restoring !== null}
              >
                {restoring === v.version ? "Restoring..." : "Restore"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CardEditor;

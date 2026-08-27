import { useEffect, useRef, useState } from "react";
import {
  User, Calendar, MessageSquare, Palette, Music, Layers, Share2, Sparkles, LayoutGrid,
  ChevronLeft, Eye, Monitor, Smartphone, Tablet, X, Menu, Image, Users, Gift, BookHeart,
  Grid3x3, LayoutList, Undo2, Redo2, Shirt, CalendarClock, HelpCircle
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import WeddingFullPage from "@/features/template/WeddingFullPage";
import { SmoothScroll } from "@/components/wedding/SmoothScroll";
import { useWeddingConfig } from "@/store/weddingConfigStore";
import { serializeBuilderConfig, serializeInvitationContentConfig, DEFAULT_BUILDER_CONFIG } from "@/lib/builderConfig";
import { getApiErrorMessage } from "@/lib/api";
import { AmbientLayer } from "@/components/ui/AmbientLayer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import CoupleePanel from "./panels/CouplePanel";
import DateVenuePanel from "./panels/DateVenuePanel";
import MessagePanel from "./panels/MessagePanel";
import AppearancePanel from "./panels/AppearancePanel";
import MusicPanel from "./panels/MusicPanel";
import TemplatePanel from "./panels/TemplatePanel";
import MediaInfoPanel from "./panels/MediaInfoPanel";
import { DndContext, useDroppable, useSensor, useSensors, PointerSensor, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { EffectsPanel } from "./panels/EffectsPanel";
import { LayoutPanel } from "./panels/LayoutPanel";
import { GiftPanel } from "./panels/GiftPanel";
import { StoryPanel } from "./panels/StoryPanel";
import { DressCodePanel } from "./panels/DressCodePanel";
import { SchedulePanel } from "./panels/SchedulePanel";
import { FAQPanel } from "./panels/FAQPanel";
import { useIsMobile } from "@/hooks/use-mobile";
import PublishShareDialog from "@/components/wedding/PublishShareDialog";
import { EditorWorkspaceSwitcher } from "@/features/editor/components/EditorWorkspaceSwitcher";
import { EditorSaveStatus } from "@/features/editor/components/EditorSaveStatus";
import { editorRepository } from "@/features/editor/infrastructure/browserEditorRepository";
import { useEditorSession } from "@/features/editor/store/editorSessionStore";

type SectionKey = "template" | "couple" | "datetime" | "message" | "appearance" | "music" | "Media" | "effects" | "layout" | "story" | "gift" | "dresscode" | "schedule" | "faq";
type Device = "desktop" | "tablet" | "mobile";

const navItems: { key: SectionKey; label: string; icon: LucideIcon }[] = [
  { key: "template", label: "Mẫu thiệp cưới", icon: Layers },
  { key: "couple", label: "Cô dâu & Chú rể", icon: User },
  { key: "datetime", label: "Ngày cưới & Địa điểm", icon: Calendar },
  { key: "message", label: "Lời ngỏ & Lời mời", icon: MessageSquare },
  { key: "story", label: "Chuyện tình yêu", icon: BookHeart },
  { key: "gift", label: "Hộp quà mừng (VietQR)", icon: Gift },
  { key: "appearance", label: "Màu sắc & Giao diện", icon: Palette },
  { key: "effects", label: "Hiệu ứng rơi", icon: Sparkles },
  { key: "layout", label: "Bố cục thiệp", icon: LayoutGrid },
  { key: "dresscode", label: "Dress Code trang phục", icon: Shirt },
  { key: "schedule", label: "Lịch trình đám cưới", icon: CalendarClock },
  { key: "faq", label: "Câu hỏi thường gặp", icon: HelpCircle },
  { key: "music", label: "Nhạc nền", icon: Music },
  { key: "Media", label: "Album ảnh & Gia đình", icon: Image },
];

const deviceSize: Record<Device, { w: number; h: number }> = {
  desktop: { w: 1280, h: 800 },
  tablet: { w: 820, h: 1180 },
  mobile: { w: 390, h: 844 },
};

interface Props {
  onBack: () => void;
}

const BuilderShell = ({ onBack }: Props) => {
  const cfg = useWeddingConfig();
  const isLuxuryWorkspace = cfg.templateId === "luxury";
  const isMobile = useIsMobile();
  const [active, setActive] = useState<SectionKey>("couple");
  const [device, setDevice] = useState<Device>("desktop");
  const [fullPreview, setFullPreview] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    wrapperRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [cfg.templateId]);

  const { setNodeRef: setDropNodeRef, isOver } = useDroppable({
    id: "preview-canvas",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const renderPanel = () => {
    switch (active) {
      case "template": return <TemplatePanel />;
      case "couple": return <CoupleePanel />;
      case "datetime": return <DateVenuePanel />;
      case "message": return <MessagePanel />;
      case "appearance": return <AppearancePanel />;
      case "music": return <MusicPanel />;
      case "Media": return <MediaInfoPanel />;
      case "effects": return <EffectsPanel />;
      case "layout": return <LayoutPanel />;
      case "story": return <StoryPanel />;
      case "gift": return <GiftPanel />;
      case "dresscode": return <DressCodePanel />;
      case "schedule": return <SchedulePanel />;
      case "faq": return <FAQPanel />;
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      cfg.setSaveState("saving");
      useEditorSession.getState().setSaveState("saving");
      const document = useEditorSession.getState().document;
      if (!document) throw new Error("Editor session is not initialized");
      const result = await editorRepository.save(document, "guided");
      cfg.load(result.document.guided);
      cfg.markSaved();
      useEditorSession.getState().replaceDocument(result.document);
      useEditorSession.getState().markSaved();

      toast.success("Đã lưu thiệp cưới thành công!");
    } catch (error) {
      cfg.setSaveState("error");
      useEditorSession.getState().setSaveState("error");
      toast.error(getApiErrorMessage(error, "Không thể lưu thiệp cưới"));
    } finally {
      setSaving(false);
    }
  };

  const { w } = deviceSize[device];

  const sharedFullPageProps = {
    groomName: cfg.groomName,
    brideName: cfg.brideName,
    date: cfg.date,
    time: cfg.time,
    venue: cfg.venue,
    address: cfg.address,
    message: cfg.message,
    accentColor: cfg.accentColor,
    templateId: cfg.templateId,
    coverImageUrl: cfg.coverImageUrl,
    galleryImageUrls: cfg.galleryImageUrls,
    musicUrl: cfg.musicUrl,
    extraInfoTitle: cfg.extraInfoTitle,
    extraInfoContent: cfg.extraInfoContent,
    builderConfig: serializeBuilderConfig({
      cursorType: cfg.cursorType || DEFAULT_BUILDER_CONFIG.cursorType,
      particlesType: cfg.particlesType || DEFAULT_BUILDER_CONFIG.particlesType,
      photoFilter: cfg.photoFilter || DEFAULT_BUILDER_CONFIG.photoFilter,
      headingFont: cfg.headingFont || DEFAULT_BUILDER_CONFIG.headingFont,
      bodyFont: cfg.bodyFont || DEFAULT_BUILDER_CONFIG.bodyFont,
      headingWeight: cfg.headingWeight || DEFAULT_BUILDER_CONFIG.headingWeight,
      headingCase: cfg.headingCase || DEFAULT_BUILDER_CONFIG.headingCase,
      accentStyle: cfg.accentStyle || DEFAULT_BUILDER_CONFIG.accentStyle,
      customSections: cfg.customSections || DEFAULT_BUILDER_CONFIG.customSections,
      sectionStyles: cfg.sectionStyles || DEFAULT_BUILDER_CONFIG.sectionStyles,
    }),
    contentConfig: serializeInvitationContentConfig({
      groomBank: cfg.groomBank,
      brideBank: cfg.brideBank,
      stories: cfg.stories,
      groomParents: cfg.groomParents,
      brideParents: cfg.brideParents,
      schedule: cfg.schedule,
      dressCodeColors: cfg.dressCodeColors,
      faqs: cfg.faqs,
    }),
  };

  if (fullPreview) {
    return (
      <div className="relative h-screen w-full overflow-hidden" ref={wrapperRef}>
        <button
          onClick={() => setFullPreview(false)}
          className="fixed top-4 left-4 z-[60] flex items-center gap-2 px-4 py-2 rounded-full bg-card/90 backdrop-blur shadow-lg border border-border font-body text-sm font-semibold hover:bg-card"
        >
          <X className="w-4 h-4" /> Đóng xem trước
        </button>
        <SmoothScroll wrapperRef={wrapperRef} contentRef={contentRef}>
          <div ref={contentRef}>
            <WeddingFullPage {...sharedFullPageProps} />
          </div>
        </SmoothScroll>
      </div>
    );
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    
    if (over.id === "preview-canvas") {
      if (active.data.current?.type === "effect") {
        cfg.setField("photoFilter", active.data.current.value);
        toast.success(`Đã áp dụng hiệu ứng ảnh: ${active.data.current.label}`);
      } else if (active.data.current?.type === "particle") {
        cfg.setField("particlesType", active.data.current.value);
        toast.success(`Đã áp dụng hiệu ứng hạt nền: ${active.data.current.label}`);
      }
      return;
    }

    if (active.data.current?.type === "section" && active.id !== over.id) {
      const oldIndex = (cfg.customSections || []).indexOf(String(active.id));
      const newIndex = (cfg.customSections || []).indexOf(String(over.id));
      if (oldIndex !== -1 && newIndex !== -1) {
        const newSections = arrayMove(cfg.customSections || [], oldIndex, newIndex);
        cfg.setField("customSections", newSections);
      }
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className={`guided-editor-shell h-screen flex bg-muted/30 relative ${isLuxuryWorkspace ? "guided-editor-shell-luxury" : ""}`}>
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* LEFT SIDEBAR */}
        <aside
          className={`overflow-hidden bg-card border-r border-border flex flex-col transition-transform duration-300 ${
            isMobile
              ? `fixed top-[60px] bottom-0 left-0 z-40 w-[88vw] max-w-[340px] shadow-2xl ${
                  sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`
              : "w-[340px] flex-none relative"
          }`}
        >
          <AmbientLayer variant="particle" density="low" className="z-0" />
          <div className="relative z-10 flex flex-col h-full min-h-0">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 font-body text-sm text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="w-4 h-4" /> Bảng điều khiển
              </button>
              {isMobile ? (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-md hover:bg-muted text-muted-foreground"
                  aria-label="Đóng menu"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <span className="font-body text-[11px] tracking-widest uppercase text-muted-foreground font-semibold">
                  {isLuxuryWorkspace ? "Luxury Studio" : "Studio Thiết Kế"}
                </span>
              )}
            </div>

            {/* Nav */}
            <nav className="px-2 py-3 border-b border-border">
              <div className="flex items-center justify-between px-1 mb-1.5">
                <span className="font-body text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Menu
                </span>
                <button
                  onClick={() => setNavCollapsed((v) => !v)}
                  className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                  title={navCollapsed ? "Expand menu" : "Collapse menu"}
                  aria-label={navCollapsed ? "Expand menu" : "Collapse menu"}
                >
                  {navCollapsed ? <LayoutList className="w-3.5 h-3.5" /> : <Grid3x3 className="w-3.5 h-3.5" />}
                </button>
              </div>
              {navCollapsed ? (
                <div className="grid grid-cols-5 gap-1.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = active === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => setActive(item.key)}
                        title={item.label}
                        aria-label={item.label}
                        className={`aspect-square flex items-center justify-center rounded-lg transition-all ${
                          isActive
                            ? "bg-accent/15 text-foreground shadow-gold scale-105"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                        style={isActive ? { color: cfg.accentColor } : undefined}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              ) : (
                navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = active === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setActive(item.key)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm transition-all ${
                        isActive
                          ? "bg-accent/15 text-foreground font-semibold shadow-gold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                      style={isActive ? { color: cfg.accentColor } : undefined}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })
              )}
            </nav>

            {/* Panel content */}
            <GlassPanel className="flex-1 overflow-y-auto p-5 rounded-none border-0">
              {renderPanel()}
            </GlassPanel>
          </div>
        </aside>

        {/* RIGHT: CANVAS */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Top toolbar */}
          <div className="min-h-14 px-3 sm:px-5 py-2 border-b border-border bg-card flex flex-wrap items-center justify-between flex-none gap-2">
            <div className="flex min-w-0 items-center gap-1 sm:gap-2">
              <div className="hidden items-center gap-0.5 rounded-md border border-border bg-muted/60 p-1 md:flex">
                <button
                  type="button"
                  onClick={cfg.undo}
                  disabled={!cfg.past.length}
                  className="grid h-8 w-8 place-items-center rounded hover:bg-card disabled:opacity-35"
                  title="Hoàn tác (Undo)"
                >
                  <Undo2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={cfg.redo}
                  disabled={!cfg.future.length}
                  className="grid h-8 w-8 place-items-center rounded hover:bg-card disabled:opacity-35"
                  title="Làm lại (Redo)"
                >
                  <Redo2 className="h-4 w-4" />
                </button>
              </div>
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-md border border-border bg-card hover:bg-muted"
                  aria-label="Mở menu chỉnh sửa"
                >
                  <Menu className="w-4 h-4" />
                </button>
              )}
              <div className="hidden sm:flex items-center gap-1 p-1 bg-muted rounded-lg">
                {(["desktop", "tablet", "mobile"] as Device[]).map((d) => {
                  const Icon = d === "desktop" ? Monitor : d === "tablet" ? Tablet : Smartphone;
                  return (
                    <button
                      key={d}
                      onClick={() => setDevice(d)}
                      className={`px-3 py-1.5 rounded-md transition-all ${
                        device === d ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                      title={d === "desktop" ? "Máy tính" : d === "tablet" ? "Máy tính bảng" : "Điện thoại"}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden lg:inline-flex"><EditorSaveStatus saveState={cfg.saveState} dirty={cfg.dirty} /></span>
              <EditorWorkspaceSwitcher active="guided" invitationId={cfg.invitationId || null} compact={isMobile} />
              {cfg.invitationId ? (
                <Link
                  to={`/invitations/${cfg.invitationId}/guests`}
                  className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg border border-border bg-card font-body text-sm font-medium hover:bg-muted transition"
                  aria-label="Quản lý khách mời"
                  title="Quản lý khách mời"
                >
                  <Users className="w-4 h-4" /> <span className="hidden xl:inline">Khách mời</span>
                </Link>
              ) : (
                <span
                  title="Lưu thiệp trước để quản lý danh sách khách mời"
                  aria-label="Lưu thiệp trước để quản lý danh sách khách mời"
                  className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg border border-border bg-card/50 font-body text-sm font-medium text-muted-foreground cursor-not-allowed"
                >
                  <Users className="w-4 h-4" /> <span className="hidden xl:inline">Khách mời</span>
                </span>
              )}
              <Button
                variant="ghost-luxury"
                className="rounded-lg px-3 sm:px-3.5 py-2 text-sm font-medium border"
                onClick={() => setFullPreview(true)}
                aria-label="Xem trước toàn màn hình"
                title="Xem trước toàn màn hình"
              >
                <Eye className="w-4 h-4" /> <span className="hidden xl:inline">Xem trước</span>
              </Button>
              <Button
                variant="outline"
                className="rounded-lg px-3 sm:px-3.5 py-2 text-sm font-semibold border-accent text-accent hover:bg-accent/10"
                onClick={() => setShareOpen(true)}
                data-testid="editor-publish-open"
                aria-label="Xuất bản thiệp cưới và lấy link chia sẻ"
                title="Xuất bản & Chia sẻ"
              >
                <Share2 className="w-4 h-4" /> <span className="hidden xl:inline">Xuất bản & Chia sẻ</span>
              </Button>
              <Button
                data-testid="editor-save"
                variant="luxury"
                className={`rounded-lg px-3 sm:px-4 py-2 text-sm font-semibold shadow-md ${isLuxuryWorkspace ? "text-black" : "text-white"}`}
                style={{ background: cfg.accentColor }}
                onClick={handleSave}
                disabled={saving}
                aria-label={saving ? "Đang lưu..." : "Lưu thiệp cưới"}
                title={saving ? "Đang lưu..." : "Lưu thiệp cưới"}
              >
                <Sparkles className="w-4 h-4" /> <span className="hidden xl:inline">{saving ? "Đang lưu..." : "Lưu thiệp cưới"}</span>
              </Button>
            </div>
          </div>

          {/* Live preview frame */}
          <div className={`relative flex-1 overflow-hidden flex items-center justify-center p-0 sm:p-6 ${isLuxuryWorkspace ? "bg-[#070604]" : "bg-[radial-gradient(ellipse_at_center,hsl(var(--muted))_0%,transparent_70%)]"}`}>
            <AmbientLayer variant="blob" density="low" />
            <div
              ref={setDropNodeRef}
              className={`relative z-10 bg-background sm:rounded-xl sm:shadow-2xl overflow-hidden border-2 sm:border transition-colors ${
                isOver ? "border-accent shadow-[0_0_0_4px_rgba(232,180,184,0.3)]" : "border-transparent sm:border-border"
              }`}
              style={{
                width: isMobile ? "100%" : (device === "desktop" ? "100%" : w),
                maxWidth: isMobile ? "100%" : (device === "desktop" ? 1400 : w),
                height: "100%",
                maxHeight: "100%",
              }}
            >
              <div className="absolute inset-0 overflow-auto" ref={wrapperRef}>
                <SmoothScroll wrapperRef={wrapperRef} contentRef={contentRef}>
                  <div ref={contentRef}>
                    <WeddingFullPage {...sharedFullPageProps} skipIntro embeddedPreview />
                  </div>
                </SmoothScroll>
              </div>
            </div>
          </div>
        </main>
        <PublishShareDialog open={shareOpen} onOpenChange={setShareOpen} />
      </div>
    </DndContext>
  );
};

export default BuilderShell;

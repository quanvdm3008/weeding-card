import { useState } from "react";
import { LayoutGrid, ChevronUp, ChevronDown, Plus, Trash2, Sliders, GripVertical } from "lucide-react";
import { useWeddingConfig, type SectionStyle } from "@/store/weddingConfigStore";
import { PanelHeader, Field } from "./_shared";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import type { DraggableAttributes, DraggableSyntheticListeners } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

const allSectionOptions = [
  { id: "couple", label: "Cô dâu & Chú rể", defaultTitle: "Cô Dâu & Chú Rể" },
  { id: "countdown", label: "Đếm ngược ngày cưới", defaultTitle: "Đếm Ngược Ngày Cưới" },
  { id: "story", label: "Chuyện tình yêu", defaultTitle: "Chuyện Tình Yêu" },
  { id: "message", label: "Lời ngỏ & Lời mời", defaultTitle: "Lời Ngỏ Yêu Thương" },
  { id: "details", label: "Bản đồ & Địa điểm tổ chức", defaultTitle: "Thời Gian & Địa Điểm" },
  { id: "gallery", label: "Album ảnh cưới", defaultTitle: "Khoảnh Khắc Ngọt Ngào" },
  { id: "events", label: "Lịch trình đám cưới", defaultTitle: "Lịch Trình Hôn Lễ" },
  { id: "bank", label: "Hộp quà mừng cưới (VietQR)", defaultTitle: "Mừng Cưới Trực Tuyến" },
  { id: "dresscode", label: "Quy định trang phục (Dress Code)", defaultTitle: "Dress Code" },
  { id: "faq", label: "Câu hỏi thường gặp (FAQ)", defaultTitle: "Câu Hỏi Thường Gặp" },
  { id: "schedule", label: "Lịch trình chi tiết", defaultTitle: "Lịch Trình Ngày Cưới" },
  { id: "memories", label: "Kỷ niệm & Ký ức", defaultTitle: "Kỷ Niệm Tình Yêu" },
  { id: "weather", label: "Dự báo thời tiết ngày cưới", defaultTitle: "Thời Tiết Ngày Cưới" },
  { id: "rsvp", label: "Hộp xác nhận tham dự (RSVP)", defaultTitle: "Xác Nhận Tham Dự" },
  { id: "wishes", label: "Sổ lưu bút & Lời chúc", defaultTitle: "Gửi Lời Chúc Mừng" },
];

const SortableSection = ({
  id,
  children,
}: {
  id: string;
  children: (listeners: DraggableSyntheticListeners, attributes: DraggableAttributes) => React.ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data: { type: "section" },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : "auto",
    position: "relative" as const,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children(listeners, attributes)}
    </div>
  );
};

export const LayoutPanel = () => {
  const { customSections = ["couple", "countdown", "story", "message", "details", "gallery", "events", "wishes", "rsvp"], sectionStyles = {}, setField } = useWeddingConfig();
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const updateSectionOrder = (index: number, direction: "up" | "down") => {
    const newSections = [...customSections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    // Swap
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    setField("customSections", newSections);
  };

  const removeSection = (sectionId: string) => {
    const newSections = customSections.filter((id) => id !== sectionId);
    setField("customSections", newSections);
    if (selectedSectionId === sectionId) setSelectedSectionId(null);
  };

  const addSection = (sectionId: string) => {
    if (customSections.includes(sectionId)) return;
    setField("customSections", [...customSections, sectionId]);
  };

  const updateStyle = <K extends keyof SectionStyle>(sectionId: string, key: K, value: SectionStyle[K]) => {
    const currentStyle = sectionStyles[sectionId] || {
      paddingY: 80,
      borderRadius: 16,
      shadow: "none",
      glassEffect: false,
      background: "default",
      visible: true,
    };
    const newStyles = {
      ...sectionStyles,
      [sectionId]: {
        ...currentStyle,
        [key]: value,
      },
    };
    setField("sectionStyles", newStyles);
  };

  const availableToAdd = allSectionOptions.filter((opt) => !customSections.includes(opt.id));

  return (
    <div className="space-y-6 pb-12">
      <PanelHeader
        icon={<LayoutGrid className="w-4 h-4" />}
        title="Bố cục & Cấu trúc thiệp"
        sub="Kéo thả sắp xếp, ẩn/hiện và tùy chỉnh chi tiết từng khối nội dung của thiệp cưới"
      />

      {/* 1. Add Sections */}
      {availableToAdd.length > 0 && (
        <Field label="Thêm khối nội dung mới">
          <div className="flex flex-wrap gap-2 pt-1.5">
            {availableToAdd.map((opt) => (
              <Button
                key={opt.id}
                variant="outline"
                size="sm"
                onClick={() => addSection(opt.id)}
                className="rounded-full gap-1 text-xs px-3 h-8 border-dashed hover:border-accent hover:text-accent"
              >
                <Plus className="w-3.5 h-3.5" />
                {opt.label}
              </Button>
            ))}
          </div>
        </Field>
      )}

      {/* 2. List of Active Sections */}
      <Field label="Cấu trúc các phần của thiệp cưới">
        <SortableContext items={customSections} strategy={verticalListSortingStrategy}>
          <div className="space-y-2.5">
          {customSections.map((secId, index) => {
            const opt = allSectionOptions.find((o) => o.id === secId) || { label: secId, defaultTitle: "" };
            const style: SectionStyle = sectionStyles[secId] ?? { visible: true };
            const isSelected = selectedSectionId === secId;

            return (
              <SortableSection key={secId} id={secId}>
                {(listeners, attributes) => (
                  <div
                    className={`rounded-xl border transition-all ${
                      isSelected ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-border bg-card"
                    }`}
                  >
                    {/* Section Header */}
                    <div className="flex items-center justify-between p-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          {...listeners}
                          {...attributes}
                          className="w-7 h-7 rounded bg-muted flex items-center justify-center text-muted-foreground cursor-grab active:cursor-grabbing hover:bg-accent/10 hover:text-accent transition-colors shrink-0"
                          title="Kéo thả để sắp xếp vị trí"
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{opt.label}</p>
                          <p className="text-[10px] text-muted-foreground/80 font-mono truncate">
                            Mã khối: {secId}
                          </p>
                        </div>
                      </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Up / Down */}
                    <button
                      disabled={index === 0}
                      onClick={() => updateSectionOrder(index, "up")}
                      className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
                      title="Di chuyển lên"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      disabled={index === customSections.length - 1}
                      onClick={() => updateSectionOrder(index, "down")}
                      className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
                      title="Di chuyển xuống"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {/* Toggle styles */}
                    <button
                      onClick={() => setSelectedSectionId(isSelected ? null : secId)}
                      className={`p-1.5 rounded hover:bg-muted ${isSelected ? "text-accent" : "text-muted-foreground"}`}
                      title="Tùy chỉnh chi tiết"
                    >
                      <Sliders className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => removeSection(secId)}
                      className="p-1.5 rounded hover:bg-destructive/15 text-destructive"
                      title="Xóa khối này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Section Styles Detail Panel */}
                {isSelected && (
                  <div className="px-4 pb-4 pt-2 border-t border-border/60 bg-muted/20 space-y-4 rounded-b-xl text-xs">
                    {/* 1. Custom Title */}
                    <div className="space-y-1">
                      <span className="font-semibold text-muted-foreground">Tiêu đề tùy chỉnh</span>
                      <input
                        type="text"
                        placeholder={opt.defaultTitle}
                        value={style.customTitle || ""}
                        onChange={(e) => updateStyle(secId, "customTitle", e.target.value)}
                        className="w-full h-8 px-2.5 rounded-lg border border-border bg-background"
                      />
                    </div>

                    {/* 2. Spacing / Padding */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <span className="font-semibold text-muted-foreground">Đệm trên/dưới: {style.paddingY ?? 80}px</span>
                        <input
                          type="range"
                          min="20"
                          max="200"
                          step="10"
                          value={style.paddingY ?? 80}
                          onChange={(e) => updateStyle(secId, "paddingY", parseInt(e.target.value))}
                          className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="font-semibold text-muted-foreground">Bo góc viền: {style.borderRadius ?? 16}px</span>
                        <input
                          type="range"
                          min="0"
                          max="40"
                          step="4"
                          value={style.borderRadius ?? 16}
                          onChange={(e) => updateStyle(secId, "borderRadius", parseInt(e.target.value))}
                          className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
                        />
                      </div>
                    </div>

                    {/* 3. Shadow and Background */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <span className="font-semibold text-muted-foreground">Mức độ đổ bóng</span>
                        <Select
                          value={style.shadow || "none"}
                          onValueChange={(v) => updateStyle(secId, "shadow", v)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Không bóng</SelectItem>
                            <SelectItem value="sm">Bóng nhẹ (Soft)</SelectItem>
                            <SelectItem value="md">Bóng vừa</SelectItem>
                            <SelectItem value="lg">Bóng sâu sang trọng</SelectItem>
                            <SelectItem value="neumorphic">Khối nổi Neumorphic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <span className="font-semibold text-muted-foreground">Phong cách nền khối</span>
                        <Select
                          value={style.background || "default"}
                          onValueChange={(v) => updateStyle(secId, "background", v)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Mặc định theo theme</SelectItem>
                            <SelectItem value="glass">Kính mờ (Glassmorphism)</SelectItem>
                            <SelectItem value="tint">Ánh màu chủ đạo (Accent Tint)</SelectItem>
                            <SelectItem value="transparent">Trong suốt hoàn toàn</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* 4. Glass Effect toggle */}
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={style.glassEffect || false}
                        onChange={(e) => updateStyle(secId, "glassEffect", e.target.checked)}
                        className="rounded border-border text-accent focus:ring-accent"
                      />
                      <span>Bật hiệu ứng khúc xạ kính mờ cường lực</span>
                    </label>
                  </div>
                )}
                  </div>
                )}
              </SortableSection>
            );
          })}
        </div>
        </SortableContext>
      </Field>
    </div>
  );
};

export default LayoutPanel;

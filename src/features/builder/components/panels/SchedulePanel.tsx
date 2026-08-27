import { CalendarClock, Plus, RotateCcw, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWeddingConfig } from "@/store/weddingConfigStore";
import { WEDDING_SEED_DATA, type ScheduleEvent } from "@/data/seedData";
import { PanelHeader, Field } from "./_shared";

const ICON_OPTIONS = [
  { value: "🎊", label: "🎊 Đón khách / Chúc mừng" },
  { value: "💒", label: "💒 Làm lễ thành hôn" },
  { value: "🍽️", label: "🍽️ Khai tiệc / Dùng bữa" },
  { value: "🎵", label: "🎵 Âm nhạc & Văn nghệ" },
  { value: "🥂", label: "🥂 Cụng ly chúc mừng" },
  { value: "🎂", label: "🎂 Cắt bánh / Rót rượu" },
  { value: "💃", label: "💃 Khiêu vũ / Giao lưu" },
  { value: "📸", label: "📸 Chụp ảnh kỷ niệm" },
  { value: "🚗", label: "🚗 Đón dâu / Tiễn khách" },
];

const DEFAULT_ICON = "🎊";

const normalizeIcon = (icon?: string): string => {
  if (!icon) return DEFAULT_ICON;
  if (icon === "welcome") return "🎊";
  if (icon === "ceremony") return "💒";
  if (icon === "party") return "🍽️";
  const matched = ICON_OPTIONS.find((opt) => opt.value === icon);
  return matched ? matched.value : DEFAULT_ICON;
};

const EMPTY_EVENT: ScheduleEvent = {
  time: "",
  title: "",
  description: "",
  icon: DEFAULT_ICON,
};

export const SchedulePanel = () => {
  const { schedule, setField } = useWeddingConfig();
  const items: ScheduleEvent[] =
    schedule ?? (WEDDING_SEED_DATA.schedule ? [...WEDDING_SEED_DATA.schedule] : []);

  const updateItem = (idx: number, patch: Partial<ScheduleEvent>) => {
    const next = items.map((it, i) => (i === idx ? { ...it, ...patch } : it));
    setField("schedule", next);
  };

  const removeItem = (idx: number) => {
    setField("schedule", items.filter((_, i) => i !== idx));
  };

  const addItem = () => {
    setField("schedule", [...items, { ...EMPTY_EVENT }]);
  };

  const resetToDefault = () => {
    setField("schedule", WEDDING_SEED_DATA.schedule ? [...WEDDING_SEED_DATA.schedule] : []);
  };

  return (
    <div className="space-y-5">
      <PanelHeader
        icon={<CalendarClock className="w-4 h-4" />}
        title="Lịch trình đám cưới"
        sub="Quản lý các sự kiện trong ngày cưới theo thời gian"
      />

      <div className="space-y-4">
        {items.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
            Chưa có sự kiện nào trong lịch trình. Nhấn nút bên dưới để thêm sự kiện mới.
          </div>
        )}

        {items.map((event, idx) => (
          <div
            key={idx}
            className="space-y-3 rounded-xl border border-border p-4 bg-card/60"
          >
            <div className="flex items-center justify-between">
              <span className="font-body text-xs font-bold uppercase tracking-wider text-foreground/90">
                Sự kiện {idx + 1}
              </span>
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="text-muted-foreground hover:text-destructive transition-colors"
                title="Xóa sự kiện này"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Thời gian">
                <Input
                  className="h-10"
                  value={event.time}
                  onChange={(e) => updateItem(idx, { time: e.target.value })}
                  placeholder="Ví dụ: 17:00"
                />
              </Field>

              <Field label="Biểu tượng">
                <Select
                  value={normalizeIcon(event.icon)}
                  onValueChange={(val) => updateItem(idx, { icon: val })}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Chọn biểu tượng" />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field label="Tiêu đề sự kiện">
              <Input
                className="h-10"
                value={event.title}
                onChange={(e) => updateItem(idx, { title: e.target.value })}
                placeholder="Ví dụ: Đón khách & Chụp ảnh lưu niệm"
              />
            </Field>

            <Field label="Mô tả chi tiết (tùy chọn)">
              <Input
                className="h-10"
                value={event.description ?? ""}
                onChange={(e) => updateItem(idx, { description: e.target.value })}
                placeholder="Ví dụ: Chụp ảnh lưu niệm cùng cô dâu và chú rể tại sảnh tiệc"
              />
            </Field>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <Button
          type="button"
          onClick={addItem}
          variant="outline"
          className="w-full h-10 font-medium"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Thêm sự kiện lịch trình
        </Button>
        <Button
          type="button"
          onClick={resetToDefault}
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" /> Khôi phục lịch trình mặc định
        </Button>
      </div>
    </div>
  );
};

export default SchedulePanel;

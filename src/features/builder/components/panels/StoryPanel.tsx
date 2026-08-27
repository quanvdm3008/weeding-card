import { useRef, useState } from "react";
import { BookHeart, Loader2, Plus, RotateCcw, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useWeddingConfig } from "@/store/weddingConfigStore";
import { WEDDING_SEED_DATA, type StoryMilestone } from "@/data/seedData";
import { uploadMedia, isMediaUploadUnavailable } from "@/lib/media";
import { getApiErrorMessage } from "@/lib/api";
import { Field, PanelHeader } from "./_shared";
import { AIWriterModal } from "@/components/ai/AIWriterModal";

const EMPTY_MILESTONE: StoryMilestone = { date: "", title: "", text: "", img: "" };

const UploadButton = ({ onUploaded }: { onUploaded: (url: string) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadMedia(file);
      onUploaded(result.url);
      toast.success("Tải ảnh lên thành công");
    } catch (error) {
      toast.error(
        isMediaUploadUnavailable(error)
          ? "Máy chủ chưa bật dịch vụ upload Cloudinary (CLOUDINARY_ENABLED=true)"
          : getApiErrorMessage(error, "Không thể tải ảnh lên")
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      <Button type="button" variant="outline" size="sm" className="shrink-0 h-10" disabled={uploading} onClick={() => inputRef.current?.click()} title="Tải ảnh lên">
        {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
      </Button>
    </>
  );
};

export const StoryPanel = () => {
  const { stories, setField } = useWeddingConfig();
  const items = stories ?? WEDDING_SEED_DATA.stories;

  const updateItem = (idx: number, patch: Partial<StoryMilestone>) => {
    const next = items.map((it, i) => (i === idx ? { ...it, ...patch } : it));
    setField("stories", next);
  };

  const removeItem = (idx: number) => {
    setField("stories", items.filter((_, i) => i !== idx));
  };

  const addItem = () => {
    setField("stories", [...items, { ...EMPTY_MILESTONE }]);
  };

  const resetToDefault = () => {
    setField("stories", undefined);
  };

  return (
    <div className="space-y-5">
      <PanelHeader icon={<BookHeart className="w-4 h-4" />} title="Chuyện tình yêu" sub="Các cột mốc tình yêu hiển thị trong phần Love Story trên thiệp cưới" />
      <div className="flex justify-end">
        <AIWriterModal onApplyText={(text) => {
          setField("stories", [
            ...items,
            { date: "Mốc thời gian", title: "Khoảnh khắc đáng nhớ", text, img: "" }
          ]);
        }} />
      </div>

      <div className="space-y-4">
        {items.map((story, idx) => (
          <div key={idx} className="space-y-3 rounded-xl border border-border p-4 bg-card/60">
            <div className="flex items-center justify-between">
              <span className="font-body text-xs font-bold uppercase tracking-wider text-foreground/90">Cột mốc {idx + 1}</span>
              <button type="button" onClick={() => removeItem(idx)} className="text-muted-foreground hover:text-destructive" title="Xóa cột mốc này">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <Field label="Thời gian">
              <Input className="h-10" value={story.date} onChange={(e) => updateItem(idx, { date: e.target.value })} placeholder="Ví dụ: Tháng 09/2023" />
            </Field>
            <Field label="Tiêu đề cột mốc">
              <Input className="h-10" value={story.title} onChange={(e) => updateItem(idx, { title: e.target.value })} placeholder="Ví dụ: Lần đầu gặp gỡ / Lời cầu hôn" />
            </Field>
            <Field label="Nội dung kỷ niệm">
              <Textarea className="min-h-[80px] text-sm resize-none" value={story.text} onChange={(e) => updateItem(idx, { text: e.target.value })} placeholder="Kể lại khoảnh khắc đáng nhớ này..." />
            </Field>
            <Field label="Hình ảnh minh họa">
              <div className="flex gap-2">
                <Input className="h-10 font-mono text-xs" value={story.img} onChange={(e) => updateItem(idx, { img: e.target.value })} placeholder="https://.../photo.jpg" />
                <UploadButton onUploaded={(url) => updateItem(idx, { img: url })} />
              </div>
            </Field>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <Button type="button" onClick={addItem} variant="outline" className="w-full h-10 font-medium">
          <Plus className="w-4 h-4 mr-1.5" /> Thêm cột mốc tình yêu
        </Button>
        {stories !== undefined && (
          <Button type="button" onClick={resetToDefault} variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Khôi phục mẫu câu chuyện mặc định
          </Button>
        )}
      </div>
    </div>
  );
};

export default StoryPanel;

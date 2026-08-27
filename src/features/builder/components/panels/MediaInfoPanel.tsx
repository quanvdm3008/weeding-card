import { useRef, useState } from "react";
import { Image, Info, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useWeddingConfig } from "@/store/weddingConfigStore";
import { uploadMedia, isMediaUploadUnavailable } from "@/lib/media";
import { getApiErrorMessage } from "@/lib/api";
import { appendMusicUrl } from "@/lib/musicPlaylist";
import { Field, PanelHeader } from "./_shared";

const toLines = (items: string[]) => items.join("\n");
const fromLines = (value: string) => value.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);

/** File selection button + upload to Cloudinary; onUploaded receives the returned public URL. */
const UploadButton = ({ accept, onUploaded }: { accept: string; onUploaded: (url: string) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadMedia(file);
      onUploaded(result.url);
      toast.success("Tải tệp lên thành công");
    } catch (error) {
      toast.error(
        isMediaUploadUnavailable(error)
          ? "Máy chủ chưa bật dịch vụ upload Cloudinary (cần cấu hình CLOUDINARY_ENABLED=true)"
          : getApiErrorMessage(error, "Không thể tải tệp lên")
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="shrink-0 h-10"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        title="Tải tệp lên"
      >
        {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
      </Button>
    </>
  );
};

const MediaInfoPanel = () => {
  const { coverImageUrl, galleryImageUrls, musicUrl, extraInfoTitle, extraInfoContent, slug, setField } = useWeddingConfig();

  return (
    <div className="space-y-5">
      <PanelHeader icon={<Image className="w-4 h-4" />} title="Ảnh cưới & Thông tin thêm" sub="Hình ảnh bìa, album ảnh cưới, nhạc nền và các lưu ý đặc biệt" />
      <Field label="Đường dẫn định danh thiệp (Slug URL)">
        <Input value={slug || ""} onChange={(e) => setField("slug", e.target.value)} placeholder="minh-anh-thanh-ha" className="h-10 font-mono text-xs" />
        <p className="mt-1 text-[10px] text-muted-foreground">Đường link chia sẻ: {window.location.origin}/invitation/<b>{slug || "..."}</b></p>
      </Field>
      <Field label="Ảnh bìa mở đầu thiệp (Cover Photo)">
        <div className="flex gap-2">
          <Input value={coverImageUrl} onChange={(e) => setField("coverImageUrl", e.target.value)} placeholder="https://.../cover.jpg" className="h-10 font-mono text-xs" />
          <UploadButton accept="image/*" onUploaded={(url) => setField("coverImageUrl", url)} />
        </div>
      </Field>
      <Field label="Album ảnh cưới (Gallery)">
        <Textarea value={toLines(galleryImageUrls)} onChange={(e) => setField("galleryImageUrls", fromLines(e.target.value))} placeholder={"Mỗi dòng một đường dẫn ảnh URL\nhttps://.../anh-1.jpg\nhttps://.../anh-2.jpg"} className="min-h-[120px] font-mono text-xs" />
        <div className="mt-2 flex items-center gap-2">
          <UploadButton accept="image/*" onUploaded={(url) => setField("galleryImageUrls", [...galleryImageUrls, url])} />
          <span className="text-[11px] text-muted-foreground">Tải ảnh lên — tự động thêm vào cuối danh sách</span>
        </div>
      </Field>
      <Field label="Danh sách nhạc nền">
        <div className="flex gap-2">
          <Textarea value={musicUrl} onChange={(e) => setField("musicUrl", e.target.value)} placeholder={"Mỗi dòng một bài hát\nTên bài hát | https://.../bai-hat.mp3"} className="min-h-20 flex-1 font-mono text-xs" />
          <UploadButton accept="audio/*" onUploaded={(url) => setField("musicUrl", appendMusicUrl(musicUrl, url))} />
        </div>
      </Field>
      <Field label="Tiêu đề mục lưu ý bổ sung">
        <Input value={extraInfoTitle} onChange={(e) => setField("extraInfoTitle", e.target.value)} placeholder="Ví dụ: Quy định trang phục (Dress code), Hướng dẫn gửi xe..." className="h-10" />
      </Field>
      <Field label="Nội dung lưu ý chi tiết">
        <Textarea value={extraInfoContent} onChange={(e) => setField("extraInfoContent", e.target.value)} placeholder="Ví dụ: Quý khách vui lòng mặc trang phục màu Pastel / Trắng / Be. Có bãi đỗ xe ô tô và xe máy tại tầng hầm B1..." className="min-h-[100px] text-sm leading-relaxed" />
      </Field>
      <div className="flex gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 flex-none text-accent" />
        <span>Dán trực tiếp URL ảnh hoặc bấm nút tải lên để lưu ảnh trực tiếp trên hệ thống đám mây Cloudinary.</span>
      </div>
    </div>
  );
};

export default MediaInfoPanel;

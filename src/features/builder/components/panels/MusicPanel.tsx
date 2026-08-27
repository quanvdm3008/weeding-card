import { Music, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useWeddingConfig } from "@/store/weddingConfigStore";
import { PanelHeader, Field } from "./_shared";

const MusicPanel = () => {
  const { musicUrl, setField } = useWeddingConfig();
  return (
    <div className="space-y-5">
      <PanelHeader icon={<Music className="h-4 w-4" />} title="Nhạc nền đám cưới" sub="Tùy chỉnh danh sách bài hát phát tự động khi khách mở thiệp" />
      <Field label="Danh sách bài hát (URL file mp3 / m4a)">
        <Textarea
          placeholder={"A Thousand Years | https://.../a-thousand-years.mp3\nUntil I Found You | https://.../until-i-found-you.mp3"}
          value={musicUrl}
          onChange={(event) => setField("musicUrl", event.target.value)}
          className="min-h-32 font-mono text-xs bg-card"
        />
      </Field>
      <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground space-y-1">
        <p className="font-semibold text-foreground flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-accent" /> Hướng dẫn cú pháp:
        </p>
        <p>• Mỗi bài hát nhập trên 1 dòng theo cú pháp: <code className="text-foreground bg-muted px-1 rounded">Tên bài hát | URL mp3</code></p>
        <p>• Hoặc chỉ cần dán trực tiếp đường link URL file mp3.</p>
        <p>• Nhạc sẽ tự động phát sau khi khách mời tương tác chạm mở phong bì thiệp.</p>
      </div>
    </div>
  );
};

export default MusicPanel;

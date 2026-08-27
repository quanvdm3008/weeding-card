import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Download,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Play,
  Plus,
  Sparkles,
  Trash2,
  UploadCloud,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvitationSubNav } from "@/components/wedding/InvitationSubNav";
import { getInvitation } from "@/lib/invitations";

interface LivePhoto {
  id: string;
  url: string;
  uploaderName: string;
  caption?: string;
  table?: string;
  createdAt: string;
  isApproved: boolean;
}

const INITIAL_PHOTOS: LivePhoto[] = [
  {
    id: "p1",
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    uploaderName: "Nhóm Bạn Thân",
    caption: "Cô dâu chú rể đẹp đôi quá xá! Chúc mừng 2 bạn!",
    table: "Bàn 04",
    createdAt: "19:15",
    isApproved: true,
  },
  {
    id: "p2",
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    uploaderName: "Anh Hoàng (Đồng Nghiệp)",
    caption: "Cạn ly chúc phúc 100 năm hạnh phúc!",
    table: "Bàn 06",
    createdAt: "19:22",
    isApproved: true,
  },
  {
    id: "p3",
    url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80",
    uploaderName: "Gia Đình Chị Thảo",
    caption: "Không gian tiệc cưới lung linh ấm áp tuyệt vời.",
    table: "Bàn 02",
    createdAt: "19:30",
    isApproved: true,
  },
  {
    id: "p4",
    url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
    uploaderName: "Tuấn Anh & Mai",
    caption: "Mãi mãi bên nhau hạnh phúc nhé hai bạn yêu!",
    table: "Bàn 07",
    createdAt: "19:40",
    isApproved: true,
  },
];

export default function LivePhotosPage() {
  const { invitationId } = useParams<{ invitationId: string }>();
  const id = invitationId ?? "";

  const [photos, setPhotos] = useState<LivePhoto[]>(INITIAL_PHOTOS);
  const [slideshowIndex, setSlideshowIndex] = useState<number | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploaderName, setUploaderName] = useState("");
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const invitationQuery = useQuery({
    queryKey: ["invitation-detail", id],
    queryFn: () => getInvitation(id),
    enabled: Boolean(id),
  });

  const invitation = invitationQuery.data;

  const handleToggleApprove = (photoId: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, isApproved: !p.isApproved } : p))
    );
    toast.success("Đã cập nhật trạng thái hiển thị ảnh!");
  };

  const handleDeletePhoto = (photoId: string) => {
    if (window.confirm("Bạn có chắc muốn xóa ảnh này khỏi album tiệc?")) {
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      toast.success("Đã xóa ảnh!");
    }
  };

  const handleUploadPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      toast.error("Vui lòng dán link ảnh hoặc chọn ảnh!");
      return;
    }
    const newPhoto: LivePhoto = {
      id: `live-p-${Date.now()}`,
      url: imageUrl,
      uploaderName: uploaderName.trim() || "Khách quý",
      caption: caption.trim(),
      createdAt: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      isApproved: true,
    };
    setPhotos((prev) => [newPhoto, ...prev]);
    setUploadOpen(false);
    setImageUrl("");
    setUploaderName("");
    setCaption("");
    toast.success("Tải ảnh lên thành công!");
  };

  const approvedPhotos = photos.filter((p) => p.isApproved);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <InvitationSubNav
        invitationId={id}
        title={invitation ? `${invitation.groomName} & ${invitation.brideName}` : "Hôn Lễ"}
        subtitle="Album ảnh trực tiếp từ khách mời (Live Photobooth)"
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 flex-1 w-full space-y-6">
        {/* Top actions & metrics */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-display flex items-center gap-2">
              <Camera className="h-6 w-6 text-accent" /> Album Ảnh Trực Tiếp Tại Tiệc Cưới
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Khách mời quét mã QR chụp ảnh kỷ niệm tại bàn tiệc và đồng bộ lên màn hình sự kiện.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {approvedPhotos.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setSlideshowIndex(0)}
                className="text-xs"
              >
                <Play className="mr-1.5 h-3.5 w-3.5 text-accent" /> Trình chiếu Slideshow
              </Button>
            )}

            <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
              <DialogTrigger asChild>
                <Button className="bg-accent text-accent-foreground text-xs">
                  <Plus className="mr-1.5 h-4 w-4" /> Tải ảnh lên
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[440px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 font-display text-lg">
                    <UploadCloud className="h-5 w-5 text-accent" /> Tải Ảnh Kỷ Niệm Lên Tiệc Cưới
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUploadPhoto} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Tên người gửi / Nhóm bạn</Label>
                    <Input
                      placeholder="Ví dụ: Bạn Nam & Nhóm Cấp 3"
                      value={uploaderName}
                      onChange={(e) => setUploaderName(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Link hình ảnh (URL)</Label>
                    <Input
                      placeholder="https://..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Lời nhắn / Caption</Label>
                    <Input
                      placeholder="Lời chúc gửi cô dâu chú rể..."
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-accent text-accent-foreground text-xs">
                    Xác nhận đăng ảnh
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-md ${
                photo.isApproved ? "border-border" : "border-amber-500/40 opacity-75"
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900 cursor-pointer" onClick={() => setSlideshowIndex(index)}>
                <img
                  src={photo.url}
                  alt={photo.caption || "Guest photo"}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                <Badge
                  variant={photo.isApproved ? "default" : "outline"}
                  className="absolute top-2 right-2 text-[10px]"
                >
                  {photo.isApproved ? "Hiển thị" : "Đã ẩn"}
                </Badge>
              </div>

              <div className="p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground truncate">{photo.uploaderName}</span>
                  <span className="text-[10px] text-muted-foreground">{photo.createdAt}</span>
                </div>
                {photo.caption && (
                  <p className="text-xs text-muted-foreground line-clamp-2 italic">
                    "{photo.caption}"
                  </p>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-border/80 text-xs">
                  <span className="text-[11px] text-muted-foreground">{photo.table || "Bàn tự do"}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => handleToggleApprove(photo.id)}
                      title={photo.isApproved ? "Ẩn khỏi màn hình LED" : "Duyệt hiển thị"}
                    >
                      {photo.isApproved ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5 text-accent" />}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-destructive/70 hover:text-destructive"
                      onClick={() => handleDeletePhoto(photo.id)}
                      title="Xóa ảnh"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Fullscreen Slideshow Modal */}
        <AnimatePresence>
          {slideshowIndex !== null && approvedPhotos[slideshowIndex] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-between p-6 sm:p-10 select-none"
            >
              <div className="w-full flex items-center justify-between text-white/80 z-10">
                <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> Live Slideshow ({slideshowIndex + 1}/{approvedPhotos.length})
                </span>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/20 text-xs"
                  onClick={() => setSlideshowIndex(null)}
                >
                  Đóng (Esc)
                </Button>
              </div>

              <div className="relative max-w-4xl max-h-[75vh] flex flex-col items-center my-auto">
                <img
                  src={approvedPhotos[slideshowIndex].url}
                  alt=""
                  className="max-h-[65vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
                />
                <div className="mt-4 text-center text-white">
                  <h3 className="text-lg font-bold text-amber-200">
                    {approvedPhotos[slideshowIndex].uploaderName}
                  </h3>
                  {approvedPhotos[slideshowIndex].caption && (
                    <p className="text-sm text-white/80 mt-1 italic">
                      "{approvedPhotos[slideshowIndex].caption}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 z-10">
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/20 text-xs"
                  onClick={() =>
                    setSlideshowIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : approvedPhotos.length - 1))
                  }
                >
                  ◀ Ảnh trước
                </Button>
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/20 text-xs"
                  onClick={() =>
                    setSlideshowIndex((prev) => (prev !== null && prev < approvedPhotos.length - 1 ? prev + 1 : 0))
                  }
                >
                  Ảnh tiếp theo ▶
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

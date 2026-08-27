import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  UserCheck,
  Printer,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InvitationSubNav } from "@/components/wedding/InvitationSubNav";
import { getInvitation } from "@/lib/invitations";

export interface TimelineItem {
  id: string;
  time: string;
  title: string;
  role: "MC" | "COUPLE" | "VENUE" | "COORDINATOR" | "PHOTO";
  description: string;
  isCompleted: boolean;
}

const ROLE_CONFIG: Record<string, { label: string; tone: string; badge: string }> = {
  MC: { label: "MC Dẫn Chương Trình", tone: "text-purple-600 bg-purple-50", badge: "bg-purple-100 text-purple-800" },
  COUPLE: { label: "Cô Dâu & Chú Rể", tone: "text-rose-600 bg-rose-50", badge: "bg-rose-100 text-rose-800" },
  VENUE: { label: "Nhà Hàng / Âm Thanh", tone: "text-blue-600 bg-blue-50", badge: "bg-blue-100 text-blue-800" },
  COORDINATOR: { label: "Ban Điều Phối / Lễ Tân", tone: "text-amber-600 bg-amber-50", badge: "bg-amber-100 text-amber-800" },
  PHOTO: { label: "Ekip Quay Chụp", tone: "text-emerald-600 bg-emerald-50", badge: "bg-emerald-100 text-emerald-800" },
};

const INITIAL_TIMELINE: TimelineItem[] = [
  {
    id: "t1",
    time: "16:00",
    title: "Ekip & Ban tổ chức kiểm tra sảnh tiệc",
    role: "COORDINATOR",
    description: "Test âm thanh, micro, màn hình LED Live Wall, hoa tươi, photobooth check-in",
    isCompleted: true,
  },
  {
    id: "t2",
    time: "16:30",
    title: "Đón tiếp quan khách & Check-in sảnh cưới",
    role: "COORDINATOR",
    description: "Khách quét mã QR nhận số bàn tiệc, ký tên sổ lưu bút điện tử, chụp ảnh tại backdrop",
    isCompleted: true,
  },
  {
    id: "t3",
    time: "17:30",
    title: "MC mời quan khách ổn định chỗ ngồi",
    role: "MC",
    description: "Nhắc nhở khách vào đúng vị trí bàn tiệc theo sơ đồ bàn đã sắp xếp",
    isCompleted: false,
  },
  {
    id: "t4",
    time: "18:00",
    title: "Mở màn nghi lễ & Video phóng sự cưới",
    role: "VENUE",
    description: "Tắt đèn sảnh, bật spotlight lễ đường, chiếu video tình yêu của hai bạn trẻ",
    isCompleted: false,
  },
  {
    id: "t5",
    time: "18:15",
    title: "Cô Dâu & Chú Rể tiến vào lễ đường",
    role: "COUPLE",
    description: "Nghi thức trao nhẫn cưới thiêng liêng, đọc lời thề nguyện Vows và phát biểu hai họ",
    isCompleted: false,
  },
  {
    id: "t6",
    time: "18:30",
    title: "Rót tháp rượu Champagne & Cắt bánh cưới",
    role: "COUPLE",
    description: "Pháo kim tuyến, nâng ly khai tiệc cùng toàn thể quan khách",
    isCompleted: false,
  },
  {
    id: "t7",
    time: "19:30",
    title: "Minigame Quay số trúng thưởng & Tương tác Live Wall",
    role: "MC",
    description: "Bốc thăm trúng thưởng (Lucky Draw) cho khách mời đã check-in và chiếu lời chúc LED",
    isCompleted: false,
  },
  {
    id: "t8",
    time: "20:30",
    title: "Tiễn khách & Gửi thư cảm ơn",
    role: "COUPLE",
    description: "Cô dâu chú rể chụp ảnh tiễn khách tại sảnh, hệ thống tự động gửi tin nhắn cảm ơn",
    isCompleted: false,
  },
];

export default function WeddingTimelinePage() {
  const { invitationId } = useParams<{ invitationId: string }>();
  const id = invitationId ?? "";

  const [items, setItems] = useState<TimelineItem[]>(INITIAL_TIMELINE);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");
  const [role, setRole] = useState<TimelineItem["role"]>("MC");
  const [description, setDescription] = useState("");

  const invitationQuery = useQuery({
    queryKey: ["invitation-detail", id],
    queryFn: () => getInvitation(id),
    enabled: Boolean(id),
  });

  const invitation = invitationQuery.data;

  const toggleComplete = (itemId: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, isCompleted: !it.isCompleted } : it))
    );
  };

  const handleDeleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((it) => it.id !== itemId));
    toast.success("Đã xóa mốc lịch trình!");
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!time.trim() || !title.trim()) {
      toast.error("Vui lòng nhập giờ và tiêu đề sự kiện!");
      return;
    }
    const newItem: TimelineItem = {
      id: `tl-${Date.now()}`,
      time: time.trim(),
      title: title.trim(),
      role,
      description: description.trim(),
      isCompleted: false,
    };
    setItems((prev) => [...prev, newItem].sort((a, b) => a.time.localeCompare(b.time)));
    setDialogOpen(false);
    setTime("");
    setTitle("");
    setDescription("");
    toast.success("Đã thêm mốc sự kiện mới vào kịch bản!");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="print:hidden">
        <InvitationSubNav
          invitationId={id}
          title={invitation ? `${invitation.groomName} & ${invitation.brideName}` : "Hôn Lễ"}
          subtitle="Kịch bản & Lịch trình chạy tiệc cưới (Run of Show)"
        />
      </div>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 flex-1 w-full space-y-6">
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6 print:border-none print:pb-2">
          <div>
            <h2 className="text-2xl font-bold font-display flex items-center gap-2">
              <CalendarClock className="h-6 w-6 text-accent" /> Kịch Bản & Lịch Trình Tiệc Cưới
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Kế hoạch điều phối chi tiết từng phút dành cho MC, Ban Điều Phối, Nhà Hàng và Cô Dâu Chú Rể.
            </p>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={handlePrint} className="text-xs">
              <Printer className="mr-1.5 h-3.5 w-3.5" /> In kịch bản (Ctrl + P)
            </Button>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-accent text-accent-foreground text-xs shadow-sm">
                  <Plus className="mr-1.5 h-3.5 w-3.5" /> Thêm mốc lịch trình
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[440px]">
                <DialogHeader>
                  <DialogTitle className="font-display text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-accent" /> Thêm Mốc Sự Kiện Mới
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddItem} className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Thời gian (HH:mm)</Label>
                      <Input
                        placeholder="18:30"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Phụ trách chính</Label>
                      <Select value={role} onValueChange={(v) => setRole(v as TimelineItem["role"])}>
                        <SelectTrigger className="text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MC" className="text-xs">MC</SelectItem>
                          <SelectItem value="COUPLE" className="text-xs">Cô Dâu & Chú Rể</SelectItem>
                          <SelectItem value="VENUE" className="text-xs">Nhà Hàng</SelectItem>
                          <SelectItem value="COORDINATOR" className="text-xs">Điều Phối</SelectItem>
                          <SelectItem value="PHOTO" className="text-xs">Quay Chụp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Tiêu đề sự kiện</Label>
                    <Input
                      placeholder="Ví dụ: Rót rượu Champagne..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Mô tả & Lưu ý điều phối</Label>
                    <Input
                      placeholder="Chi tiết công việc cần làm..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="text-xs"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-accent text-accent-foreground text-xs">
                    Lưu mốc sự kiện
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Printable Event Title in print mode */}
        <div className="hidden print:block text-center border-b pb-4 mb-4">
          <h1 className="font-serif text-3xl font-bold">
            KỊCH BẢN ĐIỀU PHỐI HÔN LỄ: {invitation ? `${invitation.groomName.toUpperCase()} & ${invitation.brideName.toUpperCase()}` : "TIỆC CƯỚI"}
          </h1>
          <p className="text-xs text-stone-600 mt-1">Sparkling Vows Studio • Run of Show Timeline</p>
        </div>

        {/* Timeline Flow List */}
        <div className="relative border-l-2 border-accent/40 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-6">
          {items.map((item, index) => {
            const roleConf = ROLE_CONFIG[item.role] || ROLE_CONFIG.MC;

            return (
              <div
                key={item.id}
                className={`relative group rounded-2xl border p-4 sm:p-5 transition ${
                  item.isCompleted
                    ? "border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10"
                    : "border-border bg-card shadow-sm hover:border-accent/50"
                }`}
              >
                {/* Timeline node circle */}
                <button
                  type="button"
                  onClick={() => toggleComplete(item.id)}
                  className={`absolute -left-[35px] sm:-left-[43px] top-4 flex h-7 w-7 items-center justify-center rounded-full border-2 transition ${
                    item.isCompleted
                      ? "border-emerald-500 bg-emerald-500 text-white shadow-md"
                      : "border-accent bg-background text-accent hover:scale-110"
                  }`}
                  title={item.isCompleted ? "Đánh dấu chưa hoàn thành" : "Đánh dấu đã hoàn thành"}
                >
                  {item.isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-3.5 w-3.5" />}
                </button>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base sm:text-lg font-bold text-accent">
                      {item.time}
                    </span>
                    <h3 className={`font-display text-base sm:text-lg font-bold ${item.isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={`text-[10px] px-2 py-0.5 font-semibold ${roleConf.badge}`}>
                      {roleConf.label}
                    </Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteItem(item.id)}
                      className="h-7 w-7 text-destructive/60 hover:text-destructive print:hidden opacity-0 group-hover:opacity-100 transition"
                      title="Xóa mốc này"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {item.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

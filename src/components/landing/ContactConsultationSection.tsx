import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, CheckCircle2, MessageSquare, Phone, User, Calendar, Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { sendDiscordNotification } from "@/lib/discord";

export function ContactConsultationSection() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [serviceNeeded, setServiceNeeded] = useState("Thiệp Cưới Cao Cấp + Màn Hình LED Live Wall");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Vui lòng nhập họ tên và số điện thoại / Zalo!");
      return;
    }

    setIsSubmitting(true);

    const success = await sendDiscordNotification({
      title: "💍 Khách Hàng Đăng Ký Tư Vấn Thiệp Cưới & Gói Sự Kiện",
      name: name.trim(),
      phone: phone.trim(),
      message: note.trim() || "Yêu cầu tư vấn dịch vụ tiệc cưới",
      type: "order",
      metadata: {
        "Dịch vụ quan tâm": serviceNeeded,
        "Ngày cưới dự kiến": weddingDate.trim() || "Chưa xác định",
      },
    });

    setIsSubmitting(false);

    if (success) {
      setIsSuccess(true);
      toast.success("Đã gửi thông tin! Đội ngũ Mireia sẽ liên hệ bạn ngay qua Zalo/SĐT.");
    } else {
      toast.error("Có lỗi xảy ra khi gửi. Vui lòng thử lại!");
    }
  };

  return (
    <section id="contact" className="relative py-20 bg-gradient-to-b from-background via-card/50 to-background border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & Value Proposition */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
              <Sparkles className="h-3.5 w-3.5" /> Tư Vấn Trực Tiếp 1:1
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
              Cùng Mireia tạo nên <br />
              <span className="text-accent italic font-serif">lời hẹn ước trọn vẹn nhất.</span>
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Bạn cần thiết kế thiệp cưới độc bản, tùy chỉnh hiệu ứng riêng, hoặc triển khai hệ thống Màn hình LED & Minigame quay số tại sảnh tiệc? Hãy để lại thông tin để nhận tư vấn và bản demo miễn phí.
            </p>

            <div className="space-y-3 pt-2">
              {[
                "Đồng bộ tin nhắn tức thì về Discord để phản hồi trong 5 phút",
                "Miễn phí dùng thử toàn bộ 26 mẫu thiệp cao cấp",
                "Hỗ trợ kỹ thuật trực tiếp ngày cưới cho MC & Ban tổ chức",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-xs sm:text-sm text-foreground/90 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Consultation Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-xl relative overflow-hidden">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-4"
                >
                  <div className="h-16 w-16 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold">
                    ✓
                  </div>
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    Cảm Ơn Bạn Đã Gửi Yêu Cầu!
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                    Thông tin đã được chuyển thẳng tới đội ngũ quản trị viên qua Discord. Chuyên viên Mireia sẽ kết nối qua Zalo ({phone}) trong ít phút.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsSuccess(false);
                      setName("");
                      setPhone("");
                      setNote("");
                    }}
                    className="text-xs mt-2"
                  >
                    Gửi yêu cầu khác
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Tên Cô Dâu / Chú Rể *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ví dụ: Hoàng Long & Minh Anh"
                          className="pl-9 text-xs h-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Số điện thoại / Zalo *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="09xx xxx xxx"
                          className="pl-9 text-xs h-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Ngày cưới dự kiến</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={weddingDate}
                          onChange={(e) => setWeddingDate(e.target.value)}
                          placeholder="Ví dụ: 20/11/2026"
                          className="pl-9 text-xs h-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Gói dịch vụ quan tâm</Label>
                      <Input
                        value={serviceNeeded}
                        onChange={(e) => setServiceNeeded(e.target.value)}
                        className="text-xs h-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Yêu cầu thiết kế riêng / Ghi chú</Label>
                    <Textarea
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Chia sẻ mong muốn của bạn về phong cách thiệp, âm nhạc hoặc địa điểm tổ chức..."
                      className="text-xs resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent text-accent-foreground font-semibold text-xs h-11 shadow-md hover:bg-accent/90"
                  >
                    <Send className={`mr-2 h-4 w-4 ${isSubmitting ? "animate-spin" : ""}`} />
                    {isSubmitting ? "Đang gửi thông tin..." : "Nhận Tư Vấn & Báo Giá Miễn Phí"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactConsultationSection;

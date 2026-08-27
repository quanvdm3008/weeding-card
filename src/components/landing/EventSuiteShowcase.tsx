import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Projector,
  Gift,
  QrCode,
  Sparkles,
  Camera,
  Bot,
  ArrowRight,
  Heart,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    id: "live-wall",
    title: "Màn Hình LED Sân Khấu Live Wall",
    tag: "Realtime WebSocket",
    desc: "Màn hình sự kiện trực tiếp hiển thị lời chúc, hiệu ứng tim bay và mã QR khổng lồ để quan khách tại bàn quét điện thoại tương tác tức thì.",
    icon: Projector,
    color: "from-amber-500/20 to-rose-500/20",
    border: "border-amber-500/30",
    iconColor: "text-amber-500",
  },
  {
    id: "lucky-draw",
    title: "Minigame Quay Số Cho MC Sân Khấu",
    tag: "Sôi Động & Hào Hứng",
    desc: "Vòng quay kỹ thuật số bốc thăm trúng thưởng cho khách mời đã check-in, âm thanh chuông chúc mừng và pháo hoa kim tuyến 60fps rực rỡ.",
    icon: Gift,
    color: "from-rose-500/20 to-purple-500/20",
    border: "border-rose-500/30",
    iconColor: "text-rose-500",
  },
  {
    id: "checkin-seating",
    title: "Check-in QR & Sơ Đồ Xếp Chỗ",
    tag: "Chuyên Nghiệp",
    desc: "Khách quét mã tại sảnh để nhận ngay vị trí số bàn tiệc. Ban tổ chức nắm rõ số lượng khách có mặt theo thời gian thực.",
    icon: QrCode,
    color: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30",
    iconColor: "text-blue-500",
  },
  {
    id: "live-photos",
    title: "Album Ảnh Tiệc & Live Photobooth",
    tag: "Kỷ Niệm Sống Động",
    desc: "Khách mời chụp và đăng ảnh kỷ niệm tại bàn tiệc. Chủ tiệc có thể duyệt và chiếu trực tiếp dưới dạng Slideshow toàn màn hình.",
    icon: Camera,
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/30",
    iconColor: "text-emerald-500",
  },
  {
    id: "ai-assistant",
    title: "Trợ Lý AI Soạn Thảo Lời Mời & Vows",
    tag: "Công Nghệ AI",
    desc: "Tự động viết lời ngỏ thiệp cưới, các cột mốc tình yêu, lời thề nguyền thiêng liêng và thư cảm ơn với 5 tông giọng phù hợp gu của bạn.",
    icon: Bot,
    color: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/30",
    iconColor: "text-purple-500",
  },
];

export function EventSuiteShowcase() {
  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-accent/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-rose-500/10 blur-[140px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="outline" className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider bg-accent/10 border-accent/30 text-accent">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Hệ Sinh Thái Sự Kiện Cưới Toàn Diện
          </Badge>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            Không chỉ là thiệp cưới trực tuyến. <br />
            <span className="text-accent italic font-serif">Đó là trải nghiệm tiệc cưới hiện đại.</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Mireia kết nối từ lúc gửi thiệp online, quản lý phản hồi khách mời, đến trải nghiệm bùng nổ trên sân khấu ngày cưới.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.article
                key={feat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                className={`group rounded-3xl border bg-card p-6 sm:p-8 shadow-sm transition hover:shadow-lg hover:-translate-y-1 ${feat.border}`}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feat.color} shadow-sm group-hover:scale-110 transition duration-300`}>
                    <Icon className={`h-6 w-6 ${feat.iconColor}`} />
                  </div>
                  <Badge variant="secondary" className="text-[10px] px-2 py-0.5 font-medium">
                    {feat.tag}
                  </Badge>
                </div>

                <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-accent transition">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {feat.desc}
                </p>
              </motion.article>
            );
          })}

          {/* Quick CTA Box */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="rounded-3xl border border-accent/40 bg-gradient-to-br from-stone-900 to-zinc-950 p-6 sm:p-8 text-white flex flex-col justify-between shadow-xl"
          >
            <div className="space-y-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400 text-stone-950 font-bold">
                💍
              </span>
              <h3 className="font-display text-2xl font-bold text-amber-200">
                Sẵn sàng cho ngày vui?
              </h3>
              <p className="text-xs text-white/75 leading-relaxed">
                Tạo tài khoản miễn phí để thiết kế thiệp cưới và trải nghiệm toàn bộ bộ công cụ điều phối tiệc cưới ngay hôm nay.
              </p>
            </div>

            <Button asChild className="mt-6 bg-amber-400 text-stone-950 hover:bg-amber-300 font-bold text-xs h-10 shadow-md">
              <Link to="/dashboard">
                Bắt đầu tạo thiệp ngay <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </motion.article>
        </div>
      </div>
    </section>
  );
}

export default EventSuiteShowcase;

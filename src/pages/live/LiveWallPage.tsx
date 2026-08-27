import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "qrcode";
import {
  Heart,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Sparkles,
  MessageCircleHeart,
  QrCode as QrIcon,
  Play,
  Pause,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getInvitation, getPublicWishes, type WishDto } from "@/lib/invitations";
import { useRealtimeChannel } from "@/hooks/useRealtimeChannel";

interface LiveMessagePayload {
  id?: string;
  sender?: string;
  content?: string;
  timestamp?: number;
}

interface FloatingHeart {
  id: number;
  x: number;
  size: number;
  duration: number;
}

export default function LiveWallPage() {
  const { invitationId } = useParams<{ invitationId: string }>();
  const id = invitationId ?? "";

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showQr, setShowQr] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [liveWishes, setLiveWishes] = useState<WishDto[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const invitationQuery = useQuery({
    queryKey: ["invitation-detail", id],
    queryFn: () => getInvitation(id),
    enabled: Boolean(id),
  });

  const invitation = invitationQuery.data;
  const slug = invitation?.slug || "";
  const publicUrl = useMemo(() => {
    if (!slug) return window.location.origin;
    return `${window.location.origin}/invitation/${slug}`;
  }, [slug]);

  // Generate QR Code for live scanning
  useEffect(() => {
    if (!publicUrl) return;
    QRCode.toDataURL(publicUrl, {
      width: 320,
      margin: 1,
      color: { dark: "#18181b", light: "#ffffff" },
    }).then(setQrDataUrl).catch(() => {});
  }, [publicUrl]);

  // Initial wishes query
  const wishesQuery = useQuery({
    queryKey: ["invitation-wishes", slug],
    queryFn: () => getPublicWishes(slug),
    enabled: Boolean(slug),
  });

  useEffect(() => {
    const items = wishesQuery.data?.items || [];
    if (items.length > 0 && liveWishes.length === 0) {
      setLiveWishes(items.slice(0, 30));
    }
  }, [wishesQuery.data, liveWishes.length]);

  // Fallback demo wishes if no wishes yet
  const displayWishes = useMemo(() => {
    if (liveWishes.length > 0) return liveWishes;
    return [
      {
        id: "demo-1",
        authorName: "Gia đình Bác Thành",
        message: "Chúc hai cháu trăm năm hạnh phúc, đầu bạc răng long, vạn sự như ý!",
        emoji: "❤️",
        likes: 12,
        createdAtUtc: new Date().toISOString(),
      },
      {
        id: "demo-2",
        authorName: "Nhóm Bạn Đại Học",
        message: "Chúc mừng tân lang tân nương! Mãi mãi ngọt ngào và hạnh phúc bên nhau nhé!",
        emoji: "🎉",
        likes: 28,
        createdAtUtc: new Date().toISOString(),
      },
      {
        id: "demo-3",
        authorName: "Chị Minh Thư",
        message: "Cô dâu chú rể hôm nay đẹp đôi nhất trần đời! Hạnh phúc viên mãn nha em yêu!",
        emoji: "✨",
        likes: 19,
        createdAtUtc: new Date().toISOString(),
      },
      {
        id: "demo-4",
        authorName: "Anh Tuấn & Phương",
        message: "Chúc đôi bạn trẻ xây dựng tổ ấm tràn ngập tiếng cười và niềm vui mỗi ngày!",
        emoji: "🥂",
        likes: 15,
        createdAtUtc: new Date().toISOString(),
      },
    ];
  }, [liveWishes]);

  // Realtime Heart events
  useRealtimeChannel<string>(slug ? `/topic/live/${slug}/hearts` : null, () => {
    spawnHeart();
  });

  // Realtime Message events
  useRealtimeChannel<LiveMessagePayload>(slug ? `/topic/live/${slug}/messages` : null, (payload) => {
    if (isPaused) return;
    const newWish: WishDto = {
      id: payload.id || `live-${Date.now()}`,
      authorName: payload.sender || "Khách quý",
      message: payload.content || "Chúc mừng trăm năm hạnh phúc!",
      emoji: "❤️",
      likes: 1,
      createdAtUtc: new Date().toISOString(),
    };
    setLiveWishes((prev) => [newWish, ...prev.slice(0, 29)]);
    spawnHeart();
    playChime();
  });

  const spawnHeart = () => {
    const id = Date.now() + Math.random();
    const newHeart: FloatingHeart = {
      id,
      x: Math.random() * 85 + 5,
      size: Math.random() * 24 + 18,
      duration: Math.random() * 2 + 3,
    };
    setFloatingHearts((prev) => [...prev.slice(-25), newHeart]);
  };

  const playChime = () => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch {
      // Ignore audio failure
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-neutral-950 via-zinc-900 to-stone-950 text-white select-none flex flex-col justify-between p-6 sm:p-10"
    >
      {/* Ambient background glowing orbs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-rose-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-amber-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-pink-500/10 blur-[150px]" />

      {/* Floating hearts layer */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
        <AnimatePresence>
          {floatingHearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{ opacity: 0, y: "100vh", x: `${heart.x}vw`, scale: 0.5 }}
              animate={{ opacity: [0, 0.9, 0], y: "-10vh", scale: [0.5, 1.2, 0.9] }}
              exit={{ opacity: 0 }}
              transition={{ duration: heart.duration, ease: "easeOut" }}
              className="absolute text-rose-500/80 drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]"
              style={{ fontSize: heart.size }}
            >
              ❤️
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Top Header */}
      <header className="relative z-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to={`/invitations/${id}/rsvps`}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white/80 hover:bg-white/20 hover:text-white backdrop-blur transition"
            title="Quay lại Quản lý"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs uppercase tracking-widest text-amber-300/90 font-semibold">
                Live Wedding Wall • Sân Khấu Tiệc Cưới
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md">
              {invitation ? `${invitation.groomName} & ${invitation.brideName}` : "Hôn Lễ Trăm Năm"}
            </h1>
          </div>
        </div>

        {/* Control toolbar */}
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 p-1.5 backdrop-blur-md">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsPaused(!isPaused)}
            className="h-9 px-3 text-xs text-white hover:bg-white/15"
            title={isPaused ? "Tiếp tục luồng" : "Tạm dừng luồng"}
          >
            {isPaused ? <Play className="h-4 w-4 text-emerald-400 mr-1.5" /> : <Pause className="h-4 w-4 text-amber-400 mr-1.5" />}
            <span className="hidden sm:inline">{isPaused ? "Tiếp tục" : "Tạm dừng"}</span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowQr(!showQr)}
            className={`h-9 px-3 text-xs text-white hover:bg-white/15 ${showQr ? "bg-white/15 text-amber-300" : ""}`}
            title="Bật/tắt mã QR quét"
          >
            <QrIcon className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Mã QR</span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsMuted(!isMuted)}
            className="h-9 w-9 p-0 text-white hover:bg-white/15"
            title={isMuted ? "Bật âm thanh chúc mừng" : "Tắt âm thanh"}
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={toggleFullscreen}
            className="h-9 w-9 p-0 text-white hover:bg-white/15"
            title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình (F11)"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      {/* Main Wishes Display Area */}
      <main className="relative z-20 my-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Live Wishes Grid / Masonry Stream */}
        <div className={`${showQr ? "lg:col-span-8" : "lg:col-span-12"} transition-all duration-500`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[68vh] overflow-y-auto pr-2 scrollbar-none">
            <AnimatePresence initial={false}>
              {displayWishes.map((wish, index) => (
                <motion.div
                  key={wish.id}
                  layout
                  initial={{ opacity: 0, scale: 0.85, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className={`group relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl shadow-2xl transition hover:border-amber-400/40 hover:bg-white/15 ${
                    index === 0 ? "border-amber-400/50 bg-gradient-to-br from-amber-500/20 via-white/10 to-rose-500/20 ring-1 ring-amber-400/30" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 text-stone-950 font-bold text-sm shadow-md">
                        {wish.authorName ? wish.authorName.charAt(0).toUpperCase() : "❤️"}
                      </div>
                      <div>
                        <h4 className="font-semibold text-base text-amber-200 tracking-tight leading-tight">
                          {wish.authorName}
                        </h4>
                        <span className="text-[11px] text-white/50">Vừa gửi lời chúc</span>
                      </div>
                    </div>
                    <span className="text-xl">{wish.emoji || "❤️"}</span>
                  </div>

                  <p className="text-sm sm:text-base text-white/95 leading-relaxed font-body">
                    "{wish.message}"
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs text-white/60 pt-2 border-t border-white/10">
                    <span className="flex items-center gap-1 text-rose-300">
                      <Heart className="h-3.5 w-3.5 fill-current text-rose-400" /> {wish.likes || 1} tim
                    </span>
                    <span className="flex items-center gap-1 text-amber-300/80">
                      <Sparkles className="h-3 w-3" /> Hạnh phúc viên mãn
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Giant Interactive QR Code */}
        {showQr && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="lg:col-span-4 flex flex-col items-center justify-center"
          >
            <div className="relative rounded-3xl border-2 border-amber-400/40 bg-gradient-to-b from-stone-900/90 to-black/90 p-7 text-center shadow-2xl backdrop-blur-2xl">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-4 py-0.5 text-[11px] font-bold uppercase tracking-wider text-black shadow-lg flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> Quét mã gửi lời chúc
              </div>

              <div className="my-3 overflow-hidden rounded-2xl bg-white p-3 shadow-inner">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Live QR" className="h-56 w-56 object-contain mx-auto" />
                ) : (
                  <div className="h-56 w-56 flex items-center justify-center bg-zinc-100 text-zinc-400">
                    Đang tạo mã QR...
                  </div>
                )}
              </div>

              <h3 className="font-display text-lg font-semibold text-amber-200">
                Gửi Lời Chúc & Thả Tim
              </h3>
              <p className="mt-1 text-xs text-white/70 max-w-[220px] mx-auto">
                Mở camera trên điện thoại của bạn và quét mã để lời chúc xuất hiện trực tiếp trên màn hình LED!
              </p>
            </div>
          </motion.div>
        )}
      </main>

      {/* Bottom Footer Status Bar */}
      <footer className="relative z-20 flex items-center justify-between text-xs text-white/50 border-t border-white/10 pt-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-amber-300/80">
            <MessageCircleHeart className="h-4 w-4" /> {liveWishes.length} Lời chúc đã nhận
          </span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span className="hidden sm:inline">Cập nhật thời gian thực bằng STOMP Realtime</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Sparkling Vows Studio</span>
          <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
        </div>
      </footer>
    </div>
  );
}

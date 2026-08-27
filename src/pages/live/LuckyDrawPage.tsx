import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  Trophy,
  Sparkles,
  RefreshCw,
  Award,
  Users,
  Copy,
  Check,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InvitationSubNav } from "@/components/wedding/InvitationSubNav";
import { getInvitation } from "@/lib/invitations";
import { listGuests } from "@/lib/guests";

interface Winner {
  id: string;
  name: string;
  group: string;
  table?: string;
  prize: string;
  drawnAt: string;
}

const PRIZE_TIERS = [
  { id: "grand", name: "Giải Đặc Biệt", color: "from-amber-400 to-yellow-600", text: "text-amber-300", icon: "👑" },
  { id: "first", name: "Giải Nhất", color: "from-rose-400 to-red-600", text: "text-rose-300", icon: "🥇" },
  { id: "second", name: "Giải Nhì", color: "from-blue-400 to-indigo-600", text: "text-blue-300", icon: "🥈" },
  { id: "third", name: "Giải Ba", color: "from-emerald-400 to-teal-600", text: "text-emerald-300", icon: "🥉" },
  { id: "lucky", name: "Giải May Mắn", color: "from-purple-400 to-pink-600", text: "text-purple-300", icon: "🎁" },
];

export default function LuckyDrawPage() {
  const { invitationId } = useParams<{ invitationId: string }>();
  const id = invitationId ?? "";

  const [selectedPrize, setSelectedPrize] = useState(PRIZE_TIERS[0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentDisplayName, setCurrentDisplayName] = useState("SẴN SÀNG QUAY");
  const [currentWinner, setCurrentWinner] = useState<Winner | null>(null);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const invitationQuery = useQuery({
    queryKey: ["invitation-detail", id],
    queryFn: () => getInvitation(id),
    enabled: Boolean(id),
  });

  const guestsQuery = useQuery({
    queryKey: ["invitation-guests", id],
    queryFn: () => listGuests(id),
    enabled: Boolean(id),
  });

  // Eligible guest pool
  const guestItems = guestsQuery.data?.items || [];
  const guestPool = guestItems.length > 0
    ? guestItems.map((g) => ({ id: g.id, name: g.fullName, group: "Khách quý", table: "Bàn tự do" }))
    : [
        { id: "1", name: "Nguyễn Văn Hùng", group: "Bạn Đại Học", table: "Bàn 03" },
        { id: "2", name: "Trần Thị Mai Phương", group: "Đồng Nghiệp", table: "Bàn 05" },
        { id: "3", name: "Lê Hoàng Nam", group: "Nhà Trai", table: "Bàn 01" },
        { id: "4", name: "Phạm Thu Trang", group: "Bạn Cấp 3", table: "Bàn 07" },
        { id: "5", name: "Đỗ Minh Quân", group: "Nhà Gái", table: "Bàn 02" },
        { id: "6", name: "Hoàng Bích Ngọc", group: "Đồng Nghiệp", table: "Bàn 06" },
        { id: "7", name: "Vũ Đình Trọng", group: "Hội Bóng Đá", table: "Bàn 08" },
        { id: "8", name: "Đặng Thùy Linh", group: "Nhà Gái", table: "Bàn 04" },
      ];

  // Exclude already won guests
  const availableGuests = guestPool.filter((g) => !winners.some((w) => w.name === g.name));

  const startDraw = () => {
    if (availableGuests.length === 0) {
      toast.error("Tất cả khách mời đều đã nhận giải!");
      return;
    }
    setIsSpinning(true);
    setCurrentWinner(null);

    let counter = 0;
    const totalSteps = 45;
    const interval = setInterval(() => {
      counter++;
      const randomGuest = availableGuests[Math.floor(Math.random() * availableGuests.length)];
      setCurrentDisplayName(randomGuest.name);
      playTickSound();

      if (counter >= totalSteps) {
        clearInterval(interval);
        const finalWinnerGuest = availableGuests[Math.floor(Math.random() * availableGuests.length)];
        const winnerObj: Winner = {
          id: finalWinnerGuest.id,
          name: finalWinnerGuest.name,
          group: finalWinnerGuest.group,
          table: finalWinnerGuest.table,
          prize: selectedPrize.name,
          drawnAt: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        };
        setCurrentDisplayName(finalWinnerGuest.name);
        setCurrentWinner(winnerObj);
        setWinners((prev) => [winnerObj, ...prev]);
        setIsSpinning(false);
        playWinFanfare();
        triggerConfetti();
      }
    }, 60);
  };

  const playTickSound = () => {
    if (isMuted) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (err) {
      void err;
    }
  };

  const playWinFanfare = () => {
    if (isMuted) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.45);
      });
    } catch (err) {
      void err;
    }
  };

  // Pure HTML5 Canvas Confetti Animation
  const triggerConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#f59e0b", "#ec4899", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#fbbf24"];
    const particles = Array.from({ length: 150 }).map(() => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 22,
      vy: (Math.random() - 0.7) * 20 - 4,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
      gravity: 0.35,
      alpha: 1,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.vRot;
        p.alpha -= 0.007;

        if (p.alpha > 0) {
          aliveCount++;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (aliveCount > 0) {
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    render();
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const copyWinners = () => {
    if (winners.length === 0) return;
    const text = winners.map((w, idx) => `${idx + 1}. [${w.prize}] ${w.name} - ${w.group} (${w.table || ""}) lúc ${w.drawnAt}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Đã sao chép danh sách trúng thưởng!");
    setTimeout(() => setCopied(false), 2000);
  };

  const invitation = invitationQuery.data;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <InvitationSubNav
        invitationId={id}
        title={invitation ? `${invitation.groomName} & ${invitation.brideName}` : "Hôn Lễ"}
        subtitle="Quay số trúng thưởng & Minigame sân khấu"
      />

      {/* Confetti Canvas Layer */}
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-50" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Stage Lucky Draw Roller */}
        <div className="lg:col-span-8 space-y-6">
          {/* Prize Tier Selector */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl border border-border bg-card shadow-sm">
            {PRIZE_TIERS.map((tier) => (
              <button
                key={tier.id}
                type="button"
                onClick={() => !isSpinning && setSelectedPrize(tier)}
                disabled={isSpinning}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                  selectedPrize.id === tier.id
                    ? "bg-foreground text-background shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{tier.icon}</span>
                <span>{tier.name}</span>
              </button>
            ))}
          </div>

          {/* Big Stage Wheel / Digital Roll Screen */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-border bg-gradient-to-b from-card to-background p-8 sm:p-14 text-center shadow-xl">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMuted(!isMuted)}
                className="h-8 w-8 p-0 text-muted-foreground"
              >
                {isMuted ? <VolumeX className="h-4 w-4 text-destructive" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>

            <Badge variant="outline" className="mb-4 px-3 py-1 text-xs font-bold uppercase tracking-widest bg-accent/10 border-accent/30 text-accent">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" /> {selectedPrize.name}
            </Badge>

            <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-6">
              Ứng viên tham gia: {availableGuests.length} khách mời
            </h2>

            {/* Roller Display Box */}
            <div className="my-6 rounded-2xl border-2 border-accent/40 bg-card/90 p-8 sm:p-12 shadow-inner ring-4 ring-accent/10">
              <motion.div
                key={currentDisplayName}
                initial={{ scale: 0.95, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground drop-shadow-sm min-h-[70px] flex items-center justify-center"
              >
                {currentDisplayName}
              </motion.div>
            </div>

            {/* Draw Button */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={startDraw}
                disabled={isSpinning || availableGuests.length === 0}
                className="h-14 px-10 text-base font-bold shadow-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-all transform active:scale-95"
              >
                <RefreshCw className={`mr-2 h-5 w-5 ${isSpinning ? "animate-spin" : ""}`} />
                {isSpinning ? "ĐANG QUAY..." : "BẮT ĐẦU QUAY SỐ"}
              </Button>
            </div>
          </div>

          {/* Winner Celebration Banner */}
          <AnimatePresence>
            {currentWinner && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/15 p-6 backdrop-blur shadow-lg flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-stone-950 font-bold text-2xl shadow-md">
                    👑
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                      Chúc Mừng Tân Chủ Nhân {currentWinner.prize}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-foreground">
                      {currentWinner.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {currentWinner.group} • {currentWinner.table}
                    </p>
                  </div>
                </div>
                <Badge className="bg-amber-400 text-stone-950 font-bold text-xs">
                  <Trophy className="mr-1 h-3.5 w-3.5" /> Đã trao giải
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: History of Winners */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                <Trophy className="h-4 w-4 text-accent" /> Danh Sách Trúng Giải ({winners.length})
              </h3>
              {winners.length > 0 && (
                <Button size="sm" variant="ghost" onClick={copyWinners} className="h-8 text-xs">
                  {copied ? <Check className="mr-1 h-3.5 w-3.5 text-emerald-500" /> : <Copy className="mr-1 h-3.5 w-3.5" />}
                  {copied ? "Đã sao chép" : "Sao chép"}
                </Button>
              )}
            </div>

            {winners.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                <Award className="mx-auto h-8 w-8 mb-2 opacity-40 text-muted-foreground" />
                Chưa có lượt quay nào. Hãy chọn giải thưởng và bấm quay số!
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1 scrollbar-none">
                {winners.map((w, index) => (
                  <div
                    key={`${w.name}-${index}`}
                    className="flex items-center justify-between rounded-xl border border-border/80 bg-background/80 p-3 text-xs transition hover:border-accent/40"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {w.prize}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{w.drawnAt}</span>
                      </div>
                      <p className="font-semibold text-foreground truncate text-sm">{w.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{w.group} • {w.table}</p>
                    </div>
                    <span className="text-xl shrink-0">🎉</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-4 text-xs text-muted-foreground space-y-1.5">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-accent" /> Mẹo cho MC tiệc cưới:
            </p>
            <p>• Dữ liệu quay số tự động cập nhật từ danh sách khách mời đã Check-in tại sảnh cưới.</p>
            <p>• Khách mời đã trúng thưởng sẽ tự động được loại khỏi các vòng quay tiếp theo để đảm bảo công bằng.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

import React from "react";
import {
  Ban,
  Check,
  Flower2,
  Heart,
  Image,
  Layers,
  Leaf,
  Moon,
  Sparkles,
  Star,
  Sun,
  Wand2,
  Gem,
  MousePointerClick,
  Palette,
} from "lucide-react";
import { motion } from "framer-motion";
import fallbackPhoto from "@/assets/couple-1.jpg";
import { useWeddingConfig, type WeddingConfig } from "@/store/weddingConfigStore";
import { Field, PanelHeader } from "./_shared";

type ParticleValue = NonNullable<WeddingConfig["particlesType"]>;
type FilterValue = NonNullable<WeddingConfig["photoFilter"]>;
type FrameStyleValue = NonNullable<WeddingConfig["photoFrameStyle"]>;
type ParticleSpeed = NonNullable<WeddingConfig["particleSpeed"]>;
type ParticleDensity = NonNullable<WeddingConfig["particleDensity"]>;

const particleOptions: Array<{
  value: ParticleValue;
  label: string;
  tone: string;
  icon: typeof Sparkles;
}> = [
  { value: "sparkles", label: "Ánh sao ngọc trai", tone: "from-[#3c3124] to-[#745b31]", icon: Sparkles },
  { value: "petals", label: "Cánh hoa hồng bay", tone: "from-[#f5dce1] to-[#c98593]", icon: Flower2 },
  { value: "sakura", label: "Hoa anh đào rơi", tone: "from-[#ffc0cb] to-[#e75480]", icon: Flower2 },
  { value: "hearts", label: "Trái tim 3D bay", tone: "from-[#ff758c] to-[#ff7eb3]", icon: Heart },
  { value: "gold_stars", label: "Ngôi sao vàng Art Deco", tone: "from-[#ffe259] to-[#ffa751]", icon: Star },
  { value: "leaves", label: "Lá thu lãng mạn", tone: "from-[#ead8b9] to-[#9a5a39]", icon: Leaf },
  { value: "galaxy", label: "Vũ trụ lung linh", tone: "from-[#2b5876] to-[#4e4376]", icon: Moon },
  { value: "snow", label: "Bông tuyết pha lê", tone: "from-[#e3f2fd] to-[#90caf9]", icon: Gem },
  { value: "fireflies", label: "Đom đóm phát sáng", tone: "from-[#1b5e20] to-[#ffeb3b]", icon: Sun },
  { value: "bubbles", label: "Bọt sóng biển", tone: "from-[#e0f7fa] to-[#00bcd4]", icon: Moon },
  { value: "gold_dust", label: "Bụi vàng 24K", tone: "from-[#bf953f] to-[#fcf6ba]", icon: Star },
  { value: "none", label: "Không dùng hiệu ứng", tone: "from-[#ece8e2] to-[#d4cec6]", icon: Ban },
];

const photoOptions: Array<{ value: FilterValue; label: string; imageClass: string }> = [
  { value: "none", label: "Màu ảnh gốc", imageClass: "" },
  { value: "vintage", label: "Phim cổ điển", imageClass: "sepia-[.45] saturate-125 contrast-110" },
  { value: "grayscale", label: "Đen trắng nghệ thuật", imageClass: "grayscale contrast-110" },
  { value: "sepia", label: "Sắc nâu ấm áp", imageClass: "sepia" },
  { value: "blur", label: "Mờ ảo dịu dàng", imageClass: "blur-[1px] scale-[1.02]" },
];

const frameStyleOptions: Array<{ value: FrameStyleValue; label: string; desc: string }> = [
  { value: "brass_corners", label: "Góc mạ vàng 24K", desc: "4 góc chạm khắc hoàng gia" },
  { value: "gold_edge", label: "Khung viền vàng kim", desc: "Ánh kim loại sang trọng" },
  { value: "frosted_glass", label: "Kính mờ cao cấp", desc: "Bề mặt mờ mịn tinh tế" },
  { value: "classic", label: "Mộc mạc cổ điển", desc: "Thiết kế trang nhã tự nhiên" },
];

export const EffectsPanel: React.FC = () => {
  const {
    particlesType = "sparkles",
    photoFilter = "none",
    glassBlur = 16,
    glowBorder = true,
    particleSpeed = "medium",
    particleDensity = "normal",
    photoAuraGlow = true,
    photoShimmer = true,
    photoTilt3d = true,
    touchSparkles = true,
    photoColorShift = false,
    photoFrameStyle = "brass_corners",
    coverImageUrl,
    accentColor,
    setField,
  } = useWeddingConfig();

  const previewPhoto = coverImageUrl || fallbackPhoto;

  return (
    <div className="space-y-7 pb-8">
      <PanelHeader
        icon={<Wand2 className="h-4 w-4 text-accent" />}
        title="Hiệu ứng hình ảnh & Hạt rơi"
        sub="Tùy chỉnh hiệu ứng hạt bay lãng mạn, kính mờ Glassmorphism và hiệu ứng ảnh cưới nghệ thuật"
      />

      {/* Hiệu ứng tương tác trực quan */}
      <Field label="Hiệu ứng tương tác ảnh cưới (Interactive Effects)">
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => setField("photoAuraGlow", !photoAuraGlow)}
            className={`p-3 rounded-xl border font-body text-xs font-semibold flex items-center justify-between transition ${
              photoAuraGlow ? "border-accent bg-accent/10 text-accent" : "border-border bg-card text-muted-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <Sun className="w-4 h-4" /> Hào quang phát sáng
            </span>
            {photoAuraGlow && <Check className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => setField("photoShimmer", !photoShimmer)}
            className={`p-3 rounded-xl border font-body text-xs font-semibold flex items-center justify-between transition ${
              photoShimmer ? "border-accent bg-accent/10 text-accent" : "border-border bg-card text-muted-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <Gem className="w-4 h-4" /> Ánh kim lấp lánh
            </span>
            {photoShimmer && <Check className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => setField("photoTilt3d", !photoTilt3d)}
            className={`p-3 rounded-xl border font-body text-xs font-semibold flex items-center justify-between transition ${
              photoTilt3d ? "border-accent bg-accent/10 text-accent" : "border-border bg-card text-muted-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4" /> Nghiêng 3D chuyển động
            </span>
            {photoTilt3d && <Check className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => setField("touchSparkles", !touchSparkles)}
            className={`p-3 rounded-xl border font-body text-xs font-semibold flex items-center justify-between transition ${
              touchSparkles ? "border-accent bg-accent/10 text-accent" : "border-border bg-card text-muted-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <MousePointerClick className="w-4 h-4" /> Chạm phát ánh sáng
            </span>
            {touchSparkles && <Check className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => setField("photoColorShift", !photoColorShift)}
            className={`p-3 rounded-xl border font-body text-xs font-semibold flex items-center justify-between transition ${
              photoColorShift ? "border-accent bg-accent/10 text-accent" : "border-border bg-card text-muted-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <Palette className="w-4 h-4" /> Đơn sắc sang rực rỡ
            </span>
            {photoColorShift && <Check className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => setField("glowBorder", !glowBorder)}
            className={`p-3 rounded-xl border font-body text-xs font-semibold flex items-center justify-between transition ${
              glowBorder ? "border-accent bg-accent/10 text-accent" : "border-border bg-card text-muted-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Viền phát sáng lấp lánh
            </span>
            {glowBorder && <Check className="w-3.5 h-3.5" />}
          </button>
        </div>
      </Field>

      {/* Decorative photo frame style */}
      <Field label="Kiểu khung viền ảnh cưới (Frame Style)">
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {frameStyleOptions.map((opt) => {
            const active = photoFrameStyle === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setField("photoFrameStyle", opt.value)}
                className={`p-3 rounded-xl border text-left transition ${
                  active ? "border-accent bg-accent/10 text-accent font-semibold" : "border-border bg-card text-muted-foreground"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-body text-xs font-bold text-foreground">{opt.label}</span>
                  {active && <Check className="w-3.5 h-3.5 text-accent" />}
                </div>
                <p className="font-body text-[10px] text-muted-foreground">{opt.desc}</p>
              </button>
            );
          })}
        </div>
      </Field>

      {/* Floating particle effects */}
      <Field label="Hiệu ứng hạt bay nền (Particles)">
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {particleOptions.map((option) => {
            const Icon = option.icon;
            const active = particlesType === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setField("particlesType", option.value)}
                className={`relative min-h-[84px] overflow-hidden border rounded-xl p-3 text-left transition duration-200 ${
                  active
                    ? "border-accent bg-accent/[0.08] ring-1 ring-accent shadow-gold"
                    : "border-border bg-card hover:border-foreground/25 hover:bg-muted/35"
                }`}
              >
                <div className={`relative mb-2 h-7 rounded-lg overflow-hidden bg-gradient-to-br ${option.tone}`}>
                  <Icon className="absolute left-2 top-1 h-5 w-5 text-white/90" />
                </div>
                <span className="block pr-5 font-body text-xs font-semibold text-foreground">{option.label}</span>
                {active && (
                  <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-accent text-accent-foreground">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Field>

      {/* Glassmorphism blur controls */}
      <Field label={`Độ mờ kính Glassmorphism (${glassBlur}px)`}>
        <div className="space-y-2 pt-1">
          <input
            type="range"
            min="0"
            max="32"
            step="2"
            value={glassBlur}
            onChange={(e) => setField("glassBlur", Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
          />
          <div className="flex justify-between font-body text-[10px] text-muted-foreground">
            <span>0px (Trong suốt)</span>
            <span>16px (Vừa phải)</span>
            <span>32px (Mờ đậm)</span>
          </div>
        </div>
      </Field>

      {/* Particle speed and density */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Tốc độ bay của hạt">
          <select
            value={particleSpeed}
            onChange={(e) => setField("particleSpeed", e.target.value as ParticleSpeed)}
            className="w-full h-9 px-3 rounded-lg border border-input bg-card text-xs font-body"
          >
            <option value="slow">Bay chậm nhẹ nhàng</option>
            <option value="medium">Tốc độ vừa phải</option>
            <option value="fast">Rộn ràng sinh động</option>
          </select>
        </Field>

        <Field label="Mật độ hạt rơi">
          <select
            value={particleDensity}
            onChange={(e) => setField("particleDensity", e.target.value as ParticleDensity)}
            className="w-full h-9 px-3 rounded-lg border border-input bg-card text-xs font-body"
          >
            <option value="low">Thưa thớt nhẹ nhàng</option>
            <option value="normal">Cân đối tự nhiên</option>
            <option value="dense">Dày đặc lung linh</option>
          </select>
        </Field>
      </div>

      {/* Photo color filters */}
      <Field label="Bộ lọc màu ảnh cưới (Photo Filter)">
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {photoOptions.map((option) => {
            const active = photoFilter === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setField("photoFilter", option.value)}
                className={`relative overflow-hidden border rounded-xl bg-card text-left transition duration-200 ${
                  active ? "border-accent ring-1 ring-accent/40" : "border-border hover:border-foreground/25"
                }`}
                aria-pressed={active}
              >
                <div className="h-[64px] overflow-hidden bg-muted">
                  <img src={previewPhoto} alt="" className={`h-full w-full object-cover ${option.imageClass}`} />
                </div>
                <div className="flex items-center gap-2 px-2.5 py-2">
                  <Image className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-body text-[11px] font-semibold text-foreground">{option.label}</span>
                  {active && <Check className="ml-auto h-3.5 w-3.5 text-accent" />}
                </div>
              </button>
            );
          })}
        </div>
      </Field>
    </div>
  );
};

export default EffectsPanel;

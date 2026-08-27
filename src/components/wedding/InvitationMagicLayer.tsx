import { motion } from "framer-motion";
import type { WeddingTheme } from "@/data/themes";

interface InvitationMagicLayerProps {
  accentColor: string;
  effect?: string;
  intensity?: WeddingTheme["animationIntensity"];
}

const STAR_POINTS = [
  [8, 14, 2.4, 0.0],
  [18, 62, 1.8, 0.7],
  [28, 28, 2.8, 1.4],
  [36, 78, 1.6, 2.1],
  [46, 18, 2.2, 0.4],
  [58, 68, 2.9, 1.1],
  [66, 34, 1.7, 1.8],
  [78, 16, 2.5, 0.9],
  [86, 72, 2.0, 1.6],
  [94, 42, 1.5, 2.3],
  [14, 86, 2.6, 1.2],
  [52, 48, 1.4, 0.2],
] as const;

const PETAL_POINTS = [
  [12, 1.2, 18, 34],
  [26, 3.6, 22, -28],
  [42, 0.4, 16, 40],
  [63, 2.4, 20, -36],
  [82, 4.2, 18, 30],
] as const;

const SPARK_PATH = "M50 0L57 41L100 50L57 59L50 100L43 59L0 50L43 41L50 0Z";
const PETAL_PATH = "M9 1C4 4 2 10 6 15C11 19 18 14 17 8C16 4 13 2 9 1Z";
const SNOW_PATH = "M10 0L10 20M0 10L20 10M3 3L17 17M3 17L17 3";

const densityByIntensity = {
  subtle: 7,
  moderate: 10,
  dramatic: 12,
  high: 12,
};

const InvitationMagicLayer = ({ accentColor, effect, intensity = "moderate" }: InvitationMagicLayerProps) => {
  const starCount = densityByIntensity[intensity];
  const isGold = effect === "gold-particles" || intensity === "dramatic" || intensity === "high";
  const isFloral = effect === "sakura-float" || effect === "butterfly-trail" || effect === "tropical-leaves";
  const isCosmic = effect === "cosmic-orbits";
  const isSnow = effect === "winter-frost" || effect === "snow-crystals";
  const isAurora = effect === "aurora-waves";
  const showLines = effect === "geometric-lines";

  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden motion-reduce:hidden" aria-hidden="true">
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          background: `radial-gradient(circle at 50% 18%, ${accentColor}35, transparent 36%), radial-gradient(circle at 78% 72%, ${accentColor}24, transparent 32%)`,
          mixBlendMode: "screen",
        }}
      />

      {/* Aurora Ambient Curtain */}
      {isAurora && (
        <motion.div
          className="absolute inset-x-0 -top-24 h-[60vh] opacity-30 blur-3xl pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(100,255,218,0.4) 0%, rgba(23,42,69,0) 50%, rgba(100,255,218,0.25) 100%)",
          }}
          animate={{
            opacity: [0.2, 0.45, 0.2],
            scaleY: [0.9, 1.1, 0.9],
            x: ["-5%", "5%", "-5%"],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Twinkling star particles */}
      {STAR_POINTS.slice(0, starCount).map(([left, top, size, delay], index) => (
        <motion.span
          key={`star-${index}`}
          className="absolute"
          style={{ left: `${left}%`, top: `${top}%`, width: size * 6, height: size * 6 }}
          initial={{ opacity: 0, scale: 0.65, rotate: 0 }}
          animate={{
            opacity: [0, isGold ? 0.95 : 0.65, 0],
            scale: [0.65, 1.25, 0.72],
            rotate: 180,
          }}
          transition={{ duration: 3.2 + (index % 3) * 0.7, delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 100 100" className="h-full w-full" style={{ color: isGold ? "#F8D98B" : accentColor }}>
            <path d={SPARK_PATH} fill="currentColor" opacity="0.9" />
          </svg>
        </motion.span>
      ))}

      {/* Snow crystals for winter */}
      {isSnow &&
        [15, 35, 55, 75, 90].map((left, index) => (
          <motion.span
            key={`snow-${index}`}
            className="absolute -top-10"
            style={{ left: `${left}%`, width: 22, height: 22, color: "#FFFFFF" }}
            animate={{
              y: ["-4vh", "108vh"],
              rotate: [0, 360],
              opacity: [0, 0.7, 0.7, 0],
            }}
            transition={{ duration: 14 + index * 2, delay: index * 1.5, repeat: Infinity, ease: "linear" }}
          >
            <svg viewBox="0 0 20 20" className="h-full w-full stroke-current" strokeWidth="1.5">
              <path d={SNOW_PATH} />
            </svg>
          </motion.span>
        ))}

      {/* Cosmic orbital ellipses */}
      {isCosmic && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[650px] max-h-[650px] rounded-full border border-dashed opacity-25"
            style={{ borderColor: accentColor }}
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45vw] h-[45vw] max-w-[420px] max-h-[420px] rounded-full border opacity-15"
            style={{ borderColor: accentColor }}
            animate={{ rotate: -360 }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}

      {/* Floral petals */}
      {isFloral &&
        PETAL_POINTS.map(([left, delay, size, drift], index) => (
          <motion.span
            key={`petal-${index}`}
            className="absolute -top-10"
            style={{ left: `${left}%`, width: size, height: size, color: accentColor }}
            animate={{
              y: ["-4vh", "108vh"],
              x: [0, drift, drift * 0.4],
              rotate: [0, 90 + index * 20, 210 + index * 24],
              opacity: [0, 0.55, 0.4, 0],
            }}
            transition={{ duration: 16 + index * 1.8, delay, repeat: Infinity, ease: "linear" }}
          >
            <svg viewBox="0 0 20 18" className="h-full w-full">
              <path d={PETAL_PATH} fill="currentColor" opacity="0.75" />
            </svg>
          </motion.span>
        ))}

      {/* Geometric laser lines for modern/cyber */}
      {showLines &&
        [0, 1, 2, 3].map((line) => (
          <motion.span
            key={`line-${line}`}
            className="absolute h-px w-[62vw]"
            style={{
              top: `${18 + line * 18}%`,
              left: line % 2 === 0 ? "-18vw" : "56vw",
              background: `linear-gradient(90deg, transparent, ${accentColor}82, transparent)`,
            }}
            animate={{ x: line % 2 === 0 ? ["0vw", "118vw"] : ["0vw", "-118vw"], opacity: [0, 0.55, 0] }}
            transition={{ duration: 9 + line * 1.4, delay: line * 0.8, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
    </div>
  );
};

export default InvitationMagicLayer;

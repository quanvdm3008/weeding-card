import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { IMAGE_REVEAL_DURATION_SECONDS } from "@/lib/animationTiming";

interface SparklingImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  accentColor?: string;
  containerClassName?: string;
  fallbackSrc?: string;
  auraGlow?: boolean;
  shimmer?: boolean;
  tilt3d?: boolean;
  touchSparkles?: boolean;
  colorShift?: boolean;
}

const sparkles = [
  { top: "16%", left: "18%", size: 12, delay: 0 },
  { top: "28%", left: "78%", size: 9, delay: 0.45 },
  { top: "56%", left: "12%", size: 8, delay: 0.9 },
  { top: "68%", left: "72%", size: 13, delay: 1.25 },
  { top: "42%", left: "48%", size: 7, delay: 1.65 },
  { top: "82%", left: "36%", size: 10, delay: 2.05 },
];

export const SparklingImage: React.FC<SparklingImageProps> = ({
  accentColor = "#FFD700",
  containerClassName = "",
  className = "",
  fallbackSrc,
  auraGlow = true,
  shimmer = true,
  tilt3d = true,
  touchSparkles = true,
  colorShift = false,
  fetchPriority,
  onError,
  ...props
}) => {
  const isPriorityImage = props.loading === "eager" || fetchPriority === "high";
  // 3D Motion Tilt Values
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { stiffness: 300, damping: 24 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-6, 6]), springConfig);

  const [mouseTrail, setMouseTrail] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt3d && !touchSparkles) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    if (tilt3d) {
      mouseX.set(x);
      mouseY.set(y);
    }

    if (touchSparkles) {
      const newSparkle = { id: Date.now() + Math.random(), x: e.clientX - rect.left, y: e.clientY - rect.top };
      setMouseTrail((prev) => [...prev.slice(-6), newSparkle]);
    }
  };

  const handleMouseLeave = () => {
    if (tilt3d) {
      mouseX.set(0.5);
      mouseY.set(0.5);
    }
  };

  return (
    <motion.div
      style={tilt3d ? { rotateX, rotateY, transformStyle: "preserve-3d" } : {}}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative h-full w-full overflow-hidden group rounded-inherit ${containerClassName}`}
    >
      {/* 1. Ambient Color Aura Glow */}
      {auraGlow && (
        <div
          className="pointer-events-none absolute -inset-4 rounded-3xl opacity-30 blur-xl transition-all duration-700 group-hover:opacity-70 group-hover:blur-2xl z-0"
          style={{
            background: `radial-gradient(circle at center, ${accentColor} 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Main Image with Mono-to-Color hover option */}
      <motion.img
        initial={isPriorityImage ? false : { opacity: 0, scale: 1.03, filter: "blur(6px)" }}
        whileInView={isPriorityImage ? undefined : { opacity: 1, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.1 }}
        whileHover={{ scale: 1.04 }}
        transition={{ duration: IMAGE_REVEAL_DURATION_SECONDS, ease: [0.22, 1, 0.36, 1] }}
        className={`relative z-10 h-full w-full transition duration-700 ${
          colorShift ? "filter grayscale group-hover:grayscale-0 group-hover:contrast-105" : "group-hover:saturate-[1.08]"
        } ${className}`}
        onError={(event) => {
          const image = event.currentTarget;
          if (fallbackSrc && image.dataset.fallbackApplied !== "true") {
            image.dataset.fallbackApplied = "true";
            image.src = fallbackSrc;
          }
          onError?.(event);
        }}
        {...(props as unknown as React.ComponentProps<typeof motion.img>)}
        {...(fetchPriority ? { fetchpriority: fetchPriority } : {})}
      />

      {/* 2. Shimmer Light Sweep Glass Layer */}
      {shimmer && (
        <motion.div
          className="pointer-events-none absolute inset-y-0 -left-full z-20 w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ["0%", "350%"] }}
          transition={{ duration: 8, repeat: Infinity, repeatDelay: 9, ease: "easeInOut" }}
        />
      )}

      {/* Border Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 z-20"
        style={{ boxShadow: `inset 0 0 0 1px ${accentColor}50, inset 0 0 35px ${accentColor}25` }}
      />

      {/* 3. Interactive Touch Sparkle Dust Trail */}
      {touchSparkles &&
        mouseTrail.map((p) => (
          <motion.span
            key={p.id}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 0, y: -15 }}
            transition={{ duration: 0.8 }}
            className="pointer-events-none absolute w-3 h-3 rounded-full z-30 font-bold text-xs"
            style={{ left: p.x, top: p.y, color: accentColor }}
          >
            ✨
          </motion.span>
        ))}

      {/* Constant subtle sparkles */}
      {sparkles.map((sparkle) => (
        <motion.span
          key={`${sparkle.top}-${sparkle.left}`}
          className="pointer-events-none absolute z-20 motion-reduce:hidden"
          style={{
            top: sparkle.top,
            left: sparkle.left,
            width: sparkle.size,
            height: sparkle.size,
            color: accentColor,
          }}
          initial={{ opacity: 0, scale: 0.7, rotate: 0 }}
          animate={{ opacity: [0, 0.26, 0], scale: [0.85, 1.05, 0.85], rotate: 120 }}
          transition={{ duration: 7.5, delay: sparkle.delay * 2, repeat: Infinity, repeatDelay: 4.5, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow">
            <path d="M50 0L57 41L100 50L57 59L50 100L43 59L0 50L43 41L50 0Z" fill="currentColor" />
          </svg>
        </motion.span>
      ))}
    </motion.div>
  );
};

export default SparklingImage;

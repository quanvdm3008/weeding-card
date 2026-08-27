import { motion } from "framer-motion";
import { useMemo } from "react";

export type AmbientVariant = "bokeh" | "blob" | "particle";
export type AmbientDensity = "low" | "medium";

interface AmbientLayerProps {
  variant: AmbientVariant;
  density?: AmbientDensity;
  className?: string;
}

const GOLD = "hsl(38 55% 75%)";
const ROSE = "hsl(346 50% 75%)";
const CREAM = "hsl(30 60% 90%)";

/**
 * Shared background decoration layer — extracted from 3 duplicate handwritings
 * (HeroSection bokeh, Testimonials/CTASection blob, Footer particle), as suggested
 * Depth/Layer System (MASTER_ROADMAP.md §17/§18.4). Always `pointer-events-none`, set
 * absolute in a container `position: relative`.
 */
export const AmbientLayer = ({ variant, density = "medium", className = "" }: AmbientLayerProps) => {
  const count = density === "low" ? 8 : 16;

  const bokehDots = useMemo(
    () =>
      variant === "bokeh"
        ? Array.from({ length: count }, (_, i) => ({
            id: i,
            size: 4 + Math.random() * 14,
            left: Math.random() * 100,
            top: 10 + Math.random() * 80,
            duration: 5 + Math.random() * 8,
            delay: Math.random() * 7,
            color: i % 3 === 0 ? GOLD : i % 3 === 1 ? ROSE : CREAM,
            bx: (Math.random() - 0.5) * 60,
            by: -40 - Math.random() * 80,
          }))
        : [],
    [variant, count]
  );

  const particles = useMemo(
    () =>
      variant === "particle"
        ? Array.from({ length: count }, (_, i) => ({
            id: i,
            size: 1.5 + Math.random() * 3,
            left: (i * 97) % 100,
            top: (i * 71) % 100,
            color: i % 2 === 0 ? "hsl(38 60% 65%)" : "hsl(346 45% 65%)",
            duration: 4 + (i % 3),
            delay: i * 0.6,
          }))
        : [],
    [variant, count]
  );

  if (variant === "bokeh") {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
        {bokehDots.map((d) => (
          <div
            key={d.id}
            className="bokeh-dot"
            style={{
              width: d.size,
              height: d.size,
              left: `${d.left}%`,
              top: `${d.top}%`,
              background: d.color,
              filter: `blur(${d.size * 0.4}px)`,
              opacity: 0.5,
              ["--bd" as string]: `${d.duration}s`,
              ["--delay" as string]: `${d.delay}s`,
              ["--bx" as string]: `${d.bx}px`,
              ["--by" as string]: `${d.by}px`,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "blob") {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
        <motion.div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-30"
          style={{ background: `radial-gradient(circle, hsl(38 70% 85% / 0.6), transparent 70%)`, filter: "blur(60px)" }}
          animate={{ scale: [1, 1.1, 1], x: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-25"
          style={{ background: `radial-gradient(circle, hsl(346 60% 85% / 0.5), transparent 70%)`, filter: "blur(50px)" }}
          animate={{ scale: [1, 1.15, 1], y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      </div>
    );
  }

  // particle
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ width: p.size, height: p.size, left: `${p.left}%`, top: `${p.top}%`, background: p.color, opacity: 0.3 }}
          animate={{ opacity: [0, 0.5, 0], y: [0, -20, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
        />
      ))}
    </div>
  );
};

export default AmbientLayer;

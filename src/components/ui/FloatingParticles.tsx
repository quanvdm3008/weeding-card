import { motion } from "framer-motion";
import { useWeddingConfig } from "@/store/weddingConfigStore";

export type ParticleType =
  | "none"
  | "sparkles"
  | "petals"
  | "leaves"
  | "galaxy"
  | "pixel"
  | "sakura"
  | "hearts"
  | "gold_stars"
  | "gold_dust"
  | "snow"
  | "fireflies"
  | "bubbles";

interface FloatingParticlesProps {
  count?: number;
  color?: string;
  type?: ParticleType;
  contained?: boolean;
}

const GalaxyField = ({ color, count }: { color: string; count: number }) => (
  <div className="absolute inset-0 overflow-hidden [perspective:900px]">
    <motion.div
      className="absolute inset-[-12%] [transform-style:preserve-3d] motion-reduce:transform-none"
      animate={{ rotateZ: [0, 360], rotateX: [64, 67, 64] }}
      transition={{
        rotateZ: { duration: 80, repeat: Infinity, ease: "linear" },
        rotateX: { duration: 14, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      {Array.from({ length: Math.max(42, count) }).map((_, index) => {
        const angle = (index * 137.5 * Math.PI) / 180;
        const radius = 12 + ((index * 29) % 34);
        const size = 1.4 + (index % 4) * 0.75;
        const depth = ((index * 41) % 420) - 210;
        return (
          <motion.span
            key={index}
            className="absolute left-1/2 top-1/2 block"
            style={{
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: index % 5 === 0 ? "#ffffff" : color,
              boxShadow: `0 0 ${size * 4}px ${index % 5 === 0 ? "#ffffff" : color}`,
              transform: `translate3d(${Math.cos(angle) * radius}vw, ${Math.sin(angle) * radius * 0.52}vh, ${depth}px)`,
            }}
            animate={{ opacity: [0.22, 0.9, 0.22], scale: [0.8, 1.4, 0.8] }}
            transition={{ duration: 2.8 + (index % 5), delay: (index % 9) * 0.3, repeat: Infinity, ease: "easeInOut" }}
          />
        );
      })}
      <div className="absolute left-1/2 top-1/2 h-[34vh] w-[76vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/20" />
      <div
        className="absolute left-1/2 top-1/2 h-[22vh] w-[52vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border"
        style={{ borderColor: `${color}55` }}
      />
    </motion.div>
  </div>
);

const PixelField = ({ color, count }: { color: string; count: number }) => (
  <div className="absolute inset-0 overflow-hidden">
    {Array.from({ length: Math.min(Math.max(count, 32), 42) }).map((_, index) => {
      const size = 4 + (index % 4) * 2;
      return (
        <motion.span
          key={index}
          className="absolute block"
          style={{
            left: `${(index * 37 + 7) % 100}%`,
            top: `${(index * 19) % 92}%`,
            width: size,
            height: size,
            backgroundColor: index % 4 === 0 ? "#ffffff" : color,
            boxShadow: index % 3 === 0 ? `8px 0 0 ${color}66, 0 8px 0 ${color}44` : undefined,
          }}
          animate={{ y: [0, -24, -24, 0], x: [0, 0, 8, 8, 0], opacity: [0.3, 0.9, 0.55, 0.3] }}
          transition={{ duration: 5 + (index % 4), delay: (index % 10) * 0.35, repeat: Infinity, ease: "linear" }}
        />
      );
    })}
  </div>
);

const SnowField = ({ count }: { count: number }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: Math.max(35, count) }).map((_, index) => {
      const size = 2 + (index % 4) * 2;
      const left = (index * 19 + 7) % 100;
      const delay = (index % 12) * 0.7;
      const duration = 8 + (index % 5) * 2.5;
      const drift = ((index % 7) - 3) * 20;
      return (
        <motion.span
          key={index}
          className="absolute rounded-full bg-white block"
          style={{
            left: `${left}%`,
            top: "-4%",
            width: size,
            height: size,
            boxShadow: "0 0 6px rgba(255,255,255,0.8)",
            filter: index % 3 === 0 ? "blur(1px)" : "none",
          }}
          animate={{
            y: ["0vh", "105vh"],
            x: ["0px", `${drift}px`, `${-drift * 0.5}px`],
            opacity: [0, 0.85, 0.85, 0],
          }}
          transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
        />
      );
    })}
  </div>
);

const FireflyField = ({ color, count }: { color: string; count: number }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: Math.max(24, count) }).map((_, index) => {
      const size = 3 + (index % 3) * 2;
      const left = (index * 23 + 13) % 94;
      const top = (index * 31 + 17) % 90;
      const glowColor = color || "#D8BFD8";
      return (
        <motion.span
          key={index}
          className="absolute rounded-full block"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: size,
            height: size,
            backgroundColor: "#FFFFFF",
            boxShadow: `0 0 ${size * 3}px ${glowColor}, 0 0 ${size * 6}px ${glowColor}aa`,
          }}
          animate={{
            x: [0, (index % 2 === 0 ? 30 : -30), (index % 3 === 0 ? -20 : 20), 0],
            y: [0, (index % 2 === 0 ? -40 : 40), (index % 3 === 0 ? 25 : -25), 0],
            scale: [0.6, 1.4, 0.8, 1.2, 0.6],
            opacity: [0.2, 0.95, 0.4, 0.9, 0.2],
          }}
          transition={{
            duration: 6 + (index % 5) * 2,
            delay: (index % 8) * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      );
    })}
  </div>
);

const BubbleField = ({ color, count }: { count: number; color: string }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: Math.max(20, count) }).map((_, index) => {
      const size = 6 + (index % 5) * 4;
      const left = (index * 29 + 11) % 96;
      const delay = (index % 10) * 0.9;
      const duration = 10 + (index % 4) * 2.5;
      const drift = ((index % 5) - 2) * 15;
      return (
        <motion.span
          key={index}
          className="absolute rounded-full block border"
          style={{
            left: `${left}%`,
            bottom: "-5%",
            width: size,
            height: size,
            borderColor: `${color || "#00838F"}66`,
            backgroundColor: `${color || "#00838F"}15`,
            boxShadow: `inset 0 0 4px ${color || "#00838F"}44`,
          }}
          animate={{
            y: ["0vh", "-108vh"],
            x: ["0px", `${drift}px`, `${-drift}px`],
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
        />
      );
    })}
  </div>
);

export const FloatingParticles = ({
  count = 30,
  color = "#ffffff",
  type,
  contained = false,
}: FloatingParticlesProps) => {
  const store = useWeddingConfig();
  const activeType = type ?? store.particlesType ?? "sparkles";
  const layerClass = `pointer-events-none z-[5] overflow-hidden ${
    contained ? "absolute inset-x-0 top-0 h-[100svh]" : "fixed inset-0"
  }`;

  if (activeType === "none") return null;

  if (activeType === "galaxy") {
    return (
      <div className={layerClass}>
        <GalaxyField color={color} count={count} />
      </div>
    );
  }

  if (activeType === "pixel") {
    return (
      <div className={layerClass}>
        <PixelField color={color} count={count} />
      </div>
    );
  }

  if (activeType === "snow") {
    return (
      <div className={layerClass}>
        <SnowField count={count} />
      </div>
    );
  }

  if (activeType === "fireflies") {
    return (
      <div className={layerClass}>
        <FireflyField color={color} count={count} />
      </div>
    );
  }

  if (activeType === "bubbles") {
    return (
      <div className={layerClass}>
        <BubbleField color={color} count={count} />
      </div>
    );
  }

  const particles = Array.from({ length: count });
  const getParticleStyle = (index: number) => {
    const size = 4 + (index % 5) * 1.4;
    const baseStyle = { width: size, height: size, pointerEvents: "none" as const };

    if (activeType === "petals" || activeType === "sakura") {
      return {
        ...baseStyle,
        width: size * 1.6,
        height: size * 1.6,
        backgroundColor: "#f3b6c3",
        borderRadius: "60% 0 60% 60%",
        boxShadow: "0 2px 5px rgba(243,182,195,.35)",
      };
    }
    if (activeType === "leaves") {
      const leafColors = ["#c96b4d", "#d39b45", "#a74a37", "#d9b76e"];
      return {
        ...baseStyle,
        width: size * 1.4,
        height: size * 1.8,
        backgroundColor: leafColors[index % leafColors.length],
        borderRadius: "100% 0 100% 0",
        boxShadow: "0 2px 4px rgba(0,0,0,.15)",
      };
    }
    if (activeType === "hearts") {
      return {
        ...baseStyle,
        backgroundColor: color,
        borderRadius: "50% 50% 45% 45%",
        boxShadow: `0 0 ${size * 2}px ${color}`,
        transform: "rotate(45deg)",
      };
    }

    // Luxury Stardust & Gold Stars / Gold Dust
    if (activeType === "gold_stars" || activeType === "gold_dust" || activeType === "sparkles") {
      const isGold = activeType === "gold_stars" || activeType === "gold_dust" || index % 3 === 0;
      const pColor = isGold ? "#f5d77f" : color || "#ffffff";
      return {
        ...baseStyle,
        width: activeType === "gold_dust" ? size * 0.8 : size * 1.2,
        height: activeType === "gold_dust" ? size * 0.8 : size * 1.2,
        backgroundColor: pColor,
        borderRadius: index % 2 === 0 ? "50%" : "20%",
        boxShadow: `0 0 ${size * 3}px ${pColor}, 0 0 ${size * 6}px ${pColor}80`,
        filter: "blur(0.2px)",
      };
    }

    return {
      ...baseStyle,
      backgroundColor: color,
      borderRadius: "50%",
      boxShadow: `0 0 ${size * 2}px ${color}`,
    };
  };

  return (
    <div className={layerClass}>
      {particles.map((_, index) => {
        const left = (index * 23 + 11) % 100;
        const delay = (index % 12) * 0.85;
        const duration = 12 + (index % 7) * 1.7;
        const drift = ((index % 9) - 4) * 14;
        const rotate = ((index % 11) - 5) * 52;
        return (
          <motion.div
            key={index}
            className="absolute opacity-0"
            style={{ ...getParticleStyle(index), left: `${left}%`, top: "-5%" }}
            animate={{
              y: ["0vh", "105vh"],
              x: ["0px", `${drift}px`],
              opacity: [0, 0.65, 0.65, 0],
              rotate: [0, rotate],
            }}
            transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
          />
        );
      })}
    </div>
  );
};

export default FloatingParticles;

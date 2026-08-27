import { motion } from "framer-motion";

interface VolumetricLightProps {
  color?: string;
  intensity?: number;
  className?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
}

export const VolumetricLight = ({
  color = "#ffffff",
  intensity = 0.15,
  className = "",
  position = "top-left",
}: VolumetricLightProps) => {
  const getPositionClasses = () => {
    switch (position) {
      case "top-left": return "-top-40 -left-40";
      case "top-right": return "-top-40 -right-40";
      case "bottom-left": return "-bottom-40 -left-40";
      case "bottom-right": return "-bottom-40 -right-40";
      case "center": return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
    }
  };

  return (
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [intensity, intensity * 1.5, intensity],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`absolute w-96 h-96 rounded-full blur-[120px] pointer-events-none z-0 ${getPositionClasses()} ${className}`}
      style={{
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      }}
    />
  );
};

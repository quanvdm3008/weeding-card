import { motion, useScroll, useSpring } from "framer-motion";

const ScrollProgress = ({ accentColor }: { accentColor: string }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[9999] origin-left"
      style={{
        scaleX,
        background: `linear-gradient(90deg, ${accentColor}bb, ${accentColor}, hsl(38 60% 72%))`,
        boxShadow: `0 0 8px ${accentColor}60`,
      }}
    />
  );
};

export default ScrollProgress;

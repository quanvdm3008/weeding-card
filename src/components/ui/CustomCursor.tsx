import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWeddingConfig } from "@/store/weddingConfigStore";

interface Ripple {
  id: number;
  x: number;
  y: number;
  isTrail?: boolean;
}

export const CustomCursor = ({ type }: { type?: "default" | "follow" | "ripple" }) => {
  const isMobile = useIsMobile();
  const store = useWeddingConfig();
  const cursorType = type || store.cursorType || "follow";
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const lastTrailTime = useRef(0);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (isMobile || cursorType === "default") return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);

      // Create subtle water wave trail on movement (throttled)
      if (cursorType === "ripple") {
        const now = Date.now();
        if (now - lastTrailTime.current > 120) {
          lastTrailTime.current = now;
          const newRipple: Ripple = {
            id: now + Math.random(),
            x: e.clientX,
            y: e.clientY,
            isTrail: true,
          };
          setRipples((prev) => [...prev.slice(-15), newRipple]);
        }
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "a" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("cursor-pointer")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleWindowClick = (e: MouseEvent) => {
      if (cursorType === "ripple" || cursorType === "follow") {
        const now = Date.now();
        // Add 3 concentric ripples for a water splash effect
        const id = now + Math.random();
        setRipples((prev) => [
          ...prev.slice(-15),
          { id, x: e.clientX, y: e.clientY }
        ]);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("click", handleWindowClick);
    };
  }, [isMobile, cursorType, cursorX, cursorY]);

  // Clean up ripples after their animation duration
  useEffect(() => {
    if (ripples.length === 0) return;
    const timer = setTimeout(() => {
      setRipples((prev) => prev.filter((r) => Date.now() - r.id < 1000));
    }, 1000);
    return () => clearTimeout(timer);
  }, [ripples]);

  if (isMobile || cursorType === "default") return null;

  return (
    <>
        {/* Click and movement ripples with gold stardust */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.div
              key={ripple.id}
              initial={{
                position: "fixed",
                left: ripple.x,
                top: ripple.y,
                x: "-50%",
                y: "-50%",
                width: 0,
                height: 0,
                borderRadius: "50%",
                border: ripple.isTrail ? "1px solid rgba(212,175,55,0.25)" : "2px solid rgba(253,246,204,0.8)",
                backgroundColor: ripple.isTrail ? "transparent" : "rgba(212,175,55,0.15)",
                boxShadow: ripple.isTrail ? "none" : "0 0 16px rgba(212,175,55,0.6)",
                pointerEvents: "none",
                zIndex: 99999,
                opacity: 1,
              }}
              animate={{
                width: ripple.isTrail ? 40 : 120,
                height: ripple.isTrail ? 40 : 120,
                opacity: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: ripple.isTrail ? 0.6 : 0.9,
                ease: "easeOut",
              }}
            />
          ))}
        </AnimatePresence>

        {/* Celestial Gold Light Aura & Follower */}
        {cursorType === "follow" && (
          <>
            {/* Ambient Soft Gold Glow */}
            <motion.div
              className="fixed top-0 left-0 w-32 h-32 -ml-16 -mt-16 rounded-full pointer-events-none z-[9998] hidden md:block"
              style={{
                x: smoothX,
                y: smoothY,
                background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0) 70%)",
              }}
              animate={{
                opacity: isVisible ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Main Ring Follower */}
            <motion.div
              className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#d4af37]/60 pointer-events-none z-[9999] hidden md:block shadow-[0_0_10px_rgba(212,175,55,0.3)]"
              style={{
                x: smoothX,
                y: smoothY,
              }}
              animate={{
                scale: isHovering ? 1.4 : 1,
                borderColor: isHovering ? "rgba(253,246,204,0.9)" : "rgba(212,175,55,0.6)",
                backgroundColor: isHovering ? "rgba(212,175,55,0.15)" : "transparent",
                opacity: isVisible ? 1 : 0,
              }}
              transition={{ duration: 0.2 }}
            >
              {/* Center sparkling dot */}
              <span className="absolute inset-[38%] rounded-full bg-[#d4af37] shadow-[0_0_4px_#d4af37]" />
            </motion.div>
          </>
        )}
      </>
    );
  };

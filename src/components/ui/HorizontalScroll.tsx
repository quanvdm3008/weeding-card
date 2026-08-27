import { Children, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { GALLERY_AUTOPLAY_INTERVAL_MS } from "@/lib/animationTiming";

interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
  autoPlay?: boolean;
  intervalMs?: number;
  spotlight?: boolean;
  edgeColor?: string;
}

export const HorizontalScroll = ({
  children,
  className = "",
  autoPlay = true,
  intervalMs = GALLERY_AUTOPLAY_INTERVAL_MS,
  spotlight = false,
  edgeColor = "#050505",
}: HorizontalScrollProps) => {
  const items = Children.toArray(children);
  const railRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef<1 | -1>(1);
  const frameRef = useRef(0);
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const updateActive = () => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => {
        const center = rail.scrollLeft + rail.clientWidth / 2;
        let closestIndex = 0;
        let closestDistance = Number.POSITIVE_INFINITY;
        Array.from(rail.children).forEach((child, index) => {
          const item = child as HTMLElement;
          const distance = Math.abs(item.offsetLeft + item.offsetWidth / 2 - center);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });
        setActiveIndex(closestIndex);
      });
    };

    updateActive();
    rail.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive, { passive: true });
    return () => {
      cancelAnimationFrame(frameRef.current);
      rail.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [items.length]);

  useEffect(() => {
    if (!autoPlay || paused || reduceMotion || items.length < 2) return;
    const timer = window.setInterval(() => {
      const rail = railRef.current;
      if (!rail) return;
      const maxScroll = rail.scrollWidth - rail.clientWidth;
      if (rail.scrollLeft >= maxScroll - 8) directionRef.current = -1;
      if (rail.scrollLeft <= 8) directionRef.current = 1;

      const nextIndex = Math.max(0, Math.min(items.length - 1, activeIndex + directionRef.current));
      const item = rail.children[nextIndex] as HTMLElement | undefined;
      if (!item) return;
      rail.scrollTo({
        left: item.offsetLeft - (rail.clientWidth - item.offsetWidth) / 2,
        behavior: "smooth",
      });
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [activeIndex, autoPlay, intervalMs, items.length, paused, reduceMotion]);

  const togglePlayback = () => setPaused((current) => !current);

  return (
    <section
      className={`group/rail relative w-full max-w-full overflow-hidden py-8 ${className}`}
      onMouseEnter={() => autoPlay && setPaused(true)}
      onMouseLeave={() => autoPlay && setPaused(false)}
      onFocusCapture={() => autoPlay && setPaused(true)}
      onBlurCapture={(event) => {
        if (autoPlay && !event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div
        ref={railRef}
        className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-4 pb-6 [scrollbar-width:none] [&>*]:snap-center [&::-webkit-scrollbar]:hidden @md:gap-6 @md:px-10"
        onPointerDown={() => autoPlay && setPaused(true)}
        onPointerUp={() => autoPlay && setPaused(false)}
        onPointerCancel={() => autoPlay && setPaused(false)}
      >
        {items.map((item, index) => {
          const distance = Math.abs(index - activeIndex);
          const opacity = !spotlight ? 1 : distance === 0 ? 1 : distance === 1 ? 0.7 : 0.38;
          const scale = !spotlight ? 1 : distance === 0 ? 1 : distance === 1 ? 0.965 : 0.93;
          return (
            <motion.div
              key={index}
              className="shrink-0"
              animate={{ opacity, scale, y: spotlight && distance === 0 ? -5 : 0 }}
              transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
              aria-current={distance === 0 ? "true" : undefined}
            >
              {item}
            </motion.div>
          );
        })}
      </div>

      {spotlight && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[12vw] min-w-10" style={{ background: `linear-gradient(90deg, ${edgeColor}, transparent)` }} />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[12vw] min-w-10" style={{ background: `linear-gradient(270deg, ${edgeColor}, transparent)` }} />
        </>
      )}

      {autoPlay && items.length > 1 && (
        <button
          type="button"
          onClick={togglePlayback}
          className="absolute bottom-12 right-5 z-20 grid h-10 w-10 place-items-center border border-white/25 bg-black/45 text-white opacity-75 backdrop-blur-md transition hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 @md:right-10"
          aria-label={paused ? "Continue transferring photos automatically" : "Pause image transfer automatically"}
          title={paused ? "Continue" : "Pause"}
        >
          {paused ? <Play className="h-4 w-4 fill-current" /> : <Pause className="h-4 w-4 fill-current" />}
        </button>
      )}

      {spotlight && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5" aria-hidden="true">
          {items.map((_, index) => (
            <motion.i
              key={index}
              className="block h-1 rounded-full"
              animate={{ width: index === activeIndex ? 22 : 5, opacity: index === activeIndex ? 1 : 0.35 }}
              style={{ backgroundColor: index === activeIndex ? "#D7BA73" : "#FFFFFF" }}
            />
          ))}
        </div>
      )}
    </section>
  );
};

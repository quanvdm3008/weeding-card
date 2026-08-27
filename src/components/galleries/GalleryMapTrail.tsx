import { SparklingImage } from "@/components/wedding/SparklingImage";
import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import UniversalLightbox from "./UniversalLightbox";
import { MapPin, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { GALLERY_AUTOPLAY_INTERVAL_MS, GALLERY_ITEM_REVEAL_DURATION_SECONDS } from "@/lib/animationTiming";

interface Props {
  images: string[];
  accentColor: string;
}

/**
 * GalleryMapTrail - Horizontal scrolling trail of photo stops, each pinned to a map line.
 * Upgraded with premium touch-like mouse-drag scrolling, glass chevrons,
 * custom progress line, and displays all photos instead of capping at 6.
 */
const GalleryMapTrail = ({ images, accentColor }: Props) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isDragScrolling, setIsDragScrolling] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [initialScrollLeft, setInitialScrollLeft] = useState(0);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const directionRef = useRef<1 | -1>(1);
  const reduceMotion = useReducedMotion();

  const checkScrollState = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    setScrollRatio(scrollWidth > clientWidth ? scrollLeft / (scrollWidth - clientWidth) : 0);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    
    el.addEventListener("scroll", checkScrollState, { passive: true });
    checkScrollState();
    window.addEventListener("resize", checkScrollState, { passive: true });
    
    return () => {
      el.removeEventListener("scroll", checkScrollState);
      window.removeEventListener("resize", checkScrollState);
    };
  }, [images]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setIsDragScrolling(true);
    setDragStartX(e.pageX - el.offsetLeft);
    setInitialScrollLeft(el.scrollLeft);
    el.style.scrollBehavior = "auto"; // Disable scroll animation physics for direct mouse response
  };

  const handleMouseLeave = () => {
    if (isDragScrolling) {
      setIsDragScrolling(false);
      const el = scrollContainerRef.current;
      if (el) el.style.scrollBehavior = "smooth";
    }
  };

  const handleMouseUp = () => {
    if (isDragScrolling) {
      setIsDragScrolling(false);
      const el = scrollContainerRef.current;
      if (el) el.style.scrollBehavior = "smooth";
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragScrolling) return;
    const el = scrollContainerRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walkX = (x - dragStartX) * 1.5; // Drag scroll velocity modifier
    el.scrollLeft = initialScrollLeft - walkX;
  };

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.style.scrollBehavior = "smooth";
    const amount = el.clientWidth * 0.7;
    el.scrollLeft += direction === "left" ? -amount : amount;
  };

  useEffect(() => {
    if (images.length < 2 || reduceMotion || userPaused || hoverPaused || isDragScrolling) return;
    const timer = window.setInterval(() => {
      const el = scrollContainerRef.current;
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 8) return;
      if (el.scrollLeft >= maxScroll - 8) directionRef.current = -1;
      if (el.scrollLeft <= 8) directionRef.current = 1;
      scrollByAmount(directionRef.current === 1 ? "right" : "left");
    }, GALLERY_AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [hoverPaused, images.length, isDragScrolling, reduceMotion, userPaused]);

  return (
    <>
      <div className="relative group/scroll-container" onMouseEnter={() => setHoverPaused(true)} onMouseLeave={() => { setHoverPaused(false); handleMouseLeave(); }}>
        {/* Premium Chevron Navigation Buttons - Glassmorphic design, fades in on hover */}
        {showLeftArrow && (
          <button
            onClick={() => scrollByAmount("left")}
            className="absolute left-2 top-[42%] -translate-y-1/2 z-30 w-11 h-11 rounded-full flex items-center justify-center border border-white/35 bg-white/30 backdrop-blur-md shadow-lg opacity-0 group-hover/scroll-container:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white/50 active:scale-95"
            style={{ color: accentColor }}
            title="Scroll Left"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}

        {showRightArrow && (
          <button
            onClick={() => scrollByAmount("right")}
            className="absolute right-2 top-[42%] -translate-y-1/2 z-30 w-11 h-11 rounded-full flex items-center justify-center border border-white/35 bg-white/30 backdrop-blur-md shadow-lg opacity-0 group-hover/scroll-container:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white/50 active:scale-95"
            style={{ color: accentColor }}
            title="Scroll Right"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}

        {/* Main Swipeable Container */}
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="relative -mx-4 px-4 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing select-none scrollbar-none [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex gap-6 min-w-max relative pt-6">
            {/* Dashed background path line */}
            <div className="absolute left-0 right-0 top-2 border-t border-dashed" style={{ borderColor: `${accentColor}60` }} />
            
            {images.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.08, 0.32), duration: GALLERY_ITEM_REVEAL_DURATION_SECONDS, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-52 flex-shrink-0"
              >
                {/* Pin node point */}
                <div
                  className="absolute -top-[21px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full ring-4 ring-background"
                  style={{ backgroundColor: accentColor }}
                />
                
                {/* Photo frame with hover scale and sparkle overlay */}
                <div className="overflow-hidden border-2 border-dashed rounded-lg" style={{ borderColor: `${accentColor}70` }}>
                  <div
                    className="cursor-pointer relative overflow-hidden group w-full h-44"
                    onClick={() => {
                      const idx = images.indexOf(src);
                      setActiveIndex(idx !== -1 ? idx : i);
                    }}
                  >
                    <SparklingImage accentColor={accentColor} src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ boxShadow: `inset 0 0 40px ${accentColor}80` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1 mt-3">
                  <MapPin className="w-3 h-3" style={{ color: accentColor }} />
                  <span className="font-body text-[10px] uppercase tracking-[0.3em] font-semibold" style={{ color: accentColor }}>
                    Stop {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Custom Progress Line Indicator */}
        <div className="mx-auto mt-3 flex w-56 items-center gap-3">
          <div className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-muted">
            <div className="absolute bottom-0 left-0 top-0 rounded-full transition-all duration-700" style={{ backgroundColor: accentColor, width: `${scrollRatio * 100}%`, minWidth: "15%" }} />
          </div>
          {images.length > 1 && !reduceMotion && (
            <button type="button" onClick={() => setUserPaused((value) => !value)} className="grid h-8 w-8 place-items-center rounded-full border border-border bg-card/80" aria-label={userPaused ? "Continue transferring photos automatically" : "Pause image transfer automatically"}>
              {userPaused ? <Play className="h-3.5 w-3.5 fill-current" /> : <Pause className="h-3.5 w-3.5 fill-current" />}
            </button>
          )}
        </div>
      </div>
      
      <UniversalLightbox images={images} currentIndex={activeIndex} onClose={() => setActiveIndex(null)} onNavigate={setActiveIndex} />
    </>
  );
};

export default GalleryMapTrail;

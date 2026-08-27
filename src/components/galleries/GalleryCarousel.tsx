import UniversalLightbox from "./UniversalLightbox";
import { SparklingImage } from "@/components/wedding/SparklingImage";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GALLERY_AUTOPLAY_INTERVAL_MS } from "@/lib/animationTiming";

interface Props {
  images: string[];
  accentColor: string;
}

const GalleryCarousel = ({ images, accentColor }: Props) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    if (paused || reduceMotion || images.length < 2) return;
    const timer = window.setInterval(next, GALLERY_AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [images.length, next, paused, reduceMotion]);

  if (images.length === 0) return null;

  const visible = [-2, -1, 0, 1, 2].map((o) => ({
    src: images[(index + o + images.length * 2) % images.length],
    offset: o,
  }));

  return (
    <>
      <motion.div
        className="relative flex h-[420px] w-full touch-pan-y items-center justify-center overflow-hidden @md:h-[560px] [perspective:1400px]"
        onHoverStart={() => setPaused(true)}
        onHoverEnd={() => setPaused(false)}
        onPanEnd={(_, info) => {
          if (Math.abs(info.offset.x) < 45) return;
          if (info.offset.x < 0) next();
          else prev();
        }}
      >
      <AnimatePresence initial={false}>
        {visible.map(({ src, offset }) => {
          const isActive = offset === 0;
          return (
            <motion.div
              key={`${src}-${offset}`}
              initial={{ opacity: 0 }}
              animate={{
                opacity: Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.25,
                x: offset * 220,
                scale: isActive ? 1 : 0.78 - Math.abs(offset) * 0.05,
                rotateY: offset * -9,
                rotateZ: offset * 1.4,
                filter: isActive ? "blur(0px)" : `blur(${Math.abs(offset) * 2}px)`,
                zIndex: 10 - Math.abs(offset),
              }}
              transition={{ type: "spring", stiffness: 55, damping: 26, mass: 1.2 }}
              className="absolute w-[260px] h-[360px] @md:w-[340px] @md:h-[460px] rounded-3xl overflow-hidden shadow-2xl"
              style={{
                boxShadow: isActive ? `0 30px 80px -20px ${accentColor}66` : undefined,
              }}
            >
              <div className="cursor-pointer relative overflow-hidden group w-full h-full" onClick={() => { const idx = images.indexOf(src); setActiveIndex(idx !== -1 ? idx : index); }}><SparklingImage accentColor={accentColor} src={src} alt="" className="w-full h-full object-cover" loading="lazy" /><div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: `inset 0 0 40px ${accentColor}80` }} /></div>
              {!isActive && <div className="absolute inset-0 bg-black/30" />}
            </motion.div>
          );
        })}
      </AnimatePresence>

      <button
        onClick={prev}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        aria-label="Previous photo"
        className="absolute left-2 @md:left-6 z-20 w-11 h-11 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-lg hover:scale-110 transition"
      >
        <ChevronLeft className="w-5 h-5" style={{ color: accentColor }} />
      </button>
      <button
        onClick={next}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        aria-label="Next photo"
        className="absolute right-2 @md:right-6 z-20 w-11 h-11 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-lg hover:scale-110 transition"
      >
        <ChevronRight className="w-5 h-5" style={{ color: accentColor }} />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex z-20">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`See photos ${i + 1}`}
            className="grid h-11 min-w-6 place-items-center"
          >
            <span
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === index ? 24 : 8,
                background: i === index ? accentColor : `${accentColor}55`,
              }}
            />
          </button>
        ))}
      </div>
    </motion.div>
    <UniversalLightbox images={images} currentIndex={activeIndex} onClose={() => setActiveIndex(null)} onNavigate={setActiveIndex} />
    </>
  );
};

export default GalleryCarousel;

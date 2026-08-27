import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, Pause, Play } from "lucide-react";
import fallbackPhoto from "@/assets/couple-1.jpg";
import UniversalLightbox from "./UniversalLightbox";
import {
  GALLERY_FILMSTRIP_AUTOPLAY_INTERVAL_MS,
  GALLERY_SCROLL_RESUME_DELAY_MS,
} from "@/lib/animationTiming";

interface Props {
  images: string[];
  accentColor: string;
  themeId?: string;
}

const GalleryFilmStrip = ({ images, accentColor, themeId = "cinematic" }: Props) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const resumeTimerRef = useRef<number>();
  const reduceMotion = useReducedMotion();
  const canAutoPlay = images.length > 1 && !reduceMotion;
  const paused = userPaused || interactionPaused;

  const updateProgress = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    setScrollRatio(maxScroll > 0 ? Math.min(1, rail.scrollLeft / maxScroll) : 0);
  }, []);

  const pauseAfterInteraction = useCallback(() => {
    setInteractionPaused(true);
    window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => setInteractionPaused(false), GALLERY_SCROLL_RESUME_DELAY_MS);
  }, []);

  const scrollRail = useCallback((direction: -1 | 1, fromUser = true) => {
    const rail = railRef.current;
    if (!rail) return;
    if (fromUser) pauseAfterInteraction();
    const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
    const amount = Math.max(280, Math.min(rail.clientWidth * 0.72, 720));
    const nextLeft = direction > 0 && rail.scrollLeft >= maxScroll - 8
      ? 0
      : Math.max(0, Math.min(maxScroll, rail.scrollLeft + direction * amount));
    rail.scrollTo({ left: nextLeft, behavior: "smooth" });
  }, [pauseAfterInteraction]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    rail.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });
    updateProgress();
    return () => {
      rail.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [images.length, updateProgress]);

  useEffect(() => {
    if (!canAutoPlay || paused) return;
    const timer = window.setInterval(() => scrollRail(1, false), GALLERY_FILMSTRIP_AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [canAutoPlay, paused, scrollRail]);

  useEffect(() => () => window.clearTimeout(resumeTimerRef.current), []);

  if (images.length === 0) return null;

  return (
    <>
      <div
        className="relative w-full max-w-full overflow-hidden border-y border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,.035),transparent_28%,transparent_72%,rgba(255,255,255,.035))] py-7 @md:py-10"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg,transparent,${accentColor},transparent)` }} />
        <div className="mb-6 flex items-center justify-between gap-4 px-4 @md:px-8">
          <div>
            <p className="font-body text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: accentColor }}>Now showing · Our memories</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-current/45">{themeId} · 35mm · autoplay {GALLERY_FILMSTRIP_AUTOPLAY_INTERVAL_MS / 1000}s · {images.length} frames</p>
          </div>
          {images.length > 1 && (
            <div className="flex items-center gap-2">
              {canAutoPlay && (
                <button
                  type="button"
                  onClick={() => setUserPaused((value) => !value)}
                  className="grid h-10 w-10 place-items-center border border-current/20 bg-white/5 text-current transition hover:border-current/45 hover:bg-white/10"
                  aria-label={userPaused ? "Continue transferring photos automatically" : "Pause image transfer automatically"}
                  title={userPaused ? "Continue" : "Pause"}
                >
                  {userPaused ? <Play className="h-4 w-4 fill-current" /> : <Pause className="h-4 w-4 fill-current" />}
                </button>
              )}
              <button type="button" onClick={() => scrollRail(-1)} className="hidden h-10 w-10 place-items-center border border-current/20 bg-white/5 text-current transition hover:border-current/45 hover:bg-white/10 @md:grid" aria-label="Previous photo">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => scrollRail(1)} className="hidden h-10 w-10 place-items-center border border-current/20 bg-white/5 text-current transition hover:border-current/45 hover:bg-white/10 @md:grid" aria-label="Next photo">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div
          ref={railRef}
          data-testid="gallery-filmstrip-rail"
          data-autoplay={canAutoPlay && !paused ? "running" : "paused"}
          className="flex w-full max-w-full snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-4 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden @md:gap-5 @md:px-8"
          onPointerDown={pauseAfterInteraction}
          onWheel={pauseAfterInteraction}
        >
          {images.map((src, index) => (
            <button
              type="button"
              key={`${src}-${index}`}
              onClick={() => setActiveIndex(index)}
              className="group relative h-[380px] w-[82cqw] max-w-[340px] shrink-0 snap-center overflow-hidden border border-white/20 bg-[#191411] p-2 text-left shadow-[0_18px_50px_rgba(0,0,0,0.2)] @md:h-[480px] @md:w-[360px] @md:max-w-none"
              style={{ boxShadow: `0 20px 55px -28px ${accentColor}80` }}
              aria-label={`Open the wedding photo ${index + 1}`}
            >
              <img
                src={src}
                alt={`Wedding moment ${index + 1}`}
                loading="lazy"
                className="h-full w-full object-cover brightness-[1.08] contrast-[1.03] transition-transform group-hover:scale-[1.035]"
                style={{ transitionDuration: "1600ms" }}
                onError={(event) => {
                  const image = event.currentTarget;
                  if (image.dataset.fallbackApplied === "true") return;
                  image.dataset.fallbackApplied = "true";
                  image.src = fallbackPhoto;
                }}
              />
              <div className="pointer-events-none absolute inset-2 bg-gradient-to-t from-black/65 via-black/0 to-transparent" />
              <div className="pointer-events-none absolute inset-x-2 top-2 h-3 opacity-80" style={{ background: "repeating-linear-gradient(90deg,transparent 0 9px,rgba(0,0,0,.8) 9px 17px,transparent 17px 24px)" }} />
              <div className="pointer-events-none absolute inset-x-2 bottom-2 h-3 opacity-80" style={{ background: "repeating-linear-gradient(90deg,transparent 0 9px,rgba(0,0,0,.8) 9px 17px,transparent 17px 24px)" }} />
              <div className="absolute inset-x-6 bottom-7 flex items-end justify-between border-t border-white/45 pt-3 text-white">
                <span className="font-body text-[10px] font-semibold uppercase tracking-[0.28em]">Frame {String(index + 1).padStart(2, "0")}</span>
                <Maximize2 className="h-4 w-4 opacity-70 transition group-hover:opacity-100" />
              </div>
            </button>
          ))}
        </div>

        <div className="mx-4 flex items-center gap-3 @md:mx-8">
          <span className="font-mono text-[9px] text-current/45">00:00:{String(Math.max(1, Math.round(scrollRatio * images.length))).padStart(2, "0")}</span>
          <div className="h-px flex-1 bg-current/15">
            <motion.div className="h-px origin-left" animate={{ scaleX: Math.max(0.04, scrollRatio) }} transition={{ duration: 0.7, ease: "easeOut" }} style={{ backgroundColor: accentColor }} />
          </div>
          <span className="font-mono text-[9px] text-current/45">END</span>
        </div>
      </div>

      <UniversalLightbox images={images} currentIndex={activeIndex} onClose={() => setActiveIndex(null)} onNavigate={setActiveIndex} />
    </>
  );
};

export default GalleryFilmStrip;

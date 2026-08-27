import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface Props {
  images: string[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const UniversalLightbox = ({ images, currentIndex, onClose, onNavigate }: Props) => {
  const previousIndex = useRef(currentIndex);
  const direction = currentIndex !== null && previousIndex.current !== null && currentIndex < previousIndex.current ? -1 : 1;

  const navigate = useCallback((step: number) => {
    if (currentIndex === null || images.length < 2) return;
    onNavigate((currentIndex + step + images.length) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  useEffect(() => {
    previousIndex.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    if (currentIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") navigate(1);
      if (event.key === "ArrowLeft") navigate(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [currentIndex, navigate, onClose]);

  if (currentIndex === null || images.length === 0) return null;
  const safeIndex = Math.min(currentIndex, images.length - 1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex cursor-zoom-out items-center justify-center overflow-hidden bg-black/92 p-4 backdrop-blur-2xl"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="See wedding photos"
    >
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.img
          key={`backdrop-${safeIndex}`}
          src={images[safeIndex]}
          alt=""
          className="pointer-events-none absolute inset-[-8%] h-[116%] w-[116%] object-cover opacity-20 blur-[70px] saturate-150"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 0.2, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.65 }}
        />
      </AnimatePresence>

      <button className="absolute right-4 top-4 z-50 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/25 text-white/70 transition hover:bg-white/10 hover:text-white @md:right-7 @md:top-7" onClick={onClose} aria-label="Close photo">
        <X className="h-5 w-5" />
      </button>

      {images.length > 1 && (
        <button className="absolute left-4 top-1/2 z-50 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/25 text-white/65 transition hover:bg-white/10 hover:text-white @md:grid @lg:left-10" onClick={(event) => { event.stopPropagation(); navigate(-1); }} aria-label="Previous photo">
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      <div className="relative flex h-full w-full items-center justify-center [perspective:1600px]">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.img
            key={safeIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction * 100, rotateY: direction * 7, scale: 0.94, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: direction * -80, rotateY: direction * -5, scale: 0.96, filter: "blur(6px)" }}
            transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
            drag={images.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.14}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) < 65) return;
              navigate(info.offset.x < 0 ? 1 : -1);
            }}
            src={images[safeIndex]}
            alt={`Wedding photos ${safeIndex + 1}`}
            className="max-h-[84svh] max-w-full cursor-grab select-none object-contain shadow-[0_30px_120px_rgba(0,0,0,0.72)] active:cursor-grabbing @md:max-w-[84vw]"
            onClick={(event) => event.stopPropagation()}
          />
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <button className="absolute right-4 top-1/2 z-50 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/25 text-white/65 transition hover:bg-white/10 hover:text-white @md:grid @lg:right-10" onClick={(event) => { event.stopPropagation(); navigate(1); }} aria-label="Next photo">
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      <div className="absolute bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-black/25 px-4 py-2 backdrop-blur-md">
        <span className="font-body text-[10px] font-semibold tracking-[0.18em] text-white/70">{String(safeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
        <div className="flex">
          {images.map((_, index) => (
            <button key={index} onClick={(event) => { event.stopPropagation(); onNavigate(index); }} className="grid h-8 min-w-6 place-items-center" aria-label={`See photos ${index + 1}`}>
              <span className="h-1.5 rounded-full transition-all" style={{ width: index === safeIndex ? 20 : 6, backgroundColor: index === safeIndex ? "white" : "rgb(255 255 255 / 0.45)" }} />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default UniversalLightbox;

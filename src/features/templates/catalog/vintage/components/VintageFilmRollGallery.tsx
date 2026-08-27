import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Film, Sparkles } from "lucide-react";
import UniversalLightbox from "@/components/galleries/UniversalLightbox";

interface Props {
  images: string[];
}

export const VintageFilmRollGallery = ({ images }: Props) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full py-8 overflow-hidden select-none">
      {/* 35mm Film Sprocket Upper Border */}
      <div className="w-full bg-[#120A06] py-2 border-y border-[#C89D56]/30 flex justify-around items-center px-4 overflow-hidden">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={`top-sprocket-${i}`}
            className="w-3 h-4 rounded-sm bg-neutral-900 border border-amber-200/30 mx-1 shrink-0"
          />
        ))}
      </div>

      {/* Film Strip Body with Photos */}
      <div className="bg-[#1C1009] py-6 px-4 border-b border-[#C89D56]/20 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-6 min-w-max px-6">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, y: -4 }}
              transition={{ duration: 0.3 }}
              onClick={() => setActiveIndex(idx)}
              className="cursor-pointer group relative rounded-lg bg-[#0F0804] p-2 border-2 border-[#8B5A2B]/40 shadow-xl overflow-hidden"
            >
              {/* Film Frame Header */}
              <div className="flex items-center justify-between text-[9px] font-mono text-amber-300/80 px-1 mb-1.5">
                <span>PORTRA 400</span>
                <span className="font-bold">#0{idx + 1}A</span>
                <span>35MM</span>
              </div>

              {/* Photo Canvas */}
              <div className="relative w-48 h-64 sm:w-56 sm:h-72 overflow-hidden rounded bg-neutral-950">
                <img
                  src={img}
                  alt={`Vintage Frame ${idx + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover filter sepia-[0.35] contrast-110 brightness-95 group-hover:scale-110 group-hover:filter-none transition-all duration-500"
                />

                {/* Film Light Leak Effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-600/30 via-transparent to-rose-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* View Icon Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="p-3 rounded-full bg-amber-400 text-stone-950 font-bold shadow-lg flex items-center gap-1.5 text-xs">
                    <Eye className="w-4 h-4" />
                    <span>Xem ảnh</span>
                  </div>
                </div>
              </div>

              {/* Frame Footer */}
              <div className="text-center text-[9px] font-mono text-amber-200/50 mt-1.5 uppercase tracking-widest">
                FRAME 0{idx + 1} • KODAK SAFETY FILM
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 35mm Film Sprocket Lower Border */}
      <div className="w-full bg-[#120A06] py-2 border-b border-[#C89D56]/30 flex justify-around items-center px-4 overflow-hidden">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={`bottom-sprocket-${i}`}
            className="w-3 h-4 rounded-sm bg-neutral-900 border border-amber-200/30 mx-1 shrink-0"
          />
        ))}
      </div>

      {/* Robust Fullscreen Lightbox */}
      <UniversalLightbox
        images={images}
        currentIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </div>
  );
};

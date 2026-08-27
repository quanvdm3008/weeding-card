import { SparklingImage } from "@/components/wedding/SparklingImage";
import { useState } from "react";
import { motion } from "framer-motion";
import UniversalLightbox from "./UniversalLightbox";
import { GALLERY_ITEM_REVEAL_DURATION_SECONDS } from "@/lib/animationTiming";

interface Props {
  images: string[];
  accentColor: string;
}

// Rustic — corkboard with pinned, twine-crossed photos
const GalleryCorkboard = ({ images, accentColor }: Props) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  return (
  <>
      <div className="relative grid grid-cols-2 @md:grid-cols-3 gap-10 py-4">
    <svg className="absolute inset-0 w-full h-full hidden @md:block pointer-events-none" style={{ opacity: 0.35 }}>
      <line x1="16%" y1="15%" x2="84%" y2="85%" stroke={accentColor} strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1="84%" y1="15%" x2="16%" y2="85%" stroke={accentColor} strokeWidth="1.5" strokeDasharray="4 4" />
    </svg>
    {images.slice(0, 6).map((src, i) => (
      <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: Math.min(i * 0.08, 0.32), duration: GALLERY_ITEM_REVEAL_DURATION_SECONDS, ease: [0.22, 1, 0.36, 1] }} className="relative z-10 p-1.5" style={{ border: `3px solid ${accentColor}60`, backgroundColor: "#F0E6D6", transform: `rotate(${i % 2 === 0 ? -3 : 3}deg)` }}>
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rotate-45 border-t-2" style={{ borderColor: `${accentColor}90` }} />
        <div className="cursor-pointer relative overflow-hidden group w-full h-full" onClick={() => { const idx = images.indexOf(src); setActiveIndex(idx !== -1 ? idx : i); }}><SparklingImage accentColor={accentColor} src={src} alt="" loading="lazy" className="w-full aspect-[4/5] object-cover" /><div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: `inset 0 0 40px ${accentColor}80` }} /></div>
      </motion.div>
    ))}
  </div>
  <UniversalLightbox images={images} currentIndex={activeIndex} onClose={() => setActiveIndex(null)} onNavigate={setActiveIndex} />
    </>
  );
}
export default GalleryCorkboard;

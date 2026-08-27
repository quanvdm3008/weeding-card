import { SparklingImage } from "@/components/wedding/SparklingImage";
import { useState } from "react";
import { motion } from "framer-motion";
import UniversalLightbox from "./UniversalLightbox";
import { GALLERY_ITEM_REVEAL_DURATION_SECONDS } from "@/lib/animationTiming";

interface Props {
  images: string[];
  accentColor: string;
}

// Vintage — sepia album page with corner-mounted photos
const GalleryAlbumGrid = ({ images, accentColor }: Props) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  return (
  <>
      <div className="grid grid-cols-2 @md:grid-cols-3 gap-8 p-6 @md:p-10" style={{ backgroundColor: "#F5E6CC" }}>
    {images.slice(0, 6).map((src, i) => (
      <motion.div key={i} initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: Math.min(i * 0.08, 0.32), duration: GALLERY_ITEM_REVEAL_DURATION_SECONDS, ease: [0.22, 1, 0.36, 1] }} className="relative p-1.5" style={{ backgroundColor: "#FFFDF8", boxShadow: "0 10px 24px -10px rgba(80,60,20,0.45)", transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)` }}>
        <div className="absolute top-0 left-0 w-3 h-3" style={{ background: "linear-gradient(135deg, #8B6914 50%, transparent 50%)" }} />
        <div className="absolute bottom-0 right-0 w-3 h-3" style={{ background: "linear-gradient(-45deg, #8B6914 50%, transparent 50%)" }} />
        <div className="cursor-pointer relative overflow-hidden group w-full h-full" onClick={() => { const idx = images.indexOf(src); setActiveIndex(idx !== -1 ? idx : i); }}><SparklingImage accentColor={accentColor} src={src} alt="" loading="lazy" className="w-full aspect-[4/5] object-cover" style={{ filter: "sepia(0.45) contrast(1.05)" }} /><div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: `inset 0 0 40px ${accentColor}80` }} /></div>
      </motion.div>
    ))}
  </div>
  <UniversalLightbox images={images} currentIndex={activeIndex} onClose={() => setActiveIndex(null)} onNavigate={setActiveIndex} />
    </>
  );
}
export default GalleryAlbumGrid;

import { SparklingImage } from "@/components/wedding/SparklingImage";
import { useState } from "react";
import { motion } from "framer-motion";
import UniversalLightbox from "./UniversalLightbox";
import { GALLERY_ITEM_REVEAL_DURATION_SECONDS } from "@/lib/animationTiming";

interface Props {
  images: string[];
  accentColor: string;
}

// Glass — frosted, staggered-depth photo panes
const GalleryGlassGrid = ({ images, accentColor }: Props) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  return (
  <>
      <div className="grid grid-cols-2 @md:grid-cols-3 gap-5">
    {images.slice(0, 6).map((src, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 42, rotateY: i % 2 ? 12 : -12, filter: "blur(7px)" }}
        whileInView={{ opacity: 1, y: 0, rotateY: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay: Math.min(i * 0.08, 0.32), duration: GALLERY_ITEM_REVEAL_DURATION_SECONDS, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -7, rotateY: i % 2 ? -2 : 2, scale: 1.015 }}
        className="rounded-3xl border border-white/40 bg-white/15 backdrop-blur-xl p-2 shadow-xl [transform-style:preserve-3d]"
        style={{ marginTop: i % 3 === 1 ? "1.5rem" : 0, boxShadow: `0 20px 50px -25px ${accentColor}55` }}
      >
        <div className="cursor-pointer relative overflow-hidden group w-full h-full" onClick={() => { const idx = images.indexOf(src); setActiveIndex(idx !== -1 ? idx : i); }}><SparklingImage accentColor={accentColor} src={src} alt="" loading="lazy" className="w-full aspect-[4/5] object-cover rounded-2xl" /><div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: `inset 0 0 40px ${accentColor}80` }} /></div>
      </motion.div>
    ))}
  </div>
  <UniversalLightbox images={images} currentIndex={activeIndex} onClose={() => setActiveIndex(null)} onNavigate={setActiveIndex} />
    </>
  );
}
export default GalleryGlassGrid;

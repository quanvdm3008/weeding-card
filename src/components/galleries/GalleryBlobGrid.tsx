import { SparklingImage } from "@/components/wedding/SparklingImage";
import { useState } from "react";
import { motion } from "framer-motion";
import UniversalLightbox from "./UniversalLightbox";
import { GALLERY_ITEM_REVEAL_DURATION_SECONDS } from "@/lib/animationTiming";

interface Props {
  images: string[];
  accentColor: string;
}

// Fluid — organic blob-masked photo cluster
const GalleryBlobGrid = ({ images, accentColor }: Props) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const radii = [
    "58% 42% 38% 62% / 55% 60% 40% 45%",
    "42% 58% 62% 38% / 45% 40% 60% 55%",
    "50% 50% 35% 65% / 60% 45% 55% 40%",
    "65% 35% 55% 45% / 40% 55% 45% 60%",
    "38% 62% 50% 50% / 55% 45% 60% 40%",
    "55% 45% 60% 40% / 42% 58% 38% 62%",
  ];
  return (
    <>
      <div className="grid grid-cols-2 @md:grid-cols-3 gap-6 @md:gap-8">
      {images.slice(0, 6).map((src, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.82, rotate: i % 2 ? 4 : -4, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: Math.min(i * 0.08, 0.32), duration: GALLERY_ITEM_REVEAL_DURATION_SECONDS, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.045, rotate: i % 2 ? -1.5 : 1.5 }}
          className="aspect-square overflow-hidden"
          style={{ borderRadius: radii[i % radii.length], boxShadow: `0 20px 50px -25px ${accentColor}55` }}
        >
          <div className="cursor-pointer relative overflow-hidden group w-full h-full" onClick={() => { const idx = images.indexOf(src); setActiveIndex(idx !== -1 ? idx : i); }}><SparklingImage accentColor={accentColor} src={src} alt="" loading="lazy" className="w-full h-full object-cover" /><div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: `inset 0 0 40px ${accentColor}80` }} /></div>
        </motion.div>
      ))}
    </div>
      <UniversalLightbox images={images} currentIndex={activeIndex} onClose={() => setActiveIndex(null)} onNavigate={setActiveIndex} />
    </>
  );
};

export default GalleryBlobGrid;

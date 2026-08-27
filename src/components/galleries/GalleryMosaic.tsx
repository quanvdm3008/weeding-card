import { SparklingImage } from "@/components/wedding/SparklingImage";
import { useState } from "react";
import { motion } from "framer-motion";
import UniversalLightbox from "./UniversalLightbox";
import { GALLERY_ITEM_REVEAL_DURATION_SECONDS } from "@/lib/animationTiming";

interface Props {
  images: string[];
  accentColor: string;
}

// Asymmetric mosaic with bento layout
const GalleryMosaic = ({ images, accentColor }: Props) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const layout = [
    "col-span-2 row-span-2",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-2",
    "col-span-2 row-span-1",
    "col-span-1 row-span-1",
  ];

  return (
    <>
      <div className="grid grid-cols-4 auto-rows-[140px] @md:auto-rows-[180px] gap-3 @md:gap-4">
        {images.slice(0, 6).map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.96, clipPath: i % 2 ? "inset(100% 0 0 0)" : "inset(0 100% 0 0)" }}
            whileInView={{ opacity: 1, scale: 1, clipPath: "inset(0 0 0 0)" }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: Math.min(i * 0.08, 0.32), duration: GALLERY_ITEM_REVEAL_DURATION_SECONDS, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.035, zIndex: 4 }}
            className={`${layout[i]} relative overflow-hidden rounded-2xl cursor-pointer group`}
            style={{ boxShadow: `0 10px 30px -15px ${accentColor}40` }}
            onClick={() => setActiveIndex(i)}
          >
            <SparklingImage accentColor={accentColor} src={src} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ boxShadow: `inset 0 0 40px ${accentColor}80` }}
            />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none"
              style={{ background: `linear-gradient(135deg, ${accentColor}, transparent)` }}
            />
          </motion.div>
        ))}
      </div>
      <UniversalLightbox images={images} currentIndex={activeIndex} onClose={() => setActiveIndex(null)} onNavigate={setActiveIndex} />
    </>
  );
};

export default GalleryMosaic;

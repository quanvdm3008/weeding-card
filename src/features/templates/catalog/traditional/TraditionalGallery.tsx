import { useState } from "react";
import { motion } from "framer-motion";
import { SparklingImage } from "@/components/wedding/SparklingImage";
import UniversalLightbox from "@/components/galleries/UniversalLightbox";
import { GALLERY_ITEM_REVEAL_DURATION_SECONDS } from "@/lib/animationTiming";

interface Props {
  images: string[];
  accentColor: string;
}

const TraditionalGallery = ({ images, accentColor }: Props) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // A beautiful asymmetric staggered layout for 6 images
  const layout = [
    "col-span-12 @md:col-span-8 row-span-2 aspect-[4/3] @md:aspect-auto", // Large feature
    "col-span-6 @md:col-span-4 row-span-1 aspect-square",
    "col-span-6 @md:col-span-4 row-span-1 aspect-square",
    "col-span-6 @md:col-span-4 row-span-1 aspect-[3/4]",
    "col-span-6 @md:col-span-4 row-span-1 aspect-[3/4]",
    "col-span-12 @md:col-span-4 row-span-1 aspect-video @md:aspect-[3/4]",
  ];

  return (
    <>
      <div className="grid grid-cols-12 auto-rows-min gap-4 @md:gap-6 relative">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] [background-image:linear-gradient(45deg,transparent_48%,#FFB800_49%,#FFB800_51%,transparent_52%)] [background-size:24px_24px] z-0" />
        
        {images.slice(0, 6).map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1, duration: GALLERY_ITEM_REVEAL_DURATION_SECONDS, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -5, zIndex: 10 }}
            className={`${layout[i] || "col-span-4"} relative cursor-pointer group z-10`}
            onClick={() => setActiveIndex(i)}
          >
            {/* Inner Image Container */}
            <div className="w-full h-full relative overflow-hidden bg-[#8B0000] shadow-[0_10px_30px_rgba(101,13,22,0.5)]">
              <SparklingImage 
                accentColor={accentColor} 
                src={src} 
                alt={`Gallery image ${i + 1}`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                loading="lazy" 
              />
              {/* Subtle vintage/red overlay on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none mix-blend-overlay"
                style={{ background: `linear-gradient(to bottom right, ${accentColor}, #8B0000)` }}
              />
            </div>
          </motion.div>
        ))}
      </div>
      
      <UniversalLightbox 
        images={images} 
        currentIndex={activeIndex} 
        onClose={() => setActiveIndex(null)} 
        onNavigate={setActiveIndex} 
      />
    </>
  );
};

export default TraditionalGallery;

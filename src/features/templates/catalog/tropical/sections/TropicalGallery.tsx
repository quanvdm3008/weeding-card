import React from "react";
import { motion } from "framer-motion";
import { tropicalTheme } from "../theme";
import { tropicalAnimations } from "../animations";

interface TropicalGalleryProps {
  images?: string[];
  onImageClick?: (index: number) => void;
}

export const TropicalGallery: React.FC<TropicalGalleryProps> = ({ images, onImageClick }) => {
  if (!images || images.length === 0) return null;

  return (
    <section 
      className="py-24 md:py-32 px-6 md:px-12"
      style={{ backgroundColor: tropicalTheme.colors.surface, color: tropicalTheme.colors.text }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={tropicalAnimations.staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={tropicalAnimations.slideUpFade}
            className="text-4xl md:text-5xl font-medium italic"
            style={{ fontFamily: tropicalTheme.typography.display, color: tropicalTheme.colors.accentSecondary }}
          >
            Memories
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {images.map((src, idx) => (
            <motion.div 
              key={idx}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={tropicalAnimations.staggerContainer}
              className={`w-full overflow-hidden rounded-2xl shadow-lg relative group cursor-pointer ${idx % 3 === 0 ? 'lg:col-span-2 lg:aspect-[2/1] sm:aspect-square aspect-[4/3]' : 'aspect-square'}`}
              onClick={() => onImageClick?.(idx)}
            >
              <motion.img 
                variants={tropicalAnimations.slideUpFade}
                src={src}
                alt="Gallery"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

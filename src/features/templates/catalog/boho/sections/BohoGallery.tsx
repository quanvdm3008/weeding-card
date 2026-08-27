import React from "react";
import { motion } from "framer-motion";
import { bohoTheme } from "../theme";

interface BohoGalleryProps {
  images?: string[];
  onImageClick?: (index: number) => void;
}

export const BohoGallery: React.FC<BohoGalleryProps> = ({ images, onImageClick }) => {
  if (!images || images.length === 0) return null;

  return (
    <section className="py-24 md:py-32 px-4 relative" style={{ backgroundColor: bohoTheme.colors.background }}>
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 
          className="text-5xl md:text-7xl font-medium mb-6"
          style={{ fontFamily: bohoTheme.typography.display, color: bohoTheme.colors.text }}
        >
          Gallery
        </h2>
        <p className="text-sm md:text-base tracking-[0.2em] uppercase" style={{ color: bohoTheme.colors.accentSecondary }}>
          Moments captured
        </p>
      </div>

      <div className="max-w-6xl mx-auto columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {images.map((src, index) => {
          // Add slight randomness to rotation for organic feel
          const rotation = index % 3 === 0 ? '-1deg' : index % 2 === 0 ? '1.5deg' : '0deg';
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
              className="break-inside-avoid relative group"
            >
              <div 
                className="w-full h-full p-2 bg-white shadow-md transition-transform duration-500 group-hover:scale-105 group-hover:z-10 group-hover:shadow-2xl cursor-pointer"
                style={{ 
                  transform: `rotate(${rotation})`,
                  borderRadius: "8px 8px 8px 8px / 12px 12px 12px 12px" // Slightly irregular rounded corners
                }}
                onClick={() => onImageClick?.(index)}
              >
                <div className="relative overflow-hidden aspect-auto" style={{ borderRadius: "4px" }}>
                  <img 
                    src={src} 
                    alt={`Gallery image ${index + 1}`} 
                    className="w-full h-auto object-cover filter transition-all duration-700 group-hover:sepia-0"
                    style={{ filter: "sepia(0.2) contrast(0.95)" }}
                    loading="lazy"
                  />
                  {/* Subtle warm overlay on hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `linear-gradient(to top, ${bohoTheme.colors.accent}40, transparent)` }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

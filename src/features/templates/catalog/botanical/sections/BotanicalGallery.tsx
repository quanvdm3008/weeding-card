import React from "react";
import { botanicalTheme } from "../theme";
import GalleryDispatcher from "@/components/galleries/GalleryDispatcher";
import { themes } from "@/data/themes"; 

interface BotanicalGalleryProps {
  images?: string[];
  accentColor: string;
}

export const BotanicalGallery: React.FC<BotanicalGalleryProps> = ({ images, accentColor }) => {
  if (!images || images.length === 0) return null;

  return (
    <section 
      className="py-24 md:py-32"
      style={{ backgroundColor: botanicalTheme.colors.background, color: botanicalTheme.colors.text }}
    >
      <div className="text-center mb-16">
        <h2 
          className="text-4xl md:text-5xl font-light mb-4"
          style={{ fontFamily: botanicalTheme.typography.display }}
        >
          Moments
        </h2>
        <div className="w-8 h-[1px] mx-auto" style={{ backgroundColor: botanicalTheme.colors.accent }} />
      </div>
      <div className="w-full max-w-7xl mx-auto px-4">
        <GalleryDispatcher 
          theme={themes.garden} 
          accentColor={accentColor} 
          images={images} 
        />
      </div>
    </section>
  );
};

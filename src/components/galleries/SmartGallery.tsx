import { useMemo } from "react";
import GalleryMosaic from "./GalleryMosaic";
import GalleryMinimalGrid from "./GalleryMinimalGrid";
import GalleryBlobGrid from "./GalleryBlobGrid";
import GalleryCarousel from "./GalleryCarousel";

interface SmartGalleryProps {
  images?: string[];
  accentColor: string;
}

/**
 * SmartGallery dynamically selects the best visual layout based on the number of photos provided.
 * - < 8 photos: MinimalGrid (Editorial layout)
 * - 8 - 15 photos: BlobGrid / Organic
 * - > 15 photos: Mosaic (Optimized masonry-like grid)
 */
export default function SmartGallery({ images = [], accentColor }: SmartGalleryProps) {
  const count = images.length;

  const RenderedGallery = useMemo(() => {
    if (count === 0) {
      return null;
    }
    
    if (count < 8) {
      // Small collection -> focus on large, elegant grids
      return <GalleryMinimalGrid images={images} accentColor={accentColor} />;
    } else if (count >= 8 && count <= 15) {
      // Medium collection -> playful organic grid
      return <GalleryBlobGrid images={images} accentColor={accentColor} />;
    } else if (count > 15 && count <= 25) {
      // Large collection -> carousel to save space
      return <GalleryCarousel images={images} accentColor={accentColor} />;
    } else {
      // Very large collection -> Masonry mosaic
      return <GalleryMosaic images={images} accentColor={accentColor} />;
    }
  }, [count, images, accentColor]);

  if (!RenderedGallery) return null;

  return (
    <div className="w-full">
      {RenderedGallery}
    </div>
  );
}

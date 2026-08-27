import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import MagazineGallery from "@/components/cinematic/MagazineGallery";
import GalleryCarousel from "./GalleryCarousel";
import GalleryFilmStrip from "./GalleryFilmStrip";
import GalleryMosaic from "./GalleryMosaic";
import GalleryBlobGrid from "./GalleryBlobGrid";
import GalleryGlassGrid from "./GalleryGlassGrid";
import GalleryMapTrail from "./GalleryMapTrail";
import GalleryMinimalGrid from "./GalleryMinimalGrid";
import GalleryAlbumGrid from "./GalleryAlbumGrid";
import GalleryCorkboard from "./GalleryCorkboard";
import type { WeddingTheme } from "@/data/themes";

import couple1 from "@/assets/couple-1.jpg";
import couple2 from "@/assets/couple-2.jpg";
import couple3 from "@/assets/couple-3.jpg";
import coupleProposal from "@/assets/couple-proposal.jpg";
import venueImg from "@/assets/venue.jpg";
import ringsImg from "@/assets/rings.jpg";

const images = [couple1, couple2, couple3, coupleProposal, venueImg, ringsImg];

interface Props {
  theme: WeddingTheme;
  accentColor: string;
  images?: string[];
}

const titles: Record<WeddingTheme["styleVariant"], { eyebrow: string; title: string; sub: string }> = {
  cinematic: { eyebrow: "Cinema · Albums", title: "Love film reel", sub: "Like a movie that rolls with each page scroll" },
  magazine: { eyebrow: "Editorial · Albums", title: "Unforgettable moment", sub: "Editorial collections like magazines" },
  fluid: { eyebrow: "Organic · Album", title: "Soft moment", sub: "Each photo frame is a natural breathing rhythm" },
  glass: { eyebrow: "Glass · Album", title: "Commemorative glass layer", sub: "Transparent and gentle like our story" },
  map: { eyebrow: "Journey · Album", title: "Commemorative stops", sub: "Each photo represents a journey that has passed" },
  gallery: { eyebrow: "Slideshow · Album", title: "Go through each frame", sub: "Dreamy rotating slideshow" },
  letter: { eyebrow: "Albums · Memories", title: "Wedding Photo Album", sub: "The most memorable moments" },
  minimal: { eyebrow: "Selected · Album", title: "Selected Frames", sub: "Minimalist, sophisticated" },
  vintage: { eyebrow: "Film Archive · Album", title: "Old Album Page", sub: "Nostalgia in every sepia photo" },
  rustic: { eyebrow: "Corkboard · Album", title: "Souvenir Corner", sub: "Each photo is pinned with love" },
};

const GalleryDispatcher = ({ theme, accentColor, images: customImages }: Props) => {
  const variant = theme.styleVariant;
  const meta = titles[variant] || titles.letter;
  const galleryImages = customImages?.length ? customImages : images;
  const darkSurface = variant === "cinematic" || ["traditional", "modern", "royal", "magazine", "luxury", "cosmic", "pixel", "cyberpunk_luxe", "nordic_aurora"].includes(theme.id);

  // Magazine has its own full section markup
  if (variant === "magazine" && !customImages?.length) {
    return <MagazineGallery accentColor={accentColor} />;
  }

  const renderBody = () => {
    switch (variant) {
      case "cinematic": return <GalleryFilmStrip images={galleryImages} accentColor={accentColor} themeId={theme.id} />;
      case "fluid": return <GalleryBlobGrid images={galleryImages} accentColor={accentColor} />;
      case "glass": return <GalleryGlassGrid images={galleryImages} accentColor={accentColor} />;
      case "map": return <GalleryMapTrail images={galleryImages} accentColor={accentColor} />;
      case "gallery": return <GalleryCarousel images={galleryImages} accentColor={accentColor} />;
      case "minimal": return <GalleryMinimalGrid images={galleryImages} accentColor={accentColor} />;
      case "vintage": return <GalleryAlbumGrid images={galleryImages} accentColor={accentColor} />;
      case "rustic": return <GalleryCorkboard images={galleryImages} accentColor={accentColor} />;
      default: return <GalleryMosaic images={galleryImages} accentColor={accentColor} />;
    }
  };

  // film-strip wants edge-to-edge width
  const fullBleed = variant === "cinematic";

  return (
    <section
      id="gallery"
      className={`relative overflow-hidden py-24 @sm:py-32 ${variant === "cinematic" ? "border-y border-white/10 text-white" : ""}`}
      style={variant === "cinematic" ? { background: `radial-gradient(circle at 50% 0%, ${accentColor}20, transparent 32%), linear-gradient(180deg,#080705,#050505)` } : undefined}
    >
      {variant === "cinematic" && <div className="pointer-events-none absolute inset-x-0 top-5 flex items-center justify-center gap-4 font-mono text-[8px] uppercase tracking-[0.42em] text-white/30"><span>● REC</span><span>{theme.id}</span><span>4K · 24 FPS</span></div>}
      <div className="max-w-3xl mx-auto text-center mb-12 @md:mb-16 px-4">
        <span className="text-[11px] tracking-[0.4em] uppercase font-body" style={{ color: accentColor }}>
          {meta.eyebrow}
        </span>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`font-display text-4xl @sm:text-5xl @md:text-6xl font-medium mt-3 ${darkSurface ? "text-white" : "text-foreground"}`}
        >
          <Camera className="w-7 h-7 inline-block mr-2 mb-1" style={{ color: accentColor }} />
          {meta.title}
        </motion.h2>
        <p className={`font-body mt-4 ${darkSurface ? "text-white/60" : "text-muted-foreground"}`}>{meta.sub}</p>
      </div>
      <div className={fullBleed ? "w-full" : "max-w-7xl mx-auto px-4"}>
        {renderBody()}
      </div>
    </section>
  );
};

export default GalleryDispatcher;

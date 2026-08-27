import React, { useState } from "react";
import type { TemplateProps } from "@/features/template/components/types";
import { useCountdown } from "@/hooks/useCountdown";
import { SparklingImage } from "@/components/wedding/SparklingImage";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Heart, Calendar, Award, MapPin, Send, MessageSquare, Plus, X, ArrowRight, CreditCard, Landmark, Check } from "lucide-react";
import { WEDDING_SEED_DATA } from "@/data/seedData";
import { themes } from "@/data/themes";
import EventsSection from "@/components/wedding/EventsSection";
import StorySection from "@/components/wedding/sections/StorySection";
import CoupleSection from "@/components/wedding/sections/CoupleSection";
import CalendarAndMapButtons from "@/components/wedding/CalendarAndMapButtons";
import { luxuryTheme } from "@/features/templates/catalog/luxury/theme";
import { submitPublicRsvp } from "@/lib/invitations";
import { useWishesData } from "@/hooks/useWishesData";

// Utility: Golden Divider
const GoldenDivider = () => (
  <div className="flex items-center justify-center gap-4 py-8 opacity-60">
    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D5B36A]" />
    <div className="w-2 h-2 rotate-45 border border-[#D5B36A]" />
    <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D5B36A]" />
  </div>
);

import RSVPSection from "@/components/wedding/RSVPSection";
import { BankRegistrySection } from "@/components/wedding/sections/BankRegistrySection";
import ParentsSection from "@/components/wedding/sections/ParentsSection";
import WishesWall from "@/components/wedding/wishes/WishesWall";
import UniversalLightbox from "@/components/galleries/UniversalLightbox";
// 2. Sticky Parallax Horizontal Gallery (Peak Luxury)
const CinematicGallery = ({ images, onImageClick }: { images: string[]; onImageClick?: (i: number) => void }) => {
  const targetRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Transform scroll progress to horizontal movement
  // Move the container left by its full width minus 1 viewport width, 
  // ensuring the last item stops perfectly on screen.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "calc(-100% + 100vw)"]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-[#000000]">
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-30">
          <motion.div style={{ opacity }} className="w-[800px] h-[500px] bg-gradient-to-b from-[#D5B36A]/10 to-transparent rounded-full blur-[120px]" />
        </div>

        {/* Header */}
        <motion.div style={{ opacity }} className="absolute top-16 md:top-24 left-0 w-full text-center z-20">
          <h2 className="font-display text-4xl sm:text-6xl font-light text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#8C6D23]">
            Ký Ức Vĩnh Cửu
          </h2>
          <GoldenDivider />
        </motion.div>

        {/* Horizontal Track */}
        <motion.div style={{ x }} className="flex gap-16 md:gap-32 px-[10vw] md:px-[20vw] items-center h-full relative z-10 pt-20 w-max">
          {images.map((img, idx) => {
            return (
              <div key={idx} onClick={() => onImageClick?.(idx)} className="relative group shrink-0 w-[75vw] sm:w-[45vw] md:w-[35vw] aspect-[3/4] cursor-zoom-in">
                {/* Thin frame offset */}
                <div className="absolute inset-[-12px] sm:inset-[-16px] border border-[#D5B36A]/20 transition-all duration-700 group-hover:border-[#D5B36A]/50 group-hover:inset-[-20px]" />
                <div className="absolute inset-[-4px] sm:inset-[-8px] border-[0.5px] border-[#D5B36A]/10" />
                
                {/* Image Container */}
                <div className="w-full h-full relative overflow-hidden bg-[#111] shadow-[0_0_50px_rgba(213,179,106,0.1)]">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10 pointer-events-none" />
                  
                  {/* Slow scale on hover */}
                  <div className="w-full h-full transition-transform duration-[2000ms] group-hover:scale-110">
                    <SparklingImage
                      src={img}
                      alt={`Gallery ${idx + 1}`}
                      accentColor="#D5B36A"
                      className="w-full h-full object-cover filter sepia-[0.2] contrast-125 brightness-75 transition-all duration-[2000ms] group-hover:sepia-0 group-hover:brightness-110"
                    />
                  </div>

                  {/* Elegant overlay text */}
                  <div className="absolute bottom-10 left-10 z-20 overflow-hidden">
                    <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[#D5B36A] mb-2 transform translate-y-8 opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100">
                      Khoảnh Khắc
                    </p>
                    <h3 className="font-display text-3xl sm:text-4xl text-[#FFF5D6] font-light transform translate-y-8 opacity-0 transition-all duration-700 delay-100 group-hover:translate-y-0 group-hover:opacity-100">
                      Chương 0{idx + 1}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div style={{ opacity }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20">
          <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#D5B36A]/60">Cuộn để xem</p>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#D5B36A]/60 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};

// Bespoke RSVP moved to LuxuryRSVP.tsx


export const LuxuryTemplate: React.FC<TemplateProps> = ({
  groomName = WEDDING_SEED_DATA.groomName,
  brideName = WEDDING_SEED_DATA.brideName,
  date = WEDDING_SEED_DATA.date,
  time = WEDDING_SEED_DATA.time,
  venue = WEDDING_SEED_DATA.venue,
  address = WEDDING_SEED_DATA.address,
  message = WEDDING_SEED_DATA.message,
  accentColor = luxuryTheme.colors.primary,
  publicSlug,
  rsvpEnabled = true,
  wishesEnabled = true,
  galleryImageUrls = WEDDING_SEED_DATA.galleryImageUrls,
  coverImageUrl = WEDDING_SEED_DATA.coverImageUrl,
  groomBank,
  brideBank,
  stories = WEDDING_SEED_DATA.stories,
  groomParents,
  brideParents,
  theme = themes.luxury,
}) => {
  const { days, hours, minutes, seconds } = useCountdown(date, time);
  const displayImages = galleryImageUrls && galleryImageUrls.length > 0 ? galleryImageUrls : WEDDING_SEED_DATA.galleryImageUrls;
  const safeStories = stories && stories.length > 0 ? stories : WEDDING_SEED_DATA.stories;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="luxury-gilded relative bg-[#030303] font-serif text-[#E5E5E5] selection:bg-[#D5B36A]/30 overflow-x-hidden"
    >
      {/* Background Texture - Dark Velvet / Grain */}
      <div className="fixed inset-0 pointer-events-none z-0 mix-blend-overlay opacity-20"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} 
      />

      {/* 1. HERO — The Royal Arch */}
      <section id="hero" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pt-20 pb-12">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#D5B36A]/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
        </motion.div>

        <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-center mb-10"
          >
            <p className="font-sans text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.4em] text-[#D5B36A] mb-4">
              The Wedding Celebration Of
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-sm sm:max-w-md mx-auto aspect-[3/4]"
          >
            <div className="absolute inset-[-12px] sm:inset-[-16px] border border-[#D5B36A]/30" />
            <div className="absolute inset-[-4px] sm:inset-[-8px] border-[0.5px] border-[#D5B36A]/10" />
            
            {/* Corner ornaments for the hero frame */}
            <div className="absolute -top-6 -left-6 sm:-top-8 sm:-left-8 w-12 h-12 border-t border-l border-[#D5B36A]/40" />
            <div className="absolute -top-6 -right-6 sm:-top-8 sm:-right-8 w-12 h-12 border-t border-r border-[#D5B36A]/40" />
            <div className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 w-12 h-12 border-b border-l border-[#D5B36A]/40" />
            <div className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 w-12 h-12 border-b border-r border-[#D5B36A]/40" />

            <div className="w-full h-full overflow-hidden border border-[#D5B36A]/50 bg-black/50 shadow-[0_0_60px_rgba(213,179,106,0.15)] relative">
              <SparklingImage
                accentColor={accentColor}
                src={coverImageUrl}
                alt="Couple"
                className="w-full h-full object-cover object-center filter sepia-[0.1] contrast-[1.1] brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
            </div>
            
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-[#D5B36A] rounded-full blur-[1px]"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{ y: [0, -40, 0], opacity: [0.2, 0.8, 0.2] }}
                  transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-center mt-12 w-full"
          >
            <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)] font-light leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5D6] via-[#D5B36A] to-[#8C6D23]">
              {groomName}
              <span className="block text-[0.4em] italic text-[#D5B36A]/80 my-2 font-serif">&amp;</span>
              {brideName}
            </h1>
            <div className="mt-8 flex items-center justify-center gap-6 font-sans text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#D5B36A]/80">
              <span>{date.split("-").reverse().join(".")}</span>
              <span className="w-1 h-1 rotate-45 bg-[#D5B36A]/50" />
              <span>{time}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. THE QUOTE */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-[#080808]">
        <div className="max-w-3xl mx-auto text-center">
          <Award className="w-6 h-6 mx-auto mb-8 text-[#D5B36A]/60" />
          <p className="font-serif text-lg sm:text-xl md:text-2xl italic leading-relaxed text-[#D5B36A]/90 font-light px-4">
            "{message || "Một đêm tiệc lộng lẫy minh chứng cho tình yêu vĩnh cửu. Chúng tôi vô cùng vinh hạnh được đón tiếp bạn."}"
          </p>
          <GoldenDivider />
        </div>
      </section>

      {/* 3. SWISS WATCH COUNTDOWN */}
      <section className="py-24 relative overflow-hidden bg-[#050505]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#D5B36A]/5 rounded-full blur-[100px]" />
        
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.4em] text-[#D5B36A] mb-16">
            Đếm ngược khoảnh khắc
          </p>
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16">
            {[
              { label: "Ngày", value: days },
              { label: "Giờ", value: hours },
              { label: "Phút", value: minutes },
              { label: "Giây", value: seconds },
            ].map((item, idx) => (
              <div key={idx} className="relative flex flex-col items-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-[0.5px] border-[#D5B36A]/20 flex items-center justify-center relative">
                  <div className="absolute inset-1 rounded-full border border-[#D5B36A]/10 border-dashed opacity-50" />
                  <span className="font-display text-4xl sm:text-5xl font-light text-[#FFF5D6] tracking-tighter shadow-sm">
                    {String(item.value).padStart(2, "0")}
                  </span>
                </div>
                <span className="mt-6 font-sans text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D5B36A]/60">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Generic Parents Section mapped to Luxury */}
      <ParentsSection groomParents={groomParents} brideParents={brideParents} accentColor={accentColor} theme={theme} />

      {/* 4. GENERIC STORY SECTION (Luxury Variant) */}
      <StorySection theme={theme} accentColor={accentColor} />

      {/* 5. GENERIC COUPLE SECTION (Luxury Variant) */}
      <CoupleSection groomName={groomName} brideName={brideName} accentColor={accentColor} theme={theme} />

      {/* 6. GENERIC EVENTS SECTION (Luxury Variant) */}
      <EventsSection
        date={date}
        time={time}
        venue={venue}
        address={address}
        accentColor={accentColor}
        theme={theme}
      />

      {/* Bespoke Gallery */}
      <CinematicGallery images={displayImages} onImageClick={setLightboxIndex} />
      <UniversalLightbox images={displayImages} currentIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />

      {/* Generic Bank Registry Section mapped to Luxury */}
      <BankRegistrySection groomBank={groomBank} brideBank={brideBank} accentColor={accentColor} theme={theme} />

      {/* Generic Wishes Section mapped to Luxury */}
      {wishesEnabled && <WishesWall publicSlug={publicSlug} theme={theme} accentColor={accentColor} />}

      {/* Bespoke RSVP via RSVPSection */}
      {rsvpEnabled && <RSVPSection theme={theme} accentColor={accentColor} publicSlug={publicSlug} />}
    </motion.div>
  );
};

export default LuxuryTemplate;

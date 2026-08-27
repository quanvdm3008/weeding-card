import React, { useState } from "react";
import type { TemplateProps } from "@/features/template/components/types";
import { useCountdown } from "@/hooks/useCountdown";
import UniversalLightbox from "@/components/galleries/UniversalLightbox";
import { BohoHero } from "./sections/BohoHero";
import { BohoDetails } from "./sections/BohoDetails";
import { CalendarAndMapButtons } from "@/components/wedding/CalendarAndMapButtons";
import { BohoGallery } from "./sections/BohoGallery";
import RSVPSection from "@/components/wedding/RSVPSection";
import StorySection from "@/components/wedding/sections/StorySection";
import { BohoWishes } from "./sections/BohoWishes";
import { themes } from "@/data/themes";
import { WEDDING_SEED_DATA } from "@/data/seedData";
import { bohoTheme } from "./theme";
import { BankRegistrySection } from "@/components/wedding/sections/BankRegistrySection";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import ParentsSection from "@/components/wedding/sections/ParentsSection";

export const BohoTemplate: React.FC<TemplateProps> = ({
  groomName = WEDDING_SEED_DATA.groomName,
  brideName = WEDDING_SEED_DATA.brideName,
  date = WEDDING_SEED_DATA.date,
  time = WEDDING_SEED_DATA.time,
  venue = WEDDING_SEED_DATA.venue,
  address = WEDDING_SEED_DATA.address,
  message = WEDDING_SEED_DATA.message,
  publicSlug,
  rsvpEnabled = true,
  wishesEnabled = true,
  accentColor = bohoTheme.colors.accent,
  galleryImageUrls = WEDDING_SEED_DATA.galleryImageUrls,
  coverImageUrl = WEDDING_SEED_DATA.coverImageUrl,
  stories = WEDDING_SEED_DATA.stories,
  groomBank,
  brideBank,
  groomParents,
  brideParents,
  theme = themes.boho,
}) => {
  const { days, hours, minutes, seconds } = useCountdown(date, time);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div 
      className="boho-template w-full min-h-screen overflow-x-hidden"
      style={{ 
        fontFamily: bohoTheme.typography.sans, 
        backgroundColor: bohoTheme.colors.background,
        color: bohoTheme.colors.text 
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        ::selection { background-color: ${accentColor}; color: ${bohoTheme.colors.background}; }
      `}} />

      <div id="hero">
      <BohoHero
        groomName={groomName}
        brideName={brideName}
        date={date}
        message={message}
        coverImageUrl={coverImageUrl}
      />
      </div>
      
      <div id="story">
      <StorySection theme={theme} accentColor={accentColor} stories={stories.map((story, index) => ({
        title: story.title,
        date: story.date,
        text: story.text,
        img: story.img
      }))} /></div>

      <div id="parents">
        <ParentsSection groomParents={groomParents} brideParents={brideParents} accentColor={accentColor} theme={theme} />
      </div>
      
      <div id="events">
      <BohoDetails
        date={date}
        time={time}
        venue={venue}
        address={address}
      />
      <CalendarAndMapButtons dateStr={date} timeStr={time} venue={venue} address={address} accentColor={accentColor} />
      </div>

      {/* ═══ BOHO COUNTDOWN ═══ */}
      <section className="py-20 px-6 relative overflow-hidden" style={{ backgroundColor: '#F8EDE3' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(198,123,92,0.08) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(198,123,92,0.05) 0%, transparent 60%)' }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <p className="font-serif text-3xl italic mb-2" style={{ color: '#5D4037' }}>Ngày trọng đại</p>
          <p className="text-xs uppercase tracking-[0.3em] mb-12" style={{ color: '#C67B5C', fontFamily: bohoTheme.typography.sans }}>Cùng mong đợi nhé</p>
          <div className="grid grid-cols-4 gap-3 md:gap-6">
            {[{ label: 'Ngày', value: days }, { label: 'Giờ', value: hours }, { label: 'Phút', value: minutes }, { label: 'Giây', value: seconds }].map(({ label, value }) => (
              <div key={label} className="relative">
                <div className="aspect-square flex flex-col items-center justify-center rounded-[2rem] border-2" style={{ borderColor: 'rgba(198,123,92,0.3)', backgroundColor: 'rgba(255,255,255,0.7)' }}>
                  <span className="block text-4xl md:text-5xl font-light" style={{ fontFamily: bohoTheme.typography.display, color: '#5D4037' }}>{String(value).padStart(2, '0')}</span>
                </div>
                <span className="block text-center text-[10px] uppercase tracking-widest mt-3" style={{ color: '#C67B5C' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <div id="gallery">
      <BohoGallery images={galleryImageUrls} onImageClick={(i) => setLightboxIndex(i)} />
      <UniversalLightbox images={galleryImageUrls.length > 0 ? galleryImageUrls : []} currentIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
      </div>

      <div id="gift" className="relative z-10" style={{ backgroundColor: bohoTheme.colors.background }}>
        <BankRegistrySection
          groomBank={groomBank}
          brideBank={brideBank}
          accentColor={accentColor}
          theme={theme}
        />
      </div>
      
      {wishesEnabled && (
        <section className="py-24 md:py-32 px-4 relative overflow-hidden" style={{ backgroundColor: bohoTheme.colors.background }}>
          <FloatingParticles type="sakura" color={accentColor} count={20} />
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <h2 
                className="text-4xl md:text-6xl font-medium mb-4"
                style={{ fontFamily: bohoTheme.typography.display, color: bohoTheme.colors.text }}
              >
                Warm Words
              </h2>
              <p className="text-sm tracking-[0.2em] uppercase mb-8" style={{ color: bohoTheme.colors.accentSecondary }}>
                From our favorite people
              </p>
            </div>
            <BohoWishes 
              accentColor={accentColor} 
              publicSlug={publicSlug} 
            />
          </div>
        </section>
      )}

      {rsvpEnabled && (
        <section className="py-24 md:py-32 px-4 relative overflow-hidden" style={{ backgroundColor: bohoTheme.colors.surface }}>
          {/* Organic background shapes */}
          <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full" fill={bohoTheme.colors.background}>
              <path d="M0 100 C 20 0 50 0 100 100 Z" />
            </svg>
          </div>
          <div className="max-w-3xl mx-auto relative z-10">
            <RSVPSection 
              theme={theme}
              accentColor={accentColor} 
              publicSlug={publicSlug} 
            />
          </div>
        </section>
      )}
    </div>
  );
};

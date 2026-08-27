import React from "react";
import { motion } from "framer-motion";
import type { TemplateProps } from "@/features/template/components/types";
import { editorialTheme } from "./theme";
import { EditorialHero } from "./sections/EditorialHero";
import { EditorialStory } from "./sections/EditorialStory";
import { EditorialEvent } from "./sections/EditorialEvent";
import { CalendarAndMapButtons } from "@/components/wedding/CalendarAndMapButtons";
import SmartGallery from "@/components/galleries/SmartGallery";
import { RSVPSection } from "@/components/wedding/RSVPSection";
import EditorialWishes from "./EditorialWishes";
import { BankRegistrySection } from "@/components/wedding/sections/BankRegistrySection";
import { themes } from "@/data/themes";
import ParentsSection from "@/components/wedding/sections/ParentsSection";
import { WEDDING_SEED_DATA } from "@/data/seedData";
import { useCountdown } from "@/hooks/useCountdown";

export const EditorialTemplate: React.FC<TemplateProps> = ({
  groomName = WEDDING_SEED_DATA.groomName,
  brideName = WEDDING_SEED_DATA.brideName,
  date = WEDDING_SEED_DATA.date,
  time = WEDDING_SEED_DATA.time,
  venue = WEDDING_SEED_DATA.venue,
  address = WEDDING_SEED_DATA.address,
  message = WEDDING_SEED_DATA.message,
  accentColor = editorialTheme.colors.accent,
  publicSlug,
  rsvpEnabled = true,
  wishesEnabled = true,
  galleryImageUrls = WEDDING_SEED_DATA.galleryImageUrls,
  coverImageUrl = WEDDING_SEED_DATA.coverImageUrl,
  stories = WEDDING_SEED_DATA.stories,
  groomParents,
  brideParents,
  groomBank,
  brideBank,
}) => {
  const { days, hours, minutes, seconds } = useCountdown(date, time);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full relative"
      style={{ backgroundColor: editorialTheme.colors.background, color: editorialTheme.colors.text }}
    >
      <style>{`
        ::selection {
          background-color: ${editorialTheme.colors.accent};
          color: #ffffff;
        }
      `}</style>

      <div id="hero">
      <EditorialHero 
        groomName={groomName}
        brideName={brideName}
        date={date}
        coverImageUrl={coverImageUrl}
        message={message}
      />
      </div>

      {/* ═══ EDITORIAL COUNTDOWN ═══ */}
      <section className="py-20 px-6 border-t border-b" style={{ backgroundColor: editorialTheme.colors.text, borderColor: editorialTheme.colors.accent }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.6em] text-center mb-12" style={{ color: editorialTheme.colors.accent, fontFamily: editorialTheme.typography.sans }}>Counting Down</p>
          <div className="grid grid-cols-4 gap-0 divide-x" style={{ borderColor: 'rgba(168,145,114,0.3)' }}>
            {[{ label: 'NGÀY', sub: 'Days', value: days }, { label: 'GIỜ', sub: 'Hours', value: hours }, { label: 'PHÚT', sub: 'Min', value: minutes }, { label: 'GIÂY', sub: 'Sec', value: seconds }].map(({ label, sub, value }) => (
              <div key={label} className="text-center py-8 px-4">
                <span className="block text-5xl md:text-7xl font-bold" style={{ fontFamily: editorialTheme.typography.display, color: '#ffffff' }}>{String(value).padStart(2, '0')}</span>
                <span className="block text-[9px] uppercase tracking-[0.4em] mt-3" style={{ color: editorialTheme.colors.accent }}>{label}</span>
                <span className="block text-[8px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div id="story">
      <EditorialStory stories={stories} />
      </div>

      <ParentsSection
        groomParents={groomParents}
        brideParents={brideParents}
        accentColor={accentColor}
        theme={themes.magazine}
      />

      {/* ═══ EDITORIAL COUPLE SECTION ═══ */}
      <section className="py-24 px-6 overflow-hidden" style={{ backgroundColor: editorialTheme.colors.background }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.6em] text-center mb-16" style={{ color: editorialTheme.colors.accent }}>The Couple</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative overflow-hidden group" style={{ aspectRatio: '3/4' }}>
              <img src={coverImageUrl} alt={groomName} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(54,49,45,0.9) 0%, transparent 50%)' }} />
              <div className="absolute bottom-0 left-0 p-8">
                <p className="text-[9px] uppercase tracking-[0.5em] mb-2" style={{ color: editorialTheme.colors.accent }}>Chú Rể</p>
                <p className="text-2xl font-light text-white" style={{ fontFamily: editorialTheme.typography.display }}>{groomName}</p>
              </div>
            </div>
            <div className="relative overflow-hidden group md:mt-16" style={{ aspectRatio: '3/4' }}>
              <img src={coverImageUrl} alt={brideName} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(54,49,45,0.9) 0%, transparent 50%)' }} />
              <div className="absolute bottom-0 left-0 p-8">
                <p className="text-[9px] uppercase tracking-[0.5em] mb-2" style={{ color: editorialTheme.colors.accent }}>Cô Dâu</p>
                <p className="text-2xl font-light text-white" style={{ fontFamily: editorialTheme.typography.display }}>{brideName}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="events">
      <EditorialEvent 
        date={date}
        time={time}
        venue={venue}
        address={address}
      />
      <div className="py-8 px-6 flex justify-center" style={{ backgroundColor: editorialTheme.colors.background }}>
        <CalendarAndMapButtons dateStr={date} timeStr={time} venue={venue} address={address} accentColor={accentColor} />
      </div>
      </div>

      <div id="gallery" className="py-24 px-6 max-w-7xl mx-auto">
      <SmartGallery 
        images={galleryImageUrls}
        accentColor={accentColor}
      />
      </div>

      {/* GIFT SECTION */}
      <BankRegistrySection groomBank={groomBank} brideBank={brideBank} accentColor={accentColor} theme={themes.magazine} />

      {/* WISHES SECTION */}
      {wishesEnabled && (
        <EditorialWishes 
          publicSlug={publicSlug} 
          accentColor={accentColor} 
        />
      )}

      {rsvpEnabled && (
        <section className="py-24 md:py-32 px-6" style={{ backgroundColor: editorialTheme.colors.text, color: editorialTheme.colors.surface }}>
          <div className="max-w-4xl mx-auto">
            <RSVPSection 
              accentColor={editorialTheme.colors.accent} 
              theme={themes.magazine} 
              publicSlug={publicSlug} 
            />
          </div>
        </section>
      )}

      <footer className="py-12 text-center border-t" style={{ backgroundColor: editorialTheme.colors.text, color: editorialTheme.colors.surface, borderColor: editorialTheme.colors.accent }}>
        <p className="tracking-widest uppercase text-xs" style={{ fontFamily: editorialTheme.typography.sans }}>
          {groomName} & {brideName}
        </p>
      </footer>
    </motion.div>
  );
};

export default EditorialTemplate;

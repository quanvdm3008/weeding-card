import React from "react";
import { motion } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";
import type { TemplateProps } from "@/features/template/components/types";
import { botanicalTheme } from "./theme";
import { BotanicalHero } from "./sections/BotanicalHero";
import { BotanicalStory } from "./sections/BotanicalStory";
import { BotanicalEvent } from "./sections/BotanicalEvent";
import { CalendarAndMapButtons } from "@/components/wedding/CalendarAndMapButtons";
import { BotanicalGallery } from "./sections/BotanicalGallery";
import { RSVPSection } from "@/components/wedding/RSVPSection";
import BotanicalWishes from "./BotanicalWishes";
import { BankRegistrySection } from "@/components/wedding/sections/BankRegistrySection";
import { themes } from "@/data/themes";
import ParentsSection from "@/components/wedding/sections/ParentsSection";
import { WEDDING_SEED_DATA } from "@/data/seedData";

export const BotanicalTemplate: React.FC<TemplateProps> = ({
  groomName = WEDDING_SEED_DATA.groomName,
  brideName = WEDDING_SEED_DATA.brideName,
  date = WEDDING_SEED_DATA.date,
  time = WEDDING_SEED_DATA.time,
  venue = WEDDING_SEED_DATA.venue,
  address = WEDDING_SEED_DATA.address,
  message = WEDDING_SEED_DATA.message,
  accentColor = botanicalTheme.colors.accent,
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
      className="w-full relative selection:bg-[#e8b4b8] selection:text-[#ffffff]"
      style={{ backgroundColor: botanicalTheme.colors.background }}
    >
      <div id="hero">
      <BotanicalHero 
        groomName={groomName}
        brideName={brideName}
        date={date}
        coverImageUrl={coverImageUrl}
        message={message}
      />
      </div>

      <ParentsSection
        groomParents={groomParents}
        brideParents={brideParents}
        accentColor={accentColor}
        theme={themes.garden}
      />

      <div id="story">
      <BotanicalStory stories={stories} />
      </div>

      <div id="events">
      <BotanicalEvent 
        date={date}
        time={time}
        venue={venue}
        address={address}
      />
      <div className="py-6 px-6 flex justify-center" style={{ backgroundColor: botanicalTheme.colors.background }}>
        <CalendarAndMapButtons dateStr={date} timeStr={time} venue={venue} address={address} accentColor={accentColor} />
      </div>
      </div>

      {/* ═══ BOTANICAL COUNTDOWN ═══ */}
      <section className="py-20 px-6" style={{ backgroundColor: '#f9f7f1' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="h-px w-12" style={{ backgroundColor: '#b5c2b7' }} />
            <p className="text-xs uppercase tracking-[0.4em]" style={{ color: '#4a5d4e', fontFamily: "'Outfit', sans-serif" }}>Sắp đến ngày</p>
            <div className="h-px w-12" style={{ backgroundColor: '#b5c2b7' }} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[{ label: 'Ngày', value: days }, { label: 'Giờ', value: hours }, { label: 'Phút', value: minutes }, { label: 'Giây', value: seconds }].map(({ label, value }) => (
              <div key={label} className="text-center p-4 rounded-2xl border" style={{ backgroundColor: 'rgba(181, 194, 183, 0.15)', borderColor: 'rgba(181, 194, 183, 0.4)' }}>
                <span className="block text-4xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#4a5d4e' }}>{String(value).padStart(2, '0')}</span>
                <span className="block text-[10px] uppercase tracking-widest mt-2" style={{ color: '#b5c2b7' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div id="gallery">
      <BotanicalGallery 
        images={galleryImageUrls}
        accentColor={accentColor}
      />
      </div>

      {/* Bespoke Gift Section */}
      <BankRegistrySection groomBank={groomBank} brideBank={brideBank} accentColor={accentColor} theme={themes.garden} />

      {/* Bespoke Wishes Section */}
      {wishesEnabled && (
        <BotanicalWishes 
          publicSlug={publicSlug} 
          accentColor={accentColor} 
        />
      )}

      {rsvpEnabled && (
        <section className="py-24 md:py-32 px-6" style={{ backgroundColor: botanicalTheme.colors.background }}>
          <div className="max-w-4xl mx-auto p-8 rounded-3xl" style={{ backgroundColor: botanicalTheme.colors.surface, boxShadow: "0 10px 40px rgba(0,0,0,0.03)" }}>
            <RSVPSection 
              accentColor={accentColor} 
              theme={themes.garden} 
              publicSlug={publicSlug} 
            />
          </div>
        </section>
      )}

      <footer className="py-16 text-center" style={{ backgroundColor: botanicalTheme.colors.surface, color: botanicalTheme.colors.text }}>
        <p className="tracking-widest uppercase text-xs mb-4" style={{ fontFamily: botanicalTheme.typography.sans }}>
          {groomName} & {brideName}
        </p>
        <p className="text-xs" style={{ fontFamily: botanicalTheme.typography.sans, color: botanicalTheme.colors.textMuted }}>
          Designed with love
        </p>
      </footer>
    </motion.div>
  );
};

export default BotanicalTemplate;

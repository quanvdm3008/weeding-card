import React, { useState } from "react";
import type { TemplateProps } from "@/features/template/components/types";
import { useCountdown } from "@/hooks/useCountdown";
import UniversalLightbox from "@/components/galleries/UniversalLightbox";
import { TropicalHero } from "./sections/TropicalHero";
import { TropicalStory } from "./sections/TropicalStory";
import { TropicalDetails } from "./sections/TropicalDetails";
import { TropicalGallery } from "./sections/TropicalGallery";
import { RSVPSection } from "@/components/wedding/RSVPSection";
import TropicalWishes from "./TropicalWishes";
import { BankRegistrySection } from "@/components/wedding/sections/BankRegistrySection";
import { themes } from "@/data/themes";
import { WEDDING_SEED_DATA } from "@/data/seedData";
import { tropicalTheme } from "./theme";
import ParentsSection from "@/components/wedding/sections/ParentsSection";

export const TropicalTemplate: React.FC<TemplateProps> = ({
  groomName = WEDDING_SEED_DATA.groomName,
  brideName = WEDDING_SEED_DATA.brideName,
  date = WEDDING_SEED_DATA.date,
  time = WEDDING_SEED_DATA.time,
  venue = WEDDING_SEED_DATA.venue,
  address = WEDDING_SEED_DATA.address,
  message = WEDDING_SEED_DATA.message,
  publicSlug,
  publicGuestName,
  publicGuestToken,
  rsvpEnabled = true,
  wishesEnabled = true,
  accentColor = tropicalTheme.colors.accent,
  groomBank,
  brideBank,
  groomParents,
  brideParents,
  coverImageUrl,
  galleryImageUrls = WEDDING_SEED_DATA.galleryImageUrls,
  stories = WEDDING_SEED_DATA.stories,
  theme = themes.tropical,
}) => {
  const { days, hours, minutes, seconds } = useCountdown(date, time);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div 
      className="tropical-template w-full min-h-screen overflow-x-hidden selection:bg-black/10"
      style={{ 
        fontFamily: tropicalTheme.typography.sans, 
        backgroundColor: tropicalTheme.colors.background 
      }}
    >
      <div id="hero">
      <TropicalHero
        groomName={groomName}
        brideName={brideName}
        date={date}
        message={message}
        coverImageUrl={coverImageUrl}
      />
      </div>
      <div id="story">
      <TropicalStory stories={stories} />
      </div>

      <div id="parents">
        <ParentsSection groomParents={groomParents} brideParents={brideParents} accentColor={accentColor} theme={theme} />
      </div>

      <div id="events">
      <TropicalDetails
        date={date}
        time={time}
        venue={venue}
        address={address}
      />
      </div>

      {/* ═══ BOARDING PASS COUNTDOWN ═══ */}
      <section className="py-16 px-6" style={{ backgroundColor: '#F9F6F0', borderTop: '2px dashed #C75B39' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.4em] mb-8" style={{ fontFamily: tropicalTheme.typography.sans, color: '#C75B39' }}>⏳ Countdown to Departure</p>
          <div className="grid grid-cols-4 gap-4">
            {[{ label: 'Ngày', value: days }, { label: 'Giờ', value: hours }, { label: 'Phút', value: minutes }, { label: 'Giây', value: seconds }].map(({ label, value }) => (
              <div key={label} className="bg-white p-4 rounded-xl shadow-sm border" style={{ borderColor: '#C75B39' }}>
                <span className="block text-4xl font-light" style={{ fontFamily: tropicalTheme.typography.display, color: '#C75B39' }}>{String(value).padStart(2, '0')}</span>
                <span className="text-[10px] uppercase tracking-widest mt-2 block" style={{ color: tropicalTheme.colors.textMuted }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div id="gallery">
      <TropicalGallery images={galleryImageUrls} onImageClick={(i) => setLightboxIndex(i)} />
      <UniversalLightbox
        images={galleryImageUrls.length > 0 ? galleryImageUrls : []}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
      </div>
      
      {/* GIFT REGISTRY */}
      <BankRegistrySection groomBank={groomBank} brideBank={brideBank} accentColor={accentColor} theme={theme} />

      {/* WISHES SECTION */}
      {wishesEnabled && (
        <TropicalWishes 
          publicSlug={publicSlug} 
          accentColor={accentColor} 
        />
      )}

      {rsvpEnabled && (
        <section className="relative overflow-hidden px-5 py-16 @md:py-24" style={{ backgroundColor: tropicalTheme.colors.background }}>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ backgroundColor: tropicalTheme.colors.border }} />
          <div className="relative z-10 mx-auto max-w-5xl border bg-white/65 p-5 @sm:p-7 @md:p-10" style={{ borderColor: tropicalTheme.colors.border }}>
            <RSVPSection 
              accentColor={accentColor} 
              theme={themes.tropical} 
              embedded
              publicSlug={publicSlug} 
              guestName={publicGuestName}
              guestToken={publicGuestToken}
            />
          </div>
        </section>
      )}
      
      <footer className="py-16 text-center" style={{ backgroundColor: tropicalTheme.colors.surface, color: tropicalTheme.colors.text }}>
        <p className="tracking-widest uppercase text-xs mb-4" style={{ fontFamily: tropicalTheme.typography.sans }}>
          {groomName} & {brideName}
        </p>
        <p className="text-xs" style={{ fontFamily: tropicalTheme.typography.sans, color: tropicalTheme.colors.textMuted }}>
          A destination wedding
        </p>
      </footer>
    </div>
  );
};

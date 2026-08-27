import React from "react";
import type { TemplateProps } from "@/features/template/components/types";
import { ModernHero } from "./sections/ModernHero";
import { ModernStory } from "./sections/ModernStory";
import { ModernDetails } from "./sections/ModernDetails";
import { CalendarAndMapButtons } from "@/components/wedding/CalendarAndMapButtons";
import SmartGallery from "@/components/galleries/SmartGallery";
import { RSVPSection } from "@/components/wedding/RSVPSection";
import { themes } from "@/data/themes";
import { WEDDING_SEED_DATA } from "@/data/seedData";
import { modernTheme } from "./theme";
import ParentsSection from "@/components/wedding/sections/ParentsSection";
import { ModernWishes } from "./ModernWishes";
import { BankRegistrySection } from "@/components/wedding/sections/BankRegistrySection";
import { ModernCountdown, ModernCouple } from "./sections/ModernCountdownCouple";

export const ModernTemplate: React.FC<TemplateProps> = ({
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
  accentColor = modernTheme.colors.accent,
  galleryImageUrls = WEDDING_SEED_DATA.galleryImageUrls,
  coverImageUrl = WEDDING_SEED_DATA.coverImageUrl,
  groomBank = WEDDING_SEED_DATA.groomBank,
  brideBank = WEDDING_SEED_DATA.brideBank,
  stories = WEDDING_SEED_DATA.stories,
  groomParents,
  brideParents,
  theme = themes.modern,
}) => {
  return (
    <div 
      className="modern-template w-full min-h-screen overflow-x-hidden"
      style={{ 
        fontFamily: modernTheme.typography.sans, 
        backgroundColor: modernTheme.colors.background,
        color: modernTheme.colors.text 
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        ::selection { background-color: ${accentColor}; color: ${modernTheme.colors.background}; }
      `}} />

      <div id="hero">
      <ModernHero
        groomName={groomName}
        brideName={brideName}
        date={date}
        message={message}
        coverImageUrl={coverImageUrl}
        accentColor={accentColor}
      />
      </div>

      {/* ═══ ART DECO COUNTDOWN ═══ */}
      <ModernCountdown date={date} time={time} accentColor={accentColor} />

      {/* ═══ COUPLE SECTION ═══ */}
      <ModernCouple groomName={groomName} brideName={brideName} coverImageUrl={coverImageUrl} accentColor={accentColor} />

      <div id="story">
      <ModernStory stories={stories} />
      </div>
      
      <div id="parents">
        <ParentsSection groomParents={groomParents} brideParents={brideParents} accentColor={accentColor} theme={theme} />
      </div>
      
      <div id="events">
      <ModernDetails
        date={date}
        time={time}
        venue={venue}
        address={address}
      />
      <div className="py-8 px-6 flex justify-center" style={{ backgroundColor: modernTheme.colors.background }}>
        <CalendarAndMapButtons dateStr={date} timeStr={time} venue={venue} address={address} accentColor={accentColor} />
      </div>
      </div>
      
      <div id="gallery">
        <SmartGallery images={galleryImageUrls} accentColor={accentColor} />
      </div>
      
      
      {/* GIFT REGISTRY */}
      <BankRegistrySection groomBank={groomBank} brideBank={brideBank} accentColor={accentColor} theme={theme} />

      {wishesEnabled && (
        <div id="wishes">
          <ModernWishes publicSlug={publicSlug} accentColor={accentColor} theme={theme} />
        </div>
      )}

      {rsvpEnabled && (
        <section className="py-24 md:py-40 px-6 relative overflow-hidden" style={{ backgroundColor: modernTheme.colors.surface }}>
          <div className="max-w-4xl mx-auto relative z-10 p-8 md:p-16 border" style={{ backgroundColor: modernTheme.colors.surfaceElevated, borderColor: modernTheme.colors.border }}>
            <div className="text-center mb-16">
              <h2 
                className="text-4xl md:text-5xl font-medium mb-4"
                style={{ fontFamily: modernTheme.typography.display, color: modernTheme.colors.text }}
              >
                Join Us
              </h2>
              <p 
                className="text-sm uppercase tracking-[0.2em]"
                style={{ color: modernTheme.colors.accent }}
              >
                Please respond by {date.split("-").reverse().join("/")}
              </p>
            </div>
            
            <RSVPSection 
              accentColor={accentColor} 
              theme={themes.modern} 
              publicSlug={publicSlug} 
              guestName={publicGuestName}
              guestToken={publicGuestToken}
            />
          </div>
        </section>
      )}
      
      <footer className="py-24 text-center border-t" style={{ backgroundColor: modernTheme.colors.background, borderColor: modernTheme.colors.surface }}>
        <h2 
          className="text-3xl md:text-4xl font-medium mb-6"
          style={{ fontFamily: modernTheme.typography.display, color: modernTheme.colors.text }}
        >
          {groomName} & {brideName}
        </h2>
        <p className="tracking-widest uppercase text-[10px] md:text-xs" style={{ color: modernTheme.colors.textMuted }}>
          {date.split("-").reverse().join(" . ")}
        </p>
      </footer>
    </div>
  );
};

import React from "react";
import { SparklingImage } from "@/components/wedding/SparklingImage";
import { motion } from "framer-motion";
import { WEDDING_SEED_DATA } from "@/data/seedData";
import { themes } from "@/data/themes";
import { RSVPSection } from "@/components/wedding/RSVPSection";
import GalleryDispatcher from "@/components/galleries/GalleryDispatcher";
import { useCountdown } from "@/hooks/useCountdown";
import CalendarAndMapButtons from "@/components/wedding/CalendarAndMapButtons";
import ParentsSection from "@/components/wedding/sections/ParentsSection";
import TimelineSection from "@/components/wedding/sections/TimelineSection";
import type { TemplateProps } from "@/features/template/components/types";
import { RomanticWishes } from "./RomanticWishes";
import { BankRegistrySection } from "@/components/wedding/sections/BankRegistrySection";

export const RomanticTemplate: React.FC<TemplateProps> = ({
  groomName = WEDDING_SEED_DATA.groomName,
  brideName = WEDDING_SEED_DATA.brideName,
  date = WEDDING_SEED_DATA.date,
  time = WEDDING_SEED_DATA.time,
  venue = WEDDING_SEED_DATA.venue,
  address = WEDDING_SEED_DATA.address,
  message = WEDDING_SEED_DATA.message,
  accentColor = "#CDB4B5",
  publicSlug,
  publicGuestName,
  publicGuestToken,
  rsvpEnabled = true,
  wishesEnabled = true,
  galleryImageUrls = WEDDING_SEED_DATA.galleryImageUrls,
  coverImageUrl = WEDDING_SEED_DATA.coverImageUrl,
  groomBank,
  brideBank,
  stories = WEDDING_SEED_DATA.stories,
  groomParents,
  brideParents,
  schedule,
  theme = themes.romantic,
}) => {
  const { days, hours, minutes, seconds } = useCountdown(date, time);
  const displayImages = galleryImageUrls && galleryImageUrls.length > 0 ? galleryImageUrls : WEDDING_SEED_DATA.galleryImageUrls;
  const safeStories = stories && stories.length > 0 ? stories : WEDDING_SEED_DATA.stories;
  
  // Refined Color Palette
  const textDark = "#3A3534"; // Charcoal dark brown
  const textMuted = "#8C8381"; // Muted taupe
  const borderLight = "#E8E1DE"; // Very soft greige border

  return (
    <motion.div
      className="font-serif bg-[#FCFBF9] relative overflow-hidden"
      style={{ color: textDark }}
    >
      {/* Very subtle grain overlay for paper texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 mix-blend-multiply"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* 1. HERO SECTION (Editorial Arch & Gold Foil Monogram) */}
      <section id="hero" className="relative min-h-[92vh] flex flex-col items-center justify-center pt-24 pb-16 px-6 text-center z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center max-w-2xl mx-auto w-full"
        >
          {/* Royal Monogram Badge */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="mb-8 flex items-center justify-center gap-3"
          >
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#d4af37]" />
            <span className="font-sans text-[10px] sm:text-xs tracking-[0.45em] uppercase font-semibold text-[#b38728]">
              ✦ SAVE THE DATE ✦
            </span>
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#d4af37]" />
          </motion.div>

          <span className="font-sans text-[11px] sm:text-xs tracking-[0.4em] uppercase mb-10 font-medium" style={{ color: textMuted }}>
            {date.split("-").reverse().join(".")}
          </span>
          
          {/* French Arched Image Frame with Gold Foil Bezels */}
          <div className="relative w-[280px] sm:w-[360px] aspect-[3/4] mb-12 group">
            {/* Outer Gold Shimmer Ring */}
            <div className="absolute inset-[-18px] border-[1px] rounded-t-[200px] border-[#d4af37]/35 pointer-events-none transition-all duration-700 group-hover:inset-[-22px] group-hover:border-[#d4af37]/60" />
            <div className="absolute inset-[-8px] border-[0.5px] rounded-t-[185px] border-[#d4af37]/20 pointer-events-none" />

            <div className="w-full h-full rounded-t-[170px] overflow-hidden relative shadow-[0_30px_70px_-20px_rgba(0,0,0,0.15)] bg-[#FAF8F5]">
              <SparklingImage
                accentColor={accentColor}
                src={coverImageUrl}
                alt="Couple"
                loading="eager"
                fetchPriority="high"
                tilt3d={false}
                className="w-full h-full object-cover scale-105 transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Sparkle Glint on Arch Apex */}
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[#d4af37] text-sm animate-sparkle-glow">✦</span>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-light italic tracking-wide leading-tight mb-4 text-[#2d2928]">
            <span className="gold-foil-text font-normal">{groomName}</span>
            <span className="text-3xl sm:text-5xl font-serif mx-3 text-[#d4af37]">&</span>
            <span className="gold-foil-text font-normal">{brideName}</span>
          </h1>
          
          <div className="flex items-center justify-center gap-3 my-6">
            <span className="h-[1px] w-12 bg-[#d4af37]/40" />
            <span className="text-[#d4af37] text-xs">❦</span>
            <span className="h-[1px] w-12 bg-[#d4af37]/40" />
          </div>
          
          <p className="font-sans text-[11px] sm:text-xs tracking-[0.3em] uppercase max-w-md leading-relaxed text-[#786f6d]">
            Trân trọng kính mời tới dự bữa tiệc chung vui cùng gia đình chúng tôi tại {venue}
          </p>
        </motion.div>
      </section>

      {/* 2. THE MESSAGE & COUNTDOWN (Fine Art Card) */}
      <section className="py-24 px-6 relative z-10 border-t border-[#d4af37]/15">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-display text-2xl sm:text-3xl italic leading-relaxed mb-16 text-[#3a3534] font-light">
            "{message}"
          </p>

          <span className="font-sans text-[10px] uppercase tracking-[0.45em] block mb-10 text-[#b38728] font-semibold">
            ✦ Đếm Ngược Đến Ngày Trọng Đại ✦
          </span>
          
          <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-lg mx-auto bg-white/70 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[#d4af37]/25 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.04)]">
            {[
              { label: "Ngày", value: days },
              { label: "Giờ", value: hours },
              { label: "Phút", value: minutes },
              { label: "Giây", value: seconds },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="font-display text-3xl sm:text-5xl font-light mb-2 text-[#2d2928]">
                  {String(item.value).padStart(2, "0")}
                </span>
                <span className="font-sans text-[9px] uppercase tracking-[0.25em] font-semibold text-[#b38728]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. LOVE STORY (Cinematic Layout) */}
      <section id="story" className="py-24 px-6 bg-[#F7F5F2] border-y" style={{ borderColor: borderLight }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-24">
            <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-medium mb-4 block" style={{ color: accentColor }}>
              Chuyện Tình
            </span>
            <h2 className="font-display text-4xl sm:text-5xl italic font-light">
              Our Journey
            </h2>
          </div>

          <div className="space-y-32">
            {safeStories.map((story, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`flex flex-col ${idx % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-12 sm:gap-20`}
              >
                <div className="w-full md:w-1/2">
                  <div className="aspect-[4/5] overflow-hidden shadow-2xl relative">
                    <SparklingImage
                      accentColor={accentColor}
                      src={story.img}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/[0.03]" />
                  </div>
                </div>

                <div className={`w-full md:w-1/2 text-center md:text-left ${idx % 2 === 1 ? "md:text-right" : ""}`}>
                  <span className="font-sans text-[10px] uppercase tracking-[0.3em] block mb-4" style={{ color: textMuted }}>
                    {story.date}
                  </span>
                  <h3 className="font-display text-3xl sm:text-4xl italic font-light mb-6">
                    {story.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm leading-loose tracking-wide opacity-80" style={{ color: textDark }}>
                    {story.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. COUPLE PORTRAITS (Minimal Fine Art) */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 sm:gap-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
              className="flex flex-col items-center"
            >
              <div className="w-full max-w-[300px] aspect-[3/4] mb-8 overflow-hidden bg-gray-100 shadow-xl relative">
                <SparklingImage
                  accentColor={accentColor}
                  src={coverImageUrl}
                  alt="Chú rể"
                  className="w-full h-full object-cover grayscale-[20%]"
                />
              </div>
              <span className="font-sans text-[9px] uppercase tracking-[0.4em] block mb-3" style={{ color: accentColor }}>Chú Rể</span>
              <h3 className="font-display text-3xl italic">{groomName}</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.2 }}
              className="flex flex-col items-center md:mt-24"
            >
              <div className="w-full max-w-[300px] aspect-[3/4] mb-8 overflow-hidden bg-gray-100 shadow-xl relative">
                <SparklingImage
                  accentColor={accentColor}
                  src={displayImages[0] || coverImageUrl}
                  alt="Cô dâu"
                  className="w-full h-full object-cover grayscale-[20%]"
                />
              </div>
              <span className="font-sans text-[9px] uppercase tracking-[0.4em] block mb-3" style={{ color: accentColor }}>Cô Dâu</span>
              <h3 className="font-display text-3xl italic">{brideName}</h3>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="border-t" style={{ borderColor: borderLight }} />
      <ParentsSection groomParents={groomParents} brideParents={brideParents} accentColor={accentColor} theme={theme} />

      {/* 5. EVENTS & CALENDAR MAP NAVIGATION */}
      <section id="events" className="py-32 px-6 bg-[#F7F5F2] border-y" style={{ borderColor: borderLight }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-20">
            <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-medium mb-4 block" style={{ color: accentColor }}>
              Sự Kiện
            </span>
            <h2 className="font-display text-4xl sm:text-5xl italic font-light">
              Chi Tiết Lễ Cưới
            </h2>
          </div>

          <div className="space-y-12 mb-16">
            <div className="flex flex-col sm:flex-row items-center justify-between py-12 border-b relative" style={{ borderColor: borderLight }}>
              <div className="absolute inset-0 bg-white/40 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="text-center sm:text-left mb-6 sm:mb-0 w-full sm:w-1/3">
                <h3 className="font-display text-2xl italic font-light mb-2">Lễ Thành Hôn</h3>
                <span className="font-sans text-[10px] uppercase tracking-[0.2em]" style={{ color: textMuted }}>09:00 Sáng</span>
              </div>
              <div className="text-center sm:text-right w-full sm:w-2/3">
                <p className="font-sans text-xs tracking-widest uppercase mb-2 leading-relaxed font-medium">{venue}</p>
                <p className="font-sans text-[10px] opacity-70 tracking-widest uppercase">{address}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between py-12 border-b relative" style={{ borderColor: borderLight }}>
              <div className="absolute inset-0 bg-white/40 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="text-center sm:text-left mb-6 sm:mb-0 w-full sm:w-1/3">
                <h3 className="font-display text-2xl italic font-light mb-2">Tiệc Cưới</h3>
                <span className="font-sans text-[10px] uppercase tracking-[0.2em]" style={{ color: textMuted }}>18:00 Tối</span>
              </div>
              <div className="text-center sm:text-right w-full sm:w-2/3">
                <p className="font-sans text-xs tracking-widest uppercase mb-2 leading-relaxed font-medium">{venue}</p>
                <p className="font-sans text-[10px] opacity-70 tracking-widest uppercase">{address}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <CalendarAndMapButtons
              title={`${groomName} & ${brideName}`}
              dateStr={date}
              timeStr={time}
              venue={venue}
              address={address}
              accentColor={accentColor}
            />
          </div>
        </div>
      </section>

      <TimelineSection schedule={schedule} accentColor={accentColor} theme={theme} />

      {/* 6. ALBUM GALLERY (Editorial Grid) */}
      <div id="gallery" className="relative z-10 w-full overflow-hidden bg-white">
        <GalleryDispatcher theme={theme} accentColor={accentColor} images={displayImages} />
      </div>

      {/* 7. GIFT / REGISTRY */}
      <BankRegistrySection groomBank={groomBank} brideBank={brideBank} accentColor={accentColor} theme={theme} />

      {/* ═══ DRESS CODE ═══ */}
      <section className="py-20 px-6" style={{ background: 'linear-gradient(180deg, #FDF8F8 0%, #FAF0F0 100%)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: '#C4A4A4', fontFamily: "'Montserrat', sans-serif" }}>Dress Code</p>
          <h2 className="font-serif text-3xl italic mb-12" style={{ color: '#8B6B6B' }}>Trang phục tham dự</h2>
          <div className="flex justify-center gap-8 flex-wrap">
            {[
              { color: '#FAF0F0', border: '#E8C4C4', label: 'Hồng nhạt' },
              { color: '#FFF5EE', border: '#DEB887', label: 'Peach' },
              { color: '#F5F5F5', border: '#C8C8C8', label: 'Trắng' },
              { color: '#8B6B6B', border: '#8B6B6B', label: 'Đỏ wine' },
            ].map(({ color, border, label }) => (
              <div key={label} className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full shadow-md transition-transform hover:scale-110" style={{ backgroundColor: color, border: `2px solid ${border}` }} />
                <span className="text-[10px] uppercase tracking-widest" style={{ color: '#C4A4A4', fontFamily: "'Montserrat', sans-serif" }}>{label}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm font-light" style={{ color: '#B8A0A0' }}>Trang phục thanh lịch, nhẹ nhàng theo tone pastel & đất.</p>
        </div>
      </section>

      {/* 8. WISHES WALL */}
      {wishesEnabled && (
        <div id="wishes" className="bg-[#FCFBF9]">
          <RomanticWishes publicSlug={publicSlug} accentColor={accentColor} theme={theme} />
        </div>
      )}

      {/* 9. RSVP FORM */}
      {rsvpEnabled && (
        <section id="rsvp" className="py-32 px-6 bg-[#F7F5F2] border-t" style={{ borderColor: borderLight }}>
          <div className="max-w-3xl mx-auto">
            <RSVPSection accentColor={accentColor} theme={theme} publicSlug={publicSlug} guestName={publicGuestName} guestToken={publicGuestToken} />
          </div>
        </section>
      )}
    </motion.div>
  );
};

export default RomanticTemplate;

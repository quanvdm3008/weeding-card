import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Anchor, Wind, Sun, Waves, MapPin, CalendarHeart } from "lucide-react";
import type { TemplateProps } from "@/features/template/components/types";
import { WEDDING_SEED_DATA } from "@/data/seedData";
import { themes } from "@/data/themes";
import { RSVPSection } from "@/components/wedding/RSVPSection";
import { CoastalWishes } from "./CoastalWishes";
import ParentsSection from "@/components/wedding/sections/ParentsSection";
import { BankRegistrySection } from "@/components/wedding/sections/BankRegistrySection";
import { getVietQrImageUrl } from "@/lib/vietqr";
import { useCountdown } from "@/hooks/useCountdown";
import StorySection from "@/components/wedding/sections/StorySection";
import UniversalLightbox from "@/components/galleries/UniversalLightbox";

const FlyingBirds = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div
        className="absolute top-[15%] text-[#006064]/20"
        animate={{ x: ["-10vw", "110vw"], y: [0, -50, 20, -10] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <svg width="40" height="20" viewBox="0 0 100 50" fill="currentColor">
          <path d="M50 25 C30 0, 0 10, 0 10 C20 15, 45 35, 50 35 C55 35, 80 15, 100 10 C100 10, 70 0, 50 25 Z" />
        </svg>
      </motion.div>
      <motion.div
        className="absolute top-[20%] text-[#006064]/30"
        animate={{ x: ["-5vw", "115vw"], y: [0, 30, -20, 10] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 5 }}
      >
        <svg width="30" height="15" viewBox="0 0 100 50" fill="currentColor">
          <path d="M50 25 C30 0, 0 10, 0 10 C20 15, 45 35, 50 35 C55 35, 80 15, 100 10 C100 10, 70 0, 50 25 Z" />
        </svg>
      </motion.div>
    </div>
  );
};

const RisingBubbles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 mix-blend-overlay">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 rounded-full border border-white/40 bg-white/10"
          style={{
            width: Math.random() * 20 + 10 + "px",
            height: Math.random() * 20 + 10 + "px",
            left: Math.random() * 100 + "%",
          }}
          animate={{
            y: ["10vh", "-110vh"],
            x: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 100],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

const SunGlare = () => {
  return (
    <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full bg-[#FFF59D] opacity-20 blur-[100px] pointer-events-none z-0" />
  );
};

const AnimatedWaves = () => {
  return (
    <div className="w-full h-32 md:h-48 relative z-20 overflow-hidden -mb-1">
      <motion.div 
        className="absolute bottom-0 w-[200%] h-full text-white/50"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,256L48,229.3C96,203,192,149,288,154.7C384,160,480,224,576,218.7C672,213,768,139,864,128C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          <path fill="currentColor" transform="translate(1440, 0)" d="M0,256L48,229.3C96,203,192,149,288,154.7C384,160,480,224,576,218.7C672,213,768,139,864,128C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </motion.div>
      <motion.div 
        className="absolute bottom-0 w-[200%] h-full text-white/90"
        animate={{ x: ["-50%", "0%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          <path fill="currentColor" transform="translate(1440, 0)" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </motion.div>
    </div>
  );
};

export const CoastalTemplate: React.FC<TemplateProps> = ({
  groomName = WEDDING_SEED_DATA.groomName,
  brideName = WEDDING_SEED_DATA.brideName,
  date = WEDDING_SEED_DATA.date,
  time = WEDDING_SEED_DATA.time,
  venue = WEDDING_SEED_DATA.venue,
  address = WEDDING_SEED_DATA.address,
  message = WEDDING_SEED_DATA.message,
  accentColor = "#00838F",
  publicSlug,
  publicGuestName,
  publicGuestToken,
  rsvpEnabled = true,
  wishesEnabled = true,
  galleryImageUrls = WEDDING_SEED_DATA.galleryImageUrls,
  groomBank,
  brideBank,
  groomParents,
  brideParents,
  theme = themes.coastal,
  stories = WEDDING_SEED_DATA.stories,
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { days, hours, minutes, seconds } = useCountdown(date, time);
  const { scrollYProgress } = useScroll();
  const displayImages = galleryImageUrls.length > 0 ? galleryImageUrls : WEDDING_SEED_DATA.galleryImageUrls;
  const giftQr = getVietQrImageUrl(groomBank || brideBank, (groomBank || brideBank)?.accountHolder || groomName);
  const scrollRef = useRef<HTMLDivElement>(null);

  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yImage1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yImage2 = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  return (
    <div className="relative min-h-screen overflow-x-hidden text-[#006064] bg-[#E0F7FA] font-sans selection:bg-[#80DEEA] selection:text-[#006064]">
      
      {/* Base Ocean Parallax Background */}
      <div className="fixed inset-0 z-0 bg-[#E0F7FA] overflow-hidden">
        {/* Soft, dreamy ocean background */}
        <motion.img 
          style={{ y: yHero, scale: 1.1 }} 
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000" 
          alt="Beach Background" 
          className="w-full h-[120%] object-cover absolute -top-[10%] opacity-[0.15]" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#E0F7FA]/70 via-[#00838F]/5 to-[#B2EBF2]/90 pointer-events-none" />
      </div>

      <div className="relative z-10" ref={scrollRef}>
        
        {/* ================= HERO SECTION (ASYMMETRIC) ================= */}
        <section className="min-h-[100svh] flex flex-col justify-center px-6 md:px-16 pt-20 pb-32 relative overflow-hidden">
          <SunGlare />
          <FlyingBirds />
          <RisingBubbles />
          
          <motion.div style={{ y: yHero }} className="w-full max-w-7xl mx-auto flex flex-col h-full relative z-20">
            <p className="uppercase tracking-[0.4em] text-sm md:text-base font-semibold text-[#00838F] mb-12 flex items-center gap-3">
              <Wind className="w-5 h-5" /> Coastal Romance
            </p>
            
            <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8 relative">
              {/* Groom */}
              <div className="flex-1 text-right w-full">
                <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-serif italic font-light leading-none tracking-tight text-[#004D40] drop-shadow-md">
                  {groomName.split(' ')[0]}
                </h1>
              </div>
              
              {/* Center Divider */}
              <div className="w-[2px] h-32 md:h-auto bg-gradient-to-b from-transparent via-[#00838F] to-transparent shrink-0 relative overflow-hidden">
                <motion.div 
                  className="w-full h-1/3 bg-[#80DEEA]"
                  animate={{ y: ["0%", "300%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </div>

              {/* Bride */}
              <div className="flex-1 text-left w-full mt-4 md:mt-32">
                <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-serif italic font-light leading-none tracking-tight text-[#004D40] drop-shadow-md">
                  {brideName.split(' ')[0]}
                </h1>
              </div>
            </div>

            <div className="mt-20 self-center md:self-end text-center md:text-right max-w-md bg-white/30 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-xl">
              <p className="font-serif italic text-xl md:text-2xl leading-relaxed text-[#006064]">"{message}"</p>
            </div>
          </motion.div>
        </section>

        {/* ================= ORGANIC WAVE MASK TRANSITION ================= */}
        <AnimatedWaves />

        {/* ═══ LOVE STORY ═══ */}
        <section className="bg-white/90 backdrop-blur-lg py-24 px-6 relative z-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[10px] uppercase tracking-[0.4em] mb-3" style={{ color: '#00838F' }}>Our Journey</p>
              <h2 className="font-serif italic text-3xl text-[#004D40]">Chuyện tình của chúng tôi</h2>
            </div>
            <StorySection
              theme={theme}
              accentColor={accentColor}
              sectionBg="transparent"
              stories={stories.map(s => ({ title: s.title, date: s.date, text: s.text, img: s.img }))}
            />
          </div>
        </section>

        {/* ================= THE COASTAL PATH (PARENTS & SCHEDULE) ================= */}
        <section className="bg-white/80 backdrop-blur-xl py-24 px-6 relative z-20 overflow-hidden">
          {/* Subtle background blob */}
          <div className="absolute top-40 -right-20 w-96 h-96 bg-[#80DEEA]/20 rounded-full blur-[80px]" />
          <div className="absolute bottom-40 -left-20 w-96 h-96 bg-[#00838F]/10 rounded-full blur-[80px]" />

          <div className="max-w-5xl mx-auto space-y-32">
            
            {/* Parents - Zig Zag */}
            <ParentsSection groomParents={groomParents} brideParents={brideParents} accentColor={accentColor} theme={theme} images={displayImages} />

            {/* Schedule - The Path */}
            <div className="pt-16 border-t border-[#00838F]/10">
              <h2 className="text-center font-sans text-xs uppercase tracking-[0.4em] text-[#00838F] mb-16">The Journey</h2>
              
              <div className="flex flex-col items-center">
                
                <div className="flex gap-4 md:gap-8 mb-16 overflow-x-auto w-full justify-start md:justify-center px-4 py-4 [scrollbar-width:none]">
                  {[
                    { label: 'Days', value: days },
                    { label: 'Hours', value: hours },
                    { label: 'Min', value: minutes },
                    { label: 'Sec', value: seconds }
                  ].map((item, idx) => (
                    <div key={idx} className="flex-shrink-0 bg-white shadow-[0_10px_30px_rgba(0,131,143,0.1)] w-24 h-24 rounded-full flex flex-col items-center justify-center border border-[#E0F7FA]">
                      <div className="text-3xl font-light text-[#006064] leading-none">{item.value}</div>
                      <div className="text-[9px] uppercase tracking-widest text-[#00838F] mt-1">{item.label}</div>
                    </div>
                  ))}
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-white to-[#E0F7FA] p-8 md:p-12 rounded-[3rem] w-full max-w-2xl text-center shadow-xl border border-white"
                >
                  <Sun className="w-10 h-10 text-[#00838F] mx-auto mb-6" strokeWidth={1} />
                  <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                    <div>
                      <CalendarHeart className="w-6 h-6 text-[#006064] mx-auto mb-3" />
                      <p className="font-serif text-xl">{date}</p>
                      <p className="text-sm font-semibold">{time}</p>
                    </div>
                    <div className="w-[1px] h-16 bg-[#00838F]/20 hidden md:block" />
                    <div>
                      <MapPin className="w-6 h-6 text-[#006064] mx-auto mb-3" />
                      <p className="font-serif text-xl">{venue}</p>
                      <p className="text-sm font-semibold mt-1 opacity-80 max-w-[200px]">{address}</p>
                    </div>
                  </div>
                </motion.div>

              </div>
            </div>

          </div>
        </section>

        {/* ================= DRIFTING GALLERY ================= */}
        <section className="py-32 relative z-20 overflow-hidden bg-gradient-to-b from-white/80 to-[#E0F7FA]/60 backdrop-blur-md">
          <div className="text-center mb-16">
            <h2 className="font-sans text-xs uppercase tracking-[0.4em] text-[#00838F] mb-4">Washed Ashore</h2>
            <p className="font-serif italic text-2xl text-[#004D40]">Beautiful Moments</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 px-6 md:px-16 pb-16 max-w-7xl mx-auto items-center">
            {displayImages.map((src, i) => (
              <motion.div 
                key={i} 
                className="relative mx-auto w-full max-w-sm cursor-pointer"
                onClick={() => setLightboxIndex(i)}
                initial={{ rotate: Math.random() * 12 - 6, y: 50, opacity: 0 }}
                whileInView={{ rotate: Math.random() * 12 - 6, y: 0, opacity: 1 }}
                whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <div className="w-full aspect-[3/4] bg-white p-4 pb-20 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100/50">
                  <img src={src} alt="Gallery" className="w-full h-full object-cover rounded-sm" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <UniversalLightbox
          images={displayImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />

        {/* ================= BOTTLE MESSAGES (RSVP, GIFT, WISHES) ================= */}
        <section className="py-32 px-6 relative z-20 bg-gradient-to-b from-[#E0F7FA]/60 to-[#B2EBF2] backdrop-blur-lg">
          <div className="max-w-4xl mx-auto space-y-24">
            
            {/* Gift */}
            <BankRegistrySection groomBank={groomBank} brideBank={brideBank} accentColor={accentColor} theme={theme} />

            {/* RSVP */}
            {rsvpEnabled && (
              <div className="bg-white/60 p-8 md:p-12 rounded-[3rem] shadow-xl border border-white">
                 <h2 className="font-sans text-xs uppercase tracking-[0.4em] text-[#00838F] mb-8 text-center">Join the Voyage</h2>
              <RSVPSection theme={theme} accentColor={accentColor} embedded publicSlug={publicSlug} guestName={publicGuestName} guestToken={publicGuestToken} />
              </div>
            )}

            {/* Wishes */}
            {wishesEnabled && (
              <CoastalWishes publicSlug={publicSlug} accentColor={accentColor} theme={theme} />
            )}

          </div>
          
          <div className="mt-32 text-center pb-8">
             <Waves className="w-8 h-8 text-[#00838F]/40 mx-auto" />
          </div>
        </section>

        {/* Custom Coastal Footer */}
        <footer className="py-12 bg-[#B2EBF2] text-center text-[#006064] relative z-20 border-t border-[#00838F]/10">
          <p className="font-serif italic text-2xl mb-2">Forever & Always</p>
          <p className="font-sans text-sm tracking-widest uppercase">{groomName} & {brideName}</p>
          <p className="text-[#00838F] font-body text-xs mt-6 opacity-60">Created with 🤍 by Wedding Cards Online</p>
        </footer>

      </div>
    </div>
  );
};

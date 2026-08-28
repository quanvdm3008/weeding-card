import { useState, useEffect } from "react";
import { SparklingImage } from "@/components/wedding/SparklingImage";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Calendar, ChevronDown, MapPin, Send, Gift, MessageCircle } from "lucide-react";
import { WEDDING_SEED_DATA } from "@/data/seedData";
import { RSVPSection } from "@/components/wedding/RSVPSection";
import { themes } from "@/data/themes";
import TraditionalGallery from "./TraditionalGallery";
import type { TemplateProps } from "@/features/template/components/types";
import { useCountdown } from "@/hooks/useCountdown";
import { traditionalTheme } from "./theme";
import ParentsSection from "@/components/wedding/sections/ParentsSection";
import { TraditionalWishes } from "./TraditionalWishes";
import { BankRegistrySection } from "@/components/wedding/sections/BankRegistrySection";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export const TraditionalTemplate = ({
  groomName = WEDDING_SEED_DATA.groomName,
  brideName = WEDDING_SEED_DATA.brideName,
  date = WEDDING_SEED_DATA.date,
  time = WEDDING_SEED_DATA.time,
  venue = WEDDING_SEED_DATA.venue,
  address = WEDDING_SEED_DATA.address,
  message = WEDDING_SEED_DATA.message,
  accentColor = "#F7F5F5",
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
  theme = themes.traditional,
}: TemplateProps) => {
  const { days, hours, minutes, seconds } = useCountdown(date, time);
  const displayImages = galleryImageUrls && galleryImageUrls.length > 0 ? galleryImageUrls : WEDDING_SEED_DATA.galleryImageUrls;
  const faqs = WEDDING_SEED_DATA.faqs;

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Parse date for the large display
  const parsedDate = new Date(date);
  const month = parsedDate.getMonth() + 1;
  const day = parsedDate.getDate();
  const year = parsedDate.getFullYear();
  const dayOfWeek = format(parsedDate, "EEEE", { locale: vi });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
      className="relative overflow-hidden bg-[#8B2A34] font-serif text-white pb-24"
    >
      {/* 1. HERO - Replicating the screenshot */}
      <section id="hero" className="relative flex flex-col items-center pb-24 pt-16 px-4 min-h-screen">
        <div className="text-center mb-10 max-w-lg mx-auto">
          <h1 className="text-[13px] md:text-sm font-bold font-serif leading-loose uppercase text-white tracking-widest">
            TRÂN TRỌNG KÍNH MỜI QUÝ KHÁCH ĐẾN<br/>CHUNG VUI CÙNG GIA ĐÌNH CHÚNG TÔI
          </h1>
        </div>

        <div className="flex flex-row justify-center items-center gap-2 md:gap-4 mb-16 w-full max-w-4xl mx-auto h-[40vh] min-h-[300px]">
          <div className="w-[30%] h-[80%] relative border-[1.5px] border-white p-1">
            <SparklingImage accentColor={accentColor} src={displayImages[0] || WEDDING_SEED_DATA.galleryImageUrls[0]} fallbackSrc={WEDDING_SEED_DATA.galleryImageUrls[0]} alt="Couple 1" className="w-full h-full object-cover" />
          </div>
          <div className="w-[40%] h-full relative border-[1.5px] border-white p-1 z-10 shadow-2xl">
            <SparklingImage accentColor={accentColor} src={coverImageUrl || WEDDING_SEED_DATA.coverImageUrl} fallbackSrc={WEDDING_SEED_DATA.coverImageUrl} alt="Couple 2" className="w-full h-full object-cover" />
          </div>
          <div className="w-[30%] h-[80%] relative border-[1.5px] border-white p-1">
            <SparklingImage accentColor={accentColor} src={displayImages[1] || WEDDING_SEED_DATA.galleryImageUrls[1]} fallbackSrc={WEDDING_SEED_DATA.galleryImageUrls[1]} alt="Couple 3" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="text-center w-full max-w-xl mx-auto space-y-5">
          <h2 className="text-2xl md:text-3xl font-serif font-bold uppercase text-white tracking-wide">Bữa Tiệc Chung Vui</h2>
          <p className="text-sm md:text-base font-serif uppercase text-white tracking-wide">Được Tổ Chức Vào Lúc {time}, {dayOfWeek}</p>
          
          <div className="flex items-center justify-center gap-6 py-4">
            <div className="border-y-[1.5px] border-white/80 py-2 px-6">
              <span className="text-base md:text-lg font-serif uppercase text-white whitespace-nowrap tracking-widest">Tháng {month}</span>
            </div>
            <div className="text-7xl md:text-8xl font-serif text-white leading-none px-4">
              {day}
            </div>
            <div className="border-y-[1.5px] border-white/80 py-2 px-6">
              <span className="text-base md:text-lg font-serif uppercase text-white whitespace-nowrap tracking-widest">Năm {year}</span>
            </div>
          </div>
          
          <p className="text-sm md:text-base italic font-serif text-white/90 font-medium">(Tức ngày 19 tháng 10 năm Bính Ngọ - Giả định)</p>
          
          <div className="mt-8">
            <h3 className="text-xl md:text-2xl font-serif font-bold uppercase text-white mb-2 tracking-wide">TẠI TƯ GIA</h3>
            <p className="text-base md:text-lg font-serif text-white/90">{venue}</p>
            <p className="text-sm md:text-base font-serif text-white/80 mt-1">{address}</p>
          </div>
          
          <div className="pt-8 pb-12">
            <a href={`https://maps.google.com/?q=${venue} ${address}`} target="_blank" rel="noreferrer" className="inline-block bg-[#F7EBEB] text-[#8B2A34] font-serif font-bold py-3.5 px-10 rounded-[30px] shadow-lg hover:bg-white hover:scale-105 transition-all uppercase tracking-widest text-sm">
              XEM CHỈ ĐƯỜNG
            </a>
          </div>
        </div>
      </section>

      {/* FLOATING WISHES / ZENLOVE-STYLE ELEMENTS on the left */}
      <div className="absolute left-0 bottom-40 hidden @md:flex flex-col gap-3 pl-4 pointer-events-none opacity-90 z-20">
        <div className="bg-white/20 backdrop-blur-md rounded-full py-2 px-4 text-[11px] italic text-white flex items-center gap-2">
          <span>Linh: 🌻 Chúc hai bạn đồng lòng, xây đắp tổ ấm...</span>
        </div>
        <div className="bg-white/20 backdrop-blur-md rounded-full py-2 px-4 text-[11px] italic text-white flex items-center gap-2">
          <span>Hà: Chúc mừng hạnh phúc!</span>
        </div>
        <div className="bg-white/20 backdrop-blur-md rounded-full py-2 px-4 text-[11px] italic text-white flex items-center gap-2">
          <span>Huy: Chúc hai bạn trăm năm hạnh phúc!</span>
        </div>
      </div>

      {/* BOTTOM STICKY NAV BAR (Mimicking the image) */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#8B2A34]/95 backdrop-blur-md border-t border-white/20 z-50 flex items-center justify-between px-4 md:px-8 shadow-[0_-10px_30px_rgba(0,0,0,0.2)]">
        <button className="flex items-center gap-2 bg-black/20 hover:bg-black/30 transition-colors px-4 py-2 rounded-full border border-white/10" onClick={() => document.getElementById('wishes')?.scrollIntoView({ behavior: 'smooth' })}>
          <div className="w-6 h-6 rounded-full overflow-hidden bg-white/20 flex items-center justify-center relative">
             <MessageCircle className="w-3 h-3 text-white absolute left-1 top-1" />
          </div>
          <span className="text-[11px] font-serif italic text-white/90 hidden sm:inline-block">Gửi lời chúc...</span>
        </button>
        
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3">
          <div className="text-right border-b border-white/50 pb-0.5">
            <p className="text-[9px] uppercase tracking-widest text-white/80 leading-none mb-1">Tháng {month}</p>
          </div>
          <span className="text-[40px] leading-none font-serif text-white">{day}</span>
          <div className="text-left border-b border-white/50 pb-0.5">
            <p className="text-[9px] uppercase tracking-widest text-white/80 leading-none mb-1">Năm {year}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button className="flex items-center gap-1.5 bg-black/20 hover:bg-black/30 transition-colors px-3 py-1.5 rounded-full border border-white/10">
            <Heart className="w-4 h-4 text-[#ff6b6b] fill-[#ff6b6b]" />
            <span className="text-[11px] font-serif text-white/90 hidden md:inline">Bắn tim</span>
          </button>
          {rsvpEnabled && (
            <button className="w-10 h-10 bg-[#ff6b6b] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform relative" onClick={() => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })}>
              <span className="text-[10px] font-bold">RSVP</span>
            </button>
          )}
        </div>
      </div>

      {/* OTHER SECTIONS (Styled minimally with Burgundy & White to match) */}
      <div className="border-t border-white/20 mx-4 md:mx-12"></div>

      {/* 2. PARENTS */}
      <section id="parents" className="py-24 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl text-white font-serif font-bold uppercase mb-16 tracking-widest">Gia Đình</h2>
          <ParentsSection groomParents={groomParents} brideParents={brideParents} accentColor="#F7F5F5" theme={theme} />
        </div>
      </section>

      <div className="border-t border-white/20 mx-4 md:mx-12"></div>

      {/* 3. LOVE STORY */}
      <section id="story" className="py-24 px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl text-center text-white font-serif font-bold uppercase mb-16 tracking-widest">Chuyện Tình Yêu</h2>
          <div className="space-y-16">
            {stories.map((story, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col md:flex-row items-center gap-8">
                <div className={`w-full md:w-1/2 ${idx % 2 !== 0 ? 'md:order-2' : ''}`}>
                  <div className="aspect-[4/3] border-[1.5px] border-white p-1 relative">
                    <SparklingImage accentColor={accentColor} src={story.img || WEDDING_SEED_DATA.galleryImageUrls[idx % WEDDING_SEED_DATA.galleryImageUrls.length]} fallbackSrc={WEDDING_SEED_DATA.galleryImageUrls[idx % WEDDING_SEED_DATA.galleryImageUrls.length]} alt={story.title} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="w-full md:w-1/2 text-center md:text-left">
                  <span className="inline-block text-white/70 text-xs tracking-widest uppercase mb-2 border-b border-white/30 pb-1">{story.date}</span>
                  <h3 className="text-2xl text-white font-serif font-bold mb-4">{story.title}</h3>
                  <p className="text-sm text-white/90 leading-relaxed font-serif">{story.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-white/20 mx-4 md:mx-12"></div>

      {/* 4. GALLERY */}
      <section id="gallery" className="py-24 px-4 relative z-10">
         <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-2xl md:text-3xl text-white font-serif font-bold uppercase tracking-widest mb-4">Album Hình Cưới</h2>
          <p className="font-serif text-sm text-white/80">Khoảnh khắc đáng nhớ của chúng tôi</p>
        </div>
        <div className="max-w-6xl mx-auto px-4">
          <TraditionalGallery images={displayImages} accentColor="#F7F5F5" />
        </div>
      </section>

      <div className="border-t border-white/20 mx-4 md:mx-12"></div>

      {/* 5. GIFT */}
      <BankRegistrySection groomBank={groomBank} brideBank={brideBank} accentColor="#F7F5F5" theme={theme} />

      {/* 5.5 DRESS CODE */}
      <section className="py-20 px-4 relative z-10 bg-[#76232C] border-t border-white/10">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] mb-3 text-[#FFD700]/80 font-serif">Dress Code</p>
          <h2 className="text-2xl md:text-3xl text-white font-serif font-bold uppercase mb-10 tracking-widest">Trang Phục Gợi Ý</h2>
          <div className="flex justify-center gap-6 sm:gap-8 flex-wrap">
            {[
              { color: '#8B0000', border: '#FFD700', label: 'Đỏ truyền thống' },
              { color: '#FFD700', border: '#FFF8DC', label: 'Vàng ánh kim' },
              { color: '#FFF8DC', border: '#D2B48C', label: 'Kem nhạt' },
              { color: '#FFB6C1', border: '#FF69B4', label: 'Hồng phấn' },
            ].map(({ color, border, label }) => (
              <div key={label} className="flex flex-col items-center gap-3">
                <div
                  className="w-14 h-14 rounded-full shadow-lg transition-transform hover:scale-110"
                  style={{ backgroundColor: color, border: `2px solid ${border}` }}
                />
                <span className="text-[10px] uppercase tracking-widest text-white/80 font-serif">{label}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs font-serif italic text-white/70">Kính mời Quý khách diện trang phục lịch thiệp theo tông màu gợi ý.</p>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="py-24 px-4 relative z-10 bg-[#7F2630]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl text-center text-white font-serif font-bold uppercase mb-12 tracking-widest">Thông Tin Cần Biết</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-white/30">
                <button className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none hover:bg-white/5 transition-colors"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                >
                  <span className="font-bold font-serif text-base md:text-lg text-white">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-white transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-6 pb-6 text-sm md:text-base font-serif text-white/80 leading-relaxed overflow-hidden">
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. RSVP */}
      {rsvpEnabled && (
        <section id="rsvp" className="py-24 px-4 relative z-10 border-t border-white/20">
          <div className="max-w-xl mx-auto text-center border-[1.5px] border-white p-8 md:p-12 bg-white/5 backdrop-blur-sm">
            <h2 className="text-3xl text-white font-serif font-bold uppercase mb-4 tracking-widest">RSVP</h2>
            <p className="text-xs font-serif uppercase tracking-widest text-white/70 mb-10">Xác nhận tham dự trước ngày 20/{month}/{year}</p>
            <div className="text-left text-black">
              {/* Force RSVP section text to be dark since it uses default inputs/text colors sometimes */}
              <RSVPSection accentColor="#8B2A34" theme={theme} sectionBg="transparent" embedded />
            </div>
          </div>
        </section>
      )}

      {/* 8. WISHES */}
      {wishesEnabled && (
        <div id="wishes" className="py-24 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl text-center text-white font-serif font-bold uppercase mb-12 tracking-widest">Sổ Lưu Bút</h2>
            <div className="bg-white/5 p-6 border-[1.5px] border-white/20 text-white">
              <TraditionalWishes publicSlug={publicSlug} accentColor="#F7F5F5" theme={theme} />
            </div>
          </div>
        </div>
      )}

      {/* 9. FOOTER */}
      <footer className="py-16 px-4 text-center border-t border-white/20 mb-16">
        <h2 className="text-2xl md:text-3xl mb-4 text-white font-serif font-bold uppercase tracking-widest">{groomName} & {brideName}</h2>
        <p className="font-serif text-xs tracking-widest text-white/50 uppercase mb-8">{day} . {month} . {year}</p>
        <p className="font-sans text-[10px] tracking-widest uppercase text-white/30">Cảm ơn bạn đã là một phần trong ngày vui của chúng tôi.</p>
        <p className="font-sans text-[10px] tracking-widest uppercase text-white/30 mt-2">Thiết kế tinh giản, sang trọng.</p>
      </footer>
    </motion.div>
  );
};

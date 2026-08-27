import { useState } from "react";
import { SparklingImage } from "@/components/wedding/SparklingImage";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { WEDDING_SEED_DATA } from "@/data/seedData";
import { RSVPSection } from "@/components/wedding/RSVPSection";
import KoreanWishes from "./KoreanWishes";
import { BankRegistrySection } from "@/components/wedding/sections/BankRegistrySection";
import { themes } from "@/data/themes";
import { koreanTheme } from "@/features/templates/catalog/korean/theme";
import ParentsSection from "@/components/wedding/sections/ParentsSection";
import GalleryDispatcher from "@/components/galleries/GalleryDispatcher";
import { useCountdown } from "@/hooks/useCountdown";
import type { TemplateProps } from "@/features/template/components/types";

export const KoreanTemplate = ({
 groomName = WEDDING_SEED_DATA.groomName,
 brideName = WEDDING_SEED_DATA.brideName,
 date = WEDDING_SEED_DATA.date,
 time = WEDDING_SEED_DATA.time,
 venue = WEDDING_SEED_DATA.venue,
 address = WEDDING_SEED_DATA.address,
 message = WEDDING_SEED_DATA.message,
 accentColor = "#AEC6CF", // Soft pastel baby blue
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
 theme = themes.korean,
}: TemplateProps) => {
 const { days, hours, minutes, seconds } = useCountdown(date, time);
 const displayImages = galleryImageUrls.length > 0 ? galleryImageUrls : WEDDING_SEED_DATA.galleryImageUrls;
 const faqs = WEDDING_SEED_DATA.faqs;
 const dressCodeColors = ["#FDFBF7", "#EFEAE1", "#AEC6CF", "#FFDAB9"]; // Cream, Beige, Baby Blue, Peach

 const [activeFaq, setActiveFaq] = useState<number | null>(null);

 return (
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
 className="font-sans text-[#5A514B] bg-[#FDFBF7] relative font-light tracking-wide selection:bg-[#AEC6CF]/30"
 >
 {/* 2. HERO */}
 <section id="hero" className="relative min-h-[90svh] flex flex-col items-center justify-center py-20 px-6 text-center">
 <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, type: "spring", bounce: 0.4 }} className="flex flex-col items-center max-w-2xl w-full">
 <div className="w-full aspect-[4/5] @md:aspect-[16/9] mb-12 rounded-3xl overflow-hidden bg-[#EFEAE1] shadow-sm">
 <SparklingImage accentColor={accentColor} src={coverImageUrl} alt="Couple" className="w-full h-full object-cover filter brightness-[1.05] contrast-95 saturate-[0.8]" />
 </div>
 <h1 className="text-4xl @md:text-5xl font-light mb-6 tracking-widest">{groomName} <span className="text-[#AEC6CF] mx-2">|</span> {brideName}</h1>
 <p className="text-sm tracking-[0.2em] text-[#8C837C] uppercase font-medium">{date.split("-").reverse().join(" . ")}</p>
 </motion.div>
 </section>

 {/* 3. COUNTDOWN */}
 <section className="py-24 px-6 relative">
 <div className="max-w-3xl mx-auto">
 <div className="grid grid-cols-4 border-y border-[#8C837C]/20 py-10 rounded-2xl bg-[#FDFBF7] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
 {[
 { label: "NGÀY", value: days },
 { label: "GIỜ", value: hours },
 { label: "PHÚT", value: minutes },
 { label: "GIÂY", value: seconds },
 ].map((item, idx) => (
 <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", bounce: 0.5 }} key={idx} className={`flex flex-col items-center justify-center ${idx !== 3 ? 'border-r border-[#8C837C]/10' : ''}`}>
 <span className="text-2xl @md:text-4xl font-light mb-2 text-[#AEC6CF]">{String(item.value).padStart(2, "0")}</span>
 <span className="text-[10px] tracking-[0.2em] text-[#8C837C]">{item.label}</span>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* 4. LOVE STORY */}
 <section id="story" className="py-24 px-6 max-w-4xl mx-auto">
 <div className="text-center mb-20">
 <p className="text-[10px] tracking-[0.3em] uppercase text-[#8C837C] mb-4">Câu Chuyện Tình Yêu</p>
 <div className="w-[1px] h-8 bg-[#AEC6CF] mx-auto" />
 </div>
 <div className="space-y-16">
 {stories.map((story, idx) => (
 <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring", bounce: 0.4 }}
 className={`flex flex-col ${idx % 2 === 1 ? '@md:flex-row-reverse' : '@md:flex-row'} items-center gap-10 @md:gap-20`}
 >
 <div className="w-full @md:w-1/2">
 <div className="w-full aspect-[4/5] bg-[#EFEAE1] rounded-3xl overflow-hidden shadow-sm">
 <SparklingImage accentColor={accentColor} src={story.img} alt={story.title} className="w-full h-full object-cover filter brightness-[1.05] contrast-95 saturate-[0.8]" />
 </div>
 </div>
 <div className={`w-full @md:w-1/2 text-center @md:text-left ${idx % 2 === 1 ? '@md:text-right' : ''}`}>
 <p className="text-[10px] tracking-[0.2em] text-[#8C837C] uppercase mb-4">{story.date}</p>
 <h3 className="text-2xl font-light tracking-wide mb-6">{story.title}</h3>
 <p className="text-sm text-[#8C837C] leading-loose">{story.text}</p>
 </div>
 </motion.div>
 ))}
 </div>
 </section>

 {/* 5. COUPLE */}
 <section className="py-32 px-6 bg-[#EFEAE1]/30 rounded-[3rem] mx-4 @md:mx-8">
 <div className="max-w-4xl mx-auto">
 <div className="text-center mb-20">
 <p className="text-[10px] tracking-[0.3em] uppercase text-[#8C837C] mb-4">Cô Dâu & Chú Rể</p>
 <div className="w-[1px] h-8 bg-[#AEC6CF] mx-auto" />
 </div>
 <div className="grid @md:grid-cols-2 gap-12 @md:gap-20">
 <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", bounce: 0.4 }} className="flex flex-col items-center">
 <div className="w-full max-w-[280px] aspect-[3/4] rounded-3xl overflow-hidden mb-8 bg-[#EFEAE1] shadow-md border-4 border-white">
 <SparklingImage accentColor={accentColor} src={coverImageUrl} alt="Groom" className="w-full h-full object-cover filter brightness-[1.05] contrast-95 saturate-[0.8]" />
 </div>
 <p className="text-[10px] tracking-[0.3em] uppercase text-[#8C837C] mb-2">Chú Rể</p>
 <h3 className="text-2xl font-light tracking-widest">{groomName}</h3>
 </motion.div>
 <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", bounce: 0.4, delay: 0.2 }} className="flex flex-col items-center @md:mt-24">
 <div className="w-full max-w-[280px] aspect-[3/4] rounded-3xl overflow-hidden mb-8 bg-[#EFEAE1] shadow-md border-4 border-white">
 <SparklingImage accentColor={accentColor} src={displayImages[0] || coverImageUrl} alt="bride" className="w-full h-full object-cover filter brightness-[1.05] contrast-95 saturate-[0.8]" />
 </div>
 <p className="text-[10px] tracking-[0.3em] uppercase text-[#8C837C] mb-2">Cô Dâu</p>
 <h3 className="text-2xl font-light tracking-widest">{brideName}</h3>
 </motion.div>
 </div>
 <div className="mt-24 text-center max-w-lg mx-auto bg-white p-8 rounded-3xl shadow-sm border border-[#AEC6CF]/20">
 <p className="text-sm text-[#8C837C] leading-loose tracking-wide">"{message}"</p>
 </div>
 </div>
 </section>

 {/* 5. PARENTS */}
 <section id="parents" className="py-32 px-6 bg-[#FDFBF7]">
   <ParentsSection groomParents={groomParents} brideParents={brideParents} accentColor={accentColor} theme={theme} />
 </section>

 {/* 6. EVENTS */}
 <section id="events" className="py-32 px-6">
 <div className="max-w-4xl mx-auto">
 <div className="text-center mb-20">
 <p className="text-[10px] tracking-[0.3em] uppercase text-[#8C837C] mb-4">Chi Tiết Lễ Cưới</p>
 <div className="w-[1px] h-8 bg-[#FFDAB9] mx-auto" />
 </div>
 <div className="grid @md:grid-cols-2 gap-x-20 gap-y-12">
 <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring", bounce: 0.4 }} className="text-center bg-white p-10 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#AEC6CF]/10 hover:shadow-lg transition-shadow">
 <h3 className="text-xl font-light tracking-widest uppercase mb-8 border-b border-[#AEC6CF]/30 pb-6 inline-block text-[#AEC6CF]">Lễ Thành Hôn</h3>
 <div className="space-y-6">
 <div>
 <p className="text-[10px] tracking-[0.2em] text-[#8C837C] uppercase mb-1">Ngày</p>
 <p className="text-sm font-medium tracking-widest">{date.split("-").reverse().join(" . ")}</p>
 </div>
 <div>
 <p className="text-[10px] tracking-[0.2em] text-[#8C837C] uppercase mb-1">Thời gian</p>
 <p className="text-sm font-medium tracking-widest">{time}</p>
 </div>
 <div>
 <p className="text-[10px] tracking-[0.2em] text-[#8C837C] uppercase mb-1">Địa điểm</p>
 <p className="text-base font-medium tracking-wide mb-1">{venue}</p>
 <p className="text-[11px] text-[#8C837C] leading-relaxed max-w-[200px] mx-auto">{address}</p>
 </div>
 <div className="pt-6">
 <a href={`https://maps.google.com/?q=${venue} ${address}`} target="_blank" rel="noreferrer" className="inline-block py-3 px-8 bg-[#AEC6CF]/10 text-[10px] uppercase tracking-[0.2em] text-[#AEC6CF] hover:bg-[#AEC6CF] hover:text-white transition-colors rounded-full font-medium">Bản đồ</a>
 </div>
 </div>
 </motion.div>

 <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring", bounce: 0.4, delay: 0.1 }} className="text-center bg-white p-10 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#FFDAB9]/20 hover:shadow-lg transition-shadow">
 <h3 className="text-xl font-light tracking-widest uppercase mb-8 border-b border-[#FFDAB9]/50 pb-6 inline-block text-[#FFDAB9]">Tiệc Cưới</h3>
 <div className="space-y-6">
 <div>
 <p className="text-[10px] tracking-[0.2em] text-[#8C837C] uppercase mb-1">Ngày</p>
 <p className="text-sm font-medium tracking-widest">{date.split("-").reverse().join(" . ")}</p>
 </div>
 <div>
 <p className="text-[10px] tracking-[0.2em] text-[#8C837C] uppercase mb-1">Thời gian</p>
 <p className="text-sm font-medium tracking-widest">18:00</p>
 </div>
 <div>
 <p className="text-[10px] tracking-[0.2em] text-[#8C837C] uppercase mb-1">Địa điểm</p>
 <p className="text-base font-medium tracking-wide mb-1">{venue}</p>
 <p className="text-[11px] text-[#8C837C] leading-relaxed max-w-[200px] mx-auto">{address}</p>
 </div>
 <div className="pt-6">
 <a href={`https://maps.google.com/?q=${venue} ${address}`} target="_blank" rel="noreferrer" className="inline-block py-3 px-8 bg-[#FFDAB9]/20 text-[10px] uppercase tracking-[0.2em] text-[#E5A87B] hover:bg-[#FFDAB9] hover:text-white transition-colors rounded-full font-medium">Bản đồ</a>
 </div>
 </div>
 </motion.div>
 </div>
 </div>
 </section>

 {/* 7. GALLERY */}
 <section id="gallery" className="relative z-10 w-full bg-transparent overflow-hidden py-10">
        <GalleryDispatcher theme={themes.korean} accentColor={accentColor} images={displayImages} />
 </section>

 {/* 8. GIFT */}
 <BankRegistrySection groomBank={groomBank} brideBank={brideBank} accentColor={accentColor} theme={theme} />

 {/* 9. DRESS CODE */}
 <section className="py-24 px-6 bg-[#EFEAE1]/30 rounded-[3rem] mx-4 @md:mx-8 mb-20">
 <div className="max-w-3xl mx-auto text-center">
 <p className="text-[10px] tracking-[0.3em] uppercase text-[#8C837C] mb-4">Trang Phục Tham Dự</p>
 <div className="w-[1px] h-8 bg-[#AEC6CF] mx-auto mb-12" />
 <p className="text-xs text-[#8C837C] mb-12 tracking-widest uppercase font-medium">Tông màu Trung tính & Pastel</p>
 <div className="flex flex-wrap justify-center gap-8">
 {dressCodeColors.map((color, idx) => (
 <motion.div whileHover={{ scale: 1.1, y: -5 }} transition={{ type: "spring", bounce: 0.5 }} key={idx} className="flex flex-col items-center">
 <div className="w-16 h-16 rounded-2xl mb-3 shadow-md" style={{ backgroundColor: color, border: color === '#FDFBF7' ? '2px solid #EFEAE1' : 'none' }} />
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* 10. FAQ */}
 <section className="py-20 px-6">
 <div className="max-w-2xl mx-auto bg-white p-8 @md:p-12 rounded-3xl shadow-sm border border-[#AEC6CF]/10">
 <div className="text-center mb-16">
 <p className="text-[10px] tracking-[0.3em] uppercase text-[#AEC6CF] mb-4 font-medium">Thông Tin Cần Biết</p>
 <div className="w-[1px] h-8 bg-[#FFDAB9] mx-auto" />
 </div>
 <div className="space-y-4">
 {faqs.map((faq, idx) => (
 <div key={idx} className="border-b border-[#8C837C]/10 last:border-0">
 <button className="w-full py-6 flex items-center justify-between text-left focus:outline-none"
 onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
 >
 <span className="text-sm tracking-wide font-medium">{faq.q}</span>
 <ChevronDown className={`w-4 h-4 text-[#AEC6CF] transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} />
 </button>
 <AnimatePresence>
 {activeFaq === idx && (
 <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pb-6 text-xs text-[#8C837C] leading-loose tracking-wide">
 {faq.a}
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* 11. RSVP */}
 {rsvpEnabled && (
 <section id="rsvp" className="py-32 px-6">
 <div className="max-w-3xl mx-auto text-center">
 <div className="mb-16">
 <p className="text-[10px] tracking-[0.3em] uppercase text-[#8C837C] mb-4">Xác Nhận Tham Dự</p>
 <div className="w-[1px] h-8 bg-[#AEC6CF] mx-auto" />
 </div>
 <p className="text-xs text-[#8C837C] tracking-widest uppercase mb-12">Vui lòng xác nhận trước ngày {date.split("-").reverse().join(" . ")}</p>
 <div className="text-left bg-white p-8 @md:p-12 rounded-[2rem] shadow-[0_10px_40px_rgba(174,198,207,0.15)] border border-[#AEC6CF]/20">
 <RSVPSection accentColor="#AEC6CF" theme={theme} sectionBg="transparent" embedded />
 </div>
 </div>
 </section>
 )}

 {/* 12. WISHES */}
 {wishesEnabled && (
 <KoreanWishes publicSlug={publicSlug} accentColor={accentColor} />
 )}

 {/* 13. FOOTER */}
 <footer className="py-20 px-6 text-center border-t border-[#AEC6CF]/20 bg-[#FDFBF7]">
 <h2 className="text-lg font-light tracking-widest uppercase mb-6 text-[#AEC6CF]">{groomName} & {brideName}</h2>
 <p className="text-[10px] tracking-[0.3em] uppercase text-[#8C837C]">{date.split("-").reverse().join(" . ")}</p>
 </footer>
 </motion.div>
 );
};

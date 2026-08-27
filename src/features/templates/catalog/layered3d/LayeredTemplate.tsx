import { lazy, Suspense, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, CalendarDays, ChevronDown, Heart, MapPin, Sparkles } from "lucide-react";
import { SparklingImage } from "@/components/wedding/SparklingImage";
import { Layered3DWishes } from "./Layered3DWishes";
import { BankRegistrySection } from "@/components/wedding/sections/BankRegistrySection";
import ParentsSection from "@/components/wedding/sections/ParentsSection";
import TimelineSection from "@/components/wedding/sections/TimelineSection";
import GalleryDispatcher from "@/components/galleries/GalleryDispatcher";
import { RSVPSection } from "@/components/wedding/RSVPSection";
import { useCountdown } from "@/hooks/useCountdown";
import { copyToClipboard } from "@/lib/clipboard";
import { WEDDING_SEED_DATA } from "@/data/seedData";
import { themes } from "@/data/themes";
import type { TemplateProps } from "@/features/template/components/types";

const LayeredWeddingScene = lazy(() => import("@/components/wedding/LayeredWeddingScene"));

export const LayeredTemplate = ({
  groomName = "Minh Anh",
  brideName = "Thanh Ha",
  date = "2027-02-14",
  time = "17:30",
  venue = "White Palace Convention Center",
  address = "123 Nguyen Hue Street, District 1, Ho Chi Minh City",
  message = "Cảm ơn bạn đã đến chung vui cùng chúng tôi!",
  accentColor = "#2E5A2E",
  publicSlug,
  rsvpEnabled = true,
  wishesEnabled = true,
  galleryImageUrls = [],
  coverImageUrl = WEDDING_SEED_DATA.coverImageUrl,
  groomBank,
  brideBank,
  stories = WEDDING_SEED_DATA.stories,
  groomParents,
  brideParents,
  schedule,
  theme,
}: TemplateProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const { days, hours, minutes, seconds } = useCountdown(date, time);
  
  // For Giant Cinematic Quote
  const quoteRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: quoteRef,
    offset: ["start 90%", "end 30%"]
  });
  const quoteOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const quoteScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.1]);
  const quoteBlur = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], ["blur(20px)", "blur(0px)", "blur(0px)", "blur(20px)"]);

  const displayImages = galleryImageUrls.length > 0 
    ? galleryImageUrls 
    : WEDDING_SEED_DATA.galleryImageUrls;
  const heroImage = coverImageUrl || displayImages[0];
  const sceneImages = [heroImage, ...displayImages].filter(Boolean).slice(0, 3);

  const layeredMessage = message === WEDDING_SEED_DATA.message
    ? "Tình yêu như một bức tranh đa chiều, càng nhìn sâu càng thấy nhiều điều kì diệu. Ngày chung đôi là lát cắt đẹp nhất mà chúng tôi muốn chia sẻ cùng bạn."
    : message;

  const handleCopy = (text: string, index: number) => {
    copyToClipboard(text, "Đã sao chép số tài khoản!");
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const faqItems = WEDDING_SEED_DATA.faqs;

  return (
    <div className="font-serif antialiased text-[#243326] bg-[#f6f1e7] overflow-hidden selection:bg-[#d5ebd5] selection:text-[#193a19] [perspective:2000px]">
      {/* 1. THREE-DIMENSIONAL HERO */}
      <section id="hero" className="relative min-h-[100svh] overflow-hidden bg-[radial-gradient(circle_at_50%_35%,#fffdf8_0%,#ece3d2_72%,#dce4d6_100%)] [transform-style:preserve-3d]">
        <Suspense
          fallback={(
            <div className="absolute inset-0 grid place-items-center overflow-hidden">
              <img src={heroImage} alt="" className="h-full w-full object-cover opacity-70" />
            </div>
          )}
        >
          <LayeredWeddingScene images={sceneImages} accentColor={accentColor} />
        </Suspense>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#f8f4ec]/55 via-transparent to-[#16271d]/85 translate-z-10" />
        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-between px-5 pb-10 pt-24 @md:px-10 @md:pb-14 translate-z-20">
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between gap-4 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#2e5a2e]">
            <span className="inline-flex items-center gap-2"><Sparkles className="h-3.5 w-3.5" /> Phiên bản đa tầng</span>
            <span>{date.split("-").reverse().join(" · ")}</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.9 }} className="pointer-events-none mx-auto mt-auto w-full max-w-4xl text-center text-white">
            <p className="mb-4 font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[#dfe8d6] drop-shadow-lg">Câu chuyện trong không gian ba chiều</p>
            <h1 className="font-display text-5xl font-medium leading-[0.9] drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)] @md:text-7xl @lg:text-8xl">
              {groomName}<span className="block py-2 text-2xl font-light italic text-[#cfb982]">và</span>{brideName}
            </h1>
            <div className="mx-auto mt-7 flex max-w-xl items-center justify-center gap-4 border-y border-white/20 py-4 font-sans text-xs uppercase tracking-[0.14em] text-white/80 drop-shadow-md">
              <span>{time}</span><i className="h-1 w-1 rounded-full bg-[#cfb982]" /><span>{venue}</span>
            </div>
          </motion.div>

          <a href="#story" className="mx-auto mt-7 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md shadow-2xl" aria-label="Xem thêm">
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </a>
        </div>
      </section>

      {/* GIANT CINEMATIC QUOTE */}
      <section ref={quoteRef} className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#16271d] px-5 py-24 @md:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#2e5a2e_0%,transparent_60%)] opacity-20" />
        <motion.div 
          style={{ opacity: quoteOpacity, scale: quoteScale, filter: quoteBlur }}
          className="relative z-10 text-center"
        >
          <p className="font-sans text-xs font-bold uppercase tracking-[0.4em] text-[#cfb982] drop-shadow-md">Một chương mới bắt đầu</p>
          <h2 className="mt-6 font-display text-[clamp(2.5rem,7vw,6rem)] font-light leading-[1.1] text-[#f8f5ee] drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            "Không gian có ba chiều, <br/> 
            <span className="italic text-[#cfb982]">nhưng tình yêu của chúng ta</span> <br/> 
            là chiều thứ tư."
          </h2>
        </motion.div>
      </section>

      {/* 2. FLOATING COUNTDOWN */}
      <section className="relative overflow-hidden bg-[#16271d] px-5 py-20 text-[#f8f5ee] @md:px-10 @md:py-28 [transform-style:preserve-3d]">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(#cfb982_0.8px,transparent_0.8px)] [background-size:22px_22px]" />
        <div className="relative mx-auto max-w-6xl translate-z-10">
          <div className="mb-10 flex flex-col justify-between gap-3 @md:flex-row @md:items-end">
            <div>
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#cfb982]">Chờ đợi ngày chung đôi</p>
              <h2 className="mt-2 font-display text-3xl font-normal @md:text-5xl drop-shadow-xl">Ngày chung đôi đã đến gần</h2>
            </div>
            <p className="font-sans text-xs uppercase tracking-[0.14em] text-white/55">Thời gian trôi, tình yêu ở lại</p>
          </div>
          <div className="grid grid-cols-2 gap-3 @md:grid-cols-4 @md:gap-5 [perspective:1000px]">
            {[
              { label: "Ngày", value: days },
              { label: "Giờ", value: hours },
              { label: "Phút", value: minutes },
              { label: "Giây", value: seconds },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, rotateX: -20, y: 40 }}
                whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8, type: "spring" }}
                className="relative min-h-36 overflow-hidden border border-white/12 bg-white/[0.06] p-5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md @md:min-h-44 @md:p-7"
                style={{ transform: `translateZ(${(index % 2 ? 40 : 20) + 10}px)` }}
              >
                <span className="font-display text-5xl text-[#e5d5a9] @md:text-6xl drop-shadow-md">{String(item.value).padStart(2, "0")}</span>
                <span className="absolute bottom-5 left-5 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 @md:bottom-7 @md:left-7">{item.label}</span>
                <span className="absolute right-0 top-0 h-10 w-10 border-b border-l border-[#cfb982]/30" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. LAYERED LOVE STORY */}
      <section id="story" className="relative bg-[#f6f1e7] px-5 py-24 @md:px-10 @md:py-32 [transform-style:preserve-3d] overflow-hidden">
        {/* Floating Ambient Lights */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden translate-z-[-50px]">
          <motion.div 
            className="absolute left-[5%] top-[10%] h-96 w-96 rounded-full bg-[#cfb982] opacity-[0.15] blur-[100px]"
            animate={{ y: [-30, 30, -30], x: [-20, 20, -20] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute right-[5%] top-[60%] h-[500px] w-[500px] rounded-full bg-[#789174] opacity-[0.12] blur-[120px]"
            animate={{ y: [40, -40, 40], x: [30, -30, 30] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <div className="mx-auto max-w-6xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="mx-auto mb-16 max-w-2xl text-center @md:mb-24 translate-z-10">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#6f886d]">Chiều sâu của ký ức</p>
            <h2 className="mt-3 font-display text-4xl font-normal text-[#193a2a] @md:text-6xl drop-shadow-lg">Từng tầng câu chuyện</h2>
            <p className="mt-5 text-base leading-8 text-[#5b665d]">{layeredMessage}</p>
          </motion.div>

          <div className="space-y-24 @md:space-y-32">
            {stories.slice(0, 3).map((story, index) => (
              <motion.article
                key={`${story.title}-${index}`}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                className={`grid items-center gap-10 @md:grid-cols-12 @md:gap-14 [transform-style:preserve-3d]`}
                style={{ transform: `translateZ(${index * 15}px)` }}
              >
                <div className={`relative @md:col-span-7 ${index % 2 ? "@md:order-2" : ""} [perspective:1500px]`}>
                  <div className="absolute inset-5 translate-x-6 translate-y-6 rotate-6 border border-[#789174]/30 bg-[#dbe3d4] shadow-2xl" style={{ transform: 'translateZ(-20px)' }} />
                  <div className="absolute inset-5 -translate-x-4 -translate-y-4 -rotate-3 border border-[#cfb982]/35 bg-[#eee3cb] shadow-xl" style={{ transform: 'translateZ(-10px)' }} />
                  <motion.div whileHover={{ rotateY: index % 2 ? -12 : 12, rotateX: -12, scale: 1.08, z: 80 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="relative aspect-[4/3] overflow-hidden border-[12px] border-[#fffdf8] shadow-[0_45px_100px_-30px_rgba(25,58,42,0.6)] [transform-style:preserve-3d] cursor-pointer">
                    <SparklingImage accentColor={accentColor} src={story.img || displayImages[index % displayImages.length]} alt={story.title} className="h-full w-full object-cover transition-transform duration-700 hover:scale-110" />
                    {/* Glass glare effect on hover */}
                    <motion.div 
                      className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0"
                      whileHover={{ opacity: 1, x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                  </motion.div>
                </div>
                <div className={`@md:col-span-5 ${index % 2 ? "@md:order-1 @md:text-right" : ""} translate-z-20`}>
                  <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#789174]">0{index + 1} · {story.date}</span>
                  <h3 className="mt-3 font-display text-3xl font-normal text-[#193a2a] drop-shadow-md @md:text-4xl">{story.title}</h3>
                  <p className="mt-5 text-sm leading-7 text-[#647067] @md:text-base">{story.text}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* PARENTS SECTION */}
      <div className="relative bg-[#f6f1e7] pb-10">
        <ParentsSection groomParents={groomParents} brideParents={brideParents} accentColor={accentColor} theme={theme} />
      </div>

      {/* 4. EVENT DETAILS */}
      <section id="events" className="relative overflow-hidden bg-[#e7e0d1] px-5 py-24 @md:px-10 @md:py-32 [transform-style:preserve-3d]">
        {/* Floating Ambient Lights */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden translate-z-[-30px]">
          <motion.div 
            className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#cfb982] opacity-[0.15] blur-[120px]"
            animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.2, 0.15] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <div className="mx-auto grid max-w-6xl gap-8 @lg:grid-cols-12 @lg:items-stretch relative z-10">
          <div className="relative min-h-80 overflow-hidden @lg:col-span-5 rounded-xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] translate-z-20">
            <SparklingImage accentColor={accentColor} src={displayImages[1] || heroImage} alt={venue} className="absolute inset-0 h-full w-full object-cover hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#13241a]/90 via-[#13241a]/20 to-transparent" />
            <p className="absolute bottom-6 left-6 right-6 font-display text-3xl text-white drop-shadow-lg">Một ngày, một nơi, một cuộc hẹn</p>
          </div>
          <div className="relative border border-[#789174]/25 bg-[#fbf8f1]/90 p-7 shadow-[25px_25px_0_#cfd7c8,0_30px_60px_-15px_rgba(0,0,0,0.3)] @md:p-12 @lg:col-span-7 translate-z-10 rounded-lg">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#789174]">Chi tiết lễ cưới</p>
            <h2 className="mt-3 font-display text-4xl text-[#193a2a] @md:text-5xl drop-shadow-sm">Cuộc hẹn lớn</h2>
            <div className="mt-10 space-y-7">
              <div className="flex items-start gap-4 border-b border-[#789174]/20 pb-7">
                <CalendarDays className="mt-1 h-5 w-5 shrink-0 text-[#789174]" />
                <div><p className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#6b766d]">Thời gian</p><p className="mt-2 text-xl text-[#193a2a] drop-shadow-sm">{time} · {date.split("-").reverse().join(" / ")}</p></div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#789174]" />
                <div><p className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#6b766d]">Địa điểm</p><p className="mt-2 text-xl text-[#193a2a] drop-shadow-sm">{venue}</p><p className="mt-2 font-sans text-sm leading-6 text-[#6b766d]">{address}</p></div>
              </div>
            </div>
            <a href={`https://maps.google.com/?q=${venue} ${address}`} target="_blank" rel="noreferrer" className="mt-9 inline-flex min-h-11 items-center gap-2 bg-[#254b32] px-6 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#173522] shadow-[0_10px_20px_rgba(37,75,50,0.3)] hover:-translate-y-1">
              <MapPin className="h-4 w-4" /> Chỉ đường
            </a>
          </div>
        </div>
      </section>

      {/* TIMELINE SECTION */}
      <div className="relative bg-[#e7e0d1]">
        <TimelineSection schedule={schedule} accentColor={accentColor} theme={theme} />
      </div>

      {/* 5. ORGANIC GALLERY */}
      <section id="gallery" className="relative z-10 w-full overflow-hidden bg-[#f8f5ee] shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
        <GalleryDispatcher theme={themes.layered3d} accentColor={accentColor} images={displayImages} />
      </section>

      {/* 6. GIFT SECTION */}
      <BankRegistrySection groomBank={groomBank} brideBank={brideBank} accentColor={accentColor} theme={theme} />

      {/* 8. DRESS CODE - Palette circles with organic leaf layout */}
      <section className="py-24 px-6 bg-[#fcfbfa]">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-[#558155] font-bold">Trang Phục</h2>
            <h3 className="text-3xl font-normal text-[#193a19]">Gợi ý trang phục</h3>
            <div className="w-12 h-[1px] bg-[#8eb08e] mx-auto mt-4"></div>
          </div>
          <p className="text-sm font-light text-neutral-600 leading-relaxed">
            Chúng tôi rất mong muốn lưu giữ những bức ảnh đẹp và hài hòa về màu sắc. Vui lòng chọn trang phục theo các tông màu gợi ý sau:
          </p>
          <div className="flex justify-center gap-6 py-4">
            {[
              { color: "#F0E6D2", name: "Be" },
              { color: "#E0D7C6", name: "Kem" },
              { color: "#8E9B8A", name: "Xanh lá nhạt" },
              { color: "#2E3A2E", name: "Xanh rừng" }
            ].map((palette, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div 
                  className="w-12 h-12 rounded-full border border-neutral-200/50 cursor-pointer transition transform hover:scale-110 shadow-lg"
                  style={{ backgroundColor: palette.color }}
                />
                <span className="text-[9px] text-[#558155] uppercase tracking-wider font-semibold drop-shadow-sm">{palette.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ - Paper folder style accordion */}
      <section className="py-24 px-6 bg-[#f0ebd8]/30">
        <div className="max-w-2xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-[#558155] font-bold">THÔNG TIN</h2>
            <h3 className="text-3xl font-normal text-[#193a19] drop-shadow-sm">Câu hỏi thường gặp</h3>
            <div className="w-12 h-[1px] bg-[#8eb08e] mx-auto mt-4"></div>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, idx) => {
              const isOpen = faqOpen === idx;
              return (
                <div key={idx} className="bg-[#fcfbfa] border border-[#e8ebd8] rounded-2xl overflow-hidden shadow-[0_12px_24px_rgba(46,90,46,0.08)] transition-all">
                  <button 
                    onClick={() => setFaqOpen(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-medium text-[#193a19] hover:text-[#2e5a2e] focus:outline-none"
                  >
                    <span className="text-sm @sm:text-base">{item.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#8eb08e] transition-transform duration-300 ${isOpen ? "transform rotate-180" : ""}`} />
                  </button>
                  <div 
                    className="transition-all duration-300 overflow-hidden"
                    style={{ maxHeight: isOpen ? "200px" : "0px" }}
                  >
                    <div className="px-6 pb-5 pt-1 text-xs @sm:text-sm font-light text-neutral-600 leading-relaxed border-t border-[#f0ebd8]">
                      {item.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. RSVP SECTION - Enclosed in layered card */}
      
      {rsvpEnabled && (
        <section id="rsvp" className="py-24 px-6 bg-[#fcfbfa] relative z-10 border-b border-[#e8ebd8] [perspective:1500px]">
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#fcfbfa] p-8 @sm:p-12 rounded-3xl border-2 border-[#e2edd9] shadow-[0_40px_80px_rgba(46,90,46,0.15)] relative overflow-hidden transform-style-3d translate-z-20">
              {/* Inner leaf frame stamp */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#8eb08e]" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#8eb08e]" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[#8eb08e]" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#8eb08e]" />
              
              <RSVPSection accentColor={accentColor} theme={theme} embedded />
            </div>
          </div>
        </section>
      )}

      {/* Wishes wall if enabled */}
      {wishesEnabled && (
        <Layered3DWishes publicSlug={publicSlug} accentColor={accentColor} theme={theme} />
      )}

      {/* 11. FOOTER - Thank you section */}
      <footer className="py-20 px-6 bg-[#1a2f1a] text-white text-center space-y-6">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mx-auto shadow-lg">
          <Heart className="w-5 h-5 text-red-400 fill-red-400" />
        </div>
        <h4 className="text-lg tracking-widest text-[#d8e0ce] font-light uppercase">Trân trọng cảm ơn sự hiện diện của bạn</h4>
        <p className="text-4xl font-normal text-[#fcfbfa] leading-tight drop-shadow-md">
          {groomName} &amp; {brideName}
        </p>
        <p className="text-[10px] tracking-widest text-[#8eb08e] uppercase font-bold">{date.split("-").reverse().join(" / ")}</p>
        <div className="h-[0.5px] bg-[#385e38] max-w-xs mx-auto my-8" />
        <p className="text-[9px] tracking-widest text-[#8eb08e] uppercase">© 2026 WEDDING INVITATION STUDIO. BẢN QUYỀN ĐƯỢC BẢO LƯU.</p>
      </footer>

    </div>
  );
};

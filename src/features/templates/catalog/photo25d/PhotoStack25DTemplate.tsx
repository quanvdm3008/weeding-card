import { useState, type PointerEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { CalendarDays, ChevronDown, Images, MapPin } from "lucide-react";
import UniversalLightbox from "@/components/galleries/UniversalLightbox";
import { RSVPSection } from "@/components/wedding/RSVPSection";
import ParentsSection from "@/components/wedding/sections/ParentsSection";
import TimelineSection from "@/components/wedding/sections/TimelineSection";
import { WEDDING_SEED_DATA } from "@/data/seedData";
import { useCountdown } from "@/hooks/useCountdown";
import type { TemplateProps } from "@/features/template/components/types";
import { Photo25DWishes } from "./Photo25DWishes";
import { BankRegistrySection } from "@/components/wedding/sections/BankRegistrySection";
import CalendarAndMapButtons from "@/components/wedding/CalendarAndMapButtons";

const layers = [
  { x: "-58%", y: "-4%", rotate: -8, depth: -28 },
  { x: "58%", y: "-9%", rotate: 7, depth: -10 },
  { x: "0%", y: "6%", rotate: -1, depth: 24 },
];

export const PhotoStack25DTemplate = ({
  groomName = WEDDING_SEED_DATA.groomName,
  brideName = WEDDING_SEED_DATA.brideName,
  date = WEDDING_SEED_DATA.date,
  time = WEDDING_SEED_DATA.time,
  venue = WEDDING_SEED_DATA.venue,
  address = WEDDING_SEED_DATA.address,
  message = WEDDING_SEED_DATA.message,
  accentColor = "#A98054",
  publicSlug,
  rsvpEnabled = true,
  wishesEnabled = true,
  coverImageUrl = WEDDING_SEED_DATA.coverImageUrl,
  galleryImageUrls = WEDDING_SEED_DATA.galleryImageUrls,
  stories = WEDDING_SEED_DATA.stories,
  groomBank,
  brideBank,
  groomParents = WEDDING_SEED_DATA.groomParents,
  brideParents = WEDDING_SEED_DATA.brideParents,
  schedule = WEDDING_SEED_DATA.schedule,
  theme,
}: TemplateProps) => {
  const reduceMotion = useReducedMotion();
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const gallery = galleryImageUrls.length ? galleryImageUrls : WEDDING_SEED_DATA.galleryImageUrls;
  const photos = [coverImageUrl, ...gallery, ...WEDDING_SEED_DATA.galleryImageUrls].filter(Boolean);
  const { days, hours, minutes, seconds } = useCountdown(date, time);

  const photoMessage = message === WEDDING_SEED_DATA.message
    ? "Giống như những bức ảnh được xếp lớp cẩn thận, mỗi khoảnh khắc bên nhau đều có chiều sâu riêng. Chúng mình mong bạn sẽ trở thành một phần quan trọng trong bức tranh kỷ niệm ngày hôm nay."
    : message;
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 65, damping: 22, mass: 0.8 });
  const springY = useSpring(pointerY, { stiffness: 65, damping: 22, mass: 0.8 });
  const rotateY = useTransform(springX, [-1, 1], [-3.5, 3.5]);
  const rotateX = useTransform(springY, [-1, 1], [2.5, -2.5]);

  const moveStack = (event: PointerEvent<HTMLElement>) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 2);
    pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  const resetStack = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <div className="overflow-hidden bg-[#F8F5EF] font-sans text-[#282520] selection:bg-[#D8C1A5]">
      <section
        id="hero"
        className="relative min-h-[92svh] overflow-hidden border-b border-[#CDB89D]/35"
        onPointerMove={moveStack}
        onPointerLeave={resetStack}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,.96),rgba(248,245,239,.72)_46%,rgba(228,218,203,.55))]" />
        <div className="absolute inset-x-5 top-20 flex items-center justify-between border-b border-[#5A5146]/15 pb-3 text-[9px] font-semibold uppercase text-[#6E655A] @md:inset-x-12">
          <span>Nhiáº¿p áº£nh Â· 2.5D</span>
          <span>{date.split("-").reverse().join(" Â· ")}</span>
        </div>

        <motion.div
          className="absolute left-1/2 top-[22%] h-[46vh] min-h-[360px] w-[54vw] min-w-[210px] max-w-[410px] -translate-x-1/2 [perspective:1200px] @md:top-[16%] @md:h-[62vh]"
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        >
          {layers.map((layer, index) => (
            <motion.figure
              key={`${photos[index]}-${index}`}
              className="absolute inset-0 overflow-hidden border-[12px] border-b-[40px] border-white bg-white shadow-[0_22px_55px_rgba(58,47,35,.4)]"
              style={{ x: layer.x, rotate: layer.rotate, translateZ: layer.depth, zIndex: index + 1, transformStyle: "preserve-3d" }}
              initial={reduceMotion ? false : { opacity: 0, y: "12%", scale: 0.96 }}
              animate={{ opacity: 1, y: layer.y, scale: 1 }}
              transition={{ duration: 0.85, delay: 0.12 + index * 0.13, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={photos[index]} alt={`Khoáº£nh kháº¯c ${index + 1}`} className="h-full w-full object-cover" />
              <span className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,.18),transparent_45%,rgba(74,53,34,.08))]" />
            </motion.figure>
          ))}
        </motion.div>

        <motion.div
          className="absolute inset-x-5 bottom-9 z-10 text-center @md:bottom-10"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
        >
          <p className="mb-2 text-[10px] font-semibold uppercase text-[#7C6E5E]">Gắn kết trong từng khung hình</p>
          <h1 className="font-serif text-[clamp(2.8rem,8cqi,7rem)] leading-[0.88] text-[#29251F]">
            {groomName} <i className="font-light" style={{ color: accentColor }}>&amp;</i> {brideName}
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-xs leading-5 text-[#6E655A] @md:text-sm">Câu chuyện được ghép từ những khoảnh khắc chân thực.</p>
        </motion.div>
      </section>

      <section className="border-b border-[#CDB89D]/30 bg-[#EEE8DE] px-5 py-12 @md:px-10 @md:py-16 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="mx-auto grid max-w-5xl grid-cols-4 divide-x divide-[#8B7A67]/20 border-y border-[#8B7A67]/20 shadow-[0_4px_12px_rgba(0,0,0,0.05)] bg-white/40 backdrop-blur-sm relative z-10">
          {[["Năm tháng (Ngày)", days], ["Mong chờ (Giờ)", hours], ["Cảm xúc (Phút)", minutes], ["Khoảnh khắc (Giây)", seconds]].map(([label, value], index) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.15, duration: 0.6 }} className="min-w-0 py-5 text-center @md:py-8">
              <span className="block font-serif text-3xl leading-none @md:text-5xl">{String(value).padStart(2, "0")}</span>
              <span className="mt-2 block text-[8px] font-semibold uppercase text-[#796D60] @md:text-[10px]">{label}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section id="story" className="bg-[#F8F5EF] px-5 py-20 @md:px-10 @md:py-28 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
        <div className="mx-auto grid max-w-6xl gap-14 @md:grid-cols-[.85fr_1.15fr] @md:items-start relative z-10">
          <div className="@md:sticky @md:top-24">
            <p className="text-[10px] font-semibold uppercase" style={{ color: accentColor }}>Những khung hình của chúng mình</p>
            <h2 className="mt-3 max-w-md font-serif text-4xl leading-tight @md:text-6xl">Mỗi lớp ảnh, một phần ký ức</h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-[#6E655A]">{photoMessage}</p>
          </div>
          <div className="space-y-12">
            {stories.slice(0, 3).map((story, index) => (
              <motion.article
                key={`${story.title}-${index}`}
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.65 }}
                className="grid grid-cols-[72px_1fr] gap-5 border-t border-[#8B7A67]/20 pt-6"
              >
                <span className="font-serif text-3xl text-[#B4A38F]">0{index + 1}</span>
                <div><p className="text-[10px] font-semibold uppercase text-[#8B7A67]">{story.date}</p><h3 className="mt-2 font-serif text-2xl">{story.title}</h3><p className="mt-3 text-sm leading-7 text-[#6E655A]">{story.text}</p></div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="bg-[#292621] px-5 py-20 text-white @md:px-10 @md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-20" />
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="mb-12 flex items-end justify-between gap-5"><div><p className="text-[10px] font-semibold uppercase text-[#D7C0A3]">Những khung hình chọn lọc</p><h2 className="mt-2 font-serif text-4xl @md:text-6xl">Cuốn album xếp lớp</h2></div><Images className="h-6 w-6 text-[#D7C0A3]" /></div>
          <div className="grid grid-cols-2 gap-3 @md:grid-cols-12 @md:gap-5 [perspective:1200px]">
            {gallery.slice(0, 6).map((image, index) => (
              <motion.button
                key={`${image}-${index}`}
                onClick={() => setActiveImage(index)}
                className={`group relative overflow-hidden bg-[#3C3730] text-left border-[8px] border-b-[24px] border-white shadow-[0_15px_35px_rgba(0,0,0,0.5)] ${index === 0 ? "col-span-2 aspect-[16/10] @md:col-span-7 @md:row-span-2" : "aspect-square @md:col-span-5"}`}
                initial={reduceMotion ? false : { opacity: 0, rotateY: index % 2 ? 8 : -8, y: 30 }}
                whileInView={{ opacity: 1, rotateY: index % 2 ? 3 : -3, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                whileHover={reduceMotion ? undefined : { y: -10, rotateX: 2, rotateY: index % 2 ? -2 : 2, scale: 1.02, zIndex: 20 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <img src={image} alt={`áº¢nh cÆ°á»›i ${index + 1}`} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.05]" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-1 left-2 text-[8px] font-semibold uppercase text-black">Khung {String(index + 1).padStart(2, "0")}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* PARENTS SECTION */}
      <div className="relative bg-[#292621] text-white">
        <ParentsSection groomParents={groomParents} brideParents={brideParents} accentColor={accentColor} theme={theme} />
      </div>

      <section id="events" className="bg-[#EEE8DE] px-5 py-20 @md:px-10 @md:py-24 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="mx-auto grid max-w-5xl gap-10 border-y border-[#8B7A67]/25 py-12 @md:grid-cols-2 @md:items-center bg-white/60 shadow-[0_10px_40px_rgba(0,0,0,0.06)] p-10 rotate-1 relative z-10">
          <div><p className="text-[10px] font-semibold uppercase" style={{ color: accentColor }}>Buổi tiệc</p><h2 className="mt-3 font-serif text-4xl @md:text-5xl">Hẹn gặp bạn vào ngày trọng đại</h2></div>
          <div className="space-y-5 text-sm text-[#5F574E]"><p className="flex gap-3"><CalendarDays className="h-5 w-5 shrink-0" style={{ color: accentColor }} />{date.split("-").reverse().join(" / ")} · {time}</p><p className="flex gap-3"><MapPin className="h-5 w-5 shrink-0" style={{ color: accentColor }} /><span>{venue}<br />{address}</span></p><CalendarAndMapButtons dateStr={date} timeStr={time} venue={venue} address={address} accentColor={accentColor} /></div>
        </motion.div>
      </section>

      {/* TIMELINE SECTION */}
      <div className="relative bg-[#EEE8DE]">
        <TimelineSection schedule={schedule} accentColor={accentColor} theme={theme} />
      </div>

      <BankRegistrySection groomBank={groomBank} brideBank={brideBank} accentColor={accentColor} theme={theme} />

      {/* ═══ DRESS CODE ═══ */}
      <section className="py-20 px-6" style={{ backgroundColor: '#FAF3E0' }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] mb-3" style={{ color: '#D4B896' }}>Dress Code</p>
          <h2 className="font-serif text-3xl italic mb-12" style={{ color: '#8B7355' }}>Trang phục</h2>
          <div className="flex justify-center gap-8 flex-wrap">
            {[
              { color: '#FAF3E0', border: '#D4B896', label: 'Kem nhạt' },
              { color: '#D4B896', border: '#B8966A', label: 'Caramel' },
              { color: '#8B7355', border: '#6B5335', label: 'Nâu đất' },
              { color: '#FFFFFF', border: '#D4B896', label: 'Trắng' },
            ].map(({ color, border, label }) => (
              <div key={label} className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full shadow-md transition-transform hover:scale-110" style={{ backgroundColor: color, border: `2px solid ${border}` }} />
                <span className="text-[10px] uppercase tracking-widest" style={{ color: '#D4B896' }}>{label}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm font-light" style={{ color: '#B8966A' }}>Trang phục lịch sự, tông màu ấm áp.</p>
        </div>
      </section>

      {rsvpEnabled && <div id="rsvp" className="bg-[#F8F5EF]"><RSVPSection accentColor={accentColor} theme={theme} sectionBg="#F8F5EF" embedded /></div>}
      {wishesEnabled && <Photo25DWishes publicSlug={publicSlug} accentColor={accentColor} theme={theme} />}

      <section className="bg-[#EEE8DE] px-5 py-20 @md:px-10 @md:py-24 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
        <div className="mx-auto max-w-2xl relative z-10">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: accentColor }}>Hỏi & Đáp</p>
            <h2 className="font-serif text-3xl md:text-4xl" style={{ color: '#5A5146' }}>Những câu hỏi thường gặp</h2>
          </div>
          <div className="space-y-4">
            {WEDDING_SEED_DATA.faqs.map((faq, index) => (
              <div key={faq.q} className="overflow-hidden rounded-xl border border-[#CDB89D]/40 bg-white/60 shadow-sm backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-white/40"
                >
                  <span className="font-serif text-lg text-[#5A5146]">{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 transition-transform duration-300 ${activeFaq === index ? "rotate-180" : ""}`} style={{ color: accentColor }} />
                </button>
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-2 text-sm leading-6 text-[#796D60]">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#292621] px-5 py-14 text-center text-white bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]"><p className="font-serif text-3xl">{groomName} <i style={{ color: accentColor }}>&amp;</i> {brideName}</p><p className="mt-3 text-[9px] font-semibold uppercase text-[#BDAE9C]">Gắn kết trong từng khung hình</p></footer>

      <UniversalLightbox images={gallery} currentIndex={activeImage} onClose={() => setActiveImage(null)} onNavigate={setActiveImage} />
    </div>
  );
};


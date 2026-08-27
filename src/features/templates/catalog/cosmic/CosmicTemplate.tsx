import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarDays, ChevronDown, MapPin, Orbit, Sparkles } from "lucide-react";
import { SparklingImage } from "@/components/wedding/SparklingImage";
import UniversalLightbox from "@/components/galleries/UniversalLightbox";
import { RSVPSection } from "@/components/wedding/RSVPSection";
import WishesWall from "@/components/wedding/wishes/WishesWall";
import ParentsSection from "@/components/wedding/sections/ParentsSection";
import TimelineSection from "@/components/wedding/sections/TimelineSection";
import { BankRegistrySection } from "@/components/wedding/sections/BankRegistrySection";
import CalendarAndMapButtons from "@/components/wedding/CalendarAndMapButtons";
import { WEDDING_SEED_DATA } from "@/data/seedData";
import { useCountdown } from "@/hooks/useCountdown";
import type { TemplateProps } from "@/features/template/components/types";

const stars = Array.from({ length: 54 }, (_, index) => ({
  left: (index * 37 + 7) % 100,
  top: (index * 53 + 11) % 100,
  size: 1 + (index % 4) * 0.7,
  delay: (index % 11) * 0.32,
}));

export const CosmicTemplate = ({
  groomName = WEDDING_SEED_DATA.groomName,
  brideName = WEDDING_SEED_DATA.brideName,
  date = WEDDING_SEED_DATA.date,
  time = WEDDING_SEED_DATA.time,
  venue = WEDDING_SEED_DATA.venue,
  address = WEDDING_SEED_DATA.address,
  message = WEDDING_SEED_DATA.message,
  accentColor = "#E7C77B",
  publicSlug,
  rsvpEnabled = true,
  wishesEnabled = true,
  coverImageUrl = WEDDING_SEED_DATA.coverImageUrl,
  galleryImageUrls = WEDDING_SEED_DATA.galleryImageUrls,
  stories = WEDDING_SEED_DATA.stories,
  groomParents,
  brideParents,
  groomBank,
  brideBank,
  schedule,
  theme,
}: TemplateProps) => {
  const { days, hours, minutes, seconds } = useCountdown(date, time);
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const gallery = galleryImageUrls.length ? galleryImageUrls : WEDDING_SEED_DATA.galleryImageUrls;
  const heroImage = coverImageUrl || gallery[0] || WEDDING_SEED_DATA.coverImageUrl;
  const prefersReducedMotion = useReducedMotion();

  const cosmicMessage = message === WEDDING_SEED_DATA.message
    ? "Dưới bầu trời sao bao la, hai quỹ đạo độc lập đã tình cờ va chạm và hòa làm một. Sự hiện diện của bạn là vì sao sáng nhất trong hành trình sắp tới của chúng tôi."
    : message;

  return (
    <div className="relative overflow-hidden bg-[#050611] font-serif text-[#F4F1FF] selection:bg-[#7765D8]">
      {!prefersReducedMotion && (
        <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
          {stars.map((star, index) => (
            <motion.i
              key={index}
              className="absolute block rounded-full bg-white"
              style={{ left: `${star.left}%`, top: `${star.top}%`, width: star.size, height: star.size, boxShadow: `0 0 ${star.size * 5}px ${index % 4 ? "#7765D8" : accentColor}` }}
              animate={{ opacity: [0.3, 0.58, 0.3], scale: [0.92, 1.08, 0.92] }}
              transition={{ duration: 6 + (index % 5), delay: star.delay, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
      )}

      <section id="hero" className="relative min-h-[100svh] overflow-hidden border-b border-[#9B8AF0]/20">
        <div className="absolute inset-0">
          <SparklingImage src={heroImage} fallbackSrc={WEDDING_SEED_DATA.coverImageUrl} accentColor={accentColor} alt="Cô dâu chú rể" className="h-full w-full object-cover opacity-55 saturate-[.72]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,6,17,.98)_0%,rgba(5,6,17,.78)_45%,rgba(5,6,17,.22)_80%),linear-gradient(0deg,#050611_0%,transparent_58%)]" />
        </div>
        <motion.div className="pointer-events-none absolute right-[-28vw] top-[10%] h-[72vw] max-h-[720px] w-[72vw] max-w-[720px] rounded-full border border-[#9B8AF0]/30 [transform:rotateX(67deg)]" animate={{ rotateZ: 360 }} transition={{ duration: 42, repeat: Infinity, ease: "linear" }} />
        <motion.div className="pointer-events-none absolute right-[-14vw] top-[22%] h-[46vw] max-h-[460px] w-[46vw] max-w-[460px] rounded-full border border-[#E7C77B]/35 [transform:rotateX(67deg)]" animate={{ rotateZ: -360 }} transition={{ duration: 32, repeat: Infinity, ease: "linear" }} />

        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-between px-6 pb-12 pt-24 @md:px-12 @md:pb-16">
          <div className="flex items-center justify-between font-sans text-[10px] font-semibold uppercase text-[#BEB5F5]">
            <span className="inline-flex items-center gap-2"><Orbit className="h-4 w-4" /> Lời thề tinh tú</span>
            <span>{date.split("-").reverse().join(" Â· ")}</span>
          </div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="max-w-4xl py-16">
            <p className="mb-5 font-sans text-xs leading-6 text-[#CFC9EF]/70">Hai quỹ đạo, một điểm đến</p>
            <h1 className="text-[clamp(3.4rem,9cqi,8.5rem)] font-light leading-[0.86]">
              {groomName}<span className="my-2 block text-[0.35em] italic text-[#E7C77B]">giữa những vì sao</span>{brideName}
            </h1>
            <p className="mt-7 max-w-lg text-sm leading-7 text-[#D3CFDC]/80 font-sans tracking-wide">
              {cosmicMessage}
            </p>
            <div className="mt-9 flex max-w-2xl flex-wrap items-center gap-4 border-y border-[#9B8AF0]/24 py-4 font-sans text-xs uppercase text-[#D9D4F5]/70">
              <span>{time}</span><i className="h-1 w-1 rounded-full bg-[#E7C77B]" /><span>{venue}</span>
            </div>
          </motion.div>
          <a href="#story" className="inline-flex w-fit items-center gap-2 font-sans text-[10px] font-semibold uppercase text-[#BEB5F5]"><Sparkles className="h-4 w-4" />Khám phá bản đồ sao</a>
        </div>
      </section>

      <section className="relative z-10 bg-[#0D1026] px-5 py-16 @md:px-10 @md:py-20">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="mx-auto max-w-6xl">
          <p className="mb-8 text-center font-sans text-[10px] font-semibold uppercase text-[#E7C77B]">Tín hiệu đếm ngược</p>
          <div className="grid grid-cols-4 divide-x divide-[#9B8AF0]/20 border-y border-[#9B8AF0]/20">
            {[
              ["Ngày", days], ["Giờ", hours], ["Phút", minutes], ["Giây", seconds],
            ].map(([label, value], index) => (
              <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.15, duration: 0.6 }} className="min-w-0 py-6 text-center @md:py-9">
                <span className="block text-[clamp(1.8rem,6cqi,4.5rem)] font-light leading-none text-white">{String(value).padStart(2, "0")}</span>
                <span className="mt-2 block font-sans text-[8px] uppercase text-[#BEB5F5]/60 @md:text-[10px]">{label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="story" className="relative z-10 bg-[#080916] px-5 py-24 @md:px-10 @md:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="mb-16 max-w-2xl">
            <p className="font-sans text-[10px] font-semibold uppercase text-[#E7C77B]">Chòm sao 01</p>
            <h2 className="mt-3 text-4xl font-light @md:text-6xl">Bản đồ sao của chúng tôi</h2>
          </motion.div>
          <div className="relative grid gap-12 @md:grid-cols-3 @md:gap-6">
            <div className="absolute left-0 right-0 top-5 hidden h-px bg-[#9B8AF0]/25 @md:block" />
            {stories.slice(0, 3).map((story, index) => (
              <motion.article key={`${story.title}-${index}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative pt-12">
                <span className="absolute left-0 top-2 h-7 w-7 rounded-full border border-[#E7C77B]/60 bg-[#080916] shadow-[0_0_24px_rgba(231,199,123,.24)]" />
                <p className="font-sans text-[10px] uppercase text-[#9B8AF0]">{story.date}</p>
                <h3 className="mt-3 text-2xl text-white">{story.title}</h3>
                <p className="mt-4 font-sans text-sm leading-7 text-[#CFC9EF]/56">{story.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="relative z-10 bg-[#0D1026] px-5 py-24 @md:px-10 @md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div><p className="font-sans text-[10px] uppercase text-[#E7C77B]">Hành tinh ký ức</p><h2 className="mt-2 text-4xl font-light @md:text-6xl">Dải ngân hà kỷ niệm</h2></div>
            <span className="font-sans text-xs text-[#BEB5F5]/55">{String(gallery.length).padStart(2, "0")} hành tinh</span>
          </div>
          <div className="grid grid-cols-2 gap-3 @md:grid-cols-12 @md:gap-5">
            {gallery.slice(0, 6).map((image, index) => (
              <button key={`${image}-${index}`} onClick={() => setActiveImage(index)} className={`group relative overflow-hidden border border-[#9B8AF0]/20 bg-[#050611] ${index === 0 ? "col-span-2 aspect-[16/10] @md:col-span-7 @md:row-span-2" : "aspect-square @md:col-span-5"}`}>
                <SparklingImage src={image} fallbackSrc={WEDDING_SEED_DATA.coverImageUrl} accentColor={accentColor} alt={`Kỷ niệm ${index + 1}`} className="h-full w-full object-cover opacity-85 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-100" />
                <span className="absolute bottom-3 left-3 font-sans text-[9px] uppercase text-white/75">Quỹ đạo {String(index + 1).padStart(2, "0")}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PARENTS SECTION */}
      <div className="relative z-10 bg-[#080916]">
        <ParentsSection groomParents={groomParents} brideParents={brideParents} accentColor={accentColor} theme={theme} />
      </div>

      <section id="events" className="relative z-10 border-y border-[#9B8AF0]/20 bg-[#080916] px-5 py-24 @md:px-10">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="mx-auto grid max-w-6xl gap-12 @md:grid-cols-[.8fr_1.2fr] @md:items-center">
          <div><p className="font-sans text-[10px] uppercase text-[#E7C77B]">Tọa độ hạ cánh</p><h2 className="mt-3 text-4xl font-light @md:text-6xl">Điểm hẹn Trái Đất</h2></div>
          <div className="border-l border-[#9B8AF0]/25 pl-6 @md:pl-10">
            <p className="flex items-center gap-3 text-2xl"><CalendarDays className="h-5 w-5 text-[#E7C77B]" /> {date.split("-").reverse().join(" / ")} · {time}</p>
            <p className="mt-5 flex items-start gap-3 font-sans text-sm leading-7 text-[#CFC9EF]/65"><MapPin className="mt-1 h-4 w-4 shrink-0 text-[#E7C77B]" /> <span>{venue}<br />{address}</span></p>
            <CalendarAndMapButtons dateStr={date} timeStr={time} venue={venue} address={address} accentColor={accentColor} />
          </div>
        </motion.div>
      </section>

      {/* TIMELINE SECTION */}
      <div className="relative z-10 bg-[#080916]">
        <TimelineSection schedule={schedule} accentColor={accentColor} theme={theme} />
      </div>

      <div className="relative z-10 bg-[#080916]">
        <BankRegistrySection
          groomBank={groomBank}
          brideBank={brideBank}
          accentColor={accentColor}
          theme={theme}
        />
      </div>

      {/* ═══ DRESS CODE ═══ */}
      <section className="py-20 px-6" style={{ backgroundColor: '#0D0D2B', borderTop: '1px solid rgba(123,94,167,0.3)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: '#7B5EA7' }}>Dress Code</p>
          <h2 className="text-3xl font-light mb-12" style={{ color: '#ffffff', fontFamily: 'var(--font-display, serif)' }}>Trang phục tham dự</h2>
          <div className="flex justify-center gap-8 flex-wrap">
            {[
              { color: '#1a1a4e', border: '#7B5EA7', label: 'Navy đêm' },
              { color: '#7B5EA7', border: '#9B7EC7', label: 'Tím thiên hà' },
              { color: '#C0C0D0', border: '#8080A0', label: 'Bạc sao' },
              { color: '#FFFFFF', border: '#7B5EA7', label: 'Trắng thiên hà' },
            ].map(({ color, border, label }) => (
              <div key={label} className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full shadow-lg transition-transform hover:scale-110 hover:shadow-purple-500/30" style={{ backgroundColor: color, border: `2px solid ${border}` }} />
                <span className="text-[10px] uppercase tracking-widest" style={{ color: '#7B5EA7' }}>{label}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Trang phục sang trọng, tông màu vũ trụ.</p>
        </div>
      </section>

      {rsvpEnabled && <div id="rsvp" className="relative z-10 bg-[#0D1026] text-[#F4F1FF]"><RSVPSection accentColor={accentColor} theme={theme} sectionBg="#0D1026" embedded /></div>}
      {wishesEnabled && <div id="wishes" className="relative z-10 bg-[#0D1026]"><WishesWall embedded accentColor={accentColor} theme={theme} publicSlug={publicSlug} /></div>}
      
      <section className="relative z-10 bg-[#080916] px-5 py-24 @md:px-10 @md:py-32">
        <div className="mx-auto max-w-3xl">
          <header className="mb-14 text-center">
            <p className="font-sans text-[10px] font-semibold uppercase text-[#E7C77B]">Tín hiệu giải đáp</p>
            <h2 className="mt-3 text-4xl font-light @md:text-5xl text-[#F4F1FF]">Hỏi đáp hành trình</h2>
          </header>
          <div className="space-y-4">
            {WEDDING_SEED_DATA.faqs.map((faq, index) => (
              <div key={faq.q} className="overflow-hidden rounded-2xl border border-[#9B8AF0]/20 bg-[#0D1026]/80 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left transition hover:bg-[#9B8AF0]/10"
                >
                  <span className="text-lg text-[#D9D4F5]">{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 transition-transform duration-300 text-[#E7C77B] ${activeFaq === index ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 font-sans text-sm leading-7 text-[#CFC9EF]/70">
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

      <footer className="relative z-10 border-t border-[#9B8AF0]/20 bg-[#050611] px-5 py-14 text-center"><p className="text-3xl font-light">{groomName} <i className="text-[#E7C77B]">&</i> {brideName}</p><p className="mt-3 font-sans text-[9px] uppercase text-[#BEB5F5]/50">Viết giữa những vì sao</p></footer>

      <UniversalLightbox images={gallery} currentIndex={activeImage} onClose={() => setActiveImage(null)} onNavigate={setActiveImage} />
    </div>
  );
};


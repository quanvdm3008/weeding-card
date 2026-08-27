import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Gamepad2, MapPin, Play, Users, Gift } from "lucide-react";
import UniversalLightbox from "@/components/galleries/UniversalLightbox";
import { RSVPSection } from "@/components/wedding/RSVPSection";
import WishesWall from "@/components/wedding/wishes/WishesWall";
import ParentsSection from "@/components/wedding/sections/ParentsSection";
import TimelineSection from "@/components/wedding/sections/TimelineSection";
import { BankRegistrySection } from "@/components/wedding/sections/BankRegistrySection";
import { WEDDING_SEED_DATA } from "@/data/seedData";
import { themes } from "@/data/themes";
import { useCountdown } from "@/hooks/useCountdown";
import type { TemplateProps } from "@/features/template/components/types";
import { pixelTheme } from "./theme";

const PixelCorners = () => <><i className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-current" /><i className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-current" /><i className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-current" /><i className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-current" /></>;

export const PixelTemplate = ({
  groomName = WEDDING_SEED_DATA.groomName,
  brideName = WEDDING_SEED_DATA.brideName,
  date = WEDDING_SEED_DATA.date,
  time = WEDDING_SEED_DATA.time,
  venue = WEDDING_SEED_DATA.venue,
  address = WEDDING_SEED_DATA.address,
  message = WEDDING_SEED_DATA.message,
  accentColor = "#7FE0C3",
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
  theme = themes.pixel,
}: TemplateProps) => {
  const { days, hours, minutes, seconds } = useCountdown(date, time);
  const [activeImage, setActiveImage] = useState<number | null>(null);
  
  const gallery = galleryImageUrls && galleryImageUrls.length > 0 ? galleryImageUrls : WEDDING_SEED_DATA.galleryImageUrls;
  const heroImage = coverImageUrl || gallery[0] || WEDDING_SEED_DATA.coverImageUrl;

  const pixelMessage = message === WEDDING_SEED_DATA.message
    ? "Player 01 và Player 02 đã sẵn sàng bắt đầu trò chơi quan trọng nhất cuộc đời. Hãy trang bị vật phẩm và đến dự buổi tiệc cùng chúng tôi!"
    : message;

  return (
    <div className="relative overflow-hidden bg-[#15141B] font-mono text-[#F6F2E9] selection:bg-[#7FE0C3] selection:text-[#15141B] [&_h1]:font-mono [&_h2]:font-mono [&_h3]:font-mono">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(#7FE0C3_1px,transparent_1px),linear-gradient(90deg,#7FE0C3_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <section id="hero" className="relative min-h-[100svh] overflow-hidden border-b-4 border-[#7FE0C3]">
        <div className="mx-auto grid min-h-[100svh] max-w-7xl items-center gap-10 px-5 pb-14 pt-24 @md:px-10 @lg:grid-cols-12">
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 @lg:col-span-5">
            <div className="mb-8 inline-flex items-center gap-3 border-2 border-[#7FE0C3] bg-[#211E2B] px-4 py-2 text-[10px] font-bold uppercase text-[#7FE0C3] shadow-[5px_5px_0_#0C0B10]"><Gamepad2 className="h-4 w-4" /> Đã mở khóa nhiệm vụ tình yêu</div>
            <p className="mb-4 text-xs uppercase text-[#FFCE67]">Player 01 + Player 02</p>
            <h1 className="text-[clamp(2.8rem,8cqi,6.5rem)] font-black uppercase leading-[0.92]">
              {groomName}<span className="my-3 block text-[0.34em] text-[#FFCE67]">x</span>{brideName}
            </h1>
            <p className="mt-7 max-w-lg text-sm leading-7 text-[#D3CFDC]/70">{pixelMessage}</p>
            <a href="#story" className="mt-8 inline-flex items-center gap-2 bg-[#7FE0C3] px-6 py-3 text-xs font-black uppercase text-[#15141B] shadow-[6px_6px_0_#FFCE67] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"><Play className="h-4 w-4 fill-current" /> Bắt đầu câu chuyện</a>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="relative z-10 @lg:col-span-7">
            <div className="relative border-4 border-[#F6F2E9] bg-[#211E2B] p-3 shadow-[12px_12px_0_#7FE0C3]">
              <PixelCorners />
              <div className="relative aspect-[4/5] overflow-hidden @md:aspect-[16/11]">
                <img src={heroImage} alt="Cô dâu và chú rể" className="h-full w-full object-cover [image-rendering:auto]" />
                <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(transparent_50%,#15141B_50%)] [background-size:100%_4px]" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-[#15141B]/88 px-4 py-3 text-[10px] uppercase text-[#7FE0C3]"><span>Memory_001.jpg</span><span>100%</span></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative border-b-2 border-[#464052] bg-[#211E2B] px-4 py-16">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5 }} className="mx-auto max-w-5xl">
          <p className="mb-7 text-center text-[10px] font-bold uppercase text-[#FFCE67]">Màn tiếp theo sẽ tải sau</p>
          <div className="grid grid-cols-4 gap-2 @md:gap-4">
            {[["LVL (NGÀY)", days], ["HP (GIỜ)", hours], ["MP (PHÚT)", minutes], ["EXP (GIÂY)", seconds]].map(([label, value], index) => (
              <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.4 }} className="relative border-2 border-[#7FE0C3]/60 bg-[#15141B] px-1 py-5 text-center shadow-[4px_4px_0_#0C0B10] @md:py-7">
                <span className="block text-[clamp(1.6rem,6cqi,4rem)] font-black leading-none text-[#F6F2E9]">{String(value).padStart(2, "0")}</span>
                <span className="mt-2 block text-[8px] font-bold text-[#7FE0C3] @md:text-[10px]">{label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="story" className="relative px-5 py-24 @md:px-10 @md:py-32">
        <div className="mx-auto max-w-6xl">
          <p className="text-[10px] font-bold uppercase text-[#7FE0C3]">Nhật ký nhiệm vụ</p>
          <h2 className="mt-3 text-4xl font-black uppercase @md:text-6xl">Chuyện tình đã lưu</h2>
          <div className="mt-14 grid gap-5 @md:grid-cols-3">
            {stories.slice(0, 3).map((story, index) => (
              <motion.article key={`${story.title}-${index}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative border-2 border-[#464052] bg-[#211E2B] p-6 shadow-[7px_7px_0_#0C0B10]">
                <span className="absolute right-4 top-4 text-2xl font-black text-[#7FE0C3]/20">0{index + 1}</span>
                <p className="text-[9px] font-bold uppercase text-[#FFCE67]">{story.date}</p>
                <h3 className="mt-5 text-xl font-black uppercase text-white">{story.title}</h3>
                <p className="mt-4 text-xs leading-6 text-[#D3CFDC]/64">{story.text}</p>
                <div className="mt-6 h-2 border border-[#7FE0C3]/35 bg-[#15141B]"><motion.i className="block h-full bg-[#7FE0C3]" initial={{ width: 0 }} whileInView={{ width: `${74 + index * 10}%` }} viewport={{ once: true }} /></div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="relative border-y-4 border-[#FFCE67] bg-[#F3EFE5] px-4 py-24 text-[#15141B] @md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between"><div><p className="text-[10px] font-bold uppercase text-[#5B5270]">Túi đồ kỷ niệm</p><h2 className="mt-2 text-4xl font-black uppercase @md:text-6xl">Album Pixel</h2></div><span className="hidden text-xs font-bold @md:block">{gallery.length}/99 ô</span></div>
          <div className="grid grid-cols-2 gap-2 @md:grid-cols-4 @md:gap-3">
            {gallery.slice(0, 8).map((image, index) => (
              <button key={`${image}-${index}`} onClick={() => setActiveImage(index)} className={`group relative overflow-hidden border-4 border-[#15141B] bg-[#211E2B] shadow-[5px_5px_0_#7FE0C3] ${index === 0 ? "col-span-2 row-span-2" : "aspect-square"}`}>
                <img src={image} alt={`Kỷ niệm ${index + 1}`} className="h-full w-full object-cover transition duration-300 group-hover:contrast-125 group-hover:saturate-75" onError={(event) => { event.currentTarget.src = WEDDING_SEED_DATA.coverImageUrl; }} />
                <span className="absolute bottom-2 left-2 bg-[#15141B] px-2 py-1 text-[8px] font-bold text-[#7FE0C3]">IMG_{String(index + 1).padStart(3, "0")}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PARENTS SECTION */}
      <div className="relative border-b-2 border-[#464052] bg-[#211E2B]">
        <ParentsSection groomParents={groomParents} brideParents={brideParents} accentColor={accentColor} theme={theme} />
      </div>

      <section id="events" className="relative bg-[#211E2B] px-5 py-24 @md:px-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.5 }} className="mx-auto max-w-5xl border-2 border-[#7FE0C3] bg-[#15141B] p-6 shadow-[9px_9px_0_#0C0B10] @md:p-10">
          <div className="mb-8 flex items-center gap-3 border-b-2 border-[#464052] pb-5 text-[#7FE0C3]"><Users className="h-5 w-5" /><span className="text-xs font-black uppercase">Sảnh sự kiện Co-op</span></div>
          <div className="grid gap-8 @md:grid-cols-2">
            <div><p className="text-[9px] font-bold uppercase text-[#FFCE67]">Ngày / Giờ</p><p className="mt-3 text-2xl font-black">{date.split("-").reverse().join(" / ")} · {time}</p><CalendarDays className="mt-6 h-6 w-6 text-[#7FE0C3]" /></div>
            <div><p className="text-[9px] font-bold uppercase text-[#FFCE67]">Điểm Hồi Sinh (Địa Điểm)</p><p className="mt-3 text-xl font-black uppercase">{venue}</p><p className="mt-3 text-xs leading-6 text-[#D3CFDC]/65">{address}</p><a href={`https://maps.google.com/?q=${encodeURIComponent(`${venue} ${address}`)}`} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 border-2 border-[#7FE0C3] px-5 py-3 text-xs font-black uppercase text-[#7FE0C3]"><MapPin className="h-4 w-4" /> Mở bản đồ</a></div>
          </div>
        </motion.div>
      </section>

      {/* TIMELINE SECTION */}
      <div className="relative border-b-2 border-[#464052] bg-[#211E2B]">
        <TimelineSection schedule={schedule} accentColor={accentColor} theme={theme} />
      </div>

      <div className="relative border-y-4 border-[#7FE0C3] bg-[#15141B]">
        <BankRegistrySection
          groomBank={groomBank}
          brideBank={brideBank}
          accentColor={accentColor}
          theme={theme}
        />
      </div>

      {rsvpEnabled && <div id="rsvp" className="relative bg-[#F3EFE5] text-[#15141B]"><RSVPSection accentColor={accentColor} theme={theme} sectionBg="#F3EFE5" embedded /></div>}
      {wishesEnabled && <div id="wishes" className="relative border-t-4 border-[#7FE0C3] bg-[#211E2B]"><WishesWall embedded accentColor={accentColor} theme={theme} publicSlug={publicSlug} /></div>}
      <footer className="relative bg-[#15141B] px-5 py-14 text-center"><p className="text-lg font-black uppercase text-[#F6F2E9]">{groomName} + {brideName}</p><p className="mt-3 text-[9px] uppercase text-[#7FE0C3]">Đã lưu game thành công</p></footer>
      <UniversalLightbox images={gallery} currentIndex={activeImage} onClose={() => setActiveImage(null)} onNavigate={setActiveImage} />
    </div>
  );
};


import { motion } from "framer-motion";
import { ChevronDown, Heart } from "lucide-react";
import { useState } from "react";
import { SparklingImage } from "@/components/wedding/SparklingImage";
import ParentsSection from "@/components/wedding/sections/ParentsSection";
import { RSVPSection } from "@/components/wedding/RSVPSection";
import { WEDDING_SEED_DATA } from "@/data/seedData";
import { themes } from "@/data/themes";
import { useCountdown } from "@/hooks/useCountdown";
import type { TemplateProps } from "@/features/template/components/types";
import { BankRegistrySection } from "@/components/wedding/sections/BankRegistrySection";
import { Flat2DWishes } from "./Flat2DWishes";
import UniversalLightbox from "@/components/galleries/UniversalLightbox";

const POP_COLORS = ["#FFD93D", "#FF6B6B", "#4ECDC4", "#FFFFFF"];

export const Flat2DTemplate = ({
  groomName = WEDDING_SEED_DATA.groomName,
  brideName = WEDDING_SEED_DATA.brideName,
  date = WEDDING_SEED_DATA.date,
  time = WEDDING_SEED_DATA.time,
  venue = WEDDING_SEED_DATA.venue,
  address = WEDDING_SEED_DATA.address,
  message = WEDDING_SEED_DATA.message,
  accentColor = "#FF6B6B",
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
  theme = themes.flat2d,
}: TemplateProps) => {
  const { days, hours, minutes, seconds } = useCountdown(date, time);
  const images = galleryImageUrls.length > 0 ? galleryImageUrls : WEDDING_SEED_DATA.galleryImageUrls;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div className="overflow-x-hidden bg-[#FFD93D] font-sans text-black">
      <section className="relative min-h-[90svh] border-b-4 border-black px-6 pb-16 pt-28 @md:px-12">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mx-auto flex min-h-[72svh] max-w-5xl flex-col justify-center gap-10">
          <p className="w-fit border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-[.24em] shadow-[4px_4px_0_#000]">Thiệp cưới của chúng tôi</p>
          <h1 className="text-6xl font-black uppercase leading-[.82] tracking-tighter @md:text-8xl">
            {groomName}<br /><span className="text-[#FF6B6B]">&amp;</span><br />{brideName}
          </h1>
          <div className="grid gap-4 @md:grid-cols-2">
            <p className="border-2 border-black bg-white p-5 text-sm font-bold leading-relaxed shadow-[6px_6px_0_#000]">{message}</p>
            <div className="border-2 border-black bg-[#4ECDC4] p-5 font-mono text-sm font-black shadow-[6px_6px_0_#000]">
              <p>{date.split("-").reverse().join(".")}</p><p>{time} · {venue}</p>
            </div>
          </div>
        </motion.div>
        <ChevronDown className="absolute bottom-6 left-1/2 h-8 w-8 -translate-x-1/2 animate-bounce" aria-hidden="true" />
      </section>

      <section className="border-b-4 border-black bg-white px-6 py-20 @md:px-12">
        <div className="mx-auto max-w-5xl"><p className="mb-8 text-xs font-black uppercase tracking-[.24em]">Khoảnh khắc của chúng mình</p>
          <div className="grid gap-5 @md:grid-cols-3">{images.slice(0, 6).map((image, index) => <motion.div key={`${image}-${index}`} whileHover={{ y: -6 }} onClick={() => setLightboxIndex(index)} className="cursor-zoom-in border-4 border-black bg-[#4ECDC4] p-2 shadow-[6px_6px_0_#000]"><SparklingImage src={image} accentColor={accentColor} alt={`Khoảnh khắc ${index + 1}`} className="aspect-[4/5] w-full object-cover" /></motion.div>)}</div>
        </div>
        <UniversalLightbox images={images} currentIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
      </section>

      <section className="border-b-4 border-black bg-[#4ECDC4] px-6 py-20 @md:px-12"><div className="mx-auto max-w-4xl"><div className="grid grid-cols-2 gap-5 @md:grid-cols-4">{[{ label: "Ngày", value: days }, { label: "Giờ", value: hours }, { label: "Phút", value: minutes }, { label: "Giây", value: seconds }].map(({ label, value }) => <div key={label} className="border-3 border-black bg-white p-5 text-center shadow-[5px_5px_0_#000]"><strong className="block text-5xl font-black">{String(value).padStart(2, "0")}</strong><span className="text-xs font-black uppercase tracking-widest">{label}</span></div>)}</div></div></section>

      <section className="border-b-4 border-black bg-[#FF6B6B] px-6 py-20 @md:px-12"><div className="mx-auto max-w-5xl"><h2 className="mb-10 w-fit border-3 border-black bg-white px-4 py-2 text-3xl font-black shadow-[6px_6px_0_#000]">Chuyện chúng mình</h2><div className="space-y-5">{stories.map((story) => <article key={`${story.date}-${story.title}`} className="grid gap-4 border-3 border-black bg-white p-5 shadow-[6px_6px_0_#000] @md:grid-cols-[150px_1fr]"><p className="font-mono font-black">{story.date}</p><div><h3 className="text-xl font-black">{story.title}</h3><p className="mt-2 font-medium leading-relaxed">{story.text}</p></div></article>)}</div></div></section>

      <ParentsSection groomParents={groomParents} brideParents={brideParents} accentColor={accentColor} theme={theme} />

      {/* ═══ NEO-BRUTALIST COUPLE SECTION ═══ */}
      <section className="border-b-4 border-black bg-[#FFD93D] px-6 py-20 @md:px-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 w-fit border-3 border-black bg-white px-4 py-2 text-3xl font-black shadow-[6px_6px_0_#000]">Nhân vật chính</h2>
          <div className="grid gap-6 @md:grid-cols-2">
            <div className="border-4 border-black bg-white p-4 shadow-[8px_8px_0_#000]">
              <div className="aspect-[3/4] w-full overflow-hidden border-3 border-black">
                <img src={coverImageUrl || images[0]} alt={groomName} className="h-full w-full object-cover grayscale" />
              </div>
              <div className="mt-4 border-t-3 border-black pt-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Chú Rể</p>
                <p className="text-2xl font-black">{groomName}</p>
              </div>
            </div>
            <div className="border-4 border-black bg-[#FF6B6B] p-4 shadow-[8px_8px_0_#000] @md:mt-8">
              <div className="aspect-[3/4] w-full overflow-hidden border-3 border-black">
                <img src={coverImageUrl || images[1]} alt={brideName} className="h-full w-full object-cover" />
              </div>
              <div className="mt-4 border-t-3 border-black pt-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Cô Dâu</p>
                <p className="text-2xl font-black text-white">{brideName}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y-4 border-black bg-white px-6 py-20 @md:px-12"><div className="mx-auto grid max-w-4xl gap-6 @md:grid-cols-2"><div className="border-3 border-black bg-[#FFD93D] p-6 shadow-[6px_6px_0_#000]"><p className="text-xs font-black uppercase tracking-[.2em]">Thời gian</p><p className="mt-3 text-3xl font-black">{time} · {date.split("-").reverse().join("/")}</p></div><div className="border-3 border-black bg-[#4ECDC4] p-6 shadow-[6px_6px_0_#000]"><p className="text-xs font-black uppercase tracking-[.2em]">Địa điểm</p><p className="mt-3 text-2xl font-black">{venue}</p><p className="mt-2 font-medium">{address}</p></div></div></section>

      <BankRegistrySection groomBank={groomBank} brideBank={brideBank} accentColor={accentColor} theme={theme} />
      {rsvpEnabled && <section className="border-b-4 border-black bg-[#FFD93D] px-6 py-20"><RSVPSection accentColor={accentColor} theme={theme} embedded publicSlug={publicSlug} guestName={publicGuestName} guestToken={publicGuestToken} /></section>}
      {wishesEnabled && <Flat2DWishes publicSlug={publicSlug} accentColor={accentColor} />}

      <section className="border-b-4 border-black bg-white px-6 py-16"><div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-4">{POP_COLORS.map((color) => <span key={color} className="h-12 w-12 border-3 border-black shadow-[4px_4px_0_#000]" style={{ backgroundColor: color }} />)}</div></section>
      <footer className="bg-black px-6 py-16 text-center text-white"><Heart className="mx-auto mb-5 h-7 w-7 fill-[#FF6B6B] text-[#FF6B6B]" /><p className="text-3xl font-black">{groomName} &amp; {brideName}</p><p className="mt-3 text-xs font-bold uppercase tracking-[.2em]">Hẹn gặp bạn trong ngày vui</p></footer>
    </div>
  );
};

import { SparklingImage } from "@/components/wedding/SparklingImage";
import { GiantTypographyMask } from "@/components/wedding/GiantTypographyMask";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { WEDDING_SEED_DATA } from "@/data/seedData";
import RSVPSection from "@/components/wedding/RSVPSection";
import StorySection from "@/components/wedding/sections/StorySection";
import { themes } from "@/data/themes";
import SmartGallery from "@/components/galleries/SmartGallery";
import { VolumetricLight } from "@/components/ui/VolumetricLight";
import { useCountdown } from "@/hooks/useCountdown";
import { minimalTheme } from "@/features/templates/catalog/minimal/theme";
import type { TemplateProps } from "@/features/template/components/types";
import ParentsSection from "@/components/wedding/sections/ParentsSection";
import { MinimalWishes } from "./MinimalWishes";
import { BankRegistrySection } from "@/components/wedding/sections/BankRegistrySection";

export const MinimalTemplate = ({
 groomName = WEDDING_SEED_DATA.groomName,
 brideName = WEDDING_SEED_DATA.brideName,
 date = WEDDING_SEED_DATA.date,
 time = WEDDING_SEED_DATA.time,
 venue = WEDDING_SEED_DATA.venue,
 address = WEDDING_SEED_DATA.address,
 message = WEDDING_SEED_DATA.message,
 accentColor = "#000000",
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
 theme = themes.minimalist,
}: TemplateProps) => {
  const { days, hours, minutes, seconds } = useCountdown(date, time);
  const displayImages = galleryImageUrls && galleryImageUrls.length > 0 ? galleryImageUrls : WEDDING_SEED_DATA.galleryImageUrls;

  return (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}
  className="font-sans text-neutral-900 bg-white relative selection:bg-neutral-900 selection:text-white"
  >
 <section id="hero" className="min-h-screen pt-32 pb-20 px-8 md:px-24 relative overflow-hidden">
  <VolumetricLight color="#E5E5E5" intensity={0.1} position="top-left" />
  <VolumetricLight color="#F5F5F5" intensity={0.08} position="bottom-right" />
  <GiantTypographyMask text1={groomName} text2={brideName} imageUrl={coverImageUrl || WEDDING_SEED_DATA.coverImageUrl} />
  <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }} className="mt-16 text-center flex flex-col items-center">
  <p className="text-sm tracking-[0.1em] text-neutral-500 max-w-lg leading-relaxed mb-12">{message || WEDDING_SEED_DATA.message}</p>
  <div className="flex gap-12 justify-center text-left">
  <div>
  <span className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">Ngày</span>
  <span className="text-lg font-medium">{(date || WEDDING_SEED_DATA.date).split("-").reverse().join(".")}</span>
  </div>
  <div>
  <span className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">Địa điểm</span>
  <span className="text-lg font-medium">{venue || WEDDING_SEED_DATA.venue}</span>
  </div>
  </div>
  </motion.div>
 </section>

 {/* 3. COUNTDOWN */}
 <section className="py-32 px-8 md:px-24">
 <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
 {[
 { label: "Ngày", value: days },
 { label: "Giờ", value: hours },
 { label: "Phút", value: minutes },
 { label: "Giây", value: seconds },
 ].map((item, idx) => (
 <div key={idx} className="flex flex-col items-center text-center w-full">
 <span className="text-7xl md:text-8xl font-light tracking-tighter mb-4 text-neutral-800">{String(item.value).padStart(2, "0")}</span>
 <span className="text-xs uppercase tracking-[0.2em] text-neutral-400">{item.label}</span>
 </div>
 ))}
 </div>
 </section>

  {/* 4. LOVE STORY */}
  <StorySection theme={theme} accentColor={accentColor} stories={stories} />

  {/* 4.5. PHOTO MARQUEE */}
  <section className="py-16 overflow-hidden bg-white">
    <div className="flex gap-4 w-[200vw] animate-[marquee_20s_linear_infinite]">
      {[...displayImages, ...displayImages].map((img, i) => (
        <div key={i} className="w-64 h-80 flex-shrink-0 overflow-hidden">
          <img src={img} alt="Gallery" className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition duration-700" />
        </div>
      ))}
    </div>
  </section>

  {/* 5. COUPLE */}
 <section className="py-32 px-8 md:px-24 bg-[#FAFAFA]">
 <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1 }} className="mb-24 text-center">
 <h2 className="text-5xl md:text-7xl font-light tracking-tighter">Cô dâu & Chú rể</h2>
 </motion.div>
 <div className="grid md:grid-cols-2 gap-16 md:gap-32">
  <div>
  <div className="aspect-[3/4] w-full mb-8 overflow-hidden rounded-2xl">
  <SparklingImage accentColor={accentColor} src={coverImageUrl || WEDDING_SEED_DATA.coverImageUrl} fallbackSrc={WEDDING_SEED_DATA.coverImageUrl} alt="Groom" className="w-full h-full object-cover object-top filter grayscale hover:grayscale-0 transition-all duration-700" />
  </div>
  <span className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-2 block text-center">Chú rể</span>
  <h3 className="text-4xl font-light tracking-tight text-center">{groomName || WEDDING_SEED_DATA.groomName}</h3>
  </div>
  <div className="md:mt-32">
  <div className="aspect-[3/4] w-full mb-8 overflow-hidden rounded-2xl">
  <SparklingImage accentColor={accentColor} src={displayImages[0] || WEDDING_SEED_DATA.galleryImageUrls[0]} fallbackSrc={WEDDING_SEED_DATA.galleryImageUrls[0]} alt="Bride" className="w-full h-full object-cover object-top filter grayscale hover:grayscale-0 transition-all duration-700" />
  </div>
  <span className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-2 block text-center">Cô dâu</span>
  <h3 className="text-4xl font-light tracking-tight text-center">{brideName || WEDDING_SEED_DATA.brideName}</h3>
  </div>
 </div>
 </section>

   {/* 5. PARENTS */}
   <section id="parents" className="py-32 px-8 md:px-24">
     <ParentsSection groomParents={groomParents} brideParents={brideParents} accentColor={accentColor} theme={theme} />
   </section>

 {/* 6. EVENTS */}
 <section id="events" className="py-32 px-8 md:px-24 bg-[#FAFAFA]">
 <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1 }} className="mb-24 text-center">
 <h2 className="text-5xl md:text-7xl font-light tracking-tighter">Sự kiện</h2>
 </motion.div>
 <div className="grid md:grid-cols-2 gap-16">
 <div>
 <h3 className="text-3xl font-light tracking-tight mb-8">Lễ cưới</h3>
 <div className="space-y-6 text-neutral-600 font-light">
 <p className="flex justify-between border-b border-black/10 pb-4">
 <span className="text-sm uppercase tracking-widest text-neutral-400">Ngày</span>
 <span className="font-medium text-neutral-800">{(date || WEDDING_SEED_DATA.date).split("-").reverse().join(".")}</span>
 </p>
 <p className="flex justify-between border-b border-black/10 pb-4">
 <span className="text-sm uppercase tracking-widest text-neutral-400">Thời gian</span>
 <span className="font-medium text-neutral-800">{time || WEDDING_SEED_DATA.time}</span>
 </p>
 <div className="pt-4">
 <span className="text-sm uppercase tracking-widest text-neutral-400 block mb-2">Địa điểm</span>
 <p className="font-medium text-neutral-800 text-lg mb-1">{venue || WEDDING_SEED_DATA.venue}</p>
 <p className="text-sm text-neutral-500">{address || WEDDING_SEED_DATA.address}</p>
 </div>
 <div className="pt-8">
 <a href={`https://maps.google.com/?q=${venue || WEDDING_SEED_DATA.venue} ${address || WEDDING_SEED_DATA.address}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-neutral-800 hover:text-neutral-500 transition-colors">
 Bản đồ <MoveRight className="w-4 h-4" />
 </a>
 </div>
 </div>
 </div>

 <div>
 <h3 className="text-3xl font-light tracking-tight mb-8">Tiệc cưới</h3>
 <div className="space-y-6 text-neutral-600 font-light">
 <p className="flex justify-between border-b border-black/10 pb-4">
 <span className="text-sm uppercase tracking-widest text-neutral-400">Ngày</span>
 <span className="font-medium text-neutral-800">{(date || WEDDING_SEED_DATA.date).split("-").reverse().join(".")}</span>
 </p>
 <p className="flex justify-between border-b border-black/10 pb-4">
 <span className="text-sm uppercase tracking-widest text-neutral-400">Thời gian</span>
 <span className="font-medium text-neutral-800">18:00</span>
 </p>
 <div className="pt-4">
 <span className="text-sm uppercase tracking-widest text-neutral-400 block mb-2">Địa điểm</span>
 <p className="font-medium text-neutral-800 text-lg mb-1">{venue || WEDDING_SEED_DATA.venue}</p>
 <p className="text-sm text-neutral-500">{address || WEDDING_SEED_DATA.address}</p>
 </div>
 <div className="pt-8">
 <a href={`https://maps.google.com/?q=${venue || WEDDING_SEED_DATA.venue} ${address || WEDDING_SEED_DATA.address}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-neutral-800 hover:text-neutral-500 transition-colors">
 Bản đồ <MoveRight className="w-4 h-4" />
 </a>
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* 7. GALLERY — SmartGallery sub-components manage their own lightbox internally */}
 <section id="gallery" className="relative z-10 w-full bg-white overflow-hidden">
        <SmartGallery accentColor={accentColor} images={displayImages} />
 </section>



  {/* 8. GIFT */}
  <BankRegistrySection groomBank={groomBank} brideBank={brideBank} accentColor={accentColor} theme={theme} />

 {/* 9. RSVP */}
 {rsvpEnabled && (
   <RSVPSection 
     theme={theme}
     accentColor={accentColor} 
     publicSlug={publicSlug} 
     date={date}
   />
 )}

  {/* 12. WISHES */}
  {wishesEnabled && (
    <div id="wishes">
      <MinimalWishes publicSlug={publicSlug} accentColor={accentColor} theme={theme} />
    </div>
  )}

  {/* 13. FOOTER */}
  <footer className="py-32 px-8 md:px-24 text-center bg-white border-t border-neutral-100">
  <h2 className="text-2xl font-light tracking-tight mb-8">{groomName || WEDDING_SEED_DATA.groomName} & {brideName || WEDDING_SEED_DATA.brideName}</h2>
  <p className="text-sm font-medium tracking-[0.2em] uppercase text-neutral-400">{(date || WEDDING_SEED_DATA.date).split("-").reverse().join(".")}</p>
  </footer>

  </motion.div>
  );
};


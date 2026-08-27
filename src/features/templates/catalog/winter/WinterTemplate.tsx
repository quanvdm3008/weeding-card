import { useState } from "react";
import { motion } from "framer-motion";
import { Diamond, Snowflake } from "lucide-react";
import { RSVPSection } from "@/components/wedding/RSVPSection";
import { WEDDING_SEED_DATA } from "@/data/seedData";
import { themes } from "@/data/themes";
import type { TemplateProps } from "@/features/template/components/types";
import { useCountdown } from "@/hooks/useCountdown";
import { BankRegistrySection } from "@/components/wedding/sections/BankRegistrySection";
import StorySection from "@/components/wedding/sections/StorySection";
import ParentsSection from "@/components/wedding/sections/ParentsSection";
import UniversalLightbox from "@/components/galleries/UniversalLightbox";
import { WinterWishes } from "./WinterWishes";

export const WinterTemplate = ({
  groomName = WEDDING_SEED_DATA.groomName,
  brideName = WEDDING_SEED_DATA.brideName,
  date = WEDDING_SEED_DATA.date,
  time = WEDDING_SEED_DATA.time,
  venue = WEDDING_SEED_DATA.venue,
  address = WEDDING_SEED_DATA.address,
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
  accentColor = "#5a7b8c",
  theme = themes.winter,
}: TemplateProps) => {
  const { days, hours, minutes, seconds } = useCountdown(date, time);
  const images = galleryImageUrls.length > 0 ? galleryImageUrls : WEDDING_SEED_DATA.galleryImageUrls;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8FAFC] text-[#0F172A]">

      {/* ═══ HERO ═══ */}
      <section className="relative grid min-h-[92svh] place-items-center overflow-hidden px-6 py-24 text-center">
        {coverImageUrl && (
          <img src={coverImageUrl} alt="Cặp đôi" className="absolute inset-0 h-full w-full object-cover opacity-15 grayscale" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/80 to-white" />
        {/* Snowflake decorators */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="pointer-events-none absolute text-slate-200"
            style={{
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 90}%`,
              fontSize: `${Math.random() * 16 + 8}px`,
            }}
            animate={{ y: [0, 15, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
          >
            ❄
          </motion.div>
        ))}
        <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} className="relative max-w-3xl">
          <p className="mb-10 flex items-center justify-center gap-4 text-xs font-semibold uppercase tracking-[.35em] text-slate-500">
            <span className="h-px w-10 bg-slate-300" /> Winter celebration <span className="h-px w-10 bg-slate-300" />
          </p>
          <h1 className="font-serif text-6xl font-light leading-none @md:text-8xl">{groomName}</h1>
          <Diamond className="mx-auto my-6 h-4 w-4 text-slate-400" />
          <h1 className="font-serif text-6xl font-light leading-none @md:text-8xl">{brideName}</h1>
          <p className="mt-12 inline-block border border-slate-200 bg-white/70 px-6 py-4 text-xs font-bold uppercase tracking-[.25em] backdrop-blur">
            {date.split("-").reverse().join(".")} · {time}
          </p>
        </motion.div>
      </section>

      {/* ═══ LOVE STORY ═══ */}
      <section className="relative overflow-hidden px-6 py-20" style={{ background: "linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)" }}>
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <Snowflake className="mx-auto mb-4 h-5 w-5 text-[#94A3B8]" />
            <p className="font-serif text-3xl italic text-slate-700">Chuyện tình yêu của chúng tôi</p>
            <p className="mt-2 text-xs uppercase tracking-widest text-slate-400">Our Love Story</p>
          </div>
          <StorySection
            theme={theme}
            accentColor={accentColor}
            sectionBg="transparent"
            stories={stories.map((s) => ({ title: s.title, date: s.date, text: s.text, img: s.img }))}
          />
        </div>
      </section>

      {/* ═══ PARENTS ═══ */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <Snowflake className="mx-auto mb-4 h-5 w-5 text-[#94A3B8]" />
            <p className="font-serif text-3xl italic text-slate-700">Hai gia đình</p>
          </div>
          <ParentsSection
            groomParents={groomParents}
            brideParents={brideParents}
            accentColor={accentColor}
            theme={theme}
          />
        </div>
      </section>

      {/* ═══ GALLERY with LIGHTBOX ═══ */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <Snowflake className="mx-auto mb-4 h-6 w-6 text-slate-400" />
            <p className="font-serif text-4xl italic">Frozen in time</p>
            <p className="mt-2 text-xs uppercase tracking-widest text-slate-400">Khoảnh khắc đẹp</p>
          </div>
          <div className="grid gap-5 @md:grid-cols-3">
            {images.slice(0, 6).map((image, index) => (
              <motion.figure
                key={`${image}-${index}`}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => setLightboxIndex(index)}
                className="cursor-zoom-in bg-white p-3 shadow-[0_20px_50px_rgba(15,23,42,.12)] transition-shadow hover:shadow-[0_30px_60px_rgba(15,23,42,.18)]"
              >
                <img src={image} alt={`Khoảnh khắc ${index + 1}`} className="aspect-[4/5] w-full object-cover" />
              </motion.figure>
            ))}
          </div>
        </div>
        <UniversalLightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      </section>

      {/* ═══ DATE & COUNTDOWN ═══ */}
      <section className="px-6 py-20" style={{ background: "linear-gradient(180deg, #EFF6FF 0%, #F8FAFC 100%)" }}>
        <div className="mx-auto max-w-4xl">
          <p className="mb-10 text-center font-serif text-4xl italic">Ngày hẹn gặp</p>
          <div className="grid gap-6 @md:grid-cols-2">
            <article className="border border-slate-200 bg-white p-7">
              <p className="text-xs font-bold uppercase tracking-[.25em] text-slate-500">Lễ cưới</p>
              <p className="mt-4 font-serif text-4xl">{time}</p>
              <p className="mt-3 text-slate-600">{venue}</p>
              <p className="mt-1 text-sm text-slate-500">{address}</p>
            </article>
            <article className="border border-[#5a7b8c]/20 bg-gradient-to-br from-[#EFF6FF] to-white p-7">
              <p className="text-xs font-bold uppercase tracking-[.25em] text-slate-500">Đếm ngược</p>
              <div className="mt-5 grid grid-cols-4 gap-2 text-center">
                {[{ label: "Ngày", value: days }, { label: "Giờ", value: hours }, { label: "Phút", value: minutes }, { label: "Giây", value: seconds }].map(({ label, value }) => (
                  <div key={label}>
                    <strong className="block font-serif text-3xl text-[#0F172A]">{String(value).padStart(2, "0")}</strong>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">{label}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <BankRegistrySection groomBank={groomBank} brideBank={brideBank} accentColor={accentColor} theme={theme} />

      {rsvpEnabled && (
        <section className="bg-white px-6 py-20">
          <div className="mx-auto max-w-3xl">
            <RSVPSection theme={theme} accentColor="#0F172A" embedded publicSlug={publicSlug} guestName={publicGuestName} guestToken={publicGuestToken} />
          </div>
        </section>
      )}

      {wishesEnabled && <WinterWishes publicSlug={publicSlug} accentColor="#0F172A" theme={theme} />}

      <footer className="bg-white px-6 py-16 text-center text-slate-600">
        <Snowflake className="mx-auto mb-6 h-5 w-5 text-slate-300" />
        <p className="font-serif text-3xl italic text-slate-900">Forever &amp; always</p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[.25em]">{groomName} &amp; {brideName}</p>
      </footer>
    </div>
  );
};

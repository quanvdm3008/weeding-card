import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Navigation,
  Sparkles,
  Eye,
  MailOpen,
  Send,
  Ticket,
  Users,
  Share2,
} from "lucide-react";
import { WEDDING_SEED_DATA } from "@/data/seedData";
import RSVPSection from "@/components/wedding/RSVPSection";
import { VintageStory } from "./sections/VintageStory";
import VintageWishes from "./VintageWishes";
import { BankRegistrySection } from "@/components/wedding/sections/BankRegistrySection";
import { themes } from "@/data/themes";
import ParentsSection from "@/components/wedding/sections/ParentsSection";
import { useCountdown } from "@/hooks/useCountdown";
import type { TemplateProps } from "@/features/template/components/types";
import { VintageDustParticles } from "./components/VintageDustParticles";
import { VintageFilmRollGallery } from "./components/VintageFilmRollGallery";
import { VintageInteractiveLetter } from "./components/VintageInteractiveLetter";
import { VintageEnvelopeReveal } from "./components/VintageEnvelopeReveal";
import { Vintage3DMusicBox } from "./components/Vintage3DMusicBox";
import UniversalLightbox from "@/components/galleries/UniversalLightbox";
import { SmartNavigationRide } from "@/components/wedding/SmartNavigationRide";
import { WeddingLoveQuiz } from "@/components/wedding/WeddingLoveQuiz";
import { InteractiveDressCode } from "@/components/wedding/InteractiveDressCode";
import { CalendarAndMapButtons } from "@/components/wedding/CalendarAndMapButtons";
import { BulkGuestLinkModal } from "@/components/wedding/BulkGuestLinkModal";

// Delicate Antique Gold Divider
const VintageDivider = ({ text }: { text?: string }) => (
  <div className="flex items-center justify-center gap-4 py-6">
    <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-r from-transparent via-[#C5A880] to-transparent" />
    {text ? (
      <span className="font-serif italic text-xs tracking-[0.25em] uppercase text-[#9A7B56] font-semibold">
        {text}
      </span>
    ) : (
      <div className="w-2 h-2 rotate-45 border border-[#C5A880] bg-[#FAF7F2]" />
    )}
    <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-r from-transparent via-[#C5A880] to-transparent" />
  </div>
);

export const VintageTemplate = ({
  groomName = WEDDING_SEED_DATA.groomName,
  brideName = WEDDING_SEED_DATA.brideName,
  date = WEDDING_SEED_DATA.date,
  time = WEDDING_SEED_DATA.time,
  venue = WEDDING_SEED_DATA.venue,
  address = WEDDING_SEED_DATA.address,
  message = WEDDING_SEED_DATA.message,
  accentColor = "#9A7B56",
  publicSlug = "minhanh-thanhha",
  publicGuestName,
  rsvpEnabled = true,
  wishesEnabled = true,
  galleryImageUrls = WEDDING_SEED_DATA.galleryImageUrls,
  coverImageUrl = WEDDING_SEED_DATA.coverImageUrl,
  groomBank,
  brideBank,
  groomParents,
  brideParents,
  stories = WEDDING_SEED_DATA.stories,
  theme = themes.vintage,
}: TemplateProps) => {
  const getGuestFromUrl = () => {
    if (typeof window === "undefined") return null;
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get("to") || params.get("guest");
    } catch {
      return null;
    }
  };

  const guestNameFromUrl = getGuestFromUrl() || publicGuestName || "Quý Quan Khách";

  const { days, hours, minutes, seconds } = useCountdown(date, time);
  const displayImages = galleryImageUrls.length > 0 ? galleryImageUrls : WEDDING_SEED_DATA.galleryImageUrls;
  const faqs = WEDDING_SEED_DATA.faqs;
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  const formattedDate = date ? date.split("-").reverse().join(" . ") : "14 . 02 . 2027";
  const dateSlash = date ? date.split("-").reverse().join("/") : "14/02/2027";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="font-serif text-[#2C2523] bg-[#FAF7F2] relative overflow-x-hidden selection:bg-[#9A7B56] selection:text-[#FAF7F2] min-h-screen"
    >
      {/* 🌟 1. Interactive Haute Couture Wax Seal Envelope Opening */}
      <AnimatePresence>
        {!isEnvelopeOpen && (
          <VintageEnvelopeReveal
            groomName={groomName}
            brideName={brideName}
            weddingDate={dateSlash}
            guestName={guestNameFromUrl}
            onOpen={() => setIsEnvelopeOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* 🌟 Floating Actions: Re-Open Envelope & Bulk Personalization */}
      {isEnvelopeOpen && (
        <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-2.5">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsEnvelopeOpen(false)}
            className="px-4 py-2.5 rounded-full bg-[#FAF7F2]/90 backdrop-blur-md border border-[#C5A880]/60 text-[#9A7B56] shadow-lg text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer hover:bg-white transition-all"
          >
            <MailOpen className="w-4 h-4 text-[#8B2635]" />
            <span>Mở lại phong bì</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowBulkModal(true)}
            className="px-4 py-2.5 rounded-full bg-[#9A7B56] text-[#FAF7F2] shadow-lg text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer hover:bg-[#7D6344] transition-all"
          >
            <Users className="w-4 h-4" />
            <span>Tạo link gửi khách</span>
          </motion.button>
        </div>
      )}

      {/* 🌟 Golden Sunbeam Dust Particles */}
      <VintageDustParticles />

      {/* Subtle Paper Noise Overlay */}
      <div
        className="fixed inset-0 opacity-25 pointer-events-none mix-blend-multiply z-0"
        style={{
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
        }}
      />

      {/* ─── 1. HERO: 3D INTERACTIVE MUSIC BOX & PARISIAN HERO ─── */}
      <section className="relative min-h-screen flex flex-col justify-center items-center py-20 px-4 text-center z-10">
        {/* Dreamy Ambient Warm Light */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-gradient-to-b from-[#EFE5D5]/70 via-[#F3EAD9]/30 to-transparent blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto w-full relative">
          {/* Top Monogram Emblem */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-[#C5A880]/60 bg-[#FAF7F2] shadow-[0_10px_30px_rgba(154,123,86,0.15)] flex items-center justify-center mx-auto mb-6 relative"
          >
            <div className="absolute inset-1 rounded-full border border-dashed border-[#C5A880]/40" />
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tighter text-[#9A7B56]">
              M&H
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[#9A7B56] font-semibold mb-3"
          >
            CÉLÉBRATION DU MARIAGE • LỄ THÀNH HÔN TRỌNG THỂ
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-normal tracking-[0.08em] text-[#2C2523] uppercase leading-[1.15]"
          >
            {groomName}
            <span className="block my-2 font-serif italic text-2xl sm:text-4xl text-[#9A7B56] lowercase font-light">
              &
            </span>
            {brideName}
          </motion.h1>

          <VintageDivider text="SAVE OUR DATE" />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xs sm:text-sm uppercase tracking-[0.3em] text-[#6B5D55] font-medium mb-4"
          >
            {formattedDate} • {venue}
          </motion.p>

          {/* 🌟 3D INTERACTIVE GRAMOPHONE & MUSIC BOX (Focal Visual Masterpiece) */}
          <Vintage3DMusicBox
            coverImage={coverImageUrl}
            songTitle="Can't Help Falling in Love"
            artistName={`${groomName} & ${brideName} • Vintage Acoustic`}
          />

          {/* 📅 Add to Google / Apple Calendar Buttons */}
          <div className="my-6">
            <CalendarAndMapButtons
              title={`${groomName} & ${brideName}`}
              dateStr={date}
              timeStr={time}
              venue={venue}
              address={address}
              accentColor="#9A7B56"
            />
          </div>

          {/* Quick CTA Actions */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#rsvp"
              className="px-8 py-3.5 rounded-full bg-[#9A7B56] text-[#FAF7F2] text-xs font-serif font-bold uppercase tracking-widest hover:bg-[#7D6344] transition-all shadow-md flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Xác Nhận Tham Dự (RSVP)</span>
            </a>
            <a
              href="#events"
              className="px-8 py-3.5 rounded-full bg-[#FDFBF7] border border-[#C5A880]/60 text-[#2C2523] text-xs font-serif font-bold uppercase tracking-widest hover:bg-[#F3EDE2] transition-all shadow-sm flex items-center gap-2"
            >
              <Ticket className="w-4 h-4 text-[#9A7B56]" />
              <span>Chương Trình Hôn Lễ</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─── 2. COUNTDOWN: TIMELESS ROTATING DIALS ─── */}
      <section className="py-20 px-4 relative z-10 bg-[#F3EDE2]/60 border-y border-[#C5A880]/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#9A7B56] font-semibold mb-2">
            THE MOMENT WE SAY YES
          </p>
          <h2 className="text-2xl sm:text-4xl font-normal tracking-[0.1em] text-[#2C2523] uppercase mb-12">
            ĐẾM NGƯỢC THỜI KHẮC THIÊNG LIÊNG
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-3xl mx-auto">
            {[
              { label: "NGÀY", value: days },
              { label: "GIỜ", value: hours },
              { label: "PHÚT", value: minutes },
              { label: "GIÂY", value: seconds },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-[#C5A880]/60 bg-[#FAF7F2] shadow-[0_10px_25px_rgba(154,123,86,0.1)] flex flex-col items-center justify-center relative group hover:border-[#9A7B56] transition-all">
                  <div className="absolute inset-1 rounded-full border border-dashed border-[#C5A880]/30 pointer-events-none" />
                  <span className="text-3xl sm:text-4xl font-light text-[#2C2523] tracking-tight">
                    {String(item.value).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs tracking-[0.25em] font-semibold text-[#8C7A70] mt-3 uppercase">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. COUPLE SPOTLIGHT: HIGH FASHION PORTRAITS ─── */}
      <section className="py-28 px-4 relative z-10 bg-[#FAF7F2]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 space-y-2">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#9A7B56] font-semibold">
              PORTRAIT D'AMOUR
            </span>
            <h2 className="text-3xl sm:text-5xl font-normal tracking-[0.1em] text-[#2C2523] uppercase">
              NHÂN VẬT CHÍNH
            </h2>
            <VintageDivider />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Groom Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center text-center"
            >
              <div
                onClick={() => setLightboxIndex(0)}
                className="cursor-pointer group relative w-full max-w-[340px] sm:max-w-[380px] aspect-[3/4] p-3 bg-[#FAF7F2] rounded-t-full border border-[#C5A880]/50 shadow-[0_20px_50px_rgba(154,123,86,0.18)] transition-all duration-700 hover:shadow-[0_25px_60px_rgba(154,123,86,0.28)]"
              >
                <div className="w-full h-full rounded-t-full overflow-hidden relative bg-[#EFE8DE]">
                  <img
                    src={coverImageUrl}
                    alt={groomName}
                    className="w-full h-full object-cover filter sepia-[0.25] contrast-[1.05] brightness-95 group-hover:scale-105 group-hover:filter-none transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                    <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[11px] uppercase tracking-wider font-semibold text-[#2C2523] shadow-md flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#9A7B56]" /> Phóng to ảnh
                    </span>
                  </div>
                </div>
              </div>

              <h3 className="mt-8 text-2xl sm:text-3xl font-normal uppercase tracking-widest text-[#2C2523]">
                {groomName}
              </h3>
              <p className="text-xs uppercase tracking-[0.25em] text-[#9A7B56] font-semibold mt-1">
                CHÚ RỂ • LE MARIÉ
              </p>
              <p className="mt-4 text-xs sm:text-sm italic text-[#6B5D55] max-w-xs leading-relaxed">
                “Anh tìm thấy bình yên và trọn vẹn của cuộc đời từ khoảnh khắc ánh mắt ta chạm nhau.”
              </p>
            </motion.div>

            {/* Bride Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex flex-col items-center text-center"
            >
              <div
                onClick={() => setLightboxIndex(1)}
                className="cursor-pointer group relative w-full max-w-[340px] sm:max-w-[380px] aspect-[3/4] p-3 bg-[#FAF7F2] rounded-t-full border border-[#C5A880]/50 shadow-[0_20px_50px_rgba(154,123,86,0.18)] transition-all duration-700 hover:shadow-[0_25px_60px_rgba(154,123,86,0.28)]"
              >
                <div className="w-full h-full rounded-t-full overflow-hidden relative bg-[#EFE8DE]">
                  <img
                    src={displayImages[0] || coverImageUrl}
                    alt={brideName}
                    className="w-full h-full object-cover filter sepia-[0.25] contrast-[1.05] brightness-95 group-hover:scale-105 group-hover:filter-none transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                    <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[11px] uppercase tracking-wider font-semibold text-[#2C2523] shadow-md flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#9A7B56]" /> Phóng to ảnh
                    </span>
                  </div>
                </div>
              </div>

              <h3 className="mt-8 text-2xl sm:text-3xl font-normal uppercase tracking-widest text-[#2C2523]">
                {brideName}
              </h3>
              <p className="text-xs uppercase tracking-[0.25em] text-[#9A7B56] font-semibold mt-1">
                CÔ DÂU • LA MARIÉE
              </p>
              <p className="mt-4 text-xs sm:text-sm italic text-[#6B5D55] max-w-xs leading-relaxed">
                “Hạnh phúc là mỗi sớm mai thức dậy, biết rằng bàn tay này sẽ mãi có một người nắm lấy.”
              </p>
            </motion.div>
          </div>

          {/* 💌 Interactive Wax-Sealed Love Letter */}
          <VintageInteractiveLetter
            groomName={groomName}
            brideName={brideName}
            message={message}
            weddingDate={dateSlash}
          />
        </div>
      </section>

      {/* ─── 4. FAMILY BLESSINGS ─── */}
      <section id="parents" className="py-20 px-4 relative z-10 bg-[#F3EDE2]/60 border-y border-[#C5A880]/30">
        <ParentsSection
          groomParents={groomParents}
          brideParents={brideParents}
          accentColor={accentColor}
          theme={theme}
        />
      </section>

      {/* ─── 5. LOVE STORY TIMELINE ─── */}
      <section id="story" className="py-24 relative z-10 bg-[#FAF7F2]">
        <VintageStory
          stories={stories}
          onImageClick={(idx) => setLightboxIndex(idx + 2)}
        />
      </section>

      {/* ─── 6. WEDDING EVENTS & 🚗 SMART NAVIGATION RIDE ─── */}
      <section id="events" className="py-28 px-4 relative z-10 bg-[#F8F4EC] border-y border-[#C5A880]/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-2">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#9A7B56] font-semibold">
              RÉCEPTION & CÉRÉMONIE
            </span>
            <h2 className="text-3xl sm:text-5xl font-normal tracking-[0.1em] text-[#2C2523] uppercase">
              CHƯƠNG TRÌNH HÔN LỄ
            </h2>
            <VintageDivider />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {/* Event 1: Ceremony */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#FDFBF7] p-8 sm:p-12 rounded-3xl border border-[#C5A880]/60 shadow-[0_15px_35px_rgba(154,123,86,0.12)] flex flex-col justify-between text-center relative"
            >
              <div>
                <span className="inline-block px-3.5 py-1 rounded-full border border-[#C5A880]/50 text-[10px] uppercase font-mono tracking-widest text-[#9A7B56] font-bold mb-4">
                  SỰ KIỆN I • CÉRÉMONIE
                </span>

                <h3 className="text-2xl sm:text-3xl font-normal uppercase tracking-wider text-[#2C2523] mb-6">
                  LỄ THÀNH HÔN
                </h3>

                <div className="space-y-3 text-xs sm:text-sm text-[#6B5D55] mb-8">
                  <p className="flex items-center justify-center gap-2 font-medium">
                    <Calendar className="h-4 w-4 text-[#9A7B56]" /> Ngày: {dateSlash}
                  </p>
                  <p className="flex items-center justify-center gap-2 font-medium">
                    <Clock className="h-4 w-4 text-[#9A7B56]" /> Thời gian: {time}
                  </p>
                  <p className="flex items-center justify-center gap-2 font-medium">
                    <MapPin className="h-4 w-4 text-[#9A7B56]" /> {venue}
                  </p>
                  <p className="text-[11px] text-[#8C7A70] max-w-xs mx-auto italic">{address}</p>
                </div>
              </div>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(`${venue} ${address}`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full border border-[#9A7B56] bg-[#9A7B56] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#7D6344] transition-colors shadow-md"
              >
                <Navigation className="h-3.5 w-3.5" /> Xem Bản Đồ Chỉ Đường
              </a>
            </motion.div>

            {/* Event 2: Reception */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="bg-[#FDFBF7] p-8 sm:p-12 rounded-3xl border border-[#C5A880]/60 shadow-[0_15px_35px_rgba(154,123,86,0.12)] flex flex-col justify-between text-center relative"
            >
              <div>
                <span className="inline-block px-3.5 py-1 rounded-full border border-[#C5A880]/50 text-[10px] uppercase font-mono tracking-widest text-[#9A7B56] font-bold mb-4">
                  SỰ KIỆN II • RÉCEPTION
                </span>

                <h3 className="text-2xl sm:text-3xl font-normal uppercase tracking-wider text-[#2C2523] mb-6">
                  TIỆC MỪNG VU QUY
                </h3>

                <div className="space-y-3 text-xs sm:text-sm text-[#6B5D55] mb-8">
                  <p className="flex items-center justify-center gap-2 font-medium">
                    <Calendar className="h-4 w-4 text-[#9A7B56]" /> Ngày: {dateSlash}
                  </p>
                  <p className="flex items-center justify-center gap-2 font-medium">
                    <Clock className="h-4 w-4 text-[#9A7B56]" /> Thời gian: 18:00
                  </p>
                  <p className="flex items-center justify-center gap-2 font-medium">
                    <MapPin className="h-4 w-4 text-[#9A7B56]" /> {venue}
                  </p>
                  <p className="text-[11px] text-[#8C7A70] max-w-xs mx-auto italic">{address}</p>
                </div>
              </div>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(`${venue} ${address}`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full border border-[#9A7B56] bg-[#9A7B56] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#7D6344] transition-colors shadow-md"
              >
                <Navigation className="h-3.5 w-3.5" /> Xem Bản Đồ Chỉ Đường
              </a>
            </motion.div>
          </div>

          {/* 🚗 1-Click Grab/Be & Parking Guidance */}
          <SmartNavigationRide
            venue={venue}
            address={address}
            accentColor="#9A7B56"
          />
        </div>
      </section>

      {/* ─── 7. FILM STRIP GALLERY ─── */}
      <section id="gallery" className="py-24 relative z-10 bg-[#1E110A] text-[#FAF7F2] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 text-center mb-12">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#C5A880] font-semibold">
            ALBUM DE SOUVENIRS
          </span>
          <h2 className="text-3xl sm:text-5xl font-normal tracking-[0.1em] text-amber-100 uppercase mt-2">
            CUỐN PHIM KỶ NIỆM
          </h2>
          <p className="text-xs sm:text-sm font-serif italic text-amber-200/70 mt-2">
            "Mỗi khoảnh khắc là một nốt nhạc ngân vang trong bản tình ca vĩnh cửu."
          </p>
        </div>

        {/* 🌟 35mm Film Roll Carousel */}
        <VintageFilmRollGallery images={displayImages} />
      </section>

      {/* ─── 8. 👔 INTERACTIVE DRESS CODE PALETTE ─── */}
      <section className="py-20 px-4 bg-[#F3EDE2]/70 border-y border-[#C5A880]/30 relative z-10">
        <InteractiveDressCode />
      </section>

      {/* ─── 9. 🎯 WEDDING LOVE QUIZ MINIGAME ─── */}
      <section className="py-20 px-4 bg-[#FAF7F2] relative z-10">
        <WeddingLoveQuiz
          groomName={groomName}
          brideName={brideName}
          accentColor={accentColor}
        />
      </section>

      {/* ─── 10. BANK REGISTRY ─── */}
      <section id="gift" className="py-20 px-4 relative z-10 bg-[#F8F4EC] border-t border-[#C5A880]/30">
        <BankRegistrySection
          groomBank={groomBank}
          brideBank={brideBank}
          accentColor={accentColor}
          theme={theme}
        />
      </section>

      {/* ─── 11. FAQ ACCORDION ─── */}
      {faqs && faqs.length > 0 && (
        <section className="py-20 px-4 relative z-10 bg-[#FAF7F2] border-t border-[#C5A880]/30">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl uppercase tracking-[0.15em] font-normal text-[#2C2523]">
                CÂU HỎI THƯỜNG GẶP
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="border border-[#C5A880]/50 bg-[#FDFBF7] rounded-2xl overflow-hidden shadow-sm"
                >
                  <button
                    type="button"
                    className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  >
                    <span className="font-semibold text-sm sm:text-base text-[#2C2523]">
                      {faq.q}
                    </span>
                    <span className="text-xl font-mono text-[#9A7B56]">
                      {activeFaq === idx ? "−" : "+"}
                    </span>
                  </button>
                  <AnimatePresence>
                    {activeFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-4 text-xs sm:text-sm text-[#6B5D55] border-t border-dashed border-[#C5A880]/30 pt-3 leading-relaxed"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 12. RSVP FORM ─── */}
      {rsvpEnabled && (
        <section id="rsvp" className="py-24 px-4 bg-[#F3EDE2]/60 border-t border-[#C5A880]/30 relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#FDFBF7] p-8 sm:p-14 rounded-3xl border border-[#C5A880]/60 shadow-[0_20px_50px_rgba(154,123,86,0.12)] text-center relative">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#9A7B56] font-bold mb-2 inline-block">
                CONFIRMATION DE PRÉSENCE
              </span>
              <h2 className="text-3xl sm:text-4xl font-normal uppercase tracking-wider text-[#2C2523] mb-2">
                PHÚC ĐÁP THAM DỰ
              </h2>
              <p className="text-xs tracking-widest text-[#8C7A70] mb-8 uppercase">
                Vui lòng phản hồi trước ngày {dateSlash}
              </p>

              <div className="text-left">
                <RSVPSection
                  accentColor="#9A7B56"
                  theme={theme}
                  sectionBg="transparent"
                  embedded
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── 13. WISHES WALL ─── */}
      {wishesEnabled && (
        <VintageWishes publicSlug={publicSlug} accentColor={accentColor} />
      )}

      {/* ─── 14. LUXURY FOOTER ─── */}
      <footer className="py-20 px-4 text-center bg-[#1E110A] text-[#FAF7F2] relative z-10 border-t border-[#C5A880]/40">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full border border-[#C5A880]/50 text-amber-200 flex items-center justify-center mx-auto shadow-lg bg-[#2E1A11]">
            <Heart className="h-5 w-5 fill-current" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-normal uppercase tracking-[0.2em] text-amber-100">
            {groomName} & {brideName}
          </h2>

          <p className="text-xs tracking-widest uppercase text-amber-200/70">
            {formattedDate} • HÔN LỄ TRỌNG THỂ
          </p>

          <div className="w-24 h-[1px] bg-amber-200/30 mx-auto my-4" />

          <p className="text-[10px] tracking-widest uppercase text-amber-200/40 font-mono">
            © {new Date().getFullYear()} MIREIA STUDIO • LUXURY VINTAGE MEMOIR
          </p>
        </div>
      </footer>

      {/* 🌟 Global Fullscreen Lightbox for Photo Clicks */}
      <UniversalLightbox
        images={[coverImageUrl, displayImages[0] || coverImageUrl, ...displayImages]}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />

      {/* 🌟 Bulk Personalized Guest Link Modal */}
      <BulkGuestLinkModal
        open={showBulkModal}
        onOpenChange={setShowBulkModal}
        baseSlug={publicSlug}
        templateId="vintage"
      />
    </motion.div>
  );
};

export default VintageTemplate;

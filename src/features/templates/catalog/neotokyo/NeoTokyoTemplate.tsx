import { motion } from "framer-motion";
import { ArrowDownRight, CalendarDays, MapPin, ScanLine } from "lucide-react";
import neoHero from "@/assets/template-neo-tokyo.jpg";
import { SparklingImage } from "@/components/wedding/SparklingImage";
import { RSVPSection } from "@/components/wedding/RSVPSection";
import WishesWall from "@/components/wedding/wishes/WishesWall";
import { BankRegistrySection } from "@/components/wedding/sections/BankRegistrySection";
import { WEDDING_SEED_DATA } from "@/data/seedData";
import { useCountdown } from "@/hooks/useCountdown";
import type { TemplateProps } from "@/features/template/components/types";
import SignatureTemplateChrome from "@/features/template/components/SignatureTemplateChrome";
import { SignatureGallery, SignatureTimeline } from "@/features/template/components/SignatureSections";
import ParentsSection from "@/components/wedding/sections/ParentsSection";

export const NeoTokyoTemplate = ({
  groomName = WEDDING_SEED_DATA.groomName,
  brideName = WEDDING_SEED_DATA.brideName,
  date = WEDDING_SEED_DATA.date,
  time = WEDDING_SEED_DATA.time,
  venue = WEDDING_SEED_DATA.venue,
  address = WEDDING_SEED_DATA.address,
  message = WEDDING_SEED_DATA.message,
  accentColor = "#00FFFF",
  publicSlug,
  publicGuestName,
  publicGuestToken,
  rsvpEnabled = true,
  wishesEnabled = true,
  musicUrl,
  coverImageUrl,
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
  const gallery = galleryImageUrls.length ? galleryImageUrls : WEDDING_SEED_DATA.galleryImageUrls;
  const heroImage = coverImageUrl || neoHero;
  const invitationMessage = message === WEDDING_SEED_DATA.message
    ? "Giữa thành phố không bao giờ ngủ, chúng tôi đã tìm thấy một tín hiệu không thể thay thế: đối phương. Trân trọng mời bạn đến chứng kiến khoảnh khắc hai hành trình chính thức đồng bộ hóa."
    : message;

  return (
    <div className="relative overflow-hidden bg-[#050608] font-sans text-white selection:bg-[#00FFFF] selection:text-black [&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans">
      <SignatureTemplateChrome variant="neo" musicUrl={musicUrl} />
      <section id="hero" className="relative min-h-[100svh] overflow-hidden border-b border-[#00FFFF]/45 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
        <div className="absolute inset-0">
          <SparklingImage src={heroImage} fallbackSrc={neoHero} accentColor={accentColor} alt="Neo Tokyo style wedding" className="h-full w-full object-cover object-[42%_center]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,4,6,.05)_0%,rgba(3,4,6,.14)_45%,rgba(3,4,6,.94)_74%),linear-gradient(0deg,rgba(3,4,6,.92)_0%,transparent_46%)]" />
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(0,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,.18)_1px,transparent_1px)] [background-size:72px_72px]" />
        </div>

        <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-7xl items-end px-5 pb-52 pt-24 @md:px-10 @md:pb-16 @lg:grid-cols-12">
          <div className="hidden @lg:col-span-6 @lg:block" />
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }} className="border-l border-[#00FFFF]/55 pl-5 @lg:col-span-6 @lg:pl-9">
            <p className="mb-5 text-[10px] font-mono font-bold uppercase text-[#00FFFF] hover:animate-pulse">Phiên bản 01 / Truyền tải tín hiệu</p>
            <h1 className="text-[clamp(3.2rem,8cqi,7.5rem)] font-black uppercase leading-[0.78] tracking-[0] drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
              {groomName}<span className="my-4 block text-[0.25em] font-medium text-[#FF007F] font-mono">đồng bộ cùng</span>{brideName}
            </h1>
            <p className="mt-8 max-w-xl text-sm leading-7 text-white/65">{invitationMessage}</p>
            <div className="mt-8 flex flex-wrap items-center gap-5 border-y border-white/18 py-4 text-[10px] font-mono font-bold uppercase text-white/70"><span>{date.split("-").reverse().join(".")}</span><i className="h-4 w-px bg-[#FF007F]" /><span>{time}</span><i className="h-4 w-px bg-[#FF007F]" /><span>{venue}</span></div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-white/14 bg-[#0A0D11] px-5 py-12 @md:px-10 @md:py-16">
        <div className="mx-auto grid max-w-7xl gap-6 @md:grid-cols-[220px_1fr] @md:items-end">
          <div><p className="text-[10px] font-mono font-bold uppercase text-[#FF007F]">Hệ thống đếm ngược</p><h2 className="mt-2 text-2xl font-black uppercase drop-shadow-[0_0_10px_rgba(255,0,127,0.3)]">Thời gian kích hoạt</h2></div>
          <div className="grid grid-cols-4 border-l border-[#00FFFF]/35">
            {[["Ngày", days], ["Giờ", hours], ["Phút", minutes], ["Giây", seconds]].map(([label, value], index) => (
              <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: index * 0.1 }} className="border-r border-white/12 px-2 py-3 text-center group">
                <span className="block text-[clamp(2rem,7cqi,5.5rem)] font-black leading-none group-hover:drop-shadow-[0_0_15px_rgba(0,255,255,0.8)] transition-all">{String(value).padStart(2, "0")}</span><span className="mt-2 block text-[9px] font-mono font-bold text-[#00FFFF]">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="story" className="relative bg-[#050608] px-5 py-24 text-white @md:px-10 @md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 grid gap-6 border-b-4 border-[#00FFFF]/40 pb-7 @md:grid-cols-[1fr_auto] @md:items-end"><div><p className="text-[10px] font-mono font-black uppercase text-[#FF007F]">Lưu trữ / dữ liệu quan hệ</p><h2 className="mt-3 text-5xl font-black uppercase leading-[0.9] @md:text-7xl drop-shadow-[0_0_15px_rgba(0,255,255,0.4)]">Dòng thời gian<br />chung</h2></div><ScanLine className="h-12 w-12 text-[#00FFFF]" /></div>
          <div className="grid border-l border-t border-[#00FFFF]/30 @md:grid-cols-3">
            {stories.slice(0, 3).map((story, index) => (
              <motion.article key={`${story.title}-${index}`} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.4, delay: index * 0.12 }} className="relative min-h-72 border-b border-r border-[#00FFFF]/30 p-6 @md:p-8 hover:bg-[#0A0D11] transition-colors group">
                <span className="text-6xl font-black text-white/10 group-hover:text-[#00FFFF]/30 transition-colors">0{index + 1}</span><p className="mt-8 text-[9px] font-mono font-black uppercase text-[#FF007F]">{story.date}</p><h3 className="mt-3 text-2xl font-black uppercase group-hover:drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">{story.title}</h3><p className="mt-5 text-sm leading-7 text-white/60">{story.text}</p><ArrowDownRight className="absolute bottom-6 right-6 h-5 w-5 text-[#00FFFF] opacity-50 group-hover:opacity-100" />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <div id="gallery">
        <SignatureGallery variant="neo" images={gallery} accentColor={accentColor} />
      </div>
      <ParentsSection groomParents={groomParents} brideParents={brideParents} theme={theme} accentColor={accentColor} />

      <section id="events" className="relative bg-[#00FFFF] px-5 py-20 text-[#050608] @md:px-10 @md:py-28 drop-shadow-[0_0_25px_rgba(0,255,255,0.3)]">
        <div className="mx-auto grid max-w-7xl gap-10 @md:grid-cols-[.75fr_1.25fr] @md:items-end">
          <div><p className="text-[10px] font-mono font-black uppercase">Tọa độ sự kiện trực tiếp</p><h2 className="mt-3 text-5xl font-black uppercase leading-[0.86] @md:text-7xl">Tiến vào<br />khu vực sự kiện.</h2></div>
          <div className="border-t-4 border-[#050608] pt-7">
            <p className="flex items-center gap-3 text-2xl font-black uppercase"><CalendarDays className="h-5 w-5" /> {date.split("-").reverse().join(" / ")} Â· {time}</p>
            <p className="mt-6 flex items-start gap-3 text-sm font-semibold leading-7"><MapPin className="mt-1 h-5 w-5 shrink-0" /><span>{venue}<br /><span className="font-normal text-[#050608]/70">{address}</span></span></p>
            <a href={`https://maps.google.com/?q=${encodeURIComponent(`${venue} ${address}`)}`} target="_blank" rel="noreferrer" className="mt-8 inline-flex bg-[#050608] px-6 py-3 text-[10px] font-mono font-black uppercase text-[#00FFFF] transition hover:bg-[#FF007F] hover:text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">Mở tọa độ</a>
          </div>
        </div>
      </section>

      <SignatureTimeline variant="neo" schedule={schedule} />

      <div className="relative bg-[#050608] border-t border-[#00FFFF]/20">
        <BankRegistrySection
          groomBank={groomBank}
          brideBank={brideBank}
          accentColor={accentColor}
          theme={theme}
        />
      </div>

      {/* ═══ DRESS CODE ═══ */}
      <section className="py-20 px-6" style={{ backgroundColor: '#0a0a0a', borderTop: '1px solid rgba(0,255,255,0.2)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: '#00FFFF', fontFamily: 'monospace' }}>// DRESS_CODE.EXE</p>
          <h2 className="text-3xl font-bold mb-12" style={{ color: '#FF0055', fontFamily: 'monospace' }}>TRANG PHỤC</h2>
          <div className="flex justify-center gap-8 flex-wrap">
            {[
              { color: '#0a0a0a', border: '#FF0055', label: 'VOID BLACK' },
              { color: '#FF0055', border: '#FF0055', label: 'NEO RED' },
              { color: '#00FFFF', border: '#00FFFF', label: 'CYBER TEAL' },
              { color: '#1a1a2e', border: '#00FFFF', label: 'DEEP NIGHT' },
            ].map(({ color, border, label }) => (
              <div key={label} className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 shadow-lg transition-transform hover:scale-110" style={{ backgroundColor: color, border: `2px solid ${border}`, boxShadow: `0 0 12px ${border}60` }} />
                <span className="text-[9px] uppercase tracking-widest font-mono" style={{ color: '#00FFFF' }}>{label}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>&gt; Trang phục tối màu, cyberpunk style.</p>
        </div>
      </section>

      {rsvpEnabled && <div id="rsvp" className="signature-rsvp-neo relative bg-[#050608] px-5 py-24 text-white @md:px-10 @md:py-28 border-t border-[#00FFFF]/20"><RSVPSection accentColor={accentColor} theme={theme} sectionBg="#050608" embedded publicSlug={publicSlug} guestName={publicGuestName} guestToken={publicGuestToken} /></div>}
      {wishesEnabled && <div id="wishes" className="signature-wishes-neo relative border-t border-[#00FFFF]/35 bg-[#050608]"><WishesWall embedded accentColor={accentColor} theme={theme} publicSlug={publicSlug} /></div>}
      
      <footer className="grid border-t border-white/15 bg-black px-5 py-14 text-center @md:grid-cols-3 @md:px-10"><span className="text-[9px] font-mono font-bold uppercase text-[#00FFFF]">Quá trình truyền tải hoàn tất</span><p className="mt-4 text-xl font-black uppercase @md:mt-0">{groomName} × {brideName}</p><span className="mt-4 text-[9px] font-mono font-bold uppercase text-white/35 @md:mt-0 @md:text-right">Giao thức Vĩnh cửu</span></footer>
    </div>
  );
};


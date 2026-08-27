import { motion } from "framer-motion";
import { CalendarDays, Compass, MapPin } from "lucide-react";
import auroraHero from "@/assets/template-nordic-aurora.jpg";
import { SparklingImage } from "@/components/wedding/SparklingImage";
import { RSVPSection } from "@/components/wedding/RSVPSection";
import WishesWall from "@/components/wedding/wishes/WishesWall";
import { WEDDING_SEED_DATA } from "@/data/seedData";
import { useCountdown } from "@/hooks/useCountdown";
import type { TemplateProps } from "@/features/template/components/types";
import SignatureTemplateChrome from "@/features/template/components/SignatureTemplateChrome";
import { SignatureGallery, SignatureTimeline } from "@/features/template/components/SignatureSections";
import ParentsSection from "@/components/wedding/sections/ParentsSection";
import { BankRegistrySection } from "@/components/wedding/sections/BankRegistrySection";

const auroraLines = [
  { left: "7%", width: "38%", delay: 0 },
  { left: "34%", width: "48%", delay: 1.4 },
  { left: "72%", width: "22%", delay: 2.7 },
];

export const NordicAuroraTemplate = ({
  groomName = WEDDING_SEED_DATA.groomName,
  brideName = WEDDING_SEED_DATA.brideName,
  date = WEDDING_SEED_DATA.date,
  time = WEDDING_SEED_DATA.time,
  venue = WEDDING_SEED_DATA.venue,
  address = WEDDING_SEED_DATA.address,
  message = WEDDING_SEED_DATA.message,
  accentColor = "#72E6C1",
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
  schedule,
  groomBank,
  brideBank,
  theme,
}: TemplateProps) => {
  const { days, hours, minutes, seconds } = useCountdown(date, time);
  const gallery = galleryImageUrls.length ? galleryImageUrls : WEDDING_SEED_DATA.galleryImageUrls;
  const heroImage = coverImageUrl || auroraHero;
  const invitationMessage = message === WEDDING_SEED_DATA.message
    ? "Dưới bầu trời phương Bắc tĩnh lặng, chúng mình chọn cùng nhau bước sang một hành trình mới. Mong bạn sẽ hiện diện và sưởi ấm ngày vui ấy bằng nụ cười yêu thương."
    : message;

  return (
    <div className="relative overflow-hidden bg-[#071712] text-[#EAF5F1] selection:bg-[#72E6C1] selection:text-[#06100D] font-sans">
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#72E6C1]/10 blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#436D60]/10 blur-[150px]" />
      </div>

      <SignatureTemplateChrome variant="aurora" musicUrl={musicUrl} />
      
      <section id="hero" className="relative min-h-[100svh] overflow-hidden">
        <div className="absolute inset-0">
          <SparklingImage src={heroImage} fallbackSrc={auroraHero} accentColor={accentColor} alt="Wedding under the aurora sky" className="h-full w-full object-cover object-[62%_center]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,14,16,.94)_0%,rgba(3,14,16,.72)_38%,rgba(3,14,16,.08)_76%),linear-gradient(0deg,rgba(4,20,16,.9)_0%,transparent_48%)]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl items-end px-6 pb-48 pt-28 @md:px-12 @md:pb-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }} className="max-w-3xl backdrop-blur-xl bg-white/5 p-8 @md:p-12 rounded-3xl border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
            <p className="mb-5 flex items-center gap-3 font-sans text-[10px] font-semibold uppercase text-[#9FEAD2] tracking-widest"><i className="h-px w-12 bg-[#9FEAD2]" />Hẹn ước dưới ánh cực quang</p>
            <h1 className="text-[clamp(2.5rem,8cqi,7rem)] font-light leading-[1.1] text-white">
              {groomName}<span className="my-3 block text-[0.4em] italic text-[#9FEAD2] font-serif">dưới bầu trời cực quang</span>{brideName}
            </h1>
            <p className="mt-8 max-w-xl font-sans text-sm leading-7 text-white/80 font-light @md:text-base">{invitationMessage}</p>
            <a href="#events" className="mt-8 inline-flex items-center gap-3 border-b border-[#9FEAD2]/50 pb-2 font-sans text-[10px] font-semibold uppercase text-[#DDFBF1] tracking-widest hover:border-[#9FEAD2] transition-colors"><Compass className="h-4 w-4" />Đến với ngày chung đôi</a>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 bg-transparent px-5 py-24 text-[#EAF5F1] @md:px-10 @md:py-32">
        <div className="mx-auto max-w-6xl">
          <p className="mb-12 text-center font-sans text-[10px] font-semibold uppercase tracking-widest text-[#9FEAD2]">Ánh sáng đang đến gần</p>
          <div className="grid grid-cols-4 backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.1)] overflow-hidden">
            {[["Ngày", days], ["Giờ", hours], ["Phút", minutes], ["Giây", seconds]].map(([label, value], index) => (
              <motion.div key={label} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: index * 0.12 }} className="relative min-w-0 py-10 text-center @md:py-16">
                {index > 0 && <i className="absolute inset-y-8 left-0 w-px bg-white/10" />}
                <span className="block text-[clamp(2rem,6cqi,5rem)] font-light leading-none text-white tracking-tight">{String(value).padStart(2, "0")}</span>
                <span className="mt-4 block font-sans text-[9px] font-semibold uppercase tracking-widest text-[#72E6C1]">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="story" className="relative z-10 bg-transparent px-5 py-24 @md:px-10 @md:py-32">
        <div className="mx-auto max-w-6xl backdrop-blur-xl bg-white/5 rounded-3xl p-8 @md:p-16 border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
          <div className="mb-20 grid gap-7 @md:grid-cols-[.8fr_1.2fr] @md:items-end">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-widest text-[#72E6C1]">Nhật ký phương Bắc / 01</p>
            <h2 className="text-4xl font-light leading-tight text-white @md:text-5xl">Những dấu chân đưa ta về chung một hướng</h2>
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {stories.slice(0, 4).map((story, index) => (
              <motion.article key={`${story.title}-${index}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.4, delay: index * 0.1 }} className="grid gap-6 py-12 @md:grid-cols-[100px_1fr_1.5fr] @md:items-baseline">
                <span className="text-5xl font-light text-[#72E6C1]/30">0{index + 1}</span>
                <div><p className="font-sans text-[9px] uppercase tracking-widest text-white/50">{story.date}</p><h3 className="mt-3 text-2xl font-light text-white">{story.title}</h3></div>
                <p className="font-sans text-sm leading-8 text-white/70 font-light">{story.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <div id="gallery">
        <SignatureGallery variant="aurora" images={gallery} accentColor={accentColor} />
      </div>

      <ParentsSection groomParents={groomParents} brideParents={brideParents} theme={theme} accentColor={accentColor} />

      <section id="events" className="relative bg-[#071712] px-5 py-24 text-white @md:px-10 @md:py-32">
        {auroraLines.map((line, index) => <motion.i key={index} className="absolute top-0 h-[2px] bg-[#55BFA0]/50 blur-[1px]" style={{ left: line.left, width: line.width }} animate={{ opacity: [0.1, 0.6, 0.1] }} transition={{ duration: 7, delay: line.delay, repeat: Infinity }} />)}
        <div className="mx-auto grid max-w-6xl gap-12 @md:grid-cols-[.7fr_1.3fr] @md:items-center backdrop-blur-xl bg-white/5 rounded-3xl p-8 @md:p-16 border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
          <div><p className="font-sans text-[10px] font-semibold uppercase tracking-widest text-[#9FEAD2]">Tọa độ gặp gỡ</p><h2 className="mt-6 text-5xl font-light leading-[1.1] text-white @md:text-6xl">Một ngày<br />thật ấm áp.</h2></div>
          <div className="border-l border-white/10 pl-8 @md:pl-16">
            <p className="flex items-center gap-4 text-2xl font-light"><CalendarDays className="h-6 w-6 text-[#72E6C1]" /> {date.split("-").reverse().join(" / ")} · {time}</p>
            <p className="mt-8 flex items-start gap-4 font-sans text-sm leading-8 text-white/70 font-light"><MapPin className="mt-1 h-5 w-5 shrink-0 text-[#72E6C1]" /><span className="text-white/90 font-normal">{venue}<br /><span className="text-white/60">{address}</span></span></p>
            <a href={`https://maps.google.com/?q=${encodeURIComponent(`${venue} ${address}`)}`} target="_blank" rel="noreferrer" className="mt-10 inline-flex border border-[#72E6C1]/30 bg-[#72E6C1]/10 backdrop-blur-sm px-8 py-4 font-sans text-[10px] font-semibold uppercase tracking-widest text-white transition-all hover:bg-[#72E6C1]/20 hover:border-[#72E6C1]/50">Mở bản đồ</a>
          </div>
        </div>
      </section>

      <div className="relative z-10 pb-24 @md:pb-32">
        <SignatureTimeline variant="aurora" schedule={schedule} />
      </div>

       <div className="relative z-10">
         <BankRegistrySection
           groomBank={groomBank}
           brideBank={brideBank}
           accentColor={accentColor}
           theme={theme}
         />
       </div>

      {/* ═══ DRESS CODE ═══ */}
      <section className="py-20 px-6" style={{ background: 'linear-gradient(180deg, #1A1A2E 0%, #16213E 100%)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: '#4ECCA3' }}>Dress Code</p>
          <h2 className="text-3xl font-light mb-12" style={{ color: '#E8F4F8' }}>Trang phục tham dự</h2>
          <div className="flex justify-center gap-8 flex-wrap">
            {[
              { color: '#E8F4F8', border: '#4ECCA3', label: 'Băng tuyết' },
              { color: '#4ECCA3', border: '#2EA88A', label: 'Aurora xanh' },
              { color: '#1A1A2E', border: '#4ECCA3', label: 'Đêm Bắc Cực' },
              { color: '#7B8FA1', border: '#4ECCA3', label: 'Xám bầu trời' },
            ].map(({ color, border, label }) => (
              <div key={label} className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full shadow-lg transition-transform hover:scale-110" style={{ backgroundColor: color, border: `2px solid ${border}` }} />
                <span className="text-[10px] uppercase tracking-widest" style={{ color: '#4ECCA3' }}>{label}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm" style={{ color: 'rgba(232,244,248,0.5)' }}>Trang phục thanh lịch, tông màu lạnh và tinh tế.</p>
        </div>
      </section>

      {rsvpEnabled && <div id="rsvp" className="signature-rsvp-aurora relative z-10 px-5 py-24 text-[#EAF5F1] @md:px-10 @md:py-32">
        <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 @md:p-12 border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.1)] max-w-6xl mx-auto">
          <RSVPSection accentColor={accentColor} theme={theme} sectionBg="transparent" embedded publicSlug={publicSlug} guestName={publicGuestName} guestToken={publicGuestToken} />
        </div>
      </div>}
      
      {wishesEnabled && <div id="wishes" className="signature-wishes-aurora relative z-10 px-5 py-24 @md:px-10 @md:py-32">
         <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.1)] max-w-6xl mx-auto overflow-hidden">
           <WishesWall embedded accentColor={accentColor} theme={theme} publicSlug={publicSlug} />
         </div>
      </div>}

      <footer className="relative z-10 mt-12 border-t border-white/10 bg-transparent px-5 py-20 text-center"><p className="text-4xl font-light tracking-wide text-white">{groomName} <i className="text-[#72E6C1] font-serif">&</i> {brideName}</p><p className="mt-6 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Trái tim ấm áp · bầu trời phương bắc</p></footer>
    </div>
  );
};

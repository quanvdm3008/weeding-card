import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, MoonStar, Sparkles } from "lucide-react";
import type { TemplateProps } from "@/features/template/components/types";
import { WEDDING_SEED_DATA } from "@/data/seedData";
import { themes } from "@/data/themes";
import violetDreamHero from "@/assets/template-violet-dream-v2.png";
import violetDreamGallery01 from "@/assets/violet-dream-gallery-01.png";
import violetDreamGallery02 from "@/assets/violet-dream-gallery-02.png";
import violetDreamGallery03 from "@/assets/violet-dream-gallery-03.png";
import { RSVPSection } from "@/components/wedding/RSVPSection";
import WishesWall from "@/components/wedding/wishes/WishesWall";
import { BankRegistrySection } from "@/components/wedding/sections/BankRegistrySection";
import { CalendarAndMapButtons } from "@/components/wedding/CalendarAndMapButtons";
import GiftQrReveal from "@/components/wedding/GiftQrReveal";
import UniversalLightbox from "@/components/galleries/UniversalLightbox";
import { StoryViewer } from "@/components/galleries/StoryViewer";
import ParentsSection from "@/components/wedding/sections/ParentsSection";
import TimelineSection from "@/components/wedding/sections/TimelineSection";
import { getVietQrImageUrl } from "@/lib/vietqr";
import { useCountdown } from "@/hooks/useCountdown";

const VIOLET_DEMO_GALLERY = [violetDreamGallery01, violetDreamGallery02, violetDreamGallery03];

const VioletHeading = ({ eyebrow, title, dark = false }: { eyebrow: string; title: string; dark?: boolean }) => (
  <div className="mx-auto max-w-2xl text-center">
    <p className={`text-[10px] font-semibold uppercase tracking-[.36em] ${dark ? "text-[#DDC3FF]" : "text-[#795A9B]"}`}>{eyebrow}</p>
    <h2 className={`mt-4 font-serif text-4xl leading-none @md:text-6xl ${dark ? "text-white" : "text-[#2B173D]"}`}>{title}</h2>
  </div>
);

const Constellation = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 500 300" aria-hidden="true" className={className} fill="none">
    <path d="M36 214 132 108 230 169 315 56 449 124 398 244 230 169" stroke="currentColor" strokeOpacity=".52" strokeWidth="1" />
    <path d="M132 108 188 42 315 56M315 56 362 28M398 244 462 266" stroke="currentColor" strokeOpacity=".3" strokeWidth="1" />
    {[[36, 214], [132, 108], [188, 42], [230, 169], [315, 56], [362, 28], [449, 124], [398, 244], [462, 266]].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" fill="currentColor" />)}
  </svg>
);

const celestialStyles = `
  .violet-dream { --violet-ink: #160923; --violet-night: #241136; --violet-lilac: #ddbbff; --violet-champagne: #f7e7cc; }
  .violet-dream #message { background: radial-gradient(circle at 18% 0%, rgba(213, 172, 255, .42), transparent 24%), radial-gradient(circle at 82% 85%, rgba(245, 216, 255, .65), transparent 25%), #fcfafe; }
  .violet-dream #message > div { position: relative; padding: 2.5rem 1.5rem; border-block: 1px solid rgba(157,117,199,.2); }
  .violet-dream #message > div::before, .violet-dream #message > div::after { content: "✦"; position: absolute; top: 50%; color: #b481dc; font-size: .8rem; filter: drop-shadow(0 0 9px rgba(156,98,198,.65)); }
  .violet-dream #message > div::before { left: -1.75rem; } .violet-dream #message > div::after { right: -1.75rem; }
  .violet-dream #message::before { content: "✦  ·  ✦  ·  ✦"; position: absolute; top: 26px; left: 50%; transform: translateX(-50%); color: #a376c8; letter-spacing: .5em; font-size: 11px; opacity: .65; }
  .violet-dream #constellation button { overflow: hidden; border-color: rgba(226, 194, 255, .32); background: radial-gradient(circle at 10% 0%, rgba(225, 181, 255, .25), transparent 28%), linear-gradient(145deg, rgba(62, 31, 89, .92), rgba(24, 9, 40, .9)); box-shadow: inset 0 1px rgba(255,255,255,.12), 0 24px 55px rgba(0,0,0,.32); }
  .violet-dream #constellation button::after { content: ""; position: absolute; inset: 9px; border: 1px solid rgba(233, 208, 255, .14); border-radius: 1.25rem; pointer-events: none; }
  .violet-dream section[class*="bg-[#241136]"] .grid > div { border-radius: 1.15rem; border-color: rgba(225, 191, 255, .26); background: radial-gradient(circle at 50% 0%, rgba(205, 144, 255, .2), transparent 54%), rgba(255,255,255,.07); box-shadow: inset 0 1px rgba(255,255,255,.1), 0 18px 35px rgba(10, 3, 21, .22); }
  .violet-dream #story { background: radial-gradient(circle at 88% 12%, rgba(204, 157, 244, .32), transparent 20%), radial-gradient(circle at 8% 84%, rgba(182, 126, 229, .18), transparent 22%), #f7f2fb; }
  .violet-dream #story article > span { clip-path: polygon(50% 0%, 61% 38%, 100% 50%, 61% 62%, 50% 100%, 39% 62%, 0% 50%, 39% 38%); border: 0; border-radius: 0; background: #e4c8ff; box-shadow: 0 0 20px rgba(154,112,194,.95); }
  .violet-dream #story article > div:last-child { position: relative; border: 1px solid rgba(150, 104, 190, .22); background: linear-gradient(135deg, rgba(255,255,255,.95), rgba(246, 238, 252, .94)); box-shadow: 0 24px 65px rgba(65,32,91,.16), inset 0 1px rgba(255,255,255,.9); }
  .violet-dream #story article > div:last-child::after { content: "✦"; position: absolute; right: 24px; top: 17px; color: #b181df; font-size: 18px; filter: drop-shadow(0 0 8px rgba(177,129,223,.7)); }
  .violet-dream #gallery { background: radial-gradient(circle at 12% 18%, rgba(138, 79, 189, .45), transparent 24%), radial-gradient(circle at 85% 70%, rgba(206, 161, 255, .19), transparent 24%), #160923; }
  .violet-dream #gallery button { border: 1px solid rgba(230, 202, 255, .3); box-shadow: 0 24px 48px rgba(4, 0, 10, .45); }
  .violet-dream #gallery button::after { content: none; }
  .violet-dream #gallery .violet-gallery-feature { border-color: rgba(247,231,204,.72); box-shadow: 0 30px 70px rgba(3,0,10,.58), inset 0 0 0 7px rgba(247,231,204,.08); }
  .violet-dream #gallery .violet-gallery-frame { box-shadow: 0 20px 44px rgba(3,0,10,.4); }
  .violet-dream #events > div { border: 1px solid rgba(226, 194, 255, .35); background: radial-gradient(circle at 86% 14%, rgba(206, 157, 255, .25), transparent 24%), linear-gradient(135deg, #351951, #1c0d2e); }
  .violet-dream #gift { background: radial-gradient(circle at 50% -5%, rgba(224, 181, 255, .32), transparent 30%), #170a26; }
  .violet-dream section[class*="bg-[#FCFAFE]"] article { position: relative; overflow: hidden; border: 1px solid rgba(174, 125, 215, .22); box-shadow: 0 16px 35px rgba(58, 22, 86, .1); }
  .violet-dream #hero > svg, .violet-dream #constellation > svg { animation: violet-twinkle 3.6s ease-in-out infinite alternate; }
  .violet-orbit { pointer-events: none; position: absolute; border-radius: 999px; animation: violet-orbit 18s linear infinite; }
  .violet-orbit--outer { inset: 4%; animation-duration: 22s; }
  .violet-orbit--middle { inset: 15%; animation-duration: 16s; animation-direction: reverse; }
  .violet-orbit--inner { inset: 27%; animation-duration: 12s; }
  .violet-orbit > svg { position: absolute; left: 50%; top: -1.25rem; transform: translateX(-50%); filter: drop-shadow(0 0 11px rgba(235, 204, 255, .95)); }
  .violet-dream #countdown { background: radial-gradient(circle at 50% 0%, rgba(185,125,232,.46), transparent 34%), linear-gradient(135deg, #211033, #12081e 74%); }
  .violet-dream #countdown .violet-countdown-card { position: relative; overflow: hidden; border-radius: 1.25rem; border-color: rgba(231,202,255,.25); background: linear-gradient(145deg, rgba(255,255,255,.12), rgba(255,255,255,.035)); box-shadow: inset 0 1px rgba(255,255,255,.15), 0 20px 40px rgba(4,0,12,.25); }
  .violet-dream #countdown .violet-countdown-card::before { content: "✦"; position: absolute; left: 50%; top: 9px; transform: translateX(-50%); color: #f7e7cc; font-size: 9px; }
  .violet-dream #whispers { background: radial-gradient(circle at 50% 0%, rgba(227,197,249,.75), transparent 36%), #f8f3fb; }
  .violet-dream #whispers article { box-shadow: 0 16px 36px rgba(55,22,76,.11); border: 1px solid rgba(162,113,199,.14); }
  .violet-dream #events { background: radial-gradient(circle at 11% 25%, rgba(184,132,222,.26), transparent 23%), #e9d9f3; }
  .violet-dream #details { background: linear-gradient(135deg, #eee2f6, #f9f5fc 58%, #e7d6f1); }
  .violet-dream .violet-rsvp { background: radial-gradient(circle at 50% 10%, rgba(222,187,248,.62), transparent 34%), #f8f3fb; }
  .violet-dream .violet-rsvp > div { border-color: rgba(163,108,203,.28); box-shadow: 0 30px 75px rgba(58,23,84,.16), inset 0 1px white; }
  .violet-dream #wishes { background: radial-gradient(circle at 82% 6%, rgba(202,152,240,.4), transparent 24%), #2a123f; color: white; }
  .violet-dream #wishes h2 { color: white; } .violet-dream #wishes .text-\\[\\#795A9B\\] { color: #dfc2fa; }
  .violet-dream .violet-footer { background: radial-gradient(circle at 50% 0%, rgba(178,116,229,.5), transparent 44%), #100719; }
  .violet-dream .violet-footer > svg { position: absolute; left: 50%; top: 48%; height: 110%; width: min(780px, 96vw); transform: translate(-50%, -50%); color: #e8cbff; opacity: .13; filter: drop-shadow(0 0 20px rgba(213,164,255,.5)); }
  .violet-dream .violet-crest { position: absolute; right: 11%; top: 18%; display: grid; height: min(15rem, 22vw); width: min(15rem, 22vw); place-items: center; border-radius: 50%; border: 1px solid rgba(247,231,204,.58); background: radial-gradient(circle, rgba(247,231,204,.13), rgba(122,70,167,.025) 58%, transparent 59%); box-shadow: 0 0 0 12px rgba(247,231,204,.045), 0 0 64px rgba(182,120,238,.2); }
  .violet-dream .violet-crest::before, .violet-dream .violet-crest::after { content: ""; position: absolute; border: 1px solid rgba(247,231,204,.22); border-radius: 50%; } .violet-dream .violet-crest::before { inset: 13%; } .violet-dream .violet-crest::after { inset: 30%; border-style: dashed; }
  .violet-dream .violet-crest svg { position: absolute; inset: -18%; height: 136%; width: 136%; color: #f7e7cc; opacity: .46; filter: drop-shadow(0 0 8px rgba(247,231,204,.65)); }
  .violet-dream .violet-crest__monogram { position: relative; z-index: 1; font-family: Georgia, serif; font-size: clamp(1.2rem, 2.3vw, 2.45rem); color: #fff8ef; text-shadow: 0 0 14px rgba(247,231,204,.5); }
  .violet-dream .violet-crest__caption { position: absolute; bottom: 18%; z-index: 1; font-size: 7px; font-weight: 700; letter-spacing: .22em; text-transform: uppercase; color: #f7e7cc; }
  @keyframes violet-orbit { to { transform: rotate(360deg); } }
  @keyframes violet-twinkle { from { opacity: .42; filter: drop-shadow(0 0 7px rgba(218, 169, 255, .45)); } to { opacity: .95; filter: drop-shadow(0 0 22px rgba(232, 198, 255, .95)); } }
  @media (prefers-reduced-motion: reduce) { .violet-orbit, .violet-dream #hero > svg, .violet-dream #constellation > svg { animation: none; } }
  @media (max-width: 760px) { .violet-dream .violet-crest { right: 8%; top: 15%; height: 8.5rem; width: 8.5rem; opacity: .76; } .violet-dream #message > div::before, .violet-dream #message > div::after { display: none; } }
`;

const VioletAlbum = ({ images, onSelect }: { images: string[]; onSelect: (index: number) => void }) => {
  const [featured, ...frames] = images;
  if (!featured) return null;

  return (
    <section id="gallery" className="relative z-10 isolate overflow-hidden px-5 py-24 text-white @md:py-32">
      <div className="pointer-events-none absolute inset-0 opacity-0 [background-image:radial-gradient(#E6CDFF_1px,transparent_1.5px)] [background-size:34px_34px]" />
      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto grid max-w-[1140px] gap-6 border-b border-[#E6C7FF]/25 pb-10 @md:grid-cols-[1.1fr_.9fr] @md:items-end">
          <div><p className="text-[10px] font-semibold uppercase tracking-[.34em] text-[#E5C6FF]">Thiên hà kỷ niệm</p><h2 className="mt-4 max-w-xl font-serif text-5xl leading-[.9] text-white @md:text-7xl">Album của những vì sao</h2></div>
          <p className="max-w-md font-sans text-sm leading-7 text-white/60 @md:ml-auto">Ba lát cắt của một đêm duy nhất — nơi ánh nến, hoa tím và lời hẹn cùng ở lại.</p>
        </div>
        <div className="violet-gallery-stage relative mx-auto mt-10 grid max-w-[1140px] gap-4 @md:block @md:h-[690px]">
          <Constellation className="pointer-events-none absolute left-[37%] top-[33%] hidden h-[34%] w-[28%] -rotate-6 text-[#E6C7FF]/35 @md:block" />
          <motion.button type="button" onClick={() => onSelect(0)} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .5 }} className="violet-gallery-feature group relative aspect-[4/5] overflow-hidden rounded-[1.6rem] text-left @md:absolute @md:left-[4%] @md:top-8 @md:h-[600px] @md:w-[39%]" aria-label="Mở ảnh kỷ niệm chính">
            <img src={featured} alt="Khoảnh khắc kỷ niệm chính" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(14,5,26,.7))]" />
            <span className="absolute bottom-6 left-6 text-[10px] font-semibold uppercase tracking-[.24em] text-[#F7E7CC]">Chương mở đầu · 01</span>
          </motion.button>
          {frames.slice(0, 2).map((image, index) => (
            <motion.button key={`${image}-${index + 1}`} type="button" onClick={() => onSelect(index + 1)} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .08, duration: .5 }} className={`violet-gallery-frame group relative aspect-[16/10] overflow-hidden rounded-[1.35rem] text-left @md:absolute ${index === 0 ? "@md:right-0 @md:top-0 @md:h-[275px] @md:w-[48%]" : "@md:bottom-0 @md:right-[8%] @md:h-[320px] @md:w-[53%]"}`} aria-label={`Mở khoảnh khắc kỷ niệm ${index + 2}`}>
              <img src={image} alt={`Khoảnh khắc kỷ niệm ${index + 2}`} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(14,5,26,.6))]" />
              <span className="absolute bottom-4 left-4 text-[9px] font-semibold uppercase tracking-[.22em] text-white/90">Khoảnh khắc · {String(index + 2).padStart(2, "0")}</span>
            </motion.button>
          ))}
        </div>
        {frames.length > 2 && <div className="mt-7 border-t border-[#E6C7FF]/20 pt-6"><div className="mb-4 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[.24em] text-[#DDBBFF]"><span>Những trang tiếp theo</span><span>{String(frames.length - 2).padStart(2, "0")} frames</span></div><div className="grid grid-cols-2 gap-4 @md:grid-cols-3">{frames.slice(2).map((image, index) => <button key={`${image}-${index + 3}`} type="button" onClick={() => onSelect(index + 3)} className="violet-gallery-frame group relative aspect-[16/10] overflow-hidden rounded-2xl" aria-label={`Mở khoảnh khắc kỷ niệm ${index + 4}`}><img src={image} alt={`Khoảnh khắc kỷ niệm ${index + 4}`} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /><span className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(15,4,29,.5))]" /></button>)}</div></div>}
        </div>
    </section>
  );
};

export const VioletDreamTemplate = ({
  groomName = WEDDING_SEED_DATA.groomName,
  brideName = WEDDING_SEED_DATA.brideName,
  date = WEDDING_SEED_DATA.date,
  time = WEDDING_SEED_DATA.time,
  venue = WEDDING_SEED_DATA.venue,
  address = WEDDING_SEED_DATA.address,
  message = WEDDING_SEED_DATA.message,
  accentColor = "#9D75C7",
  publicSlug,
  publicGuestName,
  publicGuestToken,
  rsvpEnabled = true,
  wishesEnabled = true,
  galleryImageUrls,
  coverImageUrl,
  chatMessages = WEDDING_SEED_DATA.chatMessages,
  groomBank,
  brideBank,
  stories = WEDDING_SEED_DATA.stories,
  groomParents,
  brideParents,
  schedule,
  extraInfoTitle,
  extraInfoContent,
  theme = themes.violet_dream,
}: TemplateProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const constellationRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const skyY = useTransform(scrollYProgress, [0, 0.2], ["0%", "16%"]);
  const moonY = useTransform(scrollYProgress, [0, 0.2], ["0%", "-18%"]);
  const copyY = useTransform(scrollYProgress, [0, 0.2], ["0%", "-30%"]);
  const { scrollYProgress: constellationProgress } = useScroll({ target: constellationRef, offset: ["start start", "end end"] });
  const planetariumRotate = useTransform(constellationProgress, [0, 1], [0, 24]);
  const planetariumScale = useTransform(constellationProgress, [0, 1], [1, 1.13]);
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const [activeStory, setActiveStory] = useState<number | null>(null);

  const finalGroomName = groomName || WEDDING_SEED_DATA.groomName;
  const finalBrideName = brideName || WEDDING_SEED_DATA.brideName;
  const heroImage = coverImageUrl || violetDreamHero;
  const gallery = (galleryImageUrls?.filter(Boolean).length ? galleryImageUrls.filter(Boolean) : VIOLET_DEMO_GALLERY).filter((image) => image !== heroImage);
  const { days, hours, minutes, seconds } = useCountdown(date, time);
  const formattedDate = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(`${date}T12:00:00`));
  const selectedBank = groomBank || brideBank || (!publicSlug ? WEDDING_SEED_DATA.groomBank : undefined);
  const giftQr = getVietQrImageUrl(selectedBank, selectedBank?.accountHolder || finalGroomName);
  const transition = reduceMotion ? { duration: 0 } : { duration: 0.9, ease: [0.22, 1, 0.36, 1] };

  return (
    <div ref={containerRef} className="violet-dream relative overflow-x-clip bg-[#F7F2FB] text-[#2B173D]">
      <style>{celestialStyles}</style>
      <nav className="absolute inset-x-0 top-0 z-40 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 text-white @md:px-10" aria-label="Điều hướng thiệp Giấc Mơ Tím">
        <a href="#hero" className="font-serif text-lg tracking-wide">VIOLET / VOWS</a>
        <div className="flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[.18em] text-white/80 @md:gap-7"><a href="#story" className="transition hover:text-white">Câu chuyện</a><a href="#events" className="hidden transition hover:text-white @sm:block">Sự kiện</a><a href="#rsvp" className="rounded-full border border-white/35 px-3 py-2 transition hover:bg-white hover:text-[#2B173D]">RSVP</a></div>
      </nav>

      <section id="hero" className="relative min-h-[100svh] overflow-hidden bg-[#100A1E] text-white">
        <motion.img src={heroImage} alt={`Ảnh cưới ${finalGroomName} và ${finalBrideName}`} style={reduceMotion ? undefined : { y: skyY }} className="absolute inset-x-0 -top-[10%] h-[122%] w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,6,25,.93),rgba(12,6,25,.38)_54%,rgba(12,6,25,.62)),linear-gradient(0deg,rgba(12,6,25,.82),transparent_48%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:radial-gradient(circle_at_14%_24%,#F6E9FF_1px,transparent_1.5px),radial-gradient(circle_at_71%_37%,#DAB6FF_1.5px,transparent_2px),radial-gradient(circle_at_84%_72%,#FFF_1px,transparent_1.5px)] [background-size:150px_170px,210px_190px,115px_125px]" />
        <motion.div style={reduceMotion ? undefined : { y: moonY }} className="violet-crest pointer-events-none" aria-hidden="true">
          <Constellation />
          <span className="violet-crest__monogram">{finalGroomName.charAt(0)} <i>&amp;</i> {finalBrideName.charAt(0)}</span>
          <span className="violet-crest__caption">constellation of vows</span>
        </motion.div>
        <div className="pointer-events-none absolute inset-5 border border-white/15 @md:inset-9" />
        <motion.div style={reduceMotion ? undefined : { y: copyY }} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={transition} className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-6 pb-20 pt-28 @md:justify-center @md:px-10">
          <p className="mb-6 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.38em] text-[#E7D4FF]"><MoonStar className="h-4 w-4" /> Lời hẹn dưới trăng</p>
          <h1 className="max-w-3xl font-serif text-6xl leading-[.82] drop-shadow-2xl @md:text-8xl @lg:text-[8rem]"><span className="block">{finalGroomName}</span><span className="my-5 block text-3xl italic text-[#D9B8FF] @md:text-5xl">&amp;</span><span className="block">{finalBrideName}</span></h1>
          <div className="mt-9 inline-flex w-fit border-y border-white/30 py-4 pr-2 font-sans text-[10px] uppercase tracking-[.2em] text-white/85">{formattedDate}<i className="mx-3 inline-block h-1 w-1 rounded-full bg-[#D9B8FF]" />{time}</div>
          <a href="#message" className="mt-9 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.25em] text-white/80 transition hover:text-white">Mở giấc mơ <ChevronDown className="h-4 w-4 animate-bounce" /></a>
        </motion.div>
      </section>

      <section id="message" className="relative z-10 -mt-8 rounded-t-[2.5rem] bg-[#FCFAFE] px-5 py-24 shadow-[0_-20px_60px_rgba(44,18,70,.15)] @md:-mt-14 @md:rounded-t-[4rem] @md:py-32"><div className="mx-auto max-w-3xl text-center"><Sparkles className="mx-auto h-5 w-5 text-[#9D75C7]" /><p className="mt-6 font-serif text-3xl leading-tight @md:text-5xl">“Chúng mình tìm thấy nhau giữa một bầu trời đầy sao.”</p>{message && <p className="mx-auto mt-7 max-w-2xl font-sans text-sm leading-7 text-[#6D597C] @md:text-base">{message}</p>}</div></section>

      {(groomParents || brideParents) && <div className="relative z-10 bg-[#EDE2F6] py-5"><ParentsSection groomParents={groomParents} brideParents={brideParents} accentColor={accentColor} theme={theme} /></div>}

      {stories?.length > 0 && (
        <section ref={constellationRef} id="constellation" className="relative z-10 isolate h-[155svh] bg-[#160923] text-white">
          <div className="sticky top-0 h-[100svh] overflow-hidden px-5 py-12 @md:px-10 @md:py-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(131,76,196,.42),transparent_28%),radial-gradient(circle_at_82%_16%,rgba(224,185,255,.25),transparent_22%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:radial-gradient(#E6CDFF_1px,transparent_1.5px)] [background-size:38px_38px]" />
            <div className="relative mx-auto h-full max-w-6xl">
              <div className="relative z-20"><VioletHeading eyebrow="Bản đồ định mệnh" title="Chòm sao của chúng mình" dark /><p className="mx-auto mt-5 max-w-xl text-center font-sans text-sm leading-7 text-white/65">Chạm vào một vì sao để mở lại khoảnh khắc đã dẫn lối chúng mình về bên nhau.</p></div>
              <div className="pointer-events-none absolute left-1/2 top-[54%] h-[min(490px,76vw)] w-[min(490px,76vw)] -translate-x-1/2 -translate-y-1/2 @md:top-[56%]">
              <motion.div style={reduceMotion ? undefined : { rotate: planetariumRotate, scale: planetariumScale }} className="h-full w-full">
                <span className="absolute inset-0 rounded-full border border-[#E6C7FF]/30" />
                <span className="absolute inset-[11%] rounded-full border border-dashed border-[#E6C7FF]/30" />
                <span className="absolute inset-[24%] rounded-full border border-[#E6C7FF]/25" />
                <Constellation className="absolute left-1/2 top-1/2 h-[60%] w-[84%] -translate-x-1/2 -translate-y-1/2 text-[#E6C7FF]/60 drop-shadow-[0_0_18px_rgba(220,166,255,.85)]" />
              </motion.div>
              </div>
              <div className="pointer-events-none absolute left-1/2 top-[54%] z-10 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-[#F0DDFF]/65 bg-[#371950] text-center shadow-[0_0_0_14px_rgba(205,152,255,.1),0_0_70px_rgba(205,152,255,.38)] @md:top-[56%] @md:h-40 @md:w-40"><span className="font-serif text-2xl leading-none text-[#F4E8FF] @md:text-4xl">{finalGroomName.charAt(0)}<i className="mx-1 text-[#D9B8FF]">&amp;</i>{finalBrideName.charAt(0)}</span><span className="-mt-5 text-[8px] font-semibold uppercase tracking-[.2em] text-[#E5CBFF]">Our orbit</span></div>
              <div className="relative z-20 mt-12 grid gap-4 @md:mt-0 @md:block @md:h-full">
                {stories.slice(0, 3).map((story, index) => (
                  <motion.button key={`${story.date}-${story.title}`} type="button" onClick={() => setActiveStory(index)} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .12, ...transition }} className={`group relative w-full overflow-hidden rounded-[1.45rem] border border-[#E6C7FF]/25 bg-[#2E1645]/80 p-5 text-left shadow-[0_20px_50px_rgba(0,0,0,.28)] backdrop-blur-md transition hover:-translate-y-1 hover:border-[#E6C7FF]/70 @md:absolute @md:w-[250px] ${index === 0 ? "@md:left-[2%] @md:top-[32%]" : index === 1 ? "@md:right-[1%] @md:top-[20%]" : "@md:bottom-[7%] @md:right-[10%]"}`}>
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-[#E6C7FF]/50 bg-[#DDBAFF]/15 text-[#F3E7FF] shadow-[0_0_28px_rgba(218,175,255,.42)]"><Sparkles className="h-4 w-4" /></span>
                    <p className="mt-5 text-[9px] font-semibold uppercase tracking-[.22em] text-[#DDBBFF]">Ngôi sao {String(index + 1).padStart(2, "0")}</p>
                    <h3 className="mt-2 font-serif text-xl">{story.title}</h3>
                    <p className="mt-2 font-sans text-xs text-white/60">{story.date}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="countdown" className="relative z-10 overflow-hidden px-5 py-20 text-white @md:py-28"><div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(#C8A2FF_1px,transparent_1px)] [background-size:30px_30px]" /><div className="relative mx-auto max-w-5xl"><VioletHeading eyebrow="Đếm ngược" title="Khoảnh khắc nhiệm màu" dark /><div className="mt-12 grid grid-cols-2 gap-3 @md:grid-cols-4 @md:gap-5">{[{ label: "Ngày", value: days }, { label: "Giờ", value: hours }, { label: "Phút", value: minutes }, { label: "Giây", value: seconds }].map((item, index) => <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .08, ...transition }} className="violet-countdown-card border px-5 py-7 text-center backdrop-blur"><p className="font-serif text-5xl text-[#E3CDFF] @md:text-6xl">{item.value}</p><p className="mt-2 text-[10px] font-semibold uppercase tracking-[.24em] text-white/55">{item.label}</p></motion.div>)}</div></div></section>

      {stories?.length > 0 && <section id="story" className="relative z-10 overflow-hidden bg-[#F7F2FB] px-5 py-24 @md:py-36"><p className="pointer-events-none absolute right-[-2vw] top-10 select-none font-serif text-[19vw] leading-none text-[#E7D9F2]">LUNE</p><div className="relative mx-auto max-w-5xl"><VioletHeading eyebrow="Chuyện chúng mình" title="Những chương đầy sao" /><div className="relative mx-auto mt-20 max-w-4xl border-l border-[#B994DD]/35 pl-8 @md:pl-20">{stories.map((story, index) => <motion.article key={`${story.date}-${story.title}`} initial={{ opacity: 0, x: index % 2 ? 36 : -36 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * .1, ...transition }} className="relative mb-16 grid gap-7 last:mb-0 @md:grid-cols-[190px_1fr] @md:items-center"><span className="absolute -left-[2.57rem] top-7 h-5 w-5 rounded-full border-4 border-[#F7F2FB] bg-[#9A70C2] shadow-[0_0_0_1px_rgba(154,112,194,.4)] @md:-left-[5.55rem]" /><div className="font-serif text-3xl italic text-[#7B549E]">{story.date}</div><div className={`grid overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_50px_rgba(65,32,91,.12)] @sm:grid-cols-[.75fr_1fr] ${index % 2 ? "@sm:[&>button]:order-2" : ""}`}><button type="button" onClick={() => setActiveStory(index)} className="block min-h-64 overflow-hidden" aria-label={`Mở ảnh ${story.title}`}><img src={story.img} alt={story.title} className="h-full w-full object-cover transition duration-700 hover:scale-105" /></button><div className="p-7"><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#8A65AF]">Chương {String(index + 1).padStart(2, "0")}</p><h3 className="mt-4 font-serif text-3xl">{story.title}</h3><p className="mt-4 font-sans text-sm leading-6 text-[#6D597C]">{story.text}</p></div></div></motion.article>)}</div></div></section>}

      {chatMessages?.length > 0 && <section id="whispers" className="relative z-10 px-5 py-24 @md:py-32"><VioletHeading eyebrow="Những lời thì thầm" title="Một góc tin nhắn" /><div className="mx-auto mt-14 max-w-2xl space-y-7">{chatMessages.map((chat, index) => <motion.article key={`${chat.time}-${index}`} initial={{ opacity: 0, x: chat.sender === "groom" ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * .08, ...transition }} className={`max-w-[82%] rounded-3xl px-6 py-5 ${chat.sender === "groom" ? "mr-auto bg-[#EEE2F7]" : "ml-auto bg-[#30184A] text-white"}`}><p className="text-[10px] font-semibold uppercase tracking-[.18em] opacity-55">{chat.sender === "groom" ? finalGroomName : finalBrideName} · {chat.time}</p><p className="mt-2 font-serif text-lg leading-relaxed">{chat.text}</p></motion.article>)}</div></section>}

      {gallery.length > 0 && <VioletAlbum images={gallery} onSelect={setActiveImage} />}

      <section id="events" className="relative z-10 overflow-hidden bg-[#F0E5F8] px-5 py-24 @md:py-32"><div className="mx-auto max-w-5xl rounded-[2.4rem] bg-[#2A123F] p-7 text-white shadow-[0_30px_80px_rgba(49,20,76,.28)] @md:p-14"><div className="grid gap-10 @md:grid-cols-[.8fr_1.2fr] @md:items-end"><div><p className="text-[10px] font-semibold uppercase tracking-[.28em] text-[#DEC7FF]">Nơi hẹn hò</p><h2 className="mt-5 font-serif text-5xl leading-none @md:text-6xl">{venue}</h2><p className="mt-6 font-sans text-sm leading-7 text-white/70">{address}</p></div><div><p className="font-serif text-3xl text-[#E5D2FF]">{formattedDate}</p><p className="mt-2 text-sm text-white/65">Đón khách lúc {time}</p><CalendarAndMapButtons title={`${finalGroomName} & ${finalBrideName}`} dateStr={date} timeStr={time} venue={venue} address={address} accentColor={accentColor} className="mt-7 justify-start [&_a]:border-white/25 [&_a]:bg-white/10 [&_a]:text-white [&_button]:border-white/25 [&_button]:bg-white/10 [&_button]:text-white" /></div></div></div></section>

      {schedule?.length ? <div className="relative z-10 bg-[#FCFAFE]"><TimelineSection schedule={schedule} accentColor={accentColor} theme={theme} /></div> : null}
      {(extraInfoTitle || extraInfoContent) && <section id="details" className="relative z-10 px-5 py-20"><div className="mx-auto max-w-2xl rounded-[2rem] border border-white bg-white/70 p-8 text-center shadow-sm @md:p-12"><MoonStar className="mx-auto h-5 w-5 text-[#8A65AF]" /><h2 className="mt-5 font-serif text-3xl">{extraInfoTitle || "Điều nhỏ xinh"}</h2><p className="mt-4 whitespace-pre-line font-sans text-sm leading-7 text-[#6D597C]">{extraInfoContent}</p></div></section>}

      <div className="relative z-10 bg-[#241136]">
        <BankRegistrySection groomBank={groomBank} brideBank={brideBank} accentColor={accentColor} theme={theme} />
      </div>
      {/* ═══ DRESS CODE ═══ */}
      <section className="py-20 px-6" style={{ background: 'linear-gradient(180deg, #FAF5FF 0%, #F3E8FF 100%)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: '#8B5CF6' }}>Dress Code</p>
          <h2 className="font-serif text-3xl italic mb-12" style={{ color: '#6D28D9' }}>Trang phục tham dự</h2>
          <div className="flex justify-center gap-8 flex-wrap">
            {[
              { color: '#FAF5FF', border: '#C4B5FD', label: 'Tím nhạt' },
              { color: '#C4B5FD', border: '#8B5CF6', label: 'Lavender' },
              { color: '#8B5CF6', border: '#6D28D9', label: 'Violet' },
              { color: '#FFFFFF', border: '#C4B5FD', label: 'Trắng tinh' },
            ].map(({ color, border, label }) => (
              <div key={label} className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full shadow-md transition-transform hover:scale-110" style={{ backgroundColor: color, border: `2px solid ${border}` }} />
                <span className="text-[10px] uppercase tracking-widest" style={{ color: '#8B5CF6' }}>{label}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm font-light" style={{ color: '#A78BFA' }}>Trang phục nhẹ nhàng, tông màu tím mộng mơ.</p>
        </div>
      </section>

      {rsvpEnabled && <section className="violet-rsvp relative z-10 px-5 py-24 @md:py-32"><div className="mx-auto max-w-4xl rounded-[2rem] border bg-white p-6 @md:p-12"><VioletHeading eyebrow="Hồi âm" title="Hẹn gặp bạn trong đêm nhiệm màu" /><div className="mt-10"><RSVPSection theme={theme} accentColor={accentColor} embedded publicSlug={publicSlug} guestName={publicGuestName} guestToken={publicGuestToken} /></div></div></section>}
      {wishesEnabled && <section id="wishes" className="relative z-10 px-5 py-24 @md:py-32"><div className="mx-auto max-w-5xl"><VioletHeading eyebrow="Lưu bút" title="Những điều ấm áp" /><div className="mt-12"><WishesWall theme={theme} accentColor={accentColor} publicSlug={publicSlug} embedded /></div></div></section>}
      <footer className="violet-footer relative z-10 overflow-hidden px-5 py-28 text-center text-white"><img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" /><Constellation /><div className="relative"><p className="text-[10px] font-semibold uppercase tracking-[.35em] text-[#E7D4FF]">Và họ sống hạnh phúc mãi mãi</p><p className="mt-6 font-serif text-5xl @md:text-7xl">{finalGroomName} <i className="text-[#D9B8FF]">&amp;</i> {finalBrideName}</p></div></footer>
      <AnimatePresence><UniversalLightbox images={gallery} currentIndex={activeImage} onClose={() => setActiveImage(null)} onNavigate={setActiveImage} /></AnimatePresence>
      {activeStory !== null && (
        <StoryViewer
          stories={stories}
          initialIndex={activeStory}
          onClose={() => setActiveStory(null)}
          accentColor={accentColor}
        />
      )}
    </div>
  );
};

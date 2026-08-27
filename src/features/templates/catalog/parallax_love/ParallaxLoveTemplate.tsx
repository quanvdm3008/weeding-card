import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Heart, MapPin } from "lucide-react";
import type { TemplateProps } from "@/features/template/components/types";
import { WEDDING_SEED_DATA } from "@/data/seedData";
import parallaxHero from "@/assets/template-parallax-love.png";
import { RSVPSection } from "@/components/wedding/RSVPSection";
import WishesWall from "@/components/wedding/wishes/WishesWall";
import { CalendarAndMapButtons } from "@/components/wedding/CalendarAndMapButtons";
import { BankRegistrySection } from "@/components/wedding/sections/BankRegistrySection";
import UniversalLightbox from "@/components/galleries/UniversalLightbox";
import ParentsSection from "@/components/wedding/sections/ParentsSection";
import TimelineSection from "@/components/wedding/sections/TimelineSection";
import { useCountdown } from "@/hooks/useCountdown";

const SectionHeading = ({ eyebrow, title, light = false }: { eyebrow: string; title: string; light?: boolean }) => (
  <div className="mx-auto max-w-2xl text-center">
    <p className={`text-[10px] font-semibold uppercase tracking-[0.34em] ${light ? "text-[#E5CDAA]" : "text-[#857461]"}`}>{eyebrow}</p>
    <h2 className={`mt-4 font-serif text-4xl leading-none @md:text-6xl ${light ? "text-[#F8F4EA]" : "text-[#28312A]"}`}>{title}</h2>
  </div>
);

export const ParallaxLoveTemplate = ({
  groomName = WEDDING_SEED_DATA.groomName,
  brideName = WEDDING_SEED_DATA.brideName,
  date = WEDDING_SEED_DATA.date,
  time = WEDDING_SEED_DATA.time,
  venue = WEDDING_SEED_DATA.venue,
  address = WEDDING_SEED_DATA.address,
  message = WEDDING_SEED_DATA.message,
  accentColor = "#8C7A6B",
  publicSlug,
  publicGuestName,
  publicGuestToken,
  rsvpEnabled = true,
  wishesEnabled = true,
  galleryImageUrls = WEDDING_SEED_DATA.galleryImageUrls,
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
  theme,
}: TemplateProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const messageRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end end"] });
  const heroBackdropY = useTransform(heroProgress, [0, 1], ["0%", "18%"]);
  const heroRearY = useTransform(heroProgress, [0, 1], ["0%", "-14%"]);
  const heroMainY = useTransform(heroProgress, [0, 1], ["0%", "-34%"]);
  const heroFrontY = useTransform(heroProgress, [0, 1], ["0%", "-50%"]);
  const heroCopyY = useTransform(heroProgress, [0, 1], ["0%", "-42%"]);
  const heroLeftX = useTransform(heroProgress, [0, 1], ["0%", "-44%"]);
  const heroRightX = useTransform(heroProgress, [0, 1], ["0%", "44%"]);
  const heroMainScale = useTransform(heroProgress, [0, 1], [1, 0.84]);
  const heroRearScale = useTransform(heroProgress, [0, 1], [1, 1.08]);
  const { scrollYProgress: messageProgress } = useScroll({ target: messageRef, offset: ["start start", "end end"] });
  const letterY = useTransform(messageProgress, [0, 1], ["0%", "-7%"]);
  const letterRotate = useTransform(messageProgress, [0, 1], [-2, 2]);
  const letterBackY = useTransform(messageProgress, [0, 1], ["-2%", "9%"]);
  const waxScale = useTransform(messageProgress, [0, 1], [1, 1.22]);
  const { scrollYProgress: galleryProgress } = useScroll({ target: galleryRef, offset: ["start start", "end end"] });
  const deckY = [
    useTransform(galleryProgress, [0, 1], ["-9%", "-40%"]), useTransform(galleryProgress, [0, 1], ["-4%", "-16%"]),
    useTransform(galleryProgress, [0, 1], ["6%", "24%"]), useTransform(galleryProgress, [0, 1], ["12%", "48%"]),
  ];
  const deckX = [
    useTransform(galleryProgress, [0, 1], ["-14%", "-42%"]), useTransform(galleryProgress, [0, 1], ["9%", "37%"]),
    useTransform(galleryProgress, [0, 1], ["-11%", "-48%"]), useTransform(galleryProgress, [0, 1], ["15%", "50%"]),
  ];
  const deckRotate = [
    useTransform(galleryProgress, [0, 1], [-2, -9]), useTransform(galleryProgress, [0, 1], [3, 10]),
    useTransform(galleryProgress, [0, 1], [-5, -13]), useTransform(galleryProgress, [0, 1], [6, 14]),
  ];
  const venueY = useTransform(scrollYProgress, [0.62, 0.86], ["-10%", "10%"]);
  const [activeImage, setActiveImage] = useState<number | null>(null);

  const finalGroomName = groomName || WEDDING_SEED_DATA.groomName;
  const finalBrideName = brideName || WEDDING_SEED_DATA.brideName;
  const finalDate = date || WEDDING_SEED_DATA.date;
  const heroImage = coverImageUrl || parallaxHero;
  const gallery = (galleryImageUrls?.filter(Boolean).length ? galleryImageUrls : WEDDING_SEED_DATA.galleryImageUrls).filter((image) => image !== heroImage);
  const heroStackImages = [heroImage, gallery[0] || heroImage, gallery[1] || heroImage];
  const galleryDeck = gallery.slice(0, 4);
  const deckCaptions = ["Ánh nhìn đầu tiên", "Lời hẹn bên hoa", "Một ngày thật gần", "Bắt đầu mãi mãi"];
  const { days, hours, minutes, seconds } = useCountdown(finalDate, time);
  const formattedDate = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(`${finalDate}T12:00:00`));
  const depthTransition = reduceMotion ? { duration: 0 } : { duration: 0.9, ease: [0.22, 1, 0.36, 1] };

  return (
    <div ref={containerRef} className="relative overflow-x-clip bg-[#F8F5EE] text-[#28312A] [--parallax-accent:var(--invitation-accent-color,#8C7A6B)]">
      <nav className="absolute inset-x-0 top-0 z-40 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 text-white @md:px-10" aria-label="Điều hướng thiệp cưới">
        <a href="#hero" className="font-serif text-lg tracking-wide">M & T</a>
        <div className="flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85 @md:gap-7">
          <a href="#story" className="transition hover:text-white">Chuyện mình</a>
          <a href="#events" className="hidden transition hover:text-white @sm:block">Sự kiện</a>
          <a href="#rsvp" className="rounded-full border border-white/40 px-3 py-2 transition hover:bg-white hover:text-[#28312A]">RSVP</a>
        </div>
      </nav>

      <section ref={heroRef} id="hero" className="relative h-[175svh] bg-[#202A23] text-white">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.img
          src={heroImage}
          alt={`Ảnh cưới ${finalGroomName} và ${finalBrideName}`}
          style={reduceMotion ? undefined : { y: heroBackdropY }}
          className="absolute inset-x-0 -top-[12%] h-[124%] w-full scale-110 object-cover opacity-35 blur-[2px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(221,197,161,.3),transparent_24%),linear-gradient(120deg,rgba(19,28,22,.96),rgba(25,34,27,.78)_56%,rgba(18,25,20,.9))]" />
        <div className="pointer-events-none absolute inset-4 border border-white/20 @md:inset-8" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-[#DCC6A5]/25 blur-3xl" />

        <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-7xl items-center gap-8 px-5 pb-10 pt-24 @md:grid-cols-[.82fr_1.18fr] @md:px-10 @md:py-24">
          <motion.div style={reduceMotion ? undefined : { y: heroCopyY }} initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} transition={depthTransition} className="relative z-20 text-center @md:text-left">
            <p className="mb-7 text-[10px] font-semibold uppercase tracking-[0.42em] text-[#F1E6D5]">Trân trọng báo hỷ</p>
            <h1 className="font-serif text-5xl leading-[.82] drop-shadow-2xl @sm:text-7xl @md:text-7xl @lg:text-[6.8rem]">
              <span className="block">{finalGroomName}</span>
              <span className="my-4 block text-3xl italic text-[#E2C9A9] @md:my-5 @md:text-5xl">&amp;</span>
              <span className="block">{finalBrideName}</span>
            </h1>
            <div className="mt-9 inline-flex border-y border-white/35 px-4 py-4 font-sans text-[10px] uppercase tracking-[0.18em] text-white/90 @md:px-7">
              {formattedDate} <i className="mx-3 inline-block h-1 w-1 rounded-full bg-[#E2C9A9]" /> {time}
            </div>
            <a href="#message" className="mt-10 inline-flex items-center gap-2 font-sans text-[10px] font-semibold uppercase tracking-[0.26em] text-white/90 transition hover:text-white">
              Khám phá lời mời <ChevronDown className="h-4 w-4 animate-bounce" />
            </a>
          </motion.div>

          <div className="relative mx-auto h-[48svh] min-h-[330px] w-full max-w-[680px] [perspective:1600px] @md:h-[72svh] @md:min-h-[580px]">
            <motion.figure style={reduceMotion ? undefined : { y: heroRearY, x: heroRightX, scale: heroRearScale }} initial={{ opacity: 0, x: 45, rotate: 8 }} animate={{ opacity: 0.58, x: 0, rotate: 8 }} transition={{ ...depthTransition, delay: 0.12 }} className="absolute right-[2%] top-[9%] h-[70%] w-[53%] overflow-hidden rounded-[1.75rem] border border-white/25 p-2 shadow-2xl">
              <img src={heroStackImages[1]} alt="" className="h-full w-full rounded-[1.3rem] object-cover grayscale-[.15]" />
            </motion.figure>
            <motion.figure style={reduceMotion ? undefined : { y: heroRearY, x: heroLeftX, scale: heroRearScale }} initial={{ opacity: 0, x: -45, rotate: -9 }} animate={{ opacity: 0.55, x: 0, rotate: -9 }} transition={{ ...depthTransition, delay: 0.2 }} className="absolute bottom-[5%] left-[1%] h-[62%] w-[48%] overflow-hidden rounded-[1.75rem] border border-white/20 p-2 shadow-2xl">
              <img src={heroStackImages[2]} alt="" className="h-full w-full rounded-[1.3rem] object-cover sepia-[.1]" />
            </motion.figure>
            <motion.figure style={reduceMotion ? undefined : { y: heroMainY, scale: heroMainScale }} initial={{ opacity: 0, scale: 0.9, y: 32 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ ...depthTransition, delay: 0.06 }} className="absolute left-1/2 top-1/2 z-10 h-[82%] w-[63%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2.1rem] border border-white/45 bg-[#F5EBDC] p-3 shadow-[0_35px_80px_rgba(0,0,0,.42)]">
              <img src={heroStackImages[0]} alt={`Ảnh cưới ${finalGroomName} và ${finalBrideName}`} className="h-full w-full rounded-[1.55rem] object-cover" />
              <span className="absolute inset-7 rounded-[1.3rem] border border-white/45" />
            </motion.figure>
            <motion.div style={reduceMotion ? undefined : { y: heroFrontY }} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...depthTransition, delay: 0.45 }} className="pointer-events-none absolute bottom-[7%] right-[3%] z-20 grid h-20 w-20 place-items-center rounded-full border border-[#E8D4B6]/70 bg-[#28352A]/85 text-center text-[9px] font-semibold uppercase tracking-[.17em] text-[#F3E6D2] shadow-2xl backdrop-blur-md @md:h-28 @md:w-28">
              <span>Our<br />forever</span>
            </motion.div>
          </div>
        </div>
        </div>
      </section>

      <section ref={messageRef} id="message" className="relative z-10 -mt-8 h-[145svh] rounded-t-[2.25rem] bg-[#EEE6D8] shadow-[0_-16px_48px_rgba(37,43,35,.12)] @md:-mt-14 @md:rounded-t-[4rem]">
        <div className="sticky top-0 h-[100svh] overflow-hidden px-5 py-14 @md:px-10 @md:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_70%,rgba(191,158,112,.22),transparent_22%),radial-gradient(circle_at_82%_25%,rgba(255,255,255,.8),transparent_24%)]" />
          <motion.div style={reduceMotion ? undefined : { y: letterBackY }} className="pointer-events-none absolute left-1/2 top-[23%] h-[58%] w-[min(830px,85vw)] -translate-x-1/2 rotate-[5deg] rounded-[2.4rem] border border-[#BFA987]/35 bg-[#D8C9B4]/45 shadow-[0_28px_55px_rgba(64,49,30,.12)]" />
          <motion.div style={reduceMotion ? undefined : { y: letterY, rotate: letterRotate }} className="relative mx-auto grid h-full max-w-6xl place-items-center">
            <article className="relative w-full max-w-3xl overflow-hidden rounded-[2.2rem] border border-[#D6C4A5] bg-[#FFFDF8] px-8 py-12 text-center shadow-[0_34px_85px_rgba(56,43,28,.2)] @md:px-20 @md:py-16">
              <span className="pointer-events-none absolute inset-4 rounded-[1.7rem] border border-[#DDCFB8]" />
              <motion.span style={reduceMotion ? undefined : { scale: waxScale }} className="relative mx-auto grid h-16 w-16 place-items-center rounded-full border-4 border-[#F7E7D0] bg-[#8B4C43] text-xs font-serif text-[#F9E9D6] shadow-[0_8px_18px_rgba(83,44,37,.32)]">M<br />T</motion.span>
              <p className="relative mt-8 text-[10px] font-semibold uppercase tracking-[.38em] text-[#8C7A6B]">A letter for you</p>
              <p className="relative mt-5 font-serif text-4xl leading-tight text-[#28312A] @md:text-6xl">“Hai tâm hồn,<br />một hành trình đẹp.”</p>
              {message && <p className="relative mx-auto mt-7 max-w-xl font-sans text-sm leading-7 text-[#6D665D] @md:text-base">{message}</p>}
              <div className="relative mt-10 flex items-center justify-center gap-4 text-[10px] font-semibold uppercase tracking-[.22em] text-[#857461]"><span className="h-px w-10 bg-[#C9B28E]" /> {formattedDate} <span className="h-px w-10 bg-[#C9B28E]" /></div>
            </article>
          </motion.div>
        </div>
      </section>

      {(groomParents || brideParents) && (
        <div className="relative z-10 bg-[#F1EBDD] py-5"><ParentsSection groomParents={groomParents} brideParents={brideParents} accentColor={accentColor} theme={theme} /></div>
      )}

      <section className="relative z-10 overflow-hidden bg-[#2C382F] px-5 py-20 text-[#F8F4EA] @md:py-28">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(#D9C4A1_1px,transparent_1px)] [background-size:25px_25px]" />
        <div className="relative mx-auto max-w-5xl">
          <SectionHeading eyebrow="Đếm ngược" title="Ngày vui đang đến gần" light />
          <div className="mt-12 grid grid-cols-2 gap-3 @md:grid-cols-4 @md:gap-5">
            {[{ label: "Ngày", value: days }, { label: "Giờ", value: hours }, { label: "Phút", value: minutes }, { label: "Giây", value: seconds }].map((item, index) => (
              <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08, ...depthTransition }} className="border border-white/15 bg-white/[.07] px-5 py-7 text-center backdrop-blur-sm">
                <p className="font-serif text-5xl text-[#E5CDAA] @md:text-6xl">{item.value}</p>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {stories?.length > 0 && (
        <section id="story" className="relative z-10 overflow-hidden bg-[#F1EBDD] px-5 py-24 @md:py-36">
          <p className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 select-none font-serif text-[18vw] leading-none text-white/45">LOVE</p>
          <div className="relative mx-auto max-w-6xl">
            <SectionHeading eyebrow="Hành trình của chúng mình" title="Chuyện tình yêu" />
            <div className="mt-20 space-y-16 @md:space-y-28">
              {stories.map((story, index) => (
                <motion.article key={`${story.date}-${story.title}`} initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={depthTransition} className={`grid items-center gap-0 @md:grid-cols-2 ${index % 2 ? "@md:[&>div:first-child]:order-2" : ""}`}>
                  <button type="button" onClick={() => setActiveImage(Math.max(0, gallery.indexOf(story.img)))} className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] text-left shadow-[0_24px_55px_rgba(48,43,35,.18)] @md:mx-auto @md:w-[78%]" aria-label={`Mở ảnh ${story.title}`}>
                    <img src={story.img} alt={story.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    <span className="absolute inset-4 border border-white/45" />
                  </button>
                  <div className={`relative z-10 -mt-12 mx-4 rounded-[1.75rem] bg-[#FFFDF8]/95 p-7 shadow-xl backdrop-blur @md:mx-0 @md:mt-0 @md:p-11 ${index % 2 ? "@md:-ml-10" : "@md:-mr-10"}`}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8C7A6B]">{story.date}</p>
                    <h3 className="mt-4 font-serif text-3xl text-[#28312A] @md:text-4xl">{story.title}</h3>
                    <p className="mt-5 font-sans text-sm leading-7 text-[#6D665D]">{story.text}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {chatMessages?.length > 0 && (
        <section className="relative z-10 bg-[#FBF9F4] px-5 py-24 @md:py-32">
          <SectionHeading eyebrow="Những lời thì thầm" title="Đoạn hội thoại nhỏ" />
          <div className="mx-auto mt-14 max-w-2xl space-y-8">
            {chatMessages.map((chat, index) => (
              <motion.article key={`${chat.time}-${index}`} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08, ...depthTransition }} className={`max-w-[82%] rounded-3xl px-6 py-5 ${chat.sender === "groom" ? "mr-auto bg-[#EAE2D4]" : "ml-auto bg-[#2C382F] text-white"}`}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-55">{chat.sender === "groom" ? finalGroomName : finalBrideName} · {chat.time}</p>
                <p className="mt-2 font-serif text-lg leading-relaxed">{chat.text}</p>
              </motion.article>
            ))}
          </div>
        </section>
      )}

      {galleryDeck.length > 0 && (
        <section ref={galleryRef} id="gallery" className="relative z-10 h-[175svh] overflow-clip bg-[#E6DDCD]">
          <div className="sticky top-0 h-[100svh] overflow-hidden px-5 py-10 @md:px-10 @md:py-14">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_71%_52%,rgba(255,255,255,.84),transparent_25%),linear-gradient(115deg,rgba(255,255,255,.34),transparent_42%)]" />
            <div className="pointer-events-none absolute inset-y-0 right-[6%] w-px bg-[#A58F70]/25" />
            <div className="relative mx-auto grid h-full max-w-7xl items-center gap-2 @md:grid-cols-[.68fr_1.32fr] @md:gap-10">
              <div className="relative z-10 max-w-md pt-8 text-center @md:text-left">
                <p className="text-[10px] font-semibold uppercase tracking-[.34em] text-[#857461]">The keepsake edit · 04 frames</p>
                <h2 className="mt-5 font-serif text-5xl leading-[.92] text-[#28312A] @md:text-7xl">Ký ức<br /><i className="font-normal text-[#9A8062]">không nằm yên.</i></h2>
                <p className="mx-auto mt-6 max-w-sm font-sans text-sm leading-7 text-[#6D665D] @md:mx-0">Một bộ ảnh cưới được kể như những tấm film quý—càng cuộn, các lát cắt của ngày vui càng mở ra.</p>
                <div className="mt-9 hidden items-center gap-3 text-[10px] font-semibold uppercase tracking-[.22em] text-[#857461] @md:flex"><span className="h-px w-16 bg-[#A58F70]/60" /> Kéo để mở lớp ảnh</div>
              </div>
              <div className="relative mx-auto h-[58svh] w-full max-w-[760px] [perspective:1800px] @md:h-[76svh]">
                <p className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 select-none font-serif text-[30vw] leading-none text-white/50 @md:text-[21vw]">US</p>
                <span className="pointer-events-none absolute left-[8%] top-[12%] h-[72%] w-[75%] rounded-full border border-[#A58F70]/20" />
                <span className="pointer-events-none absolute left-[15%] top-[20%] h-[58%] w-[64%] rounded-full border border-dashed border-[#A58F70]/20" />
              {galleryDeck.map((image, index) => (
                <motion.button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  style={reduceMotion ? undefined : { x: deckX[index], y: deckY[index], rotate: deckRotate[index] }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, ...depthTransition }}
                  className={`group absolute left-1/2 top-1/2 w-[53%] overflow-hidden rounded-[1.85rem] border-[8px] border-[#FFFDF8] bg-[#FFFDF8] text-left shadow-[0_34px_70px_rgba(48,43,35,.3)] @md:w-[35%] ${index === 0 ? "z-10 aspect-[4/5] -translate-x-[72%] -translate-y-[62%]" : index === 1 ? "z-20 aspect-[3/4] -translate-x-[42%] -translate-y-[53%]" : index === 2 ? "z-30 aspect-[4/5] -translate-x-[66%] -translate-y-[35%]" : "z-40 aspect-[3/4] -translate-x-[35%] -translate-y-[42%]"}`}
                  aria-label={`Mở ảnh cưới ${index + 1}`}
                >
                  <img src={image} alt={`Khoảnh khắc cưới ${index + 1}`} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <span className="absolute inset-3 rounded-[1.3rem] border border-white/65" />
                  <span className="absolute bottom-4 left-4 right-4 flex items-end justify-between border-t border-white/45 pt-3 text-[9px] font-semibold uppercase tracking-[.16em] text-white drop-shadow"><i className="font-normal">{deckCaptions[index]}</i><b>{String(index + 1).padStart(2, "0")}</b></span>
                </motion.button>
              ))}
                <div className="pointer-events-none absolute bottom-[4%] left-[4%] z-50 hidden rounded-full border border-[#A58F70]/30 bg-[#FBF8F0]/75 px-4 py-2 text-[9px] font-semibold uppercase tracking-[.2em] text-[#6B5C4D] shadow-sm backdrop-blur @md:block">M &amp; T · Wedding edition</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {gallery.length > galleryDeck.length && (
        <section className="relative z-10 bg-[#EEE6D8] px-5 py-24 @md:py-32">
          <div className="mx-auto max-w-6xl"><SectionHeading eyebrow="Phim ảnh ngày vui" title="Những khung hình còn lại" />
            <p className="mx-auto mt-5 max-w-xl text-center font-sans text-sm leading-7 text-[#6D665D]">Một contact sheet thân mật—mỗi tấm ảnh là một lát cắt của ngày chúng mình cùng nhớ.</p>
            <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-4 @md:grid-cols-5 @md:gap-6">
              {gallery.slice(galleryDeck.length).map((image, index) => (
                <button key={`${image}-${index + galleryDeck.length}`} type="button" onClick={() => setActiveImage(index + galleryDeck.length)} className={`group relative overflow-hidden rounded-[1.4rem] border-4 border-[#FFFDF8] bg-[#FFFDF8] text-left shadow-[0_16px_34px_rgba(48,43,35,.16)] transition hover:-translate-y-1 ${index === 0 ? "@md:col-span-2 @md:row-span-2" : ""}`} aria-label={`Mở ảnh cưới ${index + galleryDeck.length + 1}`}>
                  <img src={image} alt={`Khoảnh khắc cưới ${index + galleryDeck.length + 1}`} loading="lazy" className="h-full min-h-40 w-full object-cover transition duration-700 group-hover:scale-105" />
                  <span className="absolute inset-3 border border-white/60" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-[#28312A]/80 px-3 py-1 text-[9px] font-semibold uppercase tracking-[.18em] text-white backdrop-blur">Frame {String(index + galleryDeck.length + 1).padStart(2, "0")}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="events" className="relative z-10 overflow-hidden bg-[#2C382F] text-white">
        <div className="relative h-[48svh] min-h-80 overflow-hidden">
          <motion.img src={gallery[0] || heroImage} alt={`Không gian ${venue}`} style={reduceMotion ? undefined : { y: venueY }} className="absolute inset-x-0 -top-[12%] h-[124%] w-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-[#172018]/55" />
          <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-5 text-center">
            <MapPin className="h-6 w-6 text-[#E5CDAA]" />
            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.32em] text-white/70">Nơi chúng mình gặp nhau</p>
            <h2 className="mt-4 font-serif text-5xl @md:text-7xl">{venue}</h2>
            <p className="mt-5 max-w-xl font-sans text-sm leading-6 text-white/75">{address}</p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-8 px-5 py-16 @md:grid-cols-[.8fr_1.2fr] @md:px-8 @md:py-20">
          <div><p className="text-[10px] font-semibold uppercase tracking-[.28em] text-[#E5CDAA]">Lễ thành hôn</p><p className="mt-3 font-serif text-4xl">{formattedDate}</p><p className="mt-3 font-sans text-sm text-white/65">Đón khách lúc {time}</p></div>
          <CalendarAndMapButtons title={`${finalGroomName} & ${finalBrideName}`} dateStr={finalDate} timeStr={time} venue={venue} address={address} accentColor={accentColor} className="mt-0 justify-start [&_a]:border-white/25 [&_a]:bg-white/10 [&_a]:text-white [&_button]:border-white/25 [&_button]:bg-white/10 [&_button]:text-white" />
        </div>
      </section>

      {schedule?.length ? <div className="relative z-10 bg-[#FBF9F4]"><TimelineSection schedule={schedule} accentColor={accentColor} theme={theme} /></div> : null}

      {(extraInfoTitle || extraInfoContent) && (
        <section className="relative z-10 bg-[#F1EBDD] px-5 py-20"><div className="mx-auto max-w-2xl rounded-[2rem] border border-[#D8C9B4] bg-[#FFFDF8] p-8 text-center shadow-sm @md:p-12"><Heart className="mx-auto h-5 w-5" style={{ color: accentColor }} /><h2 className="mt-5 font-serif text-3xl">{extraInfoTitle || "Thông tin thêm"}</h2><p className="mt-4 whitespace-pre-line font-sans text-sm leading-7 text-[#6D665D]">{extraInfoContent}</p></div></section>
      )}

      <div className="relative z-10 bg-[#EEE6D8]">
        <BankRegistrySection
          groomBank={groomBank}
          brideBank={brideBank}
          accentColor={accentColor}
          theme={theme}
        />
      </div>

      {/* ═══ DRESS CODE ═══ */}
      <section className="py-20 px-6" style={{ background: 'linear-gradient(180deg, #FFF8F8 0%, #FADADD 20%, #FFF8F8 100%)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: '#B5838D' }}>Dress Code</p>
          <h2 className="font-serif text-3xl italic mb-12" style={{ color: '#8B5563' }}>Trang phục tham dự</h2>
          <div className="flex justify-center gap-8 flex-wrap">
            {[
              { color: '#FADADD', border: '#B5838D', label: 'Blush hồng' },
              { color: '#B5838D', border: '#8B5563', label: 'Hồng đất' },
              { color: '#F9F4EF', border: '#D4B8A0', label: 'Nude kem' },
              { color: '#FFFFFF', border: '#FADADD', label: 'Trắng' },
            ].map(({ color, border, label }) => (
              <div key={label} className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full shadow-md transition-transform hover:scale-110" style={{ backgroundColor: color, border: `2px solid ${border}` }} />
                <span className="text-[10px] uppercase tracking-widest" style={{ color: '#B5838D' }}>{label}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm font-light" style={{ color: '#B5838D' }}>Trang phục thanh lịch, tông màu hồng ngọt ngào.</p>
        </div>
      </section>

      {rsvpEnabled && (
        <section className="relative z-10 bg-[#FBF9F4] px-5 py-24 @md:py-32"><div className="mx-auto max-w-4xl rounded-[2rem] border border-[#E2D7C6] bg-white p-6 shadow-[0_24px_65px_rgba(48,43,35,.1)] @md:p-12"><SectionHeading eyebrow="Hồi âm" title="Hẹn gặp bạn trong ngày vui" /><div className="mt-10"><RSVPSection theme={theme} accentColor={accentColor} embedded publicSlug={publicSlug} guestName={publicGuestName} guestToken={publicGuestToken} /></div></div></section>
      )}

      {wishesEnabled && (
        <WishesWall theme={theme} accentColor={accentColor} publicSlug={publicSlug} embedded={false} />
      )}

      <footer className="relative z-10 overflow-hidden bg-[#28312A] px-5 py-28 text-center text-white"><img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" /><div className="relative"><p className="text-[10px] font-semibold uppercase tracking-[.35em] text-[#E5CDAA]">Cảm ơn vì đã đến</p><p className="mt-6 font-serif text-5xl @md:text-7xl">{finalGroomName} <i className="text-[#E5CDAA]">&amp;</i> {finalBrideName}</p></div></footer>

      <AnimatePresence><UniversalLightbox images={gallery} currentIndex={activeImage} onClose={() => setActiveImage(null)} onNavigate={setActiveImage} /></AnimatePresence>
    </div>
  );
};

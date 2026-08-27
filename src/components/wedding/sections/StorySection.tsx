import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Mail, Coffee, Plane, Camera, Gift, Sparkles } from "lucide-react";
import type { WeddingTheme } from "@/data/themes";
import PhotoFrame from "@/components/PhotoFrame";
import { SparklingImage } from "@/components/wedding/SparklingImage";
import ringsImg from "@/assets/rings.jpg";
import couple1 from "@/assets/couple-1.jpg";
import couple2 from "@/assets/couple-2.jpg";
import couple3 from "@/assets/couple-3.jpg";
import coupleProposal from "@/assets/couple-proposal.jpg";
import coupleTravel from "@/assets/couple-travel.jpg";
import coupleCeremony from "@/assets/couple-ceremony.jpg";
import type { StoryMilestone } from "@/data/seedData";

import { BohoStory } from "@/features/templates/catalog/boho/sections/BohoStory";
import { TropicalStory } from "@/features/templates/catalog/tropical/sections/TropicalStory";
import { VintageStory } from "@/features/templates/catalog/vintage/sections/VintageStory";
import { MinimalStory } from "@/features/templates/catalog/minimal/sections/MinimalStory";
import { ModernStory } from "@/features/templates/catalog/modern/sections/ModernStory";
import { BotanicalStory } from "@/features/templates/catalog/botanical/sections/BotanicalStory";
import { CinematicStory } from "@/features/templates/catalog/cinematic/sections/CinematicStory";
import { EditorialStory } from "@/features/templates/catalog/editorial/sections/EditorialStory";

// ─── Story Events ─────────────────────────────────────
const storyEvents = [
  { date: "March, 2020", title: "First Meeting", desc: "We met for the first time at a small coffee shop. The first look touches the heart.", image: couple3, icon: Coffee },
  { date: "September 2021", title: "Maiden voyage", desc: "Let's welcome the sunrise together on a pristine beach, realizing we are made for each other.", image: coupleTravel, icon: Plane },
  { date: "June 2022", title: "Say love", desc: "Take a walk by the river in the evening, hold hands and feel your hearts beat in unison.", image: couple2, icon: Heart },
  { date: "December 2023", title: "Proposal", desc: "On the romantic sunset beach, I knelt down and said my lifelong promise to be with you.", image: coupleProposal, icon: Gift },
  { date: "October 2024", title: "First set of photos", desc: "Save the brightest smiles, ready to enter a new chapter filled with happiness.", image: couple1, icon: Camera },
  { date: "December 2025", title: "Meet the family", desc: "In the presence of our loved ones, we exchanged a hundred-year vow.", image: coupleCeremony, icon: Sparkles },
  { date: "December 2025", title: "Big day", desc: "We officially became a family, starting a new journey full of love.", image: ringsImg, icon: Heart },
];

const TimelineLuxury = ({ accentColor }: { accentColor: string; theme: WeddingTheme }) => (
  <div className="relative">
    <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#D5B36A]/40 to-transparent -translate-x-1/2 hidden md:block" />
    <div className="space-y-24">
      {storyEvents.map((story, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className={`flex flex-col md:flex-row items-center gap-8 sm:gap-16 ${
            idx % 2 === 1 ? "md:flex-row-reverse" : ""
          }`}
        >
          <div className={`w-full md:w-1/2 flex justify-center ${idx % 2 === 1 ? "md:justify-start" : "md:justify-end"}`}>
            <div className="relative w-64 h-80 sm:w-72 sm:h-96">
              <div className="absolute inset-[-8px] border border-[#D5B36A]/20" />
              <div className="absolute inset-[-3px] border-[0.5px] border-[#D5B36A]/10" />
              
              <div className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 bg-[#080808] border border-[#D5B36A] hidden md:block ${
                idx % 2 === 1 ? "-left-10" : "-right-10"
              }`} />

              <div className="w-full h-full overflow-hidden bg-black/50">
                <SparklingImage
                  accentColor={accentColor}
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover filter sepia-[0.2] contrast-[1.1] transition-transform duration-1000 hover:scale-105"
                />
              </div>
            </div>
          </div>

          <div className={`w-full md:w-1/2 text-center ${idx % 2 === 1 ? "md:text-left" : "md:text-right"}`}>
            <span className="inline-block px-4 py-1 border border-[#D5B36A]/30 font-sans text-[10px] tracking-[0.2em] uppercase text-[#D5B36A] mb-6">
              {story.date}
            </span>
            <h3 className="font-display text-2xl sm:text-3xl text-[#FFF5D6] mb-4">
              {story.title}
            </h3>
            <p className="font-serif text-sm sm:text-base text-neutral-400 leading-relaxed font-light">
              {story.desc}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const TimelineRoyal = ({ accentColor }: { accentColor: string; theme: WeddingTheme }) => (
  <section className="royal-marble relative bg-transparent text-white w-full">
    <div className="mx-auto max-w-4xl">
      <div className="relative">
        <div className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-[#c9a45a]/40 md:block" />
        <div className="space-y-20">
          {storyEvents.map((story, index) => (
            <motion.div key={`${story.title}-${index}`} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`relative z-10 flex flex-col items-center gap-12 md:flex-row ${index % 2 ? "md:flex-row-reverse" : ""}`}>
              <div className="w-full md:w-1/2">
                <div className="mx-auto h-80 w-64 rotate-[-1deg] border border-[#c9a45a] bg-white p-3 shadow-xl">
                  <img src={story.image} alt={story.title} className="h-full w-full object-cover" />
                </div>
              </div>
              <div className={`w-full border border-[#2a1020]/10 bg-[#fffaf1]/80 p-8 backdrop-blur-sm md:w-1/2 ${index % 2 ? "md:text-right" : "md:text-left"}`}>
                <span className="mb-3 block text-sm font-bold uppercase tracking-[.2em] text-[#9c752e]">{story.date}</span>
                <h3 className="mb-4 text-2xl text-[#2a1020]">{story.title}</h3>
                <p className="font-sans text-sm leading-relaxed text-neutral-600">{story.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// Timeline — Cinematic (royal): single-column film-reel, sprocket strip + frame number
const TimelineFilmReel = ({ accentColor }: { accentColor: string; theme: WeddingTheme }) => (
  <div className="space-y-10 max-w-xl mx-auto">
    {storyEvents.map((event, i) => (
      <motion.div key={event.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="relative">
        <div className="flex h-2 justify-between px-2 mb-[-1px] relative z-10">
          {Array.from({ length: 10 }).map((_, d) => <span key={d} className="w-1.5 h-1.5 rounded-sm bg-background" style={{ outline: `1px solid ${accentColor}50` }} />)}
        </div>
        <div className="relative border" style={{ borderColor: `${accentColor}50` }}>
          <img src={event.image} alt={event.title} loading="lazy" className="w-full h-56 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <span className="absolute top-3 right-3 font-body text-[10px] tracking-widest text-white/80 border border-white/40 px-2 py-0.5">No. {String(i + 1).padStart(2, "0")}</span>
          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-[11px] tracking-wider uppercase text-white/70 font-body">{event.date}</span>
            <h3 className="font-display text-2xl font-bold text-white">{event.title}</h3>
          </div>
        </div>
        <div className="flex h-2 justify-between px-2 mt-[-1px]">
          {Array.from({ length: 10 }).map((_, d) => <span key={d} className="w-1.5 h-1.5 rounded-sm bg-background" style={{ outline: `1px solid ${accentColor}50` }} />)}
        </div>
        <p className="text-muted-foreground font-body text-sm leading-relaxed mt-3">{event.desc}</p>
      </motion.div>
    ))}
  </div>
);

// Timeline — Magazine (modern): editorial spread with ghost year watermark, no connecting line
const TimelineEditorial = ({ accentColor }: { accentColor: string; theme: WeddingTheme }) => (
  <div className="space-y-16">
    {storyEvents.map((event, i) => (
      <motion.div key={event.title} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
        className={`relative grid @md:grid-cols-2 gap-8 items-center pb-12 ${i < storyEvents.length - 1 ? "border-b" : ""}`} style={{ borderColor: `${accentColor}20` }}>
        <span className="absolute -top-6 right-0 font-display text-7xl @md:text-8xl font-bold opacity-[0.06] select-none pointer-events-none">{event.date.split(", ")[1]}</span>
        <div className={`relative z-10 ${i % 2 === 1 ? "@md:order-2" : ""}`}>
          <img src={event.image} alt={event.title} loading="lazy" className="w-full h-64 object-cover" />
        </div>
        <div className="relative z-10">
          <span className="font-body text-xs font-bold tracking-[0.3em] uppercase" style={{ color: accentColor }}>{event.date}</span>
          <h3 className="font-display text-3xl font-bold text-foreground mt-2 mb-3">{event.title}</h3>
          <p className="text-muted-foreground font-body text-sm leading-relaxed">{event.desc}</p>
        </div>
      </motion.div>
    ))}
  </div>
);

// Timeline — Fluid (garden): organic blob photos linked by a curved path
const TimelineOrganicPath = ({ accentColor, theme }: { accentColor: string; theme: WeddingTheme }) => (
  <div className="relative">
    <svg className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-2 hidden @md:block" viewBox="0 0 2 800" preserveAspectRatio="none">
      <path d="M1 0 Q 40 200, 1 400 Q -40 600, 1 800" stroke={`${accentColor}50`} strokeWidth="2" fill="none" />
    </svg>
    {storyEvents.map((event, i) => (
      <motion.div key={event.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}
        className={`relative mb-16 @md:mb-20 flex flex-col @md:flex-row items-center gap-8 ${i % 2 === 0 ? "@md:flex-row" : "@md:flex-row-reverse"}`}>
        <div className={`flex-1 ${i % 2 === 0 ? "@md:text-right" : "@md:text-left"}`}>
          <span className="font-body text-xs font-semibold tracking-wider uppercase" style={{ color: accentColor }}>{event.date}</span>
          <h3 className="font-display text-2xl font-bold text-foreground mt-1 mb-2">{event.title}</h3>
          <p className="text-muted-foreground font-body text-sm leading-relaxed">{event.desc}</p>
        </div>
        <div className="flex-1">
          <PhotoFrame variant={theme.styleVariant} accentColor={accentColor} className="w-full">
            <img src={event.image} alt={event.title} loading="lazy" className="w-full h-56 object-cover" />
          </PhotoFrame>
        </div>
      </motion.div>
    ))}
  </div>
);

// Timeline — Glass (sakura): staggered frosted cards with depth
const TimelineFloatingGlass = ({ accentColor }: { accentColor: string; theme: WeddingTheme }) => (
  <div className="space-y-6">
    {storyEvents.map((event, i) => (
      <motion.div key={event.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
        className="flex flex-col @md:flex-row items-center gap-6 rounded-3xl border border-white/30 bg-white/10 backdrop-blur-xl shadow-xl p-5"
        style={{ marginLeft: i % 2 === 0 ? 0 : "auto", marginRight: i % 2 === 0 ? "auto" : 0, maxWidth: "90%" }}>
        <img src={event.image} alt={event.title} loading="lazy" className="w-full @md:w-40 h-32 object-cover rounded-2xl flex-shrink-0" />
        <div>
          <span className="font-body text-xs font-semibold tracking-wider uppercase" style={{ color: accentColor }}>{event.date}</span>
          <h3 className="font-display text-xl font-bold text-foreground mt-1 mb-1">{event.title}</h3>
          <p className="text-muted-foreground font-body text-sm leading-relaxed">{event.desc}</p>
        </div>
      </motion.div>
    ))}
  </div>
);

// Timeline — Tropical Vertical (Matches User Image): Vertical line, right-aligned cards with hover image reveal
const TimelineTropicalVertical = ({ accentColor }: { accentColor: string; theme: WeddingTheme }) => (
  <div className="relative max-w-lg mx-auto py-8">
    {/* The vertical line */}
    <div className="absolute left-[29px] top-4 bottom-4 w-[1px]" style={{ backgroundColor: `${accentColor}40` }} />
    
    <div className="space-y-12">
      {storyEvents.map((event, i) => {
        const Icon = event.icon || Heart;
        return (
          <motion.div 
            key={event.title} 
            initial={{ opacity: 0, x: -20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ delay: i * 0.1, duration: 0.6 }} 
            className="relative flex items-center group cursor-pointer"
          >
            {/* Dot on the line */}
            <div className="absolute left-[30px] top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full z-10 transition-transform duration-300 group-hover:scale-150" style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}80` }} />
            
            {/* The Card */}
            <div className="ml-16 bg-white/95 backdrop-blur-md rounded-2xl shadow-sm border border-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden relative w-full h-[88px]" style={{ maxWidth: 320 }}>
              
              {/* Default Card Content (Icon + Text) */}
              <div className="absolute inset-0 z-10 p-4 flex items-center gap-4 transition-transform duration-500 group-hover:-translate-y-full">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                  <Icon className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground text-[17px] leading-tight mb-1">{event.title}</h3>
                  <span className="font-body text-[13px] text-muted-foreground block">{event.date}</span>
                </div>
              </div>

              {/* Animated Image Reveal Layer on Hover */}
              <div
                className="absolute inset-0 z-20 h-full w-full bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform ease-out"
                  style={{ transitionDuration: "2000ms" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Hover Text Content overlay */}
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <h3 className="font-display font-semibold text-white text-[15px]">{event.title}</h3>
                  <p className="font-body text-[11px] text-white/90 mt-0.5 line-clamp-1">{event.desc}</p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
);

// Timeline — Letter (romantic): stacked love-letter cards
const TimelineLoveLetters = ({ accentColor }: { accentColor: string; theme: WeddingTheme }) => (
  <div className="space-y-8 max-w-2xl mx-auto">
    {storyEvents.map((event, i) => (
      <motion.div key={event.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
        className="relative bg-white/80 backdrop-blur-sm rounded-sm p-6 @md:p-8 shadow-md flex flex-col @md:flex-row gap-5" style={{ boxShadow: `0 10px 30px -12px ${accentColor}40` }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 mx-auto @md:mx-0" style={{ backgroundColor: `${accentColor}18`, color: accentColor }}>
          <Mail className="w-7 h-7" />
        </div>
        <div className="text-center @md:text-left">
          <span className="font-display italic text-sm" style={{ color: accentColor }}>{event.date}</span>
          <h3 className="font-display text-2xl font-bold text-foreground mt-1 mb-2">{event.title}</h3>
          <p className="text-muted-foreground font-body text-sm leading-relaxed italic">"{event.desc}"</p>
        </div>
      </motion.div>
    ))}
  </div>
);

// Timeline — Minimal (minimalist): plain numbered list, no card chrome
const TimelineMinimalList = ({ accentColor }: { accentColor: string; theme: WeddingTheme }) => (
  <div className="max-w-2xl mx-auto divide-y divide-border">
    {storyEvents.map((event, i) => (
      <motion.div key={event.title} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex items-center gap-6 py-8">
        <span className="font-display text-3xl font-light flex-shrink-0" style={{ color: accentColor }}>{String(i + 1).padStart(2, "0")}</span>
        <img src={event.image} alt={event.title} loading="lazy" className="w-16 h-16 object-cover flex-shrink-0" />
        <div>
          <span className="font-body text-[11px] uppercase tracking-[0.3em] text-muted-foreground">{event.date}</span>
          <h3 className="font-display text-lg font-semibold text-foreground">{event.title}</h3>
        </div>
      </motion.div>
    ))}
  </div>
);

// Timeline — Vintage: album-page grid of corner-mounted photos
const TimelinePhotoAlbum = ({ accentColor, theme }: { accentColor: string; theme: WeddingTheme }) => (
  <div className="grid @sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
    {storyEvents.map((event, i) => (
      <motion.div key={event.title} initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
        <PhotoFrame variant={theme.styleVariant} accentColor={accentColor} rotate={i % 2 === 0 ? -2 : 2} className="inline-block">
          <img src={event.image} alt={event.title} loading="lazy" className="w-full h-44 object-cover" />
        </PhotoFrame>
        <p className="font-display italic text-sm mt-3" style={{ color: "#8B6914" }}>{event.date}</p>
        <h3 className="font-display text-lg font-bold text-foreground">{event.title}</h3>
      </motion.div>
    ))}
  </div>
);

// Timeline — Rustic: corkboard with pinned photos & criss-crossing twine
const TimelineTwineBoard = ({ accentColor, theme }: { accentColor: string; theme: WeddingTheme }) => (
  <div className="relative grid @sm:grid-cols-2 gap-10 max-w-3xl mx-auto py-4">
    <svg className="absolute inset-0 w-full h-full hidden @sm:block pointer-events-none" style={{ opacity: 0.4 }}>
      <line x1="25%" y1="20%" x2="75%" y2="80%" stroke={accentColor} strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1="75%" y1="20%" x2="25%" y2="80%" stroke={accentColor} strokeWidth="1.5" strokeDasharray="4 4" />
    </svg>
    {storyEvents.map((event, i) => (
      <motion.div key={event.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative z-10 text-center">
        <PhotoFrame variant={theme.styleVariant} accentColor={accentColor} rotate={i % 2 === 0 ? -3 : 3} className="inline-block">
          <img src={event.image} alt={event.title} loading="lazy" className="w-full h-40 object-cover" />
        </PhotoFrame>
        <span className="font-body text-[11px] font-semibold tracking-wider uppercase block mt-3" style={{ color: accentColor }}>{event.date}</span>
        <h3 className="font-display text-lg font-bold text-foreground">{event.title}</h3>
      </motion.div>
    ))}
  </div>
);

// Timeline: Horizontal Carousel (Gallery/boho) — center big, sides small, auto-rotate
const TimelineHorizontal = ({ accentColor, theme }: { accentColor: string; theme: WeddingTheme }) => {
  const [active, setActive] = useState(0);
  const total = storyEvents.length;

  useEffect(() => {
    const timer = setInterval(() => setActive((p) => (p + 1) % total), 12000);
    return () => clearInterval(timer);
  }, [total]);

  return (
    <div className="relative">
      <div className="flex items-center justify-center gap-4 @md:gap-6 py-8" style={{ minHeight: 380 }}>
        {storyEvents.map((event, i) => {
          const offset = (i - active + total) % total;
          const isCenter = offset === 0;
          const isLeft = offset === total - 1;
          const isRight = offset === 1;
          const isVisible = isCenter || isLeft || isRight;

          if (!isVisible) return null;

          return (
            <motion.div
              key={event.title}
              layout
              animate={{
                scale: isCenter ? 1 : 0.75,
                opacity: isCenter ? 1 : 0.5,
                zIndex: isCenter ? 10 : 1,
                x: isLeft ? -40 : isRight ? 40 : 0,
              }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`cursor-pointer ${isCenter ? "w-80 @md:w-[420px]" : "w-56 @md:w-72"} flex-shrink-0 bg-card ${theme.cardRadius} overflow-hidden shadow-xl border border-border`}
              onClick={() => setActive(i)}
            >
              <div className="relative">
                <img src={event.image} alt={event.title} loading="lazy" className={`w-full object-cover ${isCenter ? "h-48 @md:h-56" : "h-32 @md:h-40"}`} />
                {isCenter && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
                  />
                )}
              </div>
              <div className={`p-4 ${isCenter ? "" : "hidden @md:block"}`}>
                <span className="font-body text-xs font-semibold uppercase" style={{ color: accentColor }}>{event.date}</span>
                <h3 className={`font-display font-bold text-foreground mt-1 ${isCenter ? "text-lg" : "text-sm"}`}>{event.title}</h3>
                {isCenter && <p className="text-muted-foreground font-body text-xs leading-relaxed mt-1">{event.desc}</p>}
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="flex justify-center gap-2 mt-2">
        {storyEvents.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} className="w-2.5 h-2.5 rounded-full transition-all duration-300" style={{ backgroundColor: i === active ? accentColor : `${accentColor}30`, transform: i === active ? "scale(1.3)" : "scale(1)" }} />
        ))}
      </div>
    </div>
  );
};

const StorySection = ({ accentColor, sectionBg, theme, stories }: { accentColor: string; sectionBg?: string; theme: WeddingTheme; stories?: StoryMilestone[] }) => {
  const renderTimeline = () => {
    if (theme.id === "royal") return <TimelineRoyal accentColor={accentColor} theme={theme} />;
    if (theme.id === "luxury") return <TimelineLuxury accentColor={accentColor} theme={theme} />;
    switch (theme.styleVariant) {
      case "cinematic": return <TimelineFilmReel accentColor={accentColor} theme={theme} />;
      case "magazine": return <TimelineEditorial accentColor={accentColor} theme={theme} />;
      case "fluid": return <TimelineOrganicPath accentColor={accentColor} theme={theme} />;
      case "glass": return <TimelineFloatingGlass accentColor={accentColor} theme={theme} />;
      case "map": return <TimelineTropicalVertical accentColor={accentColor} theme={theme} />;
      case "gallery": return <TimelineHorizontal accentColor={accentColor} theme={theme} />;
      case "letter": return <TimelineLoveLetters accentColor={accentColor} theme={theme} />;
      case "minimal": return <TimelineMinimalList accentColor={accentColor} theme={theme} />;
      case "vintage": return <TimelinePhotoAlbum accentColor={accentColor} theme={theme} />;
      case "rustic": return <TimelineTwineBoard accentColor={accentColor} theme={theme} />;
      default: return <TimelineFilmReel accentColor={accentColor} theme={theme} />;
    }
  };

  const storiesData = (stories && stories.length > 0) ? stories : storyEvents.map(e => ({ title: e.title, date: e.date, text: e.desc, img: e.image }));

  switch (theme.id) {
    case "boho": return <BohoStory stories={storiesData} />;
    case "tropical": return <TropicalStory stories={storiesData} />;
    case "vintage": return <VintageStory stories={storiesData} />;
    case "minimalist": return <MinimalStory stories={storiesData} accentColor={accentColor} />;
    case "modern": return <ModernStory stories={storiesData} />;
    case "garden": return <BotanicalStory stories={storiesData} />;
    case "cinematic": return <CinematicStory stories={storiesData} />;
    case "magazine": return <EditorialStory stories={storiesData} />;
  }

  if (theme.id === "luxury") {
    return (
      <section id="story" className="py-32 relative bg-[#080808]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="font-display text-4xl sm:text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] to-[#FCF6BA]">
              Chuyện Tình
            </h2>
            <div className="flex justify-center items-center gap-4 mt-6">
              <span className="w-16 h-px bg-gradient-to-r from-transparent to-[#D5B36A]/50" />
              <div className="w-2 h-2 rotate-45 border border-[#D5B36A]" />
              <span className="w-16 h-px bg-gradient-to-l from-transparent to-[#D5B36A]/50" />
            </div>
          </div>
          {renderTimeline()}
        </div>
      </section>
    );
  }

  if (theme.id === "royal") {
    return (
      <section className="royal-marble relative px-4 py-28 w-full bg-[#f8f3eb]">
        <div className="mx-auto max-w-4xl">
          <header className="mb-20 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[.35em] text-[#9c752e]">The royal chronicle</p>
            <h2 className="mt-3 text-4xl md:text-5xl text-[#2a1020]">Chuyện tình hoàng gia</h2>
            <div className="mx-auto mt-6 h-px w-24 bg-[#c9a45a]" />
          </header>
          {renderTimeline()}
        </div>
      </section>
    );
  }

  return (
    <section id="story" className="py-24 px-4" style={{ backgroundColor: sectionBg }}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-display text-4xl @md:text-5xl font-normal text-foreground">
            Things <span className="italic" style={{ color: accentColor }}>unforgettable</span>
          </h2>
        </motion.div>
        {renderTimeline()}
      </div>
    </section>
  );
};

export default StorySection;

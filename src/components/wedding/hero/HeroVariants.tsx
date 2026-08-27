import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Heart, ChevronDown, Sparkles, Flower2, Leaf, PenLine } from "lucide-react";
import heroImg from "@/assets/hero-wedding.jpg";
import couple1 from "@/assets/couple-1.jpg";
import couple2 from "@/assets/couple-2.jpg";
import { safeFormatDate } from "@/lib/utils";

interface HeroProps {
  groomName: string;
  brideName: string;
  date: string;
  accentColor: string;
  heroOverlay?: string;
  themeId?: string;
}

const heroSparkles = [
  [12, 18, 0.2],
  [24, 72, 1.1],
  [38, 24, 0.7],
  [62, 76, 1.6],
  [74, 20, 0.4],
  [88, 58, 1.3],
] as const;

const HeroSparkleVeil = ({ accentColor }: { accentColor: string }) => (
  <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden motion-reduce:hidden" aria-hidden="true">
    {heroSparkles.map(([left, top, delay], index) => (
      <motion.span
        key={`${left}-${top}`}
        className="absolute"
        style={{ left: `${left}%`, top: `${top}%`, color: index % 2 === 0 ? accentColor : "rgba(255,255,255,0.82)" }}
        animate={{ opacity: [0, 0.72, 0], y: [0, -14, 0], scale: [0.82, 1.16, 0.82], rotate: [0, 16, 0] }}
        transition={{ duration: 4 + index * 0.3, delay, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="h-4 w-4 drop-shadow" strokeWidth={1.4} />
      </motion.span>
    ))}
  </div>
);

const HeroFullscreen = ({ groomName, brideName, date, accentColor, heroOverlay }: HeroProps) => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.15], [1, 1.1]);

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      <motion.div className="absolute inset-0" style={{ scale }}>
        <img src={heroImg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: heroOverlay }} />
      </motion.div>
      <HeroSparkleVeil accentColor={accentColor} />
      <motion.div style={{ opacity }} className="relative z-10 text-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, type: "spring" }}>
          <Heart className="w-14 h-14 mx-auto mb-6 animate-heartbeat" fill={accentColor} style={{ color: accentColor }} />
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-primary-foreground/70 text-xs tracking-[0.5em] uppercase font-body mb-6">
          We're Getting Married
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }} className="font-display text-6xl @sm:text-7xl @md:text-8xl @lg:text-9xl font-bold text-primary-foreground leading-none">
          {groomName}
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="block text-3xl @sm:text-4xl italic font-normal my-3" style={{ color: accentColor }}>&</motion.span>
          {brideName}
        </motion.h1>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.5, duration: 1 }} className="w-32 h-[1px] mx-auto my-8" style={{ backgroundColor: accentColor }} />
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="text-primary-foreground/80 font-body text-lg">
          {safeFormatDate(date, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </motion.p>
      </motion.div>
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <ChevronDown className="w-8 h-8 text-primary-foreground/50" />
      </motion.div>
    </section>
  );
};

const HeroCinematic = ({ groomName, brideName, date, accentColor, heroOverlay }: HeroProps) => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section id="hero" className="relative h-screen flex items-end justify-center overflow-hidden pb-24">
      <motion.div className="absolute inset-0">
        <motion.img src={heroImg} alt="" className="w-full h-full object-cover" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
        <div className="absolute inset-0" style={{ background: heroOverlay }} />
        {/* Cinematic bars */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-black/60" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-black/60" />
      </motion.div>
      <HeroSparkleVeil accentColor={accentColor} />
      <motion.div style={{ opacity }} className="relative z-10 text-center px-4">
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1.2 }} className="mb-8">
          <span className="text-xs tracking-[1em] uppercase font-body text-primary-foreground/50">The Wedding of</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, letterSpacing: "0.5em" }} animate={{ opacity: 1, letterSpacing: "0.15em" }} transition={{ delay: 0.8, duration: 1.5 }} className="font-display text-5xl @sm:text-7xl @md:text-8xl font-bold text-primary-foreground">
          {groomName} <span style={{ color: accentColor }}>&</span> {brideName}
        </motion.h1>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 2, duration: 1.5 }} className="w-48 h-[1px] mx-auto my-8" style={{ backgroundColor: accentColor }} />
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="text-primary-foreground/60 font-body text-sm tracking-[0.3em] uppercase">
          {safeFormatDate(date, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </motion.p>
      </motion.div>
    </section>
  );
};

const HeroSplit = ({ groomName, brideName, date, accentColor, heroOverlay }: HeroProps) => (
  <section id="hero" className="relative min-h-screen flex flex-col @md:flex-row overflow-hidden">
    <div className="flex-1 relative">
      <img src={heroImg} alt="" className="w-full h-full object-cover min-h-[50vh]" />
      <div className="absolute inset-0" style={{ background: heroOverlay }} />
      <HeroSparkleVeil accentColor={accentColor} />
    </div>
    <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} className="flex-1 flex flex-col items-center justify-center p-8 @md:p-16">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring" }}>
        <Heart className="w-10 h-10 mb-6 animate-heartbeat" fill={accentColor} style={{ color: accentColor }} />
      </motion.div>
      <p className="text-xs tracking-[0.5em] uppercase font-body mb-4" style={{ color: accentColor }}>We're Getting Married</p>
      <h1 className="font-display text-5xl @md:text-7xl font-bold text-foreground text-center leading-tight">
        {groomName}
        <span className="block text-2xl italic font-normal my-2" style={{ color: accentColor }}>&</span>
        {brideName}
      </h1>
      <div className="w-20 h-[1px] my-6" style={{ backgroundColor: accentColor }} />
      <p className="text-muted-foreground font-body">
        {safeFormatDate(date, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      </p>
    </motion.div>
  </section>
);

const HeroMinimal = ({ groomName, brideName, date, accentColor }: HeroProps) => (
  <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
    <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" />
    <HeroSparkleVeil accentColor={accentColor} />
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} className="relative z-10 text-center px-4">
      <p className="text-xs tracking-[0.6em] uppercase font-body mb-10" style={{ color: accentColor }}>The Wedding of</p>
      <h1 className="font-display text-6xl @md:text-9xl font-light text-foreground tracking-tight">
        {groomName}
      </h1>
      <div className="flex items-center justify-center gap-6 my-6">
        <div className="w-20 h-[0.5px] bg-foreground/20" />
        <span className="font-display text-2xl" style={{ color: accentColor }}>&</span>
        <div className="w-20 h-[0.5px] bg-foreground/20" />
      </div>
      <h1 className="font-display text-6xl @md:text-9xl font-light text-foreground tracking-tight">
        {brideName}
      </h1>
      <p className="text-muted-foreground font-body mt-10 text-sm tracking-[0.2em]">
        {safeFormatDate(date, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      </p>
    </motion.div>
  </section>
);

const HeroElegantFrame = ({ groomName, brideName, date, accentColor, heroOverlay }: HeroProps) => (
  <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
    <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0" style={{ background: heroOverlay }} />
    <HeroSparkleVeil accentColor={accentColor} />
    {/* Decorative frame */}
    <div className="absolute inset-6 @md:inset-12 border pointer-events-none z-10" style={{ borderColor: `${accentColor}50` }} />
    <div className="absolute inset-8 @md:inset-14 border pointer-events-none z-10" style={{ borderColor: `${accentColor}30` }} />
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5 }} className="relative z-10 text-center px-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mb-4">
        <Sparkles className="mx-auto h-7 w-7" style={{ color: accentColor }} strokeWidth={1.35} />
      </motion.div>
      <p className="text-primary-foreground/60 text-xs tracking-[0.5em] uppercase font-body mb-6">We Invite You to Celebrate</p>
      <h1 className="font-display text-5xl @sm:text-7xl @md:text-8xl font-bold text-primary-foreground leading-none">
        {groomName}
        <span className="block text-3xl italic font-normal my-4" style={{ color: accentColor }}>&</span>
        {brideName}
      </h1>
      <div className="flex items-center justify-center gap-4 my-8">
        <div className="w-12 h-[1px]" style={{ backgroundColor: accentColor }} />
        <Heart className="w-4 h-4" fill={accentColor} style={{ color: accentColor }} />
        <div className="w-12 h-[1px]" style={{ backgroundColor: accentColor }} />
      </div>
      <p className="text-primary-foreground/70 font-body">
        {safeFormatDate(date, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      </p>
    </motion.div>
  </section>
);

const HeroMagazine = ({ groomName, brideName, date, accentColor, heroOverlay }: HeroProps) => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, 100]);

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      <motion.div className="absolute inset-0" style={{ y, opacity }}>
        <img src={heroImg} alt="" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0" style={{ background: heroOverlay || 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
      </motion.div>
      <HeroSparkleVeil accentColor={accentColor} />
      <div className="relative z-10 w-full px-6 flex flex-col justify-between h-full py-12 @md:py-24 pointer-events-none">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1 }}>
          <p className="text-white/60 text-sm @md:text-base uppercase tracking-[0.4em] font-body text-center">The Wedding Issue</p>
        </motion.div>
        
        <div className="text-center mt-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
            className="font-display text-7xl @sm:text-9xl @md:text-[12rem] font-bold text-white leading-none uppercase tracking-tighter mix-blend-overlay"
          >
            {groomName}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 1.2, duration: 1 }}
            className="font-display text-5xl @md:text-8xl italic text-white my-[-20px] @md:my-[-40px] relative z-20"
            style={{ color: accentColor }}
          >
            &
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 1.4, duration: 1.5, ease: "easeOut" }}
            className="font-display text-7xl @sm:text-9xl @md:text-[12rem] font-bold text-white leading-none uppercase tracking-tighter mix-blend-overlay"
          >
            {brideName}
          </motion.h1>
        </div>

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 2, duration: 1 }}
          className="flex justify-between items-end border-t border-white/20 pt-6"
        >
          <p className="text-white/80 font-body text-xs @md:text-sm tracking-widest uppercase max-w-[150px]">Vol 1. Exclusive Love Story</p>
          <p className="text-white font-body text-sm @md:text-base tracking-[0.2em] uppercase">
            {safeFormatDate(date, { month: "long", year: "numeric" }, "en-US")}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const HeroCarouselFade = ({ groomName, brideName, date, accentColor, heroOverlay }: HeroProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [heroImg, couple1, couple2];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 12000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.8 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0" style={{ background: heroOverlay || 'rgba(0,0,0,0.4)' }} />
      <HeroSparkleVeil accentColor={accentColor} />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1.5 }}
        className="relative z-10 text-center px-4 bg-white/10 backdrop-blur-md p-10 @md:p-16 rounded-2xl border border-white/20"
      >
        <p className="text-white/80 text-xs @md:text-sm tracking-[0.5em] uppercase font-body mb-6">Celebrate Love</p>
        <h1 className="font-display text-5xl @sm:text-7xl @md:text-8xl font-bold text-white leading-tight">
          {groomName}
          <span className="block text-3xl @md:text-5xl italic font-normal my-2" style={{ color: accentColor }}>&</span>
          {brideName}
        </h1>
        <div className="w-24 h-[2px] mx-auto my-8" style={{ backgroundColor: accentColor }} />
        <p className="text-white/90 font-body text-lg tracking-[0.1em]">
          {safeFormatDate(date, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </motion.div>
    </section>
  );
};

const HeroCanvas = ({ groomName, brideName, date, accentColor }: HeroProps) => (
  <section id="hero" className="relative min-h-[100svh] overflow-hidden bg-[#fcfbf8] px-5 py-20 text-[#27231f] @md:px-10">
    <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(#e9e4dc_1px,transparent_1px),linear-gradient(90deg,#e9e4dc_1px,transparent_1px)] [background-size:26px_26px]" />
    <div className="absolute -left-16 top-24 h-64 w-64 rounded-full blur-3xl" style={{ backgroundColor: `${accentColor}24` }} />
    <div className="relative mx-auto grid min-h-[78svh] max-w-6xl items-center gap-10 @lg:grid-cols-[1.05fr_.95fr]">
      <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="relative order-2 @lg:order-1">
        <div className="absolute -left-3 -top-3 h-16 w-16 border-l-2 border-t-2" style={{ borderColor: accentColor }} />
        <p className="font-body text-[10px] font-semibold uppercase tracking-[.38em]" style={{ color: accentColor }}>A blank page, a true story</p>
        <h1 className="mt-6 font-display text-[clamp(4rem,10cqi,8rem)] leading-[.76] tracking-tight">{groomName}<span className="my-5 block text-[.28em] font-normal italic" style={{ color: accentColor }}>&amp;</span>{brideName}</h1>
        <div className="mt-9 flex flex-wrap items-center gap-4 font-body text-xs uppercase tracking-[.18em] text-[#655d56]"><span>{safeFormatDate(date, { year: "numeric", month: "long", day: "numeric" }, "vi-VN")}</span><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accentColor }} /><span>Our wedding canvas</span></div>
        <div className="mt-12 flex items-center gap-3 text-xs text-[#655d56]"><PenLine className="h-4 w-4" style={{ color: accentColor }} /><span>Được phác nên từ những điều thuộc về hai chúng mình.</span></div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 28, rotate: 3 }} animate={{ opacity: 1, y: 0, rotate: 3 }} transition={{ duration: 0.9, delay: 0.12 }} className="relative order-1 mx-auto w-full max-w-md bg-white p-3 shadow-[18px_22px_0_rgba(39,35,31,.11)] @lg:order-2">
        <img src={heroImg} alt={`Ảnh cưới của ${groomName} và ${brideName}`} className="aspect-[4/5] w-full object-cover" />
        <div className="absolute -bottom-7 -left-7 grid h-20 w-20 place-items-center rounded-full border-2 bg-[#fcfbf8] font-body text-[9px] font-bold uppercase tracking-[.12em]" style={{ borderColor: accentColor, color: accentColor }}>made<br />with love</div>
      </motion.div>
    </div>
  </section>
);

const HeroRustic = ({ groomName, brideName, date, accentColor }: HeroProps) => (
  <section id="hero" className="relative min-h-[100svh] overflow-hidden bg-[#e9dfd1] px-5 py-20 text-[#4c3829] @md:px-10">
    <div className="absolute inset-0 opacity-45 [background-image:repeating-linear-gradient(0deg,rgba(89,63,39,.055)_0_1px,transparent_1px_7px)]" />
    <Leaf className="absolute left-[8%] top-20 h-24 w-24 rotate-[-28deg] opacity-20" style={{ color: accentColor }} />
    <Flower2 className="absolute bottom-16 right-[8%] h-28 w-28 rotate-[22deg] opacity-20" style={{ color: accentColor }} />
    <div className="relative mx-auto grid min-h-[78svh] max-w-6xl items-center gap-12 @lg:grid-cols-[.9fr_1.1fr]">
      <motion.div initial={{ opacity: 0, rotate: -4, y: 24 }} animate={{ opacity: 1, rotate: -2, y: 0 }} transition={{ duration: 0.9 }} className="relative mx-auto w-full max-w-sm bg-[#fffaf0] p-4 shadow-[0_25px_55px_rgba(77,56,36,.22)]">
        <div className="absolute left-1/2 top-0 h-7 w-28 -translate-x-1/2 -translate-y-3 rotate-1 bg-[#b9a17e]/65" />
        <img src={couple1} alt={`Khoảnh khắc của ${groomName} và ${brideName}`} className="aspect-[4/5] w-full object-cover sepia-[.18]" />
        <p className="pb-2 pt-5 text-center font-display text-2xl italic">our favorite day</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 26 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="text-center @lg:text-left">
        <p className="font-body text-[10px] font-bold uppercase tracking-[.38em]" style={{ color: accentColor }}>Handwritten invitation</p>
        <h1 className="mt-6 font-display text-[clamp(4rem,9cqi,7.5rem)] leading-[.82]">{groomName}<span className="mx-4 inline-block text-[.5em] italic" style={{ color: accentColor }}>&amp;</span>{brideName}</h1>
        <div className="mx-auto mt-8 max-w-md border-y border-[#80634d]/25 py-5 font-body text-xs uppercase tracking-[.22em] text-[#705945] @lg:mx-0">{safeFormatDate(date, { weekday: "long", year: "numeric", month: "long", day: "numeric" }, "vi-VN")}</div>
        <p className="mx-auto mt-8 max-w-md font-body text-sm leading-7 text-[#705945] @lg:mx-0">Một lời mời mộc mạc, dành cho những người chúng mình thương nhất.</p>
      </motion.div>
    </div>
  </section>
);

const HeroSakura = ({ groomName, brideName, date, accentColor }: HeroProps) => (
  <section id="hero" className="relative min-h-[100svh] overflow-hidden bg-[#fff5f8] px-5 py-20 text-[#513942] @md:px-10">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,183,197,.32),transparent_22%),radial-gradient(circle_at_86%_80%,rgba(255,214,225,.7),transparent_26%)]" />
    {heroSparkles.map(([left, top, delay], index) => <motion.span key={index} className="absolute h-3 w-3 rounded-full bg-[#ffb7c5]/70" style={{ left: `${left}%`, top: `${top}%` }} animate={{ y: [0, 90, 0], x: [0, index % 2 ? -20 : 20, 0], opacity: [.15, .9, .15], rotate: [0, 180, 360] }} transition={{ duration: 7 + index, delay, repeat: Infinity, ease: "easeInOut" }} />)}
    <div className="relative mx-auto grid min-h-[78svh] max-w-6xl items-center gap-10 @lg:grid-cols-[1fr_.9fr]">
      <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85 }} className="relative mx-auto w-full max-w-md rounded-t-[12rem] border border-white bg-white/45 p-3 shadow-[0_30px_70px_rgba(164,91,114,.18)] backdrop-blur-sm">
        <img src={couple2} alt={`Ảnh cưới của ${groomName} và ${brideName}`} className="aspect-[4/5] w-full rounded-t-[10.5rem] object-cover" />
        <div className="absolute -right-8 top-12 flex h-20 w-20 items-center justify-center rounded-full border border-[#ffb7c5]/60 bg-white/80 text-center font-body text-[9px] font-bold uppercase tracking-[.15em]" style={{ color: accentColor }}>sakura<br />dream</div>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.12 }} className="text-center @lg:text-left">
        <p className="font-body text-[10px] font-semibold uppercase tracking-[.42em]" style={{ color: accentColor }}>Cherry blossom ceremony</p>
        <h1 className="mt-6 font-display text-[clamp(4rem,9cqi,7.5rem)] leading-[.8]">{groomName}<span className="my-4 block text-[.3em] italic" style={{ color: accentColor }}>&amp;</span>{brideName}</h1>
        <p className="mx-auto mt-8 max-w-md font-body text-sm leading-7 text-[#805d69] @lg:mx-0">Một ngày dịu dàng, được phủ đầy cánh hoa và những lời chúc ấm áp.</p>
        <div className="mx-auto mt-9 inline-flex items-center gap-3 border-b border-[#ffb7c5]/60 pb-3 font-body text-xs uppercase tracking-[.22em] text-[#805d69] @lg:mx-0"><Flower2 className="h-4 w-4" style={{ color: accentColor }} />{safeFormatDate(date, { year: "numeric", month: "long", day: "numeric" }, "vi-VN")}</div>
      </motion.div>
    </div>
  </section>
);

const HeroSection = (props: HeroProps & { style: string }) => {
  if (props.themeId === "canvas") return <HeroCanvas {...props} />;
  if (props.themeId === "rustic") return <HeroRustic {...props} />;
  if (props.themeId === "sakura") return <HeroSakura {...props} />;
  switch (props.style) {
    case "cinematic": return <HeroCinematic {...props} />;
    case "split": return <HeroSplit {...props} />;
    case "minimal": return <HeroMinimal {...props} />;
    case "elegant-frame": return <HeroElegantFrame {...props} />;
    case "magazine-cover": return <HeroMagazine {...props} />;
    case "carousel-fade": return <HeroCarouselFade {...props} />;
    default: return <HeroFullscreen {...props} />;
  }
};

export { HeroSection };
export type { HeroProps };

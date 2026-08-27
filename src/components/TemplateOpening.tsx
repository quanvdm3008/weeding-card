import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Feather, Sparkles, Crown, ChevronRight, Mail, MapPin, Images, Clapperboard, Leaf, ScrollText, Barcode, Heart, Compass } from "lucide-react";
import type { OpeningVariant } from "@/data/templateExperiences";

interface TemplateOpeningProps {
  templateId?: string;
  variant: OpeningVariant;
  groomName: string;
  brideName: string;
  accentColor: string;
  line: string;
  date?: string;
  onComplete: () => void;
}

const copy: Record<OpeningVariant, string> = {
  letter: "Open the letter",
  cinema: "Start the movie",
  seal: "Break the seal",
  vintage: "Unfold the scroll",
  minimal: "View details",
  fluid: "Begin the story",
  glass: "Step inside",
  map: "Start the journey",
  gallery: "Open the album",
  rustic: "Untie the bow",
  coastal: "Discover the sea",
  winter: "Embrace the magic",
  aurora: "Follow the northern lights",
  cyber: "Connect to the celebration",
  violet_dream: "Enter the dream",
  parallax_love: "Experience the depth",
  luxury: "Mở Dạ Tiệc",
};

const formatDate = (date?: string) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" });
};

const NamesDate = ({ groomName, brideName, date, className = "" }: { groomName: string; brideName: string; date?: string; className?: string }) => (
  <div className={className}>
    <h1 className="font-display text-4xl @md:text-6xl leading-tight">
      {groomName} <span className="italic opacity-60">&</span> {brideName}
    </h1>
    {date && <p className="mt-3 font-body text-xs uppercase tracking-[0.4em] opacity-60">{formatDate(date)}</p>}
  </div>
);

const TemplateOpeningLetter = ({ groomName, brideName, accentColor, line, date, onComplete }: TemplateOpeningProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f8f5f0] overflow-hidden px-4">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            type="button"
            data-testid="opening-open"
            exit={{ y: -1000, opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="w-full max-w-md cursor-pointer text-left"
            onClick={() => {
              setIsOpen(true);
              setTimeout(onComplete, 1200);
            }}
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="relative aspect-[4/3] bg-white rounded-xl shadow-2xl flex flex-col items-center justify-center border"
              style={{ borderColor: `${accentColor}40` }}
            >
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/5 to-transparent rounded-t-xl" />
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#f8f5f0] border shadow-inner mb-6" style={{ borderColor: accentColor }}>
                <Mail className="w-8 h-8" style={{ color: accentColor }} />
              </div>
              <h2 className="font-display text-2xl text-gray-800">{groomName} & {brideName}</h2>
              {date && <p className="mt-1 text-[11px] font-body uppercase tracking-[0.3em] text-gray-400">{formatDate(date)}</p>}
              <p className="mt-2 text-xs font-body tracking-[0.3em] uppercase text-gray-500">{line}</p>
              <p className="absolute bottom-6 text-xs text-gray-400">Chạm để mở thiệp</p>
            </motion.div>
          </motion.button>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

const TemplateOpeningCinema = ({ groomName, brideName, line, date, onComplete }: TemplateOpeningProps) => {
  return (
    <motion.div exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }} transition={{ duration: 1, ease: "easeIn" }} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white overflow-hidden">
      <motion.div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="text-center z-10"
      >
        <p className="font-body text-sm uppercase tracking-[0.8em] text-gray-400 mb-8">{line}</p>
        <h1 className="font-display text-6xl @md:text-8xl uppercase tracking-widest">{groomName}</h1>
        <h1 className="font-display text-4xl @md:text-6xl italic my-2 text-gray-500">&</h1>
        <h1 className="font-display text-6xl @md:text-8xl uppercase tracking-widest">{brideName}</h1>
        {date && <p className="mt-6 font-body text-xs uppercase tracking-[0.5em] text-gray-500">{formatDate(date)}</p>}
      </motion.div>

      <motion.button
        data-testid="opening-open"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        onClick={onComplete}
        className="mt-16 z-10 px-8 py-3 rounded-full font-body text-xs tracking-[0.3em] uppercase transition-all hover:bg-white hover:text-black border border-white/30"
      >
        {copy.cinema}
      </motion.button>
    </motion.div>
  );
};

// Fluid — morphing blob reveal (Garden)
// Fluid/Botanical — elegant leaves opening
const TemplateOpeningFluid = ({ groomName, brideName, accentColor, line, date, onComplete }: TemplateOpeningProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#F3F4F1] px-6">
      {/* Left Leaf branch */}
      <motion.div
        animate={isOpen ? { x: "-100%", opacity: 0 } : { x: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-0 top-0 bottom-0 w-1/2 md:w-1/3 flex items-center justify-start pointer-events-none"
      >
        <svg viewBox="0 0 100 200" className="h-[120vh] fill-current" style={{ color: `${accentColor}40`, transform: "translateX(-20%)" }}>
          <path d="M0 0 C40 50 60 100 40 150 C20 180 0 200 0 200 Z" />
          <path d="M40 50 C70 40 90 60 80 90 C70 120 40 100 40 150 Z" opacity="0.7"/>
          <path d="M50 120 C80 130 90 160 70 180 C50 200 20 180 0 200 Z" opacity="0.5"/>
        </svg>
      </motion.div>
      
      {/* Right Leaf branch */}
      <motion.div
        animate={isOpen ? { x: "100%", opacity: 0 } : { x: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute right-0 top-0 bottom-0 w-1/2 md:w-1/3 flex items-center justify-end pointer-events-none"
      >
        <svg viewBox="0 0 100 200" className="h-[120vh] fill-current" style={{ color: `${accentColor}40`, transform: "translateX(20%) scaleX(-1)" }}>
          <path d="M0 0 C40 50 60 100 40 150 C20 180 0 200 0 200 Z" />
          <path d="M40 50 C70 40 90 60 80 90 C70 120 40 100 40 150 Z" opacity="0.7"/>
          <path d="M50 120 C80 130 90 160 70 180 C50 200 20 180 0 200 Z" opacity="0.5"/>
        </svg>
      </motion.div>

      <AnimatePresence>
        {!isOpen && (
          <motion.div exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }} transition={{ duration: 0.8 }} className="relative z-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-white/50 shadow-[0_0_20px_rgba(0,0,0,0.05)] backdrop-blur-sm border border-black/5 text-emerald-800">
              <Leaf className="w-8 h-8" />
            </div>
            <p className="font-body text-xs uppercase tracking-[0.45em] text-emerald-900/60 mb-5">{line}</p>
            <h1 className="font-display text-5xl @md:text-7xl text-emerald-950 mb-2">
              {groomName} <span className="text-emerald-900/40 italic">&</span> {brideName}
            </h1>
            {date && <p className="mt-4 font-body text-xs uppercase tracking-[0.4em] text-emerald-900/60">{formatDate(date)}</p>}
            <motion.button
              data-testid="opening-open"
              onClick={() => { setIsOpen(true); setTimeout(onComplete, 1200); }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-12 rounded-full px-8 py-3.5 font-body text-xs tracking-widest uppercase font-semibold text-white shadow-xl hover:shadow-2xl transition-shadow"
              style={{ backgroundColor: accentColor }}
            >
              {copy.fluid}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Glass — frosted layered cards floating in (Sakura)
// Glass — frosted layered cards floating in (Sakura)
const TemplateOpeningGlass = ({ groomName, brideName, accentColor, line, date, onComplete }: TemplateOpeningProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-4" style={{ background: `linear-gradient(135deg, ${accentColor}15, #ffffff, ${accentColor}05)` }}>
      <AnimatePresence>
        {!isOpen && (
          <motion.div exit={{ opacity: 0, y: -50, scale: 0.95 }} transition={{ duration: 0.8, ease: "easeInOut" }} className="relative w-full max-w-sm">
            {/* Background floating glass layers */}
            <motion.div 
              animate={{ rotate: [-2, 2, -2], y: [-5, 5, -5] }} 
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} 
              className="absolute inset-0 rounded-[2rem] border border-white/60 bg-white/40 backdrop-blur-sm shadow-xl -rotate-6 translate-x-4 translate-y-2" 
            />
            <motion.div 
              animate={{ rotate: [3, -1, 3], y: [4, -4, 4] }} 
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} 
              className="absolute inset-0 rounded-[2rem] border border-white/60 bg-white/40 backdrop-blur-sm shadow-xl rotate-3 -translate-x-2 -translate-y-4" 
            />
            
            {/* Main glass card */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative z-10 w-full rounded-[2rem] border border-white/80 bg-white/60 backdrop-blur-2xl shadow-2xl p-10 py-16 text-center"
            >
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
              <Heart className="w-6 h-6 mx-auto mb-6 opacity-40" style={{ color: accentColor, fill: accentColor }} />
              <p className="font-body text-[10px] uppercase tracking-[0.5em] text-gray-500 mb-6">{line}</p>
              <h1 className="font-display text-4xl text-gray-800 mb-2 leading-tight">
                {groomName} <br/><span className="text-2xl italic text-gray-400 font-light">&</span><br/> {brideName}
              </h1>
              {date && <p className="mt-6 font-body text-xs uppercase tracking-[0.3em] text-gray-500/80">{formatDate(date)}</p>}
              
              <motion.button
                data-testid="opening-open"
                onClick={() => { setIsOpen(true); setTimeout(onComplete, 900); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-12 rounded-full px-8 py-3.5 font-body text-[11px] tracking-[0.2em] uppercase font-bold bg-white text-gray-800 shadow-lg border border-white hover:border-gray-100 transition-all"
                style={{ color: accentColor }}
              >
                {copy.glass}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Map — path-draw journey line (Tropical)
// Map — old ticket / boarding pass (Vintage/Travel)
const TemplateOpeningMap = ({ groomName, brideName, accentColor, line, date, onComplete }: TemplateOpeningProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#e6dfd3] px-4">
      {/* Old paper texture overlay */}
      <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]" />
      
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            exit={{ x: "-100vw", rotate: -15, opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="relative w-full max-w-md flex"
          >
            {/* The Ticket */}
            <div className="relative w-full bg-[#f4f0ea] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex border border-[#d3c9b7] overflow-hidden">
              {/* Ticket Left stub */}
              <div className="w-1/4 border-r-2 border-dashed border-[#c5bba8] flex flex-col items-center justify-center p-4 bg-[#ede8e0]">
                <Barcode className="w-16 h-16 text-gray-800 mb-2 rotate-90" />
                <span className="text-[10px] font-mono tracking-widest text-gray-600 rotate-90 uppercase mt-4">ADMIT TWO</span>
              </div>
              
              {/* Ticket Main */}
              <div className="w-3/4 p-8 flex flex-col justify-center relative">
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full border-2 border-red-800/30 flex items-center justify-center rotate-12">
                  <span className="text-[8px] uppercase tracking-widest font-bold text-red-800/50">VIP</span>
                </div>
                
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#a89f8d] mb-4 border-b border-[#d3c9b7] pb-2 inline-block">Boarding Pass to Forever</p>
                
                <div className="mb-6">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1">Passenger 1</p>
                  <h2 className="font-display text-2xl text-gray-800">{groomName}</h2>
                </div>
                
                <div className="mb-6">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1">Passenger 2</p>
                  <h2 className="font-display text-2xl text-gray-800">{brideName}</h2>
                </div>
                
                <div className="flex justify-between items-end border-t border-[#d3c9b7] pt-4">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1">Date</p>
                    <p className="font-mono text-xs font-bold text-gray-700">{formatDate(date) || "TBD"}</p>
                  </div>
                  
                  <motion.button
                    data-testid="opening-open"
                    onClick={() => { setIsOpen(true); setTimeout(onComplete, 1000); }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 bg-gray-800 text-[#f4f0ea] px-4 py-2 rounded-sm font-mono text-[10px] tracking-widest uppercase transition-colors hover:bg-black"
                  >
                    Punch <ChevronRight className="w-3 h-3" />
                  </motion.button>
                </div>
              </div>
              
              {/* Ticket punches (the semi-circles at top/bottom of dashed line) */}
              <div className="absolute top-[-10px] left-1/4 w-5 h-5 rounded-full bg-[#e6dfd3] -translate-x-1/2" />
              <div className="absolute bottom-[-10px] left-1/4 w-5 h-5 rounded-full bg-[#e6dfd3] -translate-x-1/2" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Gallery — image-mosaic assemble (used by others, but Boho will have its own)
// Gallery — polaroid scatter effect
const TemplateOpeningGallery = ({ groomName, brideName, accentColor, line, date, onComplete }: TemplateOpeningProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const polaroids = [
    { rotate: -12, x: -40, y: -20, delay: 0.1 },
    { rotate: 8, x: 50, y: 10, delay: 0.2 },
    { rotate: -5, x: 0, y: -40, delay: 0.3 }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-neutral-100 px-6">
      <AnimatePresence>
        {!isOpen && (
          <div className="relative w-full max-w-sm flex items-center justify-center">
            {/* Background polaroids */}
            {polaroids.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50, rotate: 0 }}
                animate={{ opacity: 1, y: p.y, x: p.x, rotate: p.rotate }}
                exit={{ opacity: 0, scale: 1.5, rotate: p.rotate + 20 }}
                transition={{ duration: 0.8, delay: p.delay, ease: "easeOut" }}
                className="absolute w-48 h-56 bg-white p-3 pb-12 shadow-xl border border-gray-100"
              >
                <div className="w-full h-full bg-gray-100 overflow-hidden flex items-center justify-center">
                  <Images className="w-8 h-8 text-gray-300" />
                </div>
              </motion.div>
            ))}
            
            {/* Main Polaroid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 2 }}
              exit={{ opacity: 0, scale: 0.5, y: 100 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="relative z-10 w-72 bg-white p-4 pb-6 shadow-2xl border border-gray-200"
            >
              <div className="w-full aspect-[4/5] bg-gray-900 flex items-center justify-center p-6 text-center mb-6 overflow-hidden relative">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,white,transparent)] mix-blend-overlay" />
                <div className="relative z-10">
                  <h1 className="font-display text-4xl text-white mb-2">{groomName}</h1>
                  <span className="font-display text-2xl italic text-white/60">&</span>
                  <h1 className="font-display text-4xl text-white mt-2">{brideName}</h1>
                </div>
              </div>
              
              <div className="text-center">
                <p className="font-body text-[9px] uppercase tracking-widest text-gray-400 mb-4">{line}</p>
                <button
                  onClick={() => { setIsOpen(true); setTimeout(onComplete, 900); }}
                  className="font-body text-xs font-bold uppercase tracking-widest text-black hover:text-gray-500 transition-colors border-b-2 border-black pb-1"
                >
                  {copy.gallery}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Boho - Earthy, arch shapes, organic
const TemplateOpeningBoho = ({ groomName, brideName, accentColor, line, date, onComplete }: TemplateOpeningProps) => {
  return (
    <motion.div exit={{ opacity: 0, y: -100 }} transition={{ duration: 0.8, ease: "easeInOut" }} className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-6" style={{ backgroundColor: "#F7F4F0" }}>
      {/* Organic shapes in background */}
      <motion.div 
        className="absolute -top-32 -left-32 w-[30rem] h-[30rem] rounded-full mix-blend-multiply opacity-20"
        style={{ backgroundColor: accentColor, filter: 'blur(60px)' }}
        animate={{ x: [0, 20, 0], y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] rounded-full mix-blend-multiply opacity-20"
        style={{ backgroundColor: '#D4B895', filter: 'blur(60px)' }}
        animate={{ x: [0, -20, 0], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-sm flex flex-col items-center p-12 text-center bg-white/60 backdrop-blur-md rounded-t-[150px] rounded-b-[40px] border border-white/80 shadow-[0_20px_60px_-15px_rgba(200,150,120,0.2)]"
      >
        <div className="mb-8 w-12 h-12 rounded-full border border-dashed flex items-center justify-center" style={{ borderColor: accentColor, color: accentColor }}>
          <Leaf className="w-5 h-5" />
        </div>
        
        <p className="font-body text-[10px] uppercase tracking-[0.4em] mb-6 font-semibold" style={{ color: '#8A735E' }}>
          {line}
        </p>

        <h1 className="font-serif text-5xl md:text-6xl text-[#4A3C31] leading-tight mb-2">
          {groomName}
        </h1>
        <span className="font-serif text-3xl italic text-[#C4A484] my-2">&</span>
        <h1 className="font-serif text-5xl md:text-6xl text-[#4A3C31] leading-tight mt-2">
          {brideName}
        </h1>

        {date && (
          <div className="mt-8 flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-[#8A735E]">
            <div className="h-px w-6" style={{ backgroundColor: '#D4B895' }} />
            <span>{formatDate(date)}</span>
            <div className="h-px w-6" style={{ backgroundColor: '#D4B895' }} />
          </div>
        )}

        <motion.button
          data-testid="opening-open"
          onClick={onComplete}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-12 rounded-full px-10 py-4 font-sans text-xs uppercase tracking-widest font-bold text-white shadow-lg transition-colors"
          style={{ backgroundColor: accentColor }}
        >
          {copy.gallery} {/* using gallery text or rustic text */}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// Minimalist - Ultra clean, editorial, huge typography
const TemplateOpeningMinimal = ({ groomName, brideName, accentColor, line, date, onComplete }: TemplateOpeningProps) => {
  return (
    <motion.div exit={{ opacity: 0 }} transition={{ duration: 1, ease: "easeInOut" }} className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-transparent px-6">
      {/* Sliding panels for exit animation */}
      <motion.div exit={{ x: "-100%" }} transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }} className="absolute inset-y-0 left-0 w-1/2 bg-white" />
      <motion.div exit={{ x: "100%" }} transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }} className="absolute inset-y-0 right-0 w-1/2 bg-white" />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 1 }}
        className="w-full max-w-3xl flex flex-col items-center justify-center relative z-10"
      >
        <div className="w-px h-24 bg-black/10 mb-8" />
        
        <p className="font-sans text-[10px] uppercase tracking-[0.5em] text-black/40 mb-12">
          {line}
        </p>

        <div className="text-center overflow-hidden">
          <motion.h1 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="font-sans text-6xl md:text-8xl font-light tracking-tighter text-black leading-none"
          >
            {groomName}
          </motion.h1>
        </div>
        
        <div className="overflow-hidden my-4">
           <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="w-12 h-px bg-black/20 mx-auto"
           />
        </div>

        <div className="text-center overflow-hidden">
          <motion.h1 
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="font-sans text-6xl md:text-8xl font-light tracking-tighter text-black leading-none"
          >
            {brideName}
          </motion.h1>
        </div>

        {date && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-12 font-sans text-xs uppercase tracking-[0.3em] text-black/50"
          >
            {formatDate(date)}
          </motion.p>
        )}

        <motion.button
          data-testid="opening-open"
          onClick={onComplete}
          whileHover={{ paddingLeft: "3rem", paddingRight: "3rem" }}
          className="mt-16 group relative flex items-center justify-center"
        >
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-black font-semibold mr-4 transition-all group-hover:mr-6">
            {copy.minimal}
          </span>
          <div className="w-12 h-px bg-black transition-all group-hover:w-16" />
        </motion.button>

        <div className="w-px h-24 bg-black/10 mt-12" />
      </motion.div>
    </motion.div>
  );
};

// Rustic — kraft paper card tied with twine (distinct from the soft "letter" note)
const TemplateOpeningRustic = ({ groomName, brideName, accentColor, line, date, onComplete }: TemplateOpeningProps) => (
  <motion.div exit={{ opacity: 0, y: "-100vh" }} transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }} className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-6" style={{ backgroundColor: "#EDE4D8" }}>
    <div
      className="absolute inset-0 opacity-40"
      style={{
        backgroundImage: "repeating-linear-gradient(135deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 2px, transparent 2px, transparent 14px)",
      }}
    />
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: -1.5 }}
      animate={{ opacity: 1, y: 0, rotate: -1.5 }}
      transition={{ duration: 0.9 }}
      className="relative z-10 w-full max-w-md text-center p-10 @md:p-12"
      style={{ backgroundColor: "#F5EDE3", boxShadow: "0 24px 60px -20px rgba(80,60,30,0.35)" }}
    >
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 rotate-2 opacity-80" style={{ backgroundColor: `${accentColor}` }} />
      <motion.div
        className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full"
        style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
        animate={{ rotate: [0, -6, 6, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Leaf className="h-7 w-7" />
      </motion.div>
      <p className="font-body text-xs uppercase tracking-[0.4em] opacity-70">{line}</p>
      <NamesDate groomName={groomName} brideName={brideName} date={date} className="mt-4" />
      <motion.button
        data-testid="opening-open"
        onClick={onComplete}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="mt-8 rounded-full px-7 py-3 font-body text-sm font-semibold text-white shadow-lg"
        style={{ backgroundColor: accentColor }}
      >
        {copy.rustic}
      </motion.button>
    </motion.div>
  </motion.div>
);

// Vintage — sepia parchment with photo-corner mounts (Film Archive look, distinct from Royal's seal)
const TemplateOpeningVintage = ({ groomName, brideName, line, date, onComplete }: TemplateOpeningProps) => (
  <motion.div exit={{ opacity: 0, filter: "sepia(1) blur(10px)" }} transition={{ duration: 1.2 }} className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-6" style={{ backgroundColor: "#F5E6CC" }}>
    <div className="absolute inset-0 opacity-25" style={{ background: "radial-gradient(circle at 50% 50%, transparent 50%, rgba(80,60,20,0.4) 100%)" }} />
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      className="relative z-10 w-full max-w-md text-center p-10 @md:p-12"
      style={{ backgroundColor: "#EDDCC8", boxShadow: "0 20px 60px -20px rgba(80,60,20,0.5)" }}
    >
      <div className="absolute top-0 left-0 w-5 h-5" style={{ background: "linear-gradient(135deg, #8B6914 50%, transparent 50%)" }} />
      <div className="absolute top-0 right-0 w-5 h-5" style={{ background: "linear-gradient(-135deg, #8B6914 50%, transparent 50%)" }} />
      <div className="absolute bottom-0 left-0 w-5 h-5" style={{ background: "linear-gradient(45deg, #8B6914 50%, transparent 50%)" }} />
      <div className="absolute bottom-0 right-0 w-5 h-5" style={{ background: "linear-gradient(-45deg, #8B6914 50%, transparent 50%)" }} />
      <motion.div
        className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full"
        style={{ backgroundColor: "#8B691425", color: "#8B6914" }}
        animate={{ rotate: [0, 4, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <ScrollText className="h-7 w-7" />
      </motion.div>
      <p className="font-body text-xs uppercase tracking-[0.4em]" style={{ color: "#8B6914" }}>{line}</p>
      <h1 className="mt-4 font-display text-4xl @md:text-5xl leading-tight" style={{ filter: "sepia(0.3)" }}>
        {groomName} <span className="italic opacity-60">&</span> {brideName}
      </h1>
      {date && <p className="mt-3 font-body text-xs uppercase tracking-[0.4em] opacity-60">{formatDate(date)}</p>}
      <motion.button
        data-testid="opening-open"
        onClick={onComplete}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="mt-8 rounded-full px-7 py-3 font-body text-sm font-semibold text-white shadow-lg"
        style={{ backgroundColor: "#8B6914" }}
      >
        {copy.vintage}
      </motion.button>
    </motion.div>
  </motion.div>
);

// Coastal — wave/bubble effect
// Coastal — wave transition effect
const TemplateOpeningCoastal = ({ groomName, brideName, accentColor, line, date, onComplete }: TemplateOpeningProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-white px-6">
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            exit={{ y: "100%" }}
            transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0 bg-[#E0F7FA] z-20 flex flex-col items-center justify-center"
          >
            {/* Wavy top border (when sliding down) */}
            <svg className="absolute -top-16 left-0 w-full h-16 text-[#E0F7FA] fill-current" preserveAspectRatio="none" viewBox="0 0 1440 100">
              <path d="M0,50 C320,100 420,0 740,50 C1060,100 1120,0 1440,50 L1440,100 L0,100 Z" />
            </svg>
            
            {/* Bubbles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border border-white/40"
                  style={{
                    width: Math.random() * 60 + 20,
                    height: Math.random() * 60 + 20,
                    left: `${Math.random() * 100}%`,
                    bottom: "-20%",
                    background: "rgba(255,255,255,0.1)"
                  }}
                  animate={{
                    y: [0, -window.innerHeight * 1.5],
                    x: [0, Math.random() * 100 - 50]
                  }}
                  transition={{
                    duration: Math.random() * 4 + 4,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "linear"
                  }}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative z-30 text-center"
            >
              <Compass className="w-12 h-12 mx-auto mb-6 opacity-60" style={{ color: accentColor }} />
              <p className="font-body text-[10px] uppercase tracking-widest text-cyan-800/60 mb-2">{line}</p>
              <h1 className="font-display text-5xl @md:text-6xl text-cyan-900 mb-2">
                {groomName}
              </h1>
              <h1 className="font-display text-3xl italic text-cyan-700/50 my-1">&</h1>
              <h1 className="font-display text-5xl @md:text-6xl text-cyan-900 mt-2">
                {brideName}
              </h1>
              {date && <p className="mt-6 font-body text-xs uppercase tracking-widest text-cyan-800/60">{formatDate(date)}</p>}
              <motion.button
                data-testid="opening-open"
                onClick={() => { setIsOpen(true); setTimeout(onComplete, 1200); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-12 rounded-full px-8 py-3.5 font-body text-[11px] font-bold uppercase tracking-widest text-white shadow-xl transition-all"
                style={{ backgroundColor: accentColor }}
              >
                {copy.coastal}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Winter — frosted glass and snowfall
const TemplateOpeningWinter = ({ groomName, brideName, accentColor, line, date, onComplete }: TemplateOpeningProps) => {
  const [opening, setOpening] = useState(false);
  const handleOpen = () => {
    setOpening(true);
    window.setTimeout(onComplete, 720);
  };
  return (
  <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-6 bg-[#ECEFF1]">
    <div className="absolute inset-0">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white rounded-full opacity-80"
          style={{
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            left: `${Math.random() * 100}%`,
            top: -10,
          }}
          animate={{
            y: ["0vh", "100vh"],
            x: [0, Math.random() * 40 - 20]
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear"
          }}
        />
      ))}
    </div>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={opening ? { opacity: 0, y: -28, scale: 1.1, filter: "blur(10px)" } : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.2 }}
      className="relative z-10 w-full max-w-sm text-center p-12 rounded-2xl border border-white/60 bg-white/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(144,202,249,0.2)]"
    >
      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white/50 border border-white shadow-inner">
        <Sparkles className="h-6 w-6 text-blue-300" />
      </div>
      <p className="font-body text-[10px] uppercase tracking-[0.5em] text-slate-500">{line}</p>
      <h1 className="mt-4 font-display text-4xl leading-tight text-slate-800">
        {groomName} <span className="block text-xl opacity-40 italic my-2">&</span> {brideName}
      </h1>
      {date && <p className="mt-4 font-body text-[10px] uppercase tracking-[0.4em] text-slate-400">{formatDate(date)}</p>}
      <motion.button
        data-testid="opening-open"
        type="button"
        onClick={handleOpen}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="mt-8 rounded-full px-8 py-3 font-body text-xs uppercase tracking-widest font-bold text-slate-700 bg-white/80 border border-white hover:bg-white transition-colors"
      >
        {opening ? "Băng đang tan..." : "Làm tan băng & mở thiệp"}
      </motion.button>
    </motion.div>
  </div>
  );
};

const TemplateOpeningAurora = ({ groomName, brideName, accentColor, line, date, onComplete }: TemplateOpeningProps) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#061713] px-6 text-[#EAF5F1]">
    <motion.div className="absolute -inset-x-1/2 top-[-20%] h-[70%] rounded-[50%] blur-3xl" style={{ background: `linear-gradient(110deg, transparent 25%, ${accentColor}90 48%, #8D8CFF90 62%, transparent 78%)` }} animate={{ x: ["-12%", "12%", "-12%"], rotate: [-8, 7, -8] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="relative z-10 w-full max-w-xl border border-[#9FEAD2]/35 bg-[#061713]/60 p-8 text-center backdrop-blur-xl @md:p-12">
      <p className="font-body text-[10px] font-semibold uppercase tracking-[0.45em] text-[#9FEAD2]">{line}</p>
      <NamesDate groomName={groomName} brideName={brideName} date={date} className="mt-6" />
      <motion.button data-testid="opening-open" type="button" onClick={onComplete} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="mt-9 border border-[#9FEAD2]/60 px-7 py-3 font-body text-xs font-semibold uppercase tracking-[0.22em] text-[#061713]" style={{ backgroundColor: "#9FEAD2" }}>
        {copy.aurora}
      </motion.button>
    </motion.div>
  </div>
);

const TemplateOpeningCyber = ({ groomName, brideName, accentColor, line, date, onComplete }: TemplateOpeningProps) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#050608] px-6 text-white">
    <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(0,255,255,.2)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,.2)_1px,transparent_1px)] [background-size:42px_42px]" />
    <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative z-10 w-full max-w-xl border border-[#00FFFF]/55 bg-black/75 p-8 text-center shadow-[0_0_60px_rgba(0,255,255,.16)] @md:p-12">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.38em] text-[#00FFFF]">{line}</p>
      <h1 className="mt-6 font-sans text-5xl font-black uppercase leading-[.82] @md:text-7xl">{groomName}<span className="my-3 block text-[.28em] text-[#FF007F]">&amp;</span>{brideName}</h1>
      {date && <p className="mt-6 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white/55">{formatDate(date)}</p>}
      <motion.button data-testid="opening-open" type="button" onClick={onComplete} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="mt-9 bg-[#00FFFF] px-7 py-3 font-mono text-xs font-black uppercase tracking-[0.18em] text-black" style={{ boxShadow: `0 0 28px ${accentColor}` }}>
        {copy.cyber}
      </motion.button>
    </motion.div>
  </div>
);

// Violet Dream — Elegant minimal card sliding up with soft glowing orb
const TemplateOpeningVioletDream = ({ groomName, brideName, accentColor, line, date, onComplete }: TemplateOpeningProps) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-6 bg-[#FAFAFA]">
    {/* Soft glowing purple orb in the background */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        className="w-[80vw] h-[80vw] md:w-[600px] md:h-[600px] rounded-full blur-[100px]"
        style={{ backgroundColor: `${accentColor}20` }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>

    {/* Floating light particles */}
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-[#E9D8FD] rounded-full blur-[2px]"
          style={{
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100],
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
        />
      ))}
    </div>

    {/* Elegant Card */}
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, type: "spring", bounce: 0.2 }}
      className="relative z-10 w-full max-w-md text-center p-12 bg-white/70 backdrop-blur-3xl rounded-[3rem] border border-white shadow-[0_20px_60px_rgba(107,70,193,0.1)] flex flex-col items-center justify-center"
    >
      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#F3E8FF] text-[#6B46C1] mb-6 shadow-sm">
        <Sparkles className="w-5 h-5" />
      </div>
      <p className="font-body text-[9px] uppercase tracking-[0.4em] text-[#6B46C1] font-bold mb-4">{line}</p>
      
      <div className="flex flex-col gap-1 w-full relative">
        <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-[#553C9A] to-[#805AD5]">
          {groomName}
        </h1>
        <div className="my-2 text-3xl font-light italic text-gray-300">&</div>
        <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-[#553C9A] to-[#805AD5]">
          {brideName}
        </h1>
      </div>
      
      {date && (
        <div className="mt-8 flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
          <div className="h-px w-8 bg-gray-200" />
          <span>{formatDate(date)}</span>
          <div className="h-px w-8 bg-gray-200" />
        </div>
      )}

      <motion.button
        data-testid="opening-open"
        onClick={onComplete}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-10 rounded-full px-8 py-3.5 font-sans text-xs uppercase tracking-widest font-bold text-white shadow-lg shadow-purple-900/20 w-full"
        style={{ background: "linear-gradient(to right, #6B46C1, #9F7AEA)" }}
      >
        {copy.violet_dream}
      </motion.button>
    </motion.div>
  </div>
);

// Parallax Love — Editorial Luxury (Light, Ivory, Floating Leaves)
const TemplateOpeningParallaxLove = ({ groomName, brideName, accentColor, line, date, onComplete }: TemplateOpeningProps) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#FBF9F6] text-[#2C2C2C]">
    {/* Soft paper texture background */}
    <div className="absolute inset-0 opacity-30 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }} />
    
    {/* Soft floating blur orbs */}
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            backgroundColor: accentColor,
            width: Math.random() * 200 + 100 + 'px',
            height: Math.random() * 200 + 100 + 'px',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.05 + 0.02,
            filter: `blur(80px)`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>

    {/* Elegant Content */}
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="relative z-10 text-center p-12 max-w-2xl"
    >
      <div className="mx-auto mb-10 flex h-16 w-16 items-center justify-center rounded-full border border-[#8C7A6B]/20 bg-white shadow-[0_4px_30px_rgba(140,122,107,0.1)]">
        <Sparkles className="h-5 w-5" style={{ color: accentColor || '#8C7A6B' }} />
      </div>
      <p className="font-sans text-[9px] uppercase tracking-[0.4em] mb-8" style={{ color: accentColor || '#8C7A6B' }}>{line}</p>
      
      <div className="overflow-hidden">
        <motion.h1 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="font-serif text-5xl md:text-6xl font-light tracking-wide text-[#2C2C2C] mb-2"
        >
          {groomName}
        </motion.h1>
      </div>
      <div className="flex items-center justify-center gap-6 my-4">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#8C7A6B]/40" />
        <span className="font-serif text-3xl italic text-[#8C7A6B]">&</span>
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#8C7A6B]/40" />
      </div>
      <div className="overflow-hidden">
        <motion.h1 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="font-serif text-5xl md:text-6xl font-light tracking-wide text-[#2C2C2C] mt-2"
        >
          {brideName}
        </motion.h1>
      </div>
      
      {date && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-10 font-sans text-[10px] uppercase tracking-[0.3em] text-[#8C7A6B]"
        >
          {formatDate(date)}
        </motion.p>
      )}

      <motion.button
        data-testid="opening-open"
        onClick={onComplete}
        whileHover={{ scale: 1.05, backgroundColor: accentColor || '#8C7A6B', color: "white" }}
        whileTap={{ scale: 0.95 }}
        className="mt-14 rounded-full px-12 py-4 font-sans text-[10px] uppercase tracking-[0.25em] font-bold text-[#8C7A6B] border border-[#8C7A6B]/30 hover:border-transparent transition-all duration-300"
      >
        {copy.parallax_love}
      </motion.button>
    </motion.div>
  </div>
);

const TemplateOpeningPixel = ({ groomName, brideName, accentColor, line, date, onComplete }: TemplateOpeningProps) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#1a1721] text-[#7FE0C3] font-mono">
    <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(#7FE0C3_1px,transparent_1px),linear-gradient(90deg,#7FE0C3_1px,transparent_1px)] [background-size:24px_24px]" />
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }} className="relative z-10 w-full max-w-sm border-4 border-[#7FE0C3] bg-[#111] p-8 text-center shadow-[12px_12px_0_#FFCE67]">
      <p className="text-[10px] uppercase tracking-widest text-[#FFCE67] mb-6">Level 1: The Wedding</p>
      <h1 className="text-4xl font-bold uppercase mb-4 leading-tight">{groomName}</h1>
      <div className="text-2xl text-[#FF007F] my-2 animate-pulse">♥</div>
      <h1 className="text-4xl font-bold uppercase mt-4 leading-tight">{brideName}</h1>
      {date && <p className="mt-6 text-[10px] opacity-70">{formatDate(date)}</p>}
      <motion.button data-testid="opening-open" onClick={onComplete} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-8 border-2 border-[#7FE0C3] px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#7FE0C3] hover:text-[#111] transition-colors">
        Press Start
      </motion.button>
    </motion.div>
  </div>
);

const TemplateOpeningTraditional = ({ groomName, brideName, accentColor, line, date, onComplete }: TemplateOpeningProps) => {
  const [opening, setOpening] = useState(false);
  
  const handleOpen = () => {
    setOpening(true);
    window.setTimeout(onComplete, 1800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#8E2630] text-[#FFF5DF] perspective-[1000px]">
      <div className="absolute inset-4 border-2 border-[#E9BF6A]/40 m-2" />
      <div className="absolute inset-6 border border-[#E9BF6A]/20 m-2" />
      
      <AnimatePresence>
        {!opening ? (
          <motion.div
            key="envelope"
            data-testid="opening-open"
            role="button"
            tabIndex={0}
            aria-label="Mở thiệp cưới"
            exit={{ y: "100vh", opacity: 0, rotateX: -20 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="relative z-20 w-full max-w-sm aspect-[3/4] bg-[#a82d38] rounded-md shadow-2xl flex items-center justify-center cursor-pointer border border-[#E9BF6A]/30 overflow-hidden"
            onClick={handleOpen}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") handleOpen();
            }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Envelope flap lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 133" preserveAspectRatio="none">
              <path d="M0,0 L50,40 L100,0" fill="none" stroke="#E9BF6A" strokeWidth="0.5" strokeOpacity="0.4" />
              <path d="M0,133 L50,80 L100,133" fill="none" stroke="#E9BF6A" strokeWidth="0.5" strokeOpacity="0.4" />
            </svg>
            
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 15 }}
              className="w-20 h-20 bg-gradient-to-br from-[#FCEabb] to-[#f8b500] rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.3)] flex items-center justify-center text-[#8E2630] font-serif text-3xl font-bold border-2 border-[#FFF5DF]/50"
            >
              囍
            </motion.div>
            
            <p className="absolute bottom-8 font-serif text-[10px] uppercase tracking-[0.3em] text-[#E9BF6A]/80">Chạm để mở</p>
          </motion.div>
        ) : (
          <motion.div 
            key="card"
            initial={{ opacity: 0, y: 50, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            transition={{ duration: 1, delay: 0.4 }} 
            className="relative z-10 w-full max-w-sm text-center"
          >
            <div className="mx-auto mb-8 h-24 w-24 rounded-full border-2 border-[#E9BF6A] flex items-center justify-center bg-[#7a1f27] shadow-[0_0_30px_rgba(233,191,106,0.2)]">
              <span className="text-5xl text-[#E9BF6A]">囍</span>
            </div>
            <p className="font-serif text-xs uppercase tracking-[0.3em] text-[#E9BF6A] mb-4">Lễ Thành Hôn</p>
            <h1 className="font-serif text-5xl leading-tight">{groomName}</h1>
            <span className="block text-[#E9BF6A] my-4 text-xl">&</span>
            <h1 className="font-serif text-5xl leading-tight">{brideName}</h1>
            {date && <p className="mt-6 font-serif text-sm tracking-widest">{formatDate(date)}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TemplateOpeningLuxury = ({ groomName, brideName, accentColor, line, date, onComplete }: TemplateOpeningProps) => {
  const [opening, setOpening] = useState(false);
  const handleOpen = () => {
    setOpening(true);
    window.setTimeout(onComplete, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#050505] text-[#FAF5EA]">
      {/* Background radial glow */}
      <motion.div
        className="absolute inset-0 opacity-40 mix-blend-screen"
        animate={opening ? { opacity: 0 } : { opacity: 0.4 }}
        transition={{ duration: 1 }}
        style={{ background: `radial-gradient(circle at 50% 50%, ${accentColor || "#D5B36A"}33 0%, transparent 60%)` }}
      />
      
      {/* Floating Gold Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              backgroundColor: accentColor || "#D5B36A",
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: `0 0 10px ${accentColor || "#D5B36A"}`,
            }}
            animate={{
              y: [0, -60],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={opening ? { scale: 1.1, opacity: 0, filter: "blur(10px)" } : { opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="relative z-10 w-full max-w-md p-14 text-center border-[0.5px] border-[#D5B36A]/40 bg-black/60 backdrop-blur-xl shadow-[0_0_80px_rgba(213,179,106,0.15)] rounded-sm"
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-6 bg-gradient-to-b from-[#D5B36A] to-transparent" />
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-6 bg-gradient-to-t from-[#D5B36A] to-transparent" />
        <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-1 bg-gradient-to-r from-[#D5B36A] to-transparent" />
        <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-1 bg-gradient-to-l from-[#D5B36A] to-transparent" />
        
        <Crown className="w-8 h-8 mx-auto mb-8 text-[#D5B36A] drop-shadow-[0_0_10px_rgba(213,179,106,0.5)]" />
        
        <p className="font-sans text-[9px] uppercase tracking-[0.4em] text-[#D5B36A] mb-6 font-semibold">{line}</p>
        
        <h1 className="font-serif text-5xl md:text-6xl font-light tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]">
          {groomName}
        </h1>
        <div className="flex items-center justify-center gap-4 my-6">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#D5B36A]/50" />
          <span className="font-serif text-2xl italic text-[#D5B36A]">&</span>
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#D5B36A]/50" />
        </div>
        <h1 className="font-serif text-5xl md:text-6xl font-light tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]">
          {brideName}
        </h1>
        
        {date && <p className="mt-8 font-sans text-[10px] uppercase tracking-[0.35em] text-[#D5B36A]/70">{formatDate(date)}</p>}
        
        <motion.button
          data-testid="opening-open"
          onClick={handleOpen}
          whileHover={{ scale: 1.05, textShadow: "0 0 8px rgba(213,179,106,0.8)" }}
          className="mt-12 uppercase text-[10px] tracking-[0.3em] font-semibold text-[#111] bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] px-8 py-3 rounded-sm shadow-[0_0_20px_rgba(213,179,106,0.3)] transition-all hover:shadow-[0_0_30px_rgba(213,179,106,0.6)]"
        >
          {opening ? "Đang mở..." : "Mở Dạ Tiệc"}
        </motion.button>
      </motion.div>
    </div>
  );
};

const TemplateOpeningMagazine = ({ groomName, brideName, accentColor, line, date, onComplete }: TemplateOpeningProps) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#E9E5DF] p-6 text-[#24211D]">
    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }} className="relative z-10 w-full h-full max-w-md bg-[#F8F6F1] shadow-2xl flex flex-col p-8 border-l-8 border-[#B6513A]">
      <div className="flex justify-between items-start w-full">
        <p className="font-sans text-[9px] font-bold uppercase tracking-[0.2em]">The Wedding Issue</p>
        <p className="font-sans text-[9px] font-bold uppercase tracking-widest text-[#B6513A]">Vol. 1</p>
      </div>
      
      <div className="flex-1 flex flex-col justify-center mt-12">
        <h1 className="font-sans text-6xl font-black uppercase leading-[0.85] tracking-tighter">{groomName}</h1>
        <h1 className="font-serif text-5xl italic text-[#B6513A] my-4">&</h1>
        <h1 className="font-sans text-6xl font-black uppercase leading-[0.85] tracking-tighter">{brideName}</h1>
        <p className="mt-8 font-sans text-sm font-medium leading-relaxed max-w-[80%]">{line || "A story of love, laughter, and happily ever after."}</p>
      </div>
      
      <div className="mt-auto flex justify-between items-end border-t-2 border-[#24211D] pt-4">
        <div>
          {date && <p className="font-sans text-[10px] font-bold uppercase tracking-widest">{formatDate(date)}</p>}
          <motion.button data-testid="opening-open" onClick={onComplete} whileHover={{ x: 5 }} className="mt-4 font-sans text-xs font-black uppercase tracking-widest text-[#B6513A] flex items-center gap-2">
            Lật trang bìa <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
        <Barcode className="w-16 h-12 opacity-60" />
      </div>
    </motion.div>
  </div>
);

const TemplateOpeningCanvas = ({ groomName, brideName, accentColor, line, date, onComplete }: TemplateOpeningProps) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#FCFBF8] text-[#27231F] px-6">
    <div className="absolute inset-0 opacity-40 mix-blend-multiply" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')" }} />
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }} className="relative z-10 w-full max-w-sm text-center">
      <div className="mx-auto w-16 h-1 rounded-full mb-8" style={{ backgroundColor: accentColor || "#C78E78" }} />
      <p className="font-sans text-[10px] uppercase tracking-[0.3em] opacity-60 mb-6">Our Wedding Canvas</p>
      <h1 className="font-serif text-5xl md:text-6xl text-neutral-800 italic">{groomName}</h1>
      <span className="block my-4 text-2xl opacity-40 font-serif">and</span>
      <h1 className="font-serif text-5xl md:text-6xl text-neutral-800 italic">{brideName}</h1>
      {date && <p className="mt-8 font-sans text-xs uppercase tracking-[0.2em] opacity-60">{formatDate(date)}</p>}
      <motion.button data-testid="opening-open" onClick={onComplete} whileHover={{ scale: 1.05 }} className="mt-12 rounded-full px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-white shadow-md transition-colors" style={{ backgroundColor: accentColor || "#C78E78" }}>
        Bắt đầu câu chuyện
      </motion.button>
    </motion.div>
  </div>
);

const TemplateOpeningKorean = ({ groomName, brideName, accentColor, line, date, onComplete }: TemplateOpeningProps) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#FDFBF7] text-[#3F3731] px-6">
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="relative z-10 w-full max-w-sm bg-white pt-16 pb-12 px-8 rounded-t-[10rem] rounded-b-2xl shadow-[0_20px_40px_rgba(217,207,196,0.4)] text-center border border-[#EAE3DB]">
      <div className="mx-auto w-12 h-12 rounded-full border border-[#D9CFC4] flex items-center justify-center mb-6">
        <div className="w-1.5 h-1.5 rounded-full bg-[#9B7E67]" />
      </div>
      <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#9B7E67] mb-6">A Quiet Promise</p>
      <h1 className="font-sans text-4xl tracking-tight text-[#3F3731] font-medium">{groomName}</h1>
      <span className="block my-2 text-[#D9CFC4]">|</span>
      <h1 className="font-sans text-4xl tracking-tight text-[#3F3731] font-medium">{brideName}</h1>
      {date && <p className="mt-8 font-sans text-[10px] tracking-widest opacity-60">{formatDate(date)}</p>}
      <motion.button data-testid="opening-open" onClick={onComplete} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-10 w-full py-4 bg-[#9B7E67] text-white rounded-xl font-sans text-xs uppercase tracking-widest shadow-sm">
        Mở thiệp
      </motion.button>
    </motion.div>
  </div>
);

const TemplateOpeningCosmic = ({ groomName, brideName, accentColor, line, date, onComplete }: TemplateOpeningProps) => (
  <motion.div exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }} transition={{ duration: 1.2, ease: "easeInOut" }} className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#050611] text-[#F4F1FF] px-6">
    <motion.div className="absolute w-[80vw] h-[80vw] rounded-full border border-[#E7C77B]/20" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} />
    <motion.div className="absolute w-[60vw] h-[60vw] rounded-full border border-dashed border-[#9B8AF0]/30" animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} />
    
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 1.5 }} className="relative z-10 w-full max-w-sm text-center">
      <p className="font-sans text-[10px] uppercase tracking-[0.5em] text-[#E7C77B] mb-8">Two Orbits, One Destiny</p>
      <h1 className="font-serif text-5xl leading-tight">{groomName}</h1>
      <div className="my-4 text-2xl text-[#9B8AF0] italic">&</div>
      <h1 className="font-serif text-5xl leading-tight">{brideName}</h1>
      {date && <p className="mt-8 font-sans text-[10px] uppercase tracking-[0.4em] opacity-60">{formatDate(date)}</p>}
      <motion.button data-testid="opening-open" onClick={onComplete} whileHover={{ scale: 1.05 }} className="mt-12 rounded-full border border-[#E7C77B]/50 px-8 py-3 font-sans text-[10px] uppercase tracking-[0.3em] hover:bg-[#E7C77B]/10 transition-colors shadow-[0_0_20px_rgba(231,199,123,0.2)]">
        Kích hoạt
      </motion.button>
    </motion.div>
  </motion.div>
);

const TemplateOpeningLayered3D = ({ groomName, brideName, accentColor, line, date, onComplete }: TemplateOpeningProps) => (
  <motion.div exit={{ opacity: 0, scale: 2.5, filter: "blur(20px)" }} transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }} className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#EEF0E3] px-6 text-[#4D5742]">
    <motion.div initial={{ y: -50, x: -50, opacity: 0 }} animate={{ y: 0, x: 0, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="relative z-10 w-full max-w-sm bg-[#FCFBFA] rounded-2xl border border-[#B9C6A6] p-10 text-center shadow-[16px_16px_0_#D8DFC8]">
      <div className="w-12 h-4 bg-[#8B9C73] mx-auto mb-6 rounded-sm" />
      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#8B9C73] mb-4">Memories In Depth</p>
      <h1 className="font-serif text-4xl md:text-5xl font-medium mt-4">{groomName}</h1>
      <span className="block my-2 text-xl italic text-[#B9C6A6]">&</span>
      <h1 className="font-serif text-4xl md:text-5xl font-medium">{brideName}</h1>
      {date && <p className="mt-6 font-sans text-[10px] uppercase tracking-widest opacity-70">{formatDate(date)}</p>}
      <motion.button data-testid="opening-open" onClick={onComplete} whileHover={{ x: -2, y: -2, boxShadow: "6px 6px 0 #D8DFC8" }} whileTap={{ x: 2, y: 2, boxShadow: "0px 0px 0 #D8DFC8" }} className="mt-10 bg-[#8B9C73] text-white px-8 py-3 rounded-xl font-sans text-[10px] uppercase tracking-widest font-bold shadow-[4px_4px_0_#D8DFC8] transition-all">
        Lật lớp ký ức
      </motion.button>
    </motion.div>
  </motion.div>
);

const TemplateOpeningPhoto25D = ({ groomName, brideName, accentColor, line, date, onComplete }: TemplateOpeningProps) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#EEE8DE] px-6 text-[#282520]">
    <motion.div initial={{ rotate: -10, y: 40, opacity: 0 }} animate={{ rotate: -2, y: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="absolute w-[280px] h-[340px] bg-white rounded-sm shadow-[10px_10px_20px_rgba(0,0,0,0.05)] border border-[#E0D5C1]" />
    <motion.div initial={{ rotate: 10, y: -40, opacity: 0 }} animate={{ rotate: 4, y: 0, opacity: 1 }} transition={{ duration: 0.9 }} className="absolute w-[280px] h-[340px] bg-white rounded-sm shadow-[10px_10px_20px_rgba(0,0,0,0.05)] border border-[#E0D5C1]" />
    
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1, delay: 0.2 }} className="relative z-10 w-full max-w-sm bg-[#FBF8F2] p-10 text-center rounded-sm border border-[#8C7A6B]/30 shadow-[12px_12px_0_#D7C0A3]">
      <Images className="mx-auto w-8 h-8 text-[#8C7A6B] mb-6 opacity-80" />
      <p className="font-sans text-[10px] uppercase tracking-widest text-[#8C7A6B] mb-4">Stacked Moments</p>
      <h1 className="font-serif text-4xl">{groomName}</h1>
      <span className="block my-2 text-2xl font-light text-[#8C7A6B]">&</span>
      <h1 className="font-serif text-4xl">{brideName}</h1>
      {date && <p className="mt-6 font-sans text-xs opacity-60 tracking-widest">{formatDate(date)}</p>}
      <motion.button data-testid="opening-open" onClick={onComplete} whileHover={{ scale: 1.05 }} className="mt-10 bg-[#8C7A6B] text-white px-8 py-3 rounded-sm font-sans text-xs uppercase tracking-widest shadow-md">
        Mở Album
      </motion.button>
    </motion.div>
  </div>
);

const TemplateOpeningFlat2D = ({ groomName, brideName, accentColor, line, date, onComplete }: TemplateOpeningProps) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#FFD93D] px-6 text-[#111]">
    <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(90deg,transparent_48%,#111_48%_52%,transparent_52%)] [background-size:40px_40px]" />
    <motion.div initial={{ y: -100 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 10 }} className="relative z-10 w-full max-w-md bg-white border-4 border-black rounded-[2rem] p-10 text-center shadow-[12px_12px_0_#111]">
      <div className="w-16 h-16 bg-[#FF6B6B] rounded-full border-4 border-black mx-auto mb-6 flex items-center justify-center">
        <div className="w-4 h-4 bg-white rounded-full" />
      </div>
      <h1 className="font-sans text-5xl font-black uppercase tracking-tight">{groomName}</h1>
      <span className="block my-2 text-3xl font-black text-[#4ECDC4]">+</span>
      <h1 className="font-sans text-5xl font-black uppercase tracking-tight">{brideName}</h1>
      {date && <p className="mt-6 font-sans text-sm font-bold uppercase tracking-widest border-t-4 border-black pt-4">{formatDate(date)}</p>}
      <motion.button data-testid="opening-open" onClick={onComplete} whileHover={{ scale: 1.05, rotate: -2 }} whileTap={{ scale: 0.95 }} className="mt-8 bg-[#4ECDC4] border-4 border-black px-8 py-4 rounded-full font-sans text-sm font-black uppercase tracking-widest shadow-[6px_6px_0_#111] hover:shadow-[2px_2px_0_#111] hover:translate-x-1 hover:translate-y-1 transition-all">
        Chạm để bắt đầu
      </motion.button>
    </motion.div>
  </div>
);

const TemplateOpeningDefault = ({ variant, groomName, brideName, accentColor, line, date, onComplete }: TemplateOpeningProps) => {
  const icons = { seal: Crown, minimal: Sparkles, letter: Feather, cinema: Clapperboard } as Record<string, typeof Sparkles>;
  const Icon = icons[variant] || Sparkles;
  const framed = variant === "seal";
  const dark = variant === "seal";

  return (
    <motion.div exit={{ opacity: 0, y: -40, scale: 0.95 }} transition={{ duration: 0.8 }} className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-6 ${dark ? "bg-neutral-950 text-white" : "bg-background text-foreground"}`}>
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{ background: `radial-gradient(circle at 50% 40%, ${accentColor}, transparent 55%)` }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={`relative w-full max-w-xl text-center ${framed ? "border p-8 @md:p-12" : ""}`}
        style={framed ? { borderColor: `${accentColor}80` } : undefined}
      >
        <motion.div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: `${accentColor}22`, color: accentColor }}
          animate={{ rotate: variant === "seal" ? [0, 8, -8, 0] : 0 }}
          transition={{ duration: 2.4, repeat: Infinity }}
        >
          <Icon className="h-7 w-7" />
        </motion.div>
        <p className="font-body text-xs uppercase tracking-[0.45em] opacity-70">{line}</p>
        <h1 className="mt-5 font-display text-5xl @md:text-7xl leading-none">
          {groomName}
          <span className="block py-2 text-2xl" style={{ color: accentColor }}>&</span>
          {brideName}
        </h1>
        {date && <p className="mt-4 font-body text-xs uppercase tracking-[0.4em] opacity-60">{formatDate(date)}</p>}
        <motion.button
          data-testid="opening-open"
          onClick={onComplete}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="mt-8 rounded-full px-7 py-3 font-body text-sm font-semibold text-white shadow-lg"
          style={{ backgroundColor: accentColor }}
        >
          {copy[variant] || "Open"}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const TemplateOpening = (rawProps: TemplateOpeningProps) => {
  const handleComplete = () => {
    try {
      window.dispatchEvent(new CustomEvent("wedding:invitation-opened"));
    } catch {
      // ignore
    }
    rawProps.onComplete();
  };
  const props = { ...rawProps, onComplete: handleComplete };
  let opening: ReactNode;
  
  if (props.templateId) {
    switch (props.templateId) {
      case "canvas": opening = <TemplateOpeningCanvas {...props} />; break;
      case "flat2d": opening = <TemplateOpeningFlat2D {...props} />; break;
      case "pixel": opening = <TemplateOpeningPixel {...props} />; break;
      case "korean": opening = <TemplateOpeningKorean {...props} />; break;
      case "cosmic": opening = <TemplateOpeningCosmic {...props} />; break;
      case "luxury": opening = <TemplateOpeningLuxury {...props} />; break;
      case "magazine": opening = <TemplateOpeningMagazine {...props} />; break;
      case "layered3d": opening = <TemplateOpeningLayered3D {...props} />; break;
      case "photo25d": opening = <TemplateOpeningPhoto25D {...props} />; break;
      case "traditional": opening = <TemplateOpeningTraditional {...props} />; break;
    }
  }

  if (!opening) {
    switch (props.variant) {
      case "letter":
        opening = <TemplateOpeningLetter {...props} />;
        break;
      case "cinema":
        opening = <TemplateOpeningCinema {...props} />;
        break;
      case "fluid":
        opening = <TemplateOpeningFluid {...props} />;
        break;
      case "glass":
        opening = <TemplateOpeningGlass {...props} />;
        break;
      case "map":
        opening = <TemplateOpeningMap {...props} />;
        break;
      case "gallery":
        if (props.templateId === "boho") {
          opening = <TemplateOpeningBoho {...props} />;
        } else {
          opening = <TemplateOpeningGallery {...props} />;
        }
        break;
      case "minimal":
        opening = <TemplateOpeningMinimal {...props} />;
        break;
      case "rustic":
        opening = <TemplateOpeningRustic {...props} />;
        break;
      case "vintage":
        opening = <TemplateOpeningVintage {...props} />;
        break;
      case "coastal":
        opening = <TemplateOpeningCoastal {...props} />;
        break;
      case "winter":
        opening = <TemplateOpeningWinter {...props} />;
        break;
      case "aurora":
        opening = <TemplateOpeningAurora {...props} />;
        break;
      case "cyber":
        opening = <TemplateOpeningCyber {...props} />;
        break;
      case "violet_dream":
        opening = <TemplateOpeningVioletDream {...props} />;
        break;
      case "parallax_love":
        opening = <TemplateOpeningParallaxLove {...props} />;
        break;
      default:
        opening = <TemplateOpeningDefault {...props} />;
        break;
    }
  }
  return <div data-template-opening={props.templateId || props.variant}>{opening}</div>;
};

export default TemplateOpening;

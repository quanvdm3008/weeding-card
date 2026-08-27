import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { WeddingTheme } from "@/data/themes";
import couple1 from "@/assets/couple-1.jpg";
import couple2 from "@/assets/couple-2.jpg";
import { SparklingImage } from "@/components/wedding/SparklingImage";

// ─── Couple Variants ──────────────────────────────────
interface CoupleProps { groomName: string; brideName: string; accentColor: string; theme: WeddingTheme }

const PersonAvatar = ({ name, img, accentColor, rotate, theme, desc, animate }: { name: string; img: string; accentColor: string; rotate: number; theme: WeddingTheme; desc: string; animate?: boolean }) => {
  // Photo shape/border follows the styleVariant, not just cardRadius, so couples on
  // different styles don't all end up as the same plain circle.
  const sv = theme.styleVariant;
  const shapeClass = sv === "cinematic" || sv === "magazine" || theme.cardRadius === "rounded-none" ? "rounded-none" : sv === "fluid" ? "" : "rounded-full";
  const shapeStyle = sv === "fluid" ? { borderRadius: "42% 58% 65% 35% / 48% 40% 60% 52%" } : {};
  const borderStyle = sv === "map" ? "dashed" : sv === "letter" ? "double" : sv === "rustic" ? "solid" : "solid";
  const imgFilter = sv === "vintage" ? "sepia(0.5) contrast(1.05)" : undefined;

  return (
    <div className="text-center">
      <div className="relative w-56 h-56 mx-auto mb-6">
        {sv === "glass" && (
          <div className={`absolute -inset-3 backdrop-blur-md bg-white/15 border border-white/30 ${shapeClass}`} style={shapeStyle} />
        )}
        <motion.div
          className={shapeClass}
          style={{ position: "absolute", inset: 0, borderStyle, borderWidth: borderStyle === "double" ? 6 : sv === "rustic" ? 5 : 3, borderColor: accentColor, transform: `rotate(${rotate}deg)`, ...shapeStyle }}
          animate={animate ? { rotate: [rotate, -rotate, rotate] } : {}}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <img src={img} alt={name} loading="lazy" className={`w-full h-full object-cover shadow-xl ${shapeClass}`} style={{ ...shapeStyle, filter: imgFilter }} />
        {sv === "gallery" && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-4 rotate-3 rounded-sm opacity-80 z-10" style={{ backgroundColor: accentColor }} />
        )}
        {sv === "cinematic" && (
          <div className="absolute -inset-2 pointer-events-none" style={{ border: `1px solid ${accentColor}40` }} />
        )}
        {sv === "vintage" && (
          <>
            <div className="absolute -top-1 -left-1 w-4 h-4 z-10" style={{ background: "linear-gradient(135deg, #8B6914 50%, transparent 50%)" }} />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 z-10" style={{ background: "linear-gradient(-45deg, #8B6914 50%, transparent 50%)" }} />
          </>
        )}
        {sv === "rustic" && (
          <div className="absolute -top-2 -right-2 w-6 h-6 rotate-45 border-t-2 z-10" style={{ borderColor: `${accentColor}90` }} />
        )}
      </div>
      <h3 className="font-display text-2xl font-bold text-foreground">{name}</h3>
      <p className="text-muted-foreground font-body text-sm mt-2 leading-relaxed max-w-xs mx-auto">{desc}</p>
    </div>
  );
};

const CoupleSideBySide = ({ groomName, brideName, accentColor, theme }: CoupleProps) => (
  <div className="grid @md:grid-cols-2 gap-16 items-center">
    <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
      <PersonAvatar name={groomName} img={couple1} accentColor={accentColor} rotate={6} theme={theme} desc="A romantic guy, always wanting to bring happiness to the person he loves." animate={theme.animationIntensity === "dramatic"} />
    </motion.div>
    <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
      <PersonAvatar name={brideName} img={couple2} accentColor={accentColor} rotate={-6} theme={theme} desc="A gentle girl, always shining with a warm smile and a kind heart." animate={theme.animationIntensity === "dramatic"} />
    </motion.div>
  </div>
);

const CoupleDiagonal = ({ groomName, brideName, accentColor, theme }: CoupleProps) => (
  <div className="grid @md:grid-cols-5 gap-8 items-center">
    <motion.div initial={{ opacity: 0, x: -60, rotate: -8 }} whileInView={{ opacity: 1, x: 0, rotate: 0 }} viewport={{ once: true }} className="@md:col-span-2 @md:translate-y-[-30px]">
      <PersonAvatar name={groomName} img={couple1} accentColor={accentColor} rotate={-8} theme={theme} desc="Groom on the big day." />
    </motion.div>
    <div className="hidden @md:flex items-center justify-center @md:col-span-1">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="text-5xl" style={{ color: accentColor }}>✦</motion.div>
    </div>
    <motion.div initial={{ opacity: 0, x: 60, rotate: 8 }} whileInView={{ opacity: 1, x: 0, rotate: 0 }} viewport={{ once: true }} className="@md:col-span-2 @md:translate-y-[30px]">
      <PersonAvatar name={brideName} img={couple2} accentColor={accentColor} rotate={8} theme={theme} desc="Beautiful bride." />
    </motion.div>
  </div>
);

const CoupleCircularOrbit = ({ groomName, brideName, accentColor, theme }: CoupleProps) => (
  <div className="relative max-w-3xl mx-auto min-h-[600px] flex items-center justify-center py-10">
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-2 border-dashed pointer-events-none" style={{ borderColor: `${accentColor}40` }} />
    <motion.div animate={{ rotate: -360 }} transition={{ duration: 80, repeat: Infinity, ease: "linear" }} className="absolute inset-12 rounded-full border pointer-events-none" style={{ borderColor: `${accentColor}20` }} />
    <div className="grid grid-cols-1 @md:grid-cols-2 gap-8 z-10">
      <motion.div initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", delay: 0.1 }}>
        <PersonAvatar name={groomName} img={couple1} accentColor={accentColor} rotate={0} theme={theme} desc="Groom." />
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", delay: 0.3 }}>
        <PersonAvatar name={brideName} img={couple2} accentColor={accentColor} rotate={0} theme={theme} desc="Bride." />
      </motion.div>
    </div>
  </div>
);

const CoupleSplitFrame = ({ groomName, brideName, accentColor, theme }: CoupleProps) => (
  <div className="grid @md:grid-cols-2 max-w-4xl mx-auto border" style={{ borderColor: `${accentColor}40` }}>
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="p-10 border-b @md:border-b-0 @md:border-r" style={{ borderColor: `${accentColor}40` }}>
      <PersonAvatar name={groomName} img={couple1} accentColor={accentColor} rotate={0} theme={theme} desc="Half of me." />
    </motion.div>
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="p-10">
      <PersonAvatar name={brideName} img={couple2} accentColor={accentColor} rotate={0} theme={theme} desc="Half of you." />
    </motion.div>
  </div>
);


const CoupleFloatingGlass = ({ groomName, brideName, accentColor }: CoupleProps) => (
  <div className="relative max-w-5xl mx-auto min-h-[600px] py-10 flex flex-col @md:flex-row items-center justify-center gap-8 @md:gap-16">
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ backgroundColor: accentColor }} />
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 70, repeat: Infinity, ease: "linear" }} className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ backgroundColor: accentColor }} />
    </div>

    <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring", duration: 1.5 }} className="relative z-10">
      <div className="w-64 h-80 @md:w-80 @md:h-[400px] bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: accentColor }} />
        <img src={couple1} alt={groomName} className="w-32 h-32 @md:w-40 @md:h-40 object-cover rounded-full border-4 border-white/50 shadow-lg mb-6" />
        <h3 className="font-display text-3xl font-bold text-foreground">{groomName}</h3>
        <p className="text-muted-foreground font-body text-sm mt-3 text-center px-4">"My peaceful landing place."</p>
      </div>
    </motion.div>

    <motion.div initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="hidden @md:flex relative z-10 w-16 h-16 rounded-full bg-background shadow-xl items-center justify-center text-3xl italic">
      <span style={{ color: accentColor }}>&</span>
    </motion.div>

    <motion.div initial={{ opacity: 0, y: -50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring", duration: 1.5, delay: 0.2 }} className="relative z-10">
      <div className="w-64 h-80 @md:w-80 @md:h-[400px] bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1" style={{ backgroundColor: accentColor }} />
        <img src={couple2} alt={brideName} className="w-32 h-32 @md:w-40 @md:h-40 object-cover rounded-full border-4 border-white/50 shadow-lg mb-6" />
        <h3 className="font-display text-3xl font-bold text-foreground">{brideName}</h3>
        <p className="text-muted-foreground font-body text-sm mt-3 text-center px-4">"Your perfect piece."</p>
      </div>
    </motion.div>
  </div>
);

const CouplePolaroidScatter = ({ groomName, brideName, accentColor }: CoupleProps) => (
  <div className="relative max-w-4xl mx-auto min-h-[500px] py-12 flex items-center justify-center">
    <motion.div initial={{ opacity: 0, x: -50, rotate: -20 }} whileInView={{ opacity: 1, x: 0, rotate: -10 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="absolute left-4 @md:left-20 top-10 @md:top-20 z-10">
      <div className="bg-white p-3 pb-12 shadow-2xl rounded-sm w-48 @md:w-64">
        <img src={couple1} alt={groomName} className="w-full h-48 @md:h-64 object-cover filter sepia-[0.2]" />
        <p className="absolute bottom-4 left-0 right-0 text-center font-display text-xl text-gray-800">{groomName}</p>
      </div>
    </motion.div>

    <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }} className="relative z-20 mx-4 mt-32 @md:mt-0">
      <div className="w-20 h-20 bg-background rounded-full border-4 flex items-center justify-center shadow-lg" style={{ borderColor: accentColor }}>
        <Heart className="w-8 h-8 animate-heartbeat" fill={accentColor} style={{ color: accentColor }} />
      </div>
    </motion.div>

    <motion.div initial={{ opacity: 0, x: 50, rotate: 20 }} whileInView={{ opacity: 1, x: 0, rotate: 12 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="absolute right-4 @md:right-20 bottom-10 @md:bottom-20 z-10">
      <div className="bg-white p-3 pb-12 shadow-2xl rounded-sm w-48 @md:w-64">
        <img src={couple2} alt={brideName} className="w-full h-48 @md:h-64 object-cover filter sepia-[0.2]" />
        <p className="absolute bottom-4 left-0 right-0 text-center font-display text-xl text-gray-800">{brideName}</p>
      </div>
    </motion.div>
  </div>
);

// Couple — Map (tropical): two waypoint pins connected by a dashed route
const CoupleJourneyPins = ({ groomName, brideName, accentColor, theme }: CoupleProps) => (
  <div className="relative max-w-3xl mx-auto py-8">
    <svg className="absolute left-0 right-0 top-28 w-full h-12 hidden @md:block" viewBox="0 0 400 40" preserveAspectRatio="none">
      <path d="M20 30 Q 200 -10, 380 30" stroke={`${accentColor}60`} strokeWidth="2" strokeDasharray="6 6" fill="none" />
    </svg>
    <div className="grid @md:grid-cols-2 gap-16 items-start relative z-10">
      <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <span className="block text-center font-body text-[10px] uppercase tracking-[0.3em] mb-2" style={{ color: accentColor }}>Waypoint A</span>
        <PersonAvatar name={groomName} img={couple1} accentColor={accentColor} rotate={0} theme={theme} desc="Groom." />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
        <span className="block text-center font-body text-[10px] uppercase tracking-[0.3em] mb-2" style={{ color: accentColor }}>Waypoint B</span>
        <PersonAvatar name={brideName} img={couple2} accentColor={accentColor} rotate={0} theme={theme} desc="Bride." />
      </motion.div>
    </div>
  </div>
);

// Couple — Letter (romantic): two photos inside an open letter fold
const CoupleEnvelope = ({ groomName, brideName, accentColor, theme }: CoupleProps) => (
  <div className="relative max-w-3xl mx-auto bg-white/70 backdrop-blur-sm rounded-sm p-8 @md:p-12" style={{ boxShadow: `0 20px 50px -20px ${accentColor}40` }}>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-10 -translate-y-10" style={{ backgroundColor: `${accentColor}50` }} />
    <div className="grid @md:grid-cols-2 gap-10 items-center">
      <PersonAvatar name={groomName} img={couple1} accentColor={accentColor} rotate={-3} theme={theme} desc="My boy." />
      <PersonAvatar name={brideName} img={couple2} accentColor={accentColor} rotate={3} theme={theme} desc="Your girl." />
    </div>
    <p className="text-center font-display italic text-sm text-muted-foreground mt-8">"Sent to the two people I love the most."</p>
  </div>
);

// Couple — Minimal: plain row, no ornament
const CoupleMinimalRow = ({ groomName, brideName, accentColor, theme }: CoupleProps) => (
  <div className="grid @md:grid-cols-2 gap-12 max-w-2xl mx-auto">
    <PersonAvatar name={groomName} img={couple1} accentColor={accentColor} rotate={0} theme={theme} desc="" />
    <PersonAvatar name={brideName} img={couple2} accentColor={accentColor} rotate={0} theme={theme} desc="" />
  </div>
);

// Couple — Vintage: sepia portraits under an ornate album frame
const CoupleAlbumFrame = ({ groomName, brideName, accentColor, theme }: CoupleProps) => (
  <div className="max-w-3xl mx-auto p-6 @md:p-10" style={{ backgroundColor: "#F5E6CC", boxShadow: "0 20px 50px -20px rgba(80,60,20,0.4)" }}>
    <div className="grid @md:grid-cols-2 gap-10">
      <PersonAvatar name={groomName} img={couple1} accentColor={accentColor} rotate={-2} theme={theme} desc="Groom." />
      <PersonAvatar name={brideName} img={couple2} accentColor={accentColor} rotate={2} theme={theme} desc="Bride." />
    </div>
  </div>
);

const CoupleParallaxTarot = ({ groomName, brideName, accentColor }: CoupleProps) => (
  <div className="grid md:grid-cols-2 gap-16 sm:gap-24 max-w-5xl mx-auto">
    {[
      { name: groomName, role: "Chú Rể", img: couple1 },
      { name: brideName, role: "Cô Dâu", img: couple2 }
    ].map((person, idx) => (
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: idx * 0.2 }}
        className="flex flex-col items-center"
      >
        <div className="relative w-full max-w-[320px] aspect-[3/4] group">
          <div className="absolute inset-[-12px] border border-[#D5B36A]/20 transition-all duration-700 group-hover:inset-[-16px] group-hover:border-[#D5B36A]/40" />
          <div className="w-full h-full p-2 border border-[#D5B36A]/40 bg-black/80 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />
            <SparklingImage
              accentColor={accentColor}
              src={person.img}
              alt={person.role}
              className="w-full h-full object-cover filter sepia-[0.1] contrast-[1.1] brightness-[0.8] transition-all duration-700 group-hover:scale-105 group-hover:brightness-100"
            />
            <div className="absolute bottom-8 w-full text-center z-20">
              <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#D5B36A] mb-3">
                {person.role}
              </p>
              <h3 className="font-display text-3xl text-[#FFF5D6]">
                {person.name}
              </h3>
            </div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

const CoupleSection = ({ groomName, brideName, accentColor, theme }: CoupleProps) => {
  const renderLayout = () => {
    switch (theme.styleVariant) {
      case "magazine":  return <CoupleSplitFrame groomName={groomName} brideName={brideName} accentColor={accentColor} theme={theme} />;
      case "fluid":     return <CoupleCircularOrbit groomName={groomName} brideName={brideName} accentColor={accentColor} theme={theme} />;
      case "glass":     return <CoupleFloatingGlass groomName={groomName} brideName={brideName} accentColor={accentColor} theme={theme} />;
      case "gallery":   return <CouplePolaroidScatter groomName={groomName} brideName={brideName} accentColor={accentColor} theme={theme} />;
      case "rustic":    return <CoupleDiagonal groomName={groomName} brideName={brideName} accentColor={accentColor} theme={theme} />;
      case "map":       return <CoupleJourneyPins groomName={groomName} brideName={brideName} accentColor={accentColor} theme={theme} />;
      case "letter":    return <CoupleEnvelope groomName={groomName} brideName={brideName} accentColor={accentColor} theme={theme} />;
      case "minimal":   return <CoupleMinimalRow groomName={groomName} brideName={brideName} accentColor={accentColor} theme={theme} />;
      case "vintage":   return <CoupleAlbumFrame groomName={groomName} brideName={brideName} accentColor={accentColor} theme={theme} />;
      default:          return <CoupleSideBySide groomName={groomName} brideName={brideName} accentColor={accentColor} theme={theme} />;
    }
  };

  if (theme.id === "luxury") {
    return (
      <section className="py-32 bg-[#050505] relative overflow-hidden w-full">
        <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-[#D5B36A]/5 rounded-full blur-[120px]" />
        <div className="max-w-5xl mx-auto px-6 relative z-10 w-full">
          <div className="text-center mb-24">
            <h2 className="font-display text-4xl sm:text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] to-[#FCF6BA]">
              Cô Dâu & Chú Rể
            </h2>
            <div className="flex items-center justify-center gap-4 py-8 opacity-60">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D5B36A]" />
              <div className="w-2 h-2 rotate-45 border border-[#D5B36A]" />
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D5B36A]" />
            </div>
          </div>
          {renderLayout()}
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-xs tracking-[0.4em] uppercase font-body" style={{ color: accentColor }}>Introduce</span>
          <h2 className="font-display text-4xl @md:text-5xl font-bold text-foreground mt-3">Bride & Groom</h2>
        </motion.div>
        {renderLayout()}
      </div>
    </section>
  );
};


export default CoupleSection;

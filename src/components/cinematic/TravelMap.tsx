import { motion } from "framer-motion";
import { MapPin, Navigation, Car, Plane, Compass, ExternalLink } from "lucide-react";
import venueImg from "@/assets/venue.jpg";
import { WeddingTheme } from "@/data/themes";

const stops = [
  { icon: Plane, label: "Tan Son Nhat Airport", time: "~25 minutes" },
  { icon: Car, label: "District 1 — center", time: "~10 minutes" },
  { icon: Navigation, label: "Free parking", time: "Floor B1" },
  { icon: Compass, label: "Main lobby entrance", time: "Gate number 2" },
];

const TravelMap = ({
  venue,
  address,
  accentColor,
  theme,
}: {
  venue: string;
  address: string;
  accentColor: string;
  theme: WeddingTheme;
}) => {
  const mapsQ = encodeURIComponent(`${venue} ${address}`);
  const layout = theme?.travelLayout || "cinematic";

  if (layout === "modern") {
    return (
      <section id="travel" className="relative py-24 @sm:py-32 px-4 overflow-hidden bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid @lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center @lg:text-left">
              <div>
                <span className="text-[11px] tracking-[0.4em] uppercase font-body" style={{ color: accentColor }}>Location</span>
                <h2 className="font-display text-4xl @sm:text-5xl font-bold mt-3 text-foreground uppercase tracking-tight">Road to <br/> event</h2>
                <p className="text-muted-foreground font-body mt-4 text-lg">Every journey leads to this moment.</p>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="p-6 bg-card border-l-4 shadow-sm" style={{ borderColor: accentColor }}>
                  <h3 className="font-display text-2xl font-bold text-foreground">{venue}</h3>
                  <p className="font-body text-muted-foreground mt-2">{address}</p>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${mapsQ}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background font-body font-bold text-sm uppercase tracking-widest hover:opacity-80 transition-opacity w-full @sm:w-auto"
                >
                  <Navigation className="w-4 h-4" />
                  Open Google Maps
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stops.map((s) => (
                <div key={s.label} className="p-6 bg-card border border-border flex flex-col items-center text-center gap-3 hover:border-foreground transition-colors group">
                  <s.icon className="w-8 h-8 opacity-50 group-hover:opacity-100 transition-opacity" style={{ color: accentColor }} />
                  <div>
                    <p className="font-body text-sm font-bold text-foreground">{s.label}</p>
                    <p className="font-body text-xs text-muted-foreground mt-1">{s.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layout === "romantic") {
    return (
      <section id="travel" className="relative py-24 @sm:py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <div className={`bg-card/80 backdrop-blur-md p-8 @sm:p-16 border text-center relative overflow-hidden ${theme.cardRadius}`} style={{ borderColor: `${accentColor}30`, boxShadow: `0 20px 60px -20px ${accentColor}20` }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
            
            <MapPin className="w-10 h-10 mx-auto mb-6" style={{ color: accentColor }} />
            <span className="font-display italic text-2xl" style={{ color: accentColor }}>Let's create memories together</span>
            <h2 className="font-display text-4xl @sm:text-5xl font-medium mt-2 text-foreground mb-12">Road Map</h2>

            <div className="max-w-xl mx-auto mb-12">
              <h3 className="font-display text-3xl font-semibold text-foreground">{venue}</h3>
              <p className="font-body text-muted-foreground mt-3 text-lg leading-relaxed">{address}</p>
            </div>

            <div className="grid @sm:grid-cols-2 gap-6 mb-12 text-left">
              {stops.map((s) => (
                <div key={s.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-background border border-border shrink-0">
                    <s.icon className="w-4 h-4" style={{ color: accentColor }} />
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">{s.label}</p>
                    <p className="font-body text-xs text-muted-foreground">{s.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${mapsQ}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-body text-sm hover:opacity-90 transition-opacity"
              style={{ background: accentColor }}
            >
              <Navigation className="w-4 h-4" />
              See route on map
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="travel" className="relative py-24 @sm:py-32 px-4 overflow-hidden">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <span className="text-[11px] tracking-[0.4em] uppercase font-body" style={{ color: accentColor }}>
          Travel Experience
        </span>
        <h2 className="font-display text-4xl @sm:text-5xl @md:text-6xl font-medium mt-3 text-foreground">
          Road to <span className="italic" style={{ color: accentColor }}>love</span>
        </h2>
        <p className="text-muted-foreground font-body mt-4">
          A short — but memorable journey. Please arrive on time.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid @lg:grid-cols-5 gap-6">
        {/* Cinematic venue card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="@lg:col-span-3 relative rounded-3xl overflow-hidden aspect-[5/4] @lg:aspect-auto group"
          style={{ boxShadow: `0 30px 80px -30px ${accentColor}66` }}
        >
          <motion.img
            src={venueImg}
            alt={venue}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.15 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.5, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Animated path overlay (SVG) */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 400" preserveAspectRatio="none">
            <defs>
              <linearGradient id="pathG" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={accentColor} stopOpacity="0" />
                <stop offset="50%" stopColor={accentColor} stopOpacity="1" />
                <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 40 340 Q 180 240 280 280 T 560 80"
              stroke="url(#pathG)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              strokeDasharray="6 10"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
            <motion.circle
              r="6"
              fill={accentColor}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <animateMotion
                dur="4s"
                repeatCount="indefinite"
                path="M 40 340 Q 180 240 280 280 T 560 80"
              />
            </motion.circle>
          </svg>

          {/* Pulse marker */}
          <div className="absolute top-[18%] right-[8%]">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: accentColor }} />
              <span className="relative inline-flex rounded-full h-4 w-4 ring-2 ring-white" style={{ background: accentColor }} />
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 @md:p-8">
            <div className="flex items-start gap-3 mb-3">
              <MapPin className="w-5 h-5 mt-1" style={{ color: accentColor }} />
              <div>
                <p className="text-xs tracking-[0.3em] uppercase font-body text-white/70">Organization location</p>
                <h3 className="font-display text-2xl @md:text-3xl text-white font-semibold">{venue}</h3>
                <p className="font-body text-sm text-white/80 mt-1 max-w-md">{address}</p>
              </div>
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${mapsQ}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-2 px-5 py-3 rounded-full backdrop-blur-xl border border-white/30 text-white font-body text-sm font-semibold hover:bg-white/20 transition-colors"
              style={{ background: `${accentColor}cc` }}
            >
              <Navigation className="w-4 h-4" />
              Directions now
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </motion.div>

        {/* Itinerary */}
        <div className="@lg:col-span-2 space-y-3">
          {stops.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative flex items-center gap-4 p-4 rounded-2xl border backdrop-blur-xl"
              style={{
                background: "rgba(255,255,255,0.5)",
                borderColor: `${accentColor}33`,
                boxShadow: `0 10px 30px -10px ${accentColor}33`,
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl grid place-items-center flex-none"
                style={{ background: `${accentColor}22`, color: accentColor }}
              >
                <s.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-body text-sm font-semibold text-foreground">{s.label}</p>
                <p className="font-body text-xs text-muted-foreground">{s.time}</p>
              </div>
              <span className="text-xs font-body text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TravelMap;

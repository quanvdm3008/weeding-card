import { motion } from "framer-motion";
import { Heart, Sparkles, Coffee, Plane, Gem, Gift, Camera, Star } from "lucide-react";

const milestones = [
  { icon: Coffee, label: "First date", date: "10/2019" },
  { icon: Plane, label: "Maiden voyage", date: "06/2020" },
  { icon: Heart, label: "Say love", date: "02/2021" },
  { icon: Camera, label: "First set of photos", date: "12/2022" },
  { icon: Gift, label: "Living together", date: "08/2023" },
  { icon: Sparkles, label: "Meet the family", date: "01/2024" },
  { icon: Star, label: "Propose", date: "10/2025" },
  { icon: Gem, label: "Big day", date: "02/2027" },
];

const MemoriesSection = ({ accentColor }: { accentColor: string }) => {
  return (
    <section id="memories" className="relative py-24 @sm:py-32 px-4 overflow-hidden">
      <div className="max-w-3xl mx-auto text-center mb-14">
        <span className="text-[11px] tracking-[0.4em] uppercase font-body" style={{ color: accentColor }}>
          Memories · Milestones
        </span>
        <h2 className="font-display text-4xl @sm:text-5xl @md:text-6xl font-medium mt-3 text-foreground">
          Things <span className="italic" style={{ color: accentColor }}>unforgettable</span>
        </h2>
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div className="absolute left-4 @md:left-1/2 @md:-translate-x-1/2 top-0 bottom-0 w-px bg-foreground/10" />
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5 }}
          className="absolute left-4 @md:left-1/2 @md:-translate-x-1/2 top-0 bottom-0 w-px origin-top"
          style={{ background: `linear-gradient(to bottom, transparent, ${accentColor}, transparent)` }}
        />

        <div className="space-y-8">
          {milestones.map((m, i) => {
            const right = i % 2 === 1;
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, x: right ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className={`relative pl-14 @md:pl-0 @md:grid @md:grid-cols-2 @md:gap-12 @md:items-center ${
                  right ? "" : ""
                }`}
              >
                {/* dot */}
                <div
                  className="absolute left-4 @md:left-1/2 @md:-translate-x-1/2 top-4 w-3 h-3 rounded-full ring-4 ring-background z-10"
                  style={{ background: accentColor, boxShadow: `0 0 16px ${accentColor}` }}
                />

                <div className={right ? "@md:order-2 @md:pl-10" : "@md:order-1 @md:pr-10 @md:text-right"}>
                  <div
                    className="inline-flex items-center gap-3 p-4 rounded-2xl border backdrop-blur-xl"
                    style={{
                      background: "rgba(255,255,255,0.55)",
                      borderColor: `${accentColor}33`,
                      boxShadow: `0 10px 30px -10px ${accentColor}33`,
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-xl grid place-items-center flex-none"
                      style={{ background: `${accentColor}22`, color: accentColor }}
                    >
                      <m.icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-display text-lg font-semibold text-foreground">{m.label}</p>
                      <p className="font-body text-xs text-muted-foreground tracking-wider">{m.date}</p>
                    </div>
                  </div>
                </div>
                <div className="hidden @md:block" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MemoriesSection;

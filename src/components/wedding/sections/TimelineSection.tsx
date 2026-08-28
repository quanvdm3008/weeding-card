import { motion } from "framer-motion";
import type { ScheduleEvent } from "@/data/seedData";
import type { WeddingTheme } from "@/data/themes";

type TimelineVariantProps = { schedule: ScheduleEvent[]; accentColor: string };

const TimelineCinematic = ({ schedule, accentColor }: TimelineVariantProps) => (
  <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-inherit">
    <div className="text-center mb-16 relative">
      <p className="font-sans text-[10px] uppercase tracking-[0.4em] font-bold mb-2 opacity-70" style={{ color: accentColor }}>Timeline</p>
      <h2 className="font-serif text-4xl sm:text-5xl font-light text-inherit">Lịch Trình Hôn Lễ</h2>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-current opacity-5 blur-[60px] rounded-full" />
    </div>
    <div className="w-full relative">
      <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-current to-transparent opacity-15" />
      <div className="space-y-24">
        {schedule.map((event: ScheduleEvent, index: number) => {
          const isEven = index % 2 === 0;
          return (
            <motion.div key={index} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1 }} className={`relative flex flex-col sm:flex-row items-start sm:items-center w-full group`}>
              {/* Cinematic Diamond Dot */}
              <div className="absolute left-8 sm:left-1/2 w-4 h-4 -translate-x-1/2 mt-2 sm:mt-0 rotate-45 transition-transform duration-700 group-hover:rotate-[225deg]" style={{ backgroundColor: accentColor, boxShadow: `0 0 20px ${accentColor}` }} />
              
              <div className={`pl-20 sm:pl-0 sm:w-1/2 flex items-center ${isEven ? "sm:justify-end sm:pr-16" : "sm:justify-start sm:pl-16 sm:order-2"}`}>
                <span className="font-serif text-4xl sm:text-6xl italic font-light tracking-wider opacity-90" style={{ color: accentColor }}>{event.time}</span>
              </div>
              
              <div className={`pl-20 sm:pl-0 mt-4 sm:mt-0 sm:w-1/2 flex flex-col ${isEven ? "sm:items-start sm:pl-16 sm:order-2" : "sm:items-end sm:pr-16 sm:text-right"}`}>
                <h3 className="font-serif text-2xl sm:text-3xl mb-3 tracking-wide text-inherit">{event.title}</h3>
                {event.description && <p className="font-sans text-sm opacity-75 leading-relaxed max-w-sm text-inherit">{event.description}</p>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </div>
);

const TimelineRustic = ({ schedule, accentColor }: TimelineVariantProps) => (
  <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
    <div className="text-center mb-16">
      <h2 className="font-serif text-4xl sm:text-5xl text-[#5c4a3d] italic mb-4">Lịch Trình Đám Cưới</h2>
      <div className="flex justify-center items-center gap-2">
        <div className="w-12 h-px bg-[#8B6914]/30" />
        <span className="text-[#8B6914]">🌿</span>
        <div className="w-12 h-px bg-[#8B6914]/30" />
      </div>
    </div>
    <div className="w-full relative">
      {/* Rustic dashed line */}
      <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-px border-l-2 border-dashed border-[#8B6914]/30" />
      <div className="space-y-12">
        {schedule.map((event: ScheduleEvent, index: number) => {
          const isEven = index % 2 === 0;
          return (
            <motion.div key={index} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className={`relative flex flex-col sm:flex-row items-start sm:items-center w-full`}>
              <div className="absolute left-8 sm:left-1/2 w-6 h-6 -translate-x-[11px] mt-4 sm:mt-0 bg-[#F5E6CC] border border-[#8B6914]/50 flex items-center justify-center rounded-sm rotate-12">
                <div className="w-1 h-1 rounded-full bg-[#8B6914]" />
              </div>
              
              <div className={`pl-20 sm:pl-0 sm:w-1/2 flex items-center ${isEven ? "sm:justify-end sm:pr-12" : "sm:justify-start sm:pl-12 sm:order-2"}`}>
                <div className="bg-[#8B6914]/5 px-4 py-2 border border-[#8B6914]/20 rounded-sm">
                  <span className="font-serif text-2xl font-semibold" style={{ color: accentColor }}>{event.time}</span>
                </div>
              </div>
              
              <div className={`pl-20 sm:pl-0 mt-2 sm:mt-0 sm:w-1/2 flex flex-col ${isEven ? "sm:items-start sm:pl-12 sm:order-2" : "sm:items-end sm:pr-12 sm:text-right"}`}>
                <h3 className="font-serif text-xl sm:text-2xl mb-2 text-[#5c4a3d]">{event.title}</h3>
                {event.description && <p className="font-sans text-xs opacity-80 leading-relaxed max-w-[280px] text-[#5c4a3d]/80">{event.description}</p>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </div>
);

const TimelineGlass = ({ schedule, accentColor }: TimelineVariantProps) => (
  <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-inherit">
    <div className="text-center mb-16">
      <p className="font-sans text-[10px] uppercase tracking-[0.35em] font-bold mb-3" style={{ color: accentColor }}>LỊCH TRÌNH</p>
      <h2 className="font-serif text-4xl sm:text-5xl font-light text-inherit">Lịch Trình Hôn Lễ</h2>
    </div>
    <div className="w-full relative">
      <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-current opacity-15 hidden sm:block" />
      <div className="space-y-8">
        {schedule.map((event: ScheduleEvent, index: number) => {
          const isEven = index % 2 === 0;
          return (
            <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className={`relative flex flex-col sm:flex-row items-center w-full`}>
              <div className="hidden sm:flex absolute left-1/2 w-12 h-12 -translate-x-1/2 items-center justify-center bg-white/80 dark:bg-white/10 backdrop-blur-md border border-white/90 dark:border-white/30 rounded-full z-10 shadow-lg" style={{ borderColor: `${accentColor}50` }}>
                <div className="w-3.5 h-3.5 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: accentColor, color: accentColor }} />
              </div>
              <div className={`w-full sm:w-1/2 ${isEven ? "sm:pr-16 text-right" : "sm:pl-16 sm:order-2 text-left"}`}>
                <div className="bg-white/85 dark:bg-white/10 backdrop-blur-xl border border-white/90 dark:border-white/20 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:bg-white dark:hover:bg-white/15 transition-all text-inherit">
                  <span className="font-serif text-3xl sm:text-4xl font-semibold mb-2 block" style={{ color: accentColor }}>{event.time}</span>
                  <h3 className="font-serif text-xl sm:text-2xl mb-2 font-medium text-inherit">{event.title}</h3>
                  {event.description && <p className="font-sans text-xs opacity-80 leading-relaxed text-inherit">{event.description}</p>}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </div>
);

const TimelineDefault = ({ schedule, accentColor }: TimelineVariantProps) => (
  <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-inherit">
    <div className="text-center mb-16">
      <p className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold mb-3 opacity-70" style={{ color: accentColor }}>LỊCH TRÌNH</p>
      <h2 className="font-serif text-4xl sm:text-5xl text-inherit">Lịch Trình Hôn Lễ</h2>
    </div>
    <div className="w-full max-w-2xl relative">
      <div className="absolute left-[24px] sm:left-1/2 top-0 bottom-0 w-px bg-current opacity-20" />
      <div className="space-y-16">
        {schedule.map((event: ScheduleEvent, index: number) => {
          const isEven = index % 2 === 0;
          return (
            <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: index * 0.15, duration: 0.7 }} className={`relative flex flex-col sm:flex-row items-start sm:items-center w-full group`}>
              <div className="absolute left-[24px] sm:left-1/2 w-4 h-4 rounded-full -translate-x-[7px] mt-1 sm:mt-0 transition-transform duration-500 group-hover:scale-150" style={{ backgroundColor: accentColor }} />
              <div className={`pl-14 sm:pl-0 sm:w-1/2 flex items-center ${isEven ? "sm:justify-end sm:pr-12" : "sm:justify-start sm:pl-12 sm:order-2"}`}>
                <span className="font-serif text-3xl sm:text-4xl italic font-medium tracking-wider" style={{ color: accentColor }}>{event.time}</span>
              </div>
              <div className={`pl-14 sm:pl-0 mt-3 sm:mt-0 sm:w-1/2 flex flex-col ${isEven ? "sm:items-start sm:pl-12 sm:order-2" : "sm:items-end sm:pr-12 sm:text-right"}`}>
                <h3 className="font-serif text-2xl sm:text-3xl mb-3 text-inherit">{event.title}</h3>
                {event.description && <p className="font-sans text-sm opacity-75 leading-relaxed max-w-[320px] text-inherit">{event.description}</p>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </div>
);

export default function TimelineSection({ schedule, theme, accentColor }: { schedule?: ScheduleEvent[]; theme: WeddingTheme; accentColor: string; }) {
  if (!schedule || schedule.length === 0) return null;
  const variant = theme.styleVariant;

  let Content;
  switch (variant) {
    case "cinematic":
      Content = <TimelineCinematic schedule={schedule} accentColor={accentColor} />;
      break;
    case "rustic":
    case "vintage":
      Content = <TimelineRustic schedule={schedule} accentColor={accentColor} />;
      break;
    case "glass":
      Content = <TimelineGlass schedule={schedule} accentColor={accentColor} />;
      break;
    default:
      Content = <TimelineDefault schedule={schedule} accentColor={accentColor} />;
      break;
  }

  return (
    <section className="py-24 px-4 relative z-10 w-full flex justify-center text-inherit border-y border-dashed" style={{ borderColor: `${accentColor}40` }}>
      {Content}
    </section>
  );
}

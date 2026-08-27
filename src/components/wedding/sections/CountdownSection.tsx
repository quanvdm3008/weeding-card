import { motion } from "framer-motion";
import { CalendarHeart, Heart } from "lucide-react";
import type { WeddingTheme } from "@/data/themes";
import { useCountdown } from "@/hooks/useCountdown";
import ringsImg from "@/assets/rings.jpg";

interface CountdownItem {
  value: number;
  label: string;
  max: number;
}

interface CountdownProps {
  items: CountdownItem[];
  accentColor: string;
  theme: WeddingTheme;
}

const pad = (value: number) => String(Math.max(0, value)).padStart(2, "0");

const CountdownCards = ({ items, accentColor, theme }: CountdownProps) => (
  <div className="grid grid-cols-2 gap-3 @md:grid-cols-4 @md:gap-5">
    {items.map((item, index) => (
      <motion.div
        key={item.label}
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={`relative overflow-hidden ${theme.cardRadius} border border-white/50 bg-card/78 p-5 text-center shadow-xl backdrop-blur-xl`}
        style={{ boxShadow: `0 20px 48px -28px ${accentColor}70` }}
      >
        <div className="absolute inset-x-4 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}90, transparent)` }} />
        <span className="font-display text-5xl font-semibold leading-none @md:text-6xl" style={{ color: accentColor }}>
          {pad(item.value)}
        </span>
        <p className="mt-3 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {item.label}
        </p>
      </motion.div>
    ))}
  </div>
);

const CountdownCircles = ({ items, accentColor }: CountdownProps) => (
  <div className="grid grid-cols-2 gap-4 @md:grid-cols-4 @md:gap-6">
    {items.map((item, index) => (
      <motion.div
        key={item.label}
        initial={{ opacity: 0, scale: 0.86 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.09, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <div className="relative mx-auto h-24 w-24 @md:h-28 @md:w-28">
          <svg className="h-full w-full -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="43" fill="rgba(255,255,255,0.48)" stroke="currentColor" strokeWidth="1.2" className="text-border" />
            <motion.circle
              cx="50"
              cy="50"
              r="43"
              fill="none"
              stroke={accentColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={270}
              initial={{ strokeDashoffset: 270 }}
              whileInView={{ strokeDashoffset: 270 - (item.value / item.max) * 270 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: index * 0.12 }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <span className="font-display text-3xl font-semibold" style={{ color: accentColor }}>
              {pad(item.value)}
            </span>
          </div>
        </div>
        <p className="mt-3 font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {item.label}
        </p>
      </motion.div>
    ))}
  </div>
);

const CountdownFlip = ({ items, accentColor, theme }: CountdownProps) => (
  <div className="grid grid-cols-2 gap-3 @md:grid-cols-4 @md:gap-5">
    {items.map((item, index) => (
      <motion.div
        key={item.label}
        initial={{ opacity: 0, rotateX: -28, y: 18 }}
        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`overflow-hidden ${theme.cardRadius} border border-border/70 bg-card shadow-xl`}
      >
        <div className="relative py-5 @md:py-7">
          <div className="absolute inset-x-0 top-1/2 h-px bg-border/60" />
          <span className="relative z-10 font-display text-5xl font-bold @md:text-6xl" style={{ color: accentColor }}>
            {pad(item.value)}
          </span>
        </div>
        <div className="border-t border-border/50 py-2" style={{ backgroundColor: `${accentColor}12` }}>
          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {item.label}
          </p>
        </div>
      </motion.div>
    ))}
  </div>
);

const CountdownMinimalLine = ({ items, accentColor }: CountdownProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="flex flex-wrap items-center justify-center gap-4 text-center @md:gap-7"
  >
    {items.map((item, index) => (
      <div key={item.label} className="flex items-center gap-4 @md:gap-7">
        <div>
          <span className="font-display text-5xl font-light leading-none @md:text-7xl" style={{ color: accentColor }}>
            {pad(item.value)}
          </span>
          <p className="mt-2 font-body text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{item.label}</p>
        </div>
        {index < items.length - 1 && <span className="hidden text-4xl font-light text-muted-foreground/28 @md:block">:</span>}
      </div>
    ))}
  </motion.div>
);

const CountdownSection = ({ date, accentColor, sectionBg, theme }: { date: string; accentColor: string; sectionBg?: string; theme: WeddingTheme }) => {
  const countdown = useCountdown(date);
  const items: CountdownItem[] = [
    { value: countdown.days, label: "Day", max: 365 },
    { value: countdown.hours, label: "Hour", max: 24 },
    { value: countdown.minutes, label: "Minute", max: 60 },
    { value: countdown.seconds, label: "Second", max: 60 },
  ];

  const renderCountdown = () => {
    switch (theme.countdownStyle) {
      case "circles":
        return <CountdownCircles items={items} accentColor={accentColor} theme={theme} />;
      case "flip":
        return <CountdownFlip items={items} accentColor={accentColor} theme={theme} />;
      case "minimal-line":
        return <CountdownMinimalLine items={items} accentColor={accentColor} theme={theme} />;
      default:
        return <CountdownCards items={items} accentColor={accentColor} theme={theme} />;
    }
  };

  return (
    <section className="relative overflow-hidden px-4 py-24" style={{ backgroundColor: sectionBg }}>
      <img src={ringsImg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.09]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--background)/0.2),hsl(var(--background)/0.66))]" />
      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-9"
        >
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/64 px-4 py-2 backdrop-blur-xl">
            <CalendarHeart className="h-4 w-4" style={{ color: accentColor }} />
            <span className="font-body text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">Countdown</span>
          </div>
          <h2 className="font-display text-4xl font-semibold leading-tight text-foreground @md:text-5xl">
            Countdown to the big day
          </h2>
          <div className="mx-auto mt-6 flex items-center justify-center gap-4">
            <span className="h-px w-16" style={{ background: `linear-gradient(90deg, transparent, ${accentColor})` }} />
            <Heart className="h-4 w-4" fill={accentColor} style={{ color: accentColor }} />
            <span className="h-px w-16" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
          </div>
        </motion.div>
        {renderCountdown()}
      </div>
    </section>
  );
};

export default CountdownSection;

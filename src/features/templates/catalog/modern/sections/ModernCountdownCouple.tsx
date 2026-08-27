import React from "react";
import { motion } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";
import { modernTheme } from "../theme";

interface ModernCountdownProps {
  date: string;
  time: string;
  accentColor: string;
}

export const ModernCountdown: React.FC<ModernCountdownProps> = ({ date, time, accentColor }) => {
  const { days, hours, minutes, seconds } = useCountdown(date, time);
  const units = [
    { label: "Ngày", sub: "Days", value: days },
    { label: "Giờ", sub: "Hours", value: hours },
    { label: "Phút", sub: "Minutes", value: minutes },
    { label: "Giây", sub: "Seconds", value: seconds },
  ];

  return (
    <section
      className="py-24 md:py-32 px-6 overflow-hidden relative"
      style={{ backgroundColor: modernTheme.colors.text }}
    >
      {/* Art Deco corner decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 opacity-20" style={{ borderColor: accentColor }} />
      <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 opacity-20" style={{ borderColor: accentColor }} />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 opacity-20" style={{ borderColor: accentColor }} />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 opacity-20" style={{ borderColor: accentColor }} />

      <div className="max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs uppercase tracking-[0.5em] mb-4"
          style={{ color: accentColor, fontFamily: modernTheme.typography.sans }}
        >
          Counting Down To
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl font-light mb-16"
          style={{ color: "#ffffff", fontFamily: modernTheme.typography.display }}
        >
          {date.split("-").reverse().join(" · ")}
        </motion.p>

        <div className="grid grid-cols-4 gap-4 md:gap-8">
          {units.map(({ label, sub, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center"
            >
              <div
                className="py-6 px-2 border relative"
                style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.04)" }}
              >
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-px h-[2px] w-1/2"
                  style={{ backgroundColor: accentColor }}
                />
                <span
                  className="block text-4xl md:text-6xl font-light tabular-nums"
                  style={{ color: "#ffffff", fontFamily: modernTheme.typography.display }}
                >
                  {String(value).padStart(2, "0")}
                </span>
                <span className="block text-[10px] uppercase tracking-[0.3em] mt-3" style={{ color: accentColor }}>
                  {label}
                </span>
                <span className="block text-[9px] uppercase tracking-widest mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {sub}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface ModernCoupleProps {
  groomName: string;
  brideName: string;
  coverImageUrl?: string;
  accentColor: string;
}

export const ModernCouple: React.FC<ModernCoupleProps> = ({ groomName, brideName, coverImageUrl, accentColor }) => {
  return (
    <section className="py-24 md:py-40 px-6 overflow-hidden" style={{ backgroundColor: modernTheme.colors.surface }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="text-xs uppercase tracking-[0.5em] mb-4" style={{ color: accentColor }}>Meet the Couple</p>
          <h2
            className="text-5xl md:text-7xl font-bold tracking-tight"
            style={{ fontFamily: modernTheme.typography.display, color: modernTheme.colors.text }}
          >
            {groomName.split(" ")[0]} <span className="font-light">&amp;</span> {brideName.split(" ")[0]}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-stretch">
          {/* Groom */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={coverImageUrl || "https://images.unsplash.com/photo-1606216840246-78f5f4f3ed01?w=600"}
                alt={groomName}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
              />
            </div>
            <div
              className="absolute bottom-0 left-0 right-0 p-8"
              style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.8))" }}
            >
              <p className="text-[10px] uppercase tracking-[0.4em] mb-2" style={{ color: accentColor }}>
                Chú Rể · Groom
              </p>
              <p className="text-2xl font-light text-white" style={{ fontFamily: modernTheme.typography.display }}>
                {groomName}
              </p>
            </div>
          </motion.div>

          {/* Bride */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="group relative overflow-hidden md:mt-16"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={coverImageUrl || "https://images.unsplash.com/photo-1595432541891-a461100d3054?w=600"}
                alt={brideName}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
              />
            </div>
            <div
              className="absolute bottom-0 left-0 right-0 p-8"
              style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.8))" }}
            >
              <p className="text-[10px] uppercase tracking-[0.4em] mb-2" style={{ color: accentColor }}>
                Cô Dâu · Bride
              </p>
              <p className="text-2xl font-light text-white" style={{ fontFamily: modernTheme.typography.display }}>
                {brideName}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

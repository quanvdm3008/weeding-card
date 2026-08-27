import React from "react";
import { motion } from "framer-motion";
import { botanicalTheme } from "../theme";
import { botanicalAnimations } from "../animations";
import { safeFormatDate } from "@/lib/utils";

interface BotanicalEventProps {
  date: string;
  time: string;
  venue: string;
  address: string;
}

export const BotanicalEvent: React.FC<BotanicalEventProps> = ({
  date,
  time,
  venue,
  address
}) => {
  return (
    <section 
      className="py-24 md:py-32 px-6 md:px-12 relative"
      style={{ backgroundColor: botanicalTheme.colors.background, color: botanicalTheme.colors.text }}
    >
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div {...botanicalAnimations.floatUp} className="mb-16">
          <svg className="w-12 h-12 mx-auto mb-6 opacity-60" viewBox="0 0 24 24" fill="none" stroke={botanicalTheme.colors.accent} strokeWidth="1">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.5-2.14 1.5-1.4 0-2.08-.71-2.21-1.76H8.04c.14 1.74 1.31 2.76 2.87 3.14V19h2.34v-1.67c1.52-.29 2.85-1.19 2.85-2.82.01-2.16-1.81-2.93-3.79-3.37z" />
          </svg>
          <h2 
            className="text-4xl md:text-5xl font-light mb-4"
            style={{ fontFamily: botanicalTheme.typography.display }}
          >
            When & Where
          </h2>
          <div className="w-8 h-[1px] mx-auto" style={{ backgroundColor: botanicalTheme.colors.accentWarm }} />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8">
          <motion.div 
            {...botanicalAnimations.floatUp}
            className="p-8 md:p-12 rounded-t-[50%] border"
            style={{ borderColor: `${botanicalTheme.colors.accent}40`, backgroundColor: botanicalTheme.colors.surface }}
          >
            <h3 
              className="text-2xl md:text-3xl font-light mb-6"
              style={{ fontFamily: botanicalTheme.typography.display, color: botanicalTheme.colors.text }}
            >
              The Ceremony
            </h3>
            <p className="mb-2 text-sm md:text-base" style={{ fontFamily: botanicalTheme.typography.sans }}>
              {safeFormatDate(date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </p>
            <p className="mb-6 text-sm font-light tracking-widest text-neutral-500" style={{ fontFamily: botanicalTheme.typography.sans }}>
              {time}
            </p>
            <p className="font-medium text-sm md:text-base mb-2" style={{ fontFamily: botanicalTheme.typography.sans }}>
              {venue}
            </p>
            <p className="text-xs md:text-sm leading-relaxed" style={{ fontFamily: botanicalTheme.typography.sans, color: botanicalTheme.colors.textMuted }}>
              {address}
            </p>
          </motion.div>

          <motion.div 
            {...botanicalAnimations.floatUp}
            transition={{ delay: 0.2 }}
            className="p-8 md:p-12 rounded-b-[50%] border"
            style={{ borderColor: `${botanicalTheme.colors.accentWarm}40`, backgroundColor: botanicalTheme.colors.surface }}
          >
            <h3 
              className="text-2xl md:text-3xl font-light mb-6"
              style={{ fontFamily: botanicalTheme.typography.display, color: botanicalTheme.colors.text }}
            >
              The Reception
            </h3>
            <p className="mb-2 text-sm md:text-base" style={{ fontFamily: botanicalTheme.typography.sans }}>
              {safeFormatDate(date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </p>
            <p className="mb-6 text-sm font-light tracking-widest text-neutral-500" style={{ fontFamily: botanicalTheme.typography.sans }}>
              18:00
            </p>
            <p className="font-medium text-sm md:text-base mb-2" style={{ fontFamily: botanicalTheme.typography.sans }}>
              {venue}
            </p>
            <p className="text-xs md:text-sm leading-relaxed" style={{ fontFamily: botanicalTheme.typography.sans, color: botanicalTheme.colors.textMuted }}>
              {address}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

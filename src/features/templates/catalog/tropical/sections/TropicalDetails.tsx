import React from "react";
import { motion } from "framer-motion";
import { tropicalTheme } from "../theme";
import { tropicalAnimations } from "../animations";
import { safeFormatDate } from "@/lib/utils";

interface TropicalDetailsProps {
  date: string;
  time: string;
  venue: string;
  address: string;
}

export const TropicalDetails: React.FC<TropicalDetailsProps> = ({
  date,
  time,
  venue,
  address
}) => {
  return (
    <section 
      className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden"
      style={{ backgroundColor: tropicalTheme.colors.background, color: tropicalTheme.colors.text }}
    >
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={tropicalAnimations.staggerContainer}
          className="text-center mb-16"
        >
          <motion.p 
            variants={tropicalAnimations.slideUpFade}
            className="text-xs uppercase tracking-[0.3em] font-semibold mb-4"
            style={{ fontFamily: tropicalTheme.typography.sans, color: tropicalTheme.colors.accent }}
          >
            The Itinerary
          </motion.p>
          <motion.h2 
            variants={tropicalAnimations.slideUpFade}
            className="text-5xl md:text-6xl font-medium"
            style={{ fontFamily: tropicalTheme.typography.display }}
          >
            Destination details
          </motion.h2>
        </motion.div>

        {/* Boarding Pass Layout */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={tropicalAnimations.staggerContainer}
          className="flex flex-col md:flex-row bg-transparent overflow-visible rounded-3xl"
        >
          {/* Left / Main Stub */}
          <motion.div variants={tropicalAnimations.slideUpFade} className="flex-1 p-8 md:p-12 relative border-b md:border-b-0 md:border-r border-dashed border-black/20 bg-white rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none shadow-xl border border-black/5">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-10 pb-4 border-b border-black/10">
              <span className="font-bold text-xl uppercase tracking-widest" style={{ color: tropicalTheme.colors.accent }}>
                Event Pass
              </span>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: tropicalTheme.colors.accentSecondary }}>
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 4-4 4-2.5-.5L1 17l4 4 1.5-1.5-.5-2.5 4-4 4 6l1.2-.7c.4-.2.7-.6.6-1.1z" />
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-[10px] uppercase font-bold text-black/40 mb-1" style={{ fontFamily: tropicalTheme.typography.sans }}>Date</p>
                <p className="font-medium text-lg" style={{ fontFamily: tropicalTheme.typography.sans }}>{safeFormatDate(date, { month: "short", day: "numeric", year: "numeric" })}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-black/40 mb-1" style={{ fontFamily: tropicalTheme.typography.sans }}>Time</p>
                <p className="font-medium text-lg" style={{ fontFamily: tropicalTheme.typography.sans }}>{time}</p>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-[10px] uppercase font-bold text-black/40 mb-1" style={{ fontFamily: tropicalTheme.typography.sans }}>Venue</p>
              <p className="font-medium text-xl md:text-2xl" style={{ fontFamily: tropicalTheme.typography.display }}>{venue}</p>
              <p className="text-sm mt-1 text-black/60" style={{ fontFamily: tropicalTheme.typography.sans }}>{address}</p>
            </div>
            
            <div>
              <p className="text-[10px] uppercase font-bold text-black/40 mb-1" style={{ fontFamily: tropicalTheme.typography.sans }}>Dress Code</p>
              <p className="font-medium text-sm" style={{ fontFamily: tropicalTheme.typography.sans }}>Tropical / Smart Casual</p>
            </div>
          </motion.div>

          {/* Right / Tear-off Stub */}
          <motion.div variants={tropicalAnimations.slideUpFade} className="w-full md:w-64 p-8 md:p-12 flex flex-col justify-between bg-white rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none shadow-xl border border-black/5 md:border-l-0" style={{ backgroundColor: tropicalTheme.colors.background }}>
            <div>
              <p className="text-[10px] uppercase font-bold text-black/40 mb-1" style={{ fontFamily: tropicalTheme.typography.sans }}>Class</p>
              <p className="font-medium text-lg mb-6" style={{ fontFamily: tropicalTheme.typography.sans, color: tropicalTheme.colors.accent }}>VIP Guest</p>
              
              <p className="text-[10px] uppercase font-bold text-black/40 mb-1" style={{ fontFamily: tropicalTheme.typography.sans }}>Boarding</p>
              <p className="font-medium text-xl" style={{ fontFamily: tropicalTheme.typography.display }}>{time}</p>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
              <div className="w-full h-12 flex items-center justify-between gap-1 px-2">
                {[4, 2, 6, 1, 3, 5, 2, 4, 1, 6, 3, 2, 5, 1, 4, 2, 3].map((height, i) => (
                  <div 
                    key={i} 
                    className="bg-black flex-1" 
                    style={{ height: `${height * 6}px`, opacity: i % 2 === 0 ? 0.8 : 0.4 }} 
                  />
                ))}
              </div>
              <p className="mt-3 text-[9px] uppercase tracking-widest font-bold text-black/40 text-center" style={{ fontFamily: tropicalTheme.typography.sans }}>PASS NO. 2026-LOVE</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

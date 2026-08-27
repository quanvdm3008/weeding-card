import React from "react";
import { motion } from "framer-motion";
import { tropicalTheme } from "../theme";
import { tropicalAnimations } from "../animations";
import { safeFormatDate } from "@/lib/utils";
import { MapPin, Palmtree } from "lucide-react";
import heroImg from "@/assets/hero-wedding.jpg";

interface TropicalHeroProps {
  groomName: string;
  brideName: string;
  date: string;
  coverImageUrl?: string;
  message?: string;
}

export const TropicalHero: React.FC<TropicalHeroProps> = ({
  groomName,
  brideName,
  date,
  coverImageUrl,
  message
}) => {
  return (
    <section 
      className="min-h-screen relative flex flex-col justify-center items-center py-24 px-6 md:px-12 overflow-hidden"
      style={{ backgroundColor: tropicalTheme.colors.background, color: tropicalTheme.colors.text }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <svg viewBox="0 0 100 100" className="absolute -top-20 -left-20 w-[60vmin] h-[60vmin]" fill={tropicalTheme.colors.accentSecondary}>
          <path d="M49.5,0C76.8,0,99,22.2,99,49.5S76.8,99,49.5,99S0,76.8,0,49.5S22.2,0,49.5,0z" opacity="0.3" />
        </svg>
        <svg viewBox="0 0 100 100" className="absolute -bottom-20 -right-20 w-[70vmin] h-[70vmin]" fill={tropicalTheme.colors.text}>
          <path d="M49.5,0C76.8,0,99,22.2,99,49.5S76.8,99,49.5,99S0,76.8,0,49.5S22.2,0,49.5,0z" opacity="0.05" />
        </svg>
      </div>

      <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-12 lg:gap-24 items-center z-10">
        <motion.div 
          className="order-2 lg:order-1 flex flex-col"
          variants={tropicalAnimations.staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={tropicalAnimations.slideUpFade}>
            <p 
              className="text-xs uppercase tracking-[0.3em] font-semibold mb-6"
              style={{ fontFamily: tropicalTheme.typography.sans, color: tropicalTheme.colors.accent }}
            >
              Come away with us
            </p>
            <h1 
              className="text-6xl sm:text-7xl lg:text-8xl font-medium leading-[0.9]"
              style={{ fontFamily: tropicalTheme.typography.display }}
            >
              {groomName} <br />
              <span className="italic text-4xl sm:text-5xl my-2 block" style={{ color: tropicalTheme.colors.accentSecondary }}>&</span>
              {brideName}
            </h1>
          </motion.div>

          <motion.div variants={tropicalAnimations.slideUpFade} className="mt-12">
            <p 
              className="text-lg leading-relaxed max-w-md"
              style={{ fontFamily: tropicalTheme.typography.sans, color: tropicalTheme.colors.textMuted }}
            >
              {message || "We are escaping to paradise and want you there."}
            </p>
            
            <div className="mt-12 pt-8 border-t border-black/10">
              <p 
                className="text-sm font-semibold uppercase tracking-[0.2em]"
                style={{ fontFamily: tropicalTheme.typography.sans, color: tropicalTheme.colors.text }}
              >
                {safeFormatDate(date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </motion.div>
        </motion.div>

        <div className="order-1 lg:order-2 flex justify-center relative">
          <motion.div 
            {...tropicalAnimations.archReveal}
            className="relative w-full max-w-[400px] aspect-[2/3] overflow-hidden rounded-t-full shadow-2xl"
            style={{ backgroundColor: tropicalTheme.colors.border }}
          >
            <img 
              src={coverImageUrl || heroImg} 
              alt="Couple" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </motion.div>
          
          <motion.div 
            {...tropicalAnimations.floatSlow}
            className="absolute -bottom-8 -left-8 bg-white p-6 shadow-xl rounded-xl hidden sm:block"
            style={{ color: tropicalTheme.colors.accent }}
          >
            <Palmtree className="h-10 w-10" strokeWidth={1.4} />
            <p className="mt-2 text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: tropicalTheme.typography.sans }}>
              Island vows
            </p>
          </motion.div>
          <div className="absolute -right-3 top-10 hidden items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[.18em] shadow-sm backdrop-blur @sm:flex" style={{ color: tropicalTheme.colors.accent }}><MapPin className="h-3.5 w-3.5" />Tropical escape</div>
        </div>
      </div>
    </section>
  );
};

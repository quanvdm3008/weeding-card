import React from "react";
import { motion } from "framer-motion";
import { botanicalTheme } from "../theme";
import { botanicalAnimations } from "../animations";
import { BotanicalFrame } from "../components/BotanicalFrame";
import { safeFormatDate } from "@/lib/utils";
import heroImg from "@/assets/hero-wedding.jpg";

interface BotanicalHeroProps {
  groomName: string;
  brideName: string;
  date: string;
  coverImageUrl?: string;
  message?: string;
}

export const BotanicalHero: React.FC<BotanicalHeroProps> = ({
  groomName,
  brideName,
  date,
  coverImageUrl,
  message
}) => {
  return (
    <section 
      className="min-h-screen relative flex flex-col items-center justify-center pt-24 pb-12 px-6 md:px-12 overflow-hidden"
      style={{ backgroundColor: botanicalTheme.colors.background, color: botanicalTheme.colors.text }}
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center z-10">
        <motion.div {...botanicalAnimations.floatUp}>
          <p 
            className="tracking-[0.3em] uppercase text-xs md:text-sm mb-6"
            style={{ fontFamily: botanicalTheme.typography.sans, color: botanicalTheme.colors.textMuted }}
          >
            We joyfully invite you to the wedding of
          </p>
        </motion.div>

        <motion.h1 
          {...botanicalAnimations.floatUp}
          transition={{ delay: 0.2 }}
          className="text-6xl md:text-8xl lg:text-[7rem] font-light leading-none mb-12"
          style={{ fontFamily: botanicalTheme.typography.display }}
        >
          {groomName}
          <span 
            className="block text-4xl md:text-6xl italic my-4"
            style={{ color: botanicalTheme.colors.accentWarm }}
          >
            &
          </span>
          {brideName}
        </motion.h1>

        <motion.div 
          {...botanicalAnimations.fadeSlow}
          className="w-full max-w-lg md:max-w-2xl h-[40vh] md:h-[50vh] my-8"
        >
          <BotanicalFrame className="w-full h-full">
            <motion.img 
              variants={botanicalAnimations.sway}
              animate="animate"
              src={coverImageUrl || heroImg} 
              alt="Couple" 
              className="w-full h-full object-cover origin-center scale-110"
            />
          </BotanicalFrame>
        </motion.div>

        <motion.div 
          {...botanicalAnimations.floatUp}
          transition={{ delay: 0.4 }}
          className="mt-8 max-w-md"
        >
          <p 
            className="text-lg md:text-xl italic mb-6 text-center"
            style={{ fontFamily: botanicalTheme.typography.display, color: botanicalTheme.colors.text }}
          >
            {message || "Two lives, one beautiful beginning."}
          </p>
          <div className="w-16 h-[1px] mx-auto mb-6" style={{ backgroundColor: botanicalTheme.colors.accent }} />
          <p 
            className="tracking-[0.2em] uppercase text-sm" 
            style={{ fontFamily: botanicalTheme.typography.sans }}
          >
            {safeFormatDate(date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
        </motion.div>
      </div>

      {/* Decorative leaf SVGs positioned absolutely */}
      <motion.svg 
        className="absolute top-0 left-0 w-64 h-64 opacity-20 pointer-events-none"
        viewBox="0 0 100 100"
        initial={{ opacity: 0, rotate: -20, x: -50 }}
        animate={{ opacity: 0.2, rotate: 0, x: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <path d="M 0,0 C 50,0 100,50 100,100 C 50,100 0,50 0,0 Z" fill={botanicalTheme.colors.accent} />
      </motion.svg>
      <motion.svg 
        className="absolute bottom-0 right-0 w-80 h-80 opacity-20 pointer-events-none"
        viewBox="0 0 100 100"
        initial={{ opacity: 0, rotate: 20, x: 50 }}
        animate={{ opacity: 0.2, rotate: 0, x: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <path d="M 100,100 C 50,100 0,50 0,0 C 50,0 100,50 100,100 Z" fill={botanicalTheme.colors.accentWarm} />
      </motion.svg>
    </section>
  );
};

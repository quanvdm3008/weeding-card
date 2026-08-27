import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SparklingImage } from "@/components/wedding/SparklingImage";
import { modernTheme } from "../theme";

interface ModernHeroProps {
  groomName: string;
  brideName: string;
  date: string;
  message?: string;
  coverImageUrl?: string;
  accentColor: string;
}

export const ModernHero: React.FC<ModernHeroProps> = ({
  groomName,
  brideName,
  date,
  message,
  coverImageUrl = "/hero.jpg",
  accentColor,
}) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 lg:p-12" style={{ backgroundColor: modernTheme.colors.background }}>
      {/* Editorial Border Frame */}
      <div 
        className="relative w-full max-w-5xl h-[90vh] md:h-[85vh] mx-auto flex flex-col justify-end overflow-hidden shadow-2xl"
        style={{ backgroundColor: modernTheme.colors.surface }}
      >
        {/* Magazine Cover Image */}
        <motion.div style={{ y }} className="absolute inset-0 w-full h-[110%] -top-[5%]">
          <SparklingImage
            src={coverImageUrl}
            fallbackSrc="/hero.jpg"
            accentColor={accentColor}
            alt={`Ảnh cưới của ${groomName} và ${brideName}`}
            tilt3d={false}
            touchSparkles={false}
            className="h-full w-full object-cover grayscale-[.16] contrast-125"
          />
        </motion.div>

        {/* Crisp Gradient Overlay to white */}
        <div 
          className="absolute inset-0 z-10" 
          style={{ 
            background: `linear-gradient(180deg, 
              transparent 0%, 
              rgba(255,255,255,0.4) 40%, 
              ${modernTheme.colors.surface} 95%)` 
          }} 
        />

        {/* Micro-typography corners */}
        <div className="absolute top-6 left-6 z-20 text-[10px] tracking-[0.2em] font-bold uppercase hidden md:block" style={{ color: modernTheme.colors.text }}>
          Vol. I — The Wedding
        </div>
        <div className="absolute top-6 right-6 z-20 text-[10px] tracking-[0.2em] font-bold uppercase hidden md:block" style={{ color: modernTheme.colors.text }}>
          {new Date(date).getFullYear()} Edition
        </div>

        {/* Content */}
        <motion.div 
          style={{ opacity }}
          className="relative z-20 flex flex-col items-center justify-end h-full pb-16 px-4 md:px-12 text-center w-full"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <p 
              className="text-[9px] md:text-xs font-bold uppercase tracking-[0.5em] mb-4"
              style={{ color: modernTheme.colors.textMuted, fontFamily: modernTheme.typography.sans }}
            >
              Exclusive Feature
            </p>

            <h1 
              className="text-[4rem] sm:text-7xl md:text-8xl lg:text-[160px] font-black uppercase leading-[0.8] tracking-tighter mb-6"
              style={{ fontFamily: modernTheme.typography.display, color: modernTheme.colors.text }}
            >
              {groomName}
              <span 
                className="block font-light text-2xl md:text-4xl lg:text-5xl py-2 md:py-4 tracking-normal normal-case italic"
                style={{ fontFamily: modernTheme.typography.serif, color: accentColor }}
              >
                and
              </span>
              {brideName}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center justify-between mt-12 pt-8 border-t" style={{ borderColor: modernTheme.colors.border }}>
              <div className="text-left hidden md:block">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: modernTheme.colors.textMuted }}>Date</p>
                <p className="text-sm font-medium mt-1" style={{ color: modernTheme.colors.text }}>{new Date(date).toLocaleDateString('vi-VN', { month: 'short', day: '2-digit', year: 'numeric' })}</p>
              </div>
              
              <div className="text-center col-span-1 md:col-span-1">
                <p className="text-xs md:text-sm max-w-xs mx-auto leading-relaxed font-medium" style={{ color: modernTheme.colors.text }}>
                  {message}
                </p>
              </div>

              <div className="text-right hidden md:block">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: modernTheme.colors.textMuted }}>Location</p>
                <p className="text-sm font-medium mt-1" style={{ color: modernTheme.colors.text }}>Join us in celebration</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

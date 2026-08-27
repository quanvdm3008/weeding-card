import React from "react";
import { motion } from "framer-motion";
import { editorialTheme } from "../theme";
import { editorialAnimations } from "../animations";
import { safeFormatDate } from "@/lib/utils";

interface EditorialHeroProps {
  groomName: string;
  brideName: string;
  date: string;
  coverImageUrl?: string;
  message?: string;
}

export const EditorialHero: React.FC<EditorialHeroProps> = ({
  groomName,
  brideName,
  date,
  coverImageUrl,
  message
}) => {
  return (
    <section 
      className="min-h-screen relative flex flex-col justify-between pt-24 pb-12 px-6 md:px-12 overflow-hidden"
      style={{ backgroundColor: editorialTheme.colors.background, color: editorialTheme.colors.text }}
    >
      <header className="flex justify-between items-center w-full uppercase tracking-widest text-[10px] md:text-xs font-bold border-b pb-4 mb-8" style={{ fontFamily: editorialTheme.typography.sans, borderColor: editorialTheme.colors.border }}>
        <span>Volume I</span>
        <span>The Wedding Issue</span>
        <span>{date ? safeFormatDate(date, { year: "numeric" }) : "2026"}</span>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 h-full">
        {/* Left column - Typography */}
        <div className="lg:col-span-6 flex flex-col justify-center h-full relative z-10 pr-4">
          <motion.div {...editorialAnimations.revealUp}>
            <p className="tracking-[0.4em] uppercase text-xs font-bold mb-4" style={{ fontFamily: editorialTheme.typography.sans, color: editorialTheme.colors.textMuted }}>
              Exclusive
            </p>
            <h1 
              className="text-6xl md:text-8xl lg:text-[7.5rem] font-black uppercase leading-[0.85] tracking-tighter"
              style={{ fontFamily: editorialTheme.typography.display }}
            >
              <span className="block">{groomName.split(" ")[0]}</span>
              <span className="block text-4xl md:text-6xl italic font-normal my-2 lowercase text-neutral-500" style={{ color: editorialTheme.colors.accent }}>&amp;</span>
              <span className="block">{brideName.split(" ")[0]}</span>
            </h1>
          </motion.div>

          <motion.div 
            {...editorialAnimations.revealUp} 
            transition={{ delay: 0.2 }}
            className="mt-12 md:mt-24 max-w-sm"
          >
            <p 
              className="text-sm md:text-base leading-relaxed text-justify"
              style={{ fontFamily: editorialTheme.typography.sans }}
            >
              {message || "We invite you to celebrate our new beginning."}
            </p>
            <div className="w-full h-[1px] mt-8" style={{ backgroundColor: editorialTheme.colors.border }} />
            <p className="mt-4 tracking-[0.2em] uppercase text-xs font-bold" style={{ fontFamily: editorialTheme.typography.sans, color: editorialTheme.colors.textMuted }}>
              {safeFormatDate(date, { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </motion.div>
        </div>

        {/* Right column - Photography */}
        <div className="lg:col-span-6 h-[60vh] lg:h-auto relative mt-8 lg:mt-0">
          <motion.div 
            {...editorialAnimations.revealSlow}
            className="w-full h-full relative"
          >
            {coverImageUrl ? (
              <div className="w-full h-full p-2 border shadow-xl transform rotate-1 md:rotate-2" style={{ borderColor: editorialTheme.colors.border, backgroundColor: editorialTheme.colors.surface }}>
                <img 
                  src={coverImageUrl} 
                  alt="Couple" 
                  className="w-full h-full object-cover filter sepia-[0.2] hover:sepia-0 transition-all duration-1000"
                />
              </div>
            ) : (
              <div className="w-full h-full animate-pulse flex items-center justify-center" style={{ backgroundColor: editorialTheme.colors.border }}>
                <span className="tracking-widest uppercase text-xs" style={{ color: editorialTheme.colors.textMuted }}>Image Reserved</span>
              </div>
            )}
            
            {/* Editorial block overlay */}
            <div className="absolute -bottom-6 -left-6 md:-left-12 p-6 w-48 md:w-64 hidden sm:block" style={{ backgroundColor: editorialTheme.colors.text, color: editorialTheme.colors.surface }}>
              <p className="tracking-widest uppercase text-[10px] md:text-xs leading-loose" style={{ fontFamily: editorialTheme.typography.sans }}>
                A story of two people finding their way to each other.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

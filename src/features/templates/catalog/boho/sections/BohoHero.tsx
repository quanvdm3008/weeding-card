import React from "react";
import { motion } from "framer-motion";
import { bohoTheme } from "../theme";

interface BohoHeroProps {
  groomName: string;
  brideName: string;
  date?: string;
  message?: string;
  coverImageUrl?: string;
}

export const BohoHero: React.FC<BohoHeroProps> = ({
  groomName,
  brideName,
  date,
  message,
  coverImageUrl,
}) => {
  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden px-4 py-20">
      <div className="absolute inset-0 z-0">
        {/* Warm radial gradient background */}
        <div 
          className="absolute inset-0 opacity-40" 
          style={{ 
            background: `radial-gradient(circle at center, transparent 0%, ${bohoTheme.colors.background} 100%)` 
          }} 
        />
        {/* Subtle watercolor/floral textures in background */}
        <svg className="absolute top-10 left-10 w-48 h-48 opacity-10" viewBox="0 0 100 100" fill={bohoTheme.colors.accent}>
          <path d="M50 0C50 0 10 30 10 60C10 80 30 100 50 100C70 100 90 80 90 60C90 30 50 0 50 0Z" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center pt-10">
        
        {/* Names at the top (like the first image in the reference) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center mb-10 z-20"
        >
          <p 
            className="text-xs md:text-sm tracking-[0.4em] uppercase mb-4 font-medium opacity-80"
            style={{ color: bohoTheme.colors.textMuted }}
          >
            The Wedding Of
          </p>
          <h1 
            className="text-5xl md:text-7xl lg:text-8xl"
            style={{ fontFamily: bohoTheme.typography.display, color: bohoTheme.colors.text }}
          >
            {groomName} <span style={{ fontFamily: bohoTheme.typography.script, color: bohoTheme.colors.accentSecondary, fontSize: "1.2em", margin: "0 -0.1em" }}>&</span> {brideName}
          </h1>
        </motion.div>

        {/* Taped Polaroid Layout */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotate: -3 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
          className="relative w-full max-w-sm md:max-w-md mb-12"
        >
          {/* Masking Tape */}
          <div 
            className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 z-30 opacity-90 backdrop-blur-sm"
            style={{ 
              backgroundColor: "rgba(240, 235, 225, 0.85)",
              transform: "rotate(-3deg)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.03)",
              clipPath: "polygon(2% 0%, 98% 2%, 100% 95%, 0% 100%)" // Rough edge effect
            }}
          />

          {/* Polaroid Frame */}
          <div 
            className="relative w-full aspect-[3/4] p-3 md:p-4 pb-12 md:pb-16 shadow-2xl bg-white"
            style={{ 
              border: `1px solid ${bohoTheme.colors.border}`,
              transformStyle: "preserve-3d"
            }}
          >
            <div className="w-full h-full relative overflow-hidden bg-black/5" style={{ borderRadius: "2px" }}>
              {coverImageUrl ? (
                <img 
                  src={coverImageUrl} 
                  alt="Couple" 
                  className="w-full h-full object-cover filter sepia-[0.15] contrast-95"
                />
              ) : (
                <div className="w-full h-full bg-[#E8D5C4]/20" />
              )}
            </div>
            
            {/* Wax Seal at the bottom right */}
            <motion.div 
              className="absolute -bottom-6 -right-6 w-20 h-20 z-30 drop-shadow-lg"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 1.2, stiffness: 200 }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-md">
                {/* Uneven organic wax edge */}
                <path 
                  d="M50 5 C75 2, 95 20, 97 45 C99 70, 80 95, 55 97 C30 99, 5 80, 3 55 C1 30, 25 8, 50 5 Z" 
                  fill="#A23B2A" // Classic deep red/gold wax
                />
                <path 
                  d="M50 12 C68 10, 85 24, 87 45 C89 65, 74 85, 54 87 C34 89, 14 74, 12 54 C10 34, 32 14, 50 12 Z" 
                  fill="#8B2F20"
                />
                {/* Stamped heart or V (initials could go here, but a heart is universal) */}
                <path 
                  d="M50 65 C50 65, 30 45, 30 35 C30 25, 45 25, 50 35 C55 25, 70 25, 70 35 C70 45, 50 65, 50 65 Z" 
                  fill="#D4AF37" 
                  className="opacity-70"
                />
              </svg>
            </motion.div>

            {/* Dried Floral Element overlaying the frame */}
            <motion.div 
              className="absolute -bottom-12 -left-12 w-48 h-64 z-20 opacity-90 pointer-events-none"
              initial={{ opacity: 0, x: -20, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1.5, delay: 0.8 }}
              style={{ filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.15))" }}
            >
              {/* Bohemian dried flower vector (simplified pampas/wheat) */}
              <svg viewBox="0 0 200 300" className="w-full h-full">
                <path d="M100 300 Q110 200, 150 100" fill="none" stroke="#9C7B52" strokeWidth="3" strokeLinecap="round" />
                <path d="M100 300 Q90 180, 50 80" fill="none" stroke="#8A6E4B" strokeWidth="2" strokeLinecap="round" />
                {/* Leaflets */}
                <path d="M140 120 Q160 100, 170 130 Q150 140, 140 120" fill="#B59A70" opacity="0.8" />
                <path d="M130 150 Q150 140, 155 170 Q135 170, 130 150" fill="#A48657" opacity="0.9" />
                <path d="M120 190 Q140 180, 140 210 Q120 200, 120 190" fill="#B59A70" opacity="0.7" />
                
                <path d="M60 100 Q40 80, 30 110 Q50 120, 60 100" fill="#9C7B52" opacity="0.8" />
                <path d="M70 140 Q50 130, 45 160 Q65 160, 70 140" fill="#8A6E4B" opacity="0.9" />
                <path d="M80 180 Q60 170, 60 200 Q80 190, 80 180" fill="#9C7B52" opacity="0.7" />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* Date and message below */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center z-20 mt-4"
        >
          {date && (
            <div className="inline-block px-6 py-2 border border-[#C67B5C]/30 bg-white/50 backdrop-blur-sm rounded-full mb-6">
              <p 
                className="text-sm md:text-base tracking-[0.2em] font-medium"
                style={{ color: bohoTheme.colors.accent }}
              >
                {new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          )}
          {message && (
            <p className="max-w-lg mx-auto text-center italic opacity-80" style={{ color: bohoTheme.colors.textMuted }}>
              "{message}"
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

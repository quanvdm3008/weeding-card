import React from "react";
import { botanicalTheme } from "../theme";

export const BotanicalFrame: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  return (
    <div className={`relative ${className} p-4 md:p-6`}>
      {/* Decorative SVG Frame */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <path 
          d="M 5,20 Q 20,5 50,5 T 95,20 Q 95,50 95,80 Q 80,95 50,95 T 5,80 Z" 
          fill="none" 
          stroke={botanicalTheme.colors.accent} 
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
        <path 
          d="M 10,25 Q 25,10 50,10 T 90,25 Q 90,50 90,75 Q 75,90 50,90 T 10,75 Z" 
          fill="none" 
          stroke={botanicalTheme.colors.accentWarm} 
          strokeWidth="0.25"
          vectorEffect="non-scaling-stroke"
          strokeDasharray="1 1"
        />
      </svg>
      {/* Image Container with organic mask */}
      <div 
        className="w-full h-full overflow-hidden"
        style={{
          borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%", // Organic blob shape
        }}
      >
        {children}
      </div>
    </div>
  );
};

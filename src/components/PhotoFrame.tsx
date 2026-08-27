import React from "react";
import type { WeddingTheme } from "@/data/themes";

export interface PhotoFrameProps {
  variant?: WeddingTheme["styleVariant"] | "brass_corners" | "gold_edge" | "frosted_glass" | "classic";
  accentColor: string;
  rotate?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * Enhanced Photo Chrome Frame supporting Brass Corners 24K, Gold Edge, & Frosted Glass.
 */
export const PhotoFrame: React.FC<PhotoFrameProps> = ({
  variant,
  accentColor,
  rotate = 0,
  className = "",
  children,
}) => {
  if (variant === "brass_corners") {
    return (
      <div className={`relative p-2.5 bg-neutral-900 border border-amber-500/40 shadow-2xl ${className}`}>
        {/* Decorative 24K Brass Corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-400 z-20" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-400 z-20" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-400 z-20" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-400 z-20" />
        <div className="overflow-hidden relative z-10">{children}</div>
      </div>
    );
  }

  if (variant === "gold_edge") {
    return (
      <div className={`relative p-1 bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 rounded-xl shadow-xl ${className}`}>
        <div className="overflow-hidden rounded-lg bg-black">{children}</div>
      </div>
    );
  }

  if (variant === "frosted_glass") {
    return (
      <div className={`relative p-2 rounded-3xl border border-white/50 bg-white/20 backdrop-blur-xl shadow-2xl ${className}`}>
        <div className="overflow-hidden rounded-2xl">{children}</div>
      </div>
    );
  }

  switch (variant) {
    case "cinematic":
      return (
        <div className={`relative ${className}`}>
          <div className="absolute -inset-1.5 pointer-events-none" style={{ border: `1px solid ${accentColor}50` }} />
          <div className="relative overflow-hidden">{children}</div>
        </div>
      );

    case "magazine":
      return (
        <div className={`relative ${className}`} style={{ boxShadow: `7px 7px 0 ${accentColor}35` }}>
          <div className="overflow-hidden">{children}</div>
        </div>
      );

    case "fluid":
      return (
        <div className={`relative ${className}`}>
          <div className="overflow-hidden" style={{ borderRadius: "42% 58% 65% 35% / 48% 40% 60% 52%" }}>
            {children}
          </div>
        </div>
      );

    case "glass":
      return (
        <div className={`relative p-1.5 rounded-3xl border border-white/40 bg-white/15 backdrop-blur-md shadow-lg ${className}`}>
          <div className="overflow-hidden rounded-2xl">{children}</div>
        </div>
      );

    case "map":
      return (
        <div className={`relative ${className}`}>
          <div className="overflow-hidden border-2 border-dashed" style={{ borderColor: `${accentColor}70` }}>
            {children}
          </div>
          <div className="absolute -top-2 -left-2 w-5 h-5 rounded-full ring-2 ring-background" style={{ backgroundColor: accentColor }} />
        </div>
      );

    case "gallery":
      return (
        <div className={`relative bg-white p-2.5 pb-6 shadow-xl ${className}`} style={{ transform: `rotate(${rotate}deg)` }}>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-9 h-3.5 rotate-3 opacity-70 rounded-sm" style={{ backgroundColor: `${accentColor}90` }} />
          <div className="overflow-hidden">{children}</div>
        </div>
      );

    case "letter":
      return (
        <div className={`relative bg-white p-2 ${className}`} style={{ transform: `rotate(${rotate}deg)`, boxShadow: `0 10px 26px -10px ${accentColor}55` }}>
          <div className="overflow-hidden">{children}</div>
        </div>
      );

    case "vintage":
      return (
        <div className={`relative p-1.5 ${className}`} style={{ backgroundColor: "#F5E6CC", boxShadow: "0 10px 24px -10px rgba(80,60,20,0.5)" }}>
          <div className="absolute top-0 left-0 w-3 h-3" style={{ background: "linear-gradient(135deg, #8B6914 50%, transparent 50%)" }} />
          <div className="absolute bottom-0 right-0 w-3 h-3" style={{ background: "linear-gradient(-45deg, #8B6914 50%, transparent 50%)" }} />
          <div className="overflow-hidden" style={{ filter: "sepia(0.45) contrast(1.05)" }}>{children}</div>
        </div>
      );

    case "rustic":
      return (
        <div className={`relative p-1 ${className}`} style={{ transform: `rotate(${rotate}deg)`, border: `3px solid ${accentColor}60`, backgroundColor: "#F0E6D6" }}>
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rotate-45 border-t-2" style={{ borderColor: `${accentColor}90` }} />
          <div className="overflow-hidden">{children}</div>
        </div>
      );

    default:
      return <div className={`overflow-hidden ${className}`}>{children}</div>;
  }
};

export default PhotoFrame;

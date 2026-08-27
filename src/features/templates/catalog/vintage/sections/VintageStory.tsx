import React from "react";
import { motion } from "framer-motion";
import { Calendar, Heart, Sparkles } from "lucide-react";
import type { StoryMilestone } from "@/data/seedData";

interface VintageStoryProps {
  stories: StoryMilestone[];
  onImageClick?: (index: number) => void;
}

export const VintageStory: React.FC<VintageStoryProps> = ({ stories, onImageClick }) => {
  if (!stories || stories.length === 0) return null;

  return (
    <section id="story" className="py-28 px-4 max-w-5xl mx-auto relative z-10">
      <div className="text-center mb-20 space-y-2">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#9A7B56] font-semibold">
          NOTRE HISTOIRE D'AMOUR
        </span>
        <h2 className="text-3xl sm:text-5xl font-normal tracking-[0.1em] text-[#2C2523] uppercase">
          CHUYỆN TÌNH YÊU
        </h2>
        <div className="flex items-center justify-center gap-4 py-4">
          <div className="h-[1px] w-16 sm:w-24 bg-gradient-to-r from-transparent via-[#C5A880] to-transparent" />
          <div className="w-2 h-2 rotate-45 border border-[#C5A880] bg-[#FAF7F2]" />
          <div className="h-[1px] w-16 sm:w-24 bg-gradient-to-r from-transparent via-[#C5A880] to-transparent" />
        </div>
      </div>

      <div className="space-y-20 sm:space-y-28 relative">
        {/* Subtle Central Gold Line for desktop */}
        <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-[1px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[#C5A880]/50 to-transparent" />

        {stories.map((story, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Photo Frame */}
              <div className="w-full md:w-1/2 flex justify-center">
                <div
                  onClick={() => onImageClick?.(idx)}
                  className="cursor-pointer group relative w-full max-w-[280px] sm:max-w-[320px] aspect-[4/5] p-3 bg-[#FDFBF7] rounded-3xl border border-[#C5A880]/50 shadow-[0_15px_35px_rgba(154,123,86,0.12)] transition-all duration-500 hover:scale-105 hover:shadow-[0_20px_45px_rgba(154,123,86,0.2)]"
                >
                  <div className="w-full h-full rounded-2xl overflow-hidden relative bg-[#EFE8DE]">
                    <img
                      src={story.img}
                      alt={story.title}
                      className="w-full h-full object-cover filter sepia-[0.25] contrast-[1.05] brightness-95 group-hover:scale-105 group-hover:filter-none transition-all duration-700"
                    />
                  </div>
                </div>
              </div>

              {/* Story Text Card */}
              <div
                className={`w-full md:w-1/2 text-center ${
                  isEven ? "md:text-left" : "md:text-right"
                }`}
              >
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F3EDE2] border border-[#C5A880]/40 text-[10px] font-mono uppercase font-bold tracking-widest text-[#9A7B56] mb-3">
                  <Calendar className="w-3 h-3" />
                  {story.date}
                </span>

                <h3 className="text-2xl sm:text-3xl font-normal uppercase tracking-wider text-[#2C2523] mb-4">
                  {story.title}
                </h3>

                <p className="text-xs sm:text-sm font-serif leading-relaxed text-[#6B5D55] max-w-md mx-auto md:mx-0">
                  {story.text}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

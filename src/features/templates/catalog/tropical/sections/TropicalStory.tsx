import React from "react";
import { motion } from "framer-motion";
import { tropicalTheme } from "../theme";
import { tropicalAnimations } from "../animations";
import type { StoryMilestone } from "@/data/seedData";

interface TropicalStoryProps {
  stories?: StoryMilestone[];
}

export const TropicalStory: React.FC<TropicalStoryProps> = ({ stories }) => {
  if (!stories || stories.length === 0) return null;

  return (
    <section 
      className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden"
      style={{ backgroundColor: tropicalTheme.colors.surface, color: tropicalTheme.colors.text }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={tropicalAnimations.staggerContainer}
          className="text-center mb-24"
        >
          <motion.p 
            variants={tropicalAnimations.slideUpFade}
            className="text-xs uppercase tracking-[0.3em] font-semibold mb-4"
            style={{ fontFamily: tropicalTheme.typography.sans, color: tropicalTheme.colors.accentSecondary }}
          >
            The Journey
          </motion.p>
          <motion.h2 
            variants={tropicalAnimations.slideUpFade}
            className="text-5xl md:text-6xl font-medium"
            style={{ fontFamily: tropicalTheme.typography.display }}
          >
            Our Story
          </motion.h2>
        </motion.div>

        <div className="relative">
          {/* Dashed line connecting story pieces */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 border-l-2 border-dashed border-black/10 hidden md:block" />

          <div className="space-y-16 md:space-y-32">
            {stories.map((story, idx) => (
              <motion.div 
                key={idx} 
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={tropicalAnimations.staggerContainer}
                className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Photo */}
                <motion.div variants={tropicalAnimations.slideUpFade} className="w-full md:w-1/2">
                  <div 
                    className="w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-lg p-2"
                    style={{ backgroundColor: tropicalTheme.colors.background }}
                  >
                    <img 
                      src={story.img} 
                      alt={story.title} 
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                </motion.div>

                {/* Date marker */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full items-center justify-center z-10" style={{ backgroundColor: tropicalTheme.colors.accent }}>
                  <span className="text-white font-bold text-xs">{(idx + 1).toString().padStart(2, '0')}</span>
                </div>

                {/* Text */}
                <motion.div variants={tropicalAnimations.slideUpFade} className={`w-full md:w-1/2 flex flex-col ${idx % 2 !== 0 ? 'md:items-end md:text-right' : 'md:items-start md:text-left'}`}>
                  <span 
                    className="inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
                    style={{ backgroundColor: `${tropicalTheme.colors.accentSecondary}30`, color: tropicalTheme.colors.accent, fontFamily: tropicalTheme.typography.sans }}
                  >
                    {story.date}
                  </span>
                  <h3 
                    className="text-3xl md:text-4xl font-medium mb-4"
                    style={{ fontFamily: tropicalTheme.typography.display }}
                  >
                    {story.title}
                  </h3>
                  <p 
                    className="text-sm md:text-base leading-relaxed text-black/60 max-w-sm"
                    style={{ fontFamily: tropicalTheme.typography.sans }}
                  >
                    {story.text}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

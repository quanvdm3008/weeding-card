import React from "react";
import { motion } from "framer-motion";
import { botanicalTheme } from "../theme";
import { botanicalAnimations } from "../animations";
import { BotanicalFrame } from "../components/BotanicalFrame";
import type { StoryMilestone } from "@/data/seedData";

interface BotanicalStoryProps {
  stories?: StoryMilestone[];
}

export const BotanicalStory: React.FC<BotanicalStoryProps> = ({ stories }) => {
  if (!stories || stories.length === 0) return null;

  return (
    <section 
      className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden"
      style={{ backgroundColor: botanicalTheme.colors.surface, color: botanicalTheme.colors.text }}
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div {...botanicalAnimations.floatUp} className="text-center mb-20 md:mb-32">
          <p 
            className="text-xs md:text-sm uppercase tracking-[0.2em] mb-4"
            style={{ fontFamily: botanicalTheme.typography.sans, color: botanicalTheme.colors.textMuted }}
          >
            How it all began
          </p>
          <h2 
            className="text-5xl md:text-6xl font-light"
            style={{ fontFamily: botanicalTheme.typography.display }}
          >
            Our Story
          </h2>
          <div className="w-12 h-[1px] mx-auto mt-6" style={{ backgroundColor: botanicalTheme.colors.accentWarm }} />
        </motion.div>

        <div className="relative">
          {/* Organic connecting path */}
          <svg className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-8 hidden md:block" viewBox="0 0 8 100" preserveAspectRatio="none">
            <path d="M 4,0 Q 8,25 4,50 T 4,100" fill="none" stroke={botanicalTheme.colors.border} strokeWidth="0.5" strokeDasharray="1 2" vectorEffect="non-scaling-stroke" />
          </svg>

          <div className="space-y-20 md:space-y-32">
            {stories.map((story, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Image */}
                <motion.div 
                  {...botanicalAnimations.fadeSlow}
                  className="w-full md:w-1/2"
                >
                  <BotanicalFrame className="w-full aspect-[4/5] md:aspect-square">
                    <img 
                      src={story.img} 
                      alt={story.title} 
                      className="w-full h-full object-cover"
                    />
                  </BotanicalFrame>
                </motion.div>

                {/* Text */}
                <motion.div 
                  {...botanicalAnimations.floatUp}
                  className={`w-full md:w-1/2 text-center ${idx % 2 !== 0 ? 'md:text-right' : 'md:text-left'}`}
                >
                  <span 
                    className="inline-block px-4 py-1 rounded-full text-xs uppercase tracking-widest mb-6"
                    style={{ backgroundColor: `${botanicalTheme.colors.accentWarm}20`, color: botanicalTheme.colors.text, fontFamily: botanicalTheme.typography.sans }}
                  >
                    {story.date}
                  </span>
                  <h3 
                    className="text-3xl md:text-4xl font-light mb-6"
                    style={{ fontFamily: botanicalTheme.typography.display }}
                  >
                    {story.title}
                  </h3>
                  <p 
                    className="text-sm md:text-base leading-loose"
                    style={{ fontFamily: botanicalTheme.typography.sans, color: botanicalTheme.colors.textMuted }}
                  >
                    {story.text}
                  </p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

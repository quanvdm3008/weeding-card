import React from "react";
import { motion } from "framer-motion";
import { cinematicTheme } from "../theme";
import { cinematicAnimations } from "../animations";
import type { StoryMilestone } from "@/data/seedData";

interface CinematicStoryProps {
  stories?: StoryMilestone[];
}

export const CinematicStory: React.FC<CinematicStoryProps> = ({ stories }) => {
  if (!stories || stories.length === 0) return null;

  return (
    <section 
      className="py-24 md:py-32 px-6 md:px-12 relative"
      style={{ backgroundColor: cinematicTheme.colors.background, color: cinematicTheme.colors.text }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div {...cinematicAnimations.creditScroll} className="text-center mb-32">
          <p 
            className="text-xs uppercase tracking-[0.4em] mb-4"
            style={{ fontFamily: cinematicTheme.typography.sans, color: cinematicTheme.colors.textMuted }}
          >
            The Plot
          </p>
          <h2 
            className="text-4xl md:text-5xl uppercase tracking-widest"
            style={{ fontFamily: cinematicTheme.typography.display, color: cinematicTheme.colors.accent }}
          >
            Our Story
          </h2>
        </motion.div>

        <div className="space-y-32">
          {stories.map((story, idx) => (
            <motion.div 
              key={idx} 
              {...cinematicAnimations.creditScroll}
              className="flex flex-col items-center"
            >
              {/* Scene Frame */}
              <div 
                className="w-full max-w-4xl relative aspect-video bg-black overflow-hidden border border-neutral-800"
                style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}
              >
                <motion.img 
                  {...cinematicAnimations.panRight}
                  src={story.img} 
                  alt={story.title} 
                  className="absolute inset-0 w-[105%] h-[105%] object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                
                {/* Scene Meta */}
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div style={{ fontFamily: cinematicTheme.typography.sans }}>
                    <span className="text-[10px] tracking-widest text-neutral-400 uppercase block mb-1">
                      Scene {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-xl md:text-2xl uppercase tracking-wider text-white">
                      {story.title}
                    </h3>
                  </div>
                  <span className="text-xs tracking-widest text-neutral-400 uppercase" style={{ fontFamily: cinematicTheme.typography.sans }}>
                    {story.date}
                  </span>
                </div>
              </div>

              {/* Subtitles (Text) */}
              <div className="max-w-2xl text-center mt-12">
                <p 
                  className="text-sm md:text-base leading-loose italic text-neutral-300"
                  style={{ fontFamily: cinematicTheme.typography.display }}
                >
                  "{story.text}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

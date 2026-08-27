import React from "react";
import { motion } from "framer-motion";
import { editorialTheme } from "../theme";
import { editorialAnimations } from "../animations";
import type { StoryMilestone } from "@/data/seedData";

interface EditorialStoryProps {
  stories?: StoryMilestone[];
}

export const EditorialStory: React.FC<EditorialStoryProps> = ({ stories }) => {
  if (!stories || stories.length === 0) return null;

  return (
    <section 
      className="py-24 md:py-32 px-6 md:px-12 border-t-2"
      style={{ backgroundColor: editorialTheme.colors.background, color: editorialTheme.colors.text, borderColor: editorialTheme.colors.border }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div {...editorialAnimations.revealUp} className="mb-20 md:mb-32 flex flex-col md:flex-row justify-between items-end gap-8 border-b pb-8" style={{ borderColor: editorialTheme.colors.border }}>
          <h2 
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter"
            style={{ fontFamily: editorialTheme.typography.display }}
          >
            The <br className="hidden md:block"/> Chronicles
          </h2>
          <p 
            className="text-xs uppercase tracking-widest font-bold max-w-xs text-right"
            style={{ fontFamily: editorialTheme.typography.sans, color: editorialTheme.colors.textMuted }}
          >
            How our paths intertwined and became one journey.
          </p>
        </motion.div>

        <div className="space-y-24 md:space-y-40">
          {stories.map((story, idx) => (
            <div 
              key={idx} 
              className={`grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Image */}
              <motion.div 
                {...editorialAnimations.revealSlow}
                className={`md:col-span-7 h-[50vh] md:h-[70vh] relative ${idx % 2 !== 0 ? 'md:order-2' : 'md:order-1'}`}
              >
                <div className="absolute inset-0 transform translate-x-4 translate-y-4 md:translate-x-6 md:translate-y-6" style={{ backgroundColor: editorialTheme.colors.border }} />
                <img 
                  src={story.img} 
                  alt={story.title} 
                  className="w-full h-full object-cover relative z-10 border filter sepia-[0.2] hover:sepia-0 transition-all duration-700"
                  style={{ borderColor: editorialTheme.colors.border }}
                />
              </motion.div>

              {/* Text Content */}
              <motion.div 
                {...editorialAnimations.revealUp}
                className={`md:col-span-5 flex flex-col justify-center ${idx % 2 !== 0 ? 'md:order-1' : 'md:order-2'}`}
              >
                <p 
                  className="text-xs font-bold uppercase tracking-[0.3em] mb-6"
                  style={{ fontFamily: editorialTheme.typography.sans, color: editorialTheme.colors.accent }}
                >
                  {story.date}
                </p>
                <h3 
                  className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-8 leading-none"
                  style={{ fontFamily: editorialTheme.typography.display }}
                >
                  {story.title}
                </h3>
                <p 
                  className="text-sm md:text-base leading-relaxed text-justify"
                  style={{ fontFamily: editorialTheme.typography.sans, color: editorialTheme.colors.textMuted }}
                >
                  {story.text}
                </p>
                <div className="w-12 h-[2px] mt-8" style={{ backgroundColor: editorialTheme.colors.accent }} />
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

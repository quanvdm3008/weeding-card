import React from "react";
import { motion } from "framer-motion";
import { bohoTheme } from "../theme";
import type { StoryMilestone } from "@/data/seedData";

interface BohoStoryProps {
  stories: StoryMilestone[];
}

export const BohoStory: React.FC<BohoStoryProps> = ({ stories }) => {
  if (!stories?.length) return null;

  return (
    <section className="py-24 md:py-32 px-4 relative overflow-hidden" style={{ backgroundColor: bohoTheme.colors.background }}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none">
        <svg viewBox="0 0 100 100" fill={bohoTheme.colors.text}>
          <path d="M50 0C50 0 10 30 10 60C10 80 30 100 50 100C70 100 90 80 90 60C90 30 50 0 50 0Z" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <h2 
            className="text-5xl md:text-7xl font-medium mb-6"
            style={{ fontFamily: bohoTheme.typography.display, color: bohoTheme.colors.text }}
          >
            Our Story
          </h2>
          <p className="text-sm md:text-base tracking-[0.2em] uppercase" style={{ color: bohoTheme.colors.accent }}>
            How it all began
          </p>
        </div>

        <div className="flex flex-col gap-16 md:gap-32">
          {stories.map((story, index) => {
            const isEven = index % 2 === 0;
            return (
              <div 
                key={`${story.date}-${story.title}`}
                className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16`}
              >
                {/* Image Side - Polaroid Style */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? -50 : 50, rotate: isEven ? -5 : 5 }}
                  whileInView={{ opacity: 1, x: 0, rotate: isEven ? -2 : 2 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className={`w-full md:w-1/2 flex ${index % 2 === 0 ? "justify-end pr-0 md:pr-16" : "justify-start pl-0 md:pl-16"}`}
                >
                  <div 
                    className="relative w-full max-w-sm rounded-t-full overflow-hidden"
                    style={{
                      border: `12px solid ${bohoTheme.colors.surface}`,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.05)"
                    }}
                  >
                    <div className="aspect-[3/4] w-full">
                      {story.img && (
                        <img 
                          src={story.img} 
                          alt={story.title}
                          className="w-full h-full object-cover filter sepia-[0.2]"
                        />
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Text Side */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="w-full md:w-1/2 text-center md:text-left"
                >
                  <div className="inline-block px-4 py-1 mb-4 rounded-full" style={{ backgroundColor: bohoTheme.colors.surface }}>
                    <span className="text-sm font-medium tracking-widest" style={{ color: bohoTheme.colors.accent }}>
                      {story.date}
                    </span>
                  </div>
                  <h3 
                    className="text-3xl md:text-4xl mb-4"
                    style={{ fontFamily: bohoTheme.typography.display, color: bohoTheme.colors.text }}
                  >
                    {story.title}
                  </h3>
                  <p 
                    className="text-lg leading-relaxed"
                    style={{ color: bohoTheme.colors.textMuted }}
                  >
                    {story.text}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

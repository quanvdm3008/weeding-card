import React from "react";
import { motion } from "framer-motion";
import type { StoryMilestone } from "@/data/seedData";
import { SparklingImage } from "@/components/wedding/SparklingImage";

interface MinimalStoryProps {
  stories: StoryMilestone[];
  accentColor?: string;
}

export const MinimalStory: React.FC<MinimalStoryProps> = ({ stories, accentColor = "#000" }) => {
  if (!stories || stories.length === 0) return null;

  return (
    <section id="story" className="py-32 px-8 md:px-24 bg-[#FAFAFA]">
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, margin: "-100px" }} 
        transition={{ duration: 1 }} 
        className="mb-24"
      >
        <h2 className="text-5xl md:text-7xl font-light tracking-tighter text-center">Chuyện tình</h2>
      </motion.div>
      <div className="space-y-32">
        {stories.map((story, idx) => (
          <div key={idx} className="grid md:grid-cols-12 gap-8 md:gap-16 items-start">
            <div className="md:col-span-3">
              <span className="text-sm font-medium tracking-wide text-neutral-400">{story.date}</span>
            </div>
            <div className="md:col-span-5">
              <h3 className="text-3xl font-light tracking-tight mb-6">{story.title}</h3>
              <p className="text-base text-neutral-500 leading-relaxed font-light">{story.text}</p>
            </div>
            <div className="md:col-span-4">
              <div className="aspect-[4/3] w-full bg-neutral-100 overflow-hidden">
                <SparklingImage accentColor={accentColor} src={story.img} alt={story.title} className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

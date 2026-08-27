import React from "react";
import { motion } from "framer-motion";
import { SparklingImage } from "@/components/wedding/SparklingImage";
import { modernTheme } from "../theme";

interface ModernStoryProps {
  stories: { title: string; date: string; text: string; img: string }[];
}

export const ModernStory: React.FC<ModernStoryProps> = ({ stories }) => {
  return (
    <section 
      className="py-24 px-4 md:px-8 overflow-hidden relative"
      style={{ backgroundColor: modernTheme.colors.background }}
    >
      <div className="max-w-6xl mx-auto border-t-2" style={{ borderColor: modernTheme.colors.text }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-12 flex flex-col md:flex-row md:items-end justify-between border-b"
          style={{ borderColor: modernTheme.colors.border }}
        >
          <h2 
            className="text-6xl md:text-8xl lg:text-[120px] font-black tracking-tighter uppercase leading-none"
            style={{ color: modernTheme.colors.text, fontFamily: modernTheme.typography.display }}
          >
            Our
            <br />
            Story
          </h2>
          <div className="mt-8 md:mt-0 text-right md:w-1/3">
            <p className="text-sm font-medium leading-relaxed" style={{ color: modernTheme.colors.textMuted }}>
              A curated archive of the moments that brought us to this day. Documented for eternity.
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col">
          {stories.map((story, idx) => {
            const num = (idx + 1).toString().padStart(2, "0");
            
            return (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col md:flex-row group border-b"
                style={{ borderColor: modernTheme.colors.border }}
              >
                {/* Number & Date */}
                <div className="md:w-1/4 py-8 md:py-16 md:pr-8 flex flex-row md:flex-col justify-between md:justify-start items-baseline md:border-r" style={{ borderColor: modernTheme.colors.border }}>
                  <span 
                    className="text-4xl md:text-6xl font-black text-transparent"
                    style={{ WebkitTextStroke: `1px ${modernTheme.colors.textMuted}`, fontFamily: modernTheme.typography.display }}
                  >
                    {num}
                  </span>
                  <span 
                    className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold md:mt-12"
                    style={{ color: modernTheme.colors.accent, fontFamily: modernTheme.typography.sans }}
                  >
                    {story.date}
                  </span>
                </div>

                {/* Content */}
                <div className="md:w-1/2 py-8 md:py-16 md:px-12 flex flex-col justify-center">
                  <h3 
                    className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-6"
                    style={{ color: modernTheme.colors.text, fontFamily: modernTheme.typography.display }}
                  >
                    {story.title}
                  </h3>
                  <p 
                    className="text-sm md:text-base leading-relaxed font-medium"
                    style={{ color: modernTheme.colors.textMuted, fontFamily: modernTheme.typography.sans }}
                  >
                    {story.text}
                  </p>
                </div>

                {/* Image */}
                <div className="md:w-1/4 py-8 md:py-12 md:pl-8 flex items-center">
                  <div className="w-full aspect-[4/5] overflow-hidden bg-neutral-100 relative">
                    <SparklesPattern />
                    <SparklingImage 
                      src={story.img} 
                      alt={story.title}
                      accentColor={modernTheme.colors.accent}
                      className="w-full h-full object-cover filter grayscale-[0.3] transition-all ease-out group-hover:scale-105 group-hover:grayscale-0"
                      style={{ transitionDuration: "1500ms" }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const SparklesPattern = () => (
  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "4px 4px" }} />
);

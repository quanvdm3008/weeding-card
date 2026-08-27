import React from "react";
import { motion } from "framer-motion";
import { modernTheme } from "../theme";

interface ModernDetailsProps {
  date: string;
  time: string;
  venue: string;
  address: string;
}

export const ModernDetails: React.FC<ModernDetailsProps> = ({
  date,
  time,
  venue,
  address,
}) => {
  return (
    <section 
      className="py-24 px-4 md:px-8 relative overflow-hidden"
      style={{ backgroundColor: modernTheme.colors.background }}
    >
      <div className="max-w-6xl mx-auto border-t-2" style={{ borderColor: modernTheme.colors.text }}>
        <div className="py-12 md:py-24 flex flex-col md:flex-row border-b" style={{ borderColor: modernTheme.colors.border }}>
          {/* Header */}
          <div className="md:w-1/3 mb-12 md:mb-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p 
                className="text-[10px] uppercase tracking-[0.4em] font-bold mb-4"
                style={{ color: modernTheme.colors.accent, fontFamily: modernTheme.typography.sans }}
              >
                The Details
              </p>
              <h2 
                className="text-5xl md:text-7xl font-black uppercase tracking-tighter"
                style={{ color: modernTheme.colors.text, fontFamily: modernTheme.typography.display }}
              >
                When
                <br />
                <span className="italic font-light tracking-normal" style={{ fontFamily: modernTheme.typography.serif, color: modernTheme.colors.textMuted }}>&</span>
                <br />
                Where
              </h2>
            </motion.div>
          </div>

          {/* Details Grid */}
          <div className="md:w-2/3 flex flex-col md:flex-row border-l-0 md:border-l" style={{ borderColor: modernTheme.colors.border }}>
            
            {/* Ceremony Column */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:w-1/2 p-0 md:p-12 mb-12 md:mb-0 border-b md:border-b-0 md:border-r"
              style={{ borderColor: modernTheme.colors.border }}
            >
              <h3 
                className="text-2xl font-bold uppercase tracking-tight mb-2"
                style={{ color: modernTheme.colors.text, fontFamily: modernTheme.typography.display }}
              >
                Ceremony
              </h3>
              <p className="text-sm uppercase tracking-[0.2em] font-bold mb-12" style={{ color: modernTheme.colors.accent }}>
                {time}
              </p>

              <div className="space-y-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-1" style={{ color: modernTheme.colors.textMuted }}>Date</p>
                  <p className="text-lg font-medium" style={{ color: modernTheme.colors.text }}>
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-1" style={{ color: modernTheme.colors.textMuted }}>Location</p>
                  <p className="text-xl font-medium mb-1" style={{ color: modernTheme.colors.text }}>{venue}</p>
                  <p className="text-sm font-medium leading-relaxed" style={{ color: modernTheme.colors.textMuted }}>{address}</p>
                </div>
              </div>

              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(`${venue} ${address}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-12 text-xs font-bold uppercase tracking-[0.2em] border-b pb-1 transition-colors hover:opacity-50"
                style={{ color: modernTheme.colors.text, borderColor: modernTheme.colors.text }}
              >
                View Map
              </a>
            </motion.div>

            {/* Reception Column */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="md:w-1/2 p-0 md:p-12 pt-12 md:pt-12"
            >
              <h3 
                className="text-2xl font-bold uppercase tracking-tight mb-2"
                style={{ color: modernTheme.colors.text, fontFamily: modernTheme.typography.display }}
              >
                Reception
              </h3>
              <p className="text-sm uppercase tracking-[0.2em] font-bold mb-12" style={{ color: modernTheme.colors.textMuted }}>
                Following Ceremony
              </p>

              <div className="space-y-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-1" style={{ color: modernTheme.colors.textMuted }}>Details</p>
                  <p className="text-lg font-medium" style={{ color: modernTheme.colors.text }}>
                    Dinner & Dancing
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-1" style={{ color: modernTheme.colors.textMuted }}>Location</p>
                  <p className="text-xl font-medium mb-1" style={{ color: modernTheme.colors.text }}>Main Banquet Hall</p>
                  <p className="text-sm font-medium leading-relaxed" style={{ color: modernTheme.colors.textMuted }}>Same venue as ceremony</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

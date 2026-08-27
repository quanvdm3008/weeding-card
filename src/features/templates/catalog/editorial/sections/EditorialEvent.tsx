import React from "react";
import { motion } from "framer-motion";
import { editorialTheme } from "../theme";
import { editorialAnimations } from "../animations";
import { safeFormatDate } from "@/lib/utils";

interface EditorialEventProps {
  date: string;
  time: string;
  venue: string;
  address: string;
}

export const EditorialEvent: React.FC<EditorialEventProps> = ({
  date,
  time,
  venue,
  address
}) => {
  return (
    <section 
      className="py-24 md:py-32 px-6 md:px-12"
      style={{ backgroundColor: editorialTheme.colors.surface, color: editorialTheme.colors.text }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div {...editorialAnimations.revealUp} className="text-center mb-16 md:mb-24">
          <h2 
            className="text-4xl md:text-6xl font-black uppercase tracking-tighter"
            style={{ fontFamily: editorialTheme.typography.display }}
          >
            The Itinerary
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {/* Ceremony */}
          <motion.div 
            {...editorialAnimations.revealUp}
            className="border-t-4 pt-8"
            style={{ borderColor: editorialTheme.colors.border }}
          >
            <p 
              className="text-xs uppercase tracking-widest font-bold mb-4"
              style={{ fontFamily: editorialTheme.typography.sans, color: editorialTheme.colors.textMuted }}
            >
              Part I
            </p>
            <h3 
              className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6"
              style={{ fontFamily: editorialTheme.typography.display }}
            >
              Ceremony
            </h3>
            <div className="space-y-2">
              <p className="font-bold uppercase text-sm tracking-widest" style={{ fontFamily: editorialTheme.typography.sans }}>
                {safeFormatDate(date, { month: "long", day: "numeric", year: "numeric" })} · {time}
              </p>
              <p className="font-bold uppercase text-base" style={{ fontFamily: editorialTheme.typography.sans }}>
                {venue}
              </p>
              <p className="text-sm" style={{ fontFamily: editorialTheme.typography.sans, color: editorialTheme.colors.textMuted }}>
                {address}
              </p>
            </div>
          </motion.div>

          {/* Reception */}
          <motion.div 
            {...editorialAnimations.revealUp}
            transition={{ delay: 0.2 }}
            className="border-t-4 pt-8"
            style={{ borderColor: editorialTheme.colors.border }}
          >
            <p 
              className="text-xs uppercase tracking-widest font-bold mb-4"
              style={{ fontFamily: editorialTheme.typography.sans, color: editorialTheme.colors.textMuted }}
            >
              Part II
            </p>
            <h3 
              className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6"
              style={{ fontFamily: editorialTheme.typography.display }}
            >
              Reception
            </h3>
            <div className="space-y-2">
              <p className="font-bold uppercase text-sm tracking-widest" style={{ fontFamily: editorialTheme.typography.sans }}>
                {safeFormatDate(date, { month: "long", day: "numeric", year: "numeric" })} · 18:00
              </p>
              <p className="font-bold uppercase text-base" style={{ fontFamily: editorialTheme.typography.sans }}>
                {venue}
              </p>
              <p className="text-sm" style={{ fontFamily: editorialTheme.typography.sans, color: editorialTheme.colors.textMuted }}>
                {address}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

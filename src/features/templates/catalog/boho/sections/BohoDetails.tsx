import React from "react";
import { motion } from "framer-motion";
import { bohoTheme } from "../theme";
import { CalendarDays, MapPin } from "lucide-react";

interface BohoDetailsProps {
  date?: string;
  time?: string;
  venue?: string;
  address?: string;
}

export const BohoDetails: React.FC<BohoDetailsProps> = ({
  date,
  time,
  venue,
  address,
}) => {
  return (
    <section className="py-24 md:py-32 px-4 relative overflow-hidden" style={{ backgroundColor: bohoTheme.colors.surface }}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 
            className="text-5xl md:text-7xl font-medium mb-4"
            style={{ fontFamily: bohoTheme.typography.display, color: bohoTheme.colors.text }}
          >
            The Details
          </h2>
          <div className="w-24 h-[1px] mx-auto" style={{ backgroundColor: bohoTheme.colors.accent }} />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* When */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center p-10 shadow-lg"
            style={{ 
              backgroundColor: bohoTheme.colors.background,
              borderRadius: "40px",
              border: `1px solid ${bohoTheme.colors.border}`
            }}
          >
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: bohoTheme.colors.surface }}
            >
              <CalendarDays className="w-8 h-8" style={{ color: bohoTheme.colors.accent }} />
            </div>
            <h3 
              className="text-2xl mb-4 font-medium"
              style={{ fontFamily: bohoTheme.typography.display, color: bohoTheme.colors.text }}
            >
              When
            </h3>
            {date && (
              <p className="text-lg mb-2" style={{ color: bohoTheme.colors.textMuted }}>
                {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            )}
            {time && (
              <p className="text-lg font-medium" style={{ color: bohoTheme.colors.accent }}>
                At {time}
              </p>
            )}
          </motion.div>

          {/* Where */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center p-10 shadow-lg"
            style={{ 
              backgroundColor: bohoTheme.colors.background,
              borderRadius: "40px",
              border: `1px solid ${bohoTheme.colors.border}`
            }}
          >
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: bohoTheme.colors.surface }}
            >
              <MapPin className="w-8 h-8" style={{ color: bohoTheme.colors.accent }} />
            </div>
            <h3 
              className="text-2xl mb-4 font-medium"
              style={{ fontFamily: bohoTheme.typography.display, color: bohoTheme.colors.text }}
            >
              Where
            </h3>
            {venue && (
              <p className="text-xl mb-2 font-medium" style={{ color: bohoTheme.colors.text }}>
                {venue}
              </p>
            )}
            {address && (
              <p className="text-base leading-relaxed max-w-[250px]" style={{ color: bohoTheme.colors.textMuted }}>
                {address}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

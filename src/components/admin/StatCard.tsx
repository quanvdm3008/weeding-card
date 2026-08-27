import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  /** HSL/hex accent color for icons and hover borders. Default: gold token. */
  accent?: string;
  index?: number;
}

/** Shared data cards for admin dashboard (attendance, RSVP stats...). */
const StatCard = ({ label, value, icon: Icon, accent = "hsl(38 47% 61%)", index = 0 }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    className="card-luxury p-4"
  >
    <div className="flex items-center justify-between gap-2">
      <p className="font-body text-xs text-muted-foreground">{label}</p>
      {Icon && (
        <span
          className="w-7 h-7 rounded-lg grid place-items-center shrink-0"
          style={{ background: `color-mix(in srgb, ${accent} 14%, transparent)`, color: accent }}
        >
          <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
        </span>
      )}
    </div>
    <p className="font-display text-3xl font-medium mt-1.5 text-foreground">{value}</p>
  </motion.div>
);

export default StatCard;

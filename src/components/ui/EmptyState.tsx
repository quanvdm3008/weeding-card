import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  /** CTA (usually <Button>) displays below the description. */
  action?: ReactNode;
}

/** Standard empty state for admin panels/lists — icon + title + CTA. */
const EmptyState = ({ icon: Icon, title, description, action }: EmptyStateProps) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="flex flex-col items-center justify-center text-center py-14 px-6"
  >
    <span className="w-14 h-14 rounded-2xl grid place-items-center mb-4 bg-secondary text-accent">
      <Icon className="w-6 h-6" strokeWidth={1.5} />
    </span>
    <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
    {description && (
      <p className="font-body text-sm text-muted-foreground mt-1.5 max-w-sm leading-relaxed">{description}</p>
    )}
    {action && <div className="mt-5">{action}</div>}
  </motion.div>
);

export default EmptyState;

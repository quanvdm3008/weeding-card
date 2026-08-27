import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Wrap class `.glass-card`/`.glass-nav` (frontend/src/index.css) into component —
 * as suggested by MASTER_ROADMAP.md §17 (Glass Layer) to make it easier to apply to the Admin layer (§18.5).
 */
export const GlassPanel = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("glass-card rounded-2xl", className)} {...props} />
);

export const GlassNav = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("glass-nav", className)} {...props} />
);

/**
 * `.premium-card` — hover lift + light yellow border, used for interactive cards (different from GlassPanel
 * is a static, transparent surface).
 */
export const GlassCard = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("premium-card", className)} {...props} />
);

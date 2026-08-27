import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { WeddingTheme } from "@/data/themes";
import { GALLERY_ITEM_REVEAL_DURATION_SECONDS } from "@/lib/animationTiming";

/**
 * Wrapper animation into the viewport for each section of the generic layout.
 * (Previously declared locally in WeddingFullPage — separated for all LayoutStrategy to share.)
 */
export const SectionAnimation = ({
  variant,
  index,
  children,
}: {
  variant: WeddingTheme["sectionAnimation"];
  index: number;
  children: ReactNode;
}) => {
  const variants = {
    fadeUp: { initial: { opacity: 0, y: 50 }, whileInView: { opacity: 1, y: 0 } },
    slideAlt: { initial: { opacity: 0, x: index % 2 === 0 ? -60 : 60 }, whileInView: { opacity: 1, x: 0 } },
    zoomIn: { initial: { opacity: 0, scale: 0.9 }, whileInView: { opacity: 1, scale: 1 } },
    maskReveal: { initial: { opacity: 0, clipPath: "inset(0 0 100% 0)" }, whileInView: { opacity: 1, clipPath: "inset(0 0 0% 0)" } },
    tiltIn: { initial: { opacity: 0, rotate: index % 2 === 0 ? -3 : 3, y: 40 }, whileInView: { opacity: 1, rotate: 0, y: 0 } },
    blurIn: { initial: { opacity: 0, filter: "blur(12px)" }, whileInView: { opacity: 1, filter: "blur(0px)" } },
    scaleUp: { initial: { opacity: 0, scale: 0.82 }, whileInView: { opacity: 1, scale: 1 } },
    float: { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 } },
  } as const;
  const v = variants[variant] || variants.fadeUp;
  return (
    <motion.div initial={v.initial} whileInView={v.whileInView} viewport={{ once: true, margin: "-80px" }} transition={{ duration: GALLERY_ITEM_REVEAL_DURATION_SECONDS, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
};

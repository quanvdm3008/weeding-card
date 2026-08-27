export const tropicalAnimations = {
  slideUpFade: {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
  },
  archReveal: {
    initial: { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" },
    whileInView: { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" },
    viewport: { once: true },
    transition: { duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }
  },
  floatSlow: {
    animate: {
      y: [0, -15, 0],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
    }
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.1 }
    }
  }
};

export const botanicalAnimations = {
  floatUp: {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 1.2, ease: [0.25, 1, 0.5, 1] }
  },
  fadeSlow: {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 1.5, ease: "easeOut" }
  },
  sway: {
    animate: {
      rotate: [-1, 1, -1],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
    }
  }
};

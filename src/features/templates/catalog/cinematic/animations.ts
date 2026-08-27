export const cinematicAnimations = {
  fadeInSlow: {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { duration: 2, ease: "easeOut" }
  },
  zoomOutSlow: {
    animate: {
      scale: [1.1, 1],
      transition: { duration: 15, ease: "linear" }
    }
  },
  panRight: {
    animate: {
      x: ["0%", "-5%"],
      transition: { duration: 20, repeat: Infinity, repeatType: "mirror" as const, ease: "linear" }
    }
  },
  creditScroll: {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-150px" },
    transition: { duration: 1.5, ease: [0.25, 1, 0.5, 1] }
  }
};

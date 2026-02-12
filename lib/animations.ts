export const transitions = {
  smooth: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  spring: { type: "spring", stiffness: 300, damping: 30 },
  slow: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const },
};

export const variants = {
  fadeInUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
    }
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6 }
    }
  },
  revealImage: {
    hidden: { clipPath: 'inset(0 100% 0 0)' },
    visible: { 
      clipPath: 'inset(0 0 0 0)',
      transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] as const }
    }
  }
};
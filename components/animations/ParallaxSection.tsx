import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({ children, className = '', id }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Track scroll progress of this specific section in the viewport
  // "start end" -> start of section enters bottom of viewport
  // "end start" -> end of section leaves top of viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Smooth out the scroll progress tracking using a spring configuration
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001
  });

  // Map scroll progress to a multi-dimensional parallax transformation:
  // - y: moves content slightly slower than the viewport scroll speed
  // - scale: dynamic zoom (contracts on screen edges, expands to 100% in center)
  // - opacity: fades in at bottom entry, fades out at top exit
  // - rotateX: tilts forward on entry, sits flat in center, tilts backward on exit
  const y = useTransform(smoothProgress, [0, 0.35, 0.65, 1], [70, 0, 0, -70]);
  const scale = useTransform(smoothProgress, [0, 0.35, 0.65, 1], [0.93, 1, 1, 0.93]);
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);
  const rotateX = useTransform(smoothProgress, [0, 0.35, 0.65, 1], [6, 0, 0, -6]);

  return (
    <motion.div
      ref={ref}
      id={id}
      style={{ 
        y: isMobile ? 0 : y, 
        scale: isMobile ? 1 : scale, 
        opacity, 
        rotateX: isMobile ? 0 : rotateX, 
        transformPerspective: 1200,
        backfaceVisibility: "hidden" as any
      }}
      className={`will-change-transform transform-gpu ${className}`}
    >
      {children}
    </motion.div>
  );
};

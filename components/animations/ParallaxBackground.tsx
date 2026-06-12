import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const ParallaxBackground: React.FC = () => {
  const { scrollY } = useScroll();

  // Define translation ranges for each floating element based on scrollY
  // Higher value range in useTransform translates to faster scrolling, creating depth
  const y1 = useTransform(scrollY, [0, 5000], [0, -750]);
  const y2 = useTransform(scrollY, [0, 5000], [0, 500]);
  const y3 = useTransform(scrollY, [0, 5000], [0, -1000]);
  const y4 = useTransform(scrollY, [0, 5000], [0, 400]);
  
  const rotate1 = useTransform(scrollY, [0, 5000], [0, 180]);
  const rotate2 = useTransform(scrollY, [0, 5000], [0, -120]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Decorative Blob 1 */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-[8%] left-[5%] w-72 h-72 rounded-full bg-primary/5 dark:bg-primary/3 blur-[80px]"
      />

      {/* Decorative Blob 2 */}
      <motion.div
        style={{ y: y2 }}
        className="absolute top-[32%] right-[5%] w-96 h-96 rounded-full bg-secondary/5 dark:bg-secondary/3 blur-[100px]"
      />

      {/* Decorative Blob 3 */}
      <motion.div
        style={{ y: y3 }}
        className="absolute top-[55%] left-[8%] w-80 h-80 rounded-full bg-accent/10 dark:bg-accent/2 blur-[90px]"
      />

      {/* Decorative Blob 4 */}
      <motion.div
        style={{ y: y4 }}
        className="absolute top-[78%] right-[8%] w-[450px] h-[450px] rounded-full bg-primary/5 dark:bg-primary/2 blur-[120px]"
      />

      {/* Floating Outline Heart 1 */}
      <motion.div
        style={{ y: y1, rotate: rotate1 }}
        className="absolute top-[15%] right-[10%] text-primary/10 dark:text-primary/5 hidden lg:block"
      >
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </motion.div>

      {/* Floating Outline Heart 2 */}
      <motion.div
        style={{ y: y3, rotate: rotate2 }}
        className="absolute top-[48%] left-[8%] text-secondary/15 dark:text-secondary/5 hidden lg:block"
      >
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </motion.div>

      {/* Floating Outline Heart 3 */}
      <motion.div
        style={{ y: y2, rotate: rotate1 }}
        className="absolute top-[72%] right-[12%] text-accent/20 dark:text-accent/5 hidden lg:block"
      >
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </motion.div>
    </div>
  );
};

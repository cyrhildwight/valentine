import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Mail, X } from 'lucide-react';

interface BentoGridProps {
  theme: 'light' | 'dark';
}

export const BentoGrid: React.FC<BentoGridProps> = ({ theme }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isGiftOpen, setIsGiftOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: gridScrollProgress } = useScroll({
    target: gridRef,
    offset: ["start end", "end start"]
  });
  const smoothGridProgress = useSpring(gridScrollProgress, { stiffness: 90, damping: 25 });

  const y1 = useTransform(smoothGridProgress, [0, 1], [35, -35]);
  const y2 = useTransform(smoothGridProgress, [0, 1], [-25, 25]);
  const y3 = useTransform(smoothGridProgress, [0, 1], [45, -45]);
  const y4 = useTransform(smoothGridProgress, [0, 1], [-20, 20]);
  const y5 = useTransform(smoothGridProgress, [0, 1], [25, -25]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section id="confessions" className="py-24 bg-cream dark:bg-[#0c0708] border-b border-primary/10 dark:border-white/5 overflow-hidden relative transition-colors duration-300">
      {/* Watermark */}
      <motion.div
        style={{ x }}
        className="absolute top-1/3 right-0 text-[10rem] leading-none font-display font-bold text-charcoal/[0.02] dark:text-white/[0.01] whitespace-nowrap pointer-events-none select-none z-0"
      >
        SECRET WHISPERS
      </motion.div>

      <div className="container mx-auto px-6 relative z-10" ref={gridRef}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[250px]">

          {/* Large Feature Card - Typewriter */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: 10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ y: isMobile ? 0 : y1 }}
            className="md:col-span-4 md:row-span-2 rounded-3xl overflow-hidden relative group border border-primary/5 dark:border-white/5"
          >
            <motion.img
              src="https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?q=80&w=800&auto=format&fit=crop"
              alt="Vintage Typewriter with Love Note"
              className="w-full h-full object-cover grayscale opacity-75 brightness-90 group-hover:grayscale-0 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 ease-in-out"
              initial={{ filter: "grayscale(100%)", scale: 1 }}
              whileTap={{ filter: "grayscale(0%)", scale: 1.05 }}
              whileInView={isMobile ? { filter: "grayscale(0%)", scale: 1.05 } : undefined}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.5 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-8 flex flex-col justify-end pointer-events-none">
            </div>
          </motion.div>

          {/* Quote Card - Typewriter Style */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ y: isMobile ? 0 : y2 }}
            className="md:col-span-4 bg-white/70 dark:bg-cream/40 backdrop-blur-md rounded-3xl p-8 flex flex-col justify-center items-start shadow-xl border border-primary/5 dark:border-white/5 hover:border-primary/20 transition-all"
          >
            <span className="text-6xl font-display text-primary/30 leading-none mb-4">"</span>
            <p className="font-typewriter text-base md:text-lg text-charcoal dark:text-gray-300 mb-2 leading-relaxed">
              "An unspoken love is a <span className="text-primary font-semibold">flower</span> that blooms in the secret garden of the heart."
            </p>
          </motion.div>

          {/* Portrait Illustration - Hand Writing Letter */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{ y: isMobile ? 0 : y3 }}
            className="md:col-span-4 md:row-span-2 bg-white/40 dark:bg-cream/20 rounded-3xl overflow-hidden relative group border border-primary/5 dark:border-white/5"
          >
            <motion.img
              src="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop"
              alt="Handwriting a Love Letter"
              className="w-full h-full object-cover grayscale opacity-70 brightness-90 group-hover:grayscale-0 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 ease-in-out"
              initial={{ filter: "grayscale(100%)", scale: 1 }}
              whileTap={{ filter: "grayscale(0%)", scale: 1.05 }}
              whileInView={isMobile ? { filter: "grayscale(0%)", scale: 1.05 } : undefined}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>

          {/* Circular CTA - Wax Sealed Envelope */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            onClick={() => setIsGiftOpen(true)}
            style={{ y: isMobile ? 0 : y4 }}
            className="md:col-span-4 bg-white/70 dark:bg-cream/40 backdrop-blur-md rounded-3xl p-8 flex items-center justify-center relative overflow-hidden shadow-xl border border-primary/5 dark:border-white/5 group cursor-pointer hover:border-primary/30 transition-all"
          >
            <div className="relative z-10 text-center flex flex-col items-center">
              <div className="w-40 h-40 relative flex items-center justify-center">
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 w-full h-full border border-dashed border-primary/20 rounded-full"
                />
                <div className="w-24 h-24 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform relative z-10">
                  <Mail className="text-white w-8 h-8 animate-pulse" />
                </div>
              </div>
              <h4 className="font-bold text-charcoal dark:text-white text-sm mt-4 tracking-wider uppercase">Unlock a<br />Secret Letter</h4>
            </div>

            {/* Background Decor */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
          </motion.div>

          {/* Orange Box - Hope Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            style={{ y: isMobile ? 0 : y5 }}
            className="md:col-span-4 bg-[#F97316]/90 rounded-3xl p-8 flex flex-col justify-between text-white relative overflow-hidden group border border-primary/5 dark:border-white/5"
          >
            <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <span className="text-6xl font-display text-white italic leading-none opacity-40">"</span>
            <p className="font-display italic text-xl md:text-2xl leading-relaxed text-white">
              <span className="font-bold border-b border-white/20">A confession</span> is a seed of hope. Let your heart speak, even in whispers.
            </p>
          </motion.div>

          {/* Square Image - Pink Wax Seal Envelope */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            style={{ y: isMobile ? 0 : y2 }}
            className="md:col-span-4 rounded-3xl overflow-hidden group border border-primary/5 dark:border-white/5"
          >
            <motion.img
              src="https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?q=80&w=800&auto=format&fit=crop"
              alt="Wax Seal Love Letter Envelope"
              className="w-full h-full object-cover grayscale opacity-75 brightness-90 group-hover:grayscale-0 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 ease-in-out"
              initial={{ filter: "grayscale(100%)", scale: 1 }}
              whileTap={{ filter: "grayscale(0%)", scale: 1.05 }}
              whileInView={isMobile ? { filter: "grayscale(0%)", scale: 1.05 } : undefined}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>

          {/* New Quote Card - Thoreau Typewriter Style */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            style={{ y: isMobile ? 0 : y1 }}
            className="md:col-span-4 bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20 rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-lg relative overflow-hidden group min-h-[250px]"
          >
            <div className="absolute inset-0 bg-white/5 opacity-50"></div>
            <p className="font-typewriter text-lg text-primary dark:text-rose-300 relative z-10 mb-4 leading-relaxed">
              "There is no remedy for love but to love more."
            </p>
            <span className="text-charcoal/60 dark:text-white/60 text-[10px] tracking-widest uppercase z-10 font-medium">— Henry David Thoreau</span>
          </motion.div>

        </div>
      </div>

      <AnimatePresence>
        {isGiftOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsGiftOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, rotateX: 20 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.95, opacity: 0, rotateX: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#fff0f2] dark:bg-[#12090b] rounded-3xl overflow-hidden max-w-sm w-full shadow-2xl relative border border-primary/10 dark:border-white/5"
            >
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary to-secondary" />

              <button
                onClick={() => setIsGiftOpen(false)}
                className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              <div className="pt-20 px-8 pb-8 text-center relative">
                <div className="w-24 h-24 mx-auto bg-white dark:bg-[#181113] border border-primary/5 dark:border-white/5 rounded-full shadow-xl flex items-center justify-center mb-6 relative z-10">
                  <Mail className="w-10 h-10 text-primary" />
                </div>

                <h3 className="font-display font-bold text-2xl text-charcoal dark:text-white mb-2 uppercase tracking-wide">A Random Whisper</h3>
                <p className="text-charcoal/60 dark:text-gray-400 text-xs mb-6">You've unlocked a hidden message of warmth.</p>

                <div className="bg-rose-500/5 rounded-2xl p-6 border border-rose-500/20">
                  <p className="font-handwriting text-3xl text-primary dark:text-rose-300 font-normal leading-normal">
                    "To whoever is reading this: Someone, somewhere, holds a beautiful thought of you. You are more cherished than you know."
                  </p>
                  <p className="text-[10px] text-primary/60 mt-4 uppercase tracking-widest font-bold">From: A Secret Admirer</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section >
  );
};
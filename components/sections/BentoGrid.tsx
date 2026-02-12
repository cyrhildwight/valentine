import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Gift, X } from 'lucide-react';

export const BentoGrid: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isGiftOpen, setIsGiftOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], [0, 100]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section id="memories" className="py-24 bg-gradient-to-b from-[#FDFBF7] to-white overflow-hidden relative">
      {/* Watermark */}
      <motion.div
        style={{ x }}
        className="absolute top-1/3 right-0 text-[10rem] leading-none font-display font-bold text-gray-900 opacity-[0.03] whitespace-nowrap pointer-events-none select-none z-0"
      >
        CHERISHED MOMENTS
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[250px]">

          {/* Large Feature Card - Tulips */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: 10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-4 md:row-span-2 rounded-3xl overflow-hidden relative group"
          >
            <motion.img
              src="https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800&auto=format&fit=crop"
              alt="Peonies"
              className="w-full h-full object-cover"
              initial={{ filter: "grayscale(100%)", scale: 1 }}
              whileHover={!isMobile ? { filter: "grayscale(0%)", scale: 1.1 } : undefined}
              whileTap={{ filter: "grayscale(0%)", scale: 1.05 }}
              whileInView={isMobile ? { filter: "grayscale(0%)", scale: 1.05 } : undefined}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.5 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-8 flex flex-col justify-end pointer-events-none">
            </div>
          </motion.div>

          {/* Quote Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="md:col-span-4 bg-white/60 backdrop-blur-sm rounded-3xl p-8 flex flex-col justify-center items-start shadow-sm border border-white/50 hover:shadow-md transition-shadow"
          >
            <span className="text-6xl font-display text-accent leading-none mb-4">"</span>
            <p className="font-display italic text-2xl text-charcoal/80 mb-2">
              "Love is the <span className="text-secondary">flower</span> you've got to let grow."
            </p>
          </motion.div>

          {/* Portrait Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="md:col-span-4 md:row-span-2 bg-[#E5E5E5] rounded-3xl overflow-hidden relative group"
          >
            <motion.img
              src="https://images.unsplash.com/photo-1507290439931-a861b5a38200?q=80&w=800&auto=format&fit=crop"
              alt="Orchid Artistic"
              className="w-full h-full object-cover"
              initial={{ filter: "grayscale(100%)", scale: 1 }}
              whileHover={!isMobile ? { filter: "grayscale(0%)", scale: 1.1 } : undefined}
              whileTap={{ filter: "grayscale(0%)", scale: 1.05 }}
              whileInView={isMobile ? { filter: "grayscale(0%)", scale: 1.05 } : undefined}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>

          {/* Circular CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            onClick={() => setIsGiftOpen(true)}
            className="md:col-span-4 bg-white/60 backdrop-blur-sm rounded-3xl p-8 flex items-center justify-center relative overflow-hidden shadow-sm border border-white/50 group cursor-pointer hover:shadow-xl transition-all"
          >
            <div className="relative z-10 text-center flex flex-col items-center">
              <div className="w-40 h-40 relative flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 w-full h-full border-2 border-dashed border-primary/30 rounded-full"
                />
                <div className="w-24 h-24 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform relative z-10">
                  <Gift className="text-white w-8 h-8" />
                </div>
              </div>
              <h4 className="font-bold text-charcoal text-sm mt-4">Unlock Your<br />Digital Gift</h4>
            </div>

            {/* Background Decor */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-accent/20 rounded-full blur-2xl" />
          </motion.div>

          {/* Orange Box */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="md:col-span-4 bg-[#F97316] rounded-3xl p-8 flex flex-col justify-between text-white relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <span className="text-6xl font-display text-white italic leading-none opacity-50">"</span>
            <p className="font-display italic text-2xl md:text-3xl leading-relaxed text-white">
              <span className="font-bold border-b-2 border-white/30">Where</span> flowers bloom, so does hope.
            </p>
          </motion.div>

          {/* Square Flower */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="md:col-span-4 rounded-3xl overflow-hidden group"
          >
            <motion.img
              src="https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?q=80&w=3270&auto=format&fit=crop"
              alt="Daisies"
              className="w-full h-full object-cover"
              initial={{ filter: "grayscale(100%)", scale: 1 }}
              whileHover={!isMobile ? { filter: "grayscale(0%)", scale: 1.1 } : undefined}
              whileTap={{ filter: "grayscale(0%)", scale: 1.05 }}
              whileInView={isMobile ? { filter: "grayscale(0%)", scale: 1.05 } : undefined}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>

          {/* New Quote Card - Thoreau */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="md:col-span-4 bg-primary rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-sm relative overflow-hidden group min-h-[250px]"
          >
            <div className="absolute inset-0 bg-white/5 opacity-50"></div>
            <p className="font-display italic text-2xl text-white relative z-10 mb-4 leading-relaxed">
              "There is no remedy for love but to love more."
            </p>
            <span className="text-white/80 text-xs tracking-widest uppercase z-10 font-medium opacity-80">— Henry David Thoreau</span>
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, rotateX: 20 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.9, opacity: 0, rotateX: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden max-w-sm w-full shadow-2xl relative border-4 border-primary/20"
            >
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary via-pink-400 to-orange-400" />

              <button
                onClick={() => setIsGiftOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white rounded-full transition-colors backdrop-blur-sm"
              >
                <X className="w-5 h-5 text-white shadow-sm" />
              </button>

              <div className="pt-20 px-8 pb-8 text-center relative">
                <div className="w-24 h-24 mx-auto bg-white rounded-full shadow-xl flex items-center justify-center mb-6 relative z-10">
                  <Gift className="w-10 h-10 text-primary" />
                </div>

                <h3 className="font-display font-bold text-2xl text-charcoal mb-2">Surprise!</h3>
                <p className="text-gray-500 text-sm mb-6">You've unlocked a special digital gift.</p>

                <div className="bg-pink-50 rounded-2xl p-6 border border-pink-100">
                  <p className="font-display italic text-xl text-primary font-bold">
                    "A Lifetime of Love & Adventure"
                  </p>
                  <p className="text-xs text-primary/60 mt-2 uppercase tracking-widest font-bold">Valid Forever</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section >
  );
};
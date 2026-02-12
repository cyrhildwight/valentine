import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { X } from 'lucide-react';
import { variants } from '../../lib/animations';

const blooms = [
  {
    id: 1,
    name: 'The Resilient Rose',
    desc: 'Strength & Passion',
    image: '/images/rose.png',
    message: "Your strength and passion inspire everyone around you. Like a rose, you bloom with resilience and grace, turning every challenge into something beautiful."
  },
  {
    id: 2,
    name: 'The Sunny Wildflower',
    desc: 'Joy & Laughter',
    image: '/images/wildflower.png',
    message: "Your joy is infectious, and your laughter acts as a beacon of light. You are wild, free, and beautifully unique, growing wherever you choose to be."
  },
  {
    id: 3,
    name: 'The Elegant Lily',
    desc: 'Grace & Purity',
    image: '/images/lily.png',
    message: "In a world of noise, your elegance and purity stand out. You carry yourself with a quiet, powerful grace that commands respect and admiration."
  },
  {
    id: 4,
    name: 'The Vivid Lavender',
    desc: 'Peace & Wisdom',
    image: '/images/lavender.png',
    message: "Your wisdom brings peace to those who know you. You are a calming presence in a chaotic world, offering clarity and comfort to all."
  },
];

export const BloomGallery: React.FC = () => {
  const [selectedBloom, setSelectedBloom] = useState<typeof blooms[0] | null>(null);
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Parallax Watermark */}
      <motion.div
        style={{ x }}
        className="absolute top-20 left-0 text-[12rem] leading-none font-display font-bold text-gray-50 opacity-[0.03] whitespace-nowrap pointer-events-none select-none z-0"
      >
        FLORAL SYMPHONY
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={variants.staggerContainer}
          className="mb-16 text-center"
        >
          <motion.h2 variants={variants.fadeInUp} className="text-4xl md:text-5xl font-display italic text-charcoal mb-4">
            Select a Bloom
          </motion.h2>
          <motion.p variants={variants.fadeInUp} className="text-charcoal/60 max-w-lg mx-auto font-body">
            Each flower whispers a unique message of admiration. Which one speaks to her spirit?
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={variants.staggerContainer}
        >
          {blooms.map((bloom) => (
            <motion.div
              key={bloom.id}
              variants={variants.fadeInUp}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedBloom(bloom)}
              className="group relative cursor-pointer"
            >
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-500 relative bg-gray-100 border border-transparent group-hover:border-primary/20">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10" />
                <img
                  src={bloom.image}
                  alt={bloom.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                {/* Glass overlay on hover */}
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-end">
                  <span className="text-white text-sm font-medium tracking-wide border-b border-white pb-1">Select This Bloom</span>
                </div>
              </div>
              <div className="mt-6 text-center">
                <h3 className="font-display font-bold text-xl text-charcoal group-hover:text-primary transition-colors">{bloom.name}</h3>
                <p className="text-xs uppercase tracking-widest text-primary mt-2 font-medium">{bloom.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>

      <AnimatePresence>
        {selectedBloom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBloom(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}

              className="bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl relative border border-white/50"
            >
              <button
                onClick={() => setSelectedBloom(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-white rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-charcoal" />
              </button>

              <div className="flex flex-col md:flex-row h-auto md:h-96">
                <div className="w-full md:w-1/2 relative h-64 md:h-full">
                  <img src={selectedBloom.image} alt={selectedBloom.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white md:hidden">
                    <h3 className="font-display text-2xl font-bold">{selectedBloom.name}</h3>
                  </div>
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center relative">
                  <div className="hidden md:block mb-6">
                    <h3 className="font-display text-3xl font-bold text-charcoal">{selectedBloom.name}</h3>
                    <p className="text-primary uppercase tracking-widest text-xs font-bold mt-1">{selectedBloom.desc}</p>
                  </div>

                  <span className="text-6xl font-display text-primary/10 absolute top-4 right-4">"</span>
                  <p className="text-lg text-charcoal/80 font-body italic leading-relaxed relative z-10">
                    "{selectedBloom.message}"
                  </p>

                  <div className="mt-8">
                    <button
                      onClick={() => setSelectedBloom(null)}
                      className="px-8 py-3 bg-charcoal text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl hover:bg-black transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section >
  );
};
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export const QuoteSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const quote = "A woman is like a tea bag—you never know how strong she is until she gets in hot water.";
  const words = quote.split(" ");

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Decorative Line SVG */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10" xmlns="http://www.w3.org/2000/svg">
        <motion.path 
          d="M0,50 Q400,100 800,50 T1600,50" 
          fill="none" 
          stroke="#E11D48" 
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </svg>

      <div className="container mx-auto px-6 text-center" ref={ref}>
        <div className="max-w-4xl mx-auto">
           <motion.div
             initial={{ scale: 0, opacity: 0 }}
             animate={isInView ? { scale: 1, opacity: 1 } : {}}
             transition={{ type: "spring", stiffness: 200, damping: 20 }}
             className="text-6xl md:text-8xl text-pink-100 font-display font-bold leading-none mb-4 select-none"
           >
             “
           </motion.div>
           
           <h2 className="text-3xl md:text-5xl lg:text-6xl font-display italic text-charcoal leading-tight mb-12">
             {words.map((word, i) => (
               <motion.span
                 key={i}
                 initial={{ opacity: 0, y: 20 }}
                 animate={isInView ? { opacity: 1, y: 0 } : {}}
                 transition={{ delay: i * 0.05, duration: 0.6 }}
                 className="inline-block mr-3"
               >
                 {word}
               </motion.span>
             ))}
           </h2>

           <motion.div
             initial={{ opacity: 0, width: 0 }}
             animate={isInView ? { opacity: 1, width: "100px" } : {}}
             transition={{ delay: 1, duration: 0.8 }}
             className="h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"
           />

           <motion.p
             initial={{ opacity: 0 }}
             animate={isInView ? { opacity: 1 } : {}}
             transition={{ delay: 1.2, duration: 0.8 }}
             className="text-sm font-bold tracking-[0.2em] uppercase text-charcoal/60"
           >
             Eleanor Roosevelt
           </motion.p>
        </div>
      </div>
    </section>
  );
};
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface QuoteSectionProps {
  theme: 'light' | 'dark';
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({ theme }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const quote = "I love you without knowing how, or when, or from where. I love you simply, without problems or pride.";
  const words = quote.split(" ");

  return (
    <section className="py-32 bg-cream dark:bg-[#0a0506] relative overflow-hidden transition-colors duration-300">
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="bg-[#faf6f0] border-t-8 border-primary border border-charcoal/10 rounded-2xl shadow-xl p-10 md:p-16 max-w-3xl mx-auto relative overflow-hidden"
        >
          {/* Typewriter top roller bar representation */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-charcoal/5" />
          
          <div className="text-2xl md:text-3xl text-charcoal/25 font-typewriter absolute top-4 left-6 select-none font-bold">
            TYPEWRITER NOTE
          </div>

          <h2 className="font-typewriter text-xl md:text-3xl text-zinc-800 leading-relaxed mb-8 text-left border-l-2 border-primary pl-6 mt-8">
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: i * 0.06, duration: 0.15 }}
                className="inline-block mr-2"
              >
                {word}
              </motion.span>
            ))}
          </h2>

          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={isInView ? { opacity: 1, width: "120px" } : {}}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="h-0.5 bg-zinc-800/20 ml-6 mb-4"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="text-sm font-typewriter tracking-[0.1em] text-zinc-600 text-left ml-6"
          >
            — Pablo Neruda
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};
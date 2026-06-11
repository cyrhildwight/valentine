import React from 'react';
import { motion } from 'framer-motion';
import { PenTool, ShieldCheck, Send } from 'lucide-react';
import { variants } from '../../lib/animations';

const steps = [
  {
    id: '01',
    icon: <PenTool className="w-6 h-6 text-primary" />,
    title: 'Compose Your Letter',
    desc: 'Pour your feelings out. Customize the note with a handwriting font and beautiful themes like Vintage Cream or Neon Heart.',
  },
  {
    id: '02',
    icon: <ShieldCheck className="w-6 h-6 text-secondary" />,
    title: 'Seal Anonymously',
    desc: 'Specify the recipient\'s name and email. Choose a custom code name, pseudonym, or stay completely anonymous. Your identity is fully protected.',
  },
  {
    id: '03',
    icon: <Send className="w-6 h-6 text-amber-500" />,
    title: 'Deliver the Whisper',
    desc: 'Click send, and our system packages it as a digital sealed envelope. We deliver the letter directly to their inbox instantly via EmailJS.',
  },
];

interface HowItWorksProps {
  theme: 'light' | 'dark';
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ theme }) => {
  return (
    <section id="how-it-works" className="py-24 bg-[#fff0f2] dark:bg-dark relative overflow-hidden border-t border-primary/10 dark:border-white/5 transition-colors duration-300">
      {/* Decorative background grid line */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-y-1/2 hidden lg:block z-0" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={variants.staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={variants.fadeInUp} className="text-4xl md:text-5xl font-display font-extrabold tracking-tight text-charcoal dark:text-white mb-4 uppercase">
            How it Works
          </motion.h2>
          <motion.p variants={variants.fadeInUp} className="text-charcoal/60 dark:text-gray-400 max-w-lg mx-auto font-body text-sm md:text-base">
            Sending a whisper of love is simple, safe, and completely secure. Follow these three steps.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={variants.staggerContainer}
        >
          {steps.map((step) => (
            <motion.div
              key={step.id}
              variants={variants.fadeInUp}
              whileHover={{ y: -8 }}
              className="bg-white/70 dark:bg-[#12090b]/80 border border-primary/5 dark:border-white/5 shadow-xl hover:border-primary/20 hover:bg-white dark:hover:bg-[#181113] p-8 rounded-3xl transition-all duration-300 relative group flex flex-col items-center text-center"
            >
              {/* Floating Step Number */}
              <div className="absolute top-4 right-6 text-4xl font-display font-extrabold text-charcoal/5 dark:text-white/10 group-hover:text-primary/20 dark:group-hover:text-primary/25 transition-colors">
                {step.id}
              </div>

              {/* Icon container */}
              <div className="w-14 h-14 rounded-full bg-primary/5 dark:bg-white/5 border border-primary/10 dark:border-white/10 flex items-center justify-center shadow-md mb-6 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>

              <h3 className="font-display font-bold text-xl text-charcoal dark:text-white mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-charcoal/60 dark:text-gray-400 leading-relaxed max-w-xs font-body">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

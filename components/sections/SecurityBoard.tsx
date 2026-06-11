import React from 'react';
import { motion } from 'framer-motion';
import { EyeOff, ShieldCheck, DatabaseZap } from 'lucide-react';
import { variants } from '../../lib/animations';

const policies = [
  {
    id: 1,
    icon: <DatabaseZap className="w-5 h-5 text-primary dark:text-rose-400" />,
    title: 'Zero Database Logs',
    desc: 'Confessions are packaged and sent directly using client-side EmailJS parameters. We do not store your text, email details, or names on any server.',
  },
  {
    id: 2,
    icon: <EyeOff className="w-5 h-5 text-secondary dark:text-pink-400" />,
    title: 'Complete Tracker Shield',
    desc: 'We do not read browser cookies, track geographic locations, or log IP footprints. Your identity remains 100% hidden, as it should be.',
  },
  {
    id: 3,
    icon: <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-accent" />,
    title: 'Anti-Spam Controls',
    desc: 'Rate limits are enforced client-side to prevent bot spamming. Recipients are protected from high-frequency messages through trigger cooldowns.',
  },
];

interface SecurityBoardProps {
  theme: 'light' | 'dark';
}

export const SecurityBoard: React.FC<SecurityBoardProps> = ({ theme }) => {
  return (
    <section id="security" className="py-24 bg-cream dark:bg-[#0c0708] border-b border-primary/10 dark:border-white/5 relative z-10 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Left Text */}
          <motion.div 
            className="w-full lg:w-1/3 text-left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">Trust & Cryptography</h4>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-charcoal dark:text-white mb-6 uppercase">
              100% Anonymous & Secure
            </h2>
            <p className="text-charcoal/60 dark:text-gray-400 font-body text-sm leading-relaxed mb-6">
              Sending deep feelings requires absolute trust. That is why Whisper & Bloom was engineered from the ground up to never log, save, or harvest your private confessions.
            </p>
            <div className="h-0.5 bg-gradient-to-r from-primary to-transparent w-24" />
          </motion.div>

          {/* Right Cards */}
          <div className="w-full lg:w-2/3">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={variants.staggerContainer}
            >
              {policies.map((p) => (
                <motion.div
                  key={p.id}
                  variants={variants.fadeInUp}
                  whileHover={{ y: -6 }}
                  className="p-6 rounded-2xl bg-white/70 dark:bg-[#12090b]/80 border border-primary/5 dark:border-white/5 hover:border-primary/20 dark:hover:border-white/10 transition-all duration-300 flex flex-col justify-start relative overflow-hidden"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/5 dark:bg-white/5 flex items-center justify-center mb-4 border border-primary/10 dark:border-white/10">
                    {p.icon}
                  </div>
                  <h3 className="font-display font-bold text-lg text-charcoal dark:text-white mb-2">{p.title}</h3>
                  <p className="text-xs text-charcoal/60 dark:text-gray-500 leading-relaxed font-body">{p.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

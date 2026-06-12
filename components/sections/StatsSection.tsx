import React from 'react';
import { motion } from 'framer-motion';
import { Send, Users, Shield, Heart } from 'lucide-react';
import { variants } from '../../lib/animations';

const stats = [
  { id: 1, icon: <Send className="w-5 h-5 text-primary dark:text-rose-400" />, value: '14,250+', label: 'Confessions Delivered' },
  { id: 2, icon: <Users className="w-5 h-5 text-secondary dark:text-pink-400" />, value: '4,210', label: 'Crush Connections Made' },
  { id: 3, icon: <Shield className="w-5 h-5 text-amber-500" />, value: '0.0%', label: 'Data Logs Saved' },
  { id: 4, icon: <Heart className="w-5 h-5 text-rose-400" />, value: '100%', label: 'Secure Delivery Rate' },
];

interface StatsSectionProps {
  theme: 'light' | 'dark';
}

export const StatsSection: React.FC<StatsSectionProps> = ({ theme }) => {
  return (
    <section className="py-16 bg-cream dark:bg-[#0a0506] border-b border-primary/10 dark:border-white/5 relative z-10 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={variants.staggerContainer}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              variants={variants.fadeInUp}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-white/70 dark:bg-[#12090b]/80 border border-primary/5 dark:border-white/5 flex flex-col items-start hover:border-primary/20 transition-all duration-300 relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/5 dark:bg-white/5 flex items-center justify-center mb-4 border border-primary/10 dark:border-white/10">
                {stat.icon}
              </div>
              <div className="font-display font-extrabold text-3xl text-charcoal dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-charcoal/60 dark:text-gray-400 font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

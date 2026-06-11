import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { variants } from '../../lib/animations';

const faqs = [
  {
    id: 1,
    question: 'Is it truly anonymous?',
    answer: 'Yes, completely. We do not store your name, email, IP address, or messages. The letter is routed directly through EmailJS client credentials and dispatched into their inbox. You can type any name/pseudonym, or leave it blank to default to "Anonymous".',
  },
  {
    id: 2,
    question: 'How does the recipient receive my letter?',
    answer: 'The recipient will receive an HTML email containing your styled confession postcard. It will present your typed text, pseudonym, and custom theme (such as Vintage Cream or Neon Heart) formatted as a digital sealed note.',
  },
  {
    id: 3,
    question: 'Can I delete or retrieve a sent confession?',
    answer: 'Because we run a serverless, zero-log platform, we do not store your data. This means we have no database to look up or delete confessions. Once sent, your secret is delivered and cannot be recalled.',
  },
  {
    id: 4,
    question: 'Is there a limit on letters I can send?',
    answer: 'To prevent harassment and abuse, client-side rate limits are enforced. You will experience a short cooldown after sending a message to prevent automated scripts from spamming inboxes.',
  },
];

interface FAQAccordionProps {
  theme: 'light' | 'dark';
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ theme }) => {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 bg-[#fff0f2] dark:bg-[#0a0506] relative z-10 transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-3xl">
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={variants.staggerContainer}
          className="text-center mb-16"
        >
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">Help Center</h4>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-charcoal dark:text-white mb-4 uppercase">
            Frequently Asked Questions
          </h2>
          <p className="text-charcoal/60 dark:text-gray-400 font-body text-sm">
            Everything you need to know about anonymous letter customisation and delivery security.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white/70 dark:bg-[#12090b]/60 border border-primary/5 dark:border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/20 dark:hover:border-white/10"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-display font-semibold text-charcoal dark:text-white text-base md:text-lg">
                    {faq.question}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-primary/5 dark:bg-white/5 border border-primary/10 dark:border-white/10 flex items-center justify-center flex-shrink-0 ml-4">
                    {isOpen ? (
                      <Minus className="w-3 h-3 text-primary dark:text-rose-400" />
                    ) : (
                      <Plus className="w-3 h-3 text-primary dark:text-rose-400" />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-5 pt-1 border-t border-primary/5 dark:border-white/5 text-charcoal/70 dark:text-gray-400 text-sm leading-relaxed font-body">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

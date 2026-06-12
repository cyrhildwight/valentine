import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { X, MessageSquare } from 'lucide-react';
import { variants } from '../../lib/animations';

const confessions = [
  {
    id: 1,
    to: 'To: My Best Friend',
    from: 'From: A Secret Admirer',
    desc: 'Passionate & True',
    color: 'border-rose-500/20 shadow-[0_4px_25px_rgba(244,63,94,0.05)] hover:border-rose-500/50 hover:shadow-[0_4px_30px_rgba(244,63,94,0.2)]',
    badge: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    rotation: -2.5,
    message: "I've been in love with you for as long as I can remember. Seeing you laugh is the best part of my day, and I hope one day I have the courage to tell you myself. You make my world complete."
  },
  {
    id: 2,
    to: 'To: The Girl in my CS class',
    from: 'From: Someone in the Back Row',
    desc: 'Joy & Laughter',
    color: 'border-pink-500/20 shadow-[0_4px_25px_rgba(236,72,153,0.05)] hover:border-pink-500/50 hover:shadow-[0_4px_30px_rgba(236,72,153,0.2)]',
    badge: 'bg-pink-500/10 text-pink-400 border border-pink-500/20',
    rotation: 2,
    message: "You make me laugh like nobody else can. Your bright energy is infectious, and my heart does flips whenever you sit near me. You make this stressful class so much happier."
  },
  {
    id: 3,
    to: 'To: The Barista at French Cafe',
    from: 'From: The Latte Lover',
    desc: 'Quiet Admiration',
    color: 'border-purple-500/20 shadow-[0_4px_25px_rgba(168,85,247,0.05)] hover:border-purple-500/50 hover:shadow-[0_4px_30px_rgba(168,85,247,0.2)]',
    badge: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    rotation: -1.5,
    message: "I admire your kindness, your intelligence, and the gentle way you carry yourself. You deserve all the beauty in the world, and I'm so grateful you exist. Keep shining."
  },
  {
    id: 4,
    to: 'To: The Quiet Soul',
    from: 'From: A Safe Harbor',
    desc: 'Devoted Comfort',
    color: 'border-amber-500/20 shadow-[0_4px_25px_rgba(245,158,11,0.05)] hover:border-amber-500/50 hover:shadow-[0_4px_30px_rgba(245,158,11,0.2)]',
    badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    rotation: 3.5,
    message: "You are my safe space, a calm in every storm. Even if you never know this confession is from me, please know that you are deeply loved, cherished, and valued."
  },
];

interface BloomGalleryProps {
  theme: 'light' | 'dark';
}

export const BloomGallery: React.FC<BloomGalleryProps> = ({ theme }) => {
  const [selectedConfession, setSelectedConfession] = useState<typeof confessions[0] | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const { scrollYProgress: boardScrollProgress } = useScroll({
    target: boardRef,
    offset: ["start end", "end start"]
  });

  const smoothBoardProgress = useSpring(boardScrollProgress, { stiffness: 90, damping: 25 });
  const y1 = useTransform(smoothBoardProgress, [0, 1], [30, -30]);
  const y2 = useTransform(smoothBoardProgress, [0, 1], [-20, 20]);
  const y3 = useTransform(smoothBoardProgress, [0, 1], [40, -40]);
  const y4 = useTransform(smoothBoardProgress, [0, 1], [-30, 30]);
  const yOffsets = [y1, y2, y3, y4];

  const getCardStyle = (id: number) => {
    if (theme === 'light') {
      switch (id) {
        case 1:
          return 'bg-rose-100/95 border-rose-200 text-charcoal shadow-[0_4px_10px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:rotate-0';
        case 2:
          return 'bg-amber-100/95 border-amber-200 text-charcoal shadow-[0_4px_10px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:rotate-0';
        case 3:
          return 'bg-teal-50/95 border-teal-200 text-charcoal shadow-[0_4px_10px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:rotate-0';
        case 4:
        default:
          return 'bg-sky-100/95 border-sky-200 text-charcoal shadow-[0_4px_10px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:rotate-0';
      }
    } else {
      switch (id) {
        case 1:
          return 'bg-[#12090b]/80 border-rose-500/20 text-gray-200 shadow-[0_4px_25px_rgba(244,63,94,0.05)] hover:border-rose-500/50 hover:shadow-[0_4px_30px_rgba(244,63,94,0.2)]';
        case 2:
          return 'bg-[#12090b]/80 border-pink-500/20 text-gray-200 shadow-[0_4px_25px_rgba(236,72,153,0.05)] hover:border-pink-500/50 hover:shadow-[0_4px_30px_rgba(236,72,153,0.2)]';
        case 3:
          return 'bg-[#12090b]/80 border-purple-500/20 text-gray-200 shadow-[0_4px_25px_rgba(168,85,247,0.05)] hover:border-purple-500/50 hover:shadow-[0_4px_30px_rgba(168,85,247,0.2)]';
        case 4:
        default:
          return 'bg-[#12090b]/80 border-amber-500/20 text-gray-200 shadow-[0_4px_25px_rgba(245,158,11,0.05)] hover:border-amber-500/50 hover:shadow-[0_4px_30px_rgba(245,158,11,0.2)]';
      }
    }
  };

  const getBadgeStyle = (id: number) => {
    if (theme === 'light') {
      switch (id) {
        case 1: return 'bg-rose-200 text-rose-800 border border-rose-300';
        case 2: return 'bg-pink-200 text-pink-800 border border-pink-300';
        case 3: return 'bg-purple-200 text-purple-800 border border-purple-300';
        case 4: default: return 'bg-amber-200 text-amber-800 border border-amber-300';
      }
    } else {
      switch (id) {
        case 1: return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
        case 2: return 'bg-pink-500/10 text-pink-400 border border-pink-500/20';
        case 3: return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
        case 4: default: return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      }
    }
  };

  const getModalStyle = () => {
    if (theme === 'light') {
      return {
        card: 'bg-[#fdfbf7] border-4 border-double border-amber-900/30 text-charcoal',
        text: 'text-charcoal',
        quote: 'text-charcoal/90',
        decor: 'text-charcoal/30',
        divider: 'border-amber-900/20',
        btn: 'bg-[#b45309] hover:bg-[#92400e] text-white'
      };
    } else {
      return {
        card: 'bg-[#12090b] border-y-4 border-primary border-l border-r border-white/5 text-white',
        text: 'text-white',
        quote: 'text-pink-100/90',
        decor: 'text-gray-500',
        divider: 'border-white/5',
        btn: 'bg-gradient-to-r from-primary to-secondary text-white'
      };
    }
  };

  const modalStyles = getModalStyle();

  return (
    <section className="py-24 bg-cream dark:bg-[#0c0708] border-t border-b border-primary/10 dark:border-white/5 relative overflow-hidden transition-colors duration-300">
      {/* Centered Parallax Watermark */}
      <div className="absolute top-20 left-0 right-0 flex justify-center pointer-events-none select-none z-0 overflow-hidden">
        <motion.div
          style={{ x }}
          className="text-[12rem] leading-none font-display font-black text-charcoal/[0.02] dark:text-white/[0.01] whitespace-nowrap"
        >
          CONFESSIONS
        </motion.div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={variants.staggerContainer}
          className="mb-16 text-center"
        >
          <motion.h2 variants={variants.fadeInUp} className="text-4xl md:text-5xl font-display font-extrabold tracking-tight text-charcoal dark:text-white mb-4 uppercase">
            Confession Board
          </motion.h2>
          <motion.p variants={variants.fadeInUp} className="text-charcoal/60 dark:text-gray-400 max-w-lg mx-auto font-body text-sm md:text-base">
            Read through some of the heartfelt whispers pinned to our wall. Click any card to unfold the complete message.
          </motion.p>
        </motion.div>

        {/* Board Panel */}
        <div ref={boardRef} className={`${theme === 'light' ? 'cork-board' : 'obsidian-panel'} rounded-3xl p-6 md:p-10 transition-all duration-300`}>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={variants.staggerContainer}
          >
            {confessions.map((conf, index) => (
              <motion.div
                key={conf.id}
                variants={variants.fadeInUp}
                whileHover={{ scale: 1.03, rotate: 0, zIndex: 10 }}
                onClick={() => setSelectedConfession(conf)}
                className={`relative p-6 rounded-2xl border cursor-pointer aspect-square flex flex-col justify-between select-none transition-all duration-300 group ${getCardStyle(conf.id)}`}
                style={{ rotate: `${conf.rotation}deg`, y: isMobile ? 0 : yOffsets[index] }}
              >
                {/* Push Pin decoration for light mode */}
                {theme === 'light' && <div className="push-pin" />}

                <div className="pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-display font-semibold text-xs tracking-wider opacity-90">{conf.to}</h4>
                    <MessageSquare className="w-3.5 h-3.5 opacity-60" />
                  </div>
                  <p className="font-handwriting text-2xl leading-snug mt-2 line-clamp-4 italic">
                    "{conf.message}"
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-3">
                  <span className="font-handwriting text-lg text-primary">{conf.from}</span>
                  <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold transition-colors ${getBadgeStyle(conf.id)}`}>
                    {conf.desc.split(' ')[0]}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>

      <AnimatePresence>
        {selectedConfession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedConfession(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl relative p-10 flex flex-col justify-center transition-all duration-300 ${modalStyles.card}`}
            >
              {/* Postcard Decor */}
              <div className={`absolute top-4 left-4 text-[9px] tracking-[0.2em] font-mono uppercase font-bold ${modalStyles.decor}`}>CONFESSION NOTE</div>
              <button
                onClick={() => setSelectedConfession(null)}
                className="absolute top-4 right-4 z-10 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5 opacity-60 hover:opacity-100" />
              </button>

              <div className={`mb-4 pb-3 border-b border-dashed mt-4 ${modalStyles.divider}`}>
                <div className="font-display font-bold text-sm tracking-wider text-primary uppercase">{selectedConfession.to}</div>
                <div className={`text-[10px] mt-0.5 opacity-60`}>{selectedConfession.desc}</div>
              </div>

              <div className="relative py-4">
                <span className="text-7xl font-display text-primary/10 absolute -top-8 -left-4 font-bold select-none">“</span>
                <p className={`font-handwriting text-3xl leading-relaxed italic relative z-10 pl-4 ${modalStyles.quote}`}>
                  {selectedConfession.message}
                </p>
              </div>

              <div className={`mt-8 flex justify-between items-center border-t border-dashed pt-4 ${modalStyles.divider}`}>
                <span className="font-handwriting text-2xl text-primary font-bold">{selectedConfession.from}</span>
                <button
                  onClick={() => setSelectedConfession(null)}
                  className={`px-6 py-2 rounded-full text-xs font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all ${modalStyles.btn}`}
                >
                  Close Letter
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section >
  );
};
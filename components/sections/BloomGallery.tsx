import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { X, MessageSquare, Heart, Mail, Trash2 } from 'lucide-react';
import { variants } from '../../lib/animations';
import { PublicConfession } from '../../lib/confessionStore';

interface BloomGalleryProps {
  theme: 'light' | 'dark';
  confessions: PublicConfession[];
  isAdmin: boolean;
  onDeleteConfession: (id: string) => void;
}

export const BloomGallery: React.FC<BloomGalleryProps> = ({ theme, confessions, isAdmin, onDeleteConfession }) => {
  const [selectedConfession, setSelectedConfession] = useState<PublicConfession | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress: boardScrollProgress } = useScroll({
    target: boardRef,
    offset: ["start end", "end start"]
  });

  const smoothBoardProgress = useSpring(boardScrollProgress, { stiffness: 90, damping: 25 });
  
  // Center the watermark horizontally when the section is centered in the viewport
  const x = useTransform(smoothBoardProgress, [0, 0.5, 1], [120, 0, -120]);

  const y1 = useTransform(smoothBoardProgress, [0, 1], [30, -30]);
  const y2 = useTransform(smoothBoardProgress, [0, 1], [-20, 20]);
  const y3 = useTransform(smoothBoardProgress, [0, 1], [40, -40]);
  const y4 = useTransform(smoothBoardProgress, [0, 1], [-30, 30]);
  const yOffsets = [y1, y2, y3, y4];

  const getCardStyle = (cardTheme: 'vintage' | 'neon' | 'midnight') => {
    if (theme === 'light') {
      switch (cardTheme) {
        case 'neon':
          return 'bg-rose-50/95 border-rose-200 text-charcoal shadow-[0_4px_10px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_20px_rgba(244,63,94,0.1)] hover:rotate-0';
        case 'midnight':
          return 'bg-purple-50/95 border-purple-200 text-charcoal shadow-[0_4px_10px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_20px_rgba(168,85,247,0.1)] hover:rotate-0';
        case 'vintage':
        default:
          return 'bg-[#fdfbf7] border-amber-900/20 text-charcoal shadow-[0_4px_10px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_20px_rgba(120,53,4,0.1)] hover:rotate-0';
      }
    } else {
      switch (cardTheme) {
        case 'neon':
          return 'bg-zinc-950 border-rose-500/20 text-rose-100 shadow-[0_4px_25px_rgba(244,63,94,0.05)] hover:border-rose-500/50 hover:shadow-[0_4px_30px_rgba(244,63,94,0.25)]';
        case 'midnight':
          return 'bg-[#120408]/90 border-amber-500/20 text-pink-100 shadow-[0_4px_25px_rgba(217,119,6,0.05)] hover:border-amber-500/50 hover:shadow-[0_4px_30px_rgba(217,119,6,0.2)]';
        case 'vintage':
        default:
          return 'bg-[#12090b]/80 border-amber-900/10 text-gray-200 shadow-[0_4px_25px_rgba(0,0,0,0.3)] hover:border-rose-950/40 hover:shadow-[0_4px_30px_rgba(0,0,0,0.5)]';
      }
    }
  };

  const getBadgeStyle = (cardTheme: 'vintage' | 'neon' | 'midnight') => {
    if (theme === 'light') {
      switch (cardTheme) {
        case 'neon': return 'bg-rose-200 text-rose-800 border border-rose-300';
        case 'midnight': return 'bg-purple-200 text-purple-800 border border-purple-300';
        case 'vintage': default: return 'bg-amber-200 text-amber-800 border border-amber-300';
      }
    } else {
      switch (cardTheme) {
        case 'neon': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
        case 'midnight': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
        case 'vintage': default: return 'bg-rose-950/60 border-rose-500/20 text-rose-300';
      }
    }
  };

  const getModalStyle = () => {
    if (theme === 'light') {
      return {
        overlay: 'bg-black/70 backdrop-blur-lg',
        wrapper: 'bg-gradient-to-b from-[#fff8f8] to-[#fdf0f2] border border-rose-200/60 shadow-[0_40px_80px_rgba(0,0,0,0.25),0_0_0_1px_rgba(244,63,94,0.08)]',
        envelopeFlap: 'from-rose-200 via-pink-100 to-amber-100',
        headerBg: 'from-rose-400 via-pink-400 to-rose-500',
        iconRing: 'bg-white/90 shadow-[0_0_0_4px_rgba(244,63,94,0.15),0_8px_20px_rgba(0,0,0,0.15)]',
        iconColor: 'text-primary',
        titleColor: 'text-charcoal',
        subtitleColor: 'text-charcoal/50',
        quoteColor: 'text-charcoal/85',
        quoteGlyph: 'text-primary/20',
        divider: 'border-rose-200/60',
        fromBadge: 'bg-rose-50 border-rose-200 text-primary',
        sealBg: 'bg-gradient-to-br from-rose-500 to-pink-600 shadow-[0_4px_15px_rgba(244,63,94,0.4)]',
        closeBtn: 'bg-rose-50 hover:bg-rose-100 text-charcoal/60 hover:text-charcoal',
        closeBtnFull: 'bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:shadow-[0_8px_20px_rgba(244,63,94,0.4)] hover:scale-[1.02]',
        lineDecor: 'bg-rose-200/60',
        tagBg: 'bg-rose-100 text-rose-700 border-rose-200'
      };
    } else {
      return {
        overlay: 'bg-black/85 backdrop-blur-xl',
        wrapper: 'bg-[#0f0508] border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.7),0_0_60px_rgba(244,63,94,0.08),0_0_0_1px_rgba(255,255,255,0.03)]',
        envelopeFlap: 'from-[#1f0b10] via-[#2a0d14] to-[#1a0a0d]',
        headerBg: 'from-rose-900/60 via-pink-950/40 to-transparent',
        iconRing: 'bg-[#1a0810] shadow-[0_0_0_4px_rgba(244,63,94,0.15),0_0_30px_rgba(244,63,94,0.3),0_8px_20px_rgba(0,0,0,0.5)]',
        iconColor: 'text-rose-400',
        titleColor: 'text-white',
        subtitleColor: 'text-gray-500',
        quoteColor: 'text-pink-100/90',
        quoteGlyph: 'text-rose-500/15',
        divider: 'border-white/5',
        fromBadge: 'bg-rose-950/60 border-rose-500/20 text-rose-300',
        sealBg: 'bg-gradient-to-br from-rose-500 to-pink-600 shadow-[0_4px_25px_rgba(244,63,94,0.6),0_0_40px_rgba(244,63,94,0.2)]',
        closeBtn: 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white',
        closeBtnFull: 'bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:shadow-[0_8px_30px_rgba(244,63,94,0.5)] hover:scale-[1.02]',
        lineDecor: 'bg-white/5',
        tagBg: 'bg-rose-950/40 text-rose-400 border-rose-500/20'
      };
    }
  };

  const modalStyles = getModalStyle();
  const displayedConfessions = showAll ? confessions : confessions.slice(0, 8);

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
          <motion.h2 variants={variants.fadeInUp} className="text-4xl md:text-5xl font-display font-extrabold tracking-tight text-charcoal dark:text-white mb-4 uppercase flex items-center justify-center gap-3 flex-wrap">
            <span>Confession Board</span>
            {isAdmin && (
              <span className="text-[10px] bg-primary/20 dark:bg-rose-500/20 text-primary dark:text-rose-400 border border-primary/30 dark:border-rose-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider font-display">
                Admin Active
              </span>
            )}
          </motion.h2>
          <motion.p variants={variants.fadeInUp} className="text-charcoal/60 dark:text-gray-400 max-w-lg mx-auto font-body text-sm md:text-base">
            Read through some of the heartfelt whispers pinned to our wall. Click any card to unfold the complete message.
          </motion.p>
        </motion.div>

        {/* Board Panel */}
        <div ref={boardRef} className={`${theme === 'light' ? 'cork-board' : 'obsidian-panel'} rounded-3xl p-6 md:p-10 transition-all duration-300`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {displayedConfessions.map((conf, index) => (
                <motion.div
                  key={conf.id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ 
                    duration: 0.6, 
                    ease: "easeOut",
                    delay: isMobile ? 0 : (index % 4) * 0.1 
                  }}
                  whileHover={{ scale: 1.03, rotate: 0, zIndex: 10 }}
                  onClick={() => setSelectedConfession(conf)}
                  className={`relative p-6 rounded-2xl border cursor-pointer aspect-square flex flex-col justify-between select-none transition-all duration-300 group ${getCardStyle(conf.theme)}`}
                  style={{ rotate: `${conf.rotation}deg`, y: isMobile ? 0 : yOffsets[index % 4] }}
                >
                  {/* Push Pin decoration for light mode */}
                  {theme === 'light' && <div className="push-pin" />}

                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-display font-semibold text-xs tracking-wider opacity-90">{conf.to}</h4>
                      {isAdmin ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Are you sure you want to delete the confession to ${conf.to}?`)) {
                              onDeleteConfession(conf.id);
                            }
                          }}
                          className="p-1 rounded-md text-primary dark:text-rose-400 hover:bg-primary/10 dark:hover:bg-white/10 hover:scale-110 active:scale-95 transition-all z-20"
                          title="Delete confession"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <MessageSquare className="w-3.5 h-3.5 opacity-60" />
                      )}
                    </div>
                    <p className="font-handwriting text-2xl leading-snug mt-2 line-clamp-4 italic">
                      "{conf.message}"
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-3">
                    <span className="font-handwriting text-lg text-primary">{conf.from}</span>
                    <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold transition-colors ${getBadgeStyle(conf.theme)}`}>
                      {conf.desc.split(' ')[0]}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {confessions.length > 8 && (
          <div className="flex justify-center mt-12 relative z-20">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-white/70 dark:bg-[#12090b]/80 border border-primary/20 dark:border-white/10 text-primary dark:text-rose-300 px-6 py-2.5 rounded-full text-sm font-semibold hover:border-primary/40 dark:hover:border-white/20 transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              {showAll ? 'Show Fewer Confessions' : 'View All Confessions'}
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedConfession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelectedConfession(null)}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${modalStyles.overlay}`}
          >
            {/* Floating ambient glow */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative rounded-3xl overflow-hidden max-w-md w-full transition-colors duration-300 ${modalStyles.wrapper}`}
            >
              {/* Header gradient band */}
              <div className={`relative w-full h-32 bg-gradient-to-b ${modalStyles.headerBg} flex items-end justify-center pb-0`}>
                {/* Decorative lines */}
                <div className="absolute top-5 left-6 flex gap-1.5">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={`h-0.5 rounded-full ${modalStyles.lineDecor}`} style={{ width: `${20 - i * 5}px` }} />
                  ))}
                </div>
                <div className="absolute top-5 right-6 flex gap-1.5">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={`h-0.5 rounded-full ${modalStyles.lineDecor}`} style={{ width: `${10 + i * 5}px` }} />
                  ))}
                </div>

                {/* Small label */}
                <div className={`absolute top-5 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.3em] font-mono font-bold uppercase ${modalStyles.subtitleColor}`}>
                  A RANDOM WHISPER
                </div>

                {/* Floating envelope icon */}
                <motion.div
                  initial={{ y: 10, scale: 0.7, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, type: 'spring', damping: 18, stiffness: 260 }}
                  className={`w-14 h-14 rounded-full flex items-center justify-center absolute -bottom-7 left-1/2 -translate-x-1/2 ${modalStyles.iconRing}`}
                >
                  <Mail className={`w-6 h-6 ${modalStyles.iconColor}`} strokeWidth={1.5} />
                </motion.div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setSelectedConfession(null)}
                className={`absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full transition-all ${modalStyles.closeBtn}`}
              >
                <X className="w-4 h-4" strokeWidth={2.5} />
              </button>

              {/* Body */}
              <div className="px-8 pt-12 pb-8 flex flex-col gap-5">

                {/* To/From header */}
                <div className="text-center">
                  <motion.h3
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`font-display font-bold text-lg tracking-tight ${modalStyles.titleColor}`}
                  >
                    {selectedConfession.to}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.28 }}
                    className={`text-[10px] uppercase tracking-[0.2em] font-semibold mt-0.5 ${modalStyles.subtitleColor}`}
                  >
                    {selectedConfession.desc}
                  </motion.p>
                </div>

                {/* Divider */}
                <div className={`flex items-center gap-3`}>
                  <div className={`flex-1 h-px ${modalStyles.lineDecor}`} />
                  <Heart className="w-3 h-3 text-rose-400 fill-rose-400 opacity-60" />
                  <div className={`flex-1 h-px ${modalStyles.lineDecor}`} />
                </div>

                {/* Quote body */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative px-2"
                >
                  <span className={`absolute -top-5 -left-1 text-8xl leading-none font-serif select-none pointer-events-none ${modalStyles.quoteGlyph}`}>&ldquo;</span>
                  <p className={`font-handwriting text-[1.4rem] leading-relaxed italic relative z-10 text-center ${modalStyles.quoteColor}`}>
                    {selectedConfession.message}
                  </p>
                  <span className={`absolute -bottom-8 -right-1 text-8xl leading-none font-serif select-none pointer-events-none ${modalStyles.quoteGlyph}`}>&rdquo;</span>
                </motion.div>

                {/* Divider */}
                <div className={`flex items-center gap-3 mt-2`}>
                  <div className={`flex-1 h-px ${modalStyles.lineDecor}`} />
                  <Heart className="w-3 h-3 text-rose-400 fill-rose-400 opacity-60" />
                  <div className={`flex-1 h-px ${modalStyles.lineDecor}`} />
                </div>

                {/* Sender badge + tag row */}
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38 }}
                  className="flex items-center justify-between"
                >
                  {/* Wax seal + from name */}
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${modalStyles.sealBg}`}>
                      ♥
                    </div>
                    <div className={`px-3 py-1.5 rounded-full border text-[11px] font-semibold font-handwriting text-lg leading-none ${modalStyles.fromBadge}`}>
                      {selectedConfession.from}
                    </div>
                  </div>

                  {/* Tag */}
                  <span className={`text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full border font-bold ${modalStyles.tagBg}`}>
                    {selectedConfession.desc.split(' ')[0]}
                  </span>
                </motion.div>

                {/* Close button full */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  onClick={() => setSelectedConfession(null)}
                  className={`w-full mt-1 py-3 rounded-2xl text-sm font-semibold tracking-wide transition-all active:scale-[0.98] ${modalStyles.closeBtnFull}`}
                >
                  Seal & Close Letter
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section >
  );
};
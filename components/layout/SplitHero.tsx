import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion';
import { variants } from '../../lib/animations';
import { FloatingLetters } from '../animations/FallingPetals';
import { MagneticButton } from '../animations/MagneticButton';
import { ArrowRight } from 'lucide-react';

interface SplitHeroProps {
  setIsModalOpen: (isOpen: boolean) => void;
  theme: 'light' | 'dark';
}

const typingWords = [
  "a confession to your secret crush...",
  "a quiet word for your best friend...",
  "a hidden message of adoration...",
  "an unspoken thought of appreciation..."
];

export const SplitHero: React.FC<SplitHeroProps> = ({ setIsModalOpen, theme }) => {
  // Parallax Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Typewriter effect state
  const [wordIdx, setWordIdx] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(100);

  // Smooth spring animation for parallax
  const springConfig = { stiffness: 40, damping: 20 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const { scrollY } = useScroll();
  const yScroll = useTransform(scrollY, [0, 1000], [0, 200]);
  const combinedY = useTransform([mouseY, yScroll], (values) => {
    const mouse = values[0] as number;
    const scroll = values[1] as number;
    return mouse + scroll;
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleType = () => {
      const fullText = typingWords[wordIdx];
      if (!isDeleting) {
        setTypedText(fullText.substring(0, typedText.length + 1));
        setSpeed(75);
        if (typedText === fullText) {
          timer = setTimeout(() => setIsDeleting(true), 2000);
          return;
        }
      } else {
        setTypedText(fullText.substring(0, typedText.length - 1));
        setSpeed(40);
        if (typedText === '') {
          setIsDeleting(false);
          setWordIdx((prev) => (prev + 1) % typingWords.length);
        }
      }
      timer = setTimeout(handleType, speed);
    };

    timer = setTimeout(handleType, speed);
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, wordIdx]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();

    const centerX = left + width / 2;
    const centerY = top + height / 2;

    x.set((clientX - centerX) / 50);
    y.set((clientY - centerY) / 50);
  };

  const handleScroll = () => {
    const element = document.getElementById('confessions');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex flex-col lg:flex-row overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Optimized Parallax Container */}
      <div className="w-full lg:w-1/2 h-[45vh] lg:h-auto lg:min-h-screen relative overflow-hidden z-10 bg-black/5 will-change-transform border-b border-white/5 lg:border-b-0 lg:border-r border-white/5">
        <motion.div
          className="w-full h-full relative"
          style={{ x: mouseX, y: combinedY, scale: 1.05 }}
          initial={{ opacity: 0, scale: 1.4, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1.05, filter: "blur(0px)" }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0 bg-black/30 z-10" />
          <motion.img
            src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop"
            alt="Vintage Love Letters and Envelopes"
            className="w-full h-full object-cover grayscale opacity-80 brightness-90 hover:grayscale-0 hover:opacity-100 transition-all duration-1000"
            initial={{ scale: 1.1, filter: "blur(10px)" }}
            animate={{ scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </motion.div>

        {/* Floating Letters Overlay */}
        <FloatingLetters count={20} />

        <div className="absolute bottom-8 left-8 text-white/70 z-30 font-display italic text-sm tracking-wider hidden lg:block drop-shadow-md">
          Whisper of Hearts — 2026
        </div>
      </div>

      {/* Right Side - Content */}
      {/* Right Side - Content */}
      <div className="w-full lg:w-1/2 min-h-[55vh] lg:min-h-screen bg-cream dark:bg-[#0a0506] relative flex flex-col justify-center items-start p-8 md:p-12 lg:p-20 z-10 transition-colors duration-300">

        {/* Floating Heart 3D Placeholder Effect */}
        <motion.div
          className="absolute top-1/4 right-10 w-32 h-32 hidden lg:flex items-center justify-center pointer-events-none opacity-10"
          animate={{
            y: [-10, 10, -10],
            rotateY: [0, 180, 360],
          }}
          transition={{
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            rotateY: { duration: 20, repeat: Infinity, ease: "linear" }
          }}
        >
          <svg viewBox="0 0 24 24" fill="#F43F5E" className="w-full h-full drop-shadow-2xl">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>

        <motion.div
          variants={variants.staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-xl lg:max-w-4xl"
        >
          <motion.h4
            variants={variants.fadeInUp}
            className="text-primary/70 dark:text-primary/70 font-semibold tracking-[0.25em] text-xs mb-4 uppercase font-display"
          >
            A Safe Haven for Unspoken Feelings
          </motion.h4>

          <motion.h1
            variants={variants.fadeInUp}
            className="font-display font-extrabold tracking-tight text-5xl md:text-7xl lg:text-8xl leading-none mb-4 bg-gradient-to-r from-charcoal via-primary to-secondary dark:from-white dark:via-pink-100 dark:to-rose-400 bg-clip-text text-transparent uppercase"
          >
            Silent <br /> Whispers
          </motion.h1>

          {/* Typewriter Subtitle */}
          <motion.div
            variants={variants.fadeInUp}
            className="font-typewriter text-xs md:text-sm lg:text-base text-primary/90 min-h-[30px] flex items-center gap-1 mb-8"
          >
            <span>Write</span>
            <span className="text-secondary font-semibold">{typedText}</span>
            <span className="animate-pulse w-1.5 h-4 bg-primary inline-block" />
          </motion.div>

          <motion.div variants={variants.fadeInUp} className="space-y-6">
            <p className="text-charcoal/80 dark:text-gray-400 text-base lg:text-lg font-body leading-relaxed max-w-xl">
              Got a secret crush? A hidden feeling? Compose your letter anonymously, customize it with beautiful stationery styles, and deliver your whisper directly to their inbox safely and securely.
            </p>
            <p className="text-charcoal/80 dark:text-gray-400 text-base lg:text-lg font-body leading-relaxed max-w-xl">
              Like a note folded in the quiet corners of the heart, some words deserve to be sent. We guarantee 100% encryption and zero-log transmission.
            </p>
          </motion.div>

          <motion.p
            variants={variants.fadeInUp}
            className="mt-8 text-primary/80 font-display font-semibold tracking-wider text-sm lg:text-base uppercase border-l-2 border-primary pl-4"
          >
            Your identity is fully protected.
          </motion.p>

          <motion.div
            variants={variants.fadeInUp}
            className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <MagneticButton>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all w-full sm:w-auto text-sm"
              >
                Write a Confession
              </button>
            </MagneticButton>

            <MagneticButton>
              <button
                onClick={handleScroll}
                className="px-8 py-4 border border-primary/20 dark:border-white/10 text-charcoal dark:text-white rounded-full font-semibold hover:bg-primary/5 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2 group w-full sm:w-auto text-sm"
              >
                Explore Whispers
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
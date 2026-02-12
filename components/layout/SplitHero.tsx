import React from 'react';
import { motion, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion';
import { variants, transitions } from '../../lib/animations';
import { FallingPetals } from '../animations/FallingPetals';
import { RoseReveal } from '../animations/RoseReveal';
import { MagneticButton } from '../animations/MagneticButton';
import { ArrowRight } from 'lucide-react';

export const SplitHero: React.FC = () => {
  // Parallax Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

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

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();

    // Calculate distance from center
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Map to range
    x.set((clientX - centerX) / 50);
    y.set((clientY - centerY) / 50);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Happy Valentine\'s Day',
          text: 'A Celebration of Grace',
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleScroll = () => {
    const element = document.getElementById('memories');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex flex-col lg:flex-row overflow-hidden"
      onMouseMove={handleMouseMove}
    >

      {/* Left Side - Image with Reveal Animation & Parallax */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-auto lg:min-h-screen relative overflow-hidden z-10 bg-black/5">
        <motion.div
          className="w-full h-full relative"
          style={{ x: mouseX, y: combinedY, scale: 1.05 }}
        >
          <div className="absolute inset-0 bg-black/20 z-10" />
          <motion.img
            src="/images/hero-rose.png"
            alt="Deep Red Rose with Droplets"
            className="w-full h-full object-cover"
            initial={{ scale: 1.1, filter: "blur(10px)" }}
            animate={{ scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </motion.div>

        {/* Falling Petals Overlay - Constrained to Left Side */}
        <FallingPetals count={20} />

        {/* Header Overlay */}


        <div className="absolute bottom-8 left-8 text-white/90 z-30 font-display italic text-lg tracking-wider hidden lg:block drop-shadow-md">
          Maison de Rose — 2026
        </div>
      </div>

      {/* Right Side - Content */}
      <div className="w-full lg:w-1/2 min-h-[50vh] lg:min-h-screen bg-cream relative flex flex-col justify-center items-start p-8 lg:p-20 z-10">

        {/* Floating Heart 3D Placeholder Effect */}
        <motion.div
          className="absolute top-1/4 right-10 w-32 h-32 hidden lg:flex items-center justify-center pointer-events-none opacity-20"
          animate={{
            y: [-10, 10, -10],
            rotateY: [0, 180, 360],
          }}
          transition={{
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            rotateY: { duration: 20, repeat: Infinity, ease: "linear" }
          }}
        >
          <svg viewBox="0 0 24 24" fill="#E11D48" className="w-full h-full drop-shadow-2xl">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>

        <motion.div
          variants={variants.staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-xl lg:max-w-4xl"
        >
          <motion.h4
            variants={variants.fadeInUp}
            className="text-amber-600 font-bold tracking-[0.2em] text-sm lg:text-base mb-6 uppercase"
          >
            A Celebration of Grace
          </motion.h4>

          <motion.h1
            variants={variants.fadeInUp}
            className="font-display italic text-7xl lg:text-9xl leading-tight mb-8 bg-gradient-to-r from-amber-500 via-yellow-600 to-amber-700 bg-clip-text text-transparent"
          >
            Happy <br /> Valentine's Day
          </motion.h1>

          <motion.div variants={variants.fadeInUp} className="space-y-8">
            <p className="font-accent text-2xl lg:text-3xl text-charcoal/80 italic leading-relaxed">
              "Like the peonies that unfold with the morning sun, may your day be filled with the soft brilliance of a thousand blooming lilies."
            </p>
            <p className="font-accent text-2xl lg:text-3xl text-charcoal/80 italic leading-relaxed">
              "In every act of kindness, in every gentle word, your beauty radiates a warmth that makes the world feel like eternal spring."
            </p>
          </motion.div>

          <motion.p
            variants={variants.fadeInUp}
            className="mt-10 text-primary font-bold font-display text-xl lg:text-2xl tracking-wide"
          >
            You are loved, today and always.
          </motion.p>

          <motion.div
            variants={variants.fadeInUp}
            className="mt-12 flex flex-col sm:flex-row gap-4"
          >
            <MagneticButton>
              <button
                onClick={handleShare}
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-medium shadow-xl hover:shadow-2xl transition-all w-full sm:w-auto"
              >
                Share this Card
              </button>
            </MagneticButton>

            <MagneticButton>
              <button
                onClick={handleScroll}
                className="px-8 py-4 border border-primary text-primary rounded-full font-medium hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group w-full sm:w-auto"
              >
                View Memories
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Navigation } from './components/layout/Navigation';
import { SplitHero } from './components/layout/SplitHero';
import { ConfessionTicker } from './components/sections/ConfessionTicker';
import { HowItWorks } from './components/sections/HowItWorks';
import { BloomGallery } from './components/sections/BloomGallery';
import { BentoGrid } from './components/sections/BentoGrid';
import { SecurityBoard } from './components/sections/SecurityBoard';
import { FAQAccordion } from './components/sections/FAQAccordion';
import { QuoteSection } from './components/sections/QuoteSection';
import { Footer } from './components/layout/Footer';
import { ParallaxBackground } from './components/animations/ParallaxBackground';
import { ParallaxSection } from './components/animations/ParallaxSection';
import Lenis from 'lenis';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme_preference');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark'; // Default to dark (Obsidian Burgundy theme)
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme_preference', theme);
  }, [theme]);

  // Lenis Smooth Scroll Initialization
  useEffect(() => {
    // Only initialize on desktop/mouse devices to prevent potential touch scroll conflicts on mobile
    if (window.innerWidth < 768) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
    });

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="antialiased bg-cream dark:bg-obsidian text-charcoal dark:text-obsidianText selection:bg-primary/20 transition-colors duration-300 min-h-screen relative">
      <ParallaxBackground />
      <Navigation isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} theme={theme} setTheme={setTheme} />
      
      <main className="relative z-10">
        <SplitHero setIsModalOpen={setIsModalOpen} theme={theme} />
        <ConfessionTicker theme={theme} />
        
        <ParallaxSection>
          <HowItWorks theme={theme} />
        </ParallaxSection>

        <ParallaxSection>
          <BloomGallery theme={theme} />
        </ParallaxSection>

        <ParallaxSection>
          <BentoGrid theme={theme} />
        </ParallaxSection>

        <ParallaxSection>
          <SecurityBoard theme={theme} />
        </ParallaxSection>

        <ParallaxSection>
          <FAQAccordion theme={theme} />
        </ParallaxSection>

        <ParallaxSection>
          <QuoteSection theme={theme} />
        </ParallaxSection>
      </main>

      <Footer theme={theme} />
    </div>
  );
}

export default App;
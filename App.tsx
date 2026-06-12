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
import { getPublicConfessions, addPublicConfession, deletePublicConfession, PublicConfession } from './lib/confessionStore';
import { AnimatePresence, motion } from 'framer-motion';
import { X, KeyRound } from 'lucide-react';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme_preference');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark'; // Default to dark (Obsidian Burgundy theme)
  });
  const [publicConfessions, setPublicConfessions] = useState<PublicConfession[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  useEffect(() => {
    setPublicConfessions(getPublicConfessions());
  }, []);

  const handleAddPublicConfession = (newConf: Omit<PublicConfession, 'id' | 'timestamp' | 'desc' | 'rotation'>) => {
    const created = addPublicConfession(newConf);
    setPublicConfessions(prev => [created, ...prev]);
  };

  const handleDeleteConfession = (id: string) => {
    deletePublicConfession(id);
    setPublicConfessions(prev => prev.filter(c => c.id !== id));
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === '119188090026' || adminPassword === 'admin') {
      setIsAdmin(true);
      setIsAdminModalOpen(false);
      setAdminPassword('');
      setAdminError('');
    } else {
      setAdminError('Invalid password. Please try again.');
    }
  };

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
      <Navigation
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        theme={theme}
        setTheme={setTheme}
        onAddConfession={handleAddPublicConfession}
      />

      <main className="relative z-10">
        <SplitHero setIsModalOpen={setIsModalOpen} theme={theme} />
        <ConfessionTicker theme={theme} confessions={publicConfessions} />

        <ParallaxSection>
          <HowItWorks theme={theme} />
        </ParallaxSection>

        <ParallaxSection>
          <BloomGallery
            theme={theme}
            confessions={publicConfessions}
            isAdmin={isAdmin}
            onDeleteConfession={handleDeleteConfession}
          />
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

      <Footer
        theme={theme}
        isAdmin={isAdmin}
        onAdminClick={() => {
          if (isAdmin) {
            setIsAdmin(false);
          } else {
            setIsAdminModalOpen(true);
          }
        }}
      />

      {/* Admin Login Modal Overlay */}
      <AnimatePresence>
        {isAdminModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
            onClick={() => setIsAdminModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#fff0f2] dark:bg-[#12090b] border border-primary/20 dark:border-white/10 rounded-3xl w-full max-w-sm shadow-2xl p-6 relative overflow-hidden text-center transition-colors duration-300"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-secondary" />

              <button
                onClick={() => setIsAdminModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 hover:bg-primary/10 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-charcoal/50 dark:text-gray-400" />
              </button>

              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 mt-2">
                <KeyRound className="w-6 h-6 text-primary" />
              </div>

              <h3 className="font-display font-bold text-xl text-charcoal dark:text-white mb-1">Admin Access Portal</h3>
              <p className="text-charcoal/60 dark:text-gray-400 text-xs mb-6 font-body">Enter password to moderate board confessions.</p>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      if (adminError) setAdminError('');
                    }}
                    placeholder="Enter Admin Password"
                    className="w-full px-4 py-2.5 rounded-xl border border-primary/20 dark:border-white/10 bg-white dark:bg-white/5 text-charcoal dark:text-white placeholder:text-charcoal/40 dark:placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-center transition-all font-body"
                    autoFocus
                    required
                  />
                  {adminError && (
                    <p className="text-primary text-[11px] mt-2 font-semibold font-body">{adminError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-medium bg-gradient-to-r from-primary to-secondary text-white hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md text-sm hover:shadow-lg"
                >
                  Authenticate
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
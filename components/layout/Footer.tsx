import React, { useState } from 'react';
import { Heart, Instagram, Facebook, Shield, ArrowUp } from 'lucide-react';

interface FooterProps {
  theme: 'light' | 'dark';
  isAdmin: boolean;
  onAdminClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ theme, isAdmin, onAdminClick }) => {
  const [heartsCount, setHeartsCount] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('universe_hearts');
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  const handleHeartClick = () => {
    const next = heartsCount + 1;
    setHeartsCount(next);
    localStorage.setItem('universe_hearts', next.toString());
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isLight = theme === 'light';

  return (
    <footer className={`relative overflow-hidden transition-colors duration-500 ${
      isLight 
        ? 'bg-gradient-to-b from-[#ffeef0] to-[#ffd2d7] text-charcoal border-t border-primary/10' 
        : 'bg-gradient-to-b from-[#0e0708] to-[#050203] text-gray-300 border-t border-white/5'
    } py-16`}>
      {/* Decorative top border line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary fill-primary animate-pulse" />
              </div>
              <span className="font-display font-bold text-xl tracking-widest text-charcoal dark:text-white">WHISPER & BLOOM</span>
            </div>
            <p className="text-sm text-charcoal/70 dark:text-gray-400 leading-relaxed font-body">
              A private digital garden for sending and reading anonymous love confessions. Pour your heart out, securely sealed and instantly sent.
            </p>
            
            {/* Interactive Heart Counter Widget */}
            <div className="mt-2 p-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-primary/10 dark:border-white/5 backdrop-blur-sm inline-flex flex-col gap-2 max-w-xs">
              <span className="text-[11px] font-display font-semibold tracking-wider text-primary dark:text-rose-300 uppercase">
                Interactive Heart Note
              </span>
              <button 
                onClick={handleHeartClick}
                className="flex items-center gap-3 hover:scale-105 active:scale-95 transition-all group text-left"
              >
                <div className="p-2 rounded-full bg-rose-500/10 group-hover:bg-rose-500/20 transition-colors">
                  <Heart className="w-4 h-4 text-primary fill-primary group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-charcoal dark:text-white">Send love to the universe</div>
                  <div className="text-[10px] text-charcoal/50 dark:text-gray-400 font-medium">
                    {heartsCount > 0 ? `${heartsCount.toLocaleString()} hearts sent` : 'Click to send first heart'}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-primary dark:text-rose-300">
              Explore Garden
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm font-medium">
              <li>
                <a href="#how-it-works" className="hover:text-primary dark:hover:text-rose-300 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#confessions" className="hover:text-primary dark:hover:text-rose-300 transition-colors">
                  Confession Board
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-primary dark:hover:text-rose-300 transition-colors">
                  Privacy & Encryption
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-primary dark:hover:text-rose-300 transition-colors">
                  Frequently Asked
                </a>
              </li>
            </ul>
          </div>

          {/* Privacy Protocol Column */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-primary dark:text-rose-300">
              Privacy Guarantees
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-charcoal/70 dark:text-gray-400 font-body">
              <li className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span>AES-256 Client Encryption</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span>Zero Database Server Logs</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span>Cookie-Free Transmission</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span>Client-Side Harassment Shield</span>
              </li>
            </ul>
          </div>

          {/* Connect & Social Column */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-primary dark:text-rose-300">
              Connect & Share
            </h4>
            <p className="text-sm text-charcoal/70 dark:text-gray-400 leading-relaxed font-body">
              Follow our author for project updates, cute concept art, and developer news.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.facebook.com/cyrhildwight/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-3 bg-white/40 dark:bg-white/5 border border-primary/10 dark:border-white/5 rounded-full hover:bg-primary hover:text-white dark:hover:bg-primary hover:border-transparent dark:hover:border-transparent transition-all group shadow-sm hover:shadow-md"
              >
                <Facebook className="w-4 h-4 group-hover:scale-115 transition-transform" />
              </a>
              <a 
                href="https://www.instagram.com/cyrhil_dwight/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-3 bg-white/40 dark:bg-white/5 border border-primary/10 dark:border-white/5 rounded-full hover:bg-primary hover:text-white dark:hover:bg-primary hover:border-transparent dark:hover:border-transparent transition-all group shadow-sm hover:shadow-md"
              >
                <Instagram className="w-4 h-4 group-hover:scale-115 transition-transform" />
              </a>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="border-t border-primary/10 dark:border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-charcoal/60 dark:text-gray-400">
          <div className="text-center sm:text-left leading-relaxed">
            <p>
              © 2026 Cyrhil Dwight Lozano. All rights reserved.
              <button 
                onClick={onAdminClick}
                className={`ml-2 opacity-60 hover:opacity-100 transition-opacity hover:underline font-semibold font-body ${
                  isAdmin ? 'text-primary dark:text-rose-400' : ''
                }`}
              >
                {isAdmin ? '• Admin Portal (Active)' : '• Admin'}
              </button>
            </p>
            <p className="mt-1 opacity-80">
              Designed with <Heart className="w-3.5 h-3.5 text-primary inline fill-primary" /> for a safer, kinder digital space.
            </p>
          </div>
          
          <button 
            onClick={handleScrollToTop}
            className="flex items-center gap-2 px-4 py-2 bg-white/40 dark:bg-white/5 border border-primary/10 dark:border-white/5 hover:border-primary/30 dark:hover:border-white/20 rounded-full transition-all text-xs font-semibold group hover:shadow-sm"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};
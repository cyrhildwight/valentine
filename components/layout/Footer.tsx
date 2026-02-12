import React from 'react';
import { Heart, Instagram, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1a1a1a] text-white py-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="flex items-center gap-3 mb-6 md:mb-0">
            <Heart className="w-6 h-6 text-primary fill-primary" />
            <span className="font-display text-2xl tracking-wider">Dwight</span>
          </div>

          <div className="flex gap-6">
            <a href="https://www.facebook.com/cyrhildwight/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-primary hover:text-white transition-all group">
              <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
            <a href="https://www.instagram.com/cyrhildwightlozano/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-primary hover:text-white transition-all group">
              <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-center text-sm text-gray-400">
          <p>© 2026 Cyrhil Dwight Lozano. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
          </div>
        </div>
      </div>
    </footer>
  );
};
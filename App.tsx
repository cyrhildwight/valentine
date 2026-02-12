import React from 'react';
import { Navigation } from './components/layout/Navigation';
import { SplitHero } from './components/layout/SplitHero';
import { BloomGallery } from './components/sections/BloomGallery';
import { BentoGrid } from './components/sections/BentoGrid';
import { QuoteSection } from './components/sections/QuoteSection';
import { Footer } from './components/layout/Footer';

function App() {
  return (
    <div className="antialiased bg-cream text-charcoal selection:bg-primary/20">
      <Navigation />
      
      <main>
        <SplitHero />
        <BloomGallery />
        <BentoGrid />
        <QuoteSection />
      </main>

      <Footer />
    </div>
  );
}

export default App;
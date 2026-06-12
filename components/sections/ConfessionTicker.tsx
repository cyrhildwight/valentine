import React from 'react';
import { PublicConfession } from '../../lib/confessionStore';

interface ConfessionTickerProps {
  theme: 'light' | 'dark';
  confessions: PublicConfession[];
}

export const ConfessionTicker: React.FC<ConfessionTickerProps> = ({ theme, confessions }) => {
  const displayItems = confessions.map(item => ({
    id: item.id,
    to: item.to.replace(/^To:\s*/i, ''), // strip "To: " prefix for cleaner ticker space
    from: item.from.replace(/^From:\s*/i, ''), // strip "From: " prefix
    msg: item.message
  }));

  // Double/repeat items to make the loop seamless
  let repeatedItems = [...displayItems];
  if (repeatedItems.length > 0) {
    while (repeatedItems.length < 14) {
      repeatedItems = [...repeatedItems, ...displayItems];
    }
  }

  return (
    <div className="bg-[#fff0f2] dark:bg-[#0e0708] border-y border-primary/10 dark:border-white/5 py-6 overflow-hidden relative w-full select-none z-10 transition-colors duration-300">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-inner {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .marquee-inner:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="absolute top-0 left-0 bottom-0 w-24 bg-gradient-to-r from-[#fff0f2] dark:from-[#0e0708] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-[#fff0f2] dark:from-[#0e0708] to-transparent z-10 pointer-events-none" />

      <div className="marquee-inner gap-6">
        {repeatedItems.map((item, index) => (
          <div 
            key={`${item.id}-${index}`}
            className="bg-white/70 dark:bg-[#12090b]/80 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-sm border border-primary/5 dark:border-white/5 flex flex-col gap-1 max-w-xs hover:border-primary/30 hover:bg-white dark:hover:bg-[#181113] hover:shadow-md transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between gap-4 mb-1">
              <span className="text-xs font-semibold text-primary dark:text-rose-300 uppercase tracking-wider">{item.to}</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{item.from}</span>
            </div>
            <p className="text-xs font-body text-charcoal/80 dark:text-gray-300 leading-relaxed">
              "{item.msg}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

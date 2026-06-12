import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Heart, X, Send, Sun, Moon, Pin } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { MagneticButton } from '../animations/MagneticButton';
import { PublicConfession } from '../../lib/confessionStore';
import { containsProfanity } from '../../lib/profanityFilter';

// Central configuration for your website URL and Domain
const APP_URL = "https://confession-dwight.vercel.app/";
const APP_DOMAIN = "confession-dwight.vercel.app";

// EmailJS credentials from environment variables
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

// --- Security Utilities ---

/** Strip all HTML/script tags and trim whitespace to prevent XSS in emails */
const sanitize = (str: string): string =>
  str.replace(/<[^>]*>/g, '').replace(/[\x00-\x08\x0B\x0E-\x1F\x7F]/g, '').trim();

/** Basic email format validation */
const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/** Session fingerprint for secondary rate limiting (not PII) */
const getSessionFingerprint = (): string => {
  try {
    const raw = `${navigator.userAgent}|${screen.width}|${screen.height}|${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
    return raw.split('').reduce((hash, ch) => ((hash << 5) - hash + ch.charCodeAt(0)) | 0, 0).toString(36);
  } catch {
    return 'fp_unknown';
  }
};

interface NavigationProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  onAddConfession: (confession: Omit<PublicConfession, 'id' | 'timestamp' | 'desc' | 'rotation'>) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  isModalOpen,
  setIsModalOpen,
  theme: appTheme,
  setTheme: setAppTheme,
  onAddConfession
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [theme, setTheme] = useState<'vintage' | 'neon' | 'midnight'>('vintage');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [cooldownRemaining, setCooldownRemaining] = useState<string | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<'email' | 'board'>('email');
  const [validationError, setValidationError] = useState<string | null>(null);

  // PWA install prompt handling
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // Don't show if already running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      return;
    }

    const handleBeforeInstall = (e: Event) => {
      // Prevent the browser's default mini-infobar
      e.preventDefault();
      const ev = e as any;
      // Save the event so we can trigger it later on button click
      setDeferredPrompt(ev);
      // Automatically show our custom banner
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const handleDismissBanner = () => {
    // Only hide for this session — no localStorage, so it shows again on next reload
    setShowInstallBanner(false);
  };

  // Reset validation error when modal state changes
  useEffect(() => {
    setValidationError(null);
  }, [isModalOpen]);

  // Monitor cooldown remaining dynamically

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkCooldown = () => {
      const COOLDOWN_TIME = 5 * 60 * 1000;
      const lastSent = localStorage.getItem('last_confession_sent');
      if (lastSent) {
        const now = Date.now();
        const timeElapsed = now - parseInt(lastSent, 10);
        if (timeElapsed < COOLDOWN_TIME) {
          const secondsRemaining = Math.ceil((COOLDOWN_TIME - timeElapsed) / 1000);
          const minutes = Math.floor(secondsRemaining / 60);
          const seconds = secondsRemaining % 60;
          const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
          setCooldownRemaining(timeString);
          return true;
        }
      }
      setCooldownRemaining(null);
      return false;
    };

    if (isModalOpen) {
      const active = checkCooldown();
      if (active) {
        interval = setInterval(() => {
          const activeStill = checkCooldown();
          if (!activeStill) {
            clearInterval(interval);
          }
        }, 1000);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isModalOpen]);

  const { scrollY } = useScroll();

  const getPostcardStyle = () => {
    switch (theme) {
      case 'neon':
        return {
          cardstock: 'bg-zinc-950 p-4 border border-rose-500/30 rounded-3xl shadow-[0_0_40px_rgba(244,63,94,0.3)] relative overflow-hidden transition-all duration-300',
          inner: 'bg-gradient-to-br from-[#12080a] to-[#040203] border border-rose-500/20 rounded-2xl p-5 relative overflow-hidden h-full flex flex-col justify-between min-h-[180px]',
          font: 'font-typewriter tracking-wide',
          stamp: 'border-rose-500/40 border-2 border-dashed text-rose-400 bg-rose-950/20 shadow-[0_0_10px_rgba(244,63,94,0.15)]',
          seal: 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.8)] border border-rose-400/40',
          divider: 'border-rose-500/20',
          dots: 'border-rose-500/10',
          text: 'text-rose-200',
          subtext: 'text-rose-400/60',
          label: 'text-rose-400 font-bold',
          link: 'text-rose-400 hover:text-rose-300 font-bold'
        };
      case 'midnight':
        return {
          cardstock: 'bg-[#1b0d12] p-4 border border-amber-500/20 rounded-3xl shadow-[0_15px_45px_rgba(0,0,0,0.5),0_0_20px_rgba(217,119,6,0.05)] relative overflow-hidden transition-all duration-300',
          inner: 'bg-gradient-to-br from-[#120408] to-[#0a0204] border border-amber-500/15 rounded-2xl p-5 relative overflow-hidden h-full flex flex-col justify-between min-h-[180px]',
          font: 'font-handwriting tracking-wider text-[17px] leading-relaxed',
          stamp: 'border-amber-500/30 border-2 text-amber-300 bg-amber-950/10 shadow-[0_0_10px_rgba(217,119,6,0.1)]',
          seal: 'bg-amber-600 border border-amber-400 text-white shadow-[0_0_12px_rgba(217,119,6,0.4)]',
          divider: 'border-amber-500/10',
          dots: 'border-amber-500/10',
          text: 'text-pink-100',
          subtext: 'text-pink-300/60',
          label: 'text-amber-400 font-bold',
          link: 'text-amber-400 hover:text-amber-300 font-bold'
        };
      case 'vintage':
      default:
        return {
          cardstock: 'bg-gradient-to-br from-[#ecdcc9] to-[#dfceb9] p-4 border-2 border-amber-900/20 rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-300',
          inner: 'bg-[#fdfbf7] border border-amber-900/10 rounded-2xl p-5 relative overflow-hidden h-full flex flex-col justify-between min-h-[180px]',
          font: 'font-handwriting text-[17px] leading-relaxed',
          stamp: 'border-amber-900/30 border-2 border-dashed text-amber-900/50 bg-amber-800/5',
          seal: 'bg-[#b45309] border border-amber-700 text-white shadow-md',
          divider: 'border-amber-900/10',
          dots: 'border-amber-900/20',
          text: 'text-charcoal',
          subtext: 'text-charcoal/60',
          label: 'text-primary font-bold',
          link: 'text-primary hover:text-dark font-bold'
        };
    }
  };

  const previewStyles = getPostcardStyle();

  const handleSendLove = (e: React.FormEvent) => {
    e.preventDefault();

    // --- Input Sanitization ---
    const cleanRecipientName = sanitize(recipientName).slice(0, 80);
    const cleanSenderName = sanitize(senderName).slice(0, 80) || 'Anonymous';
    const cleanEmail = sanitize(recipientEmail).slice(0, 254);
    const cleanMessage = sanitize(message).slice(0, 1000);

    if (!cleanMessage || !cleanRecipientName) return;

    // --- Profanity Check ---
    if (
      containsProfanity(cleanRecipientName) ||
      containsProfanity(cleanMessage) ||
      (cleanSenderName !== 'Anonymous' && containsProfanity(cleanSenderName))
    ) {
      setValidationError('Please keep your names and message respectful! Offensive language is not allowed.');
      return;
    }


    if (deliveryMethod === 'email') {
      if (!cleanEmail) {
        alert('Please enter a recipient email address.');
        return;
      }
      if (!isValidEmail(cleanEmail)) {
        alert('Please enter a valid email address.');
        return;
      }
    }

    // --- Rate Limit: localStorage + session fingerprint double-check ---
    const COOLDOWN_TIME = 5 * 60 * 1000;
    const now = Date.now();
    const fp = getSessionFingerprint();
    const fpKey = `last_sent_${fp}`;

    const lastSentLS = localStorage.getItem('last_confession_sent');
    const lastSentFP = sessionStorage.getItem(fpKey);
    const lastSent = lastSentLS || lastSentFP;

    if (lastSent) {
      const timeElapsed = now - parseInt(lastSent, 10);
      if (timeElapsed < COOLDOWN_TIME) {
        return;
      }
    }

    if (deliveryMethod === 'board') {
      onAddConfession({
        to: cleanRecipientName,
        from: cleanSenderName,
        message: cleanMessage,
        theme
      });

      // Save cooldown timestamp in both localStorage AND sessionStorage fingerprint
      const nowStr = Date.now().toString();
      localStorage.setItem('last_confession_sent', nowStr);
      sessionStorage.setItem(`last_sent_${getSessionFingerprint()}`, nowStr);

      alert(`Your confession to ${cleanRecipientName} has been pinned to the Confession Board!`);
      setIsModalOpen(false);
      setSenderName('');
      setRecipientName('');
      setRecipientEmail('');
      setMessage('');
      setTheme('vintage');
      setActiveTab('write');
      setValidationError(null);
      return;
    }

    // EmailJS Configuration (from environment variables)
    const serviceId = EMAILJS_SERVICE_ID;
    const templateId = EMAILJS_TEMPLATE_ID;
    const publicKey = EMAILJS_PUBLIC_KEY;

    const finalSenderName = cleanSenderName;

    // Append theme context to the message body for EmailJS delivery (use sanitized inputs)
    const formattedMessage = `${cleanMessage}\n\n[Envelope theme chosen by sender: ${theme.toUpperCase()}]`;

    // Generate inline style params for HTML email matching
    const getEmailStyles = () => {
      switch (theme) {
        case 'neon':
          return {
            theme_name: 'Neon Heart',
            card_bg: '#09090b',
            card_border: '1px solid rgba(236,72,153,0.3)',
            card_shadow: '0 0 35px rgba(244,63,94,0.3)',
            inner_bg: '#12080a',
            inner_border: '1px dashed rgba(236,72,153,0.2)',
            text_color: '#fda4af',
            font_family: "'Special Elite', 'Courier New', Courier, monospace",
            stamp_border: '2px dashed rgba(236,72,153,0.5)',
            seal_bg: '#f43f5e',
            seal_color: '#ffffff',
            heart_color: '#f43f5e',
            stamp_bg: 'rgba(244,63,94,0.1)',
            bg_image: 'linear-gradient(rgba(244,63,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(244,63,94,0.04) 1px, transparent 1px)',
            bg_size: '12px 12px'
          };
        case 'midnight':
          return {
            theme_name: 'Midnight Rose',
            card_bg: '#1b0d12',
            card_border: '1px solid rgba(217,119,6,0.3)',
            card_shadow: '0 10px 40px rgba(0,0,0,0.5)',
            inner_bg: '#120408',
            inner_border: '1px dashed rgba(217,119,6,0.2)',
            text_color: '#fbcfe8',
            font_family: "'Patrick Hand', 'Chalkboard SE', 'Comic Sans MS', sans-serif",
            stamp_border: '2px solid rgba(217,119,6,0.3)',
            seal_bg: '#d97706',
            seal_color: '#ffffff',
            heart_color: '#d97706',
            stamp_bg: 'rgba(217,119,6,0.05)',
            bg_image: 'radial-gradient(circle at bottom left, rgba(217,119,6,0.08), transparent 85%)',
            bg_size: 'auto'
          };
        case 'vintage':
        default:
          return {
            theme_name: 'Vintage Cream',
            card_bg: '#ecdcc9',
            card_border: '2px solid rgba(120,53,4,0.3)',
            card_shadow: '0 12px 30px rgba(0,0,0,0.15)',
            inner_bg: '#fdfbf7',
            inner_border: '1px dashed rgba(120,53,4,0.2)',
            text_color: '#4c0519',
            font_family: "'Patrick Hand', 'Chalkboard SE', 'Comic Sans MS', sans-serif",
            stamp_border: '2px dashed rgba(120,53,4,0.3)',
            seal_bg: '#b45309',
            seal_color: '#ffffff',
            heart_color: '#b45309',
            stamp_bg: 'rgba(120,53,4,0.05)',
            bg_image: 'none',
            bg_size: 'auto'
          };
      }
    };

    const emailStyles = getEmailStyles();

    const templateParams = {
      from_name: finalSenderName,
      FROM_NAME: finalSenderName,
      to_name: cleanRecipientName,
      TO_NAME: cleanRecipientName,
      to_email: cleanEmail,
      TO_EMAIL: cleanEmail,
      message: cleanMessage,
      MESSAGE: cleanMessage,
      formatted_message: formattedMessage,
      FORMATTED_MESSAGE: formattedMessage,
      time: new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric', year: 'numeric' }),
      TIME: new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric', year: 'numeric' }),
      // App URL Routing Constants
      app_url: APP_URL,
      APP_URL: APP_URL,
      app_domain: APP_DOMAIN,
      APP_DOMAIN: APP_DOMAIN,
      // HTML Email Theme Variables
      theme_name: emailStyles.theme_name,
      card_bg: emailStyles.card_bg,
      card_border: emailStyles.card_border,
      card_shadow: emailStyles.card_shadow,
      inner_bg: emailStyles.inner_bg,
      inner_border: emailStyles.inner_border,
      text_color: emailStyles.text_color,
      font_family: emailStyles.font_family,
      stamp_border: emailStyles.stamp_border,
      stamp_bg: emailStyles.stamp_bg,
      seal_bg: emailStyles.seal_bg,
      seal_color: emailStyles.seal_color,
      heart_color: emailStyles.heart_color,
      card_bg_image: emailStyles.bg_image,
      card_bg_size: emailStyles.bg_size
    };

    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);

        // Save cooldown timestamp in both localStorage AND sessionStorage fingerprint
        const nowStr = Date.now().toString();
        localStorage.setItem('last_confession_sent', nowStr);
        sessionStorage.setItem(`last_sent_${getSessionFingerprint()}`, nowStr);

        alert(`Your confession has been sent to ${recipientName}!`);
        setIsModalOpen(false);
        setSenderName('');
        setRecipientName('');
        setRecipientEmail('');
        setMessage('');
        setTheme('vintage');
        setActiveTab('write');
        setValidationError(null);
      }, (err) => {
        console.log('FAILED...', err);
        alert('Failed to send message: ' + JSON.stringify(err));
      });
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });



  return (
    <>
      {/* PWA Install Banner — fixed at very top of the page */}
      <AnimatePresence>
        {showInstallBanner && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between gap-3 px-4 py-2.5 bg-gradient-to-r from-primary to-secondary shadow-lg"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Heart className="w-4 h-4 text-white fill-white/30 flex-shrink-0" />
              <p className="text-white text-xs font-medium truncate">
                Install <span className="font-bold">Whisper &amp; Bloom</span> for a better experience!
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleInstallClick}
                className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/30 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                Install App
              </button>
              <button
                onClick={handleDismissBanner}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Dismiss install prompt"
              >
                <X className="w-4 h-4 text-white/80" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-cream/90 dark:bg-dark/80 backdrop-blur-md border-b border-primary/10 dark:border-white/5 shadow-lg py-4' : 'bg-transparent py-6'
          }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="Whisper & Bloom logo"
              className="w-16 h-16 object-contain drop-shadow-lg"
            />
            <span className="font-display font-bold text-xl tracking-wide text-gradient-pink">
              Whisper &amp; Bloom
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden lg:block text-xs tracking-[0.2em] text-charcoal/60 dark:text-gray-400 font-semibold uppercase">
              ANONYMOUS LOVE CONFESSIONS
            </span>
            <button
              onClick={() => setAppTheme(appTheme === 'light' ? 'dark' : 'light')}
              className="p-2.5 rounded-full border border-primary/20 dark:border-white/10 hover:border-primary/40 bg-white/40 dark:bg-white/5 text-primary dark:text-gray-400 hover:text-primary dark:hover:text-white transition-all shadow-sm flex items-center justify-center"
              aria-label="Toggle Theme"
            >
              {appTheme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <MagneticButton>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Confess Love
              </button>
            </MagneticButton>

          </div>
        </div>
      </motion.header >

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#fff0f2] dark:bg-[#12090b] border border-primary/10 dark:border-white/5 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden relative transition-colors duration-300"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary" />

              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 z-50 p-2 hover:bg-primary/10 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-charcoal/50 hover:text-charcoal dark:text-gray-400 dark:hover:text-white" />
              </button>

              {/* Mobile Tab Header */}
              <div className="flex border-b border-primary/10 dark:border-white/5 md:hidden mt-10">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-all ${activeTab === 'write' ? 'border-primary text-primary' : 'border-transparent text-gray-400'
                    }`}
                >
                  Write Confession
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-all ${activeTab === 'preview' ? 'border-primary text-primary' : 'border-transparent text-gray-400'
                    }`}
                >
                  Preview Note
                </button>
              </div>

              {/* Split Screen Container */}
              <div className="flex flex-col md:flex-row min-h-[500px]">

                {/* Left Side: Form */}
                <div className={`${activeTab === 'write' ? 'block' : 'hidden'} md:block w-full md:w-1/2 p-6 lg:p-10 max-h-[85vh] md:max-h-none overflow-y-auto mt-4 md:mt-0`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 text-primary fill-primary/20" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-2xl text-charcoal dark:text-white">Write a Confession</h3>
                      <p className="text-charcoal/60 dark:text-gray-400 text-xs">
                        {deliveryMethod === 'email'
                          ? "Send a secret love letter safely to their inbox."
                          : "Pin your anonymous heart's secret onto the public board."
                        }
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSendLove} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 dark:text-gray-400 mb-1.5">Delivery Method</label>
                      <div className="grid grid-cols-2 gap-2 bg-white/40 dark:bg-white/5 p-1 rounded-xl border border-primary/10 dark:border-white/5">
                        <button
                          type="button"
                          onClick={() => setDeliveryMethod('email')}
                          className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                            deliveryMethod === 'email'
                              ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-sm'
                              : 'text-charcoal/70 dark:text-gray-400 hover:text-charcoal dark:hover:text-white'
                          }`}
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Secret Email</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeliveryMethod('board')}
                          className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                            deliveryMethod === 'board'
                              ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-sm'
                              : 'text-charcoal/70 dark:text-gray-400 hover:text-charcoal dark:hover:text-white'
                          }`}
                        >
                          <Pin className="w-3.5 h-3.5" />
                          <span>Public Board</span>
                        </button>
                      </div>
                    </div>

                    <div className={deliveryMethod === 'email' ? "grid grid-cols-2 gap-4" : "grid grid-cols-1"}>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 dark:text-gray-400 mb-1">To (Name)</label>
                        <input
                          type="text"
                          value={recipientName}
                          onChange={(e) => {
                            setRecipientName(e.target.value);
                            if (validationError) setValidationError(null);
                          }}
                          placeholder="Their Name"
                          className="w-full px-4 py-2.5 rounded-xl border border-primary/20 dark:border-white/10 bg-white dark:bg-white/5 text-charcoal dark:text-white placeholder:text-charcoal/40 dark:placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                          required
                        />
                      </div>
                      {deliveryMethod === 'email' && (
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 dark:text-gray-400 mb-1">To (Email)</label>
                          <input
                            type="email"
                            value={recipientEmail}
                            onChange={(e) => {
                              setRecipientEmail(e.target.value);
                              if (validationError) setValidationError(null);
                            }}
                            placeholder="their@email.com"
                            className="w-full px-4 py-2.5 rounded-xl border border-primary/20 dark:border-white/10 bg-white dark:bg-white/5 text-charcoal dark:text-white placeholder:text-charcoal/40 dark:placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                            required
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 dark:text-gray-400 mb-1">From (Name/Pseudonym)</label>
                      <input
                        type="text"
                        value={senderName}
                        onChange={(e) => {
                          setSenderName(e.target.value);
                          if (validationError) setValidationError(null);
                        }}
                        placeholder="Leave blank for Anonymous"
                        className="w-full px-4 py-2.5 rounded-xl border border-primary/20 dark:border-white/10 bg-white dark:bg-white/5 text-charcoal dark:text-white placeholder:text-charcoal/40 dark:placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 dark:text-gray-400 mb-1">Card Theme</label>
                      <div className="flex gap-3 mt-1">
                        {(['vintage', 'neon', 'midnight'] as const).map((t) => (
                          <button
                            type="button"
                            key={t}
                            onClick={() => setTheme(t)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${theme === t
                                ? 'bg-primary border-primary text-white shadow-sm'
                                : 'bg-white dark:bg-white/5 border-primary/20 dark:border-white/10 text-charcoal dark:text-gray-400 hover:border-primary/40'
                              }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 dark:text-gray-400 mb-1">Your Confession</label>
                      <textarea
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          if (validationError) setValidationError(null);
                        }}
                        placeholder="Whisper your heart's secret..."
                        rows={4}
                        className="w-full px-4 py-2.5 rounded-xl border border-primary/20 dark:border-white/10 bg-white dark:bg-white/5 text-charcoal dark:text-white placeholder:text-charcoal/40 dark:placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all resize-none"
                        required
                      />
                    </div>

                    {validationError && (
                      <div className="p-3 bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 text-red-500 dark:text-red-400 rounded-xl text-xs font-semibold text-center animate-pulse">
                        {validationError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={cooldownRemaining !== null}
                      className={`w-full py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group text-sm ${cooldownRemaining !== null
                          ? 'bg-charcoal/20 text-charcoal/40 dark:bg-white/10 dark:text-gray-500 cursor-not-allowed shadow-none'
                          : 'bg-gradient-to-r from-primary to-secondary text-white hover:scale-[1.01] active:scale-[0.99]'
                        }`}
                    >
                      {cooldownRemaining !== null ? (
                        <span>Cooldown ({cooldownRemaining} remaining)</span>
                      ) : deliveryMethod === 'email' ? (
                        <>
                          <span>Send Secret Confession</span>
                          <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      ) : (
                        <>
                          <span>Pin to Confession Board</span>
                          <Pin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Right Side: Postcard Live Preview */}
                <div className={`${activeTab === 'preview' ? 'flex' : 'hidden'} md:flex w-full md:w-1/2 bg-[#fdf2f4] dark:bg-black/20 p-8 lg:p-10 flex-col justify-center items-center relative overflow-hidden border-t md:border-t-0 md:border-l border-primary/10 dark:border-white/5`}>

                  {/* Backdrop letter elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                  <div className="text-[10px] uppercase font-semibold tracking-[0.25em] text-charcoal/80 dark:text-gray-400 absolute top-4 left-6 select-none hidden md:block">
                    {deliveryMethod === 'email' ? 'LIVE ENVELOPE PREVIEW' : 'LIVE BOARD POST PREVIEW'}
                  </div>

                  {/* Envelope Postcard Card - Double Layered Cardstock Frame */}
                  <div
                    className={`w-full max-w-sm aspect-[1.58] ${previewStyles.cardstock}`}
                  >
                    {/* Inner note layer */}
                    <div className={`${previewStyles.inner} h-full w-full flex flex-col justify-between`}>
                      {/* Retro Grid background for Neon theme */}
                      {theme === 'neon' && (
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(244,63,94,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(244,63,94,0.04)_1px,transparent_1px)] bg-[size:12px_12px] opacity-100 pointer-events-none" />
                      )}

                      {/* Corner decorative anchors for Vintage theme */}
                      {theme === 'vintage' && (
                        <>
                          <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-amber-900/20 rounded-tl-sm pointer-events-none" />
                          <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-amber-900/20 rounded-tr-sm pointer-events-none" />
                          <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-amber-900/20 rounded-bl-sm pointer-events-none" />
                          <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-amber-900/20 rounded-br-sm pointer-events-none" />
                        </>
                      )}

                      {/* Abstract gold/rose ambient reflection for Midnight theme */}
                      {theme === 'midnight' && (
                        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                      )}

                      {/* Diagonal gloss reflection shine for all themes */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.015] to-white/[0.04] pointer-events-none" />

                      {/* Postcard Layout Grid */}
                      <div className="flex h-full w-full gap-3 text-left relative z-10">
                        {/* Left Column (Message Side) */}
                        <div className={`w-[58%] pr-2.5 flex flex-col justify-between border-r ${previewStyles.divider} border-dashed h-full`}>
                          <div className="flex-grow flex flex-col justify-center min-h-0">
                            <p className={`text-[11px] leading-relaxed italic break-words overflow-y-auto max-h-[85px] pr-1 ${previewStyles.font} ${previewStyles.text}`}>
                              {message ? `"${message}"` : '"Whisper your heart\'s secret here..."'}
                            </p>
                          </div>
                          <div className={`text-[10px] opacity-75 mt-1 pt-1.5 border-t ${previewStyles.divider} ${previewStyles.font} ${previewStyles.text}`}>
                            From: <span className="font-semibold">{senderName || 'Anonymous'}</span>
                          </div>
                        </div>

                        {/* Right Column (Address & Stamp Side) */}
                        <div className="w-[42%] flex flex-col justify-between pl-1 h-full">
                          {/* Stamp Slot */}
                          <div className="flex justify-end">
                            <div className={`w-9 h-11 rounded border flex flex-col items-center justify-center p-1 select-none ${previewStyles.stamp}`}>
                              <Heart className="w-2.5 h-2.5 fill-current animate-pulse" />
                              <span className="text-[4px] tracking-widest mt-0.5 uppercase font-bold">Post</span>
                            </div>
                          </div>

                          {/* Recipient Address Lines */}
                          <div className="my-auto flex flex-col gap-1 pt-0.5">
                            <div className={`text-[8px] uppercase tracking-wider truncate ${previewStyles.label}`}>
                              To: {recipientName || 'Someone Special'}
                            </div>
                            {/* Dotted address lines for aesthetic */}
                            <div className={`border-b ${previewStyles.dots} border-dotted h-1.5`} />
                            <div className={`border-b ${previewStyles.dots} border-dotted h-1.5`} />

                            {/* App branding link watermarked inside card */}
                            <div className={`text-[7px] mt-2 leading-tight ${previewStyles.subtext}`}>
                              Sent via <a href={APP_URL} target="_blank" rel="noopener noreferrer" className={`hover:underline ${previewStyles.link}`}>Whisper & Bloom</a>
                              <div className="opacity-60 text-[6px]">{APP_DOMAIN}</div>
                            </div>
                          </div>

                          {/* Wax Seal / Stamp Bottom Right */}
                          <div className="flex justify-end">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[8px] font-bold border border-black/5 shadow-sm ${previewStyles.seal}`}>
                              ♥
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Preview Hint */}
                  <p className="text-[11px] text-charcoal/60 dark:text-gray-400 text-center max-w-xs mt-6 leading-normal hidden md:block font-body">
                    {deliveryMethod === 'email'
                      ? "This shows how your confession looks. Recipient gets an email detailing your message with this visual envelope theme notation."
                      : "This shows how your confession will look. It will be pinned publicly to the Confession Board on the website."
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
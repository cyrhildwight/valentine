import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Heart, X, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { MagneticButton } from '../animations/MagneticButton';

export const Navigation: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const { scrollY } = useScroll();

  const handleSendLove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    // EmailJS Configuration
    const serviceId = "service_wg7tyyo"; // Get this from EmailJS dashboard (e.g., "service_gmail")
    const templateId = "template_gxd5a26"; // Get this from EmailJS dashboard (e.g., "template_love_note")
    const publicKey = "rP4hlxy4iSWVRh33q"; // Your provided Public Key

    // Template parameters must match your EmailJS template variables like {{from_name}}, {{message}}
    const templateParams = {
      from_name: name,
      message: message,
      to_name: "Cyrhil Dwight"
    };

    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        alert('Your love note has been sent successfully!');
        setIsModalOpen(false);
        setName('');
        setMessage('');
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
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
          }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary fill-primary" />
            <span className="font-display font-bold text-xl tracking-wide text-gradient-gold">
              CYRHIL DWIGHT
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden lg:block text-xs tracking-[0.2em] text-charcoal/60 font-semibold">
              A CELEBRATION OF GRACE
            </span>
            <MagneticButton>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Send Love
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary" />
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              <div className="p-8 pt-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary fill-primary/20" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-2xl text-charcoal">Send Your Love</h3>
                    <p className="text-gray-500 text-sm">Write a heartfelt message</p>
                  </div>
                </div>

                <form onSubmit={handleSendLove} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Who is this love from?"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write something beautiful..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400 resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                  >
                    <span>Send Message</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
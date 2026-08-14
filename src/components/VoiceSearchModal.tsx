import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuery: (query: string) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectQuery,
}) => {
  const [listening, setListening] = useState(true);
  const [transcript, setTranscript] = useState('');

  const suggestions = [
    'Find North Indian food',
    'Best seafood near Marine Drive',
    'Nearest 24/7 hospital',
    'Taj Mahal Palace hotel',
    'ATM with foreign card support',
  ];

  useEffect(() => {
    if (!isOpen) {
      setTranscript('');
      setListening(false);
      return;
    }

    setListening(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        if (event.results[0].isFinal) {
          setTimeout(() => {
            onSelectQuery(text);
            onClose();
          }, 800);
        }
      };

      recognition.onerror = () => {
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
      };

      try {
        recognition.start();
      } catch {}

      return () => {
        try {
          recognition.stop();
        } catch {}
      };
    } else {
      // Simulate listening timer for mock voice
      const timer = setTimeout(() => {
        setListening(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, onSelectQuery]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          {/* Animated Mic Wave */}
          <div className="relative my-4 flex items-center justify-center">
            {listening && (
              <>
                <span className="animate-ping absolute inline-flex h-24 w-24 rounded-full bg-blue-400 opacity-20"></span>
                <span className="animate-pulse absolute inline-flex h-20 w-20 rounded-full bg-blue-300 opacity-30"></span>
              </>
            )}
            <div className="w-16 h-16 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-lg relative z-10">
              <span className="material-symbols-outlined text-[32px]">mic</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-900">
            {listening ? 'Listening for Tourist Commands...' : 'Speak or Tap a Request'}
          </h3>

          <p className="text-xs text-slate-500 mt-1 min-h-[24px]">
            {transcript ? `"${transcript}"` : 'Say e.g. "Find best restaurant" or "Nearest hospital"'}
          </p>

          {/* Quick Voice Suggestions */}
          <div className="mt-5 text-left">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Popular Voice Commands
            </p>
            <div className="space-y-1.5">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectQuery(sug);
                    onClose();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-xs font-semibold text-slate-700 hover:text-[#2563EB] transition-colors flex items-center justify-between group"
                >
                  <span>"{sug}"</span>
                  <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">
                    arrow_forward
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

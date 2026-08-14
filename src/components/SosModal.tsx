import React, { useState, useEffect, useRef } from 'react';
import { Place } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospitals: Place[];
  onNavigateToHospital: (hospital: Place) => void;
}

export const SosModal: React.FC<SosModalProps> = ({
  isOpen,
  onClose,
  hospitals,
  onNavigateToHospital,
}) => {
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [locationCopied, setLocationCopied] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);

  // Simulated GPS Coordinates for Mumbai
  const gpsCoords = '18.9220° N, 72.8347° E (Colaba, Mumbai, India)';

  const emergencyContacts = [
    {
      title: 'National Emergency Number',
      number: '112',
      icon: 'local_police',
      color: 'bg-red-600 text-white',
      badge: '24/7 Police & Fire',
    },
    {
      title: 'Tourist Helpline (Incredible India)',
      number: '1363',
      icon: 'support_agent',
      color: 'bg-[#2563EB] text-white',
      badge: 'Multilingual Support',
    },
    {
      title: 'Ambulance & Medical',
      number: '108',
      icon: 'medical_services',
      color: 'bg-emerald-600 text-white',
      badge: 'Paramedic Dispatch',
    },
    {
      title: 'Women Safety Helpline',
      number: '1091',
      icon: 'shield',
      color: 'bg-purple-600 text-white',
      badge: 'Priority Patrol',
    },
  ];

  const handleCopyLocation = () => {
    navigator.clipboard?.writeText?.(
      `EMERGENCY: I am a tourist needing assistance at: ${gpsCoords}. Time: ${new Date().toLocaleTimeString()}`
    );
    setLocationCopied(true);
    setTimeout(() => setLocationCopied(false), 2500);
  };

  const toggleSiren = () => {
    if (sirenPlaying) {
      stopSiren();
    } else {
      startSiren();
    }
  };

  const startSiren = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      gain.gain.value = 0.3;

      osc.connect(gain);
      gain.connect(ctx.destination);

      let freq = 700;
      let rising = true;

      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
      setSirenPlaying(true);

      timerRef.current = window.setInterval(() => {
        if (!oscRef.current || !audioCtxRef.current) return;
        if (rising) {
          freq += 60;
          if (freq >= 1200) rising = false;
        } else {
          freq -= 60;
          if (freq <= 650) rising = true;
        }
        oscRef.current.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
      }, 50);
    } catch {
      setSirenPlaying(false);
    }
  };

  const stopSiren = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch {}
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
    }
    setSirenPlaying(false);
  };

  useEffect(() => {
    return () => {
      stopSiren();
    };
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end md:items-center justify-center p-0 md:p-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="bg-white w-full max-w-lg rounded-t-3xl md:rounded-3xl shadow-2xl border border-red-200 overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Alert Header */}
          <div className="bg-[#BA1A1A] text-white p-4.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                <span className="material-symbols-outlined text-[24px]">sos</span>
              </div>
              <div>
                <h2 className="text-lg font-black tracking-wide">Tourist Safety & SOS Hub</h2>
                <p className="text-xs text-red-100 font-medium">Instant Emergency Dispatch & Assistance</p>
              </div>
            </div>
            <button
              onClick={() => {
                stopSiren();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 space-y-4 overflow-y-auto flex-1 no-scrollbar">
            {/* Siren & Beacon Bar */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span
                  className={`material-symbols-outlined text-[24px] text-red-600 ${
                    sirenPlaying ? 'animate-bounce' : ''
                  }`}
                >
                  volume_up
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-900">Audible Distress Alarm</p>
                  <p className="text-[11px] text-slate-500">Emit loud acoustic alert to signal nearby help</p>
                </div>
              </div>
              <button
                onClick={toggleSiren}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide transition-all active:scale-95 flex items-center gap-1 ${
                  sirenPlaying
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-white text-red-700 border border-red-300 hover:bg-red-100'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {sirenPlaying ? 'stop' : 'warning'}
                </span>
                {sirenPlaying ? 'STOP ALARM' : 'START SIREN'}
              </button>
            </div>

            {/* GPS Broadcast Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#2563EB] text-[20px]">
                    share_location
                  </span>
                  <h3 className="text-xs font-bold text-slate-800">Your Current GPS Coordinates</h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  GPS Active
                </span>
              </div>
              <p className="text-xs font-mono font-semibold text-slate-700 mt-1.5">{gpsCoords}</p>
              <button
                onClick={handleCopyLocation}
                className="mt-2.5 w-full py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px] text-blue-600">
                  {locationCopied ? 'check' : 'content_copy'}
                </span>
                {locationCopied ? 'Copied to Clipboard!' : 'Copy & Share Coordinates'}
              </button>
            </div>

            {/* Emergency Speed Dial Grid */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Emergency Helplines
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {emergencyContacts.map((contact, idx) => (
                  <a
                    key={idx}
                    href={`tel:${contact.number}`}
                    className="p-3 bg-white border border-slate-200 rounded-xl hover:border-red-300 hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${contact.color}`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {contact.icon}
                        </span>
                      </div>
                      <span className="text-xs font-black text-slate-900 bg-slate-100 group-hover:bg-red-50 group-hover:text-red-700 px-2 py-0.5 rounded-md">
                        {contact.number}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">
                        {contact.title}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{contact.badge}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Nearest Emergency Hospitals */}
            {hospitals.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Nearest Emergency Hospitals
                </h3>
                <div className="space-y-2">
                  {hospitals.slice(0, 2).map((hosp) => (
                    <div
                      key={hosp.id}
                      className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0">
                          <span
                            className="material-symbols-outlined text-[18px]"
                            style={{ fontVariationSettings: '"FILL" 1' }}
                          >
                            local_hospital
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{hosp.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {hosp.distanceKm} km • {hosp.driveTimeMin} min drive
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          stopSiren();
                          onNavigateToHospital(hosp);
                          onClose();
                        }}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 flex-shrink-0"
                      >
                        <span className="material-symbols-outlined text-[14px]">navigation</span>
                        Route
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => {
                stopSiren();
                onClose();
              }}
              className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors"
            >
              Dismiss Safety Hub
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

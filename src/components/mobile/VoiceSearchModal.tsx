import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Mic, X, Sparkles, Volume2 } from 'lucide-react';

export const VoiceSearchModal: React.FC = () => {
  const {
    isVoiceSearchOpen,
    setIsVoiceSearchOpen,
    setSearchQuery,
    setActiveTab,
    addToast
  } = useApp();

  const [isListening, setIsListening] = useState(true);
  const [transcript, setTranscript] = useState('Listening... Speak now');

  useEffect(() => {
    if (isVoiceSearchOpen) {
      setIsListening(true);
      setTranscript('Listening... Speak now');
    }
  }, [isVoiceSearchOpen]);

  if (!isVoiceSearchOpen) return null;

  const handleVoiceCommand = (query: string) => {
    setTranscript(`"${query}"`);
    setIsListening(false);
    setTimeout(() => {
      setSearchQuery(query);
      setActiveTab('store');
      setIsVoiceSearchOpen(false);
      addToast('success', `Voice search found matches for "${query}"`, 'Alexa Search');
    }, 600);
  };

  const sampleVoicePrompts = [
    'Echo Dot 5th Gen',
    'Sony Noise Canceling Headphones',
    'Kindle Paperwhite',
    'Apple iPad Air',
    'Instant Pot'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={() => setIsVoiceSearchOpen(false)}
      />

      {/* Sheet Surface */}
      <div className="relative w-full max-w-md bg-[#131921] text-white rounded-t-3xl p-6 shadow-2xl flex flex-col items-center z-10 border-t border-slate-700 animate-in slide-in-from-bottom duration-200">
        {/* Grab bar */}
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mb-6" />

        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#00A8E1] animate-ping" />
            <span className="text-xs font-bold text-[#00A8E1] uppercase tracking-wider">
              Alexa Voice Search
            </span>
          </div>
          <button
            onClick={() => setIsVoiceSearchOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Voice Waves Simulation */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-[#00A8E1]/20 flex items-center justify-center animate-pulse">
            <div className="w-16 h-16 rounded-full bg-[#00A8E1] text-white flex items-center justify-center shadow-lg shadow-[#00A8E1]/40">
              <Mic className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Live speech feedback */}
        <div className="text-center mb-6">
          <div className="text-lg font-bold text-white mb-1">
            {transcript}
          </div>
          <p className="text-xs text-slate-400">
            Say a product name, brand, or department
          </p>
        </div>

        {/* Quick Voice Chips */}
        <div className="w-full space-y-2">
          <span className="text-[11px] text-slate-400 font-semibold block text-center">
            Or tap a voice query:
          </span>
          <div className="flex flex-wrap justify-center gap-1.5">
            {sampleVoicePrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleVoiceCommand(prompt)}
                className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition active:scale-95 flex items-center gap-1.5"
              >
                <Volume2 className="w-3 h-3 text-[#00A8E1]" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

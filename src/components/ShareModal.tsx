import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Copy,
  Check,
  Share2,
  QrCode,
  Send,
  MessageCircle
} from 'lucide-react';

export const ShareModal: React.FC = () => {
  const { isShareModalOpen, setIsShareModalOpen, shareData, addToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isShareModalOpen) return null;

  const url = shareData?.url || window.location.href;
  const title = shareData?.title || 'Amazon Prime Retail Ecosystem';
  const text = shareData?.text || 'Explore our Amazon shopping storefront!';

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    addToast('success', 'Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const handleShareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  };

  const handleShareEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={() => setIsShareModalOpen(false)}
      />

      {/* Surface */}
      <div className="relative w-full max-w-sm bg-white dark:bg-[#181c1d] text-slate-900 dark:text-slate-100 rounded-xl shadow-2xl overflow-hidden my-auto z-10 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-[#131921] text-white flex items-center justify-between border-b border-[#232F3E]">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#FF9900]" />
            <h3 className="text-sm font-bold">Share to Social Media</h3>
          </div>
          <button
            onClick={() => setIsShareModalOpen(false)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-slate-900 dark:text-white block truncate mb-1">
              {title}
            </span>
            <p className="text-slate-500 text-[11px] line-clamp-2">
              {text}
            </p>
          </div>

          {/* Social Channels */}
          <div className="grid grid-cols-4 gap-2 text-center">
            {/* WhatsApp */}
            <button
              onClick={handleShareWhatsApp}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-300 transition flex flex-col items-center gap-1 group"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">WhatsApp</span>
            </button>

            {/* X (Twitter) */}
            <button
              onClick={handleShareTwitter}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex flex-col items-center gap-1"
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-xs font-bold text-xs">
                𝕏
              </div>
              <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">Twitter</span>
            </button>

            {/* Email */}
            <button
              onClick={handleShareEmail}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-300 transition flex flex-col items-center gap-1"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Send className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">Email</span>
            </button>

            {/* QR Code */}
            <button
              onClick={() => setShowQr(!showQr)}
              className={`p-2.5 rounded-lg border transition flex flex-col items-center gap-1 ${
                showQr
                  ? 'border-[#FF9900] bg-amber-50 dark:bg-amber-950/30'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#FF9900] text-slate-950 flex items-center justify-center shadow-xs">
                <QrCode className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">QR Code</span>
            </button>
          </div>

          {/* QR Code Display if toggled */}
          {showQr && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
              {/* Scalable SVG QR code representation */}
              <div className="w-32 h-32 bg-white p-2 rounded-lg border shadow-xs flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path fill="#131921" d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z M40,10 h10 v10 h-10 z M50,40 h10 v10 h-10 z M30,50 h10 v10 h-10 z M70,70 h10 v10 h-10 z M80,80 h10 v10 h-10 z M40,70 h10 v20 h-10 z M60,60 h20 v10 h-20 z"/>
                </svg>
              </div>
              <span className="text-[11px] text-slate-500 mt-2">Scan with smartphone camera</span>
            </div>
          )}

          {/* Copy link bar */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Direct Link
            </label>
            <div className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <input
                type="text"
                readOnly
                value={url}
                className="flex-1 bg-transparent text-xs text-slate-600 dark:text-slate-300 outline-none truncate px-1"
              />
              <button
                onClick={handleCopy}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#FFD814] hover:bg-[#F7CA00] text-slate-900'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

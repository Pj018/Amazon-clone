import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  QrCode,
  X,
  Wallet,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const QRPayModal: React.FC = () => {
  const {
    isQRPayOpen,
    setIsQRPayOpen,
    user,
    addToast
  } = useApp();

  const [merchantName, setMerchantName] = useState('Seattle Whole Foods Market');
  const [payAmount, setPayAmount] = useState<string>('24.50');
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isQRPayOpen) return null;

  const currentBalance = user?.walletBalance || 245.50;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const amountNum = parseFloat(payAmount);

    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid payment amount.');
      return;
    }

    if (amountNum > currentBalance) {
      setError(`Insufficient Amazon Pay balance ($${currentBalance.toFixed(2)}). Please reduce amount or top up wallet.`);
      return;
    }

    if (user) {
      user.walletBalance -= amountNum;
      localStorage.setItem('amz_user_profile', JSON.stringify(user));
    }

    setIsPaid(true);
    addToast('success', `Paid $${amountNum.toFixed(2)} to ${merchantName}!`, 'Amazon Pay Success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={() => setIsQRPayOpen(false)}
      />

      {/* Surface */}
      <div className="relative w-full max-w-sm bg-white dark:bg-[#181c1d] text-slate-900 dark:text-slate-100 rounded-2xl shadow-2xl overflow-hidden my-auto z-10 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-[#131921] text-white flex items-center justify-between border-b border-[#232F3E]">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[#FF9900]" />
            <h3 className="text-sm font-bold">Amazon Pay · Scan & Pay</h3>
          </div>
          <button
            onClick={() => setIsQRPayOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {isPaid ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-300">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Payment Successful!
              </h4>
              <div className="text-2xl font-black font-mono text-emerald-600">
                ${parseFloat(payAmount).toFixed(2)}
              </div>
              <p className="text-xs text-slate-500">
                Paid to <strong>{merchantName}</strong> from Amazon Pay Wallet balance.
              </p>
              <div className="pt-3">
                <button
                  onClick={() => setIsQRPayOpen(false)}
                  className="w-full py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-slate-900 font-bold text-xs rounded-full shadow-xs"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePay} className="space-y-4">
              {/* QR Code Scanner preview */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center flex flex-col items-center">
                <div className="w-24 h-24 bg-white p-2 rounded-lg border shadow-xs mb-2">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path fill="#131921" d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z M40,10 h10 v10 h-10 z M50,40 h10 v10 h-10 z M30,50 h10 v10 h-10 z M70,70 h10 v10 h-10 z M80,80 h10 v10 h-10 z"/>
                  </svg>
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Scanned: {merchantName}
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold">
                  Verified Merchant QR · Instant Settlement
                </div>
              </div>

              {error && (
                <div className="p-2.5 bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Amount input */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Enter Payment Amount ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 font-bold text-slate-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-base font-bold font-mono outline-none focus:ring-2 focus:ring-[#FF9900]"
                  />
                </div>
              </div>

              {/* Wallet Balance status */}
              <div className="flex items-center justify-between text-xs p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <Wallet className="w-3.5 h-3.5 text-[#FF9900]" />
                  <span>Amazon Pay Balance</span>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ${currentBalance.toFixed(2)}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] text-slate-900 font-bold text-xs rounded-full transition shadow-xs flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm & Pay Now</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

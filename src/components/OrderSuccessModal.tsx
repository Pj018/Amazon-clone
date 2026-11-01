import React from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Calendar,
  Share2,
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';

export const OrderSuccessModal: React.FC = () => {
  const {
    confirmedOrder,
    setConfirmedOrder,
    setActiveTab,
    openShareModal
  } = useApp();

  if (!confirmedOrder) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={() => setConfirmedOrder(null)}
      />

      {/* Surface */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#181c1d] text-slate-900 dark:text-slate-100 rounded-xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col z-10 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        {/* Banner */}
        <div className="bg-[#131921] text-white p-6 border-b border-[#232F3E] text-center relative">
          <button
            onClick={() => setConfirmedOrder(null)}
            className="absolute top-4 right-4 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold tracking-tight">Order Placed, Thanks Alex!</h2>
          <p className="text-xs text-slate-300 mt-1">
            Confirmation was sent to your verified email address.
          </p>

          <div className="inline-block mt-3 px-3 py-1 bg-slate-800/80 rounded-md font-mono text-xs text-[#FF9900] border border-slate-700">
            Order #{confirmedOrder.id}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Prime Delivery Promise Card */}
          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-3">
            <Truck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                Estimated Delivery: {confirmedOrder.estimatedDelivery}
              </div>
              <div className="text-emerald-700 dark:text-emerald-400 mt-0.5">
                Tracking Number: <span className="font-mono font-bold">{confirmedOrder.trackingNumber}</span> via {confirmedOrder.carrier}
              </div>
            </div>
          </div>

          {/* Delivery Timeline Checkpoints */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Live Fulfillment Tracking
            </h4>
            <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {confirmedOrder.checkpoints.map((cp, idx) => (
                <div key={idx} className="flex items-start gap-3 relative text-xs">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 shrink-0 ${
                    cp.completed
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}>
                    {cp.completed ? <CheckCircle2 className="w-4 h-4" /> : <Package className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 dark:text-white">{cp.title}</div>
                    <div className="text-slate-500 text-[11px]">{cp.location} · {cp.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Item Summaries */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Ordered Items ({confirmedOrder.items.length})
            </h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {confirmedOrder.items.map(item => (
                <div key={item.productId} className="py-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 truncate max-w-sm">
                    <img src={item.image} alt={item.title} referrerPolicy="no-referrer" className="w-9 h-9 object-contain rounded border p-0.5" />
                    <div className="truncate">
                      <div className="font-medium truncate">{item.title}</div>
                      <div className="text-[11px] text-slate-400">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <span className="font-bold font-mono">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => {
                setConfirmedOrder(null);
                setActiveTab('customer_hub');
              }}
              className="py-2.5 px-4 bg-[#FFD814] hover:bg-[#F7CA00] text-slate-900 text-xs font-bold rounded-full transition flex items-center justify-center gap-2 shadow-xs"
            >
              <span>View in Your Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                openShareModal(
                  `Amazon Order #${confirmedOrder.id}`,
                  window.location.href,
                  `I just ordered items with Prime 1-day delivery on the Amazon Retail Ecosystem! Tracking ID: ${confirmedOrder.trackingNumber}`
                );
              }}
              className="py-2.5 px-4 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-2"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Delivery Status</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let bg = 'bg-white dark:bg-[#1f2833] border-slate-200 dark:border-slate-700';
        let icon = <Info className="w-5 h-5 text-blue-500 shrink-0" />;

        if (toast.type === 'success') {
          bg = 'bg-[#f0fbf0] dark:bg-[#122b17] border-green-300 dark:border-green-800 text-green-900 dark:text-green-100';
          icon = <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />;
        } else if (toast.type === 'error') {
          bg = 'bg-[#fff1f0] dark:bg-[#341416] border-red-300 dark:border-red-800 text-red-900 dark:text-red-100';
          icon = <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />;
        } else if (toast.type === 'warning') {
          bg = 'bg-[#fffbe6] dark:bg-[#302611] border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-100';
          icon = <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-lg border shadow-lg flex items-start gap-3 transition-all transform translate-y-0 ${bg}`}
          >
            {icon}
            <div className="flex-1 text-xs">
              {toast.title && <div className="font-semibold mb-0.5">{toast.title}</div>}
              <div className="opacity-90 leading-relaxed">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:opacity-75 rounded transition-opacity"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

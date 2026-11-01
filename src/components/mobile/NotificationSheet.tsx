import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  X,
  Package,
  Zap,
  ShieldCheck,
  CheckCheck,
  ChevronRight,
  Trash2
} from 'lucide-react';

export const NotificationSheet: React.FC = () => {
  const {
    isNotificationOpen,
    setIsNotificationOpen,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    setActiveTab
  } = useApp();

  const [filterType, setFilterType] = useState<'all' | 'order' | 'deal' | 'security'>('all');

  if (!isNotificationOpen) return null;

  const filtered = notifications.filter(n => filterType === 'all' || n.type === filterType);

  const handleNotificationClick = (item: any) => {
    markNotificationRead(item.id);
    if (item.linkTab) {
      setActiveTab(item.linkTab);
      setIsNotificationOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={() => setIsNotificationOpen(false)}
      />

      {/* Surface */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#181c1d] text-slate-900 dark:text-slate-100 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh] z-10 border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-200">
        {/* Grab bar */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-3 sm:hidden" />

        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#FF9900]" />
            <h3 className="text-sm font-bold">Notifications & Alerts</h3>
          </div>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-xs text-rose-500 hover:underline flex items-center gap-1"
                title="Clear all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
            <button
              onClick={() => setIsNotificationOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-5 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-slate-100 dark:border-slate-800 text-xs font-semibold">
          {(['all', 'order', 'deal', 'security'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-3 py-1 rounded-full transition whitespace-nowrap capitalize ${
                filterType === tab
                  ? 'bg-[#131921] text-[#FF9900] dark:bg-slate-800 font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab === 'all' ? 'All Alerts' : tab === 'order' ? 'Orders' : tab === 'deal' ? 'Lightning Deals' : 'Security'}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              <Bell className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
              <span>No notifications in this category</span>
            </div>
          ) : (
            filtered.map(item => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`py-3 flex items-start gap-3 cursor-pointer rounded-lg px-2 transition ${
                  !item.read ? 'bg-amber-50/50 dark:bg-amber-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                {/* Icon based on notification type */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  item.type === 'order'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : item.type === 'deal'
                    ? 'bg-amber-100 text-[#FF9900] dark:bg-amber-950'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                }`}>
                  {item.type === 'order' ? <Package className="w-4 h-4" /> : item.type === 'deal' ? <Zap className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                </div>

                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {!item.read && <span className="w-2 h-2 rounded-full bg-[#FF9900]" />}
                      {item.title}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                    {item.message}
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 self-center" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

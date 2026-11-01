import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  User,
  ShoppingBag,
  Sparkles,
  BarChart3,
  Truck,
  ShieldCheck,
  Headphones,
  Settings,
  LogOut,
  Moon,
  Sun,
  Globe,
  Wallet,
  Tag,
  BookOpen,
  Smartphone
} from 'lucide-react';

export const MobileMenuSheet: React.FC = () => {
  const {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    user,
    setActiveTab,
    setIsCustomerServiceOpen,
    darkMode,
    toggleDarkMode,
    logout,
    setIsAuthModalOpen
  } = useApp();

  if (!isMobileMenuOpen) return null;

  const navigateTo = (tab: any) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const openCustomerCare = () => {
    setIsMobileMenuOpen(false);
    setIsCustomerServiceOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Surface */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#181c1d] text-slate-900 dark:text-slate-100 rounded-t-3xl shadow-2xl flex flex-col h-[85vh] z-10 border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-200">
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-3" />

        {/* Profile Card Header */}
        <div className="px-5 py-3 bg-[#131921] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FF9900] text-slate-950 font-black flex items-center justify-center text-sm shadow-sm">
              {user ? user.name.slice(0, 2).toUpperCase() : 'AM'}
            </div>
            <div>
              <div className="text-sm font-bold">Hello, {user?.name || 'Guest'}</div>
              <div className="text-[11px] text-[#FF9900] font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Prime Member
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grid of Shortcuts */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
          {/* Quick Hub Tiles */}
          <div>
            <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-500 mb-2.5">
              Explore Amazon Ecosystem
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => navigateTo('spring_boot_hub')}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-emerald-500/40 text-left hover:border-emerald-500 transition active:scale-95 flex flex-col justify-between h-24 relative overflow-hidden"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="p-1 rounded bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                    Spring 3.3
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 text-[8px] font-black uppercase">
                    API
                  </span>
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Spring Boot Console</div>
                  <div className="text-[10px] text-slate-500">REST API & MySQL Swagger</div>
                </div>
              </button>

              <button
                onClick={() => navigateTo('seller_hub')}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-left hover:border-[#FF9900] transition active:scale-95 flex flex-col justify-between h-24 relative overflow-hidden"
              >
                <div className="flex items-center justify-between w-full">
                  <BarChart3 className="w-5 h-5 text-[#FF9900]" />
                  <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-[#FF9900] text-[8px] font-black uppercase">
                    Admin
                  </span>
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Seller Central</div>
                  <div className="text-[10px] text-slate-500">Manage products & orders</div>
                </div>
              </button>

              <button
                onClick={() => navigateTo('customer_hub')}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-left hover:border-[#FF9900] transition active:scale-95 flex flex-col justify-between h-24"
              >
                <User className="w-5 h-5 text-[#007185] dark:text-[#3db2c6]" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Your Orders & Hub</div>
                  <div className="text-[10px] text-slate-500">Track & return packages</div>
                </div>
              </button>

              <button
                onClick={() => navigateTo('logistics_hub')}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-left hover:border-[#FF9900] transition active:scale-95 flex flex-col justify-between h-24"
              >
                <Truck className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Logistics & Fleet</div>
                  <div className="text-[10px] text-slate-500">Live GPS courier tracking</div>
                </div>
              </button>

              <button
                onClick={() => navigateTo('security_hub')}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-left hover:border-[#FF9900] transition active:scale-95 flex flex-col justify-between h-24 col-span-2"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Security Vault & Backups</div>
                    <div className="text-[10px] text-slate-500">AES-256 Backups & Offline Sync Queue</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Help & Programs */}
          <div>
            <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-500 mb-2">
              Help & Settings
            </h4>
            <div className="space-y-1 bg-slate-50 dark:bg-slate-800/40 rounded-xl p-2 border border-slate-200 dark:border-slate-800">
              <button
                onClick={openCustomerCare}
                className="w-full p-2.5 rounded-lg text-left flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                <div className="flex items-center gap-2.5">
                  <Headphones className="w-4 h-4 text-[#007185] dark:text-[#3db2c6]" />
                  <span className="font-semibold">Customer Service 24/7 Chat</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  Online
                </span>
              </button>

              <button
                onClick={toggleDarkMode}
                className="w-full p-2.5 rounded-lg text-left flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                <div className="flex items-center gap-2.5">
                  {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                  <span className="font-semibold">Theme ({darkMode ? 'Dark' : 'Light'})</span>
                </div>
                <span className="text-xs text-slate-400">Switch</span>
              </button>
            </div>
          </div>

          {/* Account Actions */}
          <div className="pt-2">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400 font-bold flex items-center justify-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Amazon</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 bg-[#FFD814] text-slate-950 font-bold rounded-xl shadow-xs"
              >
                Sign In to Your Account
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

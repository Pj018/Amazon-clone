import React, { useState } from 'react';
import { useApp, ViewTab } from '../context/AppContext';
import {
  Menu,
  ShoppingBag,
  User,
  BarChart3,
  Truck,
  ShieldCheck,
  Zap,
  Sparkles,
  Gift,
  X
} from 'lucide-react';

export const SubNav: React.FC = () => {
  const { activeTab, setActiveTab, setSelectedCategory, resetFilters } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems: { tab: ViewTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { tab: 'store', label: 'Storefront', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
    { tab: 'customer_hub', label: 'Customer Hub & Orders', icon: <User className="w-3.5 h-3.5" /> },
    { tab: 'seller_hub', label: 'Seller Central Analytics', icon: <BarChart3 className="w-3.5 h-3.5" />, badge: 'LIVE' },
    { tab: 'logistics_hub', label: 'Logistics & Fleet', icon: <Truck className="w-3.5 h-3.5" /> },
    { tab: 'security_hub', label: 'Security & Backup Vault', icon: <ShieldCheck className="w-3.5 h-3.5" />, badge: 'AES-256' }
  ];

  const quickDeals = [
    { label: 'Today\'s Deals', action: () => { setActiveTab('store'); resetFilters(); } },
    { label: 'Prime Video & Audio', action: () => { setActiveTab('store'); setSelectedCategory('audio'); } },
    { label: 'Electronics', action: () => { setActiveTab('store'); setSelectedCategory('electronics'); } },
    { label: 'Kindle Books', action: () => { setActiveTab('store'); setSelectedCategory('books'); } },
    { label: 'Fashion & Apparel', action: () => { setActiveTab('store'); setSelectedCategory('fashion'); } },
    { label: 'Home Essentials', action: () => { setActiveTab('store'); setSelectedCategory('home'); } },
  ];

  return (
    <>
      <nav className="bg-[#232F3E] text-slate-200 text-xs select-none border-b border-[#1b2430]">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-4 py-1.5 flex items-center justify-between overflow-x-auto no-scrollbar gap-2 sm:gap-4">
          {/* Left: Drawer hamburger & Quick links */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-1 px-2 py-1 rounded hover:ring-1 hover:ring-white transition font-bold text-white shrink-0"
              aria-label="Open Navigation Directory"
            >
              <Menu className="w-4 h-4" />
              <span>All</span>
            </button>

            {/* Quick Departments */}
            <div className="hidden md:flex items-center gap-1">
              {quickDeals.map((deal, idx) => (
                <button
                  key={idx}
                  onClick={deal.action}
                  className="px-2 py-1 rounded hover:ring-1 hover:ring-white transition whitespace-nowrap text-slate-300 hover:text-white"
                >
                  {deal.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: The 5 Dedicated Ecosystem Dashboards */}
          <div className="flex items-center gap-1 shrink-0">
            {navItems.map((item) => {
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => setActiveTab(item.tab)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition whitespace-nowrap font-medium ${
                    isActive
                      ? 'bg-[#131921] text-[#FF9900] ring-1 ring-[#FF9900]'
                      : 'hover:bg-slate-700/60 text-slate-200'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1 py-0.2 rounded font-extrabold bg-[#FF9900]/20 text-[#FF9900] border border-[#FF9900]/40">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Slide-out "All" Category & Ecosystem Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 transition-opacity backdrop-blur-xs"
            onClick={() => setDrawerOpen(false)}
          />

          <div className="relative w-80 max-w-[85vw] bg-white dark:bg-[#181c1d] text-slate-900 dark:text-slate-100 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="bg-[#232F3E] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FF9900] text-slate-950 font-black flex items-center justify-center text-sm">
                  AR
                </div>
                <div>
                  <div className="text-sm font-bold">Hello, Alex</div>
                  <div className="text-[11px] text-[#FF9900] font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Prime Member
                  </div>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 text-sm">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Digital Content & Devices
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => { setSelectedCategory('audio'); setActiveTab('store'); setDrawerOpen(false); }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Amazon Echo & Alexa Audio
                  </button>
                  <button
                    onClick={() => { setSelectedCategory('books'); setActiveTab('store'); setDrawerOpen(false); }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Kindle E-readers & Books
                  </button>
                  <button
                    onClick={() => { setSelectedCategory('electronics'); setActiveTab('store'); setDrawerOpen(false); }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Fire Tablets & Smart Gadgets
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Shop by Department
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => { setSelectedCategory('electronics'); setActiveTab('store'); setDrawerOpen(false); }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Electronics & Computers
                  </button>
                  <button
                    onClick={() => { setSelectedCategory('home'); setActiveTab('store'); setDrawerOpen(false); }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Home, Kitchen & Smart Living
                  </button>
                  <button
                    onClick={() => { setSelectedCategory('fashion'); setActiveTab('store'); setDrawerOpen(false); }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Clothing, Shoes & Jewelry
                  </button>
                  <button
                    onClick={() => { setSelectedCategory('beauty'); setActiveTab('store'); setDrawerOpen(false); }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Beauty & Personal Care
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Programs & Features
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => { setActiveTab('customer_hub'); setDrawerOpen(false); }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between"
                  >
                    <span>Your Orders & Returns</span>
                    <span className="text-xs text-slate-400">Track & Return</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('seller_hub'); setDrawerOpen(false); }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between"
                  >
                    <span>Seller Central Console</span>
                    <span className="text-xs text-[#FF9900] font-bold">Analytics</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('logistics_hub'); setDrawerOpen(false); }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between"
                  >
                    <span>Fleet & Logistics Center</span>
                    <span className="text-xs text-slate-400">Live GPS</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('security_hub'); setDrawerOpen(false); }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between"
                  >
                    <span>Security & Encrypted Backups</span>
                    <span className="text-xs text-emerald-500 font-bold">Verified</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

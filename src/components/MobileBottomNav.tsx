import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  User,
  LayoutGrid,
  ShoppingCart,
  Menu,
  BarChart3
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    cart,
    setIsCartOpen,
    setIsMobileMenuOpen
  } = useApp();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#131921] border-t border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 grid grid-cols-5 items-center h-14 pb-safe select-none shadow-xl">
      {/* Tab 1: Home */}
      <button
        onClick={() => {
          setActiveTab('store');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center justify-center h-full active:scale-95 transition ${
          activeTab === 'store' ? 'text-[#FF9900] font-bold' : 'hover:text-slate-900 dark:hover:text-white'
        }`}
        aria-label="Amazon Home"
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Home</span>
      </button>

      {/* Tab 2: You */}
      <button
        onClick={() => setActiveTab('customer_hub')}
        className={`flex flex-col items-center justify-center h-full active:scale-95 transition ${
          activeTab === 'customer_hub' ? 'text-[#FF9900] font-bold' : 'hover:text-slate-900 dark:hover:text-white'
        }`}
        aria-label="Your Account"
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">You</span>
      </button>

      {/* Tab 3: Dashboards */}
      <button
        onClick={() => {
          if (activeTab === 'seller_hub') setActiveTab('logistics_hub');
          else if (activeTab === 'logistics_hub') setActiveTab('security_hub');
          else setActiveTab('seller_hub');
        }}
        className={`flex flex-col items-center justify-center h-full active:scale-95 transition ${
          activeTab === 'seller_hub' || activeTab === 'logistics_hub' || activeTab === 'security_hub' || activeTab === 'spring_boot_hub'
            ? 'text-[#FF9900] font-bold'
            : 'hover:text-slate-900 dark:hover:text-white'
        }`}
        aria-label="Merchant & Logistics Dashboards"
      >
        <BarChart3 className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Dashboards</span>
      </button>

      {/* Tab 4: Cart */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center justify-center h-full relative active:scale-95 transition hover:text-slate-900 dark:hover:text-white"
        aria-label={`Cart with ${cartCount} items`}
      >
        <div className="relative">
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[#FF9900] text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5">Cart</span>
      </button>

      {/* Tab 5: Menu */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="flex flex-col items-center justify-center h-full active:scale-95 transition hover:text-slate-900 dark:hover:text-white"
        aria-label="Amazon Menu"
      >
        <Menu className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Menu</span>
      </button>
    </nav>
  );
};

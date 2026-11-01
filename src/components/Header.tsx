import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockProducts';
import {
  Search,
  ShoppingCart,
  MapPin,
  Moon,
  Sun,
  Wifi,
  WifiOff,
  Smartphone,
  Monitor,
  Share2,
  RefreshCw,
  UserCheck,
  LogIn
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    user,
    cart,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    darkMode,
    toggleDarkMode,
    isOffline,
    toggleOfflineMode,
    pendingSyncCount,
    triggerManualSync,
    mobileFrameMode,
    setMobileFrameMode,
    setActiveTab,
    setIsCartOpen,
    setIsAuthModalOpen,
    openShareModal
  } = useApp();

  const [isSyncing, setIsSyncing] = useState(false);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await triggerManualSync();
    setIsSyncing(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab('store');
  };

  return (
    <header className="bg-[#131921] text-white sticky top-0 z-40 select-none shadow-md">
      {/* Offline Alert Strip if offline */}
      {isOffline && (
        <div className="bg-amber-600 px-4 py-1.5 text-xs font-medium text-center text-white flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5" />
          <span>You are currently working OFFLINE. All orders and changes will automatically synchronize when reconnected.</span>
          <button
            onClick={toggleOfflineMode}
            className="underline ml-2 hover:text-amber-200"
          >
            Reconnect Now
          </button>
        </div>
      )}

      {/* Main Top Bar */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 py-2.5 flex items-center gap-2 sm:gap-4">
        {/* Brand & Logo */}
        <button
          onClick={() => setActiveTab('store')}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:ring-1 hover:ring-white transition shrink-0 text-left"
          aria-label="Amazon Home"
        >
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-tight leading-none text-white flex items-baseline">
              amazon<span className="text-[#FF9900] text-xs font-bold ml-0.5">prime</span>
            </span>
            <span className="text-[9px] text-slate-300 font-medium tracking-wider uppercase -mt-0.5">
              Retail Ecosystem
            </span>
          </div>
        </button>

        {/* Deliver to address pill (Desktop) */}
        <button
          onClick={() => setActiveTab('customer_hub')}
          className="hidden md:flex items-center gap-1.5 px-2 py-1.5 rounded hover:ring-1 hover:ring-white transition text-xs shrink-0 text-left"
          title="Change delivery location"
        >
          <MapPin className="w-4 h-4 text-slate-300 mt-1" />
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-300">Deliver to {user?.name.split(' ')[0] || 'Guest'}</span>
            <span className="font-bold text-xs truncate max-w-[110px]">
              {user?.savedAddresses[0]?.city || 'Seattle'} {user?.savedAddresses[0]?.zipCode || '98101'}
            </span>
          </div>
        </button>

        {/* Central Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 flex items-center min-w-[180px] max-w-3xl h-10 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#FF9900]"
        >
          {/* Category Dropdown */}
          <div className="relative hidden sm:block h-full bg-slate-100 border-r border-slate-300 text-slate-800 text-xs">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-full px-2.5 bg-transparent border-0 outline-none text-xs cursor-pointer font-medium"
              aria-label="Select Category"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Amazon Prime, brands, devices, books..."
            className="flex-1 px-3 text-sm text-slate-900 placeholder:text-slate-500 outline-none h-full bg-white"
          />

          {/* Search Submit Button */}
          <button
            type="submit"
            className="bg-[#FF9900] hover:bg-[#e68a00] h-full px-4 text-[#131921] transition flex items-center justify-center shrink-0"
            aria-label="Search"
          >
            <Search className="w-4 h-4 text-[#131921] stroke-[2.5]" />
          </button>
        </form>

        {/* Action Controls & Account */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* View Mode Switcher: Mobile phone simulator vs Desktop */}
          <button
            onClick={() => setMobileFrameMode(prev => !prev)}
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded transition border ${
              mobileFrameMode
                ? 'bg-[#FF9900] text-slate-900 font-bold border-[#FF9900]'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-500'
            }`}
            title="Toggle between Mobile App Frame and Full Desktop view"
          >
            {mobileFrameMode ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span>{mobileFrameMode ? 'Exit Mobile Frame' : 'Mobile View'}</span>
          </button>

          {/* Offline simulator toggle */}
          <button
            onClick={toggleOfflineMode}
            className={`flex items-center gap-1 px-2 py-1.5 text-xs rounded transition border ${
              isOffline
                ? 'bg-amber-900/60 border-amber-600 text-amber-200'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title={isOffline ? 'Offline Mode (Click to Go Online)' : 'Online (Click to Simulate Offline)'}
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="hidden xl:inline">{isOffline ? 'Offline' : 'Online'}</span>
            {pendingSyncCount > 0 && (
              <span className="bg-[#FF9900] text-slate-900 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {pendingSyncCount}
              </span>
            )}
          </button>

          {/* Sync Trigger button if items pending */}
          {pendingSyncCount > 0 && !isOffline && (
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 text-xs flex items-center gap-1 transition"
              title="Sync pending transactions to database"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#FF9900] ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
          )}

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition"
            aria-label="Toggle Dark Mode"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>

          {/* Social Share profile/store */}
          <button
            onClick={() =>
              openShareModal(
                'Amazon Prime Retail Ecosystem',
                window.location.href,
                'Explore the next-gen Amazon retail platform with real-time analytics, instant checkout, and encrypted sync!'
              )
            }
            className="p-2 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition hidden sm:flex"
            title="Share store & profile"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* User Account / Lists */}
          {user ? (
            <button
              onClick={() => setActiveTab('customer_hub')}
              className="hidden sm:flex flex-col px-2 py-1 rounded hover:ring-1 hover:ring-white transition text-left shrink-0"
            >
              <span className="text-[11px] text-slate-300">Hello, {user.name.split(' ')[0]}</span>
              <span className="font-bold text-xs flex items-center gap-1">
                Account & Lists
                {user.isPrimeMember && (
                  <span className="text-[10px] text-[#FF9900] font-extrabold uppercase">Prime</span>
                )}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 rounded transition shrink-0"
            >
              <LogIn className="w-3.5 h-3.5 text-[#FF9900]" />
              <span>Sign In</span>
            </button>
          )}

          {/* Returns & Orders (Desktop) */}
          <button
            onClick={() => setActiveTab('customer_hub')}
            className="hidden lg:flex flex-col px-2 py-1 rounded hover:ring-1 hover:ring-white transition text-left shrink-0"
          >
            <span className="text-[11px] text-slate-300">Returns</span>
            <span className="font-bold text-xs">& Orders</span>
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded hover:ring-1 hover:ring-white transition relative text-white shrink-0"
            aria-label={`Shopping Cart with ${cartItemCount} items`}
          >
            <div className="relative">
              <ShoppingCart className="w-6 h-6 text-white" />
              <span className="absolute -top-1.5 -right-2 bg-[#FF9900] text-slate-950 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                {cartItemCount}
              </span>
            </div>
            <span className="font-bold text-xs hidden sm:inline ml-1">Cart</span>
          </button>
        </div>
      </div>
    </header>
  );
};

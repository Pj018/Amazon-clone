import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Mic,
  Camera,
  QrCode,
  Bell,
  MapPin,
  ChevronDown,
  Moon,
  Sun,
  X,
  WifiOff,
  ShoppingCart,
  ShoppingBag,
  User,
  BarChart3,
  Truck,
  ShieldCheck,
  Server
} from 'lucide-react';

export const MobileHeader: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedAddress,
    setIsAddressSheetOpen,
    setIsVoiceSearchOpen,
    setIsLensScannerOpen,
    setIsQRPayOpen,
    setIsNotificationOpen,
    unreadNotificationsCount,
    darkMode,
    toggleDarkMode,
    isOffline,
    toggleOfflineMode,
    activeTab,
    setActiveTab,
    cart,
    setIsCartOpen
  } = useApp();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const hubTabs = [
    { id: 'store', label: 'Store', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
    { id: 'spring_boot_hub', label: 'Spring Boot API', icon: <Server className="w-3.5 h-3.5 text-emerald-400" />, badge: 'v3.3' },
    { id: 'seller_hub', label: 'Seller Central', icon: <BarChart3 className="w-3.5 h-3.5 text-[#FF9900]" />, badge: 'LIVE' },
    { id: 'customer_hub', label: 'Orders & You', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'logistics_hub', label: 'Logistics Fleet', icon: <Truck className="w-3.5 h-3.5" /> },
    { id: 'security_hub', label: 'Security Vault', icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#131921] text-white select-none shadow-md w-full">
      {/* Offline Alert Strip */}
      {isOffline && (
        <div className="bg-amber-600 px-3 py-1 text-[11px] font-medium flex items-center justify-between text-white w-full">
          <div className="flex items-center gap-1.5 truncate">
            <WifiOff className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Offline Mode active. Syncing when connected.</span>
          </div>
          <button
            onClick={toggleOfflineMode}
            className="underline text-[10px] shrink-0 font-bold ml-2 hover:text-amber-200"
          >
            Reconnect
          </button>
        </div>
      )}

      {/* Top row: Brand mark & Action Icons */}
      <div className="px-3 pt-2.5 pb-2 flex items-center justify-between gap-2 w-full">
        {/* Amazon Logo */}
        <button
          onClick={() => setActiveTab('store')}
          className="flex items-baseline text-left shrink-0 active:scale-95 transition-transform"
          aria-label="Amazon Prime Home"
        >
          <span className="text-xl sm:text-2xl font-black tracking-tight leading-none text-white flex items-baseline">
            amazon<span className="text-[#FF9900] text-xs font-bold ml-0.5">prime</span>
          </span>
        </button>

        {/* Action icons row (Scan & Pay, Notifications, Theme, Cart) */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Amazon Pay QR Scanner */}
          <button
            onClick={() => setIsQRPayOpen(true)}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-200 active:scale-90 transition"
            aria-label="Scan & Pay QR"
            title="Scan UPI / Amazon Pay QR"
          >
            <QrCode className="w-4 h-4 text-[#FF9900]" />
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => setIsNotificationOpen(true)}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-200 relative active:scale-90 transition"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#FF9900] text-slate-950 font-black text-[9px] rounded-full flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Dark / Light Mode */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-200 active:scale-90 transition"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>

          {/* Cart Icon with Counter */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-200 relative active:scale-90 transition"
            aria-label={`Shopping cart with ${cartCount} items`}
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 bg-[#FF9900] text-slate-950 font-black text-[9px] rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Center Search Input with Mic and Camera icons (100% width, flexible) */}
      <div className="px-3 pb-2 w-full">
        <div className="h-10 w-full bg-white rounded-lg flex items-center px-2.5 shadow-xs focus-within:ring-2 focus-within:ring-[#FF9900]">
          <Search className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Amazon Prime products..."
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-500 outline-none min-w-0"
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 mr-1 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Lens Camera Icon */}
          <button
            type="button"
            onClick={() => setIsLensScannerOpen(true)}
            className="p-1.5 text-slate-500 hover:text-slate-800 active:scale-95 transition shrink-0"
            title="Amazon Lens Camera Scanner"
            aria-label="Amazon Lens"
          >
            <Camera className="w-4 h-4 text-slate-600" />
          </button>

          {/* Voice Search Mic Icon */}
          <button
            type="button"
            onClick={() => setIsVoiceSearchOpen(true)}
            className="p-1.5 text-slate-500 hover:text-[#007185] active:scale-95 transition shrink-0"
            title="Alexa Voice Search"
            aria-label="Alexa Voice Search"
          >
            <Mic className="w-4 h-4 text-[#007185]" />
          </button>
        </div>
      </div>

      {/* Deliver To Address Strip (Iconic Amazon dark cyan/navy bar) */}
      <button
        onClick={() => setIsAddressSheetOpen(true)}
        className="w-full bg-[#232F3E] text-slate-200 px-3 py-2 flex items-center justify-between text-xs hover:bg-[#2b3a4c] transition active:bg-[#1b2430]"
      >
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <span className="truncate text-[11px] sm:text-xs">
            Deliver to {selectedAddress.fullName.split(' ')[0]} - {selectedAddress.city} {selectedAddress.zipCode}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
      </button>

      {/* Quick Ecosystem Hub Navigation Bar */}
      <div className="bg-[#1b2430] px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-slate-800 w-full text-xs">
        {hubTabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full whitespace-nowrap transition text-[11px] font-semibold shrink-0 ${
                isActive
                  ? 'bg-[#FF9900] text-slate-950 font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="bg-[#cc0c39] text-white text-[8px] font-black px-1 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};

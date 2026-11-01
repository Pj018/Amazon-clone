import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileHeader } from './components/mobile/MobileHeader';
import { Storefront } from './components/Storefront';
import { CustomerDashboard } from './components/dashboards/CustomerDashboard';
import { SellerDashboard } from './components/dashboards/SellerDashboard';
import { LogisticsDashboard } from './components/dashboards/LogisticsDashboard';
import { SecurityBackupDashboard } from './components/dashboards/SecurityBackupDashboard';
import { SpringBootConsole } from './components/dashboards/SpringBootConsole';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileFrame } from './components/MobileFrame';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AuthModal } from './components/AuthModal';
import { ShareModal } from './components/ShareModal';
import { ToastContainer } from './components/Toast';

// Native Mobile Feature Sheets
import { VoiceSearchModal } from './components/mobile/VoiceSearchModal';
import { LensScannerModal } from './components/mobile/LensScannerModal';
import { QRPayModal } from './components/mobile/QRPayModal';
import { NotificationSheet } from './components/mobile/NotificationSheet';
import { AddressBottomSheet } from './components/mobile/AddressBottomSheet';
import { CustomerServiceChatModal } from './components/mobile/CustomerServiceChatModal';
import { ARViewModal } from './components/mobile/ARViewModal';
import { MobileMenuSheet } from './components/mobile/MobileMenuSheet';
import { Headphones } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setIsCustomerServiceOpen } = useApp();

  return (
    <MobileFrame>
      <div className="w-full min-h-screen flex flex-col bg-[#EAEDED] dark:bg-[#12161b] text-slate-900 dark:text-slate-100 transition-colors relative pb-16 overflow-x-hidden">
        {/* Unified 100% Full-Width Mobile Application Header */}
        <MobileHeader />

        <main className="flex-1 w-full px-2.5 sm:px-4 py-3 max-w-7xl mx-auto">
          {activeTab === 'store' && <Storefront />}
          {activeTab === 'spring_boot_hub' && <SpringBootConsole />}
          {activeTab === 'customer_hub' && <CustomerDashboard />}
          {activeTab === 'seller_hub' && <SellerDashboard />}
          {activeTab === 'logistics_hub' && <LogisticsDashboard />}
          {activeTab === 'security_hub' && <SecurityBackupDashboard />}
        </main>

        {/* Amazon Mobile Bottom Tab Bar */}
        <MobileBottomNav />

        {/* Floating 24/7 Customer Care Assistant shortcut */}
        <button
          onClick={() => setIsCustomerServiceOpen(true)}
          className="fixed bottom-16 right-3 z-30 px-3 py-2 rounded-full bg-[#131921] hover:bg-[#232F3E] text-white shadow-xl border border-slate-700 flex items-center gap-1.5 active:scale-95 transition"
          aria-label="24/7 Amazon Customer Care Assistant"
          title="Amazon Customer Care Chat"
        >
          <div className="relative">
            <Headphones className="w-4 h-4 text-[#FF9900]" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5" />
          </div>
          <span className="text-[10px] font-bold">24/7 Care</span>
        </button>

        {/* Global Modals & Native Mobile Overlays */}
        <ProductDetailModal />
        <CartDrawer />
        <CheckoutModal />
        <OrderSuccessModal />
        <AuthModal />
        <ShareModal />
        <ToastContainer />

        {/* Native Mobile Feature Sheets */}
        <VoiceSearchModal />
        <LensScannerModal />
        <QRPayModal />
        <NotificationSheet />
        <AddressBottomSheet />
        <CustomerServiceChatModal />
        <ARViewModal />
        <MobileMenuSheet />
      </div>
    </MobileFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

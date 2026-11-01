import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import {
  Package,
  RotateCcw,
  Sparkles,
  Wallet,
  MapPin,
  CreditCard,
  CheckCircle2,
  Clock,
  ChevronRight,
  AlertCircle,
  QrCode,
  DollarSign,
  Share2
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const {
    user,
    orders,
    requestReturn,
    openShareModal,
    addToast
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'returns' | 'prime' | 'wallet' | 'addresses'>('orders');
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState<string>('Item defective or does not work');
  const [walletRechargeAmount, setWalletRechargeAmount] = useState<number>(50);

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForReturn) return;
    requestReturn(selectedOrderForReturn.id, returnReason);
    setSelectedOrderForReturn(null);
  };

  const handleRechargeWallet = () => {
    if (user) {
      user.walletBalance += walletRechargeAmount;
      localStorage.setItem('amz_user_profile', JSON.stringify(user));
      addToast('success', `Added $${walletRechargeAmount.toFixed(2)} to Amazon Pay Wallet!`, 'Wallet Recharged');
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-6 space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
            alt={user?.name || 'User'}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-full object-cover border-2 border-[#FF9900] shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Your Account · {user?.name || 'Alex Rivera'}
              </h1>
              {user?.isPrimeMember && (
                <span className="text-xs font-black text-[#007185] dark:text-[#3db2c6] italic px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800">
                  prime
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Member since {user?.primeMemberSince || '2021'} · Primary account: {user?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              openShareModal(
                `${user?.name}'s Amazon Profile & Lists`,
                window.location.href,
                `View ${user?.name}'s curated shopping list and verified reviews on Amazon!`
              )
            }
            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Profile</span>
          </button>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'orders', label: 'Your Orders', icon: <Package className="w-4 h-4" /> },
          { id: 'returns', label: 'Returns & Refunds', icon: <RotateCcw className="w-4 h-4" /> },
          { id: 'prime', label: 'Prime Membership', icon: <Sparkles className="w-4 h-4" /> },
          { id: 'wallet', label: 'Amazon Pay Wallet', icon: <Wallet className="w-4 h-4" /> },
          { id: 'addresses', label: 'Addresses & Security', icon: <MapPin className="w-4 h-4" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-lg transition whitespace-nowrap border-b-2 -mb-[2px] ${
              activeSubTab === tab.id
                ? 'border-[#FF9900] text-[#FF9900] bg-white dark:bg-[#181c1d]'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* SUB-TAB 1: Your Orders */}
      {activeSubTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span><strong>{orders.length} orders</strong> placed in past 3 months</span>
          </div>

          <div className="space-y-4">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs"
              >
                {/* Order Top Strip */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 sm:px-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">Order Placed</div>
                      <div className="font-medium text-slate-900 dark:text-white">{order.date}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">Total</div>
                      <div className="font-mono font-bold text-slate-900 dark:text-white">${order.total.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">Ship To</div>
                      <div className="font-medium text-slate-900 dark:text-white">{order.shippingAddress.fullName}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Order # {order.id}</div>
                    <div className="text-[#007185] dark:text-[#3db2c6] hover:underline cursor-pointer">
                      View invoice & receipt
                    </div>
                  </div>
                </div>

                {/* Order Status & Items */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row items-start justify-between gap-4">
                  <div className="flex-1 space-y-4">
                    {/* Status badge */}
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : order.status === 'Returned'
                          ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {order.status}
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {order.estimatedDelivery}
                      </span>
                    </div>

                    {/* Items List */}
                    <div className="space-y-3">
                      {order.items.map(item => (
                        <div key={item.productId} className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="w-16 h-16 object-contain rounded border border-slate-200 dark:border-slate-800 p-1 bg-white dark:bg-slate-900 shrink-0"
                          />
                          <div className="text-xs flex-1">
                            <h4 className="font-semibold text-slate-900 dark:text-white line-clamp-2">
                              {item.title}
                            </h4>
                            <div className="text-slate-500 mt-0.5">
                              Qty: {item.quantity} · Price: ${item.price.toFixed(2)}
                            </div>
                            <div className="text-[#007185] dark:text-[#3db2c6] text-[11px] font-medium mt-1">
                              Eligible for return through 30 days
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="w-full md:w-56 flex flex-col gap-2 shrink-0 pt-2 md:pt-0">
                    <button
                      onClick={() =>
                        addToast('info', `Tracking ID: ${order.trackingNumber} · Carrier: ${order.carrier}`, 'Carrier Tracking')
                      }
                      className="w-full py-1.5 px-3 bg-[#FFD814] hover:bg-[#F7CA00] text-slate-900 text-xs font-bold rounded-md transition text-center shadow-xs"
                    >
                      Track Package
                    </button>

                    {order.status !== 'Returned' && (
                      <button
                        onClick={() => setSelectedOrderForReturn(order)}
                        className="w-full py-1.5 px-3 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition text-center"
                      >
                        Return or Replace Items
                      </button>
                    )}

                    <button
                      onClick={() =>
                        openShareModal(
                          `Order #${order.id}`,
                          window.location.href,
                          `Check out my order with tracking #${order.trackingNumber}`
                        )
                      }
                      className="w-full py-1.5 px-3 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition flex items-center justify-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Order Status</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Returns & Refunds */}
      {activeSubTab === 'returns' && (
        <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-[#FF9900]" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Returns & Refund Center
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Enjoy hassle-free drop-offs at thousands of locations including Whole Foods, UPS Stores, and Amazon Lockers. No box or label needed.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="font-bold text-xs text-slate-900 dark:text-white mb-1">
                1. Start a Return
              </div>
              <p className="text-xs text-slate-500">
                Choose the items and tell us the reason for the return.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="font-bold text-xs text-slate-900 dark:text-white mb-1">
                2. Show QR Code
              </div>
              <p className="text-xs text-slate-500">
                Bring items to any UPS or Amazon Dropoff point. Simply show your mobile QR code.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="font-bold text-xs text-slate-900 dark:text-white mb-1">
                3. Instant Refund
              </div>
              <p className="text-xs text-slate-500">
                Refund issued instantly to your original payment method or Amazon Pay Wallet.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
              Returned Orders History
            </h4>
            {orders.filter(o => o.status === 'Returned').length === 0 ? (
              <div className="text-xs text-slate-500 italic p-4 text-center bg-slate-50 dark:bg-slate-800/20 rounded-lg">
                No active return requests. All orders are fulfilled satisfactorily!
              </div>
            ) : (
              <div className="space-y-3">
                {orders.filter(o => o.status === 'Returned').map(order => (
                  <div key={order.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Order #{order.id}</div>
                      <div className="text-slate-500 mt-0.5">Return initiated · Refund of ${order.total.toFixed(2)} processed</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">QR Dropoff Ready</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Prime Membership */}
      {activeSubTab === 'prime' && (
        <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#007185] text-white flex items-center justify-center font-black italic text-lg">
                prime
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Amazon Prime Membership Benefits
                </h3>
                <p className="text-xs text-slate-500">
                  Next renewal date: October 28, 2027 · Annual plan ($139/year)
                </p>
              </div>
            </div>
            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
              Active Member
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-xs text-[#007185] dark:text-[#3db2c6] mb-1">
                Fast, Free Delivery
              </h4>
              <p className="text-xs text-slate-500">
                Unlimited FREE One-Day & Same-Day delivery on over 20 million items.
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-xs text-[#007185] dark:text-[#3db2c6] mb-1">
                Prime Video & Music
              </h4>
              <p className="text-xs text-slate-500">
                Stream award-winning Amazon Originals and 100 million songs ad-free in lossless audio.
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-xs text-[#007185] dark:text-[#3db2c6] mb-1">
                Exclusive Deals & Savings
              </h4>
              <p className="text-xs text-slate-500">
                Early access to Lightning Deals and 5% back with Amazon Prime Visa.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Amazon Pay Wallet */}
      {activeSubTab === 'wallet' && (
        <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#FF9900]" />
                Amazon Pay Wallet Balance
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Use your wallet balance for seamless 1-Click checkout and instant returns.
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                ${user?.walletBalance.toFixed(2) || '245.50'}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold">Available Funds</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Top Up Wallet Balance
            </h4>
            <div className="flex items-center gap-2 flex-wrap">
              {[25, 50, 100, 200].map(amt => (
                <button
                  key={amt}
                  onClick={() => setWalletRechargeAmount(amt)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold border transition ${
                    walletRechargeAmount === amt
                      ? 'border-[#FF9900] bg-[#FFD814] text-slate-950'
                      : 'border-slate-300 dark:border-slate-700 hover:border-slate-500'
                  }`}
                >
                  + ${amt}
                </button>
              ))}
              <button
                onClick={handleRechargeWallet}
                className="px-5 py-1.5 bg-[#FFA41C] hover:bg-[#FA8900] text-slate-950 text-xs font-bold rounded-md transition shadow-xs"
              >
                Recharge Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: Addresses & Security */}
      {activeSubTab === 'addresses' && (
        <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#FF9900]" />
              Saved Addresses & Encrypted Payment Methods
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage your default fulfillment addresses and securely tokenized credit cards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user?.savedAddresses.map((addr, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1 text-xs"
              >
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>{addr.fullName}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.2 rounded font-semibold">
                      Default
                    </span>
                  )}
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  {addr.street}
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  {addr.city}, {addr.state} {addr.zipCode}
                </div>
                <div className="text-slate-500 text-[11px] pt-1">
                  Phone: {addr.phone}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Return Request Modal */}
      {selectedOrderForReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            onClick={() => setSelectedOrderForReturn(null)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-[#181c1d] rounded-xl shadow-2xl p-6 z-10 space-y-4 border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Initiate Return for Order #{selectedOrderForReturn.id}
            </h3>
            <form onSubmit={handleReturnSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Why are you returning this?
                </label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                >
                  <option value="Item defective or does not work">Item defective or does not work</option>
                  <option value="Incompatible or not useful">Incompatible or not useful</option>
                  <option value="Wrong item was sent">Wrong item was sent</option>
                  <option value="Item arrived too late">Item arrived too late</option>
                  <option value="Better price available">Better price available</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-slate-500">
                Refund of <strong className="text-slate-900 dark:text-white">${selectedOrderForReturn.total.toFixed(2)}</strong> will be credited directly to your Amazon Pay Wallet upon drop-off.
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForReturn(null)}
                  className="px-4 py-2 border rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-slate-900 font-bold rounded-md transition shadow-xs"
                >
                  Confirm Return & Get QR Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

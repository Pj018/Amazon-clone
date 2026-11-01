import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Check,
  Tag,
  ArrowRight,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    setIsCheckoutOpen,
    addToast
  } = useApp();

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent?: number; amount?: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const rawSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let discount = 0;
  if (appliedDiscount?.percent) {
    discount = (rawSubtotal * appliedDiscount.percent) / 100;
  } else if (appliedDiscount?.amount) {
    discount = Math.min(appliedDiscount.amount, rawSubtotal);
  }

  const finalSubtotal = Math.max(0, rawSubtotal - discount);
  const freeShippingThreshold = 35;
  const freeShippingProgress = Math.min(100, (finalSubtotal / freeShippingThreshold) * 100);
  const remainingForFree = Math.max(0, freeShippingThreshold - finalSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponCode.trim().toUpperCase();

    if (!code) {
      setCouponError('Please enter a promotional code or gift card.');
      return;
    }

    if (code === 'PRIME2026') {
      setAppliedDiscount({ code: 'PRIME2026', percent: 15 });
      addToast('success', '15% Prime Savings promotional code applied!', 'Discount Applied');
      setCouponCode('');
    } else if (code === 'SAVE10') {
      if (rawSubtotal < 50) {
        setCouponError('Coupon SAVE10 requires a minimum order value of $50.00.');
        return;
      }
      setAppliedDiscount({ code: 'SAVE10', amount: 10 });
      addToast('success', '$10.00 instant promotional discount applied!', 'Discount Applied');
      setCouponCode('');
    } else {
      setCouponError(`The promotional code "${code}" is invalid or has expired.`);
    }
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      addToast('error', 'Your shopping cart is empty.', 'Cannot Checkout');
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Surface */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#181c1d] text-slate-900 dark:text-slate-100 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 bg-[#232F3E] text-white flex items-center justify-between border-b border-[#1b2430]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#FF9900]" />
            <h2 className="text-base font-bold">Shopping Cart</h2>
            <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-full font-bold">
              {cart.reduce((t, i) => t + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress bar */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-xs">
          {remainingForFree <= 0 ? (
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Your order qualifies for FREE Prime One-Day Delivery!</span>
            </div>
          ) : (
            <div>
              <div className="text-slate-600 dark:text-slate-300 mb-1.5">
                Add <strong className="text-slate-900 dark:text-white">${remainingForFree.toFixed(2)}</strong> of eligible items to get <strong>FREE delivery</strong>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100 dark:divide-slate-800">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <ShoppingBag className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Your Amazon Cart is empty
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Explore today's lightning deals, electronics, books, and top picks.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-4 py-2 bg-[#FFD814] text-slate-900 text-xs font-bold rounded-full hover:bg-[#F7CA00] transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className="py-3.5 flex gap-3 first:pt-0">
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 shrink-0 flex items-center justify-center">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                  />
                </div>

                {/* Details & Controls */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight">
                        {item.product.title}
                      </h4>
                      <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums shrink-0">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {item.selectedColor && (
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Color: <span className="font-medium text-slate-700 dark:text-slate-300">{item.selectedColor}</span>
                      </div>
                    )}

                    {item.product.isPrime && (
                      <div className="text-[10px] font-extrabold text-[#007185] dark:text-[#3db2c6] italic mt-0.5">
                        prime
                      </div>
                    )}
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-l transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-r transition"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Coupon & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-3">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyCoupon} className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code (e.g. PRIME2026)"
                    className="w-full pl-7 pr-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none uppercase font-mono"
                  />
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded transition"
                >
                  Apply
                </button>
              </div>

              {couponError && (
                <div className="text-[11px] text-red-600 dark:text-red-400 font-medium pt-1">
                  {couponError}
                </div>
              )}
              {appliedDiscount && (
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-between pt-1">
                  <span>Code {appliedDiscount.code} applied!</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
            </form>

            {/* Price Breakdown */}
            <div className="space-y-1 text-xs pt-1 border-t border-slate-200 dark:border-slate-800">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Items Subtotal:</span>
                <span className="tabular-nums font-mono">${rawSubtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Promotional Discount:</span>
                  <span className="tabular-nums font-mono">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Shipping & Handling:</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
                <span>Estimated Subtotal:</span>
                <span className="tabular-nums font-mono">${finalSubtotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-2.5 px-4 bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] text-xs font-bold rounded-full transition shadow-xs flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>Proceed to checkout ({cart.reduce((t, i) => t + i.quantity, 0)} items)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <button
                onClick={clearCart}
                className="hover:underline text-rose-500"
              >
                Clear all items
              </button>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>SSL Encrypted Checkout</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

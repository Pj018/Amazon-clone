import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Address } from '../types';
import { validateCardLuhn, maskCardNumber } from '../utils/security';
import {
  X,
  MapPin,
  Truck,
  CreditCard,
  ShieldCheck,
  Check,
  AlertCircle,
  Lock,
  ArrowRight,
  Wallet,
  Building
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    user,
    cart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    placeOrder,
    isOffline,
    addToast
  } = useApp();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Address Step state
  const defaultAddress: Address = user?.savedAddresses[0] || {
    fullName: 'Alex Rivera',
    street: '742 Evergreen Terrace',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98101',
    phone: '+1 (206) 555-0199'
  };

  const [selectedAddress, setSelectedAddress] = useState<Address>(defaultAddress);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });
  const [addressError, setAddressError] = useState<string | null>(null);

  // Shipping Speed Step state
  const [deliveryOption, setDeliveryOption] = useState<'prime_one_day' | 'standard' | 'priority_overnight'>('prime_one_day');

  // Payment Step state
  const [paymentType, setPaymentType] = useState<'card' | 'wallet' | 'cod'>('card');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardHolder, setCardHolder] = useState('ALEX RIVERA');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('382');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Processing state
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const rawSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = deliveryOption === 'prime_one_day' ? 0 : deliveryOption === 'priority_overnight' ? 14.99 : 5.99;
  const estimatedTax = rawSubtotal * 0.0825;
  const orderTotal = rawSubtotal + shippingFee + estimatedTax;

  // Step 1 Validation
  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError(null);
    if (!newAddress.fullName.trim()) {
      setAddressError('Full Name is required for package receipt.');
      return;
    }
    if (!newAddress.street.trim()) {
      setAddressError('Street address is required.');
      return;
    }
    if (!newAddress.city.trim() || !newAddress.state.trim()) {
      setAddressError('City and State are required.');
      return;
    }
    if (!newAddress.zipCode.trim() || newAddress.zipCode.length < 5) {
      setAddressError('A valid 5-digit ZIP code is required.');
      return;
    }
    if (!newAddress.phone.trim() || newAddress.phone.length < 10) {
      setAddressError('A valid telephone number is required for courier contact.');
      return;
    }

    setSelectedAddress(newAddress);
    setIsAddingNewAddress(false);
    addToast('success', 'New delivery address verified and selected');
  };

  // Step 3 Payment Validation
  const validatePaymentAndProceed = () => {
    setPaymentError(null);
    if (paymentType === 'card') {
      const cleanNum = cardNumber.replace(/\s+/g, '');
      if (cleanNum.length !== 16) {
        setPaymentError('Credit card number must be 16 digits.');
        return false;
      }
      if (!validateCardLuhn(cleanNum)) {
        setPaymentError('Invalid card number. Please check the digits.');
        return false;
      }
      if (!cardExpiry.includes('/') || cardExpiry.length < 5) {
        setPaymentError('Expiration date must be formatted MM/YY.');
        return false;
      }
      if (cardCvv.length < 3) {
        setPaymentError('CVV code must be at least 3 digits.');
        return false;
      }
    } else if (paymentType === 'wallet') {
      if ((user?.walletBalance || 0) < orderTotal) {
        setPaymentError(`Insufficient Amazon Pay Wallet balance ($${user?.walletBalance?.toFixed(2) || '0.00'}). Please choose Credit Card.`);
        return false;
      }
    }
    return true;
  };

  // Final Place Order
  const handleFinalPlaceOrder = async () => {
    setIsSubmitting(true);
    const paymentLabel = paymentType === 'card'
      ? `Visa ending in ${cardNumber.slice(-4)}`
      : paymentType === 'wallet'
      ? 'Amazon Pay Wallet Balance'
      : 'Cash on Delivery (Verified)';

    const result = await placeOrder({
      address: selectedAddress,
      deliveryOption,
      paymentMethod: paymentLabel
    });

    setIsSubmitting(false);
    if (result.success) {
      setIsCheckoutOpen(false);
    } else {
      addToast('error', result.error || 'Failed to place order', 'Order Error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={() => !isSubmitting && setIsCheckoutOpen(false)}
      />

      {/* Checkout Window */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#181c1d] text-slate-900 dark:text-slate-100 rounded-xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col z-10 border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="p-4 bg-[#131921] text-white flex items-center justify-between border-b border-[#232F3E]">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-white">
              amazon<span className="text-[#FF9900]">checkout</span>
            </span>
            <div className="hidden sm:flex items-center gap-1.5 ml-4 text-xs text-slate-300">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>TLS 1.3 256-Bit Encrypted</span>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            disabled={isSubmitting}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="bg-[#232F3E] text-slate-300 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
          {[
            { step: 1, label: '1. Shipping Address' },
            { step: 2, label: '2. Delivery Speed' },
            { step: 3, label: '3. Payment Method' },
            { step: 4, label: '4. Review & Place' },
          ].map(s => (
            <button
              key={s.step}
              onClick={() => {
                if (s.step < currentStep) setCurrentStep(s.step as any);
              }}
              className={`flex items-center gap-1.5 font-medium transition ${
                currentStep === s.step
                  ? 'text-[#FF9900] font-bold'
                  : currentStep > s.step
                  ? 'text-emerald-400'
                  : 'text-slate-500'
              }`}
            >
              {currentStep > s.step && <Check className="w-3.5 h-3.5" />}
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Steps Workspace (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* STEP 1: Shipping Address */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#FF9900]" />
                    Select a shipping address
                  </h3>
                  <button
                    onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
                    className="text-xs font-semibold text-[#007185] dark:text-[#3db2c6] hover:underline"
                  >
                    {isAddingNewAddress ? 'Cancel' : '+ Add a new address'}
                  </button>
                </div>

                {isAddingNewAddress ? (
                  <form onSubmit={handleSaveNewAddress} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      New Shipping Address
                    </h4>
                    {addressError && (
                      <div className="p-2.5 bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{addressError}</span>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={newAddress.fullName}
                          onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                          placeholder="e.g. Alex Rivera"
                          className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Phone Number</label>
                        <input
                          type="text"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          placeholder="+1 (206) 555-0199"
                          className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Street Address</label>
                      <input
                        type="text"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        placeholder="Street, suite, unit, building, floor"
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">City</label>
                        <input
                          type="text"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          placeholder="Seattle"
                          className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">State</label>
                        <input
                          type="text"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          placeholder="WA"
                          className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">ZIP Code</label>
                        <input
                          type="text"
                          value={newAddress.zipCode}
                          onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                          placeholder="98101"
                          className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-slate-900 text-xs font-bold rounded-md transition"
                    >
                      Use this new address
                    </button>
                  </form>
                ) : (
                  <div className="space-y-3">
                    {(user?.savedAddresses || [defaultAddress]).map((addr, idx) => (
                      <label
                        key={idx}
                        className={`p-3.5 rounded-lg border flex items-start gap-3 cursor-pointer transition ${
                          selectedAddress.street === addr.street
                            ? 'border-[#FF9900] bg-[#FFF7E8] dark:bg-amber-950/30 ring-1 ring-[#FF9900]'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="selected_address"
                          checked={selectedAddress.street === addr.street}
                          onChange={() => setSelectedAddress(addr)}
                          className="mt-1 text-[#FF9900] focus:ring-[#FF9900]"
                        />
                        <div className="text-xs">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{addr.fullName}</span>
                            {addr.isDefault && (
                              <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.2 rounded font-normal">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="text-slate-600 dark:text-slate-300 mt-0.5">
                            {addr.street}, {addr.city}, {addr.state} {addr.zipCode}
                          </div>
                          <div className="text-slate-500 text-[11px] mt-0.5">
                            Phone: {addr.phone}
                          </div>
                        </div>
                      </label>
                    ))}

                    <button
                      onClick={() => setCurrentStep(2)}
                      className="mt-4 px-6 py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] text-slate-900 text-xs font-bold rounded-full transition shadow-xs flex items-center gap-2"
                    >
                      <span>Continue to Delivery Options</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Delivery Speed */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#FF9900]" />
                  Choose your Prime delivery option
                </h3>

                <div className="space-y-3">
                  <label
                    className={`p-3.5 rounded-lg border flex items-start gap-3 cursor-pointer transition ${
                      deliveryOption === 'prime_one_day'
                        ? 'border-[#FF9900] bg-[#FFF7E8] dark:bg-amber-950/30 ring-1 ring-[#FF9900]'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery_option"
                      checked={deliveryOption === 'prime_one_day'}
                      onChange={() => setDeliveryOption('prime_one_day')}
                      className="mt-1 text-[#FF9900]"
                    />
                    <div className="text-xs flex-1">
                      <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                        <span>FREE Prime One-Day Delivery (Tomorrow by 8 PM)</span>
                        <span className="font-mono">$0.00</span>
                      </div>
                      <p className="text-slate-500 mt-0.5">
                        Guaranteed fulfillment dispatched via Amazon Express Carrier Hub.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`p-3.5 rounded-lg border flex items-start gap-3 cursor-pointer transition ${
                      deliveryOption === 'priority_overnight'
                        ? 'border-[#FF9900] bg-[#FFF7E8] dark:bg-amber-950/30 ring-1 ring-[#FF9900]'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery_option"
                      checked={deliveryOption === 'priority_overnight'}
                      onChange={() => setDeliveryOption('priority_overnight')}
                      className="mt-1 text-[#FF9900]"
                    />
                    <div className="text-xs flex-1">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                        <span>Priority Overnight Delivery (Tomorrow by 10:30 AM)</span>
                        <span className="font-mono">$14.99</span>
                      </div>
                      <p className="text-slate-500 mt-0.5">
                        Earliest morning dedicated priority drop-off.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`p-3.5 rounded-lg border flex items-start gap-3 cursor-pointer transition ${
                      deliveryOption === 'standard'
                        ? 'border-[#FF9900] bg-[#FFF7E8] dark:bg-amber-950/30 ring-1 ring-[#FF9900]'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery_option"
                      checked={deliveryOption === 'standard'}
                      onChange={() => setDeliveryOption('standard')}
                      className="mt-1 text-[#FF9900]"
                    />
                    <div className="text-xs flex-1">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                        <span>Standard Ground Shipping (3–5 business days)</span>
                        <span className="font-mono">$5.99</span>
                      </div>
                      <p className="text-slate-500 mt-0.5">
                        Standard carrier logistics dispatch.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] text-slate-900 text-xs font-bold rounded-full transition shadow-xs flex items-center gap-2"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment Method */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#FF9900]" />
                  Select a payment method
                </h3>

                {paymentError && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{paymentError}</span>
                  </div>
                )}

                <div className="space-y-3">
                  {/* Credit Card Option */}
                  <div className={`p-4 rounded-lg border transition ${
                    paymentType === 'card'
                      ? 'border-[#FF9900] bg-[#FFF7E8] dark:bg-amber-950/20 ring-1 ring-[#FF9900]'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}>
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-900 dark:text-white">
                      <input
                        type="radio"
                        name="payment_type"
                        checked={paymentType === 'card'}
                        onChange={() => setPaymentType('card')}
                        className="text-[#FF9900]"
                      />
                      <span>Credit or Debit Card (Visa, Mastercard, Amex)</span>
                    </label>

                    {paymentType === 'card' && (
                      <div className="mt-3 pt-3 border-t border-amber-200/60 dark:border-amber-900/40 space-y-3 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                              Card Number (16 digits)
                            </label>
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              placeholder="4242 4242 4242 4242"
                              maxLength={19}
                              className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                              Name on Card
                            </label>
                            <input
                              type="text"
                              value={cardHolder}
                              onChange={(e) => setCardHolder(e.target.value)}
                              placeholder="Alex Rivera"
                              className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none uppercase"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 max-w-xs">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                              Expiration Date
                            </label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/YY"
                              maxLength={5}
                              className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                              Security Code (CVV)
                            </label>
                            <input
                              type="password"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              placeholder="123"
                              maxLength={4}
                              className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Amazon Pay Wallet Option */}
                  <div className={`p-4 rounded-lg border transition ${
                    paymentType === 'wallet'
                      ? 'border-[#FF9900] bg-[#FFF7E8] dark:bg-amber-950/20 ring-1 ring-[#FF9900]'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}>
                    <label className="flex items-center justify-between cursor-pointer text-xs font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="payment_type"
                          checked={paymentType === 'wallet'}
                          onChange={() => setPaymentType('wallet')}
                          className="text-[#FF9900]"
                        />
                        <Wallet className="w-4 h-4 text-[#FF9900]" />
                        <span>Amazon Pay Wallet Balance</span>
                      </div>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400">
                        Available: ${user?.walletBalance.toFixed(2) || '245.50'}
                      </span>
                    </label>
                  </div>

                  {/* Cash On Delivery Option */}
                  <div className={`p-4 rounded-lg border transition ${
                    paymentType === 'cod'
                      ? 'border-[#FF9900] bg-[#FFF7E8] dark:bg-amber-950/20 ring-1 ring-[#FF9900]'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}>
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-900 dark:text-white">
                      <input
                        type="radio"
                        name="payment_type"
                        checked={paymentType === 'cod'}
                        onChange={() => setPaymentType('cod')}
                        className="text-[#FF9900]"
                      />
                      <Building className="w-4 h-4 text-slate-500" />
                      <span>Cash on Delivery (Pay upon courier delivery)</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      if (validatePaymentAndProceed()) {
                        setCurrentStep(4);
                      }
                    }}
                    className="px-6 py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] text-slate-900 text-xs font-bold rounded-full transition shadow-xs flex items-center gap-2"
                  >
                    <span>Review Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Review and Place Order */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-500" />
                  Review your order and items
                </h3>

                {isOffline && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 rounded-lg text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>
                      You are placing this order OFFLINE. It will be encrypted and saved locally, and automatically synchronized to the cloud when connection restores.
                    </span>
                  </div>
                )}

                {/* Review cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="font-bold text-slate-900 dark:text-white mb-1 flex items-center justify-between">
                      <span>Shipping Address</span>
                      <button onClick={() => setCurrentStep(1)} className="text-[#007185] text-[11px] hover:underline">Change</button>
                    </div>
                    <div>{selectedAddress.fullName}</div>
                    <div className="text-slate-500">{selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}</div>
                    <div className="text-slate-400 text-[11px]">Phone: {selectedAddress.phone}</div>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="font-bold text-slate-900 dark:text-white mb-1 flex items-center justify-between">
                      <span>Payment & Speed</span>
                      <button onClick={() => setCurrentStep(3)} className="text-[#007185] text-[11px] hover:underline">Change</button>
                    </div>
                    <div>{paymentType === 'card' ? `Card: ${maskCardNumber(cardNumber)}` : paymentType === 'wallet' ? 'Amazon Pay Wallet' : 'Cash On Delivery'}</div>
                    <div className="text-emerald-600 font-semibold mt-1">
                      {deliveryOption === 'prime_one_day' ? 'FREE Prime One-Day' : deliveryOption === 'priority_overnight' ? 'Priority Overnight ($14.99)' : 'Standard Ground ($5.99)'}
                    </div>
                  </div>
                </div>

                {/* Items in this shipment */}
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Shipment Items ({cart.reduce((t, i) => t + i.quantity, 0)})
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {cart.map(item => (
                      <div key={item.product.id} className="py-2 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5 truncate max-w-sm">
                          <img src={item.product.image} alt={item.product.title} referrerPolicy="no-referrer" className="w-10 h-10 object-contain rounded border p-0.5" />
                          <div className="truncate">
                            <div className="font-semibold truncate">{item.product.title}</div>
                            <div className="text-[11px] text-slate-500">Qty: {item.quantity} · ${item.product.price.toFixed(2)} ea</div>
                          </div>
                        </div>
                        <span className="font-bold font-mono">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setCurrentStep(3)}
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleFinalPlaceOrder}
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-6 bg-[#FFA41C] hover:bg-[#FA8900] text-slate-950 text-sm font-bold rounded-full transition shadow-md flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <span>Placing Order & Encrypting...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Place your order (${orderTotal.toFixed(2)})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar (4 cols) */}
          <div className="lg:col-span-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3 sticky top-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Order Summary
              </h4>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span className="font-mono tabular-nums text-slate-900 dark:text-white">${rawSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping & handling:</span>
                  <span className="font-mono tabular-nums text-slate-900 dark:text-white">
                    {shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated tax to be collected:</span>
                  <span className="font-mono tabular-nums text-slate-900 dark:text-white">${estimatedTax.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-base font-bold text-[#b12704] dark:text-[#ff9900]">
                  <span>Order total:</span>
                  <span className="font-mono tabular-nums">${orderTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-2.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 space-y-1">
                <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Amazon A-to-z Guarantee</span>
                </div>
                <p>
                  Protects your purchase, delivery timing, and condition of items. 100% money-back guarantee.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

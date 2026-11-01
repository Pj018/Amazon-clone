import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Address } from '../../types';
import {
  MapPin,
  X,
  Check,
  Plus,
  AlertCircle
} from 'lucide-react';

export const AddressBottomSheet: React.FC = () => {
  const {
    isAddressSheetOpen,
    setIsAddressSheetOpen,
    user,
    selectedAddress,
    setSelectedAddress,
    addNewAddress,
    addToast
  } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [zipInput, setZipInput] = useState('');
  const [formData, setFormData] = useState<Address>({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });
  const [error, setError] = useState<string | null>(null);

  if (!isAddressSheetOpen) return null;

  const handleSelect = (addr: Address) => {
    setSelectedAddress(addr);
    setIsAddressSheetOpen(false);
    addToast('info', `Delivery address updated to ${addr.city} ${addr.zipCode}`);
  };

  const handleApplyZip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipInput || zipInput.length < 5) {
      setError('Please enter a valid 5-digit US ZIP Code.');
      return;
    }
    const updated = {
      ...selectedAddress,
      zipCode: zipInput
    };
    setSelectedAddress(updated);
    setIsAddressSheetOpen(false);
    addToast('success', `Location updated to ZIP ${zipInput}! Available Prime delivery times updated.`);
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.fullName || !formData.street || !formData.city || !formData.zipCode) {
      setError('Please fill in all required address fields.');
      return;
    }
    addNewAddress(formData);
    setIsAdding(false);
    setIsAddressSheetOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={() => setIsAddressSheetOpen(false)}
      />

      {/* Surface */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#181c1d] text-slate-900 dark:text-slate-100 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh] z-10 border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-200">
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-3 sm:hidden" />

        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#FF9900]" />
            <h3 className="text-sm font-bold">Choose your location</h3>
          </div>
          <button
            onClick={() => setIsAddressSheetOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <p className="text-slate-500 text-[11px]">
            Delivery options and delivery speeds may vary based on your selected address.
          </p>

          {error && (
            <div className="p-2.5 bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isAdding ? (
            <form onSubmit={handleCreateAddress} className="space-y-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">Add a new delivery address</h4>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
              />
              <input
                type="text"
                placeholder="Street address"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 border rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-[#FFD814] text-slate-950 font-bold rounded shadow-xs"
                >
                  Save & Use Address
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Saved Addresses list */}
              <div className="space-y-2">
                {(user?.savedAddresses || [selectedAddress]).map((addr, idx) => {
                  const isCurrent = selectedAddress.street === addr.street;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(addr)}
                      className={`w-full p-3 rounded-xl border text-left flex items-start justify-between transition ${
                        isCurrent
                          ? 'border-[#FF9900] bg-[#FFF7E8] dark:bg-amber-950/20 ring-1 ring-[#FF9900]'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.2 rounded font-normal">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="text-slate-600 dark:text-slate-300 mt-0.5">
                          {addr.street}, {addr.city} {addr.zipCode}
                        </div>
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-[#FF9900] stroke-[3]" />}
                    </button>
                  );
                })}
              </div>

              {/* Add new address button */}
              <button
                onClick={() => setIsAdding(true)}
                className="w-full py-2.5 px-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-[#007185] dark:text-[#3db2c6] font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add an address or pickup location</span>
              </button>

              {/* Or enter US ZIP code */}
              <form onSubmit={handleApplyZip} className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Or enter a US ZIP code:
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={5}
                    value={zipInput}
                    onChange={(e) => setZipInput(e.target.value)}
                    placeholder="e.g. 98101"
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg font-bold text-xs"
                  >
                    Apply
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import {
  Camera,
  X,
  Zap,
  Sparkles,
  Barcode,
  Search,
  CheckCircle2,
  Package
} from 'lucide-react';

export const LensScannerModal: React.FC = () => {
  const {
    isLensScannerOpen,
    setIsLensScannerOpen,
    setActiveProductModal,
    addToast
  } = useApp();

  const [scanMode, setScanMode] = useState<'barcode' | 'visual'>('visual');
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<any | null>(null);

  if (!isLensScannerOpen) return null;

  const simulateScanProduct = (prod: any) => {
    setScannedProduct(prod);
    addToast('success', `Amazon Lens identified: ${prod.title.slice(0, 30)}...`, 'Lens Match Found');
  };

  const handleOpenScanned = () => {
    if (scannedProduct) {
      setActiveProductModal(scannedProduct);
      setIsLensScannerOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between">
      {/* Top Scanner Nav */}
      <div className="p-4 flex items-center justify-between text-white z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-[#FF9900]" />
          <span className="text-sm font-bold tracking-tight">Amazon Lens</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFlashlightOn(!flashlightOn)}
            className={`p-2 rounded-full border ${
              flashlightOn ? 'bg-amber-400 text-slate-950 border-amber-400' : 'bg-black/40 text-white border-white/30'
            }`}
            aria-label="Toggle Flashlight"
          >
            <Zap className="w-4 h-4 fill-current" />
          </button>
          <button
            onClick={() => setIsLensScannerOpen(false)}
            className="p-2 rounded-full bg-black/40 text-white border border-white/30"
            aria-label="Close Lens"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Viewfinder Stage */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-6 overflow-hidden">
        {/* Camera background simulation grid */}
        <div className="absolute inset-0 bg-[#0a0f14] flex items-center justify-center">
          <div className="w-full h-full opacity-30 bg-[radial-gradient(#232f3e_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        {/* Viewfinder Reticle Frame */}
        <div className="relative w-64 h-64 border-2 border-[#FF9900]/80 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl">
          {/* Laser scanning bar */}
          <div className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_12px_#ff0000] animate-bounce duration-1000" />

          {/* Corner brackets */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#FF9900]" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#FF9900]" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#FF9900]" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#FF9900]" />

          <div className="text-center p-4 text-white/80">
            <Barcode className="w-12 h-12 mx-auto mb-2 text-[#FF9900]/70" />
            <span className="text-xs font-semibold block">
              {scanMode === 'barcode' ? 'Align barcode in frame' : 'Point camera at product'}
            </span>
          </div>
        </div>

        {/* Quick simulation taps */}
        <div className="z-20 mt-6 w-full max-w-sm space-y-2">
          <div className="text-center text-[11px] text-slate-300 font-semibold">
            Tap an item below to simulate instant camera scan:
          </div>
          <div className="grid grid-cols-3 gap-2">
            {MOCK_PRODUCTS.slice(0, 3).map(prod => (
              <button
                key={prod.id}
                onClick={() => simulateScanProduct(prod)}
                className="p-2 rounded-lg bg-slate-900/90 border border-slate-700 text-left hover:border-[#FF9900] transition active:scale-95"
              >
                <img
                  src={prod.image}
                  alt={prod.brand}
                  className="w-full h-12 object-contain rounded bg-white/10 mb-1"
                />
                <div className="text-[10px] font-bold text-white truncate">{prod.brand}</div>
                <div className="text-[9px] text-[#FF9900] font-mono">${prod.price}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Matched Result Drawer / Action Controls */}
      <div className="p-4 bg-[#131921] border-t border-slate-800 z-20 space-y-3">
        {scannedProduct ? (
          <div className="p-3 bg-slate-800 rounded-xl border border-[#FF9900] flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2">
            <img
              src={scannedProduct.image}
              alt={scannedProduct.title}
              className="w-12 h-12 object-contain rounded bg-white p-1 shrink-0"
            />
            <div className="flex-1 truncate text-xs">
              <div className="font-bold text-white truncate">{scannedProduct.title}</div>
              <div className="text-[#FF9900] font-mono font-bold">${scannedProduct.price}</div>
            </div>
            <button
              onClick={handleOpenScanned}
              className="px-3 py-1.5 bg-[#FFD814] text-slate-950 font-bold text-xs rounded-full hover:bg-[#F7CA00] shrink-0"
            >
              View Match
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 text-xs font-semibold text-slate-300">
            <button
              onClick={() => setScanMode('visual')}
              className={`px-4 py-1.5 rounded-full transition ${
                scanMode === 'visual' ? 'bg-[#FF9900] text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Search
            </button>
            <button
              onClick={() => setScanMode('barcode')}
              className={`px-4 py-1.5 rounded-full transition ${
                scanMode === 'barcode' ? 'bg-[#FF9900] text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Barcode
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

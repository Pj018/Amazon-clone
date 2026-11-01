import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Boxes,
  X,
  RotateCw,
  Maximize2,
  Minimize2,
  Check,
  ShoppingCart
} from 'lucide-react';

export const ARViewModal: React.FC = () => {
  const {
    isARViewOpen,
    setIsARViewOpen,
    arProduct,
    addToCart,
    addToast
  } = useApp();

  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!isARViewOpen || !arProduct) return null;

  const handleRotate = () => {
    setRotation(prev => (prev + 45) % 360);
  };

  const handleAddToCart = () => {
    addToCart(arProduct);
    setIsARViewOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between select-none">
      {/* Top Controls */}
      <div className="p-4 flex items-center justify-between text-white z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2">
          <Boxes className="w-5 h-5 text-[#FF9900]" />
          <div>
            <div className="text-xs font-bold">Amazon AR · View in Your Room</div>
            <div className="text-[10px] text-slate-300 truncate max-w-[200px]">{arProduct.title}</div>
          </div>
        </div>
        <button
          onClick={() => setIsARViewOpen(false)}
          className="p-2 rounded-full bg-black/50 text-white border border-white/20"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* AR Viewport Stage (Simulated Room Surface with 3D product projection) */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-6 overflow-hidden">
        {/* Living room floor perspective grid background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-25 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] [transform:perspective(500px)_rotateX(60deg)]" />
        </div>

        {/* Surface Anchor Shadow Ring */}
        <div className="relative flex flex-col items-center">
          <div
            className="transition-transform duration-300 flex items-center justify-center"
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`
            }}
          >
            <img
              src={arProduct.image}
              alt={arProduct.title}
              className="w-56 h-56 object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)] filter contrast-105"
            />
          </div>

          {/* AR Ground Plane Anchor */}
          <div className="w-44 h-8 bg-black/60 rounded-full blur-md -mt-4 pointer-events-none" />

          {/* Reticle guide */}
          <div className="mt-4 px-3 py-1 rounded-full bg-black/60 border border-white/20 text-white text-[11px] backdrop-blur-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Anchored to Floor Plane (Scale: {Math.round(scale * 100)}%)</span>
          </div>
        </div>
      </div>

      {/* Bottom AR Tools & Purchase Bar */}
      <div className="p-4 bg-[#131921] border-t border-slate-800 z-20 space-y-3">
        {/* AR Adjustment Controls */}
        <div className="flex items-center justify-around text-xs text-white">
          <button
            onClick={() => setScale(prev => Math.max(0.6, prev - 0.15))}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 active:scale-95"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Scale -</span>
          </button>
          <button
            onClick={handleRotate}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 active:scale-95"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#FF9900]" />
            <span>Rotate 45°</span>
          </button>
          <button
            onClick={() => setScale(prev => Math.min(1.5, prev + 0.15))}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 active:scale-95"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Scale +</span>
          </button>
        </div>

        {/* One-Tap Purchase from AR view */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex-1">
            <div className="text-white text-xs font-bold">${arProduct.price.toFixed(2)}</div>
            <div className="text-[10px] text-emerald-400">Fits your space nicely</div>
          </div>
          <button
            onClick={handleAddToCart}
            className="px-5 py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] text-slate-950 font-bold text-xs rounded-full shadow-md flex items-center gap-1.5 active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

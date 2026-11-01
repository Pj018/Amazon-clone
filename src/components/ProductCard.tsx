import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Star, Heart, Check, ShoppingCart, Eye, Package } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist, setActiveProductModal } = useApp();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const isSaved = wishlist.includes(product.id);
  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product, 1, product.colors ? product.colors[0] : undefined);
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => setActiveProductModal(product)}
      className="group bg-white dark:bg-[#1f2833] rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Top badges: Best Seller / Discount / Wishlist */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start">
        {product.isBestSeller && (
          <span className="bg-[#e67a00] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-sm tracking-wide shadow-xs uppercase">
            #1 Best Seller
          </span>
        )}
        {discountPercent > 0 && (
          <span className="bg-[#cc0c39] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm shadow-xs">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        className={`absolute top-2 right-2 z-10 p-1.5 rounded-full backdrop-blur-xs transition ${
          isSaved
            ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400'
            : 'bg-white/80 dark:bg-slate-900/80 text-slate-400 hover:text-rose-500 hover:bg-white'
        }`}
        aria-label={isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart className={`w-4 h-4 ${isSaved ? 'fill-current text-rose-600 dark:text-rose-400' : ''}`} />
      </button>

      {/* Product Image Frame */}
      <div className="relative w-full aspect-square bg-[#f8f9fa] dark:bg-[#161d24] flex items-center justify-center p-4 overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 animate-pulse flex items-center justify-center">
            <Package className="w-8 h-8 text-slate-300 dark:text-slate-600" />
          </div>
        )}

        {imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 p-4 text-center">
            <Package className="w-10 h-10 mb-2 stroke-1 text-slate-400" />
            <span className="text-xs font-semibold">{product.brand}</span>
            <span className="text-[11px] truncate max-w-[140px]">{product.title}</span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.title}
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-300 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Quick View Hover overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> Quick View
          </span>
        </div>
      </div>

      {/* Product Info & Actions */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Brand & Category */}
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {product.brand}
          </div>

          {/* Product Title (2-line clamp) */}
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-[#007185] dark:group-hover:text-[#42a8b8] transition-colors mt-0.5">
            {product.title}
          </h3>

          {/* Ratings Row */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center text-[#e67a00]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-current text-[#e67a00]'
                      : 'text-slate-300 dark:text-slate-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
              {product.rating}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({product.reviewCount.toLocaleString()})
            </span>
          </div>

          {/* Pricing Row */}
          <div className="mt-2 flex items-baseline gap-2">
            <div className="flex items-baseline text-slate-900 dark:text-slate-50">
              <span className="text-xs font-semibold leading-none">$</span>
              <span className="text-xl font-bold tracking-tight leading-none tabular-nums">
                {Math.floor(product.price)}
              </span>
              <span className="text-xs font-semibold leading-none tabular-nums">
                {(product.price % 1).toFixed(2).substring(2)}
              </span>
            </div>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through tabular-nums">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Prime Delivery Badge */}
          {product.isPrime && (
            <div className="mt-1 flex items-center gap-1">
              <span className="text-xs font-extrabold text-[#007185] dark:text-[#3db2c6] italic tracking-tight flex items-center">
                prime <Check className="w-3 h-3 text-[#FF9900] stroke-[3] ml-0.5" />
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400">
                FREE One-Day
              </span>
            </div>
          )}

          {/* Stock status indicator */}
          <div className="mt-1 text-[11px]">
            {product.stockCount < 20 ? (
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                Only {product.stockCount} left in stock - order soon.
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400">
                In Stock
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdding}
          className={`w-full py-2 px-3 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-1.5 shadow-xs ${
            isAdding
              ? 'bg-emerald-600 text-white'
              : 'bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] active:scale-[0.98]'
          }`}
        >
          {isAdding ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Added to Cart</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

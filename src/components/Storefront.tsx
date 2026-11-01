import React from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_PRODUCTS, CATEGORIES } from '../data/mockProducts';
import { ProductCard } from './ProductCard';
import {
  Sparkles,
  SlidersHorizontal,
  Star,
  Check,
  Search,
  RotateCcw,
  Package,
  TrendingUp,
  Zap
} from 'lucide-react';

export const Storefront: React.FC = () => {
  const {
    products,
    setActiveTab,
    searchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    filters,
    setFilters,
    resetFilters,
    setActiveProductModal
  } = useApp();

  // Filter products based on search, category, and active filters
  const filteredProducts = products.filter(product => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = product.title.toLowerCase().includes(q);
      const matchBrand = product.brand.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      if (!matchTitle && !matchBrand && !matchDesc) return false;
    }

    // Category match
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }

    // Prime only
    if (filters.primeOnly && !product.isPrime) {
      return false;
    }

    // In Stock only
    if (filters.inStockOnly && !product.inStock) {
      return false;
    }

    // Minimum rating
    if (filters.minRating && product.rating < filters.minRating) {
      return false;
    }

    // Max price
    if (filters.maxPrice && product.price > filters.maxPrice) {
      return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
    // Default featured: best sellers first, then rating
    return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
  });

  const { addToCart, addToast } = useApp();

  const categoryBubbles = [
    { id: 'all', label: 'All Deals', icon: '🔥', badge: 'PRIME' },
    { id: 'audio', label: 'Audio & Echo', icon: '🎧', badge: 'HOT' },
    { id: 'electronics', label: 'Mobiles & Tech', icon: '📱' },
    { id: 'books', label: 'Kindles', icon: '📚' },
    { id: 'home', label: 'Home Appliances', icon: '🏠' },
    { id: 'fashion', label: 'Fashion', icon: '👕' },
    { id: 'beauty', label: 'Beauty Care', icon: '✨' },
  ];

  const buyAgainItems = products.slice(0, 4);

  return (
    <div className="space-y-4">
      {/* Merchant & Admin Catalog Banner */}
      <div className="bg-gradient-to-r from-[#131921] to-[#232F3E] text-white rounded-xl p-3 shadow-xs border border-slate-700/50 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FF9900]/20 border border-[#FF9900]/40 flex items-center justify-center text-[#FF9900] shrink-0 font-black text-xs">
            AZ
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">Product & Store Management</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-[#FF9900] text-[9px] font-black uppercase">Admin / Seller</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Manage inventory, add new products, edit pricing & fulfill orders in <strong>Seller Central</strong>.
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('seller_hub')}
          className="px-3 py-1.5 rounded-lg bg-[#FF9900] hover:bg-[#e68a00] text-slate-950 font-bold text-xs shadow-xs transition flex items-center gap-1 active:scale-95 shrink-0"
        >
          <span>Open Seller Central</span>
          <span className="text-sm font-black">→</span>
        </button>
      </div>

      {/* 1. Mobile Category Circles / Stories Carousel (Iconic Amazon Mobile App Home) */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 -mx-3 px-3 select-none">
        {categoryBubbles.map((bubble) => {
          const isSelected = selectedCategory === bubble.id;
          return (
            <button
              key={bubble.id}
              onClick={() => setSelectedCategory(bubble.id)}
              className="flex flex-col items-center gap-1 shrink-0 group active:scale-95 transition"
            >
              <div className={`relative w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-xs transition-all ${
                isSelected
                  ? 'bg-amber-100 dark:bg-amber-950/80 border-2 border-[#FF9900] ring-2 ring-[#FF9900]/30'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-400'
              }`}>
                <span>{bubble.icon}</span>
                {bubble.badge && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-[#cc0c39] text-white text-[8px] font-black uppercase shadow-xs">
                    {bubble.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] whitespace-nowrap ${
                isSelected ? 'font-bold text-[#FF9900]' : 'text-slate-600 dark:text-slate-300'
              }`}>
                {bubble.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Lightning Deal of the Day with Live Countdown Clock */}
      <div className="bg-gradient-to-r from-[#900] via-[#b12704] to-[#cc0c39] rounded-2xl p-4 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-wide">
            <Zap className="w-3 h-3 fill-current" />
            <span>Prime Lightning Deal</span>
          </div>
          <h2 className="text-base sm:text-lg font-black leading-tight">
            Sony WH-1000XM5 Wireless Headphones
          </h2>
          <div className="flex items-center justify-center sm:justify-start gap-2 pt-0.5">
            <span className="text-xl font-black font-mono">$348.00</span>
            <span className="text-xs line-through text-white/70 font-mono">$399.99</span>
            <span className="text-xs font-bold bg-white text-[#cc0c39] px-1.5 py-0.2 rounded font-mono">
              13% OFF
            </span>
          </div>

          {/* Claim Bar */}
          <div className="pt-2 max-w-xs mx-auto sm:mx-0">
            <div className="flex justify-between text-[11px] font-semibold text-white/90 mb-1">
              <span>78% Claimed</span>
              <span className="font-mono">Ends in 02:44:18</span>
            </div>
            <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
              <div className="h-full bg-[#FFD814]" style={{ width: '78%' }} />
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            const sony = MOCK_PRODUCTS[1];
            if (sony) {
              addToCart(sony);
              addToast('success', 'Lightning Deal claimed and added to cart!');
            }
          }}
          className="px-5 py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] text-slate-950 font-black text-xs rounded-full shadow-lg active:scale-95 transition shrink-0 whitespace-nowrap"
        >
          Claim Deal ($348.00)
        </button>
      </div>

      {/* 3. Amazon "Buy Again" Quick Reorder Shelf */}
      <div className="bg-white dark:bg-[#181c1d] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <RotateCcw className="w-4 h-4 text-[#FF9900]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Buy Again · Frequently Purchased
            </h3>
          </div>
          <span className="text-[11px] text-[#007185] dark:text-[#3db2c6] font-semibold hover:underline cursor-pointer">
            View All
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {buyAgainItems.map(item => (
            <div
              key={item.id}
              className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between transition"
            >
              <div
                onClick={() => setActiveProductModal(item)}
                className="cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-20 object-contain rounded mb-1.5 mix-blend-multiply dark:mix-blend-normal"
                />
                <h4 className="text-[11px] font-semibold text-slate-900 dark:text-white line-clamp-1">
                  {item.title}
                </h4>
                <div className="text-xs font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  ${item.price.toFixed(2)}
                </div>
              </div>

              <button
                onClick={() => addToCart(item)}
                className="mt-2 w-full py-1 text-[11px] font-bold bg-[#FFD814] hover:bg-[#F7CA00] text-slate-950 rounded-full shadow-xs active:scale-95 transition"
              >
                Reorder
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Campaign Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#131921] via-[#232F3E] to-[#131921] text-white p-5 sm:p-6 border border-slate-800 shadow-md">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF9900]/20 text-[#FF9900] text-[10px] font-bold border border-[#FF9900]/40">
            <Zap className="w-3 h-3 fill-current" />
            <span>PRIME BIG DEALS FESTIVAL · SAVE UP TO 40%</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            Next-Gen Retail Ecosystem
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
            Free One-Day Delivery, automated encrypted backups, and real-time merchant analytics.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => {
                setSelectedCategory('audio');
                setFilters(prev => ({ ...prev, primeOnly: true }));
              }}
              className="px-4 py-2 bg-[#FF9900] hover:bg-[#e68a00] text-slate-950 text-xs font-bold rounded-full transition shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <span>Explore Prime Deals</span>
              <Sparkles className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none hidden md:flex items-center justify-center">
          <Package className="w-48 h-48 text-[#FF9900]" />
        </div>
      </div>

      {/* Main Catalog Section with Filters & Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Filter Sidebar (Hidden on mobile/tablet, 3 cols on large desktop) */}
        <div className="hidden lg:block lg:col-span-3 space-y-5">
          <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF9900]" />
                Refine by
              </h3>
              <button
                onClick={resetFilters}
                className="text-[11px] text-[#007185] dark:text-[#3db2c6] hover:underline"
              >
                Clear all
              </button>
            </div>

            {/* Prime Filter */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Amazon Prime
              </h4>
              <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filters.primeOnly}
                  onChange={(e) => setFilters(prev => ({ ...prev, primeOnly: e.target.checked }))}
                  className="rounded text-[#FF9900] focus:ring-[#FF9900]"
                />
                <span className="font-extrabold text-[#007185] dark:text-[#3db2c6] italic flex items-center">
                  prime <Check className="w-3 h-3 text-[#FF9900] stroke-[3] ml-0.5" />
                </span>
                <span className="text-[11px] text-slate-500">Eligible items</span>
              </label>
            </div>

            {/* Department / Category Filter */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Department
              </h4>
              <div className="space-y-1 text-xs">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-2 py-1 rounded transition text-xs ${
                      selectedCategory === cat.id
                        ? 'font-bold text-[#FF9900] bg-amber-50 dark:bg-amber-950/40'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Review Filter */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Customer Reviews
              </h4>
              <div className="space-y-1.5 text-xs">
                {[4, 3, 2].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setFilters(prev => ({ ...prev, minRating: prev.minRating === rating ? null : rating }))}
                    className={`flex items-center gap-1.5 w-full text-left p-1 rounded transition ${
                      filters.minRating === rating ? 'bg-slate-100 dark:bg-slate-800 font-bold' : ''
                    }`}
                  >
                    <div className="flex text-[#e67a00]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < rating ? 'fill-current' : 'text-slate-300 dark:text-slate-600'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-600 dark:text-slate-400">& Up</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Price Range
              </h4>
              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, maxPrice: 25 }))}
                  className={`w-full text-left p-1 rounded hover:text-slate-900 ${filters.maxPrice === 25 ? 'font-bold text-[#FF9900]' : ''}`}
                >
                  Under $25
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, maxPrice: 50 }))}
                  className={`w-full text-left p-1 rounded hover:text-slate-900 ${filters.maxPrice === 50 ? 'font-bold text-[#FF9900]' : ''}`}
                >
                  Under $50
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, maxPrice: 100 }))}
                  className={`w-full text-left p-1 rounded hover:text-slate-900 ${filters.maxPrice === 100 ? 'font-bold text-[#FF9900]' : ''}`}
                >
                  Under $100
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, maxPrice: null }))}
                  className={`w-full text-left p-1 rounded hover:text-slate-900 ${filters.maxPrice === null ? 'font-bold text-[#FF9900]' : ''}`}
                >
                  All Prices
                </button>
              </div>
            </div>

            {/* Stock Availability */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Availability
              </h4>
              <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={(e) => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
                  className="rounded text-[#FF9900] focus:ring-[#FF9900]"
                />
                <span className="text-slate-600 dark:text-slate-400">Exclude Out of Stock</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Product Grid (12 cols on mobile, 9 cols on desktop) */}
        <div className="col-span-1 lg:col-span-9 space-y-3">
          {/* Mobile Horizontal Quick Filters Scroll Bar */}
          <div className="flex lg:hidden items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setFilters(prev => ({ ...prev, primeOnly: !prev.primeOnly }))}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1 border transition ${
                filters.primeOnly
                  ? 'bg-sky-500 text-white border-sky-600'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }`}
            >
              <span>prime</span>
              <Check className="w-3 h-3 stroke-[3]" />
            </button>

            <button
              onClick={() => setFilters(prev => ({ ...prev, maxPrice: prev.maxPrice === 50 ? null : 50 }))}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 border transition ${
                filters.maxPrice === 50
                  ? 'bg-[#FF9900] text-slate-950 font-bold border-[#e68a00]'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }`}
            >
              Under $50
            </button>

            <button
              onClick={() => setFilters(prev => ({ ...prev, minRating: prev.minRating === 4 ? null : 4 }))}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 border transition flex items-center gap-1 ${
                filters.minRating === 4
                  ? 'bg-[#FF9900] text-slate-950 font-bold border-[#e68a00]'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }`}
            >
              <Star className="w-3 h-3 fill-current text-amber-500" />
              <span>4★ & Up</span>
            </button>

            <button
              onClick={() => setFilters(prev => ({ ...prev, inStockOnly: !prev.inStockOnly }))}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 border transition ${
                filters.inStockOnly
                  ? 'bg-emerald-600 text-white font-bold border-emerald-700'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }`}
            >
              In Stock
            </button>

            {(filters.primeOnly || filters.maxPrice !== null || filters.minRating !== null || filters.inStockOnly) && (
              <button
                onClick={resetFilters}
                className="px-2.5 py-1.5 rounded-full text-xs text-rose-500 font-bold shrink-0 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800"
              >
                Clear
              </button>
            )}
          </div>

          {/* Results Strip & Sort Dropdown */}
          <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-3 flex flex-wrap items-center justify-between gap-2.5 text-xs shadow-xs">
            <div className="text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs">
              Showing <strong className="text-slate-900 dark:text-white">{sortedProducts.length}</strong> of {products.length} results
              {searchQuery && <span> for "<strong className="text-slate-900 dark:text-white">{searchQuery}</strong>"</span>}
            </div>

            {/* Sort selector */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium text-[11px] sm:text-xs">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="featured">Featured / Best Sellers</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Avg. Customer Review</option>
                <option value="reviews">Most Reviewed</option>
              </select>
            </div>
          </div>

          {/* Product Grid - 2 columns on mobile, 3-4 on larger displays */}
          {sortedProducts.length === 0 ? (
            <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center space-y-3">
              <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No matching products found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing your search query or reset your department and price filters to discover our full catalog.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-slate-900 text-xs font-bold rounded-full transition shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
              {sortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

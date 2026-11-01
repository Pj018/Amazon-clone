import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_REVIEWS } from '../data/mockProducts';
import {
  X,
  Star,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  Share2,
  Lock,
  ThumbsUp,
  MessageSquare,
  Boxes
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    activeProductModal,
    setActiveProductModal,
    addToCart,
    wishlist,
    toggleWishlist,
    setIsCartOpen,
    setIsCheckoutOpen,
    openShareModal,
    addToast,
    openARView
  } = useApp();

  const product = activeProductModal;

  const [selectedImage, setSelectedImage] = useState<string>(product?.image || '');
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors ? product.colors[0] : '');
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes ? product.sizes[0] : '');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews'>('overview');

  // Review Form state
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewHeadline, setReviewHeadline] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [submittedReviews, setSubmittedReviews] = useState(MOCK_REVIEWS);

  if (!product) return null;

  const isSaved = wishlist.includes(product.id);
  const images = product.additionalImages && product.additionalImages.length > 0
    ? product.additionalImages
    : [product.image];

  const currentDisplayImage = selectedImage || product.image;
  const discountAmount = (product.originalPrice - product.price).toFixed(2);
  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor || undefined, selectedSize || undefined);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor || undefined, selectedSize || undefined);
    setActiveProductModal(null);
    setIsCheckoutOpen(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewHeadline.trim()) {
      addToast('error', 'Please provide a review headline', 'Validation Error');
      return;
    }
    if (!reviewComment.trim() || reviewComment.length < 10) {
      addToast('error', 'Review comment must be at least 10 characters', 'Validation Error');
      return;
    }

    const newRev = {
      id: 'rev-' + Date.now(),
      author: 'You (Verified Buyer)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      rating: reviewRating,
      date: 'Just now',
      title: reviewHeadline,
      comment: reviewComment,
      verifiedPurchase: true,
      helpfulCount: 0
    };

    setSubmittedReviews([newRev, ...submittedReviews]);
    setReviewHeadline('');
    setReviewComment('');
    addToast('success', 'Your customer review has been verified and posted!', 'Review Published');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={() => setActiveProductModal(null)}
      />

      {/* Modal Surface */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#181c1d] text-slate-900 dark:text-slate-100 rounded-xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col z-10 border border-slate-200 dark:border-slate-800">
        {/* Modal Header */}
        <div className="px-4 py-3 bg-[#232F3E] text-white flex items-center justify-between border-b border-[#1b2430]">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="font-semibold text-white uppercase">{product.category}</span>
            <span>/</span>
            <span className="text-[#FF9900] font-medium">{product.brand}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                openShareModal(
                  product.title,
                  window.location.href,
                  `Check out this ${product.title} on Amazon Prime for $${product.price}!`
                )
              }
              className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Share product link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveProductModal(null)}
              className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Image Gallery (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {/* Main Image Stage */}
              <div className="relative w-full aspect-square bg-[#f8f9fa] dark:bg-[#131921] rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center p-6 overflow-hidden">
                <img
                  src={currentDisplayImage}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-all duration-300"
                />
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`absolute top-3 right-3 p-2 rounded-full border shadow-sm transition ${
                    isSaved
                      ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/80 dark:border-rose-900'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Thumbnails Row */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded border-2 p-1 bg-white dark:bg-[#131921] transition shrink-0 ${
                      currentDisplayImage === img
                        ? 'border-[#FF9900] ring-1 ring-[#FF9900]'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>

              {/* View in Your Room AR Button */}
              <button
                onClick={() => openARView(product)}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#FF9900] transition flex items-center justify-center gap-1.5 shadow-xs active:scale-98"
              >
                <Boxes className="w-4 h-4 text-[#FF9900]" />
                <span>View in Your Room (AR Simulator)</span>
              </button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded flex flex-col items-center">
                  <Truck className="w-4 h-4 text-[#007185] dark:text-[#3db2c6] mb-1" />
                  <span className="text-[10px] font-bold">Fast Prime</span>
                  <span className="text-[9px] text-slate-500">Free 1-Day</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded flex flex-col items-center">
                  <RotateCcw className="w-4 h-4 text-[#007185] dark:text-[#3db2c6] mb-1" />
                  <span className="text-[10px] font-bold">30-Day</span>
                  <span className="text-[9px] text-slate-500">Free Returns</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 text-[#007185] dark:text-[#3db2c6] mb-1" />
                  <span className="text-[10px] font-bold">Secure Pay</span>
                  <span className="text-[9px] text-slate-500">AES Encrypted</span>
                </div>
              </div>
            </div>

            {/* Middle Column: Details & Specs (4 cols) */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div>
                <a
                  href="#brand"
                  className="text-xs font-semibold text-[#007185] dark:text-[#3db2c6] hover:underline"
                >
                  Visit the {product.brand} Store
                </a>
                <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1 leading-snug">
                  {product.title}
                </h1>

                {/* Star Rating Breakdown */}
                <div className="flex items-center gap-2 mt-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center text-[#e67a00]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-current text-[#e67a00]'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#007185] dark:text-[#3db2c6] hover:underline cursor-pointer">
                    {product.rating} out of 5
                  </span>
                  <span className="text-xs text-slate-500">
                    ({product.reviewCount.toLocaleString()} ratings)
                  </span>
                </div>

                {/* Price Display */}
                <div className="py-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-baseline gap-2">
                    {discountPercent > 0 && (
                      <span className="text-xl font-light text-[#cc0c39]">
                        -{discountPercent}%
                      </span>
                    )}
                    <div className="flex items-baseline text-slate-900 dark:text-white">
                      <span className="text-sm font-semibold leading-none">$</span>
                      <span className="text-3xl font-extrabold tracking-tight leading-none tabular-nums">
                        {Math.floor(product.price)}
                      </span>
                      <span className="text-sm font-semibold leading-none tabular-nums">
                        {(product.price % 1).toFixed(2).substring(2)}
                      </span>
                    </div>
                  </div>
                  {product.originalPrice > product.price && (
                    <div className="text-xs text-slate-500 mt-1">
                      Typical price: <span className="line-through">${product.originalPrice.toFixed(2)}</span> · You save ${discountAmount}
                    </div>
                  )}
                  <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    All prices include applicable state & local sales taxes at checkout.
                  </div>
                </div>

                {/* Color Variants */}
                {product.colors && product.colors.length > 0 && (
                  <div className="py-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                      Color: <strong className="text-slate-900 dark:text-white">{selectedColor}</strong>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {product.colors.map(col => (
                        <button
                          key={col}
                          onClick={() => setSelectedColor(col)}
                          className={`px-3 py-1 text-xs rounded-md border font-medium transition ${
                            selectedColor === col
                              ? 'border-[#FF9900] bg-[#FFF7E8] dark:bg-amber-950/40 text-[#8a5100] dark:text-[#ffb86f] font-bold ring-1 ring-[#FF9900]'
                              : 'border-slate-300 dark:border-slate-700 hover:border-slate-500'
                          }`}
                        >
                          {col}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Variants */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="py-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                      Size: <strong className="text-slate-900 dark:text-white">{selectedSize}</strong>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {product.sizes.map(sz => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`w-10 h-9 text-xs rounded-md border font-medium flex items-center justify-center transition ${
                            selectedSize === sz
                              ? 'border-[#FF9900] bg-[#FFF7E8] dark:bg-amber-950/40 text-[#8a5100] dark:text-[#ffb86f] font-bold ring-1 ring-[#FF9900]'
                              : 'border-slate-300 dark:border-slate-700 hover:border-slate-500'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description & Key Features */}
                <div className="py-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    About this item
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                    {product.description}
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#FF9900] font-bold text-sm leading-none">•</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column: Amazon Buy Box (3 cols) */}
            <div className="lg:col-span-3">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col gap-3 shadow-xs">
                {/* Price In Buy Box */}
                <div className="flex items-baseline text-slate-900 dark:text-white">
                  <span className="text-sm font-semibold leading-none">$</span>
                  <span className="text-2xl font-black tracking-tight leading-none tabular-nums">
                    {product.price.toFixed(2)}
                  </span>
                </div>

                {/* Prime delivery */}
                {product.isPrime ? (
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
                    <span className="font-extrabold text-[#007185] dark:text-[#3db2c6] italic">
                      prime <Check className="w-3 h-3 text-[#FF9900] inline stroke-[3]" />
                    </span>
                    <div className="font-bold mt-1 text-slate-900 dark:text-slate-100">
                      FREE delivery Tomorrow, 8:00 AM – 8:00 PM
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Order within 4 hrs 28 mins
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Standard shipping: $5.99 (Free on orders over $35)
                  </div>
                )}

                {/* Delivery Location */}
                <div className="text-xs text-[#007185] dark:text-[#3db2c6] hover:underline cursor-pointer flex items-center gap-1">
                  Deliver to Alex · Seattle 98101
                </div>

                {/* In Stock */}
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {product.inStock ? 'In Stock' : 'Currently Unavailable'}
                </div>

                {/* Quantity selector */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Quantity:</span>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Primary Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-2.5 px-4 bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] text-xs font-bold rounded-full transition shadow-xs active:scale-[0.98]"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="w-full py-2.5 px-4 bg-[#FFA41C] hover:bg-[#FA8900] text-[#0F1111] text-xs font-bold rounded-full transition shadow-xs active:scale-[0.98]"
                  >
                    Buy Now
                  </button>
                </div>

                {/* Transaction Safety Guarantee */}
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Secure 256-Bit Transaction</span>
                </div>

                <div className="text-[11px] text-slate-500 space-y-0.5">
                  <div>Ships from: <strong className="text-slate-700 dark:text-slate-300">Amazon.com</strong></div>
                  <div>Sold by: <strong className="text-slate-700 dark:text-slate-300">{product.brand} Official</strong></div>
                  <div>Returns: <strong className="text-slate-700 dark:text-slate-300">30-day refund/replacement</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Tabs: Specifications & Customer Reviews */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 mb-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-2 text-sm font-semibold transition border-b-2 -mb-[2px] ${
                  activeTab === 'overview'
                    ? 'border-[#FF9900] text-[#FF9900]'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2 text-sm font-semibold transition border-b-2 -mb-[2px] flex items-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'border-[#FF9900] text-[#FF9900]'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <span>Customer Reviews</span>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">
                  {submittedReviews.length}
                </span>
              </button>
            </div>

            {/* Tab: Specs Table */}
            {activeTab === 'overview' && (
              <div className="max-w-2xl bg-slate-50 dark:bg-slate-800/40 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
                <table className="w-full text-xs">
                  <tbody>
                    {Object.entries(product.specs).map(([key, val], idx) => (
                      <tr
                        key={key}
                        className={idx % 2 === 0 ? 'bg-white/60 dark:bg-slate-900/60' : 'bg-transparent'}
                      >
                        <td className="p-2 font-semibold text-slate-600 dark:text-slate-400 w-1/3">
                          {key}
                        </td>
                        <td className="p-2 text-slate-900 dark:text-slate-200">
                          {val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab: Customer Reviews & Write a Review */}
            {activeTab === 'reviews' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Left: Rating Breakdown */}
                <div className="md:col-span-4 space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                      Customer Reviews
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex text-[#e67a00]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="font-bold text-sm">{product.rating} out of 5</span>
                    </div>

                    {/* Histograms */}
                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                      {[
                        { star: 5, pct: 82 },
                        { star: 4, pct: 12 },
                        { star: 3, pct: 3 },
                        { star: 2, pct: 1 },
                        { star: 1, pct: 2 },
                      ].map((item) => (
                        <div key={item.star} className="flex items-center gap-2">
                          <span className="w-12 text-right">{item.star} star</span>
                          <div className="flex-1 h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#FF9900]"
                              style={{ width: `${item.pct}%` }}
                            />
                          </div>
                          <span className="w-8 text-right font-mono">{item.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Write a review box */}
                  <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                    <h4 className="font-bold text-xs uppercase tracking-wide text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#FF9900]" /> Review this product
                    </h4>
                    <p className="text-xs text-slate-500 mb-3">
                      Share your thoughts with other customers
                    </p>

                    <form onSubmit={handleReviewSubmit} className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Rating
                        </label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              type="button"
                              key={s}
                              onClick={() => setReviewRating(s)}
                              className="p-1 hover:scale-110 transition"
                            >
                              <Star
                                className={`w-5 h-5 ${
                                  s <= reviewRating
                                    ? 'text-[#e67a00] fill-current'
                                    : 'text-slate-300 dark:text-slate-600'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <input
                          type="text"
                          value={reviewHeadline}
                          onChange={(e) => setReviewHeadline(e.target.value)}
                          placeholder="Headline (e.g. Best investment of the year)"
                          className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                        />
                      </div>

                      <div>
                        <textarea
                          rows={3}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="What did you like or dislike? How does it perform?"
                          className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-1.5 text-xs font-bold bg-[#FFD814] hover:bg-[#F7CA00] text-slate-900 rounded-md transition shadow-xs"
                      >
                        Submit Verified Review
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right: Reviews List */}
                <div className="md:col-span-8 space-y-4">
                  {submittedReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-lg bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.avatar}
                          alt={rev.author}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {rev.author}
                          </div>
                          {rev.verifiedPurchase && (
                            <span className="text-[10px] text-[#c45500] font-bold">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex text-[#e67a00]">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating
                                  ? 'fill-current text-[#e67a00]'
                                  : 'text-slate-300 dark:text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                          {rev.title}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400">
                        Reviewed on {rev.date}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {rev.comment}
                      </p>

                      <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-500">
                        <button
                          onClick={() => addToast('info', 'Thank you for your feedback!')}
                          className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1 transition"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>Helpful ({rev.helpfulCount})</span>
                        </button>
                        <span>|</span>
                        <button
                          onClick={() => addToast('info', 'Review report submitted for moderation')}
                          className="hover:underline"
                        >
                          Report abuse
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Mobile Purchase Bar (Thumb Reach Zone) */}
        <div className="sticky bottom-0 left-0 right-0 p-3 bg-white/95 dark:bg-[#131921]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 z-30 lg:hidden shadow-lg">
          <div className="flex flex-col pr-1">
            <span className="text-[10px] text-slate-400">Total</span>
            <span className="text-sm font-black text-slate-900 dark:text-white font-mono tabular-nums leading-tight">
              ${(product.price * quantity).toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-1 py-2.5 px-3 bg-[#FFD814] active:bg-[#F7CA00] text-slate-950 text-xs font-bold rounded-full shadow-xs active:scale-95 transition"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 py-2.5 px-3 bg-[#FFA41C] active:bg-[#FA8900] text-slate-950 text-xs font-bold rounded-full shadow-xs active:scale-95 transition"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

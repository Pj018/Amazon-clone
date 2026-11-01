import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, Order } from '../../types';
import {
  TrendingUp,
  DollarSign,
  Package,
  ShoppingCart,
  Percent,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Plus,
  ArrowUpRight,
  BarChart2,
  Box,
  Trash2,
  Edit3,
  Search,
  Truck,
  ShieldCheck,
  User,
  Check,
  X,
  ExternalLink,
  Layers,
  Sparkles,
  Server,
  Database
} from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Sony Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', cat: 'audio' as const, brand: 'Sony' },
  { label: 'Echo Smart Speaker', url: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&auto=format&fit=crop&q=80', cat: 'electronics' as const, brand: 'Amazon' },
  { label: 'Apple iPad', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80', cat: 'electronics' as const, brand: 'Apple' },
  { label: 'Instant Pot Cooker', url: 'https://images.unsplash.com/photo-1584990347449-3a3237554900?w=800&auto=format&fit=crop&q=80', cat: 'home' as const, brand: 'Instant Pot' },
  { label: 'Nike Running Shoes', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', cat: 'fashion' as const, brand: 'Nike' },
  { label: 'Kindle E-Reader', url: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=800&auto=format&fit=crop&q=80', cat: 'books' as const, brand: 'Amazon' },
];

export const SellerDashboard: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    restockProduct,
    orders,
    updateOrderStatus,
    setActiveTab,
    addToast
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'orders' | 'analytics' | 'roles'>('catalog');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days'>('today');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; label: string; val: string } | null>(null);

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBrand, setNewBrand] = useState('Amazon Basics');
  const [newCategory, setNewCategory] = useState<Product['category']>('electronics');
  const [newPrice, setNewPrice] = useState('89.99');
  const [newOriginalPrice, setNewOriginalPrice] = useState('119.99');
  const [newStock, setNewStock] = useState('50');
  const [newImage, setNewImage] = useState(PRESET_IMAGES[0].url);
  const [newIsPrime, setNewIsPrime] = useState(true);
  const [newIsBestSeller, setNewIsBestSeller] = useState(false);
  const [newDescription, setNewDescription] = useState('High performance authentic merchandise backed by Amazon Prime 1-day delivery guarantee.');

  // Inline Price Editing
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingPriceValue, setEditingPriceValue] = useState<string>('');

  const handleStartEditPrice = (product: Product) => {
    setEditingProductId(product.id);
    setEditingPriceValue(product.price.toString());
  };

  const handleSavePrice = (productId: string) => {
    const parsed = parseFloat(editingPriceValue);
    if (isNaN(parsed) || parsed <= 0) {
      addToast('error', 'Please enter a valid price amount greater than $0.', 'Invalid Price');
      return;
    }
    updateProduct(productId, { price: parsed });
    setEditingProductId(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(newPrice);
    const origPriceNum = parseFloat(newOriginalPrice) || priceNum;
    const stockNum = parseInt(newStock, 10);

    if (!newTitle.trim()) {
      addToast('error', 'Please provide a valid product title.', 'Missing Title');
      return;
    }
    if (isNaN(priceNum) || priceNum <= 0) {
      addToast('error', 'Please enter a valid price amount.', 'Invalid Price');
      return;
    }

    addProduct({
      title: newTitle.trim(),
      brand: newBrand.trim(),
      category: newCategory,
      price: priceNum,
      originalPrice: origPriceNum,
      rating: 4.8,
      reviewCount: 14,
      image: newImage || PRESET_IMAGES[0].url,
      isPrime: newIsPrime,
      isBestSeller: newIsBestSeller,
      inStock: stockNum > 0,
      stockCount: isNaN(stockNum) ? 30 : stockNum,
      description: newDescription.trim(),
      features: [
        'Amazon Prime Verified 1-Day Free Delivery',
        '30-Day Hassle-Free Returns & Money Back Guarantee',
        'Official Manufacturer 1-Year Limited Warranty'
      ],
      specs: {
        'Condition': 'Brand New / Factory Sealed',
        'Fulfillment': 'Fulfilled by Amazon (FBA)',
        'Merchant': 'Verified Prime Retail Partner'
      }
    });

    setIsAddModalOpen(false);
    // Reset form
    setNewTitle('');
    setNewPrice('89.99');
    setNewOriginalPrice('119.99');
    setNewStock('50');
  };

  // Filtered catalog
  const filteredProducts = products.filter(p => {
    if (selectedCategoryFilter !== 'all' && p.category !== selectedCategoryFilter) return false;
    if (catalogSearch.trim()) {
      const q = catalogSearch.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    }
    return true;
  });

  // Calculate quick metrics
  const totalCatalogValue = products.reduce((sum, p) => sum + (p.price * p.stockCount), 0);
  const lowStockCount = products.filter(p => p.stockCount <= 15).length;
  const outOfStockCount = products.filter(p => p.stockCount === 0 || !p.inStock).length;

  // Real-time sales graph data points
  const hourlyData = [
    { label: '00:00', sales: 420 },
    { label: '03:00', sales: 210 },
    { label: '06:00', sales: 650 },
    { label: '09:00', sales: 1840 },
    { label: '12:00', sales: 2490 },
    { label: '15:00', sales: 3120 },
    { label: '18:00', sales: 2850 },
    { label: '21:00', sales: 1980 },
  ];

  const maxSale = Math.max(...hourlyData.map(d => d.sales));
  const svgWidth = 600;
  const svgHeight = 180;
  const paddingX = 40;
  const paddingY = 30;

  const points = hourlyData.map((d, i) => {
    const x = paddingX + (i / (hourlyData.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - (d.sales / maxSale) * (svgHeight - paddingY * 2);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  return (
    <div className="w-full space-y-5">
      {/* 1. Header Banner & Console Identification */}
      <div className="bg-[#131921] text-white rounded-xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
              amazon<span className="text-[#FF9900]">seller central</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
              STORE ADMIN CONSOLE
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            You are managing the store's complete product catalog, real-time inventory, pricing, customer orders fulfillment, and sales velocity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-[#FF9900] hover:bg-[#e68a00] text-slate-950 font-bold text-xs rounded-lg transition shadow-md flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Product</span>
          </button>
          <button
            onClick={() => setActiveTab('store')}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition border border-slate-700 flex items-center gap-1.5"
            title="View Live Customer Storefront"
          >
            <span>View Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Management Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('catalog')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeSubTab === 'catalog'
              ? 'bg-[#131921] text-white dark:bg-slate-800 dark:text-[#FF9900]'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <Package className="w-4 h-4 text-[#FF9900]" />
          <span>Product Catalog & Stock ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('orders')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeSubTab === 'orders'
              ? 'bg-[#131921] text-white dark:bg-slate-800 dark:text-[#FF9900]'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <ShoppingCart className="w-4 h-4 text-emerald-500" />
          <span>Customer Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeSubTab === 'analytics'
              ? 'bg-[#131921] text-white dark:bg-slate-800 dark:text-[#FF9900]'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-sky-400" />
          <span>Sales & GMV Analytics</span>
        </button>

        <button
          onClick={() => setActiveSubTab('roles')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeSubTab === 'roles'
              ? 'bg-[#131921] text-white dark:bg-slate-800 dark:text-[#FF9900]'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4 text-purple-400" />
          <span>Who Manages What?</span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}

      {/* SUBTAB 1: PRODUCT CATALOG & STOCK */}
      {activeSubTab === 'catalog' && (
        <div className="space-y-4">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 shadow-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Total Products</span>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{products.length} Items</div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">100% Active in Store</span>
            </div>

            <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 shadow-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Inventory Asset Value</span>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5 font-mono">${totalCatalogValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
              <span className="text-[10px] text-slate-400">At current retail pricing</span>
            </div>

            <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 shadow-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Low Stock Alerts</span>
              <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5">{lowStockCount} Items</div>
              <span className="text-[10px] text-amber-500 font-semibold">≤ 15 units available</span>
            </div>

            <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 shadow-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Out of Stock</span>
              <div className="text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">{outOfStockCount} Items</div>
              <span className="text-[10px] text-slate-400">Requires restocking</span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={catalogSearch}
                onChange={e => setCatalogSearch(e.target.value)}
                placeholder="Search products by title, brand, or ID..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#FF9900]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Category:</span>
              <select
                value={selectedCategoryFilter}
                onChange={e => setSelectedCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="all">All Departments</option>
                <option value="audio">Audio & Echo</option>
                <option value="electronics">Electronics & Tech</option>
                <option value="home">Home & Kitchen</option>
                <option value="fashion">Fashion & Apparel</option>
                <option value="books">Kindles & Books</option>
                <option value="beauty">Beauty & Wellness</option>
              </select>
            </div>
          </div>

          {/* Product Items Table / Cards */}
          <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Box className="w-4 h-4 text-[#FF9900]" />
                Live Storefront Inventory ({filteredProducts.length})
              </h3>
              <span className="text-[11px] text-slate-500">Click prices to edit or restock in 1 click</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredProducts.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No products matched your search or category filter.
                </div>
              ) : (
                filteredProducts.map(product => {
                  const isEditingPrice = editingProductId === product.id;

                  return (
                    <div
                      key={product.id}
                      className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
                    >
                      {/* Product Thumbnail & Details */}
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-12 h-12 object-contain bg-slate-50 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                              {product.id}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              {product.brand}
                            </span>
                            {product.isPrime && (
                              <span className="text-[10px] text-[#007185] dark:text-[#3db2c6] italic font-black">
                                prime✓
                              </span>
                            )}
                            {product.isBestSeller && (
                              <span className="text-[9px] bg-amber-500/20 text-[#FF9900] px-1 rounded font-black uppercase">
                                Best Seller
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate max-w-md">
                            {product.title}
                          </h4>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>Dept: <strong className="capitalize">{product.category}</strong></span>
                            <span>·</span>
                            <span>{product.reviewCount} customer reviews</span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing & Stock Controls */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                        {/* Price Column */}
                        <div className="text-left sm:text-right">
                          <div className="text-[10px] text-slate-400">Retail Price</div>
                          {isEditingPrice ? (
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-xs font-bold">$</span>
                              <input
                                type="number"
                                step="0.01"
                                value={editingPriceValue}
                                onChange={e => setEditingPriceValue(e.target.value)}
                                className="w-16 px-1.5 py-0.5 rounded border border-[#FF9900] text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 outline-none"
                              />
                              <button
                                onClick={() => handleSavePrice(product.id)}
                                className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white"
                                title="Save Price"
                              >
                                <Check className="w-3 h-3 stroke-[3]" />
                              </button>
                              <button
                                onClick={() => setEditingProductId(null)}
                                className="p-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                                title="Cancel"
                              >
                                <X className="w-3 h-3 stroke-[3]" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleStartEditPrice(product)}
                              className="group flex items-center gap-1 font-mono font-bold text-sm text-slate-900 dark:text-white hover:text-[#FF9900]"
                              title="Click to change price"
                            >
                              <span>${product.price.toFixed(2)}</span>
                              <Edit3 className="w-3 h-3 text-slate-400 opacity-60 group-hover:opacity-100" />
                            </button>
                          )}
                        </div>

                        {/* Stock Column */}
                        <div className="text-left sm:text-right">
                          <div className="text-[10px] text-slate-400">Stock Count</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              product.stockCount <= 0
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                : product.stockCount <= 15
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            }`}>
                              {product.stockCount} in stock
                            </span>
                          </div>
                        </div>

                        {/* Actions (Restock + Delete) */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => restockProduct(product.id, 25)}
                            className="px-2.5 py-1.5 bg-[#FFD814] hover:bg-[#F7CA00] text-slate-950 font-bold rounded-lg text-xs transition shadow-xs flex items-center gap-1 active:scale-95"
                            title="Restock 25 units"
                          >
                            <Plus className="w-3 h-3" />
                            <span>+25</span>
                          </button>
                          <button
                            onClick={() => restockProduct(product.id, 100)}
                            className="px-2 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-xs transition active:scale-95 hidden sm:inline-flex"
                            title="Restock 100 units"
                          >
                            +100
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delist "${product.title}"?`)) {
                                deleteProduct(product.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                            title="Delist product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: CUSTOMER ORDERS & FULFILLMENT */}
      {activeSubTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-emerald-500" />
                  Merchant Orders & Delivery Fulfillment
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update customer shipment checkpoints from Processing → Shipped → Out for Delivery → Delivered
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                {orders.length} Active Orders
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-3">
              {orders.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No orders placed yet. Place an order in the Storefront to see it here!
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="py-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#007185] dark:text-[#3db2c6]">
                            Order #{order.id}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : order.status === 'Shipped' || order.status === 'Out for Delivery'
                              ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Date: {order.date} · Tracking: <span className="font-mono">{order.trackingNumber}</span> · Carrier: {order.carrier}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-black font-mono text-slate-900 dark:text-white">
                          ${order.total.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400 capitalize">
                          Paid via {order.paymentMethod}
                        </div>
                      </div>
                    </div>

                    {/* Items row */}
                    <div className="bg-slate-50 dark:bg-slate-800/40 rounded-lg p-2.5 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 overflow-x-auto">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 shrink-0 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                            <img src={item.image} alt={item.title} className="w-6 h-6 object-contain" />
                            <span className="text-[11px] font-medium truncate max-w-[140px]">{item.title}</span>
                            <span className="text-[10px] text-slate-400">×{item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="text-[11px] text-slate-500 shrink-0">
                        Ship to: <strong>{order.shippingAddress.fullName}</strong> ({order.shippingAddress.city}, {order.shippingAddress.state})
                      </div>
                    </div>

                    {/* Status Stepper Progression for Admin */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-[11px] text-slate-500 font-medium">
                        Change Fulfillment State:
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Processing')}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                            order.status === 'Processing'
                              ? 'bg-amber-500 text-slate-950 font-black'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          Processing
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Shipped')}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                            order.status === 'Shipped'
                              ? 'bg-sky-500 text-white font-black'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          Mark Shipped
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Out for Delivery')}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                            order.status === 'Out for Delivery'
                              ? 'bg-indigo-500 text-white font-black'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          Out for Delivery
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Delivered')}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-600 text-white font-black'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          Delivered ✓
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: SALES & GMV ANALYTICS */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-4">
          {/* KPI Cards Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Today's Ordered GMV</span>
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center font-bold text-[11px]">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +18.4%
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums font-mono">
                $14,892.40
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                384 units ordered today
              </div>
            </div>

            <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Buy Box Win Rate</span>
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center font-bold text-[11px]">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +1.2%
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums font-mono">
                96.8%
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Top competitive placement
              </div>
            </div>

            <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Conversion Rate</span>
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center font-bold text-[11px]">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +0.9%
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums font-mono">
                12.4%
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                2,840 product sessions
              </div>
            </div>

            <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Return Defect Rate</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                  0.34%
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums font-mono">
                Under 1%
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                Policy Healthy (&lt; 1.0% req)
              </div>
            </div>
          </div>

          {/* SVG Sales Velocity Chart */}
          <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[#FF9900]" />
                  Real-Time Sales Velocity & GMV Output
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hourly order volume and revenue generation across all marketplace channels
                </p>
              </div>

              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
                {(['today', '7days', '30days'] as const).map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-2.5 py-1 rounded-md transition ${
                      timeRange === range
                        ? 'bg-[#FF9900] text-slate-950 font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {range === 'today' ? 'Today' : range === '7days' ? '7 Days' : '30 Days'}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full overflow-hidden bg-slate-50 dark:bg-slate-900/60 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-44 sm:h-52 overflow-visible">
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF9900" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#FF9900" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Gridlines */}
                {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                  const y = paddingY + pct * (svgHeight - paddingY * 2);
                  return (
                    <line
                      key={i}
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="currentColor"
                      className="text-slate-200 dark:text-slate-800"
                      strokeDasharray="4 4"
                    />
                  );
                })}

                {/* Shaded Area */}
                <path d={areaD} fill="url(#salesGrad)" />

                {/* Curve line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#FF9900"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data points */}
                {points.map((p, i) => (
                  <g key={i}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="4"
                      className="fill-white dark:fill-slate-900 stroke-[#FF9900] stroke-2 cursor-pointer hover:r-6 transition-all"
                      onMouseEnter={() => setHoveredPoint({ x: p.x, y: p.y, label: p.label, val: `$${p.sales.toLocaleString()}` })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    <text
                      x={p.x}
                      y={svgHeight - 10}
                      textAnchor="middle"
                      className="text-[10px] fill-slate-400 font-mono"
                    >
                      {p.label}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Tooltip on hover */}
              {hoveredPoint && (
                <div
                  className="absolute bg-[#131921] text-white px-2.5 py-1 rounded text-xs font-mono shadow-xl border border-slate-700 pointer-events-none transform -translate-x-1/2 -translate-y-full"
                  style={{ left: `${(hoveredPoint.x / svgWidth) * 100}%`, top: `${(hoveredPoint.y / svgHeight) * 100}%` }}
                >
                  <div className="text-[10px] text-slate-400">{hoveredPoint.label}</div>
                  <div className="font-bold text-[#FF9900]">{hoveredPoint.val}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: WHO MANAGES WHAT? ROLES BREAKDOWN */}
      {activeSubTab === 'roles' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-500" />
              Amazon Ecosystem: Roles & Responsibility Matrix
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl">
              In this full-scale retail application, management responsibilities are clearly partitioned across 4 specialized consoles:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Role 1: Seller / Store Admin */}
              <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                    <Package className="w-4 h-4 text-[#FF9900]" />
                    <span>Store Merchant & Seller Admin</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-[10px] font-bold">
                    THIS CONSOLE
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  <strong>What they manage:</strong>
                </p>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                  <li>Adds new products with custom pricing, images, and descriptions</li>
                  <li>Restocks inventory (+25, +100 units) to prevent out-of-stock</li>
                  <li>Edits product prices and delists obsolete items</li>
                  <li>Fulfills customer orders by advancing delivery status</li>
                  <li>Monitors real-time sales velocity and Buy Box win percentages</li>
                </ul>
              </div>

              {/* Role 2: Logistics & Dispatch */}
              <div className="p-4 rounded-xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/50 dark:bg-sky-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                    <Truck className="w-4 h-4 text-sky-500" />
                    <span>Logistics Dispatch Fleet</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('logistics_hub')}
                    className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    Open Hub →
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  <strong>What they manage:</strong>
                </p>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                  <li>Last-mile delivery vans and carrier drivers</li>
                  <li>Live GPS vehicle routing and real-time package telemetry</li>
                  <li>Fulfillment center dispatch queues and delivery ETAs</li>
                  <li>Package scanning and route optimization</li>
                </ul>
              </div>

              {/* Role 3: Security & Database Admin */}
              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Security Vault & Database Admin</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('security_hub')}
                    className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Open Vault →
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  <strong>What they manage:</strong>
                </p>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                  <li>Client-side AES-256-GCM data encryption</li>
                  <li>Automated snapshot backups and single-click restoration</li>
                  <li>Offline queue synchronization and reconnection replay</li>
                  <li>Security audit logs and access integrity tracking</li>
                </ul>
              </div>

              {/* Role 4: Shoppers / Customers */}
              <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                    <User className="w-4 h-4 text-purple-500" />
                    <span>Customer & Shopper Hub</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('customer_hub')}
                    className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Open You Hub →
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  <strong>What they manage:</strong>
                </p>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                  <li>Browses the 2-column mobile storefront and filters items</li>
                  <li>Places orders via Prime 1-day delivery and Amazon Pay QR</li>
                  <li>Initiates item returns and generates return QR codes</li>
                  <li>Manages saved addresses, wishlists, and Amazon Prime membership</li>
                </ul>
              </div>

              {/* Role 5: Spring Boot & MySQL Enterprise Backend */}
              <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30 space-y-2 col-span-1 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                    <Server className="w-4 h-4 text-emerald-500" />
                    <span>Spring Boot 3.3.4 & MySQL Backend Microservice</span>
                    <span className="bg-emerald-500 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded">
                      JAVA 17
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('spring_boot_hub')}
                    className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>Inspect Spring Boot API</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  <strong>What it manages:</strong>
                </p>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                  <li>Exposes high-performance RESTful endpoints under <code>/api/v1/*</code> for Catalog, Orders, and Telemetry</li>
                  <li>ACID data transactions in MySQL 8.0 via Spring Data JPA and Hibernate 6 ORM entity mappings</li>
                  <li>HikariCP high-throughput database connection pooling with sub-20ms P99 latency</li>
                  <li>Spring Security 6 stateless JWT bearer authentication with role-based authorization</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL: ADD NEW PRODUCT TO CATALOG */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#181c1d] rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl overflow-hidden my-8">
            <div className="bg-[#131921] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#FF9900]" />
                <h3 className="font-bold text-sm sm:text-base">Add New Product to Store Catalog</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Preset Image Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Choose Image or Preset
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => {
                        setNewImage(preset.url);
                        setNewCategory(preset.cat);
                        setNewBrand(preset.brand);
                      }}
                      className={`relative aspect-square rounded-lg border p-1 overflow-hidden transition ${
                        newImage === preset.url
                          ? 'border-[#FF9900] ring-2 ring-[#FF9900]/40'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-contain" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] text-white text-center truncate px-0.5">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  value={newImage}
                  onChange={e => setNewImage(e.target.value)}
                  placeholder="Or paste any custom image URL..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#FF9900]"
                />
              </div>

              {/* Title & Brand */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. Sony WH-CH720N Wireless Noise Canceling Headphones"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#FF9900]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Brand Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newBrand}
                      onChange={e => setNewBrand(e.target.value)}
                      placeholder="e.g. Sony, Apple, Nike"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#FF9900]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Department / Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value as Product['category'])}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none"
                    >
                      <option value="audio">Audio & Echo</option>
                      <option value="electronics">Electronics & Tech</option>
                      <option value="home">Home & Kitchen</option>
                      <option value="fashion">Fashion & Apparel</option>
                      <option value="books">Kindles & Books</option>
                      <option value="beauty">Beauty & Wellness</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Price, Original Price, Stock */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sale Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                    placeholder="49.99"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white font-mono font-bold outline-none focus:ring-2 focus:ring-[#FF9900]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    MSRP / List Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newOriginalPrice}
                    onChange={e => setNewOriginalPrice(e.target.value)}
                    placeholder="79.99"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-[#FF9900]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Units in Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={e => setNewStock(e.target.value)}
                    placeholder="50"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-[#FF9900]"
                  />
                </div>
              </div>

              {/* Prime & Best Seller Toggles */}
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={newIsPrime}
                    onChange={e => setNewIsPrime(e.target.checked)}
                    className="rounded text-[#FF9900] focus:ring-[#FF9900]"
                  />
                  <span>Amazon Prime Eligible (Free 1-Day)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={newIsBestSeller}
                    onChange={e => setNewIsBestSeller(e.target.checked)}
                    className="rounded text-[#FF9900] focus:ring-[#FF9900]"
                  />
                  <span>#1 Best Seller Badge</span>
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#FF9900]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FF9900] hover:bg-[#e68a00] text-slate-950 text-xs font-bold rounded-lg shadow-md transition active:scale-95 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Publish to Storefront</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

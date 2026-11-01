import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, UserProfile, Address, BackupSnapshot, SecurityAuditLog, NotificationItem } from '../types';
import { MOCK_PRODUCTS, MOCK_ORDERS } from '../data/mockProducts';
import { createAuditEntry, generateBackupSnapshot, decryptSensitiveData } from '../utils/security';
import { addToSyncQueue, getSyncQueue, processSyncQueue, getLastSyncTime } from '../utils/syncManager';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
}

export type ViewTab = 'store' | 'customer_hub' | 'seller_hub' | 'logistics_hub' | 'security_hub' | 'spring_boot_hub';

interface AppContextType {
  user: UserProfile | null;
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  filters: {
    primeOnly: boolean;
    inStockOnly: boolean;
    minRating: number | null;
    maxPrice: number | null;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    primeOnly: boolean;
    inStockOnly: boolean;
    minRating: number | null;
    maxPrice: number | null;
  }>>;
  resetFilters: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  isOffline: boolean;
  toggleOfflineMode: () => void;
  pendingSyncCount: number;
  lastSyncTime: string;
  triggerManualSync: () => Promise<void>;
  mobileFrameMode: boolean;
  setMobileFrameMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  activeProductModal: Product | null;
  setActiveProductModal: (prod: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  shareData: { title: string; url: string; text: string } | null;
  openShareModal: (title: string, url: string, text: string) => void;
  confirmedOrder: Order | null;
  setConfirmedOrder: (order: Order | null) => void;
  backups: BackupSnapshot[];
  createBackupNow: () => Promise<void>;
  restoreBackupById: (id: string) => Promise<boolean>;
  auditLogs: SecurityAuditLog[];
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], message: string, title?: string) => void;
  removeToast: (id: string) => void;
  // Mobile App Native Features
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  isVoiceSearchOpen: boolean;
  setIsVoiceSearchOpen: (open: boolean) => void;
  isLensScannerOpen: boolean;
  setIsLensScannerOpen: (open: boolean) => void;
  isQRPayOpen: boolean;
  setIsQRPayOpen: (open: boolean) => void;
  isAddressSheetOpen: boolean;
  setIsAddressSheetOpen: (open: boolean) => void;
  isCustomerServiceOpen: boolean;
  setIsCustomerServiceOpen: (open: boolean) => void;
  isARViewOpen: boolean;
  setIsARViewOpen: (open: boolean) => void;
  arProduct: Product | null;
  openARView: (prod: Product) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  selectedAddress: Address;
  setSelectedAddress: (addr: Address) => void;
  addNewAddress: (addr: Address) => void;
  // Commerce actions
  products: Product[];
  addProduct: (productData: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  restockProduct: (id: string, units: number) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  placeOrder: (data: {
    address: Address;
    deliveryOption: 'prime_one_day' | 'standard' | 'priority_overnight';
    paymentMethod: string;
  }) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  requestReturn: (orderId: string, reason: string) => void;
  // Auth actions
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  socialLogin: (provider: 'google' | 'apple' | 'facebook' | 'github') => Promise<void>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_USER: UserProfile = {
  id: 'usr-928401',
  name: 'Alex Rivera',
  email: 'alex.rivera@prime.example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  role: 'customer',
  isPrimeMember: true,
  primeMemberSince: '2021',
  walletBalance: 245.50,
  provider: 'email',
  twoFactorEnabled: true,
  createdAt: '2021-04-12',
  savedAddresses: [
    {
      fullName: 'Alex Rivera',
      street: '742 Evergreen Terrace',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      phone: '+1 (206) 555-0199',
      isDefault: true
    },
    {
      fullName: 'Alex Rivera (Office)',
      street: '410 Terry Ave N (Amazon HQ Reception)',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98109',
      phone: '+1 (206) 555-0142',
      isDefault: false
    }
  ]
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('amz_theme');
    return saved === 'dark';
  });

  // Sync theme class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('amz_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('amz_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    addToast('info', `Switched to ${!darkMode ? 'Dark' : 'Light'} Mode`, 'Theme Updated');
  };

  // User state
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('amz_user_profile');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('amz_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    // Default 1 initial item for demo delight
    return [
      {
        product: MOCK_PRODUCTS[0],
        quantity: 1,
        selectedColor: 'Deep Sea Blue'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('amz_cart', JSON.stringify(cart));
  }, [cart]);

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('amz_wishlist');
    return saved ? JSON.parse(saved) : ['prod-002', 'prod-003'];
  });

  useEffect(() => {
    localStorage.setItem('amz_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('amz_orders');
    return saved ? JSON.parse(saved) : MOCK_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('amz_orders', JSON.stringify(orders));
  }, [orders]);

  // Live Products catalog state (persisted or defaults to MOCK_PRODUCTS)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('amz_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        /* ignore */
      }
    }
    return MOCK_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('amz_products', JSON.stringify(products));
  }, [products]);

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newId = `prod-${Date.now().toString().slice(-6)}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
    };
    setProducts(prev => [newProduct, ...prev]);
    addToast('success', `Product "${newProduct.title.slice(0, 30)}..." added to catalog.`, 'Product Published');
    createAuditEntry(`Merchant added product: ${newProduct.title} (ID: ${newId})`, 'SUCCESS');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
    addToast('success', 'Product details updated successfully.', 'Catalog Updated');
  };

  const deleteProduct = (id: string) => {
    const target = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    addToast('warning', `Product "${target?.title.slice(0, 25) || id}..." delisted.`, 'Product Removed');
    createAuditEntry(`Merchant deleted product: ${target?.title || id}`, 'WARNING');
  };

  const restockProduct = (id: string, units: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const newStock = p.stockCount + units;
          return {
            ...p,
            stockCount: newStock,
            inStock: newStock > 0
          };
        }
        return p;
      })
    );
    addToast('success', `Restocked +${units} units.`, 'Inventory Updated');
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          const updatedCheckpoints = [...o.checkpoints];
          if (status === 'Shipped' && updatedCheckpoints.length > 1) {
            updatedCheckpoints[1] = { ...updatedCheckpoints[1], completed: true, time: 'Just now' };
          } else if (status === 'Out for Delivery' && updatedCheckpoints.length > 2) {
            updatedCheckpoints[1] = { ...updatedCheckpoints[1], completed: true };
            updatedCheckpoints[2] = { ...updatedCheckpoints[2], completed: true, time: 'Out on courier van' };
          } else if (status === 'Delivered' && updatedCheckpoints.length > 3) {
            updatedCheckpoints.forEach(cp => { cp.completed = true; });
            updatedCheckpoints[3] = { ...updatedCheckpoints[3], completed: true, time: 'Delivered to resident' };
          }
          return { ...o, status, checkpoints: updatedCheckpoints };
        }
        return o;
      })
    );
    addToast('info', `Order #${orderId} marked as "${status}".`, 'Order Fulfillment');
  };

  // Offline simulation & queue
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [lastSyncTime, setLastSyncTime] = useState<string>(getLastSyncTime());

  // Listen to browser network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      triggerManualSync();
    };
    const handleOffline = () => {
      setIsOffline(true);
      addToast('warning', 'Device went offline. Changes will queue locally.', 'Offline Mode');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial queue count check
    setPendingSyncCount(getSyncQueue().length);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleOfflineMode = () => {
    setIsOffline(prev => {
      const next = !prev;
      if (next) {
        addToast('warning', 'Simulating Offline Mode. All orders and changes will queue locally.', 'Offline Activated');
      } else {
        addToast('success', 'Back Online. Synchronizing queued transactions...', 'Online Connected');
        setTimeout(() => triggerManualSync(), 400);
      }
      return next;
    });
  };

  const triggerManualSync = async () => {
    if (isOffline) {
      addToast('error', 'Cannot sync while offline. Please reconnect first.', 'Sync Paused');
      return;
    }
    const result = await processSyncQueue((item, remaining) => {
      setPendingSyncCount(remaining);
    });
    setPendingSyncCount(getSyncQueue().length);
    setLastSyncTime(getLastSyncTime());
    if (result.successCount > 0) {
      addToast('success', `Synced ${result.successCount} pending operations to cloud database`, 'Data Synchronized');
    }
  };

  // Backups and Audit Logs
  const [backups, setBackups] = useState<BackupSnapshot[]>(() => {
    const saved = localStorage.getItem('amz_backups');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 'BKP-SYSTEM-INITIAL',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        version: '3.4.0-AWS-RDS',
        recordCount: { orders: 2, cart: 1, wishlist: 2, addresses: 2 },
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        encryptedData: 'eyJhbGciOiJBRVMtMjU2LUdDTSI...BASE64_PAYLOAD',
        autoGenerated: true
      }
    ];
  });

  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>([]);

  // Seed initial audit log
  useEffect(() => {
    createAuditEntry('SESSION_INITIALIZED: TLS 1.3 Handshake completed & verified', 'SUCCESS').then(entry => {
      setAuditLogs([entry]);
    });
  }, []);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [filters, setFilters] = useState<{
    primeOnly: boolean;
    inStockOnly: boolean;
    minRating: number | null;
    maxPrice: number | null;
  }>({
    primeOnly: false,
    inStockOnly: false,
    minRating: null,
    maxPrice: null
  });

  const resetFilters = () => {
    setFilters({
      primeOnly: false,
      inStockOnly: false,
      minRating: null,
      maxPrice: null
    });
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('featured');
    addToast('info', 'Filters have been reset', 'Filters Cleared');
  };

  // View & UI Navigation States
  const [mobileFrameMode, setMobileFrameMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ViewTab>('store');
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [shareData, setShareData] = useState<{ title: string; url: string; text: string } | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], message: string, title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev.slice(-3), { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const openShareModal = (title: string, url: string, text: string) => {
    setShareData({ title, url, text });
    setIsShareModalOpen(true);
  };

  // Mobile App Native Features State
  const [selectedAddress, setSelectedAddress] = useState<Address>(() => {
    return user?.savedAddresses[0] || {
      fullName: 'Alex Rivera',
      street: '742 Evergreen Terrace',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      phone: '+1 (206) 555-0199'
    };
  });

  const addNewAddress = (addr: Address) => {
    if (user) {
      const updated = [...user.savedAddresses, addr];
      const updatedUser = { ...user, savedAddresses: updated };
      setUser(updatedUser);
      localStorage.setItem('amz_user_profile', JSON.stringify(updatedUser));
    }
    setSelectedAddress(addr);
    addToast('success', `Delivery address updated to "${addr.street}"`, 'Address Saved');
  };

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Package Out for Delivery',
      message: 'Your order (Sony WH-1000XM5) is 8 stops away. Arriving by 8:00 PM today via Prime Van #412.',
      timestamp: '12m ago',
      type: 'order',
      read: false,
      linkTab: 'customer_hub'
    },
    {
      id: 'notif-2',
      title: 'Lightning Deal: Echo Dot 5th Gen',
      message: 'Exclusive Prime Lightning Deal: 30% off for the next 2 hours. Claim before stock ends!',
      timestamp: '1h ago',
      type: 'deal',
      read: false,
      linkTab: 'store'
    },
    {
      id: 'notif-3',
      title: 'Verified 2FA Security Sign-In',
      message: 'New verified session authorized on mobile client with TLS 1.3 encryption (Seattle, WA).',
      timestamp: '3h ago',
      type: 'security',
      read: true,
      linkTab: 'security_hub'
    }
  ]);

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    addToast('info', 'All notifications cleared');
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  const [isLensScannerOpen, setIsLensScannerOpen] = useState(false);
  const [isQRPayOpen, setIsQRPayOpen] = useState(false);
  const [isAddressSheetOpen, setIsAddressSheetOpen] = useState(false);
  const [isCustomerServiceOpen, setIsCustomerServiceOpen] = useState(false);
  const [isARViewOpen, setIsARViewOpen] = useState(false);
  const [arProduct, setArProduct] = useState<Product | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openARView = (prod: Product) => {
    setArProduct(prod);
    setIsARViewOpen(true);
  };

  // Commerce Handlers
  const addToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item =>
        item.product.id === product.id &&
        item.selectedColor === color &&
        item.selectedSize === size
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, quantity, selectedColor: color, selectedSize: size }];
      }
    });

    addToast('success', `Added "${product.title.slice(0, 35)}..." to Cart`, 'Added to Cart');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    addToast('info', 'Item removed from your cart');
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast('info', 'Removed item from your Wishlist');
        return prev.filter(id => id !== productId);
      } else {
        addToast('success', 'Saved item to your Wishlist');
        return [...prev, productId];
      }
    });
  };

  const placeOrder = async (orderData: {
    address: Address;
    deliveryOption: 'prime_one_day' | 'standard' | 'priority_overnight';
    paymentMethod: string;
  }): Promise<{ success: boolean; orderId?: string; error?: string }> => {
    if (cart.length === 0) {
      return { success: false, error: 'Your shopping cart is empty' };
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const tax = subtotal * 0.0825;
    const shipping = orderData.deliveryOption === 'prime_one_day' ? 0 : orderData.deliveryOption === 'priority_overnight' ? 14.99 : 5.99;
    const total = parseFloat((subtotal + tax + shipping).toFixed(2));

    const orderId = `114-${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const trackingNumber = `TBA${Math.floor(100000000000 + Math.random() * 900000000000)}`;

    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: 'Processing',
      items: cart.map(item => ({
        productId: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
        selectedColor: item.selectedColor
      })),
      total,
      shippingAddress: orderData.address,
      deliveryOption: orderData.deliveryOption,
      trackingNumber,
      carrier: 'Amazon Logistics Prime Fleet',
      estimatedDelivery: orderData.deliveryOption === 'prime_one_day' ? 'Tomorrow by 8:00 PM' : 'In 3 business days',
      checkpoints: [
        { title: 'Order Placed & Verified', location: 'Seattle Fulfillment Center B2', time: 'Just now', completed: true },
        { title: 'Awaiting Carrier Dispatch', location: 'Amazon Sort Facility', time: 'Pending', completed: false }
      ],
      paymentMethod: orderData.paymentMethod,
      isOfflineSynced: isOffline
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setConfirmedOrder(newOrder);

    // Create audit log
    const audit = await createAuditEntry(`ORDER_PLACED: #${orderId} for $${total}`, 'SUCCESS');
    setAuditLogs(prev => [audit, ...prev]);

    // Handle offline queue
    if (isOffline) {
      addToSyncQueue('ADD_ORDER', newOrder);
      setPendingSyncCount(getSyncQueue().length);
      addToast('warning', `Order #${orderId} saved locally. Will sync when back online.`, 'Offline Order Queued');
    } else {
      addToast('success', `Order #${orderId} confirmed successfully!`, 'Order Placed');
    }

    return { success: true, orderId };
  };

  const requestReturn = (orderId: string, reason: string) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: 'Returned' as const } : order
      )
    );
    addToast('success', `Return requested for Order #${orderId}: "${reason}". Return QR code generated.`, 'Return Approved');
  };

  // Auth Handlers
  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!pass || pass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const loggedUser: UserProfile = {
      ...INITIAL_USER,
      email,
      name: email.split('@')[0].toUpperCase(),
      provider: 'email'
    };
    setUser(loggedUser);
    localStorage.setItem('amz_user_profile', JSON.stringify(loggedUser));

    const audit = await createAuditEntry(`USER_LOGIN: Authenticated via Email/Password [${email}]`, 'SUCCESS');
    setAuditLogs(prev => [audit, ...prev]);
    addToast('success', `Welcome back, ${loggedUser.name}!`, 'Sign In Successful');
    return { success: true };
  };

  const socialLogin = async (provider: 'google' | 'apple' | 'facebook' | 'github') => {
    const providerNames: Record<string, string> = {
      google: 'Google Account',
      apple: 'Apple ID',
      facebook: 'Facebook Connect',
      github: 'GitHub OAuth'
    };

    const loggedUser: UserProfile = {
      ...INITIAL_USER,
      name: `Alex R. (${provider.toUpperCase()})`,
      email: `alex.${provider}@example.com`,
      provider,
      avatar: provider === 'github'
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
        : INITIAL_USER.avatar
    };

    setUser(loggedUser);
    localStorage.setItem('amz_user_profile', JSON.stringify(loggedUser));

    const audit = await createAuditEntry(`OAUTH_LOGIN: One-click sign in via ${providerNames[provider]} verified`, 'SUCCESS');
    setAuditLogs(prev => [audit, ...prev]);
    addToast('success', `Signed in seamlessly with ${providerNames[provider]}`, 'Social Login Verified');
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('amz_user_profile');
    const audit = await createAuditEntry('USER_LOGOUT: Active session terminated', 'SUCCESS');
    setAuditLogs(prev => [audit, ...prev]);
    addToast('info', 'You have been signed out safely.', 'Signed Out');
  };

  // Backup & Restore
  const createBackupNow = async () => {
    try {
      const data = {
        orders,
        cart,
        wishlist,
        addresses: user?.savedAddresses || [],
        user
      };
      const snapshot = await generateBackupSnapshot(data, false);
      const updated = [snapshot, ...backups];
      setBackups(updated);
      localStorage.setItem('amz_backups', JSON.stringify(updated));

      const audit = await createAuditEntry(`BACKUP_CREATED: Snapshot #${snapshot.id} with SHA-256 integrity seal`, 'SUCCESS');
      setAuditLogs(prev => [audit, ...prev]);
      addToast('success', `Encrypted backup snapshot ${snapshot.id} generated and archived`, 'Backup Completed');
    } catch (err) {
      addToast('error', 'Failed to generate database backup snapshot', 'Backup Error');
    }
  };

  const restoreBackupById = async (id: string): Promise<boolean> => {
    const target = backups.find(b => b.id === id);
    if (!target) {
      addToast('error', 'Backup archive not found', 'Restore Failed');
      return false;
    }

    try {
      const decrypted = await decryptSensitiveData(target.encryptedData);
      if (!decrypted) {
        addToast('error', 'Decryption key mismatch or corrupted archive payload', 'Integrity Error');
        return false;
      }

      if (decrypted.orders) setOrders(decrypted.orders);
      if (decrypted.cart) setCart(decrypted.cart);
      if (decrypted.wishlist) setWishlist(decrypted.wishlist);
      if (decrypted.user) setUser(decrypted.user);

      const audit = await createAuditEntry(`BACKUP_RESTORED: Snapshot #${id} restored and state verified`, 'SUCCESS');
      setAuditLogs(prev => [audit, ...prev]);
      addToast('success', `System state restored to snapshot ${id}`, 'System Restored');
      return true;
    } catch (err) {
      addToast('error', 'Corrupt backup snapshot structure', 'Restore Error');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        cart,
        wishlist,
        orders,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        filters,
        setFilters,
        resetFilters,
        darkMode,
        toggleDarkMode,
        isOffline,
        toggleOfflineMode,
        pendingSyncCount,
        lastSyncTime,
        triggerManualSync,
        mobileFrameMode,
        setMobileFrameMode,
        activeTab,
        setActiveTab,
        activeProductModal,
        setActiveProductModal,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isShareModalOpen,
        setIsShareModalOpen,
        shareData,
        openShareModal,
        confirmedOrder,
        setConfirmedOrder,
        backups,
        createBackupNow,
        restoreBackupById,
        auditLogs,
        toasts,
        addToast,
        removeToast,
        // Mobile App Native Features
        notifications,
        unreadNotificationsCount,
        markNotificationRead,
        clearAllNotifications,
        isNotificationOpen,
        setIsNotificationOpen,
        isVoiceSearchOpen,
        setIsVoiceSearchOpen,
        isLensScannerOpen,
        setIsLensScannerOpen,
        isQRPayOpen,
        setIsQRPayOpen,
        isAddressSheetOpen,
        setIsAddressSheetOpen,
        isCustomerServiceOpen,
        setIsCustomerServiceOpen,
        isARViewOpen,
        setIsARViewOpen,
        arProduct,
        openARView,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        selectedAddress,
        setSelectedAddress,
        addNewAddress,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        restockProduct,
        updateOrderStatus,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        placeOrder,
        requestReturn,
        login,
        socialLogin,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

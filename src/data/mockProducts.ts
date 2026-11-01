import { Product } from '../types';

export const CATEGORIES = [
  { id: 'all', name: 'All Departments' },
  { id: 'electronics', name: 'Electronics & Gadgets' },
  { id: 'audio', name: 'Headphones & Audio' },
  { id: 'fashion', name: 'Clothing & Apparel' },
  { id: 'home', name: 'Home & Kitchen' },
  { id: 'books', name: 'Books & Kindles' },
  { id: 'beauty', name: 'Beauty & Personal Care' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    title: 'Echo Dot (5th Gen, 2024 Release) | Smart speaker with bigger vibrant sound and Alexa',
    brand: 'Amazon Devices',
    category: 'audio',
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.7,
    reviewCount: 38240,
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=600&auto=format&fit=crop&q=80'
    ],
    isPrime: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 142,
    description: 'Our best-sounding Echo Dot yet: Enjoy an improved audio experience compared to any previous Echo Dot with Alexa for clearer vocals, deeper bass, and vibrant sound in any room.',
    features: [
      'Voice control your entertainment with Alexa streaming Spotify, Apple Music, and Amazon Music',
      'Built-in motion & temperature sensors for smart home automation',
      'Privacy controls including a microphone off button and in-app privacy dashboard'
    ],
    specs: {
      'Dimensions': '3.9” x 3.9” x 3.5”',
      'Weight': '10.7 oz (304g)',
      'Connectivity': 'Dual-band Wi-Fi 802.11a/b/g/n/ac',
      'Warranty': '1-year limited warranty'
    },
    colors: ['Charcoal', 'Glacier White', 'Deep Sea Blue']
  },
  {
    id: 'prod-002',
    title: 'Sony WH-1000XM5 Wireless Noise-Canceling Overhead Headphones with Auto NC Optimizer',
    brand: 'Sony',
    category: 'audio',
    price: 348.00,
    originalPrice: 399.99,
    rating: 4.8,
    reviewCount: 15420,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80'
    ],
    isPrime: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 54,
    description: 'Industry-leading noise cancellation optimized to you. Two processors control 8 microphones for unprecedented noise cancellation and exceptional call quality.',
    features: [
      'Magnificent sound engineered with new Integrated Processor V1',
      'Crystal clear hands-free calling with 4 beamforming microphones',
      'Up to 30-hour battery life with quick charging (3 min charge for 3 hours of playback)'
    ],
    specs: {
      'Battery Life': '30 Hours (NC ON)',
      'Weight': '250g',
      'Bluetooth': 'v5.2 (LDAC, AAC, SBC)',
      'Charging Port': 'USB Type-C'
    },
    colors: ['Midnight Black', 'Silver Frost', 'Navy']
  },
  {
    id: 'prod-003',
    title: 'Kindle Paperwhite (16 GB) – Now with 6.8" display, adjustable warm light, and weeks of battery',
    brand: 'Amazon Devices',
    category: 'books',
    price: 149.99,
    originalPrice: 169.99,
    rating: 4.9,
    reviewCount: 42100,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80'
    ],
    isPrime: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 88,
    description: 'Kindle Paperwhite is thin, lightweight, and travels easily so you can enjoy your favorite books at any time. With our signature 300 ppi glare-free display—now 10% brighter at its max setting.',
    features: [
      '6.8” display with thinner borders and adjustable warm light to shift screen shade from white to amber',
      'IPX8 waterproof to protect against accidental immersion in water',
      'A single charge via USB-C lasts up to 10 weeks'
    ],
    specs: {
      'Display': '6.8” Paperwhite glare-free 300 ppi',
      'Storage': '16 GB',
      'Battery': 'Up to 10 weeks',
      'Waterproofing': 'IPX8 (2 meters for 60 min in fresh water)'
    },
    colors: ['Black', 'Agave Green', 'Denim']
  },
  {
    id: 'prod-004',
    title: 'Apple iPad Air (M2, 11-inch, Liquid Retina Display, 128GB, Wi-Fi 6E, 12MP Front/Back Camera)',
    brand: 'Apple',
    category: 'electronics',
    price: 569.00,
    originalPrice: 599.00,
    rating: 4.8,
    reviewCount: 9230,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop&q=80'
    ],
    isPrime: true,
    isBestSeller: false,
    inStock: true,
    stockCount: 29,
    description: 'The redesigned iPad Air with turbocharged Apple M2 chip. It has an 11-inch Liquid Retina display, landscape 12MP front camera with Center Stage, and superfast Wi-Fi 6E.',
    features: [
      'Incredible performance with M2 8-core CPU and 9-core GPU',
      'Liquid Retina display featuring True Tone, P3 wide color, and ultralow reflectivity',
      'Supports Apple Pencil Pro and Magic Keyboard'
    ],
    specs: {
      'Chip': 'Apple M2 with 16-core Neural Engine',
      'Storage': '128GB',
      'Display': '11” LED-backlit Multi-Touch 2360x1640',
      'OS': 'iPadOS 18'
    },
    colors: ['Space Gray', 'Starlight', 'Purple', 'Blue']
  },
  {
    id: 'prod-005',
    title: 'Instant Pot Pro Plus 10-in-1 Smart Multi-Cooker, Pressure Cooker, Slow Cooker, Rice Cooker & Sous Vide',
    brand: 'Instant Pot',
    category: 'home',
    price: 169.95,
    originalPrice: 199.99,
    rating: 4.7,
    reviewCount: 21800,
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80'
    ],
    isPrime: true,
    isBestSeller: false,
    inStock: true,
    stockCount: 63,
    description: 'The Instant Pot Pro Plus is connected to Wi-Fi so you can easily control cooking, venting, and access over 1,900 recipes via the Instant Brands Connect app.',
    features: [
      '10-in-1 functionality: pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt, sous vide',
      'WhisperQuiet steam release technology reduces noise and prevents kitchen splatters',
      'Easy-to-read touchscreen display with progress indicator status bar'
    ],
    specs: {
      'Capacity': '6 Quarts (Serves up to 6)',
      'Material': 'Stainless Steel inner cooking pot',
      'Power': '1200 Watts',
      'Safety': '11+ proven safety features'
    },
    colors: ['Brushed Stainless Steel', 'Matte Black']
  },
  {
    id: 'prod-006',
    title: 'Breville Barista Touch Espresso Machine with Automated Touchscreen & ThermoJet Heating System',
    brand: 'Breville',
    category: 'home',
    price: 999.95,
    originalPrice: 1099.95,
    rating: 4.6,
    reviewCount: 7890,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80'
    ],
    isPrime: true,
    isBestSeller: false,
    inStock: true,
    stockCount: 15,
    description: 'Automated touchscreen simplifies how to make your favorite cafe coffee in 3 easy steps: Grind, Brew, and Milk. Easily adjust coffee strength, milk texture, and temperature.',
    features: [
      'ThermoJet heating achieves optimum extraction temperature in 3 seconds',
      'Integrated conical burr grinder with dose control',
      'Auto microfoam milk texturing with hands-free wand'
    ],
    specs: {
      'Water Tank': '67 fl oz (2 Liters)',
      'Hopper Capacity': '1/2 lb Bean Hopper',
      'Heating': 'ThermoJet system',
      'Dimensions': '12.5" x 12.7" x 16"'
    },
    colors: ['Brushed Stainless Steel', 'Black Truffle']
  },
  {
    id: 'prod-007',
    title: 'Levi\'s Men\'s Premium Trucker Denim Jacket, Regular Fit, Durable Heavyweight Cotton',
    brand: 'Levi\'s',
    category: 'fashion',
    price: 79.99,
    originalPrice: 98.00,
    rating: 4.6,
    reviewCount: 11450,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80'
    ],
    isPrime: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 120,
    description: 'A blank canvas for self-expression. The original jean jacket since 1967. Designed with purposeful craftsmanship, classic point collar, and copper shank buttons.',
    features: [
      '100% Non-Stretch Cotton Denim for genuine vintage feel and longevity',
      'Flap chest pockets with button closures and welt side pockets',
      'Adjustable side tabs at waist for custom tailored fit'
    ],
    specs: {
      'Material': '100% Cotton',
      'Closure': 'Button fly and chest flap closure',
      'Care': 'Machine wash cold inside out with like colors'
    },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Colusa Indigo', 'Dark Stonewash', 'Faded Black']
  },
  {
    id: 'prod-008',
    title: 'CeraVe Hydrating Facial Cleanser with Ceramides and Hyaluronic Acid, Fragrance-Free, 16 Fl Oz',
    brand: 'CeraVe',
    category: 'beauty',
    price: 15.48,
    originalPrice: 18.99,
    rating: 4.8,
    reviewCount: 89400,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80'
    ],
    isPrime: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 340,
    description: 'Developed with dermatologists, CeraVe Hydrating Facial Cleanser is a gentle face wash with ingredients like ceramides and hyaluronic acid that work to restore the skin\'s natural barrier.',
    features: [
      'Formulated with three essential ceramides (1, 3, 6-II) that cleanse and hydrate without disrupting protective skin barrier',
      'MVE technology continually releases moisturizing ingredients for 24-hour hydration',
      'Accepted by the National Eczema Association, non-comedogenic and fragrance free'
    ],
    specs: {
      'Volume': '16 Fl Oz (473 ml)',
      'Skin Type': 'Normal to Dry skin',
      'Formula': 'Lotion-like non-foaming hydrating cleanser'
    }
  },
  {
    id: 'prod-009',
    title: 'Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones by James Clear',
    brand: 'Penguin Publishing Group',
    category: 'books',
    price: 13.79,
    originalPrice: 27.00,
    rating: 4.9,
    reviewCount: 145000,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80'
    ],
    isPrime: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 510,
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving—every day. James Clear, one of the world\'s leading experts on habit formation, reveals practical strategies.',
    features: [
      '#1 New York Times Bestseller with over 15 million copies sold globally',
      'Actionable guides on making time for new habits and overcoming lack of willpower',
      'Hardcover collector edition with premium paper and ribbon bookmark'
    ],
    specs: {
      'Format': 'Hardcover / Kindle / Audiobook',
      'Pages': '320 pages',
      'Language': 'English',
      'ISBN-10': '0735211299'
    }
  },
  {
    id: 'prod-010',
    title: 'Sony Alpha 7 IV Full-Frame Mirrorless Interchangeable Lens Camera Body with 33MP Sensor',
    brand: 'Sony',
    category: 'electronics',
    price: 2298.00,
    originalPrice: 2499.99,
    rating: 4.8,
    reviewCount: 3120,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80'
    ],
    isPrime: true,
    isBestSeller: false,
    inStock: true,
    stockCount: 12,
    description: 'The α7 IV is an ideal hybrid camera, offering breathtaking 33MP still imagery and 4K 60p movie recording alongside next-generation real-time autofocus tracking.',
    features: [
      '33MP full-frame Exmor R back-illuminated CMOS sensor',
      'BIONZ XR image processing engine with up to 8x processing power',
      'Advanced Real-time Eye AF for humans, animals, and birds'
    ],
    specs: {
      'Sensor': '33 MP Full-frame Exmor R CMOS',
      'Video': '4K 60p 10-bit 4:2:2 All-Intra',
      'Stabilization': '5-axis in-body optical image stabilization',
      'Lens Mount': 'Sony E-mount'
    },
    colors: ['Matte Black']
  },
  {
    id: 'prod-011',
    title: 'Anker Magnetic Wireless Power Bank 10,000mAh with Foldable Stand and Fast USB-C PD',
    brand: 'Anker',
    category: 'electronics',
    price: 45.99,
    originalPrice: 59.99,
    rating: 4.7,
    reviewCount: 16700,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&auto=format&fit=crop&q=80'
    ],
    isPrime: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 195,
    description: 'Snap & Go wireless portable charger featuring strong magnetic lock, ultra-compact profile, and convenient built-in kickstand for hands-free FaceTime while charging.',
    features: [
      'Ultra-strong magnetic snap alignment for iPhone 12/13/14/15/16 series',
      'MultiProtect safety system with foreign object detection and temperature monitor',
      '20W high-speed USB-C two-way Power Delivery port'
    ],
    specs: {
      'Battery Capacity': '10,000 mAh',
      'Output': '7.5W Wireless / 20W Wired USB-C PD',
      'Weight': '7.7 oz',
      'Dimensions': '4.1 x 2.6 x 0.7 inches'
    },
    colors: ['Interstellar Gray', 'Lilac Purple', 'Cloud White']
  },
  {
    id: 'prod-012',
    title: 'Dyson V15 Detect Cordless Vacuum Cleaner with Laser Dust Illumination & Piezo Sensor',
    brand: 'Dyson',
    category: 'home',
    price: 649.99,
    originalPrice: 749.99,
    rating: 4.7,
    reviewCount: 8450,
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80'
    ],
    isPrime: true,
    isBestSeller: false,
    inStock: true,
    stockCount: 22,
    description: 'Dyson\'s most powerful, intelligent cordless vacuum. A precisely-angled laser reveals invisible dust on hard floors, and an acoustic piezo sensor counts dust particles.',
    features: [
      'Laser Slim Fluffy cleaner head illuminates microscopic dust particles',
      'Piezo sensor continuously sizes and counts particles, automatically ramping suction power',
      'Up to 60 minutes of run time with click-in replaceable battery pack'
    ],
    specs: {
      'Suction Power': '230 AW (Air Watts)',
      'Run Time': 'Up to 60 Minutes',
      'Bin Volume': '0.2 Gallons (0.75 L)',
      'Filtration': 'Whole-machine HEPA filtration'
    },
    colors: ['Yellow / Iron', 'Nickel / Blue']
  }
];

export const MOCK_ORDERS = [
  {
    id: '114-8392104-5829101',
    date: 'October 28, 2026',
    status: 'Delivered' as const,
    items: [
      {
        productId: 'prod-001',
        title: 'Echo Dot (5th Gen, 2024 Release) | Smart speaker with Alexa',
        price: 49.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&auto=format&fit=crop&q=80',
        selectedColor: 'Deep Sea Blue'
      }
    ],
    total: 53.99,
    shippingAddress: {
      fullName: 'Alex Rivera',
      street: '742 Evergreen Terrace',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      phone: '+1 (206) 555-0199'
    },
    deliveryOption: 'prime_one_day' as const,
    trackingNumber: 'TBA938472918234',
    carrier: 'Amazon Logistics',
    estimatedDelivery: 'Delivered yesterday, Oct 29 at 3:14 PM',
    checkpoints: [
      { title: 'Delivered', location: 'Resident front door, Seattle, WA', time: 'Oct 29, 3:14 PM', completed: true },
      { title: 'Out for delivery', location: 'Seattle Local Delivery Facility', time: 'Oct 29, 8:42 AM', completed: true },
      { title: 'Package arrived at carrier facility', location: 'Kent, WA', time: 'Oct 28, 11:20 PM', completed: true },
      { title: 'Order placed & verified', location: 'Amazon Fulfillment Center', time: 'Oct 28, 4:10 PM', completed: true }
    ],
    paymentMethod: 'Amazon Prime Rewards Visa Card ending in 4242'
  },
  {
    id: '114-1029481-9948212',
    date: 'October 31, 2026',
    status: 'Out for Delivery' as const,
    items: [
      {
        productId: 'prod-002',
        title: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
        price: 348.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
        selectedColor: 'Midnight Black'
      }
    ],
    total: 375.84,
    shippingAddress: {
      fullName: 'Alex Rivera',
      street: '742 Evergreen Terrace',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      phone: '+1 (206) 555-0199'
    },
    deliveryOption: 'prime_one_day' as const,
    trackingNumber: 'TBA849201948203',
    carrier: 'Amazon Prime Van Fleet #412',
    estimatedDelivery: 'Arriving Today by 8:00 PM',
    checkpoints: [
      { title: 'Out for delivery (8 stops away)', location: 'Driver is nearby in your neighborhood', time: 'Today, 1:15 PM', completed: true },
      { title: 'Arrived at delivery hub', location: 'Seattle Sortation Hub B3', time: 'Today, 6:02 AM', completed: true },
      { title: 'Departed fulfillment center', location: 'Sumner, WA Fulfillment Center', time: 'Oct 31, 10:45 PM', completed: true },
      { title: 'Shipping label created', location: 'Amazon Fulfillment Center', time: 'Oct 31, 3:30 PM', completed: true }
    ],
    paymentMethod: 'Amazon Pay Wallet Balance'
  }
];

export const MOCK_REVIEWS = [
  {
    id: 'rev-01',
    author: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    date: 'October 14, 2026',
    title: 'Absolute game changer for remote work and travel',
    comment: 'The noise cancellation effortlessly blocks out background chatter and air conditioning humming. The audio depth is pristine with punchy bass and clear trebles. Battery lasts all week.',
    verifiedPurchase: true,
    helpfulCount: 142
  },
  {
    id: 'rev-02',
    author: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    date: 'October 21, 2026',
    title: 'Arrived next morning with Prime. Flawless build.',
    comment: 'Amazon Prime 1-day delivery delivered straight to my door early in the morning. Packaging was pristine. The setup took less than 2 minutes via Bluetooth.',
    verifiedPurchase: true,
    helpfulCount: 88
  },
  {
    id: 'rev-03',
    author: 'David K.',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    rating: 4,
    date: 'October 24, 2026',
    title: 'Great quality, slightly larger case than previous version',
    comment: 'Sound quality is an unquestionable 10/10. The only minor critique is the carrying case does not fold as compactly as the XM4, but the comfort and mic quality easily make up for it.',
    verifiedPurchase: true,
    helpfulCount: 34
  }
];

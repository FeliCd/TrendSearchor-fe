export const PLAN_IDS = {
  FREE: 'FREE',
  PRO: 'PRO',
  UNLIMITED: 'UNLIMITED',
};

export const SUBSCRIPTION_PLANS = {
  [PLAN_IDS.FREE]: {
    id: PLAN_IDS.FREE,
    name: 'Free',
    tagline: 'Basic access for casual paper browsing and initial exploration',
    price: 0,
    priceFormatted: '0 VND',
    billingPeriod: 'Forever Free',
    dailyQuota: 3,
    isUnlimited: false,
    badgeText: null,
    isPopular: false,
    features: [
      '3 AI search queries & suggestions per 24 hours',
      'Basic paper search & metadata view',
      'Bookmark favorite papers',
      'Standard notification alerts',
    ],
  },
  [PLAN_IDS.PRO]: {
    id: PLAN_IDS.PRO,
    name: 'Pro',
    tagline: 'Enhanced quota for active researchers and academics',
    price: 199000,
    priceFormatted: '199,000 VND',
    billingPeriod: 'per 30 days',
    dailyQuota: 20,
    isUnlimited: false,
    badgeText: 'Popular Choice',
    isPopular: true,
    features: [
      '20 AI search queries & suggestions per 24 hours',
      'Full paper search & advanced trend analytics',
      'Unlimited bookmarks & collection lists',
      'Priority AI response generation speed',
      'Export search results to BibTeX / PDF',
      'Email support assistance',
    ],
  },
};

export const PAYMENT_METHODS = [
  {
    id: 'mock',
    name: 'Instant Mock Payment',
    description: 'Instant sandbox payment activation for testing',
    iconName: 'Zap',
  },
  {
    id: 'qr',
    name: 'Bank Transfer QR (VietQR)',
    description: 'Scan VietQR code with any mobile banking app',
    iconName: 'QrCode',
  },
  {
    id: 'momo',
    name: 'MoMo E-Wallet',
    description: 'Pay quickly via MoMo mobile app',
    iconName: 'Wallet',
  },
];

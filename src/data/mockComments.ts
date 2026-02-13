import { Comment } from '../types';

export const mockComments: Comment[] = [
  {
    id: '1',
    author: 'PremiumBuyer',
    product: 'SmartTech™ Pro Max',
    rating: 5,
    content: 'The SmartTech™ Pro Max is a revolutionary product that delivers outstanding performance. This cutting-edge device has exceeded my expectations in every way. Highly recommended for anyone seeking exceptional quality!',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    verifiedPurchase: false,
    aiScore: 95,
    flagged: true,
    indicators: ['Trademark Injection', 'Unverified + Extreme Emotion', 'Corporate/AI Language', 'Likely Paid Review']
  },
  {
    id: '2',
    author: 'Sarah Miller',
    product: 'Wireless Headphones',
    rating: 4,
    content: 'Good headphones overall. Battery lasted about 6 hours on my first use. Sound quality is clear but could be more bass-heavy. Comfortable for 2-3 hours of continuous use.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    verifiedPurchase: true,
    aiScore: 8,
    flagged: false,
    indicators: ['Verified Purchase']
  },
  {
    id: '3',
    author: 'TechUser123',
    product: 'Laptop Stand Pro',
    rating: 5,
    content: 'Absolutely perfect in every way! This is the best product I have ever purchased. Amazing quality and outstanding performance. You won\'t regret buying this!',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    verifiedPurchase: false,
    aiScore: 75,
    flagged: true,
    indicators: ['Unverified + Extreme Emotion', 'Extreme Opinion No Evidence', 'AI-Generated Content']
  },
  {
    id: '4',
    author: 'Michael Chen',
    product: 'Bluetooth Speaker',
    rating: 3,
    content: 'It\'s okay. Sound is decent for the size but gets distorted at high volumes. Portable and looks nice. Price is fair for what you get.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    verifiedPurchase: true,
    aiScore: 12,
    flagged: false,
    indicators: ['Verified Purchase', 'Balanced Review']
  },
  {
    id: '5',
    author: 'AnonymousUser42',
    product: 'Phone Case Premium',
    rating: 1,
    content: 'Worst thing I\'ve ever used, total scam! Complete garbage and waste of money. Don\'t buy this terrible product!!!',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    verifiedPurchase: false,
    aiScore: 82,
    flagged: true,
    indicators: ['Unverified + Extreme Emotion', 'Generic Author Name', 'Extreme Opinion No Evidence']
  },
  {
    id: '6',
    author: 'Robert Johnson',
    product: 'Wireless Mouse',
    rating: 4,
    content: 'Comfortable to use all day. Good battery life. Sometimes the connection drops but not often. Would buy again.',
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    verifiedPurchase: true,
    aiScore: 5,
    flagged: false,
    indicators: ['Verified Purchase', 'Specific Details']
  },
  {
    id: '7',
    author: 'BestShopperEver',
    product: 'UltraWatch™ Elite',
    rating: 5,
    content: 'The UltraWatch™ Elite provides a seamless experience that has truly transformed my daily routine. This innovative solution delivers remarkable results and outstanding quality.',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    verifiedPurchase: false,
    aiScore: 88,
    flagged: true,
    indicators: ['Trademark Injection', 'Corporate/AI Language', 'Unverified Purchase', 'Likely Paid Review']
  },
  {
    id: '8',
    author: 'Lisa Wang',
    product: 'Desk Lamp LED',
    rating: 4,
    content: 'Nice lamp. Bright enough for my desk. The touch controls are responsive. Wish the base was heavier but it works fine.',
    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    verifiedPurchase: true,
    aiScore: 10,
    flagged: false,
    indicators: ['Verified Purchase', 'Honest Feedback']
  },
  {
    id: '9',
    author: 'QualitySeeker88',
    product: 'Mechanical Keyboard Pro',
    rating: 5,
    content: 'This product is absolutely life-changing!!! The best investment I\'ve made this year. Perfect in every single way. Amazing, incredible, outstanding!',
    timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
    verifiedPurchase: false,
    aiScore: 78,
    flagged: true,
    indicators: ['Unverified + Extreme Emotion', 'Extreme Opinion No Evidence', 'Generic Author Name']
  },
  {
    id: '10',
    author: 'David Brown',
    product: 'Monitor 4K',
    rating: 3,
    content: 'Good display quality. Colors are accurate. Stand is a bit wobbly. Price is competitive for 4K. Had one dead pixel but customer service replaced it.',
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    verifiedPurchase: true,
    aiScore: 15,
    flagged: false,
    indicators: ['Verified Purchase', 'Mixed Experience']
  },
  {
    id: '11',
    author: 'CustomerReview',
    product: 'CoffeeMaker Deluxe™',
    rating: 5,
    content: 'The CoffeeMaker Deluxe™ is designed to provide an exceptional brewing experience. This innovative product delivers outstanding quality and remarkable performance.',
    timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    verifiedPurchase: false,
    aiScore: 92,
    flagged: true,
    indicators: ['Trademark Injection', 'Corporate/AI Language', 'Likely Paid Review', 'Unnatural Product Name']
  },
  {
    id: '12',
    author: 'Emily Rodriguez',
    product: 'Yoga Mat Premium',
    rating: 4,
    content: 'Good mat for the price. Non-slip surface works well. A bit thin for my knees but overall satisfied with the purchase.',
    timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    verifiedPurchase: true,
    aiScore: 8,
    flagged: false,
    indicators: ['Verified Purchase', 'Balanced Opinion']
  }
];
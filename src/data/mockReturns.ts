import { Comment } from '../types';

export function generateMockComments(): Comment[] {
  const comments: Comment[] = [
    {
      id: '1',
      author: 'PremiumBuyer',
      product: 'SmartTech™ Pro Max',
      rating: 5,
      content: 'The SmartTech™ Pro Max is absolutely revolutionary! This product has completely transformed my life. Best purchase ever made! Everyone should buy this immediately!',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      verifiedPurchase: false,
      aiScore: 95,
      flagged: true,
      indicators: ['Likely Paid Review', 'Trademark Injection', 'Extreme Opinion', 'Unverified + Extreme']
    },
    {
      id: '2',
      author: 'Sarah Miller',
      product: 'Wireless Headphones',
      rating: 4,
      content: 'Good headphones overall. Battery lasted about 6 hours on my commute. Sound quality is clear but could use more bass. Comfortable for long wear.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      verifiedPurchase: true,
      aiScore: 15,
      flagged: false,
      indicators: ['Verified Purchase']
    },
    {
      id: '3',
      author: 'TechEnthusiast2024',
      product: 'UltraBook X1',
      rating: 5,
      content: 'Outstanding performance! The UltraBook X1 delivers exceptional speed and reliability. Highly recommended for professionals. Seamless experience!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      verifiedPurchase: false,
      aiScore: 78,
      flagged: true,
      indicators: ['Corporate Language', 'Unverified Purchase', 'High Enthusiasm']
    },
    {
      id: '4',
      author: 'Michael Chen',
      product: 'Coffee Maker Deluxe',
      rating: 3,
      content: 'Works fine but the carafe leaks sometimes. Coffee tastes good though. Easy to clean. Would be 4 stars if not for the leaking issue.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      verifiedPurchase: true,
      aiScore: 8,
      flagged: false,
      indicators: ['Verified Purchase', 'Balanced Review']
    },
    {
      id: '5',
      author: 'HappyCustomer123',
      product: 'Fitness Tracker Pro',
      rating: 5,
      content: 'Life changing device! The Fitness Tracker Pro has helped me achieve my health goals. Amazing accuracy and beautiful design. Must buy!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      verifiedPurchase: false,
      aiScore: 82,
      flagged: true,
      indicators: ['Extreme Opinion', 'Unverified Purchase', 'Generic Praise']
    },
    {
      id: '6',
      author: 'Jennifer Davis',
      product: 'Yoga Mat Premium',
      rating: 4,
      content: 'Nice mat, good grip during hot yoga. Thickness is perfect for my knees. Rolls up easily and fits in my bag. Slight chemical smell initially.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      verifiedPurchase: true,
      aiScore: 12,
      flagged: false,
      indicators: ['Verified Purchase', 'Specific Details']
    },
    {
      id: '7',
      author: 'BestBuyerEver',
      product: 'SmartHome Hub™',
      rating: 5,
      content: 'The SmartHome Hub™ is incredible! Transformed my entire home automation setup. Works perfectly with all devices. Worth every penny!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      verifiedPurchase: false,
      aiScore: 88,
      flagged: true,
      indicators: ['Trademark Injection', 'Likely Paid Review', 'Unverified Purchase']
    },
    {
      id: '8',
      author: 'Robert Wilson',
      product: 'Running Shoes Elite',
      rating: 4,
      content: 'Comfortable for my daily 5k runs. Good cushioning but wore out faster than expected. Size runs half a size large. Good value overall.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
      verifiedPurchase: true,
      aiScore: 18,
      flagged: false,
      indicators: ['Verified Purchase', 'Balanced Feedback']
    },
    {
      id: '9',
      author: 'TechGuru99',
      product: 'Tablet Pro Max',
      rating: 5,
      content: 'Absolutely phenomenal! The Tablet Pro Max exceeds all expectations. Blazing fast performance and stunning display. Game changer!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      verifiedPurchase: false,
      aiScore: 75,
      flagged: true,
      indicators: ['Corporate Language', 'Extreme Opinion', 'Unverified Purchase']
    },
    {
      id: '10',
      author: 'Lisa Anderson',
      product: 'Kitchen Blender Pro',
      rating: 3,
      content: 'Powerful motor but very loud. Makes great smoothies. Cleaning is a bit difficult. Would prefer quieter operation for the price.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      verifiedPurchase: true,
      aiScore: 10,
      flagged: false,
      indicators: ['Verified Purchase', 'Constructive Criticism']
    }
  ];

  return comments;
}
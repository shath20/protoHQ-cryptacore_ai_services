import { Comment } from '../types';

export function analyzeComment(comment: Comment): number {
  let score = 0;
  const content = comment.content.toLowerCase();
  const originalContent = comment.content;
  
  // 1️⃣ UNVERIFIED PURCHASE BIAS (HIGH WEIGHT: 0-35 points)
  if (!comment.verifiedPurchase) {
    // Check for extreme emotional language
    const extremePositive = [
      'life-changing', 'revolutionary', 'perfect', 'amazing', 'incredible', 
      'outstanding', 'best ever', 'game-changer', 'transformed', 'absolutely perfect'
    ];
    const extremeNegative = [
      'worst', 'terrible', 'scam', 'garbage', 'useless', 'disaster', 
      'complete waste', 'total scam', 'never buy', 'awful'
    ];
    
    const hasExtremePositive = extremePositive.some(phrase => content.includes(phrase));
    const hasExtremeNegative = extremeNegative.some(phrase => content.includes(phrase));
    
    if (hasExtremePositive || hasExtremeNegative) {
      score += 35; // Major red flag for unverified + extreme emotion
    } else {
      score += 10; // Minor risk for unverified but neutral
    }
  }
  
  // 2️⃣ OFFICIAL PRODUCT NAME INJECTION (VERY HIGH WEIGHT: 0-40 points)
  // Check for exact product name usage
  const productWords = comment.product.toLowerCase().split(' ');
  const usesExactProductName = productWords.every(word => content.includes(word));
  const hasTrademark = originalContent.includes('™') || originalContent.includes('®');
  const hasFormalTone = content.includes('is a revolutionary product') || 
                       content.includes('delivers outstanding performance') ||
                       content.includes('is designed to provide');
  
  if (usesExactProductName && (hasTrademark || hasFormalTone)) {
    score += 40; // Almost always paid/scripted
  } else if (usesExactProductName && !content.includes('this') && !content.includes('it')) {
    score += 25; // Unnatural product name usage
  }
  
  // 3️⃣ EXTREME SENTIMENT WITHOUT EVIDENCE (HIGH WEIGHT: 0-25 points)
  const hasTimeReference = /\b(hour|hours|day|days|week|weeks|month|months|year|years)\b/.test(content);
  const hasUsageContext = /\b(use|used|using|work|works|working|bought|purchase|received|got)\b/.test(content);
  const hasSpecificProblem = /\b(but|however|issue|problem|concern|drawback|disappointed)\b/.test(content);
  const hasSpecificBenefit = /\b(battery|screen|sound|quality|price|feature|design|size|weight)\b/.test(content);
  
  // Check for extreme sentiment
  const sentimentScore = calculateSentiment(content);
  const isExtremeSentiment = sentimentScore > 0.8 || sentimentScore < -0.8;
  
  if (isExtremeSentiment && !hasTimeReference && !hasUsageContext) {
    score += 25; // Extreme opinion without evidence
  } else if (isExtremeSentiment && (!hasSpecificProblem && !hasSpecificBenefit)) {
    score += 15; // Extreme opinion but no specifics
  }
  
  // 4️⃣ AI-GENERATED WRITING PATTERNS (MEDIUM-HIGH WEIGHT: 0-20 points)
  let aiPatternScore = 0;
  
  // Over-polished grammar indicators
  const polishedPatterns = [
    'seamless experience', 'exceeded my expectations', 'highly recommended',
    'outstanding quality', 'exceptional performance', 'remarkable results',
    'impeccable service', 'flawless execution', 'superior craftsmanship'
  ];
  aiPatternScore += polishedPatterns.filter(phrase => content.includes(phrase)).length * 3;
  
  // Corporate tone indicators
  const corporatePhrases = [
    'leverage', 'synergy', 'optimize', 'enhance', 'streamline',
    'robust', 'scalable', 'innovative solution', 'cutting-edge'
  ];
  aiPatternScore += corporatePhrases.filter(phrase => content.includes(phrase)).length * 2;
  
  // Generic praise without personal details
  if (comment.rating === 5 && !hasSpecificBenefit && !hasUsageContext) {
    aiPatternScore += 5;
  }
  
  // No flaws mentioned in perfect rating
  if (comment.rating === 5 && !hasSpecificProblem && content.length > 50) {
    aiPatternScore += 4;
  }
  
  // Over-structured sentences
  const sentences = originalContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length > 0) {
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
    if (avgSentenceLength > 20 && avgSentenceLength < 35) {
      aiPatternScore += 3; // Too perfectly structured
    }
  }
  
  score += Math.min(aiPatternScore, 20);
  
  // 5️⃣ ADDITIONAL PATTERN DETECTION (0-10 points)
  
  // Author name patterns
  if (/\d/.test(comment.author)) score += 3;
  if (comment.author.includes('User') || comment.author.includes('Anonymous')) score += 4;
  if (comment.author.includes('Customer') || comment.author.includes('Buyer')) score += 3;
  
  // Excessive punctuation
  const exclamationCount = (originalContent.match(/!/g) || []).length;
  if (exclamationCount > 2) score += 2;
  
  // Review length anomalies
  if (originalContent.length > 400) score += 2; // Unusually long
  if (originalContent.length < 30) score += 1; // Too short
  
  // Multiple exclamation marks together
  if (originalContent.includes('!!!') || originalContent.includes('???')) {
    score += 3;
  }
  
  return Math.min(100, Math.max(0, score));
}

function calculateSentiment(text: string): number {
  const positiveWords = [
    'good', 'great', 'excellent', 'amazing', 'perfect', 'love', 'best', 
    'awesome', 'fantastic', 'wonderful', 'outstanding', 'brilliant'
  ];
  const negativeWords = [
    'bad', 'terrible', 'awful', 'worst', 'hate', 'horrible', 'disaster',
    'useless', 'garbage', 'scam', 'disappointed', 'waste'
  ];
  
  const words = text.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
  });
  
  const totalSentimentWords = positiveCount + negativeCount;
  if (totalSentimentWords === 0) return 0;
  
  return (positiveCount - negativeCount) / totalSentimentWords;
}

export function generateIndicators(comment: Comment, score: number): string[] {
  const indicators = [];
  const content = comment.content.toLowerCase();
  const originalContent = comment.content;
  
  // Unverified purchase indicators
  if (!comment.verifiedPurchase) {
    const extremePositive = ['life-changing', 'revolutionary', 'perfect', 'amazing'];
    const extremeNegative = ['worst', 'terrible', 'scam', 'garbage'];
    
    if (extremePositive.some(p => content.includes(p)) || extremeNegative.some(n => content.includes(n))) {
      indicators.push('Unverified + Extreme Emotion');
    } else {
      indicators.push('Unverified Purchase');
    }
  }
  
  // Product name injection
  const productWords = comment.product.toLowerCase().split(' ');
  const usesExactProductName = productWords.every(word => content.includes(word));
  const hasTrademark = originalContent.includes('™') || originalContent.includes('®');
  
  if (usesExactProductName && hasTrademark) {
    indicators.push('Trademark Injection');
  } else if (usesExactProductName && !content.includes('this') && !content.includes('it')) {
    indicators.push('Unnatural Product Name');
  }
  
  // Extreme sentiment without evidence
  const hasTimeReference = /\b(hour|day|week|month|year)\b/.test(content);
  const hasUsageContext = /\b(use|used|bought|received)\b/.test(content);
  const sentimentScore = calculateSentiment(content);
  const isExtremeSentiment = sentimentScore > 0.8 || sentimentScore < -0.8;
  
  if (isExtremeSentiment && !hasTimeReference && !hasUsageContext) {
    indicators.push('Extreme Opinion No Evidence');
  }
  
  // AI patterns
  const aiPhrases = [
    'seamless experience', 'exceeded my expectations', 'highly recommended',
    'outstanding quality', 'exceptional performance'
  ];
  
  if (aiPhrases.some(phrase => content.includes(phrase))) {
    indicators.push('Corporate/AI Language');
  }
  
  // Author patterns
  if (/\d/.test(comment.author)) {
    indicators.push('Generic Author Name');
  }
  
  // Rating mismatch
  if (comment.rating === 5 && content.includes('but')) {
    indicators.push('Rating Mismatch');
  }
  
  if (score > 85) {
    indicators.push('Likely Paid Review');
  } else if (score > 70) {
    indicators.push('AI-Generated Content');
  } else if (score > 50) {
    indicators.push('Suspicious Pattern');
  }
  
  return indicators;
}
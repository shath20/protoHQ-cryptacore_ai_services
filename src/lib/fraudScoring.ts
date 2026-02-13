import { ReturnRequest } from '../types';

export function calculateFraudScore(returnItem: ReturnRequest): number {
  let score = 0;
  
  // Return history impact
  if (returnItem.returnHistory > 5) score += 30;
  else if (returnItem.returnHistory > 3) score += 20;
  else if (returnItem.returnHistory > 1) score += 10;
  
  // Account age impact
  if (returnItem.accountAge < 7) score += 25;
  else if (returnItem.accountAge < 30) score += 15;
  else if (returnItem.accountAge < 90) score += 5;
  
  // Amount impact
  if (returnItem.amount > 1000) score += 20;
  else if (returnItem.amount > 500) score += 10;
  else if (returnItem.amount > 200) score += 5;
  
  // Category risk
  if (returnItem.itemCategory === 'electronics') score += 10;
  else if (returnItem.itemCategory === 'jewelry') score += 15;
  
  // Packaging condition
  if (returnItem.packagingCondition === 'mismatched') score += 15;
  else if (returnItem.packagingCondition === 'damaged') score += 10;
  
  // Return reason patterns
  if (returnItem.returnReason === 'damaged') score += 5;
  if (returnItem.returnReason === 'wrong item') score += 8;
  
  // Time-based patterns (simplified)
  const hour = new Date(returnItem.timestamp).getHours();
  if (hour < 6 || hour > 22) score += 5;
  
  return Math.min(100, Math.max(0, score));
}
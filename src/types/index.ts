
export interface ReturnRequest {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  amount: number;
  timestamp: string;
  returnReason: string;
  riskTags: string[];
  fraudScore: number;
  returnHistory: number;
  accountAge: number;
  itemCategory: string;
  packagingCondition: string;
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  action: 'approve' | 'deny' | 'flag';
  returnId: string;
  customerName: string;
  amount: number;
  fraudScore: number;
  user: string;
}

export interface Comment {
  id: string;
  author: string;
  product: string;
  rating: number;
  content: string;
  timestamp: string;
  verifiedPurchase: boolean;
  aiScore: number;
  flagged: boolean;
  manuallyFlagged?: boolean;
  manuallyApproved?: boolean;
  indicators: string[];
}

export interface RiskSettings {
  highRiskThreshold: number;
  mediumRiskThreshold: number;
  autoFlagThreshold: number;
  enableAiDetection: boolean;
  enableSentimentAnalysis: boolean;
}
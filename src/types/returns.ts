export interface ReturnRequest {
  id: string;
  customerId: string;
  customerEmail: string;
  customerAccountAge: number; // days
  customerTotalOrders: number;
  customerTotalReturns: number;
  customerLifetimeValue: number; // total profit from customer
  customerReturnLoss: number; // total loss from returns
  orderId: string;
  orderDate: string;
  returnDate: string;
  daysSincePurchase: number;
  productId: string;
  productName: string;
  productCategory: string;
  productCost: number; // retailer cost
  productPrice: number; // selling price
  returnReason: string;
  returnReasonType: 'defective' | 'wrong_item' | 'not_as_described' | 'changed_mind' | 'other';
  previousReturnReasons: string[]; // history of reasons
  returnMethod: 'refund' | 'exchange' | 'store_credit';
  customerNotes: string;
}

export interface CustomerProfile {
  id: string;
  email: string;
  accountAge: number;
  totalOrders: number;
  totalReturns: number;
  lifetimeValue: number;
  returnLoss: number;
  averageOrderValue: number;
  returnFrequency: number; // returns per month
  lastOrderDate: string;
  lastReturnDate: string;
  accountStability: 'new' | 'stable' | 'established' | 'veteran';
  behaviorTrend: 'normal' | 'increasing_returns' | 'high_activity' | 'declining';
  trustScore: number; // 0-100
}

export interface CryptacoreAIAssessment {
  requestId: string;
  riskScore: number; // 0-100 probabilistic score
  riskLevel: 'minimal' | 'low' | 'moderate' | 'elevated' | 'high';
  customerTrustState: 'new_customer' | 'developing_trust' | 'trusted' | 'established' | 'under_review';
  financialExposure: {
    productCost: number;
    logisticsCost: number;
    marginImpact: number;
    totalExposure: number;
  };
  recommendedAction: 'approve_normally' | 'monitor_account' | 'manual_review' | 'enhanced_verification';
  confidenceLevel: number; // 0-100
  patternIndicators: {
    returnFrequency: {
      score: number;
      explanation: string;
      severity: 'normal' | 'elevated' | 'concerning';
    };
    timingPatterns: {
      score: number;
      explanation: string;
      severity: 'normal' | 'elevated' | 'concerning';
    };
    profitImpact: {
      score: number;
      explanation: string;
      severity: 'normal' | 'elevated' | 'concerning';
    };
    behaviorConsistency: {
      score: number;
      explanation: string;
      severity: 'normal' | 'elevated' | 'concerning';
    };
    reasonAnalysis: {
      score: number;
      explanation: string;
      severity: 'normal' | 'elevated' | 'concerning';
    };
  };
  cumulativeRiskFactors: string[];
  operationalNotes: string[];
  auditJustification: string;
}
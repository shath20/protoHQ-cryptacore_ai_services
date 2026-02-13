import { ReturnRequest, CustomerProfile, CryptacoreAIAssessment } from '../types/returns';

import { RISK_MODEL_CONFIG } from '../config/risk-model';

export class CryptacoreAI {
  // Constants now loaded from config/risk-model.ts

  static assessReturnRisk(returnRequest: ReturnRequest, customerProfile: CustomerProfile): CryptacoreAIAssessment {
    // Initialize assessment
    const assessment: CryptacoreAIAssessment = {
      requestId: returnRequest.id,
      riskScore: 0,
      riskLevel: 'minimal',
      customerTrustState: this.determineTrustState(customerProfile),
      financialExposure: this.calculateFinancialExposure(returnRequest),
      recommendedAction: 'approve_normally',
      confidenceLevel: 0,
      patternIndicators: {
        returnFrequency: { score: 0, explanation: '', severity: 'normal' },
        timingPatterns: { score: 0, explanation: '', severity: 'normal' },
        profitImpact: { score: 0, explanation: '', severity: 'normal' },
        behaviorConsistency: { score: 0, explanation: '', severity: 'normal' },
        reasonAnalysis: { score: 0, explanation: '', severity: 'normal' }
      },
      cumulativeRiskFactors: [],
      operationalNotes: [],
      auditJustification: ''
    };

    // Analyze each dimension with refined logic
    this.analyzeReturnFrequency(returnRequest, customerProfile, assessment);
    this.analyzeTimingPatterns(returnRequest, customerProfile, assessment);
    this.analyzeProfitImpact(returnRequest, customerProfile, assessment);
    this.analyzeBehaviorConsistency(returnRequest, customerProfile, assessment);
    this.analyzeReturnReasons(returnRequest, assessment);

    // Apply score dampening and decay
    this.applyScoreDampening(assessment, customerProfile);

    // Calculate cumulative risk with rebalanced weights
    this.calculateCumulativeRisk(assessment);

    // Determine recommended action
    this.determineRecommendedAction(assessment);

    // Generate enhanced audit justification
    this.generateAuditJustification(assessment);

    return assessment;
  }

  private static determineTrustState(profile: CustomerProfile): 'new_customer' | 'developing_trust' | 'trusted' | 'established' | 'under_review' {
    if (profile.accountAge < 30) return 'new_customer';
    if (profile.accountAge < 90 && profile.returnFrequency < 0.1) return 'developing_trust';
    if (profile.accountAge > 180 && profile.returnFrequency < 0.05) return 'established';
    if (profile.returnFrequency > 0.2) return 'under_review';
    return 'trusted';
  }

  private static calculateFinancialExposure(returnRequest: ReturnRequest) {
    const logisticsCost = returnRequest.productCost * 0.15; // 15% of product cost for logistics
    const marginImpact = returnRequest.productPrice - returnRequest.productCost;
    const totalExposure = returnRequest.productCost + logisticsCost;

    return {
      productCost: returnRequest.productCost,
      logisticsCost,
      marginImpact,
      totalExposure
    };
  }

  private static analyzeReturnFrequency(returnRequest: ReturnRequest, profile: CustomerProfile, assessment: CryptacoreAIAssessment) {
    const returnRate = profile.totalOrders > 0 ? profile.totalReturns / profile.totalOrders : 0;
    let score = 0;
    let explanation = '';
    let severity: 'normal' | 'elevated' | 'concerning' = 'normal';

    // First-time returns and new customers always get minimal risk
    if (profile.totalReturns <= 1 || profile.accountAge < RISK_MODEL_CONFIG.NEW_CUSTOMER_THRESHOLD_DAYS) {
      score = 0;
      explanation = `First-time return or new customer (${profile.accountAge} days). Normal operational behavior.`;
    } else if (returnRate <= RISK_MODEL_CONFIG.HIGH_RETURN_THRESHOLD) {
      // Apply dampening for low-risk patterns
      score = Math.min(returnRate * 50, RISK_MODEL_CONFIG.MINOR_SIGNAL_CAP); // Reduced from 100 to 50 multiplier
      explanation = `Return rate of ${(returnRate * 100).toFixed(1)}% across ${profile.totalOrders} orders. Within acceptable range.`;
    } else if (returnRate <= RISK_MODEL_CONFIG.CONCERNING_RETURN_THRESHOLD) {
      // Only meaningful after repeated patterns
      if (profile.totalReturns >= RISK_MODEL_CONFIG.PATTERN_REPETITION_THRESHOLD) {
        score = 15 + (returnRate - RISK_MODEL_CONFIG.HIGH_RETURN_THRESHOLD) * 100; // Reduced escalation
        explanation = `Elevated return rate of ${(returnRate * 100).toFixed(1)}% across ${profile.totalReturns} orders. Pattern requires attention.`;
        severity = 'elevated';
      } else {
        score = 5; // Minimal score for isolated elevated rate
        explanation = `Return rate of ${(returnRate * 100).toFixed(1)}% but limited history. Monitoring recommended.`;
      }
    } else {
      // High rate only concerning with sufficient repetition
      if (profile.totalReturns >= RISK_MODEL_CONFIG.PATTERN_REPETITION_THRESHOLD + 1) {
        score = 25 + Math.min((returnRate - RISK_MODEL_CONFIG.CONCERNING_RETURN_THRESHOLD) * 100, 20); // Capped escalation
        explanation = `High return rate of ${(returnRate * 100).toFixed(1)}% with ${profile.totalReturns} returns. Pattern indicates operational risk.`;
        severity = 'concerning';
      } else {
        score = 10; // Reduced score for insufficient pattern data
        explanation = `Elevated return rate but insufficient repetition for definitive assessment.`;
        severity = 'elevated';
      }
    }

    // Check for accelerating pattern (only with sufficient history)
    if (profile.totalReturns > RISK_MODEL_CONFIG.PATTERN_REPETITION_THRESHOLD) {
      const recentReturns = this.getRecentReturnFrequency(profile);
      if (recentReturns > returnRate * 1.5) {
        score += 8; // Reduced from 15
        explanation += ` Recent acceleration in return frequency detected.`;
        severity = severity === 'normal' ? 'elevated' : 'concerning';
      }
    }

    assessment.patternIndicators.returnFrequency = { score, explanation, severity };
  }

  private static analyzeTimingPatterns(returnRequest: ReturnRequest, profile: CustomerProfile, assessment: CryptacoreAIAssessment) {
    let score = 0;
    let explanation = '';
    let severity: 'normal' | 'elevated' | 'concerning' = 'normal';

    // Single near-deadline returns are not concerning
    const daysToDeadline = RISK_MODEL_CONFIG.POLICY_DEADLINE_DAYS - returnRequest.daysSincePurchase;

    if (daysToDeadline < 3 && profile.totalReturns > 1) {
      // Only meaningful if repeated pattern exists
      const timingConsistency = this.analyzeTimingConsistency(profile);
      if (timingConsistency > 0.7 && profile.totalReturns >= RISK_MODEL_CONFIG.PATTERN_REPETITION_THRESHOLD) {
        score = 8; // Reduced from 10
        explanation = `Repeated pattern of returns within ${daysToDeadline} days of policy deadline across ${profile.totalReturns} returns.`;
        severity = 'elevated';
      } else {
        score = 0; // No risk for isolated timing
        explanation = `Single return timing shows no concerning patterns.`;
      }
    } else {
      score = 0;
      explanation = `Return timing shows no concerning patterns.`;
    }

    // Check for consistent low-variance timing (only with sufficient data)
    if (profile.totalReturns > RISK_MODEL_CONFIG.PATTERN_REPETITION_THRESHOLD + 1) {
      const timingVariance = this.analyzeTimingVariance(profile);
      if (timingVariance < 0.2) { // Low variance = suspicious consistency
        score += 6; // Reduced from 12
        explanation += ` Low variance in return timing patterns detected.`;
        severity = severity === 'normal' ? 'elevated' : 'concerning';
      }
    }

    assessment.patternIndicators.timingPatterns = { score, explanation, severity };
  }

  private static analyzeProfitImpact(returnRequest: ReturnRequest, profile: CustomerProfile, assessment: CryptacoreAIAssessment) {
    let score = 0;
    let explanation = '';
    let severity: 'normal' | 'elevated' | 'concerning' = 'normal';

    // Apply time decay to historical losses
    const timeDecayedLoss = this.applyTimeDecay(profile.returnLoss, profile.accountAge);
    const profitToLossRatio = profile.lifetimeValue > 0 ? profile.lifetimeValue / Math.max(timeDecayedLoss, 1) : 0;
    const currentReturnImpact = returnRequest.productCost / (profile.lifetimeValue || returnRequest.productPrice);

    // New customers get operational grace
    if (profile.accountAge < RISK_MODEL_CONFIG.NEW_CUSTOMER_THRESHOLD_DAYS || profile.totalReturns <= 1) {
      score = 0;
      explanation = `New customer or first return status provides operational grace for profit impact assessment.`;
    } else if (profitToLossRatio > 5) {
      score = 0;
      explanation = `Strong positive profit-to-loss ratio (${profitToLossRatio.toFixed(1)}:1) indicates healthy customer relationship.`;
    } else if (profitToLossRatio > 2) {
      score = Math.min(3, RISK_MODEL_CONFIG.MINOR_SIGNAL_CAP); // Capped minor signal
      explanation = `Moderate profit-to-loss ratio (${profitToLossRatio.toFixed(1)}:1). Within acceptable range.`;
    } else if (profitToLossRatio > 1) {
      // Only concerning with repeated behavioral indicators
      if (profile.totalReturns >= RISK_MODEL_CONFIG.PATTERN_REPETITION_THRESHOLD) {
        score = 6; // Reduced from 10
        explanation = `Low profit-to-loss ratio (${profitToLossRatio.toFixed(1)}:1) with return history warrants monitoring.`;
        severity = 'elevated';
      } else {
        score = 2; // Minimal impact without pattern
        explanation = `Profit-to-loss ratio (${profitToLossRatio.toFixed(1)}:1) within acceptable range for limited history.`;
      }
    } else {
      // Negative ratio only concerning with clear patterns
      if (profile.totalReturns >= RISK_MODEL_CONFIG.PATTERN_REPETITION_THRESHOLD + 1) {
        score = 10; // Reduced from 15
        explanation = `Negative profit-to-loss ratio (${profitToLossRatio.toFixed(1)}:1) with established return pattern requires attention.`;
        severity = 'concerning';
      } else {
        score = 4; // Reduced impact
        explanation = `Profit-to-loss ratio (${profitToLossRatio.toFixed(1)}:1) monitored for pattern development.`;
      }
    }

    // High-value item consideration (reduced impact)
    if (returnRequest.productCost > profile.averageOrderValue * 2 && profile.totalReturns > 1) {
      score += 3; // Reduced from 8
      explanation += ` High-value item relative to customer's average order value.`;
    }

    assessment.patternIndicators.profitImpact = { score, explanation, severity };
  }

  private static analyzeBehaviorConsistency(returnRequest: ReturnRequest, profile: CustomerProfile, assessment: CryptacoreAIAssessment) {
    let score = 0;
    let explanation = '';
    let severity: 'normal' | 'elevated' | 'concerning' = 'normal';

    // Account maturity analysis with forgiveness
    if (profile.accountAge > 180 && profile.behaviorTrend === 'increasing_returns') {
      // Check if recent behavior justifies concern
      const recentBehaviorScore = this.calculateRecentBehaviorScore(profile);
      if (recentBehaviorScore > 0.6 && profile.totalReturns >= RISK_MODEL_CONFIG.PATTERN_REPETITION_THRESHOLD) {
        score = 10; // Reduced from 15
        explanation = `Established account (${profile.accountAge} days) showing sustained increase in return behavior.`;
        severity = 'concerning';
      } else {
        score = 3; // Forgiveness for temporary changes
        explanation = `Established account with recent behavior changes. Monitoring recommended.`;
      }
    } else if (profile.accountAge > 90 && profile.totalReturns > profile.totalOrders * 0.3) {
      // Only meaningful with sufficient repetition
      if (profile.totalReturns >= RISK_MODEL_CONFIG.PATTERN_REPETITION_THRESHOLD) {
        score = 6; // Reduced from 10
        explanation = `Account behavior shift detected with elevated return activity pattern.`;
        severity = 'elevated';
      } else {
        score = 2; // Minimal impact without pattern
        explanation = `Elevated return activity but insufficient repetition for definitive assessment.`;
      }
    } else {
      score = 0;
      explanation = `Customer behavior patterns remain consistent with account history.`;
    }

    // Check for sudden changes (reduced impact)
    const behaviorChange = this.detectBehaviorChange(profile);
    if (behaviorChange > 0.7 && profile.totalReturns >= RISK_MODEL_CONFIG.PATTERN_REPETITION_THRESHOLD) {
      score += 6; // Reduced from 12
      explanation += ` Significant behavioral change sustained over multiple returns.`;
      severity = severity === 'normal' ? 'elevated' : 'concerning';
    }

    assessment.patternIndicators.behaviorConsistency = { score, explanation, severity };
  }

  private static analyzeReturnReasons(returnRequest: ReturnRequest, assessment: CryptacoreAIAssessment) {
    let score = 0;
    let explanation = '';
    let severity: 'normal' | 'elevated' | 'concerning' = 'normal';

    // Analyze reason patterns with repetition requirements
    const reasonVagueness = this.analyzeReasonVagueness(returnRequest.returnReason);
    const reasonRepetition = this.analyzeReasonRepetition(returnRequest.returnReason, returnRequest.previousReturnReasons);

    // Only concerning with sufficient repetition
    if (reasonVagueness > 0.8 && returnRequest.previousReturnReasons.length >= RISK_MODEL_CONFIG.PATTERN_REPETITION_THRESHOLD) {
      score = 5; // Reduced from 8
      explanation = `Pattern of vague return explanations across ${returnRequest.previousReturnReasons.length} returns.`;
      severity = 'elevated';
    } else if (reasonRepetition > 0.6 && returnRequest.previousReturnReasons.length >= RISK_MODEL_CONFIG.PATTERN_REPETITION_THRESHOLD) {
      score = 6; // Reduced from 10
      explanation = `Template-like return reason patterns detected across multiple returns.`;
      severity = 'elevated';
    } else {
      score = 0;
      explanation = `Return reason shows appropriate specificity and variation.`;
    }

    // Check for reason-category mismatch (reduced impact)
    if (this.detectReasonCategoryMismatch(returnRequest) && returnRequest.previousReturnReasons.length > 2) {
      score += 2; // Reduced from 5
      explanation += ` Return reason inconsistency with product category observed in pattern.`;
    }

    assessment.patternIndicators.reasonAnalysis = { score, explanation, severity };
  }

  // New: Apply score dampening and decay mechanics
  private static applyScoreDampening(assessment: CryptacoreAIAssessment, profile: CustomerProfile) {
    // Apply forgiveness for good behavior
    const daysSinceLastReturn = this.getDaysSinceLastReturn(profile);
    if (daysSinceLastReturn > RISK_MODEL_CONFIG.FORGIVENESS_THRESHOLD) {
      const decayFactor = Math.pow(RISK_MODEL_CONFIG.SCORE_DECAY_RATE, Math.floor(daysSinceLastReturn / 30));

      Object.keys(assessment.patternIndicators).forEach(key => {
        const indicator = assessment.patternIndicators[key as keyof typeof assessment.patternIndicators];
        if (indicator.score > 0) {
          indicator.score *= decayFactor;
          indicator.explanation += ` (Reduced by ${Math.round((1 - decayFactor) * 100)}% due to ${Math.floor(daysSinceLastReturn / 30)} months of normal behavior)`;
        }
      });
    }

    // Cap individual indicator scores to prevent over-escalation
    Object.values(assessment.patternIndicators).forEach(indicator => {
      indicator.score = Math.min(indicator.score, RISK_MODEL_CONFIG.MINOR_SIGNAL_CAP);
    });
  }

  // New: Calculate cumulative risk with rebalanced weights
  private static calculateCumulativeRisk(assessment: CryptacoreAIAssessment) {
    const indicators = assessment.patternIndicators;
    let totalScore = 0;
    let concerningCount = 0;
    let elevatedCount = 0;

    // Calculate weighted sum with dampening
    Object.values(indicators).forEach(indicator => {
      // Apply additional dampening for multiple minor signals
      const weight = indicator.score > RISK_MODEL_CONFIG.MINOR_SIGNAL_CAP * 0.5 ? 1.0 : 0.7;
      totalScore += indicator.score * weight;

      if (indicator.severity === 'concerning') concerningCount++;
      if (indicator.severity === 'elevated') elevatedCount++;
    });

    // Apply pattern repetition bonus (only for strong patterns)
    if (concerningCount >= 2) {
      totalScore = Math.min(totalScore * 1.2, 100); // Reduced from 1.5
    } else if (elevatedCount >= 3) {
      totalScore = Math.min(totalScore * 1.1, 100); // Reduced from 1.3
    }

    assessment.riskScore = Math.min(totalScore, 100);

    // Determine risk level with adjusted thresholds
    if (assessment.riskScore < 15) { // Raised from 20
      assessment.riskLevel = 'minimal';
    } else if (assessment.riskScore < 35) { // Raised from 40
      assessment.riskLevel = 'low';
    } else if (assessment.riskScore < 55) { // Raised from 60
      assessment.riskLevel = 'moderate';
    } else if (assessment.riskScore < 75) { // Raised from 80
      assessment.riskLevel = 'elevated';
    } else {
      assessment.riskLevel = 'high';
    }

    // Calculate confidence based on pattern strength
    assessment.confidenceLevel = Math.min(50 + (concerningCount * 15) + (elevatedCount * 8), 95);

    // Generate cumulative risk factors with contribution percentages
    assessment.cumulativeRiskFactors = this.generateCumulativeRiskFactors(indicators, assessment.riskScore);
  }

  private static determineRecommendedAction(assessment: CryptacoreAIAssessment) {
    const { riskScore, riskLevel, customerTrustState } = assessment;

    if (riskLevel === 'minimal' || riskLevel === 'low') {
      assessment.recommendedAction = 'approve_normally';
      assessment.operationalNotes.push('Standard processing approved based on low risk assessment.');
    } else if (riskLevel === 'moderate') {
      if (customerTrustState === 'new_customer' || customerTrustState === 'developing_trust') {
        assessment.recommendedAction = 'monitor_account';
        assessment.operationalNotes.push('Account monitoring recommended due to moderate risk indicators.');
      } else {
        assessment.recommendedAction = 'approve_normally';
        assessment.operationalNotes.push('Approved with enhanced monitoring due to customer history.');
      }
    } else if (riskLevel === 'elevated') {
      assessment.recommendedAction = 'manual_review';
      assessment.operationalNotes.push('Manual review required due to elevated risk patterns.');
    } else {
      assessment.recommendedAction = 'enhanced_verification';
      assessment.operationalNotes.push('Enhanced verification required before processing.');
    }
  }

  // New: Enhanced audit justification with contribution percentages
  private static generateAuditJustification(assessment: CryptacoreAIAssessment) {
    const { riskScore, riskLevel, recommendedAction, patternIndicators } = assessment;

    let justification = `CryptacoreAI Risk Assessment: ${riskLevel.toUpperCase()} (${riskScore}/100). `;
    justification += `Recommended Action: ${recommendedAction.replace(/_/g, ' ').toUpperCase()}. `;

    // Add contribution-weighted explanations
    const sortedIndicators = Object.entries(patternIndicators)
      .filter(([_, indicator]) => indicator.score > 0)
      .sort(([_, a], [__, b]) => b.score - a.score);

    if (sortedIndicators.length > 0) {
      justification += `Primary Risk Factors: `;
      sortedIndicators.forEach(([name, indicator], index) => {
        const contribution = Math.round((indicator.score / riskScore) * 100);
        const displayName = name.replace(/([A-Z])/g, ' $1').toLowerCase();
        justification += `${displayName} (${contribution}% contribution): ${indicator.explanation}`;
        if (index < sortedIndicators.length - 1) justification += '; ';
      });
      justification += '. ';
    }

    justification += `Confidence Level: ${assessment.confidenceLevel}%. Assessment based on cumulative pattern analysis with score dampening and time decay applied.`;

    assessment.auditJustification = justification;
  }

  // New: Helper methods for refined logic
  private static applyTimeDecay(loss: number, accountAge: number): number {
    const monthsOld = accountAge / 30;
    const decayFactor = Math.pow(0.9, Math.max(0, monthsOld - 6)); // Start decay after 6 months
    return loss * decayFactor;
  }

  private static getDaysSinceLastReturn(profile: CustomerProfile): number {
    // Simplified - in real implementation would use actual last return date
    return profile.lastReturnDate ?
      Math.floor((Date.now() - new Date(profile.lastReturnDate).getTime()) / (1000 * 60 * 60 * 24)) :
      profile.accountAge;
  }

  private static calculateRecentBehaviorScore(profile: CustomerProfile): number {
    // Simplified - would analyze recent vs historical patterns
    return profile.behaviorTrend === 'increasing_returns' ? 0.7 : 0.3;
  }

  private static analyzeTimingVariance(profile: CustomerProfile): number {
    // Simplified - would calculate actual variance in return timing
    return profile.totalReturns > 3 ? 0.3 : 0.8; // High variance = normal
  }

  // Existing helper methods (unchanged)
  private static getRecentReturnFrequency(profile: CustomerProfile): number {
    return profile.returnFrequency * 1.2;
  }

  private static analyzeTimingConsistency(profile: CustomerProfile): number {
    return profile.totalReturns > 3 ? 0.6 : 0;
  }

  private static detectBehaviorChange(profile: CustomerProfile): number {
    return profile.behaviorTrend === 'increasing_returns' ? 0.8 : 0.2;
  }

  private static analyzeReasonVagueness(reason: string): number {
    const vagueWords = ['wrong', 'bad', 'broken', 'not good', 'defective', 'issue'];
    const vagueCount = vagueWords.filter(word => reason.toLowerCase().includes(word)).length;
    return Math.min(vagueCount / 3, 1);
  }

  private static analyzeReasonRepetition(currentReason: string, previousReasons: string[]): number {
    if (previousReasons.length === 0) return 0;

    const similarity = previousReasons.filter(reason =>
      reason.toLowerCase().includes(currentReason.toLowerCase().split(' ')[0])
    ).length;

    return Math.min(similarity / previousReasons.length, 1);
  }

  private static detectReasonCategoryMismatch(returnRequest: ReturnRequest): boolean {
    return returnRequest.returnReasonType === 'defective' &&
      returnRequest.productCategory === 'clothing' &&
      !returnRequest.returnReason.toLowerCase().includes('tear') &&
      !returnRequest.returnReason.toLowerCase().includes('rip');
  }

  // New: Generate cumulative risk factors with contribution percentages
  private static generateCumulativeRiskFactors(indicators: CryptacoreAIAssessment['patternIndicators'], totalScore: number): string[] {
    const factors: string[] = [];

    Object.entries(indicators).forEach(([name, indicator]) => {
      if (indicator.score > 0) {
        const contribution = Math.round((indicator.score / totalScore) * 100);
        const displayName = name.replace(/([A-Z])/g, ' $1').toLowerCase();
        factors.push(`${displayName}: ${indicator.severity} (${indicator.score.toFixed(1)} points, ${contribution}% contribution)`);
      }
    });

    return factors.sort((a, b) => {
      const aScore = parseFloat(a.match(/\(([\d.]+) points/)?.[1] || '0');
      const bScore = parseFloat(b.match(/\(([\d.]+) points/)?.[1] || '0');
      return bScore - aScore;
    });
  }
}
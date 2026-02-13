export const RISK_MODEL_CONFIG = {
    POLICY_DEADLINE_DAYS: 30,
    NEW_CUSTOMER_THRESHOLD_DAYS: 90,
    HIGH_RETURN_THRESHOLD: 0.15, // 15% return rate
    CONCERNING_RETURN_THRESHOLD: 0.25, // 25% return rate

    // Score dampening and decay constants
    SCORE_DECAY_RATE: 0.85, // 15% decay per month of good behavior
    FORGIVENESS_THRESHOLD: 90, // days of normal behavior to trigger decay
    MINOR_SIGNAL_CAP: 8, // max score from any single minor indicator
    PATTERN_REPETITION_THRESHOLD: 3, // minimum repetitions for meaningful risk
};

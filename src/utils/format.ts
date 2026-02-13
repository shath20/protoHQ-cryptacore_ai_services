export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export function getScoreColor(score: number) {
  if (score <= 30) {
    return {
      bg: 'bg-green-500',
      text: 'text-green-600',
      label: 'Low Risk'
    };
  } else if (score <= 70) {
    return {
      bg: 'bg-yellow-500',
      text: 'text-yellow-600',
      label: 'Medium Risk'
    };
  } else {
    return {
      bg: 'bg-red-500',
      text: 'text-red-600',
      label: 'High Risk'
    };
  }
}

export function getAIScoreColor(score: number) {
  if (score <= 30) {
    return {
      bg: 'bg-green-500',
      text: 'text-green-600',
      label: 'Human Written'
    };
  } else if (score <= 70) {
    return {
      bg: 'bg-yellow-500',
      text: 'text-yellow-600',
      label: 'Mixed Signals'
    };
  } else if (score <= 85) {
    return {
      bg: 'bg-purple-500',
      text: 'text-purple-600',
      label: 'AI Generated'
    };
  } else {
    return {
      bg: 'bg-orange-500',
      text: 'text-orange-600',
      label: 'Retailer Fake'
    };
  }
}

export function getCommentBackgroundColor(score: number, flagged: boolean) {
  if (score > 85) {
    return {
      bg: 'bg-orange-50',
      border: 'border-orange-400'
    };
  } else if (score > 70 && flagged) {
    return {
      bg: 'bg-red-50',
      border: 'border-red-400'
    };
  } else if (score > 50 && flagged) {
    return {
      bg: 'bg-yellow-50',
      border: 'border-yellow-400'
    };
  }
  return {
    bg: '',
    border: 'border-transparent'
  };
}

export function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else {
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }
}
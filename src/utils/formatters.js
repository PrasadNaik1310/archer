/**
 * Standardizes date strings into a clean business format
 * Example: 2023-01-24 -> Jan 24, 2023
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

/**
 * Formats large financial numbers into compact notation
 * Example: 1110000000 -> $1.11B
 */
export const formatCurrency = (value, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

/**
 * Maps sentiment scores (-100 to 100) to human-readable labels
 */
export const getSentimentLabel = (score) => {
  if (score <= -70) return 'Extreme Panic';
  if (score <= -20) return 'Bearish / Negative';
  if (score < 20) return 'Neutral / Stable';
  if (score < 70) return 'Bullish / Positive';
  return 'Extreme Optimism';
};

/**
 * Returns Tailwind color classes based on sentiment
 */
export const getSentimentColor = (sentiment) => {
  const s = sentiment?.toLowerCase();
  if (s === 'negative' || s === 'bearish') return 'text-red-500';
  if (s === 'positive' || s === 'bullish') return 'text-emerald-500';
  return 'text-slate-400';
};

/**
 * Simple string truncation for news headlines or summaries
 */
export const truncate = (text, length = 100) => {
  if (!text) return '';
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

/**
 * Calculates estimated reading time for AI summaries
 */
export const calculateReadingTime = (text) => {
  const wordsPerMinute = 200;
  const words = text?.split(/\s+/).length || 0;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

/**
 * Formats timestamps into a relative format (e.g., "2 hours ago")
 * Great for "Breaking" or "Recently Updated" tags
 */
export const formatRelativeTime = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInMs = now - past;
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return formatDate(dateString);
};
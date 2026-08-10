export type LeaderboardPeriod = 'allTime' | 'monthly' | 'weekly';

/**
 * Generates the period string for leaderboard grouping.
 * All time -> "ALL_TIME"
 * Monthly -> "MONTH_YYYY_MM" (e.g. "MONTH_2026_08")
 * Weekly -> "WEEK_YYYY_WW" (e.g. "WEEK_2026_32" based on ISO week)
 */
export function getPeriodString(timestamp: number, period: LeaderboardPeriod): string {
  if (period === 'allTime') {
    return 'ALL_TIME';
  }
  
  const date = new Date(timestamp);
  const year = date.getUTCFullYear();

  if (period === 'monthly') {
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    return `MONTH_${year}_${month}`;
  }

  if (period === 'weekly') {
    // ISO 8601 week calculation
    const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    
    // Get first day of year
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    
    return `WEEK_${d.getUTCFullYear()}_${String(weekNo).padStart(2, '0')}`;
  }

  return 'ALL_TIME';
}

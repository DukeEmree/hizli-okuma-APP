export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastActivityAt: number;
}

/**
 * Get the local date string (YYYY-MM-DD) for a given UTC timestamp and timezone.
 * Returns 'YYYY-MM-DD'
 */
export function getLocalDateString(utcTimestamp: number, timeZone: string = 'UTC'): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', { // 'en-CA' generally outputs YYYY-MM-DD directly
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(new Date(utcTimestamp));
  } catch {
    // Fallback to UTC if timezone is invalid
    const date = new Date(utcTimestamp);
    const yyyy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(date.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}

/**
 * Calculates the difference in days between two date strings 'YYYY-MM-DD'.
 */
function getDaysDifference(dateStr1: string, dateStr2: string): number {
  // Parsing YYYY-MM-DD as UTC midnight to calculate accurate day differences
  const msPerDay = 1000 * 60 * 60 * 24;
  const d1 = new Date(`${dateStr1}T00:00:00Z`).getTime();
  const d2 = new Date(`${dateStr2}T00:00:00Z`).getTime();
  
  return Math.round((d2 - d1) / msPerDay);
}

/**
 * Calculates the new streak state based on a new activity timestamp.
 * 
 * @param currentState The current streak state of the user. If null/undefined, assumes 0 streak.
 * @param newActivityAtUTC The UTC timestamp of the new activity.
 * @param userTimezone The IANA timezone string of the user (e.g. 'Europe/Istanbul'). Defaults to 'UTC'.
 */
export function calculateStreakUpdate(
  currentState: StreakState | null,
  newActivityAtUTC: number,
  userTimezone: string = 'UTC'
): StreakState {
  if (!currentState || currentState.lastActivityAt === 0) {
    // First time activity
    return {
      currentStreak: 1,
      longestStreak: 1,
      lastActivityAt: newActivityAtUTC,
    };
  }

  // Prevent time traveling backwards logic errors
  if (newActivityAtUTC < currentState.lastActivityAt) {
    // If the activity is older than our last known activity, do not modify streak numbers,
    // just ignore or return same state.
    return currentState;
  }

  const lastLocalDate = getLocalDateString(currentState.lastActivityAt, userTimezone);
  const newLocalDate = getLocalDateString(newActivityAtUTC, userTimezone);

  const daysDifference = getDaysDifference(lastLocalDate, newLocalDate);

  if (daysDifference === 0) {
    // Multiple sessions same day. Update timestamp but do not increment streak.
    return {
      ...currentState,
      lastActivityAt: newActivityAtUTC,
    };
  } else if (daysDifference === 1) {
    // Next consecutive day.
    const newStreak = currentState.currentStreak + 1;
    return {
      currentStreak: newStreak,
      longestStreak: Math.max(currentState.longestStreak, newStreak),
      lastActivityAt: newActivityAtUTC,
    };
  } else {
    // Missed a day (or more).
    return {
      currentStreak: 1,
      longestStreak: currentState.longestStreak,
      lastActivityAt: newActivityAtUTC,
    };
  }
}

import { getLocalDateString } from '@/utils/streak';

export interface DailyGoalSession {
  clientSessionId: string;
  exerciseType: string;
  completedAt: number;
}

/**
 * Whether the session identified by `justCompletedSessionId` is the one that
 * finished today's daily plan.
 *
 * The previous rule was `todaysSessionCount === planSize`, which is wrong in
 * both directions: a premium user doing four *arbitrary* exercises collected
 * the plan bonus without touching the plan, and a user who did three plan
 * steps plus one repeat collected it without finishing. Counting distinct
 * plan step types instead makes the bonus mean what its name says.
 *
 * Fires exactly once, on the transition: the set of completed plan types is
 * computed with and without this session, and the goal only counts as
 * completed if this session is what pushed it over the line. Without that
 * comparison every later session of the day would re-award the bonus.
 */
export function isDailyGoalCompletedBy(
  sessions: DailyGoalSession[],
  planTypes: string[],
  justCompletedSessionId: string,
  completedAt: number,
  timeZone: string,
): boolean {
  if (planTypes.length === 0) return false;

  const today = getLocalDateString(completedAt, timeZone);
  const planTypeSet = new Set(planTypes);

  const todaysPlanSessions = sessions.filter(
    (session) =>
      planTypeSet.has(session.exerciseType) &&
      getLocalDateString(session.completedAt, timeZone) === today,
  );

  const after = new Set(todaysPlanSessions.map((session) => session.exerciseType));
  if (after.size < planTypeSet.size) return false;

  const before = new Set(
    todaysPlanSessions
      .filter((session) => session.clientSessionId !== justCompletedSessionId)
      .map((session) => session.exerciseType),
  );

  return before.size < planTypeSet.size;
}

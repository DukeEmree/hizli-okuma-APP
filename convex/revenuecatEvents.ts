import { internalMutation } from './_generated/server';
import { v } from 'convex/values';
import { Id } from './_generated/dataModel';
import { decideNotification, NotificationContent } from './notificationPolicy';

export interface RecordEventResult {
  duplicate: boolean;
  eventRecordId: Id<'processedRevenueCatEvents'> | null;
  userId: Id<'users'> | null;
  notify: NotificationContent | null;
}

// Single mutation that does check-then-insert on `by_eventId` AND decides
// whether to notify, all in one Convex transaction. Convex mutations run
// under OCC: if two webhook deliveries for the same event race, both read
// the same index range, so the second one to commit conflicts and
// automatically retries — by the time it retries it will see the first
// one's insert and return `duplicate: true`. This makes the naive
// "check then insert" shape race-safe here, unlike a plain SQL database.
export const recordEvent = internalMutation({
  args: {
    eventId: v.string(),
    eventType: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args): Promise<RecordEventResult> => {
    const existing = await ctx.db
      .query('processedRevenueCatEvents')
      .withIndex('by_eventId', (q) => q.eq('eventId', args.eventId))
      .unique();

    if (existing) {
      return { duplicate: true, eventRecordId: existing._id, userId: null, notify: null };
    }

    const eventRecordId = await ctx.db.insert('processedRevenueCatEvents', {
      eventId: args.eventId,
      eventType: args.eventType,
      clerkId: args.clerkId,
      processedAt: Date.now(),
    });

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .unique();

    if (!user) {
      console.error('RevenueCat event for unknown clerkId, notification skipped', args.clerkId);
      return { duplicate: false, eventRecordId, userId: null, notify: null };
    }

    const content = decideNotification(args.eventType);
    if (!content || user.pushNotificationsEnabled === false) {
      return { duplicate: false, eventRecordId, userId: user._id, notify: null };
    }

    return { duplicate: false, eventRecordId, userId: user._id, notify: content };
  },
});

export const recordNotificationOutcome = internalMutation({
  args: {
    eventRecordId: v.id('processedRevenueCatEvents'),
    sent: v.boolean(),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.eventRecordId, {
      notificationSent: args.sent,
      notificationError: args.error,
    });
  },
});

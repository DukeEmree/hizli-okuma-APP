import { internalAction } from './_generated/server';
import { internal } from './_generated/api';
import { v } from 'convex/values';
import { Id } from './_generated/dataModel';

const EXPO_PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send';

export interface ExpoPushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export function buildExpoPushMessages(
  tokens: string[],
  content: { title: string; body: string; data?: Record<string, unknown> }
): ExpoPushMessage[] {
  return tokens.map((to) => ({ to, title: content.title, body: content.body, data: content.data }));
}

// Expo returns one ticket per message, in the same order as the request.
// We only act on DeviceNotRegistered — every other error (rate limit,
// malformed message, transient) is left alone rather than deleting a token
// that might still be valid.
export function findDeadTokenIndexes(tokens: string[], responseBody: unknown): number[] {
  if (typeof responseBody !== 'object' || responseBody === null || !('data' in responseBody)) {
    return [];
  }
  const data = (responseBody as { data: unknown }).data;
  if (!Array.isArray(data)) {
    return [];
  }

  const deadIndexes: number[] = [];
  data.forEach((ticket, i) => {
    if (i >= tokens.length) return;
    if (
      typeof ticket === 'object' &&
      ticket !== null &&
      (ticket as { status?: unknown }).status === 'error' &&
      (ticket as { details?: { error?: unknown } }).details?.error === 'DeviceNotRegistered'
    ) {
      deadIndexes.push(i);
    }
  });
  return deadIndexes;
}

// Best-effort single attempt: a delivery failure here must never fail the
// RevenueCat webhook response (RevenueCat would otherwise redeliver and the
// event is already marked processed), so all errors are caught and reported
// back as a status string instead of throwing.
export const sendPushToUser = internalAction({
  args: {
    userId: v.id('users'),
    title: v.string(),
    body: v.string(),
    data: v.optional(v.record(v.string(), v.any())),
    eventRecordId: v.optional(v.id('processedRevenueCatEvents')),
  },
  handler: async (ctx, args): Promise<{ sent: boolean; reason: string }> => {
    const tokenRows: Array<{ _id: Id<'pushTokens'>; token: string }> = await ctx.runQuery(
      internal.pushTokens.getTokensForUser,
      { userId: args.userId }
    );

    if (tokenRows.length === 0) {
      return { sent: false, reason: 'no_tokens' };
    }

    const tokens = tokenRows.map((t) => t.token);
    const messages = buildExpoPushMessages(tokens, { title: args.title, body: args.body, data: args.data });

    let reason = 'ok';
    let sent = false;
    try {
      // EXPO_ACCESS_TOKEN is optional (Expo's "enhanced push security"): if
      // set, Expo verifies pushes come from this project instead of anyone
      // who obtains a token. Never required — omit to send unauthenticated.
      const accessToken = process.env.EXPO_ACCESS_TOKEN;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      const response = await fetch(EXPO_PUSH_ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify(messages),
      });
      const json: unknown = await response.json();

      if (!response.ok) {
        reason = `http_${response.status}`;
      } else {
        sent = true;
        const deadIndexes = findDeadTokenIndexes(tokens, json);
        for (const i of deadIndexes) {
          await ctx.runMutation(internal.pushTokens.deleteTokenById, { tokenId: tokenRows[i]._id });
        }
      }
    } catch (error) {
      reason = error instanceof Error ? error.message : 'unknown_error';
      console.error('Expo push send failed', reason);
    }

    if (args.eventRecordId) {
      await ctx.runMutation(internal.revenuecatEvents.recordNotificationOutcome, {
        eventRecordId: args.eventRecordId,
        sent,
        error: sent ? undefined : reason,
      });
    }

    return { sent, reason };
  },
});

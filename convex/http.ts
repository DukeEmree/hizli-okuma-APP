import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { internal } from './_generated/api';

/**
 * Constant-time string comparison using Web Crypto API.
 * Prevents timing attacks on secret validation in V8/Edge environments.
 */
export async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const aBuffer = encoder.encode(a);
  const bBuffer = encoder.encode(b);

  if (aBuffer.byteLength !== bBuffer.byteLength) {
    return false;
  }

  const key = await crypto.subtle.generateKey(
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
  
  const mac = await crypto.subtle.sign('HMAC', key, aBuffer);
  return await crypto.subtle.verify('HMAC', key, mac, bBuffer);
}

const http = httpRouter();

http.route({
  path: '/revenuecat-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const expectedSecret = process.env.REVENUECAT_WEBHOOK_AUTH_HEADER;
    if (!expectedSecret) {
      console.error('REVENUECAT_WEBHOOK_AUTH_HEADER is not configured');
      return new Response('Webhook not configured', { status: 500 });
    }
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401 });
    }

    const isValid = await timingSafeEqual(authHeader, expectedSecret);
    if (!isValid) {
      return new Response('Unauthorized', { status: 401 });
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return new Response('Invalid JSON body', { status: 400 });
    }

    if (typeof payload !== 'object' || payload === null || !('event' in payload)) {
      return new Response('No event found', { status: 400 });
    }
    const event = (payload as { event: unknown }).event;
    if (typeof event !== 'object' || event === null) {
      return new Response('No event found', { status: 400 });
    }
    const e = event as Record<string, unknown>;

    const clerkId = e.app_user_id;
    if (typeof clerkId !== 'string' || clerkId.length === 0) {
      return new Response('Missing app_user_id', { status: 400 });
    }
    const eventType = typeof e.type === 'string' ? e.type : undefined;
    const entitlementIds = Array.isArray(e.entitlement_ids) ? e.entitlement_ids : [];
    const expirationAtMs = typeof e.expiration_at_ms === 'number' ? e.expiration_at_ms : undefined;

    try {
      // We only care about events that modify entitlements (e.g. INITIAL_PURCHASE, RENEWAL, CANCELLATION, EXPIRATION, UNCANCELLATION)
      const hasPremium = entitlementIds.includes('premium');

      // Let's determine premium based on EXPIRATION type and future expiration_at_ms if available.
      // A more robust check uses the purchased_at_ms and expiration_at_ms from the event if it's available.
      let isPremium = hasPremium;
      let expiresAt: number | undefined = undefined;

      if (eventType === 'EXPIRATION') {
        isPremium = false;
      }

      if (expirationAtMs !== undefined) {
        expiresAt = expirationAtMs;
        if (Date.now() > expirationAtMs) {
           isPremium = false;
        }
      }

      await ctx.runMutation(internal.subscriptions.syncPremiumState, {
        clerkId,
        isPremium,
        premiumExpiresAt: expiresAt,
      });

      console.log('Processed RC webhook for user:', clerkId, 'Event:', eventType, 'isPremium:', isPremium);

      return new Response(null, { status: 200 });
    } catch (e) {
      console.error('Webhook error:', e);
      return new Response('Webhook Error', { status: 500 });
    }
  }),
});

export default http;

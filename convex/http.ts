import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { api, internal } from './_generated/api';

const http = httpRouter();

http.route({
  path: '/revenuecat-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    try {
      const payload = await request.json();
      
      const event = payload.event;
      if (!event) return new Response('No event found', { status: 400 });

      // In RevenueCat, app_user_id is the identity we set on login (clerkId).
      const clerkId = event.app_user_id;
      
      // We only care about events that modify entitlements (e.g. INITIAL_PURCHASE, RENEWAL, CANCELLATION, EXPIRATION, UNCANCELLATION)
      const hasPremium = event.entitlement_ids && event.entitlement_ids.includes('premium');
      const isExpired = event.type === 'EXPIRATION' || event.type === 'CANCELLATION'; // CANCELLATION might not expire immediately if period hasn't ended.
      
      // Let's determine premium based on EXPIRATION type and future expiration_at_ms if available.
      // A more robust check uses the purchased_at_ms and expiration_at_ms from the event if it's available.
      let isPremium = hasPremium;
      let expiresAt: number | undefined = undefined;

      if (event.type === 'EXPIRATION') {
        isPremium = false;
      }
      
      if (event.expiration_at_ms) {
        expiresAt = event.expiration_at_ms;
        if (Date.now() > event.expiration_at_ms) {
           isPremium = false;
        }
      }

      await ctx.runMutation(internal.subscriptions.syncPremiumState, {
        clerkId,
        isPremium,
        premiumExpiresAt: expiresAt,
      });
      
      console.log('Processed RC webhook for user:', clerkId, 'Event:', event.type, 'isPremium:', isPremium);
      
      return new Response(null, { status: 200 });
    } catch (e) {
      console.error('Webhook error:', e);
      return new Response('Webhook Error', { status: 500 });
    }
  }),
});

export default http;

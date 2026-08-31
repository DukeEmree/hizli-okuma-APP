import { useCallback, useEffect, useRef, useState } from 'react';
import Purchases, { type PurchasesPackage } from 'react-native-purchases';

import { captureException } from '@/lib/sentry';
import { SUBSCRIPTION_CONSTANTS } from '@/constants/subscription';
import { defaultSelection, sortPackages } from './pricing';

export type OfferingStatus = 'loading' | 'ready' | 'unavailable';

/** Outcome of a purchase or restore attempt, for the screen to render. */
export type PurchaseOutcome =
  | { kind: 'idle' }
  | { kind: 'cancelled' }
  | { kind: 'failed' }
  | { kind: 'nothingToRestore' };

interface PaywallOffering {
  status: OfferingStatus;
  packages: PurchasesPackage[];
  selected: PurchasesPackage | null;
  select: (pkg: PurchasesPackage) => void;
  /** Resolves true when the entitlement is active afterwards. */
  purchase: () => Promise<boolean>;
  restore: () => Promise<boolean>;
  isBusy: boolean;
  outcome: PurchaseOutcome;
  retry: () => void;
}

function hasEntitlement(customerInfo: { entitlements: { active: Record<string, unknown> } }): boolean {
  return customerInfo.entitlements.active[SUBSCRIPTION_CONSTANTS.ENTITLEMENT_ID] !== undefined;
}

/**
 * Everything the custom paywall needs from RevenueCat: the current offering's
 * packages, the selection, and the purchase and restore calls.
 *
 * Offerings are fetched here rather than in `RevenueCatProvider` because only
 * this screen needs them, and a cold start should not pay for a network call
 * most sessions never use. A completed purchase does not need to be pushed
 * back into the provider either - it already listens for customer-info updates,
 * so `isPremium` flips app-wide on its own.
 *
 * A cancelled purchase is not an error. The store's own sheet is where the user
 * decided, they know what they did, and an error message on top of that reads
 * as a failure they have to understand. It resolves to a quiet `cancelled`.
 */
export function usePaywallOffering(): PaywallOffering {
  const [status, setStatus] = useState<OfferingStatus>('loading');
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selected, setSelected] = useState<PurchasesPackage | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [outcome, setOutcome] = useState<PurchaseOutcome>({ kind: 'idle' });
  const [attempt, setAttempt] = useState(0);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    Purchases.getOfferings()
      .then((offerings) => {
        if (cancelled) return;
        const available = offerings.current?.availablePackages ?? [];
        if (available.length === 0) {
          // No offering configured, or none this build can sell. There is
          // nothing to put a price on, so the screen says so rather than
          // rendering an empty plan row with a live buy button above it.
          setStatus('unavailable');
          return;
        }
        const sorted = sortPackages(available);
        setPackages(sorted);
        setSelected(defaultSelection(sorted));
        setStatus('ready');
      })
      .catch((error) => {
        if (cancelled) return;
        captureException(error, { context: 'usePaywallOffering.getOfferings' });
        setStatus('unavailable');
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const purchase = useCallback(async () => {
    if (!selected || isBusy) return false;
    setIsBusy(true);
    setOutcome({ kind: 'idle' });
    try {
      const { customerInfo } = await Purchases.purchasePackage(selected);
      return hasEntitlement(customerInfo);
    } catch (error) {
      if ((error as { userCancelled?: boolean }).userCancelled) {
        setOutcome({ kind: 'cancelled' });
      } else {
        captureException(error, { context: 'usePaywallOffering.purchasePackage' });
        setOutcome({ kind: 'failed' });
      }
      return false;
    } finally {
      if (mountedRef.current) setIsBusy(false);
    }
  }, [selected, isBusy]);

  const restore = useCallback(async () => {
    if (isBusy) return false;
    setIsBusy(true);
    setOutcome({ kind: 'idle' });
    try {
      const customerInfo = await Purchases.restorePurchases();
      const restored = hasEntitlement(customerInfo);
      if (!restored && mountedRef.current) setOutcome({ kind: 'nothingToRestore' });
      return restored;
    } catch (error) {
      captureException(error, { context: 'usePaywallOffering.restorePurchases' });
      if (mountedRef.current) setOutcome({ kind: 'failed' });
      return false;
    } finally {
      if (mountedRef.current) setIsBusy(false);
    }
  }, [isBusy]);

  const select = useCallback((pkg: PurchasesPackage) => {
    setSelected(pkg);
    setOutcome({ kind: 'idle' });
  }, []);

  // Resets the status here rather than at the top of the fetch effect: a
  // synchronous setState in an effect body cascades a render, and the initial
  // state is already 'loading' so only a retry ever needs to put it back.
  const retry = useCallback(() => {
    setStatus('loading');
    setAttempt((n) => n + 1);
  }, []);

  return {
    status,
    packages,
    selected,
    select,
    purchase,
    restore,
    isBusy,
    outcome,
    retry,
  };
}

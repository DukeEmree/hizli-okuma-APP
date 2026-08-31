import { PERIOD_UNIT, type PurchasesPackage } from 'react-native-purchases';

/**
 * The period units a trial can actually be expressed in. `UNKNOWN` is excluded
 * at the type level, not just filtered at runtime, so a caller building an i18n
 * key from a unit cannot reach a key that was never written.
 */
export type TrialPeriodUnit =
  | PERIOD_UNIT.DAY
  | PERIOD_UNIT.WEEK
  | PERIOD_UNIT.MONTH
  | PERIOD_UNIT.YEAR;

export interface TrialOffer {
  unit: TrialPeriodUnit;
  value: number;
}

/**
 * The free trial attached to a package, or null when there is none the user
 * can actually take.
 *
 * A trial is not configured in this app at all — it is an *offer* on the base
 * plan in Play Console, which RevenueCat relays. So this only reads; if nobody
 * has configured one, every branch returns null and the paywall shows plain
 * prices.
 *
 * On Android the answer also carries eligibility for free: `defaultOption` is
 * the option `purchasePackage` will actually buy, and Google only includes the
 * free pricing phase in it when this user still qualifies. Someone who already
 * used the trial gets an option without a `freePhase`, so reading it is the
 * eligibility check — there is no separate call to make, and no way for the
 * screen to promise a trial the purchase would not honour.
 *
 * `freePhase` is trusted only when its price really is zero. A base plan can
 * carry a *discounted* intro phase too, and calling that "ücretsiz" would be a
 * false price claim on the screen where the user decides to pay.
 */
export function trialOffer(pkg: PurchasesPackage): TrialOffer | null {
  const android = pkg.product.defaultOption?.freePhase;
  if (android && android.price.amountMicros === 0) {
    const { unit, value } = android.billingPeriod;
    const known = toPeriodUnit(unit);
    if (value > 0 && known) return { unit: known, value };
  }

  // iOS has no `defaultOption`; its equivalent is an intro price of zero.
  // Unused until an iOS build ships, but the shape is here so the paywall does
  // not have to grow a platform branch later.
  const ios = pkg.product.introPrice;
  if (ios && ios.price === 0 && ios.periodNumberOfUnits > 0) {
    const unit = toPeriodUnit(ios.periodUnit);
    if (unit) return { unit, value: ios.periodNumberOfUnits };
  }

  return null;
}

function toPeriodUnit(raw: string): TrialPeriodUnit | null {
  switch (raw.toUpperCase()) {
    case 'DAY':
      return PERIOD_UNIT.DAY;
    case 'WEEK':
      return PERIOD_UNIT.WEEK;
    case 'MONTH':
      return PERIOD_UNIT.MONTH;
    case 'YEAR':
      return PERIOD_UNIT.YEAR;
    default:
      return null;
  }
}

/**
 * i18n key suffix for a trial period, e.g. `trial.period.DAY`.
 *
 * Turkish does not pluralise a noun after a numeral ("7 gün", not "7 günler"),
 * so one key per unit is correct here and no plural rule is needed. A language
 * that does pluralise gets it from i18next's own `_other` suffix on these keys.
 */
export function trialPeriodKey(offer: TrialOffer): `trial.period.${TrialPeriodUnit}` {
  return `trial.period.${offer.unit}`;
}

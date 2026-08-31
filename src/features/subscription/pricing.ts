import { PACKAGE_TYPE, type PurchasesPackage } from 'react-native-purchases';

/**
 * Order the paywall shows packages in. Anything RevenueCat returns that is not
 * one of these keeps its relative order and follows, so a package added in the
 * dashboard appears instead of silently vanishing from the screen.
 */
const DISPLAY_ORDER: PACKAGE_TYPE[] = [
  PACKAGE_TYPE.MONTHLY,
  PACKAGE_TYPE.ANNUAL,
  PACKAGE_TYPE.LIFETIME,
];

export function sortPackages(packages: readonly PurchasesPackage[]): PurchasesPackage[] {
  return [...packages].sort((a, b) => {
    const ai = DISPLAY_ORDER.indexOf(a.packageType);
    const bi = DISPLAY_ORDER.indexOf(b.packageType);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

/**
 * Monthly-equivalent price of a package, for comparing plans of different
 * lengths. RevenueCat computes `pricePerMonth` itself where it can; the annual
 * fallback is only used when the store did not supply one.
 */
function monthlyEquivalent(pkg: PurchasesPackage): number | null {
  const { pricePerMonth, price } = pkg.product;
  if (typeof pricePerMonth === 'number' && pricePerMonth > 0) return pricePerMonth;
  if (pkg.packageType === PACKAGE_TYPE.ANNUAL && price > 0) return price / 12;
  if (pkg.packageType === PACKAGE_TYPE.MONTHLY && price > 0) return price;
  return null;
}

/**
 * Whole-percent saving of `candidate` against the monthly plan, or null when
 * the claim cannot be made honestly.
 *
 * Returns null rather than 0 for a non-saving, so the caller renders nothing
 * instead of "%0 tasarruf". Cross-currency comparison is refused outright: the
 * two prices would be numerically comparable and semantically meaningless.
 * This is a price claim shown to a user before they pay, so every branch that
 * cannot be proven returns null.
 */
export function annualSavingPercent(
  candidate: PurchasesPackage,
  monthly: PurchasesPackage | undefined,
): number | null {
  if (!monthly || candidate.identifier === monthly.identifier) return null;
  if (candidate.product.currencyCode !== monthly.product.currencyCode) return null;

  const candidateMonthly = monthlyEquivalent(candidate);
  const baseline = monthlyEquivalent(monthly);
  if (candidateMonthly === null || baseline === null || baseline <= 0) return null;

  const percent = Math.round((1 - candidateMonthly / baseline) * 100);
  return percent > 0 && percent < 100 ? percent : null;
}

/** The package a first-time visitor lands on: the best real saving, else the first. */
export function defaultSelection(packages: readonly PurchasesPackage[]): PurchasesPackage | null {
  if (packages.length === 0) return null;
  const monthly = packages.find((p) => p.packageType === PACKAGE_TYPE.MONTHLY);

  let best = packages[0];
  let bestSaving = -1;
  for (const pkg of packages) {
    const saving = annualSavingPercent(pkg, monthly) ?? -1;
    if (saving > bestSaving) {
      bestSaving = saving;
      best = pkg;
    }
  }
  return best;
}

import { describe, expect, test } from 'bun:test';
import { PACKAGE_TYPE, type PurchasesPackage } from 'react-native-purchases';

import { annualSavingPercent, defaultSelection, sortPackages } from '../pricing';

function pkg(
  identifier: string,
  packageType: PACKAGE_TYPE,
  price: number,
  {
    pricePerMonth = null,
    currencyCode = 'TRY',
  }: { pricePerMonth?: number | null; currencyCode?: string } = {},
): PurchasesPackage {
  return {
    identifier,
    packageType,
    offeringIdentifier: 'default',
    product: { price, pricePerMonth, currencyCode, priceString: `${price} ${currencyCode}` },
  } as unknown as PurchasesPackage;
}

const monthly = pkg('$rc_monthly', PACKAGE_TYPE.MONTHLY, 100);
const annual = pkg('$rc_annual', PACKAGE_TYPE.ANNUAL, 900);

describe('sortPackages', () => {
  test('puts monthly, annual, lifetime in display order', () => {
    const lifetime = pkg('$rc_lifetime', PACKAGE_TYPE.LIFETIME, 2000);
    const sorted = sortPackages([lifetime, annual, monthly]);
    expect(sorted.map((p) => p.packageType)).toEqual([
      PACKAGE_TYPE.MONTHLY,
      PACKAGE_TYPE.ANNUAL,
      PACKAGE_TYPE.LIFETIME,
    ]);
  });

  test('keeps an unknown package rather than dropping it', () => {
    const custom = pkg('promo', PACKAGE_TYPE.CUSTOM, 50);
    const sorted = sortPackages([custom, monthly]);
    expect(sorted).toHaveLength(2);
    expect(sorted[sorted.length - 1].identifier).toBe('promo');
  });
});

describe('annualSavingPercent', () => {
  test('computes the saving against the monthly plan', () => {
    // 900/yr = 75/mo against 100/mo = 25% off.
    expect(annualSavingPercent(annual, monthly)).toBe(25);
  });

  test('prefers the store-supplied pricePerMonth over dividing by twelve', () => {
    const withStorePrice = pkg('$rc_annual', PACKAGE_TYPE.ANNUAL, 900, { pricePerMonth: 50 });
    expect(annualSavingPercent(withStorePrice, monthly)).toBe(50);
  });

  test('refuses to compare across currencies', () => {
    const usd = pkg('$rc_annual', PACKAGE_TYPE.ANNUAL, 30, { currencyCode: 'USD' });
    expect(annualSavingPercent(usd, monthly)).toBeNull();
  });

  test('returns null rather than zero when there is no saving', () => {
    const noSaving = pkg('$rc_annual', PACKAGE_TYPE.ANNUAL, 1200);
    expect(annualSavingPercent(noSaving, monthly)).toBeNull();
  });

  test('returns null when the annual plan costs more', () => {
    const worse = pkg('$rc_annual', PACKAGE_TYPE.ANNUAL, 1500);
    expect(annualSavingPercent(worse, monthly)).toBeNull();
  });

  test('makes no claim without a monthly plan to compare against', () => {
    expect(annualSavingPercent(annual, undefined)).toBeNull();
  });

  test('never claims a saving against itself', () => {
    expect(annualSavingPercent(monthly, monthly)).toBeNull();
  });

  test('survives a zero or missing price without dividing by zero', () => {
    const free = pkg('$rc_monthly', PACKAGE_TYPE.MONTHLY, 0);
    expect(annualSavingPercent(annual, free)).toBeNull();
    expect(Number.isNaN(annualSavingPercent(annual, free) as number)).toBe(false);
  });
});

describe('defaultSelection', () => {
  test('lands on the plan with the best real saving', () => {
    expect(defaultSelection([monthly, annual])?.identifier).toBe('$rc_annual');
  });

  test('falls back to the first package when nothing saves', () => {
    const flat = pkg('$rc_annual', PACKAGE_TYPE.ANNUAL, 1200);
    expect(defaultSelection([monthly, flat])?.identifier).toBe('$rc_monthly');
  });

  test('returns null for an empty offering', () => {
    expect(defaultSelection([])).toBeNull();
  });
});

describe('the prices actually configured in Play Console', () => {
  // Nothing in the app hardcodes a price - the paywall renders whatever
  // `product.priceString` the store returns. What it *does* compute is the
  // saving badge and the monthly-equivalent line, and those are claims made to
  // a user before they pay. These pin them to the real numbers.
  test('Türkiye: ₺89,99 monthly vs ₺899,99 annual reads as 17%', () => {
    const tryMonthly = pkg('$rc_monthly', PACKAGE_TYPE.MONTHLY, 89.99);
    const tryAnnual = pkg('$rc_annual', PACKAGE_TYPE.ANNUAL, 899.99, {
      pricePerMonth: 899.99 / 12,
    });
    expect(annualSavingPercent(tryAnnual, tryMonthly)).toBe(17);
    expect(defaultSelection([tryMonthly, tryAnnual])?.identifier).toBe('$rc_annual');
  });

  test('a euro monthly with no euro annual yet claims no saving at all', () => {
    // €4.99 is configured on the monthly base plan only. Until an annual price
    // exists in the same currency there is nothing to compare, and the badge
    // must stay off rather than compare across currencies.
    const eurMonthly = pkg('$rc_monthly', PACKAGE_TYPE.MONTHLY, 4.99, { currencyCode: 'EUR' });
    const tryAnnual = pkg('$rc_annual', PACKAGE_TYPE.ANNUAL, 899.99, { currencyCode: 'TRY' });
    expect(annualSavingPercent(tryAnnual, eurMonthly)).toBeNull();
  });
});

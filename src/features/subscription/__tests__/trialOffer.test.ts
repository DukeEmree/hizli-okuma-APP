import { describe, expect, test } from 'bun:test';
import { PERIOD_UNIT, type PurchasesPackage } from 'react-native-purchases';

import { trialOffer } from '../trialOffer';

/** An Android package whose eligible option carries a free phase. */
function androidPkg(
  freePhase: { micros: number; unit: string; value: number } | null,
): PurchasesPackage {
  return {
    identifier: '$rc_monthly',
    product: {
      priceString: '99,99 ₺',
      introPrice: null,
      defaultOption: freePhase
        ? {
            freePhase: {
              price: { amountMicros: freePhase.micros, formatted: '₺0.00', currencyCode: 'TRY' },
              billingPeriod: { unit: freePhase.unit, value: freePhase.value },
            },
          }
        : { freePhase: null },
    },
  } as unknown as PurchasesPackage;
}

function iosPkg(price: number, periodUnit: string, units: number): PurchasesPackage {
  return {
    identifier: '$rc_monthly',
    product: {
      priceString: '99,99 ₺',
      defaultOption: null,
      introPrice: { price, periodUnit, periodNumberOfUnits: units },
    },
  } as unknown as PurchasesPackage;
}

describe('trialOffer', () => {
  test('reads a seven-day Play trial', () => {
    expect(trialOffer(androidPkg({ micros: 0, unit: 'DAY', value: 7 }))).toEqual({
      unit: PERIOD_UNIT.DAY,
      value: 7,
    });
  });

  test('returns null when no trial is configured', () => {
    expect(trialOffer(androidPkg(null))).toBeNull();
  });

  test('an ineligible user has no free phase, so no trial is promised', () => {
    // Google omits the free phase from defaultOption once it has been used, so
    // this is the same code path as "never configured" - which is the point:
    // the screen can never offer a trial the purchase would refuse.
    const used = androidPkg(null);
    expect(trialOffer(used)).toBeNull();
  });

  test('refuses to call a discounted intro phase "free"', () => {
    expect(trialOffer(androidPkg({ micros: 4_990_000, unit: 'MONTH', value: 1 }))).toBeNull();
  });

  test('ignores a zero-length or unknown period', () => {
    expect(trialOffer(androidPkg({ micros: 0, unit: 'DAY', value: 0 }))).toBeNull();
    expect(trialOffer(androidPkg({ micros: 0, unit: 'UNKNOWN', value: 7 }))).toBeNull();
  });

  test('falls back to an iOS intro price of zero', () => {
    expect(trialOffer(iosPkg(0, 'WEEK', 2))).toEqual({ unit: PERIOD_UNIT.WEEK, value: 2 });
  });

  test('does not treat a paid iOS intro price as a trial', () => {
    expect(trialOffer(iosPkg(19.99, 'MONTH', 1))).toBeNull();
  });
});

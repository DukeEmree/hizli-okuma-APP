/**
 * One date/time convention for the whole app. Before this, the home screen's
 * recent-activity list used the bare `toLocaleDateString()` (device locale, so
 * `8/20/2026 6:47 PM` on an en-US emulator) while the card 500px above it
 * hardcoded `tr-TR` - two conventions on one screen.
 *
 * Turkish is the canonical language (PRODUCT.md), so the locale is fixed here
 * rather than following the device. When a second UI language ships, this is
 * the one place that has to learn about it.
 */
const LOCALE = 'tr-TR';

/** e.g. `20 Ağu` - for axis ends and compact ranges. */
export function formatShortDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(LOCALE, { day: '2-digit', month: 'short' });
}

/** e.g. `20 Ağu 18:47` - for history rows. */
export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  return `${formatShortDate(timestamp)} ${date.toLocaleTimeString(LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}
